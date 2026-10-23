import type { Bi } from '../../i18n'

export type StatusTag = 'proved' | 'folklore' | 'convention' | 'open' | 'conjecture'

/* ------------------------------------------------------------------ */
/* The reflection / stability / projection staircase                   */
/* ------------------------------------------------------------------ */
export type Step = {
  tex: string
  name: Bi<string>
  expr?: string
  property: Bi<string>
  folds: Bi<string>
  landmark: { tex: string; name: string; bms?: string }
  status: StatusTag
  note: Bi<string>
}

export const STEPS: Step[] = [
  {
    tex: '\\Pi_1',
    name: { en: 'limit ordinals', zh: '极限序数' },
    expr: '1',
    property: {
      en: 'Π₁-reflecting = a limit ordinal (a theorem). Iterating “take limits” as (1−)^α re-walks ω^α, ε₀, Γ₀, … — every recursive ordinal, never beyond.',
      zh: 'Π₁ 反射 = 极限序数（定理）。把“取极限”迭代成 (1−)^α，会重走 ω^α、ε₀、Γ₀……——走遍所有递归序数，但永远出不去。',
    },
    folds: { en: 'nothing yet: this is the recursive world itself', zh: '还没有折叠什么：这就是递归世界本身' },
    landmark: { tex: '\\varepsilon_0,\\ \\Gamma_0,\\ \\ldots', name: 'PrSS, Veblen' },
    status: 'proved',
    note: { en: 'Book Thm 9.2.', zh: '书中定理 9.2。' },
  },
  {
    tex: '\\Omega=\\omega_1^{\\mathrm{CK}}',
    name: { en: 'admissible', zh: '容许序数' },
    expr: '2',
    property: {
      en: 'Π₂-reflecting = admissible (Richter–Aczel 1974). Ω is the least admissible ordinal above ω.',
      zh: 'Π₂ 反射 = 容许（Richter–Aczel 1974）。Ω 是 ω 之上最小的容许序数。',
    },
    folds: { en: 'every depth of limit-taking (1−)^α', zh: '任意深度的取极限 (1−)^α' },
    landmark: { tex: '\\mathrm{BHO}=\\psi(\\varepsilon_{\\Omega+1})', name: 'BHO', bms: '(0,0)(1,1)(2,2)' },
    status: 'proved',
    note: { en: 'The collapsing value is from Ch. 8 (Madore’s ψ).', zh: '折叠值来自第 8 章（Madore 的 ψ）。' },
  },
  {
    tex: '\\Omega_\\omega',
    name: { en: 'a limit of admissibles (not admissible!)', zh: '容许序数的极限（本身不容许！）' },
    expr: '1−2',
    property: {
      en: 'Ω, Ω₂, Ω₃, … climbs to Ω_ω by a perfectly recursive recipe, so Ω_ω is not admissible — like an irrational number reached by rationals.',
      zh: 'Ω, Ω₂, Ω₃, … 用一个完全递归的办法爬到 Ω_ω，所以 Ω_ω 不是容许的——就像用有理数逼近出来的无理数。',
    },
    folds: { en: 'nothing new: it is reached from below', zh: '没有新东西：它能从下面够到' },
    landmark: { tex: '\\mathrm{BO}=\\psi(\\Omega_\\omega)', name: 'BO', bms: '(0,0,0)(1,1,1)' },
    status: 'proved',
    note: { en: 'Values from Ch. 8; BMS from Ch. 9.', zh: '值见第 8 章；BMS 见第 9 章。' },
  },
  {
    tex: 'I',
    name: { en: 'recursively inaccessible', zh: '递归不可达' },
    expr: '2 1−2',
    property: {
      en: 'Admissible AND a limit of admissibles (⇔ L_I ⊨ KPi). Two properties that sound contradictory, yet such ordinals exist.',
      zh: '既容许、又是容许序数的极限（⇔ L_I ⊨ KPi）。两个听起来矛盾的性质，偏偏能同时成立。',
    },
    folds: { en: 'the whole map α ↦ Ω_α and all its fixed points', zh: '整个 α ↦ Ω_α 及其所有不动点' },
    landmark: { tex: '\\psi(I),\\ \\mathrm{JO}=\\psi(\\varepsilon_{I+1})', name: 'ψ(I)', bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(2,0,0)' },
    status: 'proved',
    note: { en: 'ψ(I) means different things in different ψ’s (book §9.6); here: the Ch. 8 style.', zh: '不同的 ψ 里 ψ(I) 的含义不同（书 §9.6）；这里用第 8 章的风格。' },
  },
  {
    tex: 'M',
    name: { en: 'recursively Mahlo', zh: '递归 Mahlo' },
    expr: '2−2',
    property: {
      en: 'Π₂-reflecting onto the admissibles (⇔ L_M ⊨ KPM): every Π₂ fact true at M is already true at some smaller admissible.',
      zh: '在容许序数上 Π₂ 反射（⇔ L_M ⊨ KPM）：在 M 处成立的每条 Π₂ 性质，早在某个更小的容许序数处就成立了。',
    },
    folds: { en: 'every depth of “admissible points” (2 1−)^α — the whole I-function', zh: '任意深度的“容许点” (2 1−)^α——整个 I 函数' },
    landmark: { tex: '\\psi(M_\\omega)', name: 'ψ(M_ω)', bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)' },
    status: 'proved',
    note: { en: 'The defining property is rigorous; collapsing values above here are community estimates.', zh: '定义性质是严格的；从这里往上的折叠值属于社区估计。' },
  },
  {
    tex: 'N',
    name: { en: 'Π₂ onto Π₂ onto Π₂', zh: 'Π₂ 反射的再反射' },
    expr: '2−2−2',
    property: { en: 'Π₂-reflecting onto the recursively Mahlo ordinals.', zh: '在递归 Mahlo 序数上 Π₂ 反射。' },
    folds: { en: 'every depth of “Mahlo points” (2−2 1−)^α', zh: '任意深度的“Mahlo 点” (2−2 1−)^α' },
    landmark: { tex: '\\psi(N_\\omega)', name: 'ψ(N_ω)', bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)(3,1,1)' },
    status: 'folklore',
    note: { en: 'Book §9.8; notation varies between authors.', zh: '书 §9.8；各家记法不统一。' },
  },
  {
    tex: 'K',
    name: { en: 'Π₃-reflecting (recursively weakly compact)', zh: 'Π₃ 反射（递归弱紧致）' },
    expr: '3',
    property: { en: 'The least Π₃-reflecting ordinal (⇔ L_K ⊨ KPΠ₃).', zh: '最小的 Π₃ 反射序数（⇔ L_K ⊨ KPΠ₃）。' },
    folds: { en: 'every depth of Π₂-onto-Π₂: (2−)^α', zh: '任意深度的“Π₂ 反射到 Π₂ 上”：(2−)^α' },
    landmark: { tex: '\\mathrm{SKO}=\\psi(K_\\omega)', name: 'SKO', bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)' },
    status: 'folklore',
    note: { en: 'Rathjen (1994) gave a rigorous ordinal analysis at this level.', zh: 'Rathjen（1994）在这一层给出了严格的序数分析。' },
  },
  {
    tex: '\\Pi_\\omega',
    name: { en: 'all finite orders of reflection', zh: '所有有限阶反射' },
    expr: '4, 5, 6, …',
    property: {
      en: 'Π₄ folds (3−)^α, Π₅ folds (4−)^α, …; Πω is their limit (psd = sup, real = intersection).',
      zh: 'Π₄ 折叠 (3−)^α，Π₅ 折叠 (4−)^α，……；Πω 是它们的极限（psd 取上确界，real 取交集）。',
    },
    folds: { en: 'all finite-order reflection', zh: '一切有限阶反射' },
    landmark: { tex: '\\mathrm{SSO}=\\psi(\\Pi_\\omega)', name: 'SSO', bms: '(0,0,0)(1,1,1)(2,2,0)' },
    status: 'folklore',
    note: { en: 'Stegert (c. 2010) built the first rigorous Πω-reflection OCF; the name SSO comes from him.', zh: 'Stegert（约 2010）给出了第一个严格的 Πω 反射 OCF，SSO（小 Stegert 序数）因此得名。' },
  },
  {
    tex: '\\lambda\\alpha.(\\alpha{+}1)',
    name: { en: 'stability', zh: '稳定' },
    property: {
      en: 'α is (α+1)-stable: L_α ≺Σ₁ L_{α+1}. This already implies Πₙ-reflection for every n (= real.Πω). Then α·2, α^α, …, Ω_{α+1} as targets.',
      zh: 'α 是 (α+1)-稳定的：L_α ≺Σ₁ L_{α+1}。仅此一条就推出对所有 n 的 Πₙ 反射（= real.Πω）。再往上，稳定目标换成 α·2、α^α、……、Ω_{α+1}。',
    },
    folds: { en: 'the entire reflection ladder, then much more', zh: '整条反射之梯，然后远不止于此' },
    landmark: { tex: '\\mathrm{SDO}=\\psi(\\lambda\\alpha.\\Omega_{\\alpha+\\omega}{-}\\Pi_0)', name: 'SDO', bms: '(0,0,0)(1,1,1)(2,2,1)(3,0,0)' },
    status: 'folklore',
    note: {
      en: 'Stability itself is rigorous; the λα.f(α)−Πₙ notation has no strict definition (book Ch. 10).',
      zh: '稳定性本身是严格概念；但 λα.f(α)−Πₙ 记号没有严格定义（书第 10 章）。',
    },
  },
  {
    tex: '\\omega{-}\\pi{-}\\Pi_0',
    name: { en: 'stable chains', zh: '稳定链' },
    property: {
      en: 'α stabilizes to β, which stabilizes to γ, … : chains of every finite length, and their limit.',
      zh: 'α 稳定到 β，β 又稳定到 γ……：任意有限长的稳定链，以及它们的极限。',
    },
    folds: { en: 'all single-segment stability', zh: '一切单段稳定' },
    landmark: { tex: '\\mathrm{LRO}', name: 'LRO', bms: '(0,0,0)(1,1,1)(2,2,2)' },
    status: 'folklore',
    note: {
      en: '“We have no complete, reliable stability-collapsing function — only estimates of big nodes” (book §10.6).',
      zh: '“我们实际上没有完整可靠的稳定折叠函数，只有对大节点的估计和猜测”（书 §10.6）。',
    },
  },
  {
    tex: '\\omega{-}\\mathrm{proj.}',
    name: { en: 'projection', zh: '投影' },
    property: {
      en: 'Second-, third-, …, n-th-order projection ordinals; their limit.',
      zh: '二阶、三阶……n 阶投影序数，以及它们的极限。',
    },
    folds: { en: 'all stable chains, and much more', zh: '一切稳定链，以及更多' },
    landmark: { tex: '\\mathrm{TSSO}', name: 'TSSO', bms: '(0,0,0,0)(1,1,1,1)' },
    status: 'folklore',
    note: { en: 'No rigorous definition; used formally (book Ch. 11).', zh: '没有严格定义，只在形式上使用（书第 11 章）。' },
  },
  {
    tex: 'S',
    name: { en: 'upward projection', zh: '向上投影' },
    property: {
      en: '最菜萌新’s “upward projection” (S projects to ordinals of higher projection level than itself) — the mainstream notation at this height.',
      zh: '最菜萌新的“向上投影”（S 投影到投影阶比自己还高的序数上）——这一高度的主流记号。',
    },
    folds: { en: 'all finite-order projection', zh: '一切有限阶投影' },
    landmark: { tex: '\\mathrm{SHO}', name: 'SHO', bms: '(0,0,0,…)(1,1,1,…)' },
    status: 'folklore',
    note: { en: '“Not yet mature; no detailed definition” (book §11.4).', zh: '“尚不成熟，没有详细定义”（书 §11.4）。' },
  },
]

/* ------------------------------------------------------------------ */
/* Projection dictionary (book §11.1): ψ_α(argument) = reflection ordinal */
/* ------------------------------------------------------------------ */
export const DICTIONARY: { arg: string; val: string; name: Bi<string> }[] = [
  { arg: '\\alpha', val: '\\varepsilon_0', name: { en: 'just a recursive ordinal', zh: '还只是递归序数' } },
  { arg: '\\varepsilon_{\\alpha+1}', val: '\\mathrm{BHO}', name: { en: 'Bachmann–Howard', zh: 'Bachmann–Howard' } },
  { arg: '\\Omega^{+}', val: '\\Omega', name: { en: 'admissible', zh: '容许' } },
  { arg: '\\Omega^{+}\\cdot 2', val: '\\Omega_2', name: { en: 'next admissible', zh: '下一个容许' } },
  { arg: '(\\Omega^{+})^2', val: 'I', name: { en: 'recursively inaccessible', zh: '递归不可达' } },
  { arg: '(\\Omega^{+})^3', val: 'I(1,0)', name: { en: 'admissible point of I', zh: 'I 的容许点' } },
  { arg: '(\\Omega^{+})^{\\omega}', val: 'I(\\omega,0)', name: { en: 'I-function', zh: 'I 函数' } },
  { arg: '(\\Omega^{+})^{\\Omega^{+}}', val: 'M', name: { en: 'recursively Mahlo', zh: '递归 Mahlo' } },
  { arg: '(\\Omega^{+})^{(\\Omega^{+})^2}', val: 'N', name: { en: 'Π₂ onto Π₂ onto Π₂', zh: 'Π₂ 再反射' } },
  { arg: '(\\Omega^{+})^{(\\Omega^{+})^{\\Omega^{+}}}', val: 'K', name: { en: 'Π₃-reflecting', zh: 'Π₃ 反射' } },
  { arg: '\\Omega^{+}\\uparrow\\uparrow 4', val: '\\Pi_4', name: { en: 'Π₄-reflecting', zh: 'Π₄ 反射' } },
  { arg: '\\Omega^{+}\\uparrow\\uparrow 5', val: '\\Pi_5', name: { en: 'Π₅-reflecting', zh: 'Π₅ 反射' } },
  { arg: '\\varepsilon_{\\Omega^{+}+1}', val: '\\text{psd.}\\Pi_\\omega', name: { en: 'all finite reflection', zh: '一切有限阶反射' } },
  { arg: '\\varepsilon_{\\Omega^{+}\\cdot 2}', val: '\\text{real.}\\Pi_\\omega=\\lambda\\alpha.(\\alpha{+}1)', name: { en: 'first stability', zh: '最初的稳定' } },
  { arg: '\\Omega_{\\alpha+2}', val: '\\lambda\\alpha.\\Omega_{\\alpha+1}{-}\\Pi_2', name: { en: 'stable to the next admissible', zh: '稳定到下一个容许' } },
]

/* ------------------------------------------------------------------ */
/* Ordinal-analysis frontier (book Table §15, eq. numbers in notes)      */
/* ------------------------------------------------------------------ */
export type PtoRow = { sys: string; what: Bi<string>; pto: string; who: string; state: 'done' | 'preprint' | 'unknown' }
export const PTO_ROWS: PtoRow[] = [
  { sys: '\\mathsf{RCA}_0', what: { en: 'computable mathematics', zh: '可计算数学' }, pto: '\\omega^\\omega', who: '', state: 'done' },
  { sys: '\\mathsf{PA},\\ \\mathsf{ACA}_0', what: { en: 'arithmetic (Ch. 6)', zh: '算术（第 6 章）' }, pto: '\\varepsilon_0', who: 'Gentzen 1936', state: 'done' },
  { sys: '\\mathsf{ATR}_0', what: { en: 'predicative analysis (Ch. 7)', zh: '直谓分析（第 7 章）' }, pto: '\\Gamma_0', who: 'Feferman, Schütte', state: 'done' },
  { sys: '\\mathsf{ACA}_0+\\Pi^1_2\\text{-}\\mathsf{BI}', what: { en: 'Kruskal’s theorem (Ch. 7)', zh: 'Kruskal 定理（第 7 章）' }, pto: '\\mathrm{SVO}', who: '', state: 'done' },
  { sys: '\\mathsf{KP},\\ \\mathsf{ID}_1', what: { en: 'admissible sets', zh: '容许集合' }, pto: '\\mathrm{BHO}=\\psi(\\varepsilon_{\\Omega+1})', who: 'Howard 1972', state: 'done' },
  { sys: '\\Pi^1_1\\text{-}\\mathsf{CA}_0', what: { en: 'Π¹₁ comprehension', zh: 'Π¹₁ 概括' }, pto: '\\mathrm{BO}=\\psi(\\Omega_\\omega)', who: 'Buchholz', state: 'done' },
  { sys: '\\Pi^1_1\\text{-}\\mathsf{CA}+\\mathsf{BI}', what: { en: '… plus bar induction', zh: '……再加杠归纳' }, pto: '\\mathrm{TFBO}=\\psi(\\varepsilon_{\\Omega_\\omega+1})', who: '', state: 'done' },
  { sys: '\\mathsf{KPi}', what: { en: 'recursively inaccessible', zh: '递归不可达' }, pto: '\\mathrm{JO}=\\psi(\\varepsilon_{I+1})', who: 'Jäger, Pohlers', state: 'done' },
  { sys: '\\mathsf{KPM}', what: { en: 'recursively Mahlo', zh: '递归 Mahlo' }, pto: '\\psi(\\varepsilon_{M+1})', who: 'Rathjen', state: 'done' },
  { sys: '\\mathsf{KP}+\\Pi_3\\text{-Ref}', what: { en: 'Π₃-reflection', zh: 'Π₃ 反射' }, pto: '\\psi(\\varepsilon_{K+1})', who: 'Rathjen 1994', state: 'done' },
  { sys: '\\mathsf{KP}+\\Pi_n\\text{-Ref}', what: { en: 'Πₙ-reflection, each n', zh: '每个 n 的 Πₙ 反射' }, pto: '\\psi(\\varepsilon_{\\Pi_n+1})', who: 'Arai; Stegert', state: 'done' },
  { sys: '\\mathsf{Z}_2', what: { en: 'full second-order arithmetic', zh: '完整的二阶算术' }, pto: '\\psi_\\Omega(I_\\omega)', who: 'Arai', state: 'preprint' },
  { sys: '\\mathsf{Z}_3,\\ \\ldots,\\ \\mathsf{Z}_\\omega', what: { en: 'higher-order arithmetic', zh: '高阶算术' }, pto: '?', who: '', state: 'unknown' },
  { sys: '\\mathsf{ZFC}', what: { en: 'all of ordinary mathematics', zh: '几乎全部常规数学' }, pto: '?', who: '', state: 'unknown' },
]

/* ------------------------------------------------------------------ */
/* Large-cardinal tower (bottom to top)                                 */
/* ------------------------------------------------------------------ */
export type Cardinal = { name: Bi<string>; def: Bi<string>; shadow?: Bi<string>; gives: Bi<string>; color: string }
export const TOWER: Cardinal[] = [
  {
    name: { en: 'ZFC (infinity: ω)', zh: 'ZFC（无限公理：ω）' },
    def: { en: 'The axiom of infinity: there is an infinite set. ω is “inaccessible” from the finite numbers.', zh: '无限公理：存在无穷集合。从有限数出发，ω 是“不可达”的。' },
    gives: { en: 'Infinite sets at all. Without this axiom, ZFC cannot prove any infinite set exists.', zh: '让无穷集合存在。去掉这条公理，ZFC 无法证明任何无穷集合存在。' },
    color: '#6b7399',
  },
  {
    name: { en: 'inaccessible', zh: '不可达基数' },
    def: { en: 'κ > ω, regular, and 2^λ < κ for all λ < κ: unreachable by power sets and by unions of fewer than κ smaller sets.', zh: 'κ > ω，正则，且对所有 λ < κ 有 2^λ < κ：既不能用幂集够到，也不能用少于 κ 个更小集合的并够到。' },
    shadow: { en: 'recursively inaccessible I', zh: '递归不可达 I' },
    gives: { en: 'V_κ ⊨ ZFC, so ZFC + “an inaccessible exists” proves Con(ZFC).', zh: 'V_κ ⊨ ZFC，所以 ZFC +“存在不可达基数”能证明 Con(ZFC)。' },
    color: '#6be4ff',
  },
  {
    name: { en: 'Mahlo', zh: 'Mahlo 基数' },
    def: { en: 'κ inaccessible, and the inaccessibles below κ form a stationary set (they meet every closed unbounded subset of κ).', zh: 'κ 不可达，并且 κ 以下的不可达基数构成一个稳定集（与 κ 的每个闭无界子集都相交）。' },
    shadow: { en: 'recursively Mahlo M', zh: '递归 Mahlo M' },
    gives: { en: 'κ is the κ-th inaccessible, and much more. Proves Con(ZFC + inaccessibles).', zh: 'κ 是第 κ 个不可达基数，而这只是它很弱的一条性质。能证明 Con(ZFC + 不可达)。' },
    color: '#7dffa8',
  },
  {
    name: { en: 'weakly compact', zh: '弱紧致基数' },
    def: { en: 'κ > ω with κ → (κ)²: colour every pair from κ red or blue; some set of size κ has all its pairs one colour.', zh: 'κ > ω 且 κ → (κ)²：把 κ 中每一对元素涂成红或蓝，总有一个大小为 κ 的子集，其中所有对同色。' },
    shadow: { en: 'Π₃-reflecting K', zh: 'Π₃ 反射序数 K' },
    gives: { en: 'The uncountable version of Ramsey’s theorem ℵ₀ → (ℵ₀)². Every weakly compact is Mahlo (and a limit of Mahlos).', zh: 'Ramsey 定理 ℵ₀ → (ℵ₀)² 的不可数版本。弱紧致基数都是 Mahlo 的（而且是 Mahlo 基数的极限）。' },
    color: '#b59bff',
  },
  {
    name: { en: 'measurable', zh: '可测基数' },
    def: { en: 'κ is the critical point of an elementary embedding j: V → M into a transitive class M (equivalently: a κ-complete non-principal ultrafilter on κ).', zh: 'κ 是某个初等嵌入 j: V → M（M 为传递类）的关键点（等价地：κ 上存在 κ-完全的非主超滤）。' },
    gives: { en: 'V ≠ L (Scott 1961): the constructible universe cannot be everything.', zh: 'V ≠ L（Scott 1961）：可构造宇宙不可能是全部。' },
    color: '#ffd36b',
  },
  {
    name: { en: 'Woodin', zh: 'Woodin 基数' },
    def: { en: 'A technical strengthening built from many embeddings.', zh: '由许多初等嵌入组合而成的技术性加强。' },
    gives: { en: 'Infinitely many Woodin cardinals ⇒ projective determinacy (Martin–Steel 1989).', zh: '无穷多个 Woodin 基数 ⇒ 射影决定性（Martin–Steel 1989）。' },
    color: '#ffa95e',
  },
  {
    name: { en: 'supercompact, huge', zh: '超紧、巨大基数' },
    def: { en: 'Embeddings j: V → M with M closer and closer to V (closed under longer and longer sequences).', zh: '初等嵌入 j: V → M，其中 M 越来越接近 V（对越来越长的序列封闭）。' },
    gives: { en: 'Each proves the consistency of everything below it.', zh: '每一级都能证明下面各级的一致性。' },
    color: '#ff7ab6',
  },
  {
    name: { en: 'I3 (rank-into-rank)', zh: 'I3（秩到秩）' },
    def: { en: 'A non-trivial elementary embedding j: V_λ → V_λ of a whole level of the universe into itself.', zh: '把宇宙的整整一层映到它自己的非平凡初等嵌入 j: V_λ → V_λ。' },
    gives: { en: 'Laver: the periods of Laver tables tend to infinity. No proof without I3 is known.', zh: 'Laver：Laver 表的周期趋于无穷。不借助 I3 的证明至今未知。' },
    color: '#ff6b6b',
  },
  {
    name: { en: 'I2, I1, I0', zh: 'I2、I1、I0' },
    def: { en: 'Stronger rank-into-rank axioms, e.g. I1: j: V_{λ+1} → V_{λ+1}.', zh: '更强的秩到秩公理，例如 I1：j: V_{λ+1} → V_{λ+1}。' },
    gives: { en: 'The strongest axioms not known to contradict ZFC.', zh: '目前还没被发现与 ZFC 矛盾的最强公理。' },
    color: '#ff4f8f',
  },
  {
    name: { en: 'Kunen’s ceiling', zh: 'Kunen 天花板' },
    def: { en: 'A non-trivial elementary j: V → V (a Reinhardt cardinal).', zh: '非平凡初等嵌入 j: V → V（Reinhardt 基数）。' },
    gives: { en: 'Inconsistent with ZFC (Kunen 1971) — the tower stops just below.', zh: '与 ZFC 矛盾（Kunen 1971）——塔就停在它下面一点点。' },
    color: '#3a4680',
  },
]
