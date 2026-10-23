import type { Bi } from '../i18n'

// A chapter counts as built when src/chapters/chNN/ChapterNN.tsx exists.
const builtFiles = Object.keys(import.meta.glob('./ch*/Chapter*.tsx'))
const isBuilt = (num: number) => builtFiles.some((f) => f.endsWith(`/Chapter${String(num).padStart(2, '0')}.tsx`))

export type Act = { id: number; title: Bi<string>; blurb: Bi<string> }
export type ChapterMeta = {
  num: number
  slug: string
  act: number
  title: Bi<string>
  teaser: Bi<string>
  built: boolean
}

export const acts: Act[] = [
  { id: 1, title: { en: 'Act I · The Ladder of Notation', zh: '第一幕 · 数的阶梯' }, blurb: { en: 'From counting fingers to Graham’s number.', zh: '从掰手指到 Graham 数。' } },
  { id: 2, title: { en: 'Act II · Ordinals, the Ruler of Growth', zh: '第二幕 · 序数：增长之尺' }, blurb: { en: 'Counting past infinity to measure speed.', zh: '数过无穷，用来丈量增长的速度。' } },
  { id: 3, title: { en: 'Act III · Climbing the Recursive Ordinals', zh: '第三幕 · 攀登递归序数' }, blurb: { en: 'Fixed points, collapsing, and worms.', zh: '不动点、序数折叠与 Worm。' } },
  { id: 4, title: { en: 'Act IV · Above Recursion', zh: '第四幕 · 递归之上' }, blurb: { en: 'Logic, reflection, and large cardinals.', zh: '逻辑、反射与大基数。' } },
  { id: 5, title: { en: 'Act V · The Uncomputable and the Undefinable', zh: '第五幕 · 不可计算与不可定义' }, blurb: { en: 'Busy beavers, Rayo, and the horizon ω₁.', zh: '忙碌海狸、Rayo 数与 ω₁ 的地平线。' } },
]

const chapterList: Omit<ChapterMeta, 'built'>[] = [
  { num: 1, slug: 'counting-to-towers', act: 1,
    title: { en: 'From Counting to Towers', zh: '从数数到指数塔' },
    teaser: { en: 'Place value, ancient giants, exponents, and towers of tens.', zh: '数位、古人的大数、指数与指数塔。' } },
  { num: 2, slug: 'arrows-and-graham', act: 1,
    title: { en: 'Recursion, Arrows & Graham’s Number', zh: '递归、箭头与 Graham 数' },
    teaser: { en: 'Repeat the previous operation — then diagonalize.', zh: '重复上一种运算——然后对角化。' } },
  { num: 3, slug: 'ordinals', act: 2,
    title: { en: 'Ordinals', zh: '序数' },
    teaser: { en: 'What comes after all the natural numbers?', zh: '所有自然数之后是什么？' } },
  { num: 4, slug: 'fgh', act: 2,
    title: { en: 'Fundamental Sequences & the Fast-Growing Hierarchy', zh: '基本列与快速增长层次' },
    teaser: { en: 'A function for every ordinal.', zh: '每个序数对应一个函数。' } },
  { num: 5, slug: 'primitive-sequences', act: 2,
    title: { en: 'Primitive Sequences', zh: '初等序列' },
    teaser: { en: 'A tiny copying game that reaches ε₀.', zh: '一个复制游戏，竟能走到 ε₀。' } },
  { num: 6, slug: 'epsilon0-in-the-wild', act: 2,
    title: { en: 'ε₀ in the Wild', zh: '野外的 ε₀' },
    teaser: { en: 'Goodstein, the hydra, and truths arithmetic cannot prove.', zh: 'Goodstein、九头蛇，以及算术证明不了的真理。' } },
  { num: 7, slug: 'veblen-and-tree', act: 3,
    title: { en: 'Fixed Points, Veblen & TREE(3)', zh: '不动点、Veblen 与 TREE(3)' },
    teaser: { en: 'ε, ζ, η, Γ₀, the small Veblen ordinal, and Kruskal’s trees.', zh: 'ε、ζ、η、Γ₀、小 Veblen 序数与 Kruskal 树。' } },
  { num: 8, slug: 'collapsing', act: 3,
    title: { en: 'Collapsing: from Ω to Buchholz', zh: '序数折叠：从 Ω 到 Buchholz' },
    teaser: { en: 'Borrow an unreachable ordinal, then fold it back down.', zh: '借来一个够不着的序数，再把它折回来。' } },
  { num: 9, slug: 'bashicu-matrix', act: 3,
    title: { en: 'Worms: the Bashicu Matrix System', zh: 'Worm：Bashicu 矩阵' },
    teaser: { en: 'The strongest well-understood recursive notation.', zh: '目前最强的成熟递归记号。' } },
  { num: 10, slug: 'reflection-and-large-cardinals', act: 4,
    title: { en: 'Logic, Reflection & Large Cardinals', zh: '逻辑、反射与大基数' },
    teaser: { en: 'Admissible, inaccessible, Mahlo — and Laver tables.', zh: '容许、不可达、Mahlo——以及 Laver 表。' } },
  { num: 11, slug: 'turing-and-halting', act: 5,
    title: { en: 'Turing Machines & the Halting Problem', zh: '图灵机与停机问题' },
    teaser: { en: 'What computers can never decide.', zh: '计算机永远无法判定的事。' } },
  { num: 12, slug: 'busy-beaver', act: 5,
    title: { en: 'Busy Beaver', zh: '忙碌海狸' },
    teaser: { en: 'Outgrowing every computable function.', zh: '超越一切可计算函数。' } },
  { num: 13, slug: 'rayo-and-horizon', act: 5,
    title: { en: 'Rayo, the Undefinable & the ω₁ Horizon', zh: 'Rayo、不可定义数与 ω₁ 的地平线' },
    teaser: { en: 'Naming numbers with logic itself — and why the climb never ends.', zh: '用逻辑本身来命名数——以及为什么攀登永无止境。' } },
]

/**
 * Landmarks on the "ruler of growth": each notation is placed by its growth rate
 * (labels are introduced informally in Ch.2 and rigorously via FGH in Ch.4).
 */
export type Landmark = { tex: string; name: Bi<string>; chapter: number }
export const chapters: ChapterMeta[] = chapterList.map((c) => ({ ...c, built: isBuilt(c.num) }))

export const landmarks: Landmark[] = [
  { tex: '0', name: { en: 'counting one by one: n+1', zh: '一个一个数：n+1' }, chapter: 1 },
  { tex: '1', name: { en: 'doubling: 2n', zh: '加倍：2n' }, chapter: 2 },
  { tex: '2', name: { en: 'place value / exponentials: 10ⁿ', zh: '位值制 / 指数：10ⁿ' }, chapter: 1 },
  { tex: '3', name: { en: 'towers of tens', zh: '指数塔' }, chapter: 1 },
  { tex: 'm{+}1', name: { en: 'm arrows: n↑ᵐn', zh: 'm 个箭头：n↑ᵐn' }, chapter: 2 },
  { tex: '\\omega', name: { en: 'diagonal of arrows: n↑ⁿn', zh: '箭头的对角化：n↑ⁿn' }, chapter: 2 },
  { tex: '\\omega{+}1', name: { en: 'Graham’s function', zh: 'Graham 函数' }, chapter: 2 },
  { tex: '\\omega^\\omega', name: { en: 'linear arrays', zh: '线性数阵' }, chapter: 5 },
  { tex: '\\varepsilon_0', name: { en: 'primitive sequences, Goodstein, hydra', zh: '初等序列、Goodstein、九头蛇' }, chapter: 5 },
  { tex: '\\Gamma_0', name: { en: 'Feferman–Schütte ordinal', zh: 'Feferman–Schütte 序数' }, chapter: 7 },
  { tex: '\\text{SVO}', name: { en: 'small Veblen ordinal, tree(n)', zh: '小 Veblen 序数、tree(n)' }, chapter: 7 },
  { tex: '\\text{BHO}', name: { en: 'Bachmann–Howard ordinal', zh: 'Bachmann–Howard 序数' }, chapter: 8 },
  { tex: '\\text{BO}', name: { en: 'Buchholz’s ordinal, Π¹₁-CA₀', zh: 'Buchholz 序数、Π¹₁-CA₀' }, chapter: 8 },
  { tex: '\\text{SHO}', name: { en: 'limit of Bashicu matrices', zh: 'Bashicu 矩阵的极限' }, chapter: 9 },
  { tex: '\\omega_1^{\\mathrm{CK}}', name: { en: 'Busy Beaver (beyond all computable)', zh: '忙碌海狸（超越一切可计算）' }, chapter: 12 },
  { tex: '\\sigma', name: { en: 'Rayo’s function (countable, unknown)', zh: 'Rayo 函数（可数，未知）' }, chapter: 13 },
  { tex: '\\omega_1', name: { en: 'the horizon — never reached', zh: '地平线——永远到不了' }, chapter: 13 },
]

export const chapterBySlug = (slug: string) => chapters.find((c) => c.slug === slug)
