/** 站点内容数据 — SSR 直接序列化进 HTML，利于 SEO */

export const site = {
  name: '哈拉少',
  nameEn: 'HALASHAO',
  tagline: '把火花锻成形态',
  description:
    '哈拉少是原生自东北的专业设计工作室，主理人范德彪。品牌识别、产品体验、动态影像、空间叙事与内容系统。酷是壳，土是芯。',
  keywords:
    '哈拉少,设计工作室,范德彪,东北,品牌设计,产品体验,动态影像,土酷,新二,HALASHAO',
  email: 'hello@halashao.studio',
  principal: '范德彪',
  locale: 'zh-CN',
  origin: '东北',
}

export const navPrimary = [
  { to: '/', label: '首页' },
  { to: '/work', label: '作品' },
  { to: '/film', label: '片源' },
  { to: '/team', label: '团队' },
  { to: '/quotes', label: '语录' },
  { to: '/about', label: '关于' },
  { to: '/contact', label: '开干' },
] as const

export const navMore = [
  { to: '/services', label: '服务' },
  { to: '/process', label: '流程' },
  { to: '/stories', label: '叙事' },
  { to: '/lab', label: '实验室' },
  { to: '/system', label: '系统地图' },
] as const

/** Required cast for studio identity checks */
export const requiredRoster = [
  '范德彪',
  '新二',
  '雨姐',
  '老蒯',
  '小阿giao',
  '吴总',
  '马大帅',
] as const

/** Homepage major SSR sections (ids used in markup + tests) */
export const homeSectionIds = [
  'hero',
  'dual-tuku',
  'practice',
  'work-rail',
  'quotes',
  'team-strip',
  'system-modules',
  'clients',
  'cta',
] as const

export function rosterIsComplete(
  members: ReadonlyArray<{ name: string }>,
): boolean {
  return requiredRoster.every((name) => members.some((m) => m.name === name))
}

export function coreNavPaths(): string[] {
  return [
    ...navPrimary.map((n) => n.to),
    ...navMore.map((n) => n.to),
  ]
}

export const biaoQuotes = [
  { id: '01', text: '小树不倒我就不倒。', audio: '/media/biao-1.mp3' },
  { id: '02', text: '你就慢慢跟我处，处不好你自己找原因。', audio: '/media/biao-2.mp3' },
  { id: '03', text: '本市几场著名硬仗都是我主打的。', audio: '/media/biao-3.mp3' },
  { id: '04', text: '那长相就是证据。', audio: '/media/biao-4.mp3' },
  { id: '05', text: '欧了。', audio: '/media/biao-5.mp3' },
  { id: '06', text: '肉眼凡胎，量你也看不出来。', audio: '/media/biao-6.mp3' },
  { id: '07', text: '该出手时就出手。', audio: '/media/biao-7.mp3' },
  { id: '08', text: '论成败，人生豪迈——大不了从头再来。', audio: '/media/biao-8.mp3' },
  { id: '09', text: '少，是刃。模板单，免开尊口。', audio: '/media/biao-9.mp3' },
  { id: '10', text: '酷是壳，土是芯——叠在一起才是哈拉少。', audio: '/media/biao-10.mp3' },
  { id: '11', text: '不生产复印件。肉眼凡胎也能看出来。', audio: '/media/biao-11.mp3' },
  { id: '12', text: '先对齐刀口，再谈档期。欧了。', audio: '/media/biao-12.mp3' },
]

export const works = [
  {
    slug: 'rongguang',
    title: '熔光',
    tag: 'BRAND SYSTEM',
    blurb: '标识矩阵、色板、包装到屏幕。全触点像同一个人说话。',
    quote: '那长相就是证据。',
    image: '/media/work-brand.jpg',
    video: '/media/work-hover-1.mp4',
    category: 'brand',
  },
  {
    slug: 'mojie',
    title: '墨界',
    tag: 'PRODUCT UI',
    blurb: '暗色密度控制台。信息先站稳，再谈好看。组件库可延展。',
    quote: '你就慢慢跟我处。',
    image: '/media/work-product.jpg',
    video: '/media/work-hover-2.mp4',
    category: 'product',
  },
  {
    slug: 'maichong',
    title: '脉冲',
    tag: 'MOTION / FILM',
    blurb: '发布片与动效语言一套出。粒子是皮，节奏是骨。',
    quote: '小树不倒我就不倒。',
    image: '/media/work-motion.jpg',
    video: '/media/work-hover-3.mp4',
    category: 'motion',
  },
  {
    slug: 'yeshi',
    title: '野市',
    tag: 'BRAND / TOUCHPOINTS',
    blurb: '新消费零售触点：包装、店头短视频模板、会员界面语气统一。',
    quote: '欧了。',
    image: '/media/studio-space.jpg',
    video: '/media/clip-b.mp4',
    category: 'brand',
  },
  {
    slug: 'beijing',
    title: '北境',
    tag: 'BRAND · PRODUCT',
    blurb: '工具品牌升级：命名语气、官网关键页、发布节点同步。',
    quote: '本市著名硬仗。',
    image: '/media/studio-desk.jpg',
    video: '/media/clip-a.mp4',
    category: 'product',
  },
  {
    slug: 'guidao',
    title: '轨道叙事',
    tag: 'SPACE · MOTION',
    blurb: '展陈主视觉与概念装置片。未来叙事压成可走进展区。',
    quote: '少，是刃。',
    image: '/media/hero-still.jpg',
    video: '/media/hero-cinematic.mp4',
    category: 'space',
  },
]

export const team = [
  {
    name: '范德彪',
    role: '主理人 · 创意总监',
    chip: 'PRINCIPAL',
    bio: '负责工作室方向、关键提案与品味裁决。把东北硬气写进品牌系统与发布节点。',
    quote: '本市几场著名硬仗，都是我主打的。',
    image: '/media/team/fan-debiao.jpg',
    wide: true,
  },
  {
    name: '新二',
    role: '伙计 · 品牌与文化视觉',
    chip: 'BRAND',
    bio: '网感、地方语境与品牌语气拧成一条线。反差记忆点是他的主刀。',
    quote: '那长相就是证据。',
    image: '/media/team/xin-er.jpg',
  },
  {
    name: '雨姐',
    role: '伙计 · 产品体验',
    chip: 'PRODUCT',
    bio: '信息架构、界面与组件库。先路径，后装饰。',
    quote: '你就慢慢跟我处。',
    image: '/media/team/yu-jie.jpg',
  },
  {
    name: '老蒯',
    role: '伙计 · 制作与工艺',
    chip: 'CRAFT',
    bio: '把提案落成可生产文件。看起来对，交得出。',
    quote: '该出手时就出手。',
    image: '/media/team/lao-kuai.jpg',
  },
  {
    name: '小阿giao',
    role: '伙计 · 影像与现场',
    chip: 'MOTION',
    bio: '发布片、片头、竖屏短内容。节奏大于特效层数。',
    quote: '小树不倒我就不倒。',
    image: '/media/team/xiao-agiao.jpg',
  },
  {
    name: '吴总',
    role: '办公室主任',
    chip: 'OFFICE',
    bio: '档期、合同、协作节奏。混沌压成可执行周计划。',
    quote: '欧了——流程清楚，才谈硬仗。',
    image: '/media/team/wu-zong.jpg',
  },
  {
    name: '马大帅',
    role: '食堂主管',
    chip: 'HOSPITALITY',
    bio: '工作室能量补给。后勤稳了，刀口才稳。',
    quote: '先吃饱，再出刀。',
    image: '/media/team/ma-dashuai.jpg',
  },
]

export const services = [
  {
    tag: '01 · BRAND',
    title: '品牌识别',
    desc: '从定位语气到标识、色板、字体与触点规范。换个场景仍像同一个人。',
    items: ['策略与定位共创', '标识 / 字标系统', '视觉规范手册', '包装与物料延展', '地方风味 / 餐饮零售识别', '品牌官网关键页'],
  },
  {
    tag: '02 · PRODUCT',
    title: '产品体验',
    desc: '信息架构、界面、组件库与原型。复杂流程先压成路径，再谈质感。',
    items: ['调研与问题定义', 'IA / 用户路径', 'Web · App 界面', '设计系统 / Token', '后台与工具型界面', '可用性走查'],
  },
  {
    tag: '03 · MOTION',
    title: '动态影像',
    desc: '发布片、片头、界面动效语言。竖屏网感与电影画幅都能切。',
    items: ['品牌影片 / 发布片', 'UI 动效规范', '社媒短视频系统', '活动主视觉动态', '音频与字幕编排'],
  },
  {
    tag: '04 · SPACE',
    title: '空间与体验',
    desc: '线下触点、展陈、导视与沉浸叙事。把品牌延展到可走进去的场景。',
    items: ['空间导视与环境图形', '快闪 / 展陈主视觉', '体验动线与叙事脚本', '未来叙事与概念装置'],
  },
  {
    tag: '05 · CONTENT',
    title: '内容系统',
    desc: '为增长与文化传播建立可复制的内容语法。',
    items: ['内容视觉语言', '栏目与系列识别', '直播 / 活动包装', '跨平台适配规范'],
  },
  {
    tag: '06 · FULL CASE',
    title: '全案硬仗',
    desc: '品牌 + 产品 + 影像 + 空间同一战场。交付一套可延展系统。',
    items: ['联合策略工作坊', '统一视觉与动效语言', '上线节点多端同步', '交付后 30 天修订窗口'],
    featured: true,
  },
]

export const spectrum = [
  { lv: '01', title: '地方与零售', desc: '餐饮、作坊、市集与社区品牌识别', tone: 'tu' as const },
  { lv: '02', title: '消费品牌', desc: '包装、触点、视觉规范与延展', tone: 'tu' as const },
  { lv: '03', title: '产品体验', desc: '界面、路径、设计系统与上线', tone: 'mid' as const },
  { lv: '04', title: '动态影像', desc: '发布片、动效语言、电影画幅', tone: 'mid' as const },
  { lv: '05', title: '内容系统', desc: '社媒语法、栏目识别、活动包装', tone: 'ku' as const },
  { lv: '06', title: '空间与未来', desc: '导视、展陈、概念装置与叙事', tone: 'ku' as const },
]

export const modules = [
  { to: '/work', tag: 'WORK', title: '硬仗作品', desc: '品牌 · 产品 · 影像案例' },
  { to: '/film', tag: 'FILM', title: '片源放映厅', desc: '多轨视频 · 自定义播放' },
  { to: '/quotes', tag: 'QUOTES', title: '彪哥语录墙', desc: '硬话点击播放' },
  { to: '/team', tag: 'TEAM', title: '班底介绍', desc: '范德彪工作室全员' },
  { to: '/services', tag: 'SERVICES', title: '服务范围', desc: '六条刃 · 跨尺度' },
  { to: '/stories', tag: 'STORIES', title: '工作室叙事', desc: '滚动章节 · 土酷芯' },
  { to: '/lab', tag: 'LAB', title: '实验室入口', desc: '互动特效导航' },
  { to: '/system', tag: 'SYSTEM', title: '系统地图', desc: '全站模块一览' },
  { to: '/about', tag: 'ABOUT', title: '关于工作室', desc: '东北原生 · 专业交付' },
  { to: '/process', tag: 'PROCESS', title: '合作流程', desc: '四步出刃' },
  { to: '/contact', tag: 'CONTACT', title: '开干', desc: '有火花就来处' },
]

export const processSteps = [
  {
    n: '01 · 对齐',
    title: '把问题问到能动手',
    body: '启动会、材料清单、成功标准。写清「不做什么」。输出：项目简报、范围与排期、协作频道。',
    said: '你就慢慢跟我处。先处清楚刀口。',
  },
  {
    n: '02 · 锻造',
    title: '方向落地成可评方案',
    body: '多方向并行，快速收敛。关键节点同步，异步改稿。输出：主视觉方向、关键界面或分镜。',
    said: '那长相就是证据。方向要摆得上桌。',
  },
  {
    n: '03 · 淬火',
    title: '系统化与可生产',
    body: '规范、组件、动效参数、物料导出。保证延展不崩。',
    said: '少，是刃。删到站得住。',
  },
  {
    n: '04 · 上线',
    title: '交付、协同与修订',
    body: '上线 checklist、协作接口、修订窗口。打完能复盘。',
    said: '欧了。能上线才算数。',
  },
]

export const storyChapters = [
  {
    num: '01 / 起灶',
    title: '东北夜里先有灯',
    body: '哈拉少不是从「高级感」里长出来的。是冬夜灯牌、直白语气、能扛事的劲儿——原生自东北，主理人范德彪定调。',
    biao: '本市几场著名硬仗都是我主打的。',
    media: { type: 'img' as const, src: '/media/studio-space.jpg', alt: '工作室现场' },
  },
  {
    num: '02 / 土酷',
    title: '土是芯，酷是壳',
    body: '高饱和、红章、字幕条、人间烟火——这是新二气质的土壤。电影画幅、剪辑刀锋、系统交付——这是专业工作室的壳。',
    biao: '那长相就是证据。',
    media: { type: 'video' as const, src: '/media/hero-cinematic.mp4', poster: '/media/hero-still.jpg' },
  },
  {
    num: '03 / 班底',
    title: '人少，刃齐',
    body: '伙计新二、雨姐、老蒯、小阿giao 出刀；吴总统筹档期；马大帅托住后勤。不堆人头，堆质量。',
    biao: '你就慢慢跟我处。',
    media: { type: 'img' as const, src: '/media/team/fan-debiao.jpg', alt: '范德彪' },
  },
  {
    num: '04 / 出刀',
    title: '跨尺度硬仗',
    body: '地方风味与零售触点，消费品牌与产品界面，影像发布与空间叙事——尺度可变，交付标准不变。',
    biao: '少，是刃。',
    media: { type: 'video' as const, src: '/media/work-hover-3.mp4', poster: '/media/work-motion.jpg' },
  },
  {
    num: '05 / 开干',
    title: '小树不倒我就不倒',
    body: '论成败，人生豪迈。但我们更想一次锻对。有火花？把需求丢过来。',
    biao: '欧了。',
    media: null,
  },
]

export const filmClips = [
  { src: '/media/showreel.mp4', poster: '/media/showreel-poster.jpg', label: '主片源 · 旁白' },
  { src: '/media/hero-cinematic.mp4', poster: '/media/hero-still.jpg', label: '电影镜头' },
  { src: '/media/showreel-motion.mp4', poster: '/media/work-motion.jpg', label: '粒子漩涡' },
  { src: '/media/work-hover-1.mp4', poster: '/media/work-brand.jpg', label: '熔光 · 品牌' },
  { src: '/media/work-hover-2.mp4', poster: '/media/work-product.jpg', label: '墨界 · 产品' },
  { src: '/media/work-hover-3.mp4', poster: '/media/work-motion.jpg', label: '脉冲 · 动效' },
]

export const labLinks = [
  { href: '/quotes', tag: 'VOICE', title: '彪哥语录墙', desc: '硬话点击播放' },
  { href: '/film', tag: 'FILM', title: '片源放映厅', desc: '多轨视频系统' },
  { href: '/stories', tag: 'SCROLL', title: '滚动叙事', desc: '五章工作室故事' },
  { href: '/team', tag: 'CAST', title: '班底介绍', desc: '人物与职责' },
  { href: '/system', tag: 'MAP', title: '系统地图', desc: '全站模块' },
  { href: '/work', tag: 'WORK', title: '硬仗档案', desc: '案例与悬停影像' },
]

export const clients = [
  { name: '地方餐饮', note: '风味品牌 · 识别与包装' },
  { name: '野市零售', note: '新消费 · 触点与系统' },
  { name: '北境科技', note: '工具产品 · 界面与发布' },
  { name: '脉冲传媒', note: '内容品牌 · 影像与空间' },
]

export const creed = [
  { n: '01', title: '我们不生产模板', said: '模板是安全的。我们卖的是锋利。肉眼凡胎也能看出来什么是复印件。' },
  { n: '02', title: '酷是壳，土是芯', said: '电影画幅管纪律，东北直球管记忆。网感可以借，廉价摆拍免谈。' },
  { n: '03', title: '跨尺度出刀', said: '从地方风味到系统产品，再到未来叙事。尺度可变，质量标准不变。' },
  { n: '04', title: '少，是刃', said: '删到只剩必要，再删一次。花活堆满不等于高级。' },
  { n: '05', title: '小树不倒我就不倒', said: '论成败，人生豪迈；大不了从头再来。但我们更想一次锻对。' },
  { n: '06', title: '你就慢慢跟我处', said: '处不好你自己找原因。对齐刀口，再谈档期。本市著名硬仗，主理人范德彪主打。' },
]
