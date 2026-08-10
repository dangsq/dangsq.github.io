export type Publication = {
  title: string
  authors: string
  venue: string
  year: string
  abstract: string
  stamp?: string
}

export type Project = {
  title: string
  titleEn?: string
  team: string
  tags: string
  desc: string
  link?: string
}

export const profile = {
  name: 'Shengqi Dang',
  nameZh: '党圣奇',
  initials: 'sqd',
  role: 'PhD Candidate',
  roleZh: '博士生',
  tagline: 'researcher of human-centered generative models, graphics & visualization',
  taglineZh: '做以人为本的生成式模型、图形学与可视化研究',
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
  bio: `I'm a PhD candidate exploring where human-centered design meets generative AI — building tools that make creation feel more expressive, intuitive, and human. I love the messy intersection of technology, art, and human experience.`,
  bioZh: `我是党圣奇，一名博士生，探索以人为中心的设计与生成式 AI 的交汇——做让创作更具表达力、更直觉、更有人情味的工具。我着迷于技术、艺术与人类体验之间那片混沌又迷人的交界地带。`,
  personality: 'INFP · 依然相信跨学科的力量 · 咖啡因驱动',
  interests: ['HCI', 'Generative Models', 'Computer Vision', 'Graphics & Fab', 'Visualization', 'Creative Coding'],
  funFacts: ['做过的项目横跨论文、游戏、装置和可视化', '本科学数学，硕士转设计，现在读博搞 CS', '坚信好的研究应该既严谨又好玩'],
}

export const publications: Publication[] = [
  {
    title: 'EmotiCrafter: Text-to-Emotional-Image Generation based on Valence-Arousal Model',
    authors: 'Shengqi Dang, Yi He, Long Ling, Ziqing Qian, Nanxuan Zhao, Nan Cao',
    venue: 'ICCV',
    year: '2025',
    abstract: 'Text-to-image generation steered by emotion on the valence–arousal plane — making emotion a first-class control.',
    stamp: 'ICCV 2025',
  },
  {
    title: 'DensiCrafter: Physically-Constrained Generation and Fabrication of Self-Supporting Hollow Structures',
    authors: 'Shengqi Dang, Fu Chai, Jiaxin Li, Chao Yuan, Wei Ye, Nan Cao',
    venue: 'AAAI',
    year: '2026',
    abstract: 'Generating self-supporting hollow structures that are ready for physical fabrication.',
    stamp: 'AAAI 2026',
  },
  {
    title: 'FreeShell: A Context-Free 4D Printing Technique for Fabricating Complex 3D Triangle Mesh Shells',
    authors: 'Chao Yuan, Shengqi Dang, Xuejiao Ma, Nan Cao',
    venue: 'ACM TOG',
    year: '2026',
    abstract: 'A 4D printing technique for complex free-form 3D mesh shells, without support context.',
    stamp: 'TOG 2026',
  },
  {
    title: 'ChartBlender: An Interactive System for Authoring and Synchronizing Visualization Charts in Video',
    authors: 'Yi He, Yuqi Liu, Chenpu Li, Ruoyan Chen, Chuer Chen, Shengqi Dang, Nan Cao',
    venue: 'IEEE TVCG',
    year: '2026',
    abstract: 'Authoring and synchronizing charts that live inside video.',
    stamp: 'TVCG 2026',
  },
  {
    title: 'Personalizing Products with Stylized Head Portraits for Self-Expression',
    authors: 'Yang Shi, Yechun Peng, Shengqi Dang, Nanxuan Zhao, Nan Cao',
    venue: 'CHI',
    year: '2024',
    abstract: 'Stylized head portraits as a vehicle for self-expression in personalized products.',
    stamp: 'CHI 2024',
  },
  {
    title: 'MV-Crafter: An Intelligent System for Music-guided Video Generation',
    authors: 'Chuer Chen, Shengqi Dang, Yuqi Liu, Nanxuan Zhao, Yang Shi, Nan Cao',
    venue: 'ACM TiiS',
    year: '2025',
    abstract: 'An intelligent system that crafts music-guided videos.',
    stamp: 'TiiS 2025',
  },
  {
    title: 'Bring Clipart to Life',
    authors: 'Nanxuan Zhao, Shengqi Dang, Hexun Lin, Yang Shi, Nan Cao',
    venue: 'ICCV',
    year: '2023',
    abstract: 'Bringing static clipart to life with expressive, lively motion.',
    stamp: 'ICCV 2023',
  },
  {
    title: 'CogBlender: Towards Continuous Cognitive Intervention in Text-to-Image Generation',
    authors: 'Shengqi Dang, Jiaying Lei, Yi He, Ziqing Qian, Nan Cao',
    venue: 'arXiv',
    year: '2026',
    abstract: 'Continuous cognitive intervention for controllable text-to-image synthesis.',
    stamp: 'arXiv 2026',
  },
  {
    title: 'Funding the Frontier: Visualizing the Broad Impact of Science and Science Funding',
    authors: 'Yifang Wang, Yifan Qian, Xiaoyu Qi, Yian Yin, Shengqi Dang, Ziqing Qian, Benjamin F Jones, Nan Cao, Dashun Wang',
    venue: 'arXiv',
    year: '2025',
    abstract: 'Visualizing the broad impact of science and science funding.',
    stamp: 'arXiv 2025',
  },
]

export const projects: Project[] = [
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
