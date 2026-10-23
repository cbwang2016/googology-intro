import type { Bi } from '../../i18n'

type S = Bi<string>

/* ------------------------------------------------------------------ */
/* Rayo staircase                                                      */
/* ------------------------------------------------------------------ */
export type Step = { n: string; at: number; tex: string; note: S; status: 'proved' | 'folklore' }

export const STAIRS: Step[] = [
  { n: '0', at: 0, tex: '\\mathrm{Rayo}(0)=\\cdots=\\mathrm{Rayo}(9)=0', note: { en: 'Every formula with at most 9 symbols is a tautology, a contradiction, or names nothing.', zh: '9 个符号以内的公式要么恒真、要么恒假、要么什么都没命名。' }, status: 'proved' },
  { n: '10', at: 10, tex: '\\mathrm{Rayo}(10)=\\cdots=\\mathrm{Rayo}(19)=1', note: { en: 'The 10-symbol formula (¬∃x₂(x₂∈x₁)) names 0, and nothing else is named below 20.', zh: '10 个符号的 (¬∃x₂(x₂∈x₁)) 命名了 0；20 个符号以内再也命名不了别的数。' }, status: 'proved' },
  { n: '30', at: 30, tex: '\\mathrm{Rayo}(30)\\ge 2', note: { en: 'A 30-symbol formula names 1 = {∅}.', zh: '一个 30 个符号的公式命名了 1 = {∅}。' }, status: 'proved' },
  { n: '56', at: 56, tex: '\\mathrm{Rayo}(56)\\ge 3', note: { en: 'A 56-symbol formula names 2 = {∅,{∅}}.', zh: '一个 56 个符号的公式命名了 2 = {∅,{∅}}。' }, status: 'proved' },
  { n: '88', at: 88, tex: '\\mathrm{Rayo}(88)\\ge 4', note: { en: 'An 88-symbol formula names 3.', zh: '一个 88 个符号的公式命名了 3。' }, status: 'proved' },
  { n: '34+20n', at: 134, tex: '\\mathrm{Rayo}(34+20n)>n', note: { en: 'A uniform recipe: every extra “link of a chain” costs 20 symbols. Linear — slow!', zh: '统一的配方：链条每多一环只多 20 个符号。线性增长——很慢！' }, status: 'folklore' },
  { n: '340', at: 340, tex: '\\mathrm{Rayo}(340)>65536', note: { en: 'Define V₅ (65536 elements) and say “x₁ is an ordinal in bijection with V₅”. 340 symbols.', zh: '定义出 V₅（有 65536 个元素），再说“x₁ 是与 V₅ 一一对应的序数”。共 340 个符号。' }, status: 'folklore' },
  { n: '260+20n', at: 400, tex: '\\mathrm{Rayo}(260+20n)>2\\uparrow\\uparrow n', note: { en: 'Replace V₅ by Vₙ₊₁: since |Vₙ₊₁| = 2↑↑n, each extra 20 symbols adds a whole layer to the tower.', zh: '把 V₅ 换成 Vₙ₊₁：因为 |Vₙ₊₁| = 2↑↑n，每多 20 个符号，塔就多一层。' }, status: 'folklore' },
  { n: '7339', at: 7339, tex: '\\mathrm{Rayo}(7339)>S(2^{65536}-1)', note: { en: 'Encode Turing machines in set theory and name the longest run of any halting machine with 2^65536 − 1 states.', zh: '在集合论里编码图灵机，命名“2^65536 − 1 个状态的停机图灵机最多能走多少步”。' }, status: 'folklore' },
  { n: '10¹⁰⁰', at: 1e100, tex: '\\mathrm{Rayo}(10^{100})', note: { en: 'Rayo’s number. Nobody can say anything sharper about it.', zh: 'Rayo 数。没有人能对它说出更精确的话。' }, status: 'folklore' },
]

/* ------------------------------------------------------------------ */
/* The whole journey: a zoomable ruler                                 */
/* ------------------------------------------------------------------ */
export type Mark = { tex: string; name: S; ch: string; example: S }
export type Segment = { title: S; ch: string; color: string; marks: Mark[] }

export const SEGMENTS: Segment[] = [
  {
    title: { en: 'Finite marks', zh: '有限刻度' },
    ch: '1–2',
    color: 'var(--gold)',
    marks: [
      { tex: '0', name: { en: 'counting: n+1', zh: '数数：n+1' }, ch: '1', example: { en: 'tally marks; the caveman’s “three”', zh: '划记；原始人的“三”' } },
      { tex: '1', name: { en: 'doubling: 2n', zh: '加倍：2n' }, ch: '2', example: { en: 'repeated addition', zh: '重复加法' } },
      { tex: '2', name: { en: 'exponentials: 2ⁿ, 10ⁿ', zh: '指数：2ⁿ、10ⁿ' }, ch: '1', example: { en: 'rice on the chessboard, 2⁶⁴ − 1', zh: '棋盘上的米粒，2⁶⁴ − 1' } },
      { tex: '3', name: { en: 'towers: 2↑↑n', zh: '指数塔：2↑↑n' }, ch: '1', example: { en: 'googolplex; the Jain JPA', zh: '古戈尔普勒克斯；耆那教的 JPA' } },
      { tex: 'm{+}1', name: { en: 'm arrows: n↑ᵐn', zh: 'm 个箭头：n↑ᵐn' }, ch: '2', example: { en: 'tritri = 3↑↑↑3', zh: 'tritri = 3↑↑↑3' } },
    ],
  },
  {
    title: { en: 'Through ω to ε₀', zh: '经过 ω 到 ε₀' },
    ch: '2–6',
    color: 'var(--cyan)',
    marks: [
      { tex: '\\omega', name: { en: 'diagonal of arrows: n↑ⁿn', zh: '箭头的对角化：n↑ⁿn' }, ch: '2', example: { en: 'f_ω(n) = f_n(n)', zh: 'f_ω(n) = f_n(n)' } },
      { tex: '\\omega{+}1', name: { en: 'Graham’s function', zh: 'Graham 函数' }, ch: '2, 4', example: { en: 'f_{ω+1}(64) > G(64)', zh: 'f_{ω+1}(64) > G(64)' } },
      { tex: '\\omega^\\omega', name: { en: 'linear arrays', zh: '线性数阵' }, ch: '5', example: { en: 'a base-ω odometer', zh: '以 ω 为进制的里程表' } },
      { tex: '\\varepsilon_0', name: { en: 'primitive sequences, Goodstein, hydra', zh: '初等序列、Goodstein、九头蛇' }, ch: '5–6', example: { en: 'G(4) = 3·2^402653211 − 3; PTO(PA) = ε₀', zh: 'G(4) = 3·2^402653211 − 3；PTO(PA) = ε₀' } },
    ],
  },
  {
    title: { en: 'Fixed points and collapsing', zh: '不动点与折叠' },
    ch: '7–8',
    color: 'var(--violet)',
    marks: [
      { tex: '\\Gamma_0', name: { en: 'Feferman–Schütte ordinal', zh: 'Feferman–Schütte 序数' }, ch: '7', example: { en: 'limit of predicativity; PTO(ATR₀)', zh: '直谓性的极限；PTO(ATR₀)' } },
      { tex: '\\text{SVO}', name: { en: 'small Veblen ordinal', zh: '小 Veblen 序数' }, ch: '7', example: { en: 'tree(n); TREE(n) sits just above', zh: 'tree(n)；TREE(n) 略高于它' } },
      { tex: '\\text{BHO}', name: { en: 'Bachmann–Howard ordinal', zh: 'Bachmann–Howard 序数' }, ch: '8', example: { en: 'ψ(ε_{Ω+1}); PTO(KP)', zh: 'ψ(ε_{Ω+1})；PTO(KP)' } },
      { tex: '\\text{BO}', name: { en: 'Buchholz’s ordinal', zh: 'Buchholz 序数' }, ch: '8', example: { en: 'Buchholz hydra; FGH and SGH catch up here', zh: 'Buchholz 九头蛇；FGH 与 SGH 在此追平' } },
    ],
  },
  {
    title: { en: 'Worms and reflection', zh: 'Worm 与反射' },
    ch: '9–10',
    color: 'var(--green)',
    marks: [
      { tex: '\\text{EBO}', name: { en: 'extended Buchholz ordinal', zh: '扩展 Buchholz 序数' }, ch: '8–9', example: { en: 'one rung of the BMS ladder beyond BO', zh: 'BMS 阶梯越过 BO 之后的一级' } },
      { tex: '\\psi(M)', name: { en: 'a Mahlo collapse (community notation)', zh: 'Mahlo 折叠（社区记号）' }, ch: '10', example: { en: 'reflection, read as a recipe for big countable ordinals', zh: '把“反射”当作构造大可数序数的配方' } },
      { tex: '\\text{SHO}', name: { en: 'small Hydra ordinal: limit of BMS', zh: '小 Hydra 序数：BMS 的极限' }, ch: '9', example: { en: 'Bashicu matrices; well-ordered (2022–23)', zh: 'Bashicu 矩阵；良序性已证（2022–23）' } },
    ],
  },
  {
    title: { en: 'The uncomputable', zh: '不可计算' },
    ch: '11–12',
    color: 'var(--orange)',
    marks: [
      { tex: '\\omega_1^{\\mathrm{CK}}', name: { en: 'Busy Beaver (label by convention)', zh: '忙碌海狸（约定的刻度）' }, ch: '11–12', example: { en: 'S(5) = 47,176,870; S(6) > 2↑↑↑5', zh: 'S(5) = 47,176,870；S(6) > 2↑↑↑5' } },
      { tex: '\\omega_2^{\\mathrm{CK}}', name: { en: 'Busy Beaver with a halting oracle', zh: '带停机神谕的忙碌海狸' }, ch: '12', example: { en: 'Σ₂(n): machines that may ask “does it halt?”', zh: 'Σ₂(n)：可以问“它停不停”的机器' } },
    ],
  },
  {
    title: { en: 'The undefinable', zh: '不可定义' },
    ch: '13',
    color: 'var(--pink)',
    marks: [
      { tex: '\\sigma', name: { en: 'Rayo’s function (countable, unknown)', zh: 'Rayo 函数（可数，具体未知）' }, ch: '13', example: { en: 'Rayo(7339) > S(2^65536 − 1)', zh: 'Rayo(7339) > S(2^65536 − 1)' } },
      { tex: '\\;?\\;', name: { en: 'Large Number Garden Number, DaVinci', zh: '大数花园数、DaVinci 数' }, ch: '13', example: { en: 'well-definedness not settled', zh: '良定义性尚无定论' } },
      { tex: '\\omega_1', name: { en: 'the horizon — never reached', zh: '地平线——永远到不了' }, ch: '3, 13', example: { en: 'the first uncountable ordinal', zh: '第一个不可数序数' } },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Open problems across the course                                     */
/* ------------------------------------------------------------------ */
export type Problem = { ch: number; area: 'numbers' | 'ordinals' | 'notations' | 'logic' | 'computation'; status: 'open' | 'conjecture'; title: S; body: S }

export const PROBLEMS: Problem[] = [
  {
    ch: 2, area: 'numbers', status: 'open',
    title: { en: 'Graham’s problem: the true N*', zh: 'Graham 问题：真正的 N*' },
    body: { en: 'The smallest dimension forcing a one-coloured planar K₄ in every 2-colouring of the hypercube’s edges lies between 13 and 2↑↑↑5. Where?', zh: '使超立方体边的任意二染色都出现单色共面 K₄ 的最小维数，在 13 与 2↑↑↑5 之间。到底是多少？' },
  },
  {
    ch: 4, area: 'ordinals', status: 'open',
    title: { en: 'What exactly is a “growth rate”?', zh: '“增长率”到底是什么？' },
    body: { en: 'There is no rigorous general definition of f ∼ α that matches intuition. All growth-rate analysis rests on informal foundations.', zh: '至今没有一个既严格又符合直觉的 f ∼ α 的一般定义。一切增长率分析都建立在不严格的基础上。' },
  },
  {
    ch: 5, area: 'notations', status: 'open',
    title: { en: 'How reliable are the analyses?', zh: '已有的分析有多可靠？' },
    body: { en: 'Notation analysis is largely pattern-finding (incomplete induction). Newer analyses often overturn older ones; nobody knows how many accepted results are wrong.', zh: '记号分析大多是“找规律”（不完全归纳）。新的分析经常推翻旧的；没有人知道目前公认的结果里有多少是错的。' },
  },
  {
    ch: 5, area: 'notations', status: 'open',
    title: { en: 'Proving strong notations well-founded', zh: '证明强记号的良序性' },
    body: { en: 'PrSS is easy, but many stronger notations remain undecided. Tools are missing, and there is a barrier of principle: a theory cannot prove well-founded a notation beyond its proof-theoretic ordinal.', zh: 'PrSS 很容易，但许多更强的记号的良序性仍悬而未决。既缺工具，又有原则性障碍：一个理论证明不了超过其证明论序数的记号是良序的。' },
  },
  {
    ch: 6, area: 'logic', status: 'open',
    title: { en: 'Does unprovable mean fast?', zh: '不可证就意味着增长快吗？' },
    body: { en: 'Goodstein and the hydra pair independence with ε₀-growth, but no general theorem forces an independent totality statement to produce fast growth.', zh: 'Goodstein 与九头蛇把独立性和 ε₀ 级增长联系在一起，但没有一般定理保证“独立的全定义性命题”一定带来快速增长。' },
  },
  {
    ch: 7, area: 'numbers', status: 'open',
    title: { en: 'SCG(2) versus TREE(3)', zh: 'SCG(2) 与 TREE(3) 谁大' },
    body: { en: 'Friedman’s subcubic graph numbers grow faster than TREE, yet nobody knows whether SCG(2) exceeds TREE(3). Their exact growth rates are also unknown.', zh: 'Friedman 的子三次图数比 TREE 长得快，可没有人知道 SCG(2) 是否大于 TREE(3)。它们的精确增长率也未知。' },
  },
  {
    ch: 7, area: 'numbers', status: 'open',
    title: { en: 'The true value of tree(3)', zh: 'tree(3) 的真值' },
    body: { en: 'tree(1) = 2 and tree(2) = 5, but for tree(3) only the lower bound 844,424,930,131,960 is known.', zh: 'tree(1) = 2，tree(2) = 5，而 tree(3) 只知道下界 844,424,930,131,960。' },
  },
  {
    ch: 7, area: 'logic', status: 'open',
    title: { en: 'Make “growth = PTO” rigorous for tree(n)', zh: '让 tree(n) 的“增长率 = PTO”严格化' },
    body: { en: 'The step “tree dominates every function ACA₀ + Π¹₂-BI proves total” is heuristic in the book; a rigorous argument is still wanted.', zh: '“tree 支配 ACA₀ + Π¹₂-BI 能证明全定义的每个函数”这一步在书中是启发式的，仍需严格的论证。' },
  },
  {
    ch: 8, area: 'ordinals', status: 'open',
    title: { en: 'A unified, rigorous OCF beyond EBO', zh: '越过 EBO 的统一而严格的折叠函数' },
    body: { en: 'Above ψ(Ω_{Ω_…}) “everyone uses different collapsing rules”. Making community OCFs rigorous and linking them to proof theory’s OCFs is open work.', zh: '在 ψ(Ω_{Ω_…}) 之上，“每个人用的折叠规则都不一样”。把社区的 OCF 严格化，并与证明论中的 OCF 接轨，仍是未完成的工作。' },
  },
  {
    ch: 8, area: 'ordinals', status: 'open',
    title: { en: 'Exact growth of the Buchholz hydra', zh: 'Buchholz 九头蛇的确切增长率' },
    body: { en: '“BH(n) grows like TFBO” follows the heuristic growth ≈ PTO and is not rigorously proved.', zh: '“BH(n) 的增长率约为 TFBO”来自“增长率 ≈ PTO”的启发式，并无严格证明。' },
  },
  {
    ch: 9, area: 'notations', status: 'open',
    title: { en: 'Complete analysis of BMS', zh: 'BMS 的完整分析' },
    body: { en: 'Bashicu matrices are proved well-ordered, but beyond a certain point lies a “chaotic region not yet fully analysed”.', zh: 'Bashicu 矩阵的良序性已被证明，但过了某个位置就是“尚未被完全解析的混沌区域”。' },
  },
  {
    ch: 9, area: 'notations', status: 'conjecture',
    title: { en: '“Lifting is useless”', zh: '“提升无用”猜想' },
    body: { en: 'Conjecture: the strength of BMS does not come from lifting, since 3-row BMS with a small twist catches up with 4 rows.', zh: '猜想：BMS 的强度并不来自“提升”，因为稍加修改的三行 BMS 就能追上四行。' },
  },
  {
    ch: 9, area: 'notations', status: 'open',
    title: { en: 'Is BMS the same as 0-Y?', zh: 'BMS 与 0-Y 等价吗？' },
    body: { en: 'The translation between Bashicu matrices and the 0-Y sequence works on every tested example, but nobody has proved it.', zh: 'Bashicu 矩阵与 0-Y 序列之间的翻译在所有测试例上都成立，但没有人证明过。' },
  },
  {
    ch: 9, area: 'notations', status: 'conjecture',
    title: { en: 'Does BMS reach PTO(Z₂)?', zh: 'BMS 能达到 PTO(Z₂) 吗？' },
    body: { en: 'Its well-ordering proof uses all the Σₙ-stable ordinals, so people guess BMS might reach second-order arithmetic. There is no reliable evidence either way.', zh: '它的良序证明用到了所有 Σₙ 稳定序数，因此有人猜它可能达到二阶算术的强度。目前正反两方面都没有可靠证据。' },
  },
  {
    ch: 9, area: 'notations', status: 'open',
    title: { en: 'Ideal α-Y, LHO, and beyond transfer', zh: '理想 α-Y、LHO 与“转移”之外' },
    body: { en: 'Nobody knows how the ideal α-Y or the Large Hydra Ordinal should even be defined; FOS and FFFZ have no stable definitions. What lies above transfer theory is unknown.', zh: '没有人知道理想的 α-Y、大 Hydra 序数该如何定义；FOS、FFFZ 也没有稳定的定义。转移理论之上有什么，无人知晓。' },
  },
  {
    ch: 10, area: 'ordinals', status: 'open',
    title: { en: 'Rigorous reflection and stability collapses', zh: '严格的反射折叠与稳定折叠' },
    body: { en: 'The community’s reflection notation is admittedly informal, and how to put stable ordinals into an OCF at all is unknown.', zh: '社区的反射折叠记号自认并不严格；而如何把稳定序数放进 OCF，至今毫无头绪。' },
  },
  {
    ch: 10, area: 'logic', status: 'open',
    title: { en: 'PTO(Z₃), …, PTO(ZFC)', zh: 'PTO(Z₃)、……、PTO(ZFC)' },
    body: { en: 'Ordinal analysis has reached second-order arithmetic Z₂ (= ψ_Ω(I_ω) per the book). Beyond it — third-order arithmetic, ZFC — the proof-theoretic ordinals are unknown.', zh: '序数分析目前的前沿是二阶算术 Z₂（书中给出 ψ_Ω(I_ω)）。再往上——三阶算术、ZFC——证明论序数完全未知。' },
  },
  {
    ch: 10, area: 'logic', status: 'open',
    title: { en: 'Laver tables without large cardinals', zh: '不用大基数的 Laver 表' },
    body: { en: 'The period p(n) of the n-th Laver table tends to infinity if a rank-into-rank cardinal (I3) exists. Can ZFC — or even PA — prove it alone?', zh: '若 I3 秩到秩基数存在，第 n 个 Laver 表的周期 p(n) 趋于无穷。只用 ZFC（甚至 PA）能证明吗？' },
  },
  {
    ch: 11, area: 'computation', status: 'open',
    title: { en: 'The physical Church–Turing thesis', zh: '物理版 Church–Turing 论题' },
    body: { en: 'Can any physical process compute something a Turing machine cannot? It is a thesis, not a theorem; so far there is no hope in sight of a hypercomputer.', zh: '有没有某个物理过程能算出图灵机算不出的东西？这是论题而非定理；目前看不到造出超计算机的希望。' },
  },
  {
    ch: 11, area: 'computation', status: 'open',
    title: { en: 'The Collatz conjecture', zh: 'Collatz 猜想' },
    body: { en: 'That every Collatz orbit reaches 1 says a certain program halts on every input — a Π₂ statement, still open. Collatz-like maps are exactly what blocks BB values.', zh: '“每条 Collatz 轨道都到达 1”等于说某个程序在每个输入上都停机——一个 Π₂ 命题，至今未解。Collatz 式映射正是确定 BB 值的拦路虎。' },
  },
  {
    ch: 12, area: 'computation', status: 'open',
    title: { en: 'BB(6) and the cryptids', zh: 'BB(6) 与“隐兽”' },
    body: { en: 'S(6) > 2↑↑↑5 is known, but about 663 six-state machines were still undecided in October 2026, among them cryptids like Antihydra that follow Collatz-like rules nobody can analyse.', zh: '已知 S(6) > 2↑↑↑5，但截至 2026 年 10 月仍有约 663 台六状态机器未判定，其中包括 Antihydra 这类遵循 Collatz 式规则、无人能分析的“隐兽”。' },
  },
  {
    ch: 12, area: 'logic', status: 'open',
    title: { en: 'Where does ZFC stop knowing BB?', zh: 'ZFC 从哪里开始不知道 BB？' },
    body: { en: 'BB(5) is proved, so the threshold N satisfies N ≥ 6. Wade’s 432-state machine (Aug 2025) was cut to 254 states (Mira & Ketchersid, 13 Oct 2026) and then 230 (Glazer, 19 Oct 2026): 6 ≤ N ≤ 230 as of October 2026. Aaronson conjectures N ≤ 20.', zh: 'BB(5) 已被证明，所以阈值 N ≥ 6。Wade 的 432 状态机（2025 年 8 月）先被压到 254 状态（Mira 与 Ketchersid，2026 年 10 月 13 日），再到 230 状态（Glazer，2026 年 10 月 19 日）：截至 2026 年 10 月，6 ≤ N ≤ 230。Aaronson 猜测 N ≤ 20。' },
  },
  {
    ch: 12, area: 'computation', status: 'conjecture',
    title: { en: 'Steps versus ones', zh: '步数与 1 的个数' },
    body: { en: 'The book conjectures roughly S(n) ≈ Σ(n)². Only much weaker relations, like S(n) < Σ(3n+6), are proved.', zh: '书中猜测大致有 S(n) ≈ Σ(n)²。目前只证明了弱得多的关系，例如 S(n) < Σ(3n+6)。' },
  },
  {
    ch: 13, area: 'ordinals', status: 'open',
    title: { en: 'Where is σ?', zh: 'σ 在哪里？' },
    body: { en: 'Rayo’s growth label σ should be a countable, non-recursive ordinal. There is no reliable estimate of it at all.', zh: 'Rayo 函数的增长刻度 σ 应当是一个可数的非递归序数，但目前对它没有任何可靠的估计。' },
  },
  {
    ch: 13, area: 'logic', status: 'open',
    title: { en: 'Is Rayo’s number well-defined?', zh: 'Rayo 数是良定义的吗？' },
    body: { en: 'It quantifies over “all of V”. Making that precise needs a metatheory; the book warns it may still not be well-defined, and even if it is, its strength may disappoint.', zh: '它要对“整个 V”量化，严格化需要一个元理论；书中提醒它可能仍不是良定义的，即使是，强度也可能不及预期。' },
  },
  {
    ch: 13, area: 'logic', status: 'open',
    title: { en: 'LNG and the DaVinci number', zh: '大数花园数与 DaVinci 数' },
    body: { en: 'The Large Number Garden Number is the only survivor among attempts to beat Rayo, and its well-definedness is unclear. The DaVinci number (2024) aims higher; whether it is well-defined is unknown.', zh: '大数花园数是挑战 Rayo 的尝试中唯一的幸存者，其良定义性尚不清楚；DaVinci 数（2024）野心更大，是否良定义也未知。' },
  },
  {
    ch: 13, area: 'logic', status: 'open',
    title: { en: 'Making googology rigorous', zh: '大数数学的严格化' },
    body: { en: 'The ultimate goal of serious googologists: precise definitions, proved well-orderings and proved comparisons — replacing today’s pattern-finding stopgap.', zh: '严肃的大数研究者的终极目标：精确的定义、已证明的良序性与已证明的比较——取代今天“找规律”的权宜之计。' },
  },
]

export const AREAS: { id: Problem['area']; name: S }[] = [
  { id: 'numbers', name: { en: 'numbers', zh: '具体的数' } },
  { id: 'ordinals', name: { en: 'ordinals', zh: '序数' } },
  { id: 'notations', name: { en: 'notations', zh: '记号' } },
  { id: 'logic', name: { en: 'logic', zh: '逻辑' } },
  { id: 'computation', name: { en: 'computation', zh: '计算' } },
]
