export type Publication = {
  title: string
  authors: string
  venue: string
  year: string
  abstract: string
  stamp?: string
  url?: string
  citationCount?: number | null
}

export type Project = {
  title: string
  titleEn?: string
  team?: string
  tags: string
  desc: string
  link?: string
}

export const profile = {
  name: 'Shengqi Dang',
  nameZh: '党圣奇',
  initials: 'sqd',
  role: 'PhD researcher · amateur artist',
  roleZh: '博士研究者 · 业余艺术家',
  tagline: 'research / art / play',
  taglineZh: '研究 / 艺术 / 游戏',
  affiliations: [
    'Shanghai Innovation Institute · 上海创智学院 (2025.09 →)',
    'Tongji University · 同济大学 (2025.03 →)',
  ],
  email: 'dangsq123@163.com',
  education: [
    { period: '2025.09 →', text: 'PhD, Shanghai Innovation Institute & Tongji University' },
    { period: '2023.09 – 2025.01', text: 'M.Eng, AI & Data Design, Tongji University, College of Design & Innovation' },
    { period: '2019.09 – 2023.06', text: 'B.S., Mathematics, Tongji University' },
  ],
  bio: 'Mathematics, design, computing. Papers, games, installations, and images.',
  bioZh: '数学、设计、计算机。论文、游戏、装置与图像。',
  personality: 'INFP · 依然相信跨学科的力量 · 咖啡因驱动',
  personalityEn: 'INFP · still believes in crossing disciplines · powered by caffeine',
  interests: ['Visual Art', 'Creative Coding', 'Games', 'HCI', 'Generative Models', 'Visualization'],
  funFacts: ['做过的项目横跨论文、游戏、装置和可视化', '本科学数学，硕士转设计，现在读博搞 CS', '喜欢严谨地胡思乱想，也喜欢把想法做成能玩的东西'],
  funFactsEn: [
    'My projects have crossed papers, games, installations, and visualization.',
    'I studied mathematics, moved into design, and now do a PhD in computer science.',
    'I like thinking carefully about strange ideas, then making them into things people can play with.',
  ],
}

/* ────────────────────────────────────────────────
   论文数据自动同步：scripts/fetch-papers.mjs 在构建前
   从 DBLP（元数据）+ Semantic Scholar（摘要/引用数）拉取，
   生成 publications.json。下面的 overrides 是手工覆盖层：
   主页偏好的短摘要、备注等，不会被子代拉取覆盖。
   ──────────────────────────────────────────────── */
import papersJson from './publications.json'

const normTitle = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

const overrides: Record<string, Partial<Publication>> = {
  emoticraftertexttoemotionalimagegenerationbasedonvalencearousalmodel: {
    abstract: 'Text-to-image generation steered by emotion on the valence–arousal plane — making emotion a first-class control.',
  },
  densicrafterphysicallyconstrainedgenerationandfabricationofselfsupportinghollowstructures: {
    abstract: 'Generating self-supporting hollow structures that are ready for physical fabrication.',
  },
  freeshellacontextfree4dprintingtechniqueforfabricatingcomplex3dtrianglemeshshells: {
    abstract: 'A 4D printing technique for complex free-form 3D mesh shells, without support context.',
  },
  chartblenderaninteractivesystemforauthoringandsynchronizingvisualizationchartsinvideo: {
    abstract: 'Authoring and synchronizing charts that live inside video.',
  },
  personalizingproductswithstylizedheadportraitsforselfexpression: {
    abstract: 'Stylized head portraits as a vehicle for self-expression in personalized products.',
  },
  mvcrafteranintelligentsystemformusicguidedvideogeneration: {
    abstract: 'An intelligent system that crafts music-guided videos.',
  },
  bringcliparttolife: {
    abstract: 'Bringing static clipart to life with expressive, lively motion.',
  },
  cogblendertowardscontinuouscognitiveinterventionintexttoimagegeneration: {
    abstract: 'Continuous cognitive intervention for controllable text-to-image synthesis.',
  },
  fundingthefrontiervisualizingthebroadimpactofscienceandsciencefunding: {
    abstract: 'Visualizing the broad impact of science and science funding.',
  },
}

export const publications: Publication[] = papersJson.papers.map((p) => {
  const ov = overrides[normTitle(p.title)] ?? {}
  return {
    title: p.title,
    authors: p.authors.join(', '),
    venue: p.venue,
    year: String(p.year),
    abstract: ov.abstract ?? p.abstract ?? '',
    stamp: p.stamp,
    url: p.url ?? undefined,
    citationCount: p.citationCount,
  }
})

/* 同步元数据：面板上展示「自动同步」徽标 */
export const papersMeta = {
  fetchedAt: papersJson.fetchedAt,
  sources: papersJson.sources as string[],
}

export const projects: Project[] = [
  {
    title: 'N+1 位艺术家',
    titleEn: 'N+1 Artists',
    tags: 'AI Art · Hackathon',
    desc: 'AI 艺术黑客松作品。',
    link: 'https://mp.weixin.qq.com/s/af5gduL7G9-ABfNFopRZQw',
  },
  {
    title: '怪诞花园',
    titleEn: 'Fantastical Garden',
    tags: 'Tripothon · Game · Interactive Art',
    desc: '音乐与几何、黑白绘画、黏土与糖果，三种创作方式生长为三个可游玩的花园。在漫游、触碰与聆听中，重新想象花园的形状，也发现自己的创造力。',
    link: 'https://developers.tripo3d.ai/zh/events/tripothon-s1/gallery',
  },
  {
    title: 'LLM 长短期记忆存储及任务规划',
    titleEn: 'LLM Memory & Task Planning',
    team: 'Xuechen Li, Yuqi Liu, Shengqi Dang',
    tags: 'Agents · LLM · Interaction Design',
    desc: '让人参与到 LLM 的记忆管理中，用工作流整理与规划模型记忆，实现更高效的任务规划。',
  },
  {
    title: '文字洪流 TORRENT OF WORDS',
    team: 'Hao Ni, Yi He, Shengqi Dang',
    tags: 'Visual Art · Particle/Fluid Sim · Unity',
    desc: '一个多端交互程序，让观众沉浸于生成式 AI 文字的洪流，探索人与语言的新关系。',
  },
  {
    title: 'radical run run run',
    team: 'Hao Ni, Jingxin Ye, Shengqi Dang',
    tags: 'Game Design · Algorithm · Traditional Culture',
    desc: '一款帮助外国人在碎片时间轻松学汉字的游戏，把学习和玩耍揉在一起。',
  },
  {
    title: 'How Stable Diffusion Imagines Images',
    titleEn: '一段数据可视化之旅',
    team: 'Hao Ni, Shengqi Dang',
    tags: 'Information Design · Visualization · Generative',
    desc: '拆解并可视化 Stable Diffusion 的想象过程。',
    link: 'https://sd-vis.ioclab.app',
  },
  {
    title: 'Picme 个性化内容定制系统',
    titleEn: 'Picme',
    team: 'Yechun Peng, Shengqi Dang, Yang Shi, Nan Cao, Nanxuan Zhao',
    tags: 'Content Customization · Cartoon Avatar',
    desc: '用深度学习把头像照片转成卡通头像，并应用到个性化内容定制。',
  },
]
