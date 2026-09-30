/* 自动拉取论文数据：DBLP（元数据权威）+ Semantic Scholar（摘要/引用数）
 * - DBLP：按 author pid 精确过滤，杜绝同名混入
 * - S2：按 authorId 拉摘要，按归一化标题合并
 * - 去重：arXiv(CoRR) 预印本与正式版并存时，保留正式版（摘要优先用 S2）
 * - 失败安全：任一数据源挂掉时保留现有 JSON，构建不会因网络中断
 * 运行：node scripts/fetch-papers.mjs （npm run build 前自动执行）
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'publications.json')

const DBLP_PID = '366/2909' // Shengqi Dang
const S2_AUTHOR_ID = '2279712768'

/* 归一化标题作为去重键 */
const normTitle = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/[:.\-–]/g, '')

/* 已知 venue → 标准简称；未知名称保持原样，避免凭首字母造出错误简称 */
function stampOf(venue, year, url) {
  const v = (venue || '').trim()
  const knownVenues = [
    ['arXiv', /\b(?:corr|arxiv)\b/i],
    ['TOG', /\b(?:tog|trans(?:actions)?\.?\s+(?:on\s+)?graph(?:ics)?\.?)\b/i],
    ['TVCG', /\b(?:tvcg|trans(?:actions)?\.?\s+(?:on\s+)?vis(?:ualization)?\.?\s+(?:and\s+)?comput(?:er)?\.?\s+graph(?:ics)?\.?)\b/i],
    ['TiiS', /\b(?:tiis|trans(?:actions)?\.?\s+(?:on\s+)?interact(?:ive)?\.?\s+intell(?:igent)?\.?\s+syst(?:ems)?\.?)\b/i],
    ['ICCV', /\b(?:iccv|international conference (?:on |of )?computer vision)\b/i],
    ['AAAI', /\b(?:aaai|aaai conference on artificial intelligence)\b/i],
    ['CHI', /\b(?:chi|(?:acm )?(?:international )?conference on human factors in computing systems)\b/i],
    ['CVPR', /\b(?:cvpr|conference on computer vision and pattern recognition)\b/i],
    ['SIGGRAPH', /\bsiggraph\b/i],
    ['EuroVis', /\beurovis\b/i],
    ['PacificVis', /\bpacificvis\b|pacific visualization/i],
    ['VAST', /\bvast\b|visual analytics science and technology/i],
  ]
  for (const [shortName, pattern] of knownVenues) {
    if (pattern.test(v)) return `${shortName} ${year}`
  }
  // 无 venue：有 arXiv 链接 → arXiv，否则 Preprint
  if (!v) return url?.includes('arxiv.org') ? `arXiv ${year}` : `Preprint ${year}`
  return `${v} ${year}`
}

async function fetchJson(url, label, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'dangsq.github.io publications sync' } })
      if (!res.ok) throw new Error(`${label} HTTP ${res.status}`)
      return res.json()
    } catch (e) {
      if (i === tries) throw e
      const wait = i * 4000
      console.warn(`[papers] ${label} 第 ${i} 次失败（${e.message}），${wait / 1000}s 后重试`)
      await new Promise(r => setTimeout(r, wait))
    }
  }
}

/* ── DBLP：按作者精确检索 ── */
async function fetchDBLP() {
  // author: 前缀检索保证只命中该 pid 的论文（h=100 足够）
  const url = `https://dblp.org/search/publ/api?q=author%3AShengqi_Dang%3A&format=json&h=100`
  const data = await fetchJson(url, 'DBLP')
  const hits = data?.result?.hits?.hit ?? []
  return hits.map(h => {
    const info = h.info
    const authorsRaw = info.authors?.author ?? []
    return {
      title: String(info.title || '').replace(/\.$/, ''),
      authors: (Array.isArray(authorsRaw) ? authorsRaw : [authorsRaw]).map(a => a.text),
      venue: info.venue || '',
      year: Number(info.year) || 0,
      doi: info.doi || null,
      url: info.ee || null,
      type: info.type || '', // Journal Articles / Conference and Workshop Papers / Informal and Other Publications
      key: info.key || '',
      _norm: normTitle(info.title || ''),
    }
  })
}

/* ── Semantic Scholar：摘要 + 引用数 ── */
async function fetchS2() {
  const fields = 'title,abstract,year,venue,externalIds,citationCount,authors'
  const url = `https://api.semanticscholar.org/graph/v1/author/${S2_AUTHOR_ID}/papers?fields=${fields}&limit=100`
  const data = await fetchJson(url, 'Semantic Scholar')
  return (data?.data ?? []).map(p => ({
    title: (p.title || '').replace(/\.$/, ''),
    abstract: p.abstract || null,
    year: p.year ?? 0,
    venue: p.venue || '',
    authors: (p.authors ?? []).map(a => a.name),
    citationCount: p.citationCount ?? 0,
    doi: p.externalIds?.DOI || null,
    arxiv: p.externalIds?.ArXiv || null,
    _norm: normTitle(p.title || ''),
  }))
}

/* 摘要截断：面板展示一行半足够，完整版给链接 */
const trimAbstract = (s) => {
  if (!s) return null
  const clean = s.replace(/\s+/g, ' ').trim()
  if (clean.length <= 220) return clean
  const cut = clean.slice(0, 220)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

async function main() {
  const sources = []
  let dblp = []
  let s2 = []

  try {
    dblp = await fetchDBLP()
    sources.push('DBLP')
    console.log(`[papers] DBLP: ${dblp.length} 条`)
  } catch (e) {
    console.warn(`[papers] DBLP 拉取失败（将只用已有数据/S2）: ${e.message}`)
  }

  try {
    s2 = await fetchS2()
    sources.push('Semantic Scholar')
    console.log(`[papers] Semantic Scholar: ${s2.length} 条`)
  } catch (e) {
    console.warn(`[papers] Semantic Scholar 拉取失败（摘要将缺失）: ${e.message}`)
  }

  if (!sources.length) {
    if (existsSync(OUT)) {
      console.warn('[papers] 两个数据源都失败，保留现有 publications.json')
      process.exit(0)
    }
    console.error('[papers] 无任何数据且无缓存 JSON，构建终止')
    process.exit(1)
  }

  const s2ByNorm = new Map(s2.map(p => [p._norm, p]))

  /* 以 DBLP 为主表；S2 独有（如未进 DBLP 的新 arXiv）补进来 */
  const merged = new Map()
  const isFormal = (p) => p.type && p.type !== 'Informal and Other Publications'

  for (const p of dblp) {
    const existing = merged.get(p._norm)
    // 正式版优先覆盖 arXiv 版
    if (!existing || (isFormal(p) && !isFormal(existing))) merged.set(p._norm, p)
  }
  for (const p of s2) {
    if (!merged.has(p._norm)) {
      merged.set(p._norm, {
        title: p.title, authors: p.authors, venue: p.venue, year: p.year,
        doi: p.doi, url: p.arxiv ? `https://arxiv.org/abs/${p.arxiv}` : null,
        type: '', key: '', _norm: p._norm,
      })
    }
  }

  /* 二次合并：预印本与正式版标题略有措辞差异（如 "a generative approach" vs "generative approaches"），
     精确键匹配不到。词集 Jaccard ≥ 0.6 的预印本并入正式版，并继承其 S2 摘要记录 */
  const STOP = new Set(['a', 'an', 'the', 'of', 'for', 'and', 'to', 'on', 'in', 'with', 'via', 'based', 'towards'])
  const wordSet = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)))
  const jaccard = (s1, s2) => {
    let inter = 0
    for (const w of s1) if (s2.has(w)) inter++
    return inter / (s1.size + s2.size - inter)
  }
  const formalList = [...merged.values()].filter(isFormal)
  for (const inf of [...merged.values()].filter(p => !isFormal(p))) {
    const formal = formalList.find(f => jaccard(wordSet(f.title), wordSet(inf.title)) >= 0.6)
    if (formal) {
      if (!s2ByNorm.has(formal._norm) && s2ByNorm.has(inf._norm)) {
        s2ByNorm.set(formal._norm, s2ByNorm.get(inf._norm))
      }
      merged.delete(inf._norm)
    }
  }

  const papers = [...merged.values()]
    .map(p => {
      const s2p = s2ByNorm.get(p._norm)
      const url = p.url || (s2p?.arxiv ? `https://arxiv.org/abs/${s2p.arxiv}` : s2p?.doi ? `https://doi.org/${s2p.doi}` : null)
      const year = p.year || s2p?.year || 0
      return {
        title: p.title,
        authors: p.authors?.length ? p.authors : (s2p?.authors ?? []),
        venue: p.venue || s2p?.venue || '',
        year,
        stamp: stampOf(p.venue || s2p?.venue || '', year, url),
        abstract: trimAbstract(s2p?.abstract),
        citationCount: s2p?.citationCount ?? null,
        url,
      }
    })
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))

  const out = {
    fetchedAt: new Date().toISOString(),
    sources,
    papers,
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  console.log(`[papers] 写入 ${papers.length} 篇 → src/data/publications.json`)
}

main().catch(e => {
  console.error(`[papers] 未预期错误: ${e}`)
  if (existsSync(OUT)) {
    console.warn('[papers] 保留现有 publications.json')
    process.exit(0)
  }
  process.exit(1)
})
