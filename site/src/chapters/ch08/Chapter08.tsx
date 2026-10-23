import './ch08.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { BrickBuilder, RecursiveOrders, Staircase } from './widgetsA'
import { BuchholzHydra, CatchUp, FoldStepper, PRESETS_MULTI, PRESETS_ONE } from './widgetsB'

/* MOCF ↔ Veblen ladder (book §5.3, eqs. 5.111–5.297; ref/notes/p2.md §4.2) */
const LADDER: [string, string, string | { en: string; zh: string }][] = [
  ['\\psi(0)', '\\varepsilon_0', ''],
  ['\\psi(\\alpha),\\ \\alpha\\le\\zeta_0', '\\varepsilon_\\alpha', ''],
  ['\\psi(\\Omega)', '\\zeta_0=\\varphi(2,0)', { en: 'plateau value', zh: '平台值' }],
  ['\\psi(\\Omega+1)', '\\varepsilon_{\\zeta_0+1}', ''],
  ['\\psi(\\Omega\\cdot 2)', '\\zeta_1', ''],
  ['\\psi(\\Omega\\cdot\\alpha)', '\\zeta_\\alpha', { en: 'until η₀', zh: '直到 η₀' }],
  ['\\psi(\\Omega^2)', '\\eta_0=\\varphi(3,0)', ''],
  ['\\psi(\\Omega^2\\cdot 2)', '\\varphi(3,1)', ''],
  ['\\psi(\\Omega^3)', '\\varphi(4,0)', ''],
  ['\\psi(\\Omega^\\omega)', '\\varphi(\\omega,0)', ''],
  ['\\psi(\\Omega^{\\omega+1})', '\\varphi(\\omega+1,0)', ''],
  ['\\psi(\\Omega^{\\psi(\\Omega)})', '\\varphi(\\zeta_0,0)', ''],
  ['\\psi(\\Omega^\\Omega)', '\\Gamma_0=\\varphi(1,0,0)', ''],
  ['\\psi(\\Omega^\\Omega\\cdot 2)', '\\Gamma_1=\\varphi(1,0,1)', ''],
  ['\\psi(\\Omega^{\\Omega+1})', '\\varphi(1,1,0)', ''],
  ['\\psi(\\Omega^{\\Omega\\cdot 2})', '\\varphi(2,0,0)', ''],
  ['\\psi(\\Omega^{\\Omega^2})', '\\varphi(1,0,0,0)', { en: 'Ackermann ordinal', zh: 'Ackermann 序数' }],
  ['\\psi(\\Omega^{\\Omega^3})', '\\varphi(1,0,0,0,0)', ''],
  ['\\psi(\\Omega^{\\Omega^\\omega})', '\\varphi(1@\\omega)=\\text{SVO}', ''],
  ['\\psi(\\Omega^{\\Omega^{\\omega+1}})', '\\varphi(1@(\\omega+1))', ''],
  ['\\psi(\\Omega^{\\Omega^\\Omega})', '\\varphi(1@(1,0))=\\text{LVO}', ''],
  ['\\psi(\\varepsilon_{\\Omega+1})', '\\text{BHO}', { en: 'limit of all Veblen extensions', zh: '所有 Veblen 扩展的极限' }],
]

/* Madore ψ ↔ Buchholz ψ (book §5.6–5.7; ref/notes/p2.md §4.3) */
const DICT: [string, string, string][] = [
  ['1', '\\psi_B(0)', '—'],
  ['\\omega', '\\psi_B(1)', '—'],
  ['\\omega^\\omega', '\\psi_B(\\psi_B(1))', '—'],
  ['\\varepsilon_0', '\\psi_B(\\Omega)', '\\psi(0)'],
  ['\\varepsilon_1', '\\psi_B(\\Omega\\cdot 2)', '\\psi(1)'],
  ['\\zeta_0', '\\psi_B(\\Omega^2)', '\\psi(\\Omega)'],
  ['\\eta_0', '\\psi_B(\\Omega^3)', '\\psi(\\Omega^2)'],
  ['\\varphi(\\omega,0)', '\\psi_B(\\Omega^\\omega)', '\\psi(\\Omega^\\omega)'],
  ['\\Gamma_0', '\\psi_B(\\Omega^\\Omega)', '\\psi(\\Omega^\\Omega)'],
  ['\\text{SVO}', '\\psi_B(\\Omega^{\\Omega^\\omega})', '\\psi(\\Omega^{\\Omega^\\omega})'],
  ['\\text{LVO}', '\\psi_B(\\Omega^{\\Omega^\\Omega})', '\\psi(\\Omega^{\\Omega^\\Omega})'],
  ['\\text{BHO}', '\\psi_B(\\Omega_2)=\\psi_B(\\varepsilon_{\\Omega+1})', '\\psi(\\psi_1(0))=\\psi(\\varepsilon_{\\Omega+1})'],
  ['', '\\psi_B(\\Omega_2^2)', '\\psi(\\Omega_2)'],
  ['', '\\psi_B(\\Omega_3)', '\\psi(\\psi_2(0))'],
  ['\\text{BO}', '\\psi_B(\\Omega_\\omega)', '\\psi(\\Omega_\\omega)'],
  ['\\text{TFBO}', '\\psi_B(\\varepsilon_{\\Omega_\\omega+1})', '\\psi(\\psi_\\omega(0))'],
]

/* Proof-theoretic ordinals (book Ch.15 table; names checked against the literature) */
const PTO: [string, string, { en: string; zh: string }][] = [
  ['\\mathsf{PA},\\ \\mathsf{ACA}_0', '\\varepsilon_0=\\psi(0)', { en: 'Gentzen 1936 (Ch. 6)', zh: 'Gentzen 1936（第 6 章）' }],
  ['\\mathsf{ATR}_0', '\\Gamma_0=\\psi(\\Omega^\\Omega)', { en: 'Feferman, Schütte (Ch. 7)', zh: 'Feferman、Schütte（第 7 章）' }],
  ['\\mathsf{ACA}_0+\\Pi^1_2\\text{-}\\mathsf{BI}', '\\text{SVO}=\\psi(\\Omega^{\\Omega^\\omega})', { en: 'Kruskal’s theorem (Ch. 7)', zh: 'Kruskal 树定理（第 7 章）' }],
  ['\\mathsf{KP},\\ \\mathsf{ID}_1,\\ \\mathsf{ACA}+\\mathsf{BI}', '\\text{BHO}=\\psi(\\varepsilon_{\\Omega+1})', { en: 'Howard 1972', zh: 'Howard 1972' }],
  ['\\Pi^1_1\\text{-}\\mathsf{CA}_0,\\ \\mathsf{ID}_{<\\omega}', '\\text{BO}=\\psi(\\Omega_\\omega)', { en: 'Buchholz, Feferman, Pohlers, Sieg 1981', zh: 'Buchholz、Feferman、Pohlers、Sieg 1981' }],
  ['\\Pi^1_1\\text{-}\\mathsf{CA}+\\mathsf{BI},\\ \\mathsf{ID}_\\omega', '\\text{TFBO}=\\psi(\\psi_\\omega(0))', { en: 'Takeuti, Feferman, Buchholz', zh: 'Takeuti、Feferman、Buchholz' }],
  ['\\mathsf{Z}_2', '\\psi_\\Omega(I_\\omega)\\ \\text{(Ch. 10)}', { en: 'current frontier (Arai)', zh: '目前的前沿（Arai）' }],
]

export default function Chapter08() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Algorithms and computability, informally (Chapter 2).</>, zh: <>算法与可计算性的直观概念（第 2 章）。</> },
          { en: <>Ordinals, Cantor normal form, ε₀, no infinite descending sequences; countable sets and ω₁ (Chapter 3).</>, zh: <>序数、Cantor 范式、ε₀、序数不存在无穷降链；可数集与 ω₁（第 3 章）。</> },
          { en: <>Fundamental sequences α[n], the fast-growing hierarchy f_α and the slow-growing hierarchy g_α (Chapter 4).</>, zh: <>基本列 α[n]、快速增长层次 f_α 与慢速增长层次 g_α（第 4 章）。</> },
          { en: <>Primitive sequences and the words bad root, bad part, good part (Chapter 5).</>, zh: <>初等序列，以及坏根、坏部、好部这几个词（第 5 章）。</> },
          { en: <>Peano arithmetic and the proof-theoretic ordinal, PTO(PA) = ε₀ (Chapter 6).</>, zh: <>皮亚诺算术与证明论序数，PTO(PA) = ε₀（第 6 章）。</> },
          { en: <>Fixed points, the Veblen function φ, and ζ₀, η₀, Γ₀, SVO, LVO (Chapter 7).</>, zh: <>不动点、Veblen 函数 φ，以及 ζ₀、η₀、Γ₀、SVO、LVO（第 7 章）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="stuck" kicker={{ en: 'The climb resumes', zh: '继续攀登' }} title={{ en: 'Stuck at the edge of the Veblen world', zh: '卡在 Veblen 世界的边缘' }}>
        <P
          zh={<>第 7 章结束时，我们站在大 Veblen 序数 LVO 上：给 Veblen 函数 φ 越来越多的变量，再让变量的“位置”本身也变成序数。</>}
          en={<>Chapter 7 left us on the large Veblen ordinal LVO: give the Veblen function φ more and more arguments, then let the argument positions themselves be ordinals.</>}
        />
        <P
          zh={<>再往上走，规则变得越来越繁琐，回报却越来越小。《大数理论》对此的评价很直白：Veblen 的推广“太复杂，而且没有想象中那么强”。是时候换一种武器了。</>}
          en={<>Beyond that point the rules grow baroque and the gains shrink. 曹知秋’s book puts it bluntly: extending Veblen further is “too complicated, and weaker than one hopes.” Time for a different weapon.</>}
        />
        <H3 en="The one trick that always worked" zh="屡试不爽的那一招" />
        <P
          zh={<>回头看整个攀登过程，真正的突破只有一种模式：<b>卡住了，就把那个够不着的极限起个名字，当作新的对象来用。</b></>}
          en={<>Look back over the whole climb and every real breakthrough follows one pattern: <b>when you are stuck, give the unreachable limit a name and use it as a new object.</b></>}
        />
        <P
          zh={<>快速增长层次就是这么干的：<M t="f_\omega(n)=f_n(n)" />。下标 <M t="\omega" /> 比任何自然数都大，可它一碰到输入 <M t="n" />，就被“折”回成了自然数 <M t="n" />。</>}
          en={<>The fast-growing hierarchy does exactly this: <M t="f_\omega(n)=f_n(n)" />. The index <M t="\omega" /> is bigger than every natural number, yet on input <M t="n" /> it is folded back down to the natural number <M t="n" />.</>}
        />
        <P
          zh={<>本章把同样的把戏抬高一层：借来一个比所有“写得出来的”序数都大的序数 <M t="\Omega" />，用它当原料，再把结果折回到写得出来的序数里。这样的工具叫<Term en="ordinal collapsing function (OCF)" zh="序数折叠函数（OCF）" />。</>}
          en={<>This chapter plays the same trick one floor higher: borrow an ordinal <M t="\Omega" /> larger than every “writable” ordinal, use it as raw material, and fold the result back into the writable ones. Such a device is an <Term en="ordinal collapsing function (OCF)" zh="序数折叠函数（OCF）" />.</>}
        />
        <KeyIdea>
          <L
            zh={<>借一个够不着的大序数，再把它折回来。<M t="\omega" /> 之于自然数，正如 <M t="\Omega" /> 之于“写得出来的”序数。</>}
            en={<>Borrow something unreachable, then fold it back. <M t="\omega" /> is to the natural numbers what <M t="\Omega" /> will be to the “writable” ordinals.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="recursive" kicker={{ en: 'A precise word', zh: '一个精确的词' }} title={{ en: 'Ordinals a computer can hold', zh: '计算机装得下的序数' }}>
        <P
          zh={<>“写得出来”太含糊了。第 2 章给了我们一个精确的替身：<b>算法</b>。一个序数“写得出来”，就是说某个程序能把它的结构完整地交给你。</>}
          en={<>“Writable” is too vague. Chapter 2 gave us a precise stand-in: <b>algorithms</b>. An ordinal is “writable” when some program can hand you its entire structure.</>}
        />
        <P
          zh={<>怎么把一个无穷序数交给程序？不妨把它的每个位置都贴上一个自然数作标签，再让程序回答“标签 <M t="a" /> 排在标签 <M t="b" /> 前面吗？”。</>}
          en={<>How do you hand an infinite ordinal to a program? Label each of its positions with a natural number, and let the program answer “does label <M t="a" /> come before label <M t="b" />?”</>}
        />
        <Thm kind="definition" name={{ en: 'recursive ordinal (Church–Kleene)', zh: '递归序数（Church–Kleene）' }}>
          <B
            zh={<p>设 <M t="D" /> 是一个自然数集合，<M t="\prec" /> 是 <M t="D" /> 上的一个<b>良序</b>，并且有一个算法，对任意 <M t="a,b" /> 都能在有限步内判定“<M t="a\in D" /> 吗”和“<M t="a\prec b" /> 吗”。这样的 <M t="(D,\prec)" /> 叫<b>递归良序</b>，它的序型叫<Term en="recursive ordinal" zh="递归序数" />。</p>}
            en={<p>Let <M t="D" /> be a set of natural numbers and <M t="\prec" /> a <b>well-order</b> on <M t="D" />, such that an algorithm decides, for any <M t="a,b" />, whether <M t="a\in D" /> and whether <M t="a\prec b" />, in finitely many steps. Such a <M t="(D,\prec)" /> is a <b>recursive well-order</b>; its order type is a <Term en="recursive ordinal" zh="递归序数" />.</p>}
          />
        </Thm>
        <P
          zh={<>同样是整个 ℕ，换一个比较程序，排出来的“长度”就完全不同。挑一个程序看看：</>}
          en={<>The same set ℕ, sorted by a different comparison program, can have a completely different length. Pick a program:</>}
        />
        <Widget
          title={{ en: 'One ℕ, many lengths', zh: '同一个 ℕ，不同的长度' }}
          hint={{ en: 'Each row is a copy of ω. Hover a number to see its position.', zh: '每一行是一份 ω。鼠标悬停在数字上可以看它的位置。' }}
        >
          <RecursiveOrders />
        </Widget>
        <P
          zh={<>“按素因子指数”那个程序只有一行，排出来的序型却是 <M t="\omega^\omega" />。“倒过来”那个程序同样可以判定，但它不是良序：0 ≻ 1 ≻ 2 ≻ … 降个没完，所以不算数。</>}
          en={<>The “prime exponents” program is one line long, yet its order type is <M t="\omega^\omega" />. The “reversed” program is just as decidable, but it is not a well-order — 0 ≻ 1 ≻ 2 ≻ … descends forever — so it does not count.</>}
        />
        <P
          zh={<>前几章见过的序数全都是递归的：Cantor 范式、初等序列、Veblen 范式，每一种记号都自带一个比较大小的算法。比如第 5 章的初等序列，把每个序列编成一个自然数，比较规则就是现成的程序，序型是 <M t="\varepsilon_0" />。</>}
          en={<>Every ordinal from the previous chapters is recursive: Cantor normal form, primitive sequences and Veblen normal forms all come with a comparison algorithm. Code each primitive sequence of Chapter 5 as a natural number, for instance, and its comparison rule is a program whose order type is <M t="\varepsilon_0" />.</>}
        />
        <Thm name={{ en: '(two closure facts)', zh: '（两条封闭性）' }}>
          <B
            zh={<p>(a) 若 <M t="\alpha" /> 是递归序数且 <M t="\beta<\alpha" />，则 <M t="\beta" /> 也是。(b) 若 <M t="\alpha" /> 是递归序数，则 <M t="\alpha+1" /> 也是。</p>}
            en={<p>(a) If <M t="\alpha" /> is recursive and <M t="\beta<\alpha" />, then <M t="\beta" /> is recursive. (b) If <M t="\alpha" /> is recursive, so is <M t="\alpha+1" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>设 <M t="(D,\prec)" /> 是序型为 <M t="\alpha" /> 的递归良序。(a) 位置 <M t="\beta" /> 上站着某个标签 <M t="d" />；排在 <M t="d" /> 前面的元素组成 <M t="D'=\{x\in D: x\prec d\}" />，它的序型正是 <M t="\beta" />，而“<M t="x\in D'" /> 吗”只需多问一次 <M t="x\prec d" />。(b) 把每个标签 <M t="x" /> 换成 <M t="x+1" />，再让新标签 0 排在所有人之后。两个新程序都只是对旧程序的一次调用。</>}
            en={<>Let <M t="(D,\prec)" /> be a recursive well-order of type <M t="\alpha" />. (a) Some label <M t="d" /> sits at position <M t="\beta" />; the elements before it form <M t="D'=\{x\in D: x\prec d\}" />, of order type exactly <M t="\beta" />, and deciding <M t="x\in D'" /> costs one extra question <M t="x\prec d" />. (b) Rename each label <M t="x" /> to <M t="x+1" /> and put the new label 0 after everything. Each new program merely calls the old one.</>}
          />
        </Proof>

        <H3 en="Ω: the first ordinal no algorithm can hold" zh="Ω：任何算法都装不下的第一个序数" />
        <P
          zh={<>由封闭性 (a)，递归序数从 0 开始排成连续的一段，中间没有空缺；由 (b)，这一段没有最大元。它的上确界，就是本章的主角。</>}
          en={<>By closure fact (a), the recursive ordinals form an unbroken initial stretch starting at 0; by (b), that stretch has no largest member. Its supremum is the hero of this chapter.</>}
        />
        <Thm kind="theorem" name={{ en: 'the Church–Kleene ordinal', zh: 'Church–Kleene 序数' }}>
          <B
            zh={<p>令 <M t="\Omega=\omega_1^{\mathrm{CK}}" /> 为所有递归序数的上确界。那么 (i) <M t="\Omega" /> 不是递归序数——它是第一个非递归序数；(ii) <M t="\Omega" /> 是<b>可数</b>的。</p>}
            en={<p>Let <M t="\Omega=\omega_1^{\mathrm{CK}}" /> be the supremum of all recursive ordinals. Then (i) <M t="\Omega" /> is not recursive — it is the first non-recursive ordinal; (ii) <M t="\Omega" /> is <b>countable</b>.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>(i) 递归序数恰好是所有 <M t="<\Omega" /> 的序数。如果 <M t="\Omega" /> 本身是递归的，就会有 <M t="\Omega<\Omega" />，矛盾。(ii) 每个递归序数至少被一个程序见证，而程序都是有限长的文本，可以排成一列 <M t="P_0,P_1,P_2,\ldots" />。所以递归序数只有可数多个，<M t="\Omega" /> 作为它们排成的序型，就是一个可数集合的良序的序型，因而可数。</>}
            en={<>(i) The recursive ordinals are exactly the ordinals <M t="<\Omega" />. If <M t="\Omega" /> itself were recursive we would get <M t="\Omega<\Omega" />, a contradiction. (ii) Each recursive ordinal is witnessed by at least one program, and programs are finite texts that can be listed <M t="P_0,P_1,P_2,\ldots" />. So there are only countably many recursive ordinals, and <M t="\Omega" />, the order type of their list, is the order type of a well-ordered countable set — hence countable.</>}
          />
        </Proof>
        <P
          zh={<>这个名字来自 Alonzo Church 和 Stephen Kleene（1937–38），下标 CK 正是他们的姓氏首字母。</>}
          en={<>The name honours Alonzo Church and Stephen Kleene (1937–38); the “CK” is their initials.</>}
        />
        <Quiz
          q={{
            zh: <p><M t="\Omega=\omega_1^{\mathrm{CK}}" /> 比我们能用算法写出的每一个序数都大。那么它是什么样的集合？</p>,
            en: <p><M t="\Omega=\omega_1^{\mathrm{CK}}" /> exceeds every ordinal any algorithm can write down. What kind of set is it?</p>,
          }}
          options={[
            { zh: <p>不可数，就像 <M t="\omega_1" /></p>, en: <p>Uncountable, like <M t="\omega_1" /></p> },
            { zh: <p>可数——它的元素可以排成一列，只是没有程序能按大小顺序把它们交给你</p>, en: <p>Countable — its elements can be listed, but no program can hand them to you in order</p> },
            { zh: <p>它不是一个集合，就像“全体序数”一样</p>, en: <p>It is not a set, like “all ordinals”</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>程序只有可数多个，所以递归序数只有可数多个，它们的上确界 <M t="\Omega" /> 也是可数的，远小于第 3 章的 <M t="\omega_1" />。“够不着”是<b>可计算性</b>上的界限，不是“大小”上的界限。</p>,
            en: <p>There are only countably many programs, hence countably many recursive ordinals, and their supremum <M t="\Omega" /> is countable — far below Chapter 3’s <M t="\omega_1" />. “Unreachable” here is a limit of <b>computability</b>, not of size.</p>,
          }}
        />
        <Expand kind="detail" title={{ en: 'Why not ω₁? And what are Ω₂, Ω₃, …?', zh: '为什么不用 ω₁？Ω₂、Ω₃……又是什么？' }}>
          <P
            zh={<>较老的文献取 <M t="\Omega=\omega_1" />（第一个不可数序数）。对我们要做的事，<M t="\omega_1" /> “火力过猛”：折叠函数只用到一件事——<M t="\Omega" /> 从下面够不着。书中采用 <M t="\omega_1^{\mathrm{CK}}" />，并指出：只用 <M t="\Omega" /> 的折叠函数里，甚至取 <M t="\Omega=" /> BHO 就够了；取第一个非递归序数，是为了保证以后的任何扩展都碰不到它。</>}
            en={<>Older texts take <M t="\Omega=\omega_1" />, the first uncountable ordinal. For our purpose <M t="\omega_1" /> is overkill: collapsing uses only one property — <M t="\Omega" /> cannot be reached from below. The book uses <M t="\omega_1^{\mathrm{CK}}" /> and notes that for the Ω-only function even <M t="\Omega=" /> BHO would do; the first non-recursive ordinal guarantees that no future extension ever reaches it.</>}
          />
          <P
            zh={<>本章后面还会用到 <M t="\Omega_2,\Omega_3,\ldots" />。你可以把 <M t="\Omega_{n+1}" /> 理解成“从 <M t="\Omega_n" /> 出发、用本章所有工具都够不着的下一个序数”。精确的版本是 <M t="\omega" /> 之上的第 <M t="n+1" /> 个“容许序数”<M t="\omega_{n+1}^{\mathrm{CK}}" />，第 10 章会解释；老文献用不可数基数 <M t="\aleph_{n+1}" />。这是<b>约定</b>，折叠出来的递归序数的值不受影响。<M t="\Omega_\omega=\sup_n\Omega_n" /> 则不同：它有一个现成的递增序列 <M t="\Omega_0,\Omega_1,\ldots" />，所以折叠时它像普通的递归极限一样展开。</>}
            en={<>Later we use <M t="\Omega_2,\Omega_3,\ldots" />. Think of <M t="\Omega_{n+1}" /> as “the next ordinal beyond <M t="\Omega_n" /> that none of this chapter’s tools can reach.” The precise version is the <M t="(n+1)" />-th “admissible ordinal” above <M t="\omega" />, <M t="\omega_{n+1}^{\mathrm{CK}}" />, explained in Chapter 10; older texts use the uncountable cardinals <M t="\aleph_{n+1}" />. This is a <b>convention</b>; the recursive ordinals that come out of the collapse do not depend on it. <M t="\Omega_\omega=\sup_n\Omega_n" /> is different: it comes with a ready-made increasing sequence <M t="\Omega_0,\Omega_1,\ldots" />, so under collapsing it unfolds like an ordinary recursive limit.</>}
          />
        </Expand>
        <Expand kind="deeper" title={{ en: 'Countable, yet no sequence reaches it computably', zh: '可数，却没有可计算的序列能爬到它' }}>
          <P
            zh={<>既然 <M t="\Omega" /> 可数，就存在一个序数序列 <M t="\alpha_0<\alpha_1<\cdots" /> 以它为极限。但任何这样的序列都不可能由一个程序生成：否则把这些递归良序“首尾相接”，就能写出一个序型 <M t="\ge\Omega" /> 的递归良序。Kleene 用一个叫 <M t="\mathcal O" /> 的记号系统精确刻画了这件事，第 11 章会回来看它。</>}
            en={<>Since <M t="\Omega" /> is countable, some sequence <M t="\alpha_0<\alpha_1<\cdots" /> has it as its limit. But no such sequence can be generated by a program: otherwise gluing those recursive well-orders end to end would give a recursive well-order of type <M t="\ge\Omega" />. Kleene made this precise with a notation system called <M t="\mathcal O" />; Chapter 11 returns to it.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="bricks" kicker={{ en: 'The construction', zh: '构造' }} title={{ en: 'The least ordinal you cannot build', zh: '搭不出来的最小序数' }}>
        <P
          zh={<>先不碰 <M t="\Omega" />。给你三块砖：<M t="0,1,\omega" />；三种灰浆：<M t="+,\cdot,{}^\wedge" />。有限步之内，你能搭出哪些序数？搭不出的最小序数是谁？</>}
          en={<>Leave <M t="\Omega" /> aside for a moment. You get three bricks, <M t="0,1,\omega" />, and three kinds of mortar, <M t="+,\cdot," /> and exponentiation. Which ordinals can you build in finitely many steps — and what is the least one you cannot?</>}
        />
        <P
          zh={<>答案是 <M t="\varepsilon_0" />。下一步的想法很自然：把“搭不出的最小序数”本身也当作砖块，然后重复。这就是 Madore 折叠函数 <M t="\psi" /> 的全部想法。</>}
          en={<>The answer is <M t="\varepsilon_0" />. The next idea is natural: make “the least ordinal you cannot build” a brick too, and repeat. That is the entire idea of Madore’s collapsing function <M t="\psi" />.</>}
        />
        <Thm kind="definition" name={{ en: 'Madore’s ψ, recursive arguments (book Def. 5.2–5.3)', zh: 'Madore 的 ψ，递归参数版（书中定义 5.2–5.3）' }}>
          <MB t="\begin{aligned}&C^0(\alpha)=\{0,\,1,\,\omega\}\\&C^{n+1}(\alpha)=C^n(\alpha)\cup\{\gamma+\delta,\ \gamma\cdot\delta,\ \gamma^{\delta},\ \psi(\eta)\ :\ \gamma,\delta,\eta\in C^n(\alpha),\ \eta<\alpha\}\\&C(\alpha)=\textstyle\bigcup_{n}C^n(\alpha),\qquad \psi(\alpha)=\min\{\beta:\ \beta\notin C(\alpha)\}\end{aligned}" />
          <B
            zh={<p>直观地说：<M t="\psi(\alpha)" /> 是用 0、1、ω、加乘幂，以及“参数比 <M t="\alpha" /> 小、且参数本身搭得出来”的 <M t="\psi(\eta)" /> 搭不出的最小序数。</p>}
            en={<p>In words: <M t="\psi(\alpha)" /> is the least ordinal you cannot build from 0, 1, ω, sums, products, powers, and those <M t="\psi(\eta)" /> whose argument <M t="\eta" /> is below <M t="\alpha" /> and is itself buildable.</p>}
          />
        </Thm>
        <P
          zh={<>这是超限递归（第 3 章）：<M t="\psi(\alpha)" /> 只依赖更小参数处的值。下面的机器按定义真的去计算 <M t="C^n(\alpha)" />：</>}
          en={<>This is transfinite recursion (Chapter 3): <M t="\psi(\alpha)" /> depends only on values at smaller arguments. The machine below computes <M t="C^n(\alpha)" /> straight from the definition:</>}
        />
        <Widget
          title={{ en: 'The brick machine: C⁰(α), C¹(α), C²(α), …', zh: '砖块机：C⁰(α)、C¹(α)、C²(α)……' }}
          hint={{ en: 'Gold bricks are values ψ(η).', zh: '金边砖块是 ψ(η) 的值。' }}
        >
          <BrickBuilder />
        </Widget>
        <P
          zh={<>注意那张最大值表：<M t="C^n(0)" /> 的最大元素是 <M t="n+1" /> 层的 <M t="\omega" /> 塔。集合本身的大小是 3、8、44、1483，最大值却只是每层多一层塔，永远到不了 <M t="\varepsilon_0" />。</>}
          en={<>Watch the table of maxima: the largest element of <M t="C^n(0)" /> is a tower of <M t="n+1" /> omegas. The sets have sizes 3, 8, 44, 1483, yet its top only gains one storey per stage and never reaches <M t="\varepsilon_0" />.</>}
        />
        <P
          zh={<>参数换成 1：<M t="\psi(0)=\varepsilon_0" /> 成了一块新砖，能搭出任意有限高的 <M t="\varepsilon_0^{\varepsilon_0^{\cdots}}" />，却搭不出它们的极限，所以 <M t="\psi(1)=\varepsilon_1" />。同理 <M t="\psi(2)=\varepsilon_2" />，<M t="\psi(\omega)=\varepsilon_\omega" />。一般地：</>}
          en={<>Take argument 1: <M t="\psi(0)=\varepsilon_0" /> becomes a brick, so towers <M t="\varepsilon_0^{\varepsilon_0^{\cdots}}" /> of any finite height are buildable but their limit is not: <M t="\psi(1)=\varepsilon_1" />. Likewise <M t="\psi(2)=\varepsilon_2" /> and <M t="\psi(\omega)=\varepsilon_\omega" />. In general:</>}
        />
        <Thm name={{ en: '(book eq. 5.25)', zh: '（书中式 5.25）' }}>
          <B
            zh={<p>对所有 <M t="\alpha\le\zeta_0" />，<M t="C(\alpha)" /> 恰好是全体 <M t="<\varepsilon_\alpha" /> 的序数，因而 <M t="\psi(\alpha)=\varepsilon_\alpha" />。特别地 <M t="\psi(0)=\varepsilon_0" />，<M t="\psi(\zeta_0)=\varepsilon_{\zeta_0}=\zeta_0" />。</p>}
            en={<p>For every <M t="\alpha\le\zeta_0" />, <M t="C(\alpha)" /> is exactly the set of ordinals <M t="<\varepsilon_\alpha" />; hence <M t="\psi(\alpha)=\varepsilon_\alpha" />. In particular <M t="\psi(0)=\varepsilon_0" /> and <M t="\psi(\zeta_0)=\varepsilon_{\zeta_0}=\zeta_0" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>对 <M t="\alpha" /> 作超限归纳，设命题对所有 <M t="\beta<\alpha" /> 成立，于是对 <M t="\eta<\alpha" /> 有 <M t="\psi(\eta)=\varepsilon_\eta" />。<b>(⊆)</b> 原始砖和所有 <M t="\psi(\eta)=\varepsilon_\eta" />（<M t="\eta<\alpha" />）都小于 <M t="\varepsilon_\alpha" />，而 ε 数对加、乘、幂封闭（因为 <M t="\varepsilon=\omega^\varepsilon" />），对 <M t="n" /> 归纳即得 <M t="C(\alpha)\subseteq\varepsilon_\alpha" />。<b>(⊇)</b> 对 <M t="\gamma<\varepsilon_\alpha" /> 作强归纳。若 <M t="\gamma" /> 不是 ε 数，它的 Cantor 范式 <M t="\omega^{\beta_1}c_1+\cdots+\omega^{\beta_m}c_m" /> 中每个 <M t="\beta_i<\gamma" />，由归纳假设可搭，故 <M t="\gamma" /> 可搭。若 <M t="\gamma=\varepsilon_\eta" />，则 <M t="\eta<\alpha" />，且 <M t="\eta<\varepsilon_\eta=\gamma" />，由归纳假设 <M t="\eta\in C(\alpha)" />，于是砖块 <M t="\psi(\eta)=\varepsilon_\eta=\gamma" /> 可用。注意 <M t="\alpha=\zeta_0" /> 时这里用到了 <M t="\eta<\varepsilon_\eta" />，它对 <M t="\eta<\zeta_0" /> 成立。</>}
            en={<>Transfinite induction on <M t="\alpha" />: assume the claim below <M t="\alpha" />, so <M t="\psi(\eta)=\varepsilon_\eta" /> for <M t="\eta<\alpha" />. <b>(⊆)</b> The starting bricks and all <M t="\psi(\eta)=\varepsilon_\eta" /> with <M t="\eta<\alpha" /> lie below <M t="\varepsilon_\alpha" />, and ε-numbers are closed under sums, products and powers (as <M t="\varepsilon=\omega^\varepsilon" />); induct on <M t="n" />. <b>(⊇)</b> Strong induction on <M t="\gamma<\varepsilon_\alpha" />. If <M t="\gamma" /> is not an ε-number, each exponent in its Cantor normal form <M t="\omega^{\beta_1}c_1+\cdots+\omega^{\beta_m}c_m" /> satisfies <M t="\beta_i<\gamma" />, so <M t="\gamma" /> is buildable. If <M t="\gamma=\varepsilon_\eta" />, then <M t="\eta<\alpha" /> and <M t="\eta<\varepsilon_\eta=\gamma" />, so <M t="\eta\in C(\alpha)" /> by hypothesis and the brick <M t="\psi(\eta)=\varepsilon_\eta=\gamma" /> is available. At <M t="\alpha=\zeta_0" /> this uses <M t="\eta<\varepsilon_\eta" />, which holds for all <M t="\eta<\zeta_0" />.</>}
          />
        </Proof>
        <Expand kind="detail" title={{ en: 'Reading Def. 5.3 exactly', zh: '精读定义 5.3' }}>
          <P
            zh={<>书中 <M t="C^{n+1}" /> 的公式只列出了“新元素”，但它的例子（如 <M t="C^1(0)\ni0,1,\omega" />）表明集合是累积的，所以这里写成 <M t="C^n\cup\{\ldots\}" />。按这个读法，砖块机算出 <M t="C^1(0)=\{0,1,2,\omega,\omega+1,\omega\cdot2,\omega^2,\omega^\omega\}" />，与书一致。约定 <M t="0^0=1" />，对 <M t="\delta>0" /> 有 <M t="0^\delta=0" />。</>}
            en={<>The book’s formula for <M t="C^{n+1}" /> lists only the new elements, but its examples (e.g. <M t="C^1(0)\ni0,1,\omega" />) show the sets are cumulative, so we write <M t="C^n\cup\{\ldots\}" />. Read this way, the machine gives <M t="C^1(0)=\{0,1,2,\omega,\omega+1,\omega\cdot2,\omega^2,\omega^\omega\}" />, as in the book. We use <M t="0^0=1" /> and <M t="0^\delta=0" /> for <M t="\delta>0" />.</>}
          />
          <P
            zh={<>机器内部用的是 <M t="\zeta_0" /> 以下带 ε 原子的 Cantor 范式。砖块 <M t="\psi(\eta)" /> 直接按 <M t="\varepsilon_\eta" /> 放入，这正是定理 <M t="\psi(\alpha)=\varepsilon_\alpha" />（对 <M t="\eta<\zeta_0" />）所保证的。第 3 层只计数，第 4 层只算最大值：<M t="\max C^{n+1}=\max\bigl(M^M,\ \varepsilon_E\bigr)" />，其中 <M t="M=\max C^n" />，<M t="E" /> 是 <M t="C^n" /> 中小于 <M t="\alpha" /> 的最大元。</>}
            en={<>Internally the machine uses Cantor normal forms below <M t="\zeta_0" /> with ε-numbers as atoms. The brick <M t="\psi(\eta)" /> is inserted as <M t="\varepsilon_\eta" />, exactly what the theorem <M t="\psi(\alpha)=\varepsilon_\alpha" /> guarantees for <M t="\eta<\zeta_0" />. Stage 3 is only counted and stage 4 only maximised: <M t="\max C^{n+1}=\max\bigl(M^M,\ \varepsilon_E\bigr)" />, where <M t="M=\max C^n" /> and <M t="E" /> is the largest element of <M t="C^n" /> below <M t="\alpha" />.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="plateau" kicker={{ en: 'Stuck', zh: '卡住了' }} title={{ en: 'The plateau at ζ₀', zh: 'ζ₀ 处的平台期' }}>
        <P
          zh={<>到这里，<M t="\psi" /> 和第 7 章的 <M t="\alpha\mapsto\varepsilon_\alpha" /> 一模一样：<M t="\psi(\alpha)=\varepsilon_\alpha" />，一直到 <M t="\psi(\zeta_0)=\zeta_0" />。那么下一步呢？</>}
          en={<>So far Madore’s <M t="\psi" /> is just Chapter 7’s map <M t="\alpha\mapsto\varepsilon_\alpha" />: <M t="\psi(\alpha)=\varepsilon_\alpha" /> all the way to <M t="\psi(\zeta_0)=\zeta_0" />. What comes next?</>}
        />
        <Quiz
          q={{
            zh: <p>按砖块定义 <M t="\psi(\alpha)=\min\{\beta\notin C(\alpha)\}" />，<M t="\psi(\zeta_0+1)" /> 等于多少？</p>,
            en: <p>With the brick definition <M t="\psi(\alpha)=\min\{\beta\notin C(\alpha)\}" />, what is <M t="\psi(\zeta_0+1)" />?</p>,
          }}
          options={[
            { zh: <p><M t="\varepsilon_{\zeta_0+1}" />，接着往上走</p>, en: <p><M t="\varepsilon_{\zeta_0+1}" />, continuing the pattern</p> },
            { zh: <p><M t="\zeta_0" />，原地不动</p>, en: <p><M t="\zeta_0" />, no progress at all</p> },
            { zh: <p><M t="\zeta_1" /></p>, en: <p><M t="\zeta_1" /></p> },
          ]}
          answer={1}
          explain={{
            zh: <p>参数 <M t="\zeta_0+1" /> 允许使用砖块 <M t="\psi(\zeta_0)" />——但前提是 <M t="\zeta_0" /> 本身<b>搭得出来</b>。而 <M t="\zeta_0=\sup\{\psi(0),\psi(\psi(0)),\ldots\}" /> 只是有限嵌套的极限，从来不是一块成品砖。多出来的额度用不上，值停在 <M t="\zeta_0" />。</p>,
            en: <p>Argument <M t="\zeta_0+1" /> permits the brick <M t="\psi(\zeta_0)" /> — but only if <M t="\zeta_0" /> itself is <b>buildable</b>. And <M t="\zeta_0=\sup\{\psi(0),\psi(\psi(0)),\ldots\}" /> is merely a limit of finite nestings, never a finished brick. The extra allowance is useless; the value stays at <M t="\zeta_0" />.</p>,
          }}
        />
        <Thm name={{ en: 'plateau (book eq. 5.30)', zh: '平台期（书中式 5.30）' }}>
          <B zh={<p>对所有 <M t="\alpha\ge\zeta_0" />，<M t="\psi(\alpha)=\zeta_0" />（定义 5.3，只有 0、1、ω 三块原始砖）。</p>} en={<p>For every <M t="\alpha\ge\zeta_0" />, <M t="\psi(\alpha)=\zeta_0" /> (Def. 5.3, with only 0, 1, ω as starting bricks).</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>对 <M t="n" /> 归纳，<M t="C^n(\alpha)" /> 的每个元素都 <M t="<\zeta_0" />：0、1、ω 是；<M t="\zeta_0" /> 是 ε 数，对加乘幂封闭；而若 <M t="\eta<\zeta_0" />，则 <M t="\psi(\eta)=\varepsilon_\eta<\varepsilon_{\zeta_0}=\zeta_0" />。所以 <M t="\zeta_0\notin C(\alpha)" />，<M t="\psi(\alpha)\le\zeta_0" />。另一方面 <M t="C(\alpha)\supseteq C(\zeta_0)" /> 包含所有 <M t="<\zeta_0" /> 的序数，所以 <M t="\psi(\alpha)\ge\zeta_0" />。</>}
            en={<>By induction on <M t="n" />, every element of <M t="C^n(\alpha)" /> is <M t="<\zeta_0" />: true for 0, 1, ω; <M t="\zeta_0" /> is an ε-number, closed under sums, products and powers; and if <M t="\eta<\zeta_0" /> then <M t="\psi(\eta)=\varepsilon_\eta<\varepsilon_{\zeta_0}=\zeta_0" />. So <M t="\zeta_0\notin C(\alpha)" /> and <M t="\psi(\alpha)\le\zeta_0" />. Conversely <M t="C(\alpha)\supseteq C(\zeta_0)" /> contains every ordinal <M t="<\zeta_0" />, so <M t="\psi(\alpha)\ge\zeta_0" />.</>}
          />
        </Proof>
        <P
          zh={<>哪怕参数是 <M t="\Gamma_0" />、LVO，甚至任何递归序数，都白费。砖块机里选参数 <M t="\zeta_0+1" /> 就能看到这一幕：最大值 <M t="\varepsilon_\omega,\ \varepsilon_{\varepsilon_\omega},\ \varepsilon_{\varepsilon_{\varepsilon_\omega}},\ldots" /> 一路逼近 <M t="\zeta_0" />，却永远差一口气。</>}
          en={<>Even arguments like <M t="\Gamma_0" /> or LVO — any recursive ordinal at all — are wasted. Pick argument <M t="\zeta_0+1" /> in the brick machine to watch it: the maxima <M t="\varepsilon_\omega,\ \varepsilon_{\varepsilon_\omega},\ \varepsilon_{\varepsilon_{\varepsilon_\omega}},\ldots" /> close in on <M t="\zeta_0" /> and never arrive.</>}
        />
        <KeyIdea>
          <L
            zh={<>卡住的原因不是参数不够大，而是 <M t="\zeta_0" /> 作为一个“无限嵌套”从未被当成一个整体。要让 <M t="\psi" /> 越过它，需要一个能把整个无限嵌套 <M t="\psi(\psi(\cdots\psi(0)\cdots))" /> 一口吞下的参数。</>}
            en={<>The trouble is not that the argument is too small, but that <M t="\zeta_0" />, an infinite nesting, is never treated as one finished thing. To push <M t="\psi" /> past it we need an argument that swallows the entire nesting <M t="\psi(\psi(\cdots\psi(0)\cdots))" /> whole.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="omega" kicker={{ en: 'The big move', zh: '关键一步' }} title={{ en: 'Ω to the rescue', zh: 'Ω 来救场' }}>
        <P
          zh={<>把 <M t="\Omega=\omega_1^{\mathrm{CK}}" />（第一个非递归序数）也发成一块原始砖。定义只改一处：</>}
          en={<>Hand out <M t="\Omega=\omega_1^{\mathrm{CK}}" />, the first non-recursive ordinal, as one more starting brick. The definition changes in one place:</>}
        />
        <Thm kind="definition" name={{ en: 'Madore’s ψ with Ω (book Def. 5.8)', zh: '含 Ω 的 Madore ψ（书中定义 5.8）' }}>
          <MB t="C^0(\alpha)=\{0,\,1,\,\omega,\,\Omega\},\qquad C^{n+1},\ C(\alpha),\ \psi(\alpha)\ \text{as before.}" />
        </Thm>
        <P
          zh={<>为什么 <M t="\Omega" /> 不会搞乱已有的结果？用加乘幂把 <M t="\Omega" /> 和别的砖组合（<M t="\Omega+1" />、<M t="\Omega^2" />……），结果都 <M t="\ge\Omega" />（<M t="0\cdot\Omega" /> 这类平凡情形除外）。回到 <M t="\Omega" /> 以下的唯一通道是 <M t="\psi" /> 本身。递归序数和这些新元素之间隔着一道<b>永远填不满的空隙</b>，所以 <M t="\Omega" /> 不会直接填上 <M t="\Omega" /> 以下的任何缺口。</>}
          en={<>Why doesn’t <M t="\Omega" /> spoil the earlier results? Combining <M t="\Omega" /> with other bricks by sums, products and powers (<M t="\Omega+1" />, <M t="\Omega^2" />, …) lands at or above <M t="\Omega" /> (trivial cases like <M t="0\cdot\Omega" /> aside). The only way back below <M t="\Omega" /> is <M t="\psi" /> itself. Between the recursive ordinals and these new elements lies <b>a gap that can never be filled</b>, so <M t="\Omega" /> does not directly plug any hole below <M t="\Omega" />.</>}
        />
        <P
          zh={<>因此 <M t="\psi(\Omega)" /> 仍然是 <M t="\zeta_0" />：参数小于 <M t="\Omega" /> 的砖块还是那些。但 <M t="\Omega+1" /> 不一样——<M t="\Omega" /> 本身是一块砖，又满足 <M t="\Omega<\Omega+1" />，于是 <M t="\psi(\Omega)=\zeta_0" /> 第一次成了<b>成品砖</b>：</>}
          en={<>So <M t="\psi(\Omega)" /> is still <M t="\zeta_0" />: the bricks with arguments below <M t="\Omega" /> are the same as before. But <M t="\Omega+1" /> is different — <M t="\Omega" /> is itself a brick and <M t="\Omega<\Omega+1" />, so <M t="\psi(\Omega)=\zeta_0" /> becomes, for the first time, a <b>finished brick</b>:</>}
        />
        <MB t="\psi(\Omega+1)=\zeta_0^{\zeta_0^{\zeta_0^{\cdots}}}=\varepsilon_{\zeta_0+1}." />
        <P
          zh={<>书中的说法是：<M t="\Omega" /> 把无限嵌套 <M t="\psi(\psi(\cdots))" /> <b>折叠</b>成了一个整体。沿着参数一路走下去，看平台和逃逸怎样交替出现：</>}
          en={<>The book’s phrase: <M t="\Omega" /> <b>folds</b> the infinite nesting <M t="\psi(\psi(\cdots))" /> into a single object. Walk along the arguments and watch plateaus and escapes alternate:</>}
        />
        <Widget title={{ en: 'The staircase of ψ', zh: 'ψ 的阶梯' }} hint={{ en: 'Click a point or drag the slider.', zh: '点一个点，或拖动滑块。' }}>
          <Staircase />
        </Widget>
        <P
          zh={<>同样的剧情会一再上演：<M t="\psi(\Omega+\alpha)=\varepsilon_{\zeta_0+\alpha}" /> 一路爬到下一个不动点 <M t="\zeta_1" /> 又卡住；直到参数 <M t="\Omega\cdot2" /> 把 <M t="\zeta_1" /> 变成成品砖，再次逃出。</>}
          en={<>The same story repeats: <M t="\psi(\Omega+\alpha)=\varepsilon_{\zeta_0+\alpha}" /> climbs to the next fixed point <M t="\zeta_1" /> and sticks, until the argument <M t="\Omega\cdot2" /> turns <M t="\zeta_1" /> into a finished brick and escapes again.</>}
        />
        <Expand kind="detail" title={{ en: 'Is ψ(α) always below Ω?', zh: 'ψ(α) 一定小于 Ω 吗？' }}>
          <P
            zh={<>如果取 <M t="\Omega=\omega_1" />，这一点几乎是白送的：<M t="C(\alpha)" /> 是可数集，必然漏掉某个可数序数。取 <M t="\Omega=\omega_1^{\mathrm{CK}}" /> 时，需要知道 <M t="C(\alpha)" /> 在 <M t="\Omega" /> 以下的部分有上界；对本章用到的所有参数，这个上界都是 BHO 之类的递归序数，所以没问题。书中把定义写成 <M t="\min\{\beta<\Omega:\beta\notin C(\alpha)\}" />，就是为了把这件事说明白。</>}
            en={<>With <M t="\Omega=\omega_1" /> this is nearly free: <M t="C(\alpha)" /> is countable, so it misses some countable ordinal. With <M t="\Omega=\omega_1^{\mathrm{CK}}" /> one needs the part of <M t="C(\alpha)" /> below <M t="\Omega" /> to be bounded; for every argument used in this chapter the bound is a recursive ordinal such as BHO, so all is well. The book writes <M t="\min\{\beta<\Omega:\beta\notin C(\alpha)\}" /> to make this explicit.</>}
          />
        </Expand>

        <H3 en="The folding rule" zh="折叠规则" />
        <P
          zh={<>砖块定义精确但难算。社区真正动手计算时，用的是它推出的一条“折叠规则”。设 <M t="\ast" /> 是 <M t="+,\cdot," /> 或乘方之一，<M t="\#" /> 是参数中除去最后那个 <M t="\Omega" /> 的部分：</>}
          en={<>The brick definition is exact but hard to compute with. In practice the community uses a “folding rule” derived from it. Let <M t="\ast" /> be one of <M t="+" />, <M t="\cdot" />, or exponentiation, and <M t="\#" /> the argument with its last <M t="\Omega" /> removed:</>}
        />
        <MB t="\psi(\#\ast\Omega)=\sup\bigl\{\psi(\#),\ \psi(\#\ast\psi(\#)),\ \psi(\#\ast\psi(\#\ast\psi(\#))),\ \ldots\bigr\}." />
        <P
          zh={<>读法：最后那个 <M t="\Omega" /> 换成“<M t="\psi" /> 套 <M t="\psi" /> 的无限嵌套”。它就是 <M t="\Omega" /> 的含义——那个被折叠起来的无限嵌套，现在被展开回去。</>}
          en={<>Read it as: replace the last <M t="\Omega" /> by “ψ nested in ψ, forever.” That is what <M t="\Omega" /> means — the folded-up infinite nesting, now unfolded again.</>}
        />
        <Thm kind="fact" status="convention" name={{ en: 'the fundamental sequences used in this course', zh: '本课程采用的基本列' }}>
          <B
            zh={<p>对含 <M t="\Omega" /> 的极限，取 <M t="\psi(\#\ast\Omega)[0]=\psi(\#)" />，<M t="\psi(\#\ast\Omega)[k+1]=\psi(\#\ast\psi(\#\ast\Omega)[k])" />（书中式 5.316–5.318）；若参数末尾是裸的 <M t="\Omega" />，<M t="\#" /> 取 0。其余：<M t="\omega[k]=k" />；<M t="\psi(0)[0]=\omega" />，<M t="\psi(0)[k+1]=\omega^{\psi(0)[k]}" />；<M t="\psi(\beta+1)[0]=\psi(\beta)" />，<M t="\psi(\beta+1)[k+1]=\psi(\beta)^{\psi(\beta+1)[k]}" />；末尾是递归极限时，<M t="[k]" /> 直接传进去。</p>}
            en={<p>For limits involving <M t="\Omega" />: <M t="\psi(\#\ast\Omega)[0]=\psi(\#)" /> and <M t="\psi(\#\ast\Omega)[k+1]=\psi(\#\ast\psi(\#\ast\Omega)[k])" /> (book eqs. 5.316–5.318); if the argument ends in a bare <M t="\Omega" />, <M t="\#" /> is 0. Otherwise: <M t="\omega[k]=k" />; <M t="\psi(0)[0]=\omega" />, <M t="\psi(0)[k+1]=\omega^{\psi(0)[k]}" />; <M t="\psi(\beta+1)[0]=\psi(\beta)" />, <M t="\psi(\beta+1)[k+1]=\psi(\beta)^{\psi(\beta+1)[k]}" />; when the argument ends in a recursive limit, <M t="[k]" /> is passed inside.</p>}
          />
        </Thm>
        <Widget
          title={{ en: 'Folding stepper: one Ω', zh: '折叠步进器：一个 Ω' }}
          hint={{ en: 'The engine applies the rules literally. Click any term [k] to zoom into it; known values appear in gold.', zh: '引擎逐字执行规则。点击任意一项 [k] 进入它；已知的值用金色标出。' }}
        >
          <FoldStepper presets={PRESETS_ONE} />
        </Widget>
        <Expand kind="detail" title={{ en: 'Conventions differ — and why it does not matter much', zh: '约定各不相同——以及为什么影响不大' }}>
          <P
            zh={<>书中不同小节的起始项并不统一：定义 5.1 取 <M t="\psi(\alpha+1)[0]=0" />；式 5.213 取 <M t="\psi(\Omega^\Omega)[0]=\psi(0)" />，而式 5.341 取 <M t="\psi(\Omega)" />；式 5.628–5.637 在第 0 项把 <M t="\Omega" /> 换成 0（乘方时换成 1）。这些选择给出同样的极限，所以序数的<b>值</b>不变。</>}
            en={<>The book is not uniform about first terms: Def. 5.1 uses <M t="\psi(\alpha+1)[0]=0" />; eq. 5.213 starts <M t="\psi(\Omega^\Omega)" /> at <M t="\psi(0)" /> while eq. 5.341 starts it at <M t="\psi(\Omega)" />; eqs. 5.628–5.637 replace <M t="\Omega" /> by 0 (by 1 under exponentiation) at step 0. All give the same limits, so the <b>values</b> of the ordinals are unchanged.</>}
          />
          <P
            zh={<>但第 4 章强调过：基本列是 FGH 定义的一部分。不同约定下，<M t="f_\alpha(n)" /> 的具体数值不同，只是增长率的刻度不受影响。本课程固定采用上面的“<M t="\psi(\#)" /> 起步”约定。步进器展开前会先把末尾的 <M t="\Omega" /> 拆出来，例如把 <M t="\Omega\cdot2" /> 写成 <M t="\Omega+\Omega" />，把 <M t="\Omega^{\Omega+1}" /> 写成 <M t="\Omega^\Omega\cdot\Omega" />。</>}
            en={<>But as Chapter 4 stressed, fundamental sequences are part of the FGH definition: different conventions change the exact numbers <M t="f_\alpha(n)" />, though not the growth marks. This course fixes the “start at <M t="\psi(\#)" />” convention stated in the box. Before expanding, the stepper splits off the last <M t="\Omega" />: <M t="\Omega\cdot2" /> becomes <M t="\Omega+\Omega" />, and <M t="\Omega^{\Omega+1}" /> becomes <M t="\Omega^\Omega\cdot\Omega" />.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="veblen" kicker={{ en: 'Payoff', zh: '回报' }} title={{ en: 'All of Chapter 7 in one line', zh: '一行字装下第 7 章' }}>
        <P
          zh={<>有了折叠规则 <M t="\psi(\#\ast\Omega)=\sup\{\psi(\#),\psi(\#\ast\psi(\#)),\ldots\}" />，第 7 章那些需要一个个定义的序数，几乎可以“顺手”推出来。</>}
          en={<>With the folding rule <M t="\psi(\#\ast\Omega)=\sup\{\psi(\#),\psi(\#\ast\psi(\#)),\ldots\}" />, the ordinals that Chapter 7 had to define one by one fall out almost for free.</>}
        />
        <H3 en="ζ₀ and η₀" zh="ζ₀ 与 η₀" />
        <MB t="\psi(\Omega)=\sup\{\psi(0),\ \psi(\psi(0)),\ \ldots\}=\sup\{\varepsilon_0,\ \varepsilon_{\varepsilon_0},\ \ldots\}=\zeta_0." />
        <P
          zh={<>沿着阶梯走，<M t="\psi(\Omega\cdot\alpha)=\zeta_\alpha" />（直到又卡住）。于是：</>}
          en={<>Along the staircase, <M t="\psi(\Omega\cdot\alpha)=\zeta_\alpha" /> (until it sticks again). Hence:</>}
        />
        <MB t="\psi(\Omega^2)=\psi(\Omega\cdot\Omega)=\sup\{\psi(\Omega),\ \psi(\Omega\cdot\psi(\Omega)),\ \ldots\}=\sup\{\zeta_0,\ \zeta_{\zeta_0},\ \ldots\}=\eta_0." />
        <H3 en="Γ₀" zh="Γ₀" />
        <P
          zh={<>继续：<M t="\psi(\Omega^n)=\varphi(n+1,0)" />（<M t="n" /> 有限），而对无穷的 <M t="\alpha" /> 有 <M t="\psi(\Omega^\alpha)=\varphi(\alpha,0)" />，例如 <M t="\psi(\Omega^\omega)=\varphi(\omega,0)" />。指数位置的 <M t="\Omega" /> 折叠起来，正好就是 <M t="\alpha\mapsto\varphi(\alpha,0)" /> 的不动点：</>}
          en={<>Next, <M t="\psi(\Omega^n)=\varphi(n+1,0)" /> for finite <M t="n" />, and <M t="\psi(\Omega^\alpha)=\varphi(\alpha,0)" /> for infinite <M t="\alpha" />, e.g. <M t="\psi(\Omega^\omega)=\varphi(\omega,0)" />. Folding an <M t="\Omega" /> in the exponent gives exactly the fixed point of <M t="\alpha\mapsto\varphi(\alpha,0)" />:</>}
        />
        <MB t="\psi(\Omega^\Omega)=\sup\{\psi(\Omega),\ \psi(\Omega^{\psi(\Omega)}),\ \ldots\}=\sup\{\zeta_0,\ \varphi(\zeta_0,0),\ \varphi(\varphi(\zeta_0,0),0),\ \ldots\}=\Gamma_0." />
        <H3 en="SVO, LVO, BHO" zh="SVO、LVO、BHO" />
        <P
          zh={<>指数塔再高一层，对应 Veblen 函数多一个变量：<M t="\psi(\Omega^{\Omega^n})=\varphi(1@(n+1))" />，即 1 后面跟 <M t="n+1" /> 个 0。取上确界：</>}
          en={<>One more storey in the exponent means one more Veblen argument: <M t="\psi(\Omega^{\Omega^n})=\varphi(1@(n+1))" />, a 1 followed by <M t="n+1" /> zeros. Taking the supremum:</>}
        />
        <MB t="\psi(\Omega^{\Omega^\omega})=\text{SVO},\qquad \psi(\Omega^{\Omega^\Omega})=\text{LVO}," />
        <MB t="\psi(\varepsilon_{\Omega+1})=\sup\{\psi(\Omega),\ \psi(\Omega^\Omega),\ \psi(\Omega^{\Omega^\Omega}),\ldots\}=\text{BHO}." />
        <P
          zh={<>最后这个 <Term en="Bachmann–Howard ordinal" zh="Bachmann–Howard 序数" />（BHO）是所有 Veblen 扩展的极限。这里 <M t="\varepsilon_{\Omega+1}=\Omega^{\Omega^{\Omega^{\cdots}}}" /> 是 <M t="\Omega" /> 之后的第一个 ε 数。Heinz Bachmann 在 1950 年最早构造了这种“折叠”，William Howard 在 1972 年算出了它的证明论意义。</>}
          en={<>This last one, the <Term en="Bachmann–Howard ordinal" zh="Bachmann–Howard 序数" /> (BHO), is the limit of every Veblen extension. Here <M t="\varepsilon_{\Omega+1}=\Omega^{\Omega^{\Omega^{\cdots}}}" /> is the first ε-number after <M t="\Omega" />. Heinz Bachmann introduced this kind of collapsing in 1950; William Howard established its proof-theoretic meaning in 1972.</>}
        />
        <Thm kind="fact" status="proved" name={{ en: 'Madore’s ψ vs. Veblen', zh: 'Madore ψ 与 Veblen 的对应' }}>
          <B
            zh={<p><M t="\psi(\Omega)=\zeta_0" />，<M t="\psi(\Omega^2)=\eta_0" />，<M t="\psi(\Omega^\Omega)=\Gamma_0" />，<M t="\psi(\Omega^{\Omega^\omega})=\text{SVO}" />，<M t="\psi(\Omega^{\Omega^\Omega})=\text{LVO}" />，<M t="\psi(\varepsilon_{\Omega+1})=\text{BHO}" />。这些是文献中的标准结果；书中通过逐项枚举推导，论证是非形式的。</p>}
            en={<p><M t="\psi(\Omega)=\zeta_0" />, <M t="\psi(\Omega^2)=\eta_0" />, <M t="\psi(\Omega^\Omega)=\Gamma_0" />, <M t="\psi(\Omega^{\Omega^\omega})=\text{SVO}" />, <M t="\psi(\Omega^{\Omega^\Omega})=\text{LVO}" />, <M t="\psi(\varepsilon_{\Omega+1})=\text{BHO}" />. These are standard results in the literature; the book derives them by informal enumeration.</p>}
          />
        </Thm>
        <Expand kind="detail" title={{ en: 'The MOCF ↔ Veblen ladder', zh: 'MOCF ↔ Veblen 对照阶梯' }}>
          <div className="scroll-x">
            <table className="grid c08-ladder">
              <thead>
                <tr>
                  <th><L en="Madore ψ" zh="Madore ψ" /></th>
                  <th><L en="Veblen / name" zh="Veblen / 名称" /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {LADDER.map(([a, b, c], i) => (
                  <tr key={i}>
                    <td><M t={a} /></td>
                    <td><M t={b} /></td>
                    <td className="muted small">{typeof c === 'string' ? c : <L {...c} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P
            zh={<>经验法则（BHO 以下）：<M t="\psi(\Omega^{a}\cdot b+\cdots)" /> 中，<M t="\Omega" /> 的指数 <M t="a" /> 决定 Veblen 的“层级”（<M t="\Omega^n\leftrightarrow\varphi(n+1,\cdot)" />，<M t="\Omega^\Omega\leftrightarrow" /> 三元，<M t="\Omega^{\Omega^n}\leftrightarrow" /> <M t="n+3" /> 元），系数 <M t="b" /> 数不动点，后面的项变成里面的参数。</>}
            en={<>Rule of thumb below BHO: in <M t="\psi(\Omega^{a}\cdot b+\cdots)" /> the exponent <M t="a" /> picks the Veblen level (<M t="\Omega^n\leftrightarrow\varphi(n+1,\cdot)" />, <M t="\Omega^\Omega\leftrightarrow" /> ternary, <M t="\Omega^{\Omega^n}\leftrightarrow" /> <M t="(n+3)" />-ary), the coefficient <M t="b" /> counts fixed points, and later summands become the inner arguments.</>}
          />
        </Expand>
        <KeyIdea>
          <L
            zh={<>第 7 章用了一整章、四五套越来越复杂的规则才走到 LVO；Madore 的 <M t="\psi" /> 只用一条折叠规则和 <M t="\Omega" /> 的加乘幂，就把它们全部装下，还顺手走到了 BHO。</>}
            en={<>Chapter 7 needed a whole chapter and four or five increasingly baroque rule sets to reach LVO. Madore’s <M t="\psi" /> holds all of it with one folding rule and sums, products and powers of <M t="\Omega" /> — and walks on to BHO.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="layers" kicker={{ en: 'Another floor', zh: '再上一层楼' }} title={{ en: 'Ω₂ and the find-layer rule', zh: 'Ω₂ 与找层规则' }}>
        <P
          zh={<>BHO <M t="=\psi(\varepsilon_{\Omega+1})" /> 处又是一个平台：只用一个 <M t="\Omega" />，造不出 <M t="\varepsilon_{\Omega+1}" /> 这块砖，参数再大也白费。</>}
          en={<>At BHO <M t="=\psi(\varepsilon_{\Omega+1})" /> we hit another plateau: with a single <M t="\Omega" /> the brick <M t="\varepsilon_{\Omega+1}" /> can never be built, so larger arguments are wasted.</>}
        />
        <P
          zh={<>解法还是那一招。再借一个更大的 <M t="\Omega_2" />，再配一个新的折叠函数 <M t="\psi_1" />，它的输出落在 <M t="\Omega" /> 和 <M t="\Omega_2" /> 之间。在 <M t="\psi_1" /> 眼里，<M t="\Omega" /> 扮演的角色就是 <M t="\omega" /> 在 <M t="\psi" /> 眼里的角色。</>}
          en={<>The cure is the same trick. Borrow a bigger <M t="\Omega_2" /> with a new collapsing function <M t="\psi_1" /> whose outputs lie between <M t="\Omega" /> and <M t="\Omega_2" />. To <M t="\psi_1" />, <M t="\Omega" /> plays the part that <M t="\omega" /> plays for <M t="\psi" />.</>}
        />
        <Thm kind="definition" name={{ en: 'ψₙ with Ω₀ = ω, Ω₁ = Ω (book Def. 5.12–5.13)', zh: 'ψₙ，其中 Ω₀ = ω，Ω₁ = Ω（书中定义 5.12–5.13）' }}>
          <MB t="\begin{aligned}&C_n^0(\alpha)=\{\xi:\xi<\Omega_n\}\cup\{\Omega_k: k\in\mathbb N\}\\&C_n^{m+1}(\alpha)=C_n^m(\alpha)\cup\{\gamma+\delta,\ \gamma\cdot\delta,\ \gamma^\delta,\ \psi_k(\eta):\ \gamma,\delta,\eta\in C_n^m(\alpha),\ k\in\mathbb N,\ \eta<\alpha\}\\&\psi_n(\alpha)=\min\{\beta:\beta\notin C_n(\alpha)\},\qquad \psi=\psi_0.\end{aligned}" />
        </Thm>
        <P
          zh={<>第一个新值：<M t="\psi_1(0)" /> 可以随意使用所有小于 <M t="\Omega" /> 的序数，再加上加乘幂，最先缺的是 <M t="\varepsilon_{\Omega+1}" />。所以</>}
          en={<>The first new value: <M t="\psi_1(0)" /> may use every ordinal below <M t="\Omega" /> plus sums, products and powers, and the first thing missing is <M t="\varepsilon_{\Omega+1}" />. So</>}
        />
        <MB t="\psi_1(0)=\varepsilon_{\Omega+1},\qquad \psi(\psi_1(0))=\text{BHO}." />
        <P
          zh={<>BHO 不再是终点，而是一个可以继续加工的普通表达式：<M t="\psi(\psi_1(0)+1)" />、<M t="\psi(\psi_1(1))" />、<M t="\psi(\psi_1(\Omega))" />……一路往上。</>}
          en={<>BHO is no longer the end but an ordinary expression to keep working on: <M t="\psi(\psi_1(0)+1)" />, <M t="\psi(\psi_1(1))" />, <M t="\psi(\psi_1(\Omega))" />, and upward.</>}
        />

        <H3 en="Which layer gets copied?" zh="复制哪一层？" />
        <P
          zh={<>现在一个表达式里可能有好几层 <M t="\psi_m" />，又有好几种 <M t="\Omega_n" />。展开最后那个 <M t="\Omega_n" /> 时，该把哪一层 <M t="\psi" /> 复制进去？书中的答案分两步：<b>找层</b>，再<b>改名</b>。</>}
          en={<>An expression may now contain several layers <M t="\psi_m" /> and several kinds of <M t="\Omega_n" />. When the last <M t="\Omega_n" /> unfolds, which <M t="\psi" /> layer gets copied in? The book’s answer has two steps: <b>find the layer</b>, then <b>rename</b>.</>}
        />
        <Thm kind="fact" status="convention" name={{ en: 'find the layer, rename the copies (book eqs. 5.564–5.571)', zh: '找层与补层（书中式 5.564–5.571）' }}>
          <B
            zh={
              <ol>
                <li>从最右边的 <M t="\Omega_n" /> 出发，向外走，找到<b>第一个下标 <M t="m<n" /></b> 的函数 <M t="\psi_m" />（最外层的 <M t="\psi_0" /> 保证找得到）。</li>
                <li>把表达式写成 <M t="\#_0\bigl(\psi_m(\#\ast\Omega_n)\bigr)" />。</li>
                <li>展开：<M t="\#_0\bigl(\psi_m(\#\ast\psi_{n-1}(\#\ast\psi_{n-1}(\cdots))\bigr)" />——复制出来的层一律<b>改名为</b> <M t="\psi_{n-1}" />，原来那层保持 <M t="\psi_m" />。</li>
              </ol>
            }
            en={
              <ol>
                <li>Start at the rightmost <M t="\Omega_n" /> and walk outward to the <b>first function <M t="\psi_m" /> with <M t="m<n" /></b> (the outermost <M t="\psi_0" /> guarantees one exists).</li>
                <li>Write the expression as <M t="\#_0\bigl(\psi_m(\#\ast\Omega_n)\bigr)" />.</li>
                <li>Unfold: <M t="\#_0\bigl(\psi_m(\#\ast\psi_{n-1}(\#\ast\psi_{n-1}(\cdots))\bigr)" /> — every copied layer is <b>renamed</b> <M t="\psi_{n-1}" />, while the original layer keeps <M t="\psi_m" />.</li>
              </ol>
            }
          />
        </Thm>
        <Widget
          title={{ en: 'Folding stepper: many Ω’s', zh: '折叠步进器：多个 Ω' }}
          hint={{ en: 'Gold: the layer found. Red: the Ωₙ being unfolded. Pink: the renamed copies.', zh: '金色：找到的层。红色：被展开的 Ωₙ。粉色：改了名的副本。' }}
        >
          <FoldStepper presets={PRESETS_MULTI} />
        </Widget>
        <P
          zh={<>这正是第 5 章初等序列的骨架：<M t="\Omega_n" /> 是被删掉的末项，找到的 <M t="\psi_m" /> 是<b>坏根</b>，<M t="\psi_m(\#\ast\bullet)" /> 是被复制的<b>坏部</b>，外面的 <M t="\#_0" /> 是<b>好部</b>。</>}
          en={<>This is the skeleton of Chapter 5’s primitive sequences: <M t="\Omega_n" /> is the deleted last term, the found <M t="\psi_m" /> is the <b>bad root</b>, <M t="\psi_m(\#\ast\bullet)" /> is the copied <b>bad part</b>, and the outer <M t="\#_0" /> is the <b>good part</b>.</>}
        />
        <P
          zh={<>对比前两个预设：<M t="\psi(\Omega_2)" /> 展开成 <M t="\psi(0),\ \psi(\psi_1(0)),\ \psi(\psi_1(\psi_1(0))),\ldots" />，而 <M t="\psi(\psi_1(\Omega_2))" /> 从 <M t="\psi(\psi_1(0))" /> 开始走同一条路，所以两者相等。</>}
          en={<>Compare the first two presets: <M t="\psi(\Omega_2)" /> unfolds to <M t="\psi(0),\ \psi(\psi_1(0)),\ \psi(\psi_1(\psi_1(0))),\ldots" />, while <M t="\psi(\psi_1(\Omega_2))" /> walks the same road starting from <M t="\psi(\psi_1(0))" />. So they are equal.</>}
        />
        <Caution>
          <L
            zh={<>为什么一定要改名？如果不改，<M t="\psi(\Omega_2)" /> 会展开成 <M t="\psi(\psi(\psi(\cdots)))" />，极限只有 <M t="\zeta_0=\psi(\Omega)" />。可 <M t="\psi(\Omega_2)" /> 显然大于 <M t="\psi(\Omega+1)>\psi(\Omega)" />，这不可能对。改名为 <M t="\psi_1" /> 后，每一层副本都还活在 <M t="\Omega" /> 之上的世界里。</>}
            en={<>Why rename at all? Without it, <M t="\psi(\Omega_2)" /> would unfold to <M t="\psi(\psi(\psi(\cdots)))" />, whose limit is only <M t="\zeta_0=\psi(\Omega)" /> — absurd, since <M t="\psi(\Omega_2)" /> clearly exceeds <M t="\psi(\Omega+1)>\psi(\Omega)" />. Renamed to <M t="\psi_1" />, every copy stays alive in the world above <M t="\Omega" />.</>}
          />
        </Caution>

        <H3 en="Buchholz’s ordinal" zh="Buchholz 序数" />
        <P
          zh={<><M t="\Omega_3" /> 配 <M t="\psi_2" />，<M t="\Omega_4" /> 配 <M t="\psi_3" />……每加一层就能多折叠一次。把它们全部取上确界：</>}
          en={<><M t="\Omega_3" /> comes with <M t="\psi_2" />, <M t="\Omega_4" /> with <M t="\psi_3" />, and so on; each new floor allows one more fold. Take the supremum of all of them:</>}
        />
        <MB t="\text{BO}=\psi(\Omega_\omega)=\sup\{\psi(\Omega),\ \psi(\Omega_2),\ \psi(\Omega_3),\ \ldots\},\qquad \Omega_\omega[k]=\Omega_k." />
        <P
          zh={<>这就是 <Term en="Buchholz’s ordinal" zh="Buchholz 序数" />（BO）。第 9 章会看到，两行 Bashicu 矩阵的极限恰好也是它。</>}
          en={<>This is <Term en="Buchholz’s ordinal" zh="Buchholz 序数" /> (BO). Chapter 9 will show that the limit of two-row Bashicu matrices is exactly this ordinal.</>}
        />
        <Expand kind="deeper" title={{ en: 'Ordinal subscripts: TFBO, BIO, EBO', zh: '序数下标：TFBO、BIO、EBO' }}>
          <P
            zh={<>下标也可以是序数：<M t="\Omega_{\alpha+1}" /> 是 <M t="\Omega_\alpha" /> 之后的下一个，极限处取上确界。于是有 Takeuti–Feferman–Buchholz 序数 <M t="\text{TFBO}=\psi(\psi_\omega(0))=\psi(\varepsilon_{\Omega_\omega+1})" />，Bird 序数 <M t="\psi(\Omega_\Omega)" />，以及扩展 Buchholz 序数 <M t="\text{EBO}=\sup\{\psi(\Omega),\psi(\Omega_\Omega),\psi(\Omega_{\Omega_\Omega}),\ldots\}" />。</>}
            en={<>Subscripts may be ordinals too: <M t="\Omega_{\alpha+1}" /> is the next one after <M t="\Omega_\alpha" />, with suprema at limits. This gives the Takeuti–Feferman–Buchholz ordinal <M t="\text{TFBO}=\psi(\psi_\omega(0))=\psi(\varepsilon_{\Omega_\omega+1})" />, Bird’s ordinal <M t="\psi(\Omega_\Omega)" />, and the extended Buchholz ordinal <M t="\text{EBO}=\sup\{\psi(\Omega),\psi(\Omega_\Omega),\psi(\Omega_{\Omega_\Omega}),\ldots\}" />.</>}
          />
          <P
            zh={<>名字很唬人，增益却很小。书中指出，在三行 Bashicu 矩阵里，BO 是 (0,0,0)(1,1,1)，EBO 也只比它多几列。把一个变量从自然数推广到序数，往往只是“平凡扩展”；真正的突破需要更强的递归核心——这正是第 9 章的主题。</>}
            en={<>Grand names, small gains. The book points out that in three-row Bashicu matrices BO is (0,0,0)(1,1,1) and EBO is only a few columns further. Promoting a variable from naturals to ordinals is usually a “trivial extension”; real progress needs a stronger recursive core — the theme of Chapter 9.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="buchholz" kicker={{ en: 'Reading other books', zh: '读别的书时' }} title={{ en: 'A second dialect: Buchholz’s ψ', zh: '另一种方言：Buchholz 的 ψ' }}>
        <P
          zh={<>Wikipedia 和大部分证明论文献用的不是 Madore 的 ψ，而是 Wilfried Buchholz 在 1986 年提出的 <M t="\psi_\nu" />。它只允许加法和 <M t="\psi" />，起点是 <M t="\psi_B(0)=1" />，后继规则是 <M t="\psi_B(\alpha+1)=\psi_B(\alpha)\cdot\omega" />；折叠规则与 Madore 的相同。</>}
          en={<>Wikipedia and most of the proof-theory literature use not Madore’s ψ but the functions <M t="\psi_\nu" /> introduced by Wilfried Buchholz in 1986. They allow only addition and <M t="\psi" />, start from <M t="\psi_B(0)=1" />, and have successor rule <M t="\psi_B(\alpha+1)=\psi_B(\alpha)\cdot\omega" />; the folding rule is Madore’s.</>}
        />
        <P
          zh={<>后果是：<b>同一个符号，不同的值。</b>在 Madore 的版本里 <M t="\psi(\Omega)=\zeta_0" />，在 Buchholz 的版本里 <M t="\psi_B(\Omega)=\varepsilon_0" />。到了 <M t="\Omega^\omega" /> 两者追平，此后大部分地标相同。</>}
          en={<>The upshot: <b>same symbol, different values.</b> In Madore’s version <M t="\psi(\Omega)=\zeta_0" />; in Buchholz’s <M t="\psi_B(\Omega)=\varepsilon_0" />. The two catch up at <M t="\Omega^\omega" />, after which most landmarks agree.</>}
        />
        <Caution>
          <L
            zh={<>引用 OCF 时必须说明用的是哪一个。本课程中不加下标的 <M t="\psi" /> 一律指 Madore 的版本；Buchholz 的版本写作 <M t="\psi_B" />。</>}
            en={<>Always say which OCF you mean. In this course a plain <M t="\psi" /> is always Madore’s; Buchholz’s is written <M t="\psi_B" />.</>}
          />
        </Caution>
        <Expand kind="detail" title={{ en: 'Dictionary: Madore ψ ↔ Buchholz ψ_B', zh: '词典：Madore ψ ↔ Buchholz ψ_B' }}>
          <div className="scroll-x">
            <table className="grid c08-ladder">
              <thead>
                <tr>
                  <th><L en="ordinal" zh="序数" /></th>
                  <th><L en="Buchholz ψ_B" zh="Buchholz ψ_B" /></th>
                  <th><L en="Madore ψ" zh="Madore ψ" /></th>
                </tr>
              </thead>
              <tbody>
                {DICT.map(([a, b, c], i) => (
                  <tr key={i}>
                    <td>{a && <M t={a} />}</td>
                    <td><M t={b} /></td>
                    <td>{c === '—' ? <span className="muted">—</span> : <M t={c} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P
            zh={<>规律：BHO 以下，Madore 的 <M t="\Omega^\alpha" /> 大致对应 Buchholz 的 <M t="\Omega^{1+\alpha}" />；更高处，<M t="\psi_B(\Omega_{\alpha+1})=\psi(\psi_\alpha(0))" />，而下标为极限时 <M t="\psi_B(\Omega_\alpha)=\psi(\Omega_\alpha)" />，所以 BO 两边相同。书中为了方便仍写乘法和乘方；Buchholz 原始定义只用加法，并取 <M t="\Omega_\nu=\aleph_\nu" />，书中采用的可数版本沿用 Maksudov 的方案。</>}
            en={<>Pattern: below BHO, Madore’s <M t="\Omega^\alpha" /> roughly matches Buchholz’s <M t="\Omega^{1+\alpha}" />; higher up, <M t="\psi_B(\Omega_{\alpha+1})=\psi(\psi_\alpha(0))" />, while for limit subscripts <M t="\psi_B(\Omega_\alpha)=\psi(\Omega_\alpha)" />, so BO is the same on both sides. The book writes products and powers for convenience; Buchholz’s original uses only addition and <M t="\Omega_\nu=\aleph_\nu" />, and the book’s countable version follows Maksudov’s scheme.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="hydra" kicker={{ en: 'The hydra strikes back', zh: '九头蛇卷土重来' }} title={{ en: 'The Buchholz hydra', zh: 'Buchholz 九头蛇' }}>
        <P
          zh={<>第 6 章的 Kirby–Paris 九头蛇对应 <M t="\varepsilon_0" />。1987 年，Buchholz 给九头蛇的每个节点贴上一个标签 <M t="0,1,2,\ldots" /> 或 <M t="\omega" />，让它强到了 Buchholz <M t="\psi_B" /> 的整个范围。</>}
          en={<>Chapter 6’s Kirby–Paris hydra lives at <M t="\varepsilon_0" />. In 1987 Buchholz gave every node a label <M t="0,1,2,\ldots" /> or <M t="\omega" />, making the hydra as strong as the whole range of his <M t="\psi_B" />.</>}
        />
        <Thm kind="definition" name={{ en: 'Buchholz hydra (rules as in the book, §21.27)', zh: 'Buchholz 九头蛇（规则同书中 §21.27）' }}>
          <B
            zh={
              <>
                <p>九头蛇是一棵有根树：根标为 +，紧挨根的节点标 0，其余节点标 <M t="0,1,2,\ldots" /> 或 <M t="\omega" />。第 <M t="n" /> 回合（<M t="n=1,2,\ldots" />）你砍掉一个头（叶子）<M t="\sigma" />，记它的父节点为 <M t="\tau" />：</p>
                <ol>
                  <li><M t="\sigma" /> 标 0 且 <M t="\tau" /> 是根：直接删掉。</li>
                  <li><M t="\sigma" /> 标 0 且 <M t="\tau" /> 不是根：删掉 <M t="\sigma" />，再把（删完后的）<M t="\tau" /> 连同子树复制 <M t="n" /> 份，接到 <M t="\tau" /> 的父节点上。</li>
                  <li><M t="\sigma" /> 标 <M t="u\ge1" />：往下找第一个标签 <M t="v<u" /> 的节点 <M t="\varepsilon" />。复制以 <M t="\varepsilon" /> 为根的子树，把副本的根改标 <M t="u-1" />、副本里的 <M t="\sigma" /> 改标 0，用这个副本替换 <M t="\sigma" />。</li>
                  <li><M t="\sigma" /> 标 <M t="\omega" />：把它改标为 <M t="n+1" />。</li>
                </ol>
                <p>只剩下根时，你赢。</p>
              </>
            }
            en={
              <>
                <p>A hydra is a rooted tree: the root is labelled +, nodes next to the root are labelled 0, other nodes carry <M t="0,1,2,\ldots" /> or <M t="\omega" />. In round <M t="n" /> (<M t="n=1,2,\ldots" />) you cut a head (leaf) <M t="\sigma" /> with parent <M t="\tau" />:</p>
                <ol>
                  <li><M t="\sigma" /> labelled 0 and <M t="\tau" /> the root: it simply disappears.</li>
                  <li><M t="\sigma" /> labelled 0, <M t="\tau" /> not the root: remove <M t="\sigma" />, then attach <M t="n" /> copies of (the trimmed) <M t="\tau" /> with its subtree to <M t="\tau" />’s parent.</li>
                  <li><M t="\sigma" /> labelled <M t="u\ge1" />: go down to the first node <M t="\varepsilon" /> with label <M t="v<u" />. Copy the subtree rooted at <M t="\varepsilon" />, relabel the copy’s root <M t="u-1" /> and the copy of <M t="\sigma" /> 0, and put this copy in place of <M t="\sigma" />.</li>
                  <li><M t="\sigma" /> labelled <M t="\omega" />: relabel it <M t="n+1" />.</li>
                </ol>
                <p>You win when only the root is left.</p>
              </>
            }
          />
        </Thm>
        <Widget
          title={{ en: 'Fight a Buchholz hydra', zh: '与 Buchholz 九头蛇搏斗' }}
          hint={{ en: 'Click a cyan head. Gold ring: the node the rule found; pink: freshly grown nodes.', zh: '点击青色的头。金色圈：规则找到的节点；粉色：新长出来的节点。' }}
        >
          <BuchholzHydra />
        </Widget>
        <P
          zh={<>先选 <M t="\omega^\omega" /> 那条蛇，一直砍最右边的头：它在第 37 刀死去。只有 0 标签时，这就是第 6 章的 Kirby–Paris 九头蛇。</>}
          en={<>Start with the <M t="\omega^\omega" /> hydra and keep cutting the rightmost head: it dies on cut 37. With only 0-labels this is Chapter 6’s Kirby–Paris hydra.</>}
        />
        <P
          zh={<>规则 3 正是“找层再改名”：往下第一个标签更小的节点就是<b>坏根</b>，复制它的子树就是复制<b>坏部</b>，副本的根改标 <M t="u-1" />，对应副本改名为 <M t="\psi_{n-1}" />。标签 <M t="u" /> 就是 <M t="\psi_u" />：</>}
          en={<>Rule 3 is literally “find the layer, then rename”: the first node below with a smaller label is the <b>bad root</b>, copying its subtree copies the <b>bad part</b>, and relabelling the copy’s root <M t="u-1" /> matches renaming the copies <M t="\psi_{n-1}" />. Label <M t="u" /> is <M t="\psi_u" />:</>}
        />
        <MB t="(+(0(1)))=\varepsilon_0,\quad (+(0(1(1))))=\zeta_0,\quad (+(0(1(1(1)))))=\Gamma_0," />
        <MB t="(+(0(1(1(1(1))))))=\text{LVO},\quad (+(0(2)))=\text{BHO},\quad (+(0(\omega)))=\text{BO}." />
        <P
          zh={<>这里的值用 Buchholz 的 <M t="\psi_B" /> 计算：一个标 <M t="u" />、子树为 <M t="c_1,\ldots,c_k" /> 的节点代表 <M t="\psi_{B,u}(c_1+\cdots+c_k)" />。游戏面板里九头蛇下方显示的就是这个表达式。</>}
          en={<>Values are read in Buchholz’s <M t="\psi_B" />: a node labelled <M t="u" /> with subtrees <M t="c_1,\ldots,c_k" /> stands for <M t="\psi_{B,u}(c_1+\cdots+c_k)" />; the game panel shows this expression under the hydra.</>}
        />
        <Thm name={{ en: 'Buchholz 1987', zh: 'Buchholz 1987' }}>
          <B
            zh={<p>无论怎样砍，每一条 Buchholz 九头蛇都会在有限步内死去。但这个命题在 <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> 中不可证。</p>}
            en={<p>Whatever you cut, every Buchholz hydra dies after finitely many steps. But this statement is unprovable in <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" />.</p>}
          />
        </Thm>
        <P
          zh={<>令 <M t="\mathrm{BH}(x)" /> 为单链九头蛇 <M t="+,0,\omega,\ldots,\omega" />（共 <M t="x" /> 个节点）被砍死所需的回合数。书中式 21.386 估计它的增长率约为 <M t="\psi(\psi_\omega(0))" />，即 TFBO。</>}
          en={<>Let <M t="\mathrm{BH}(x)" /> be the number of rounds needed to kill the single-branch hydra <M t="+,0,\omega,\ldots,\omega" /> with <M t="x" /> nodes. The book’s eq. 21.386 estimates its growth rate as about <M t="\psi(\psi_\omega(0))" />, that is, TFBO.</>}
        />
        <Caution>
          <L
            zh={<>不要把“整个游戏”和“单个九头蛇 (+(0(ω)))”混为一谈。后者对应 BO，但 (+(0(ω(ω))))、(+(0(ω(ω(ω)))))…… 越来越长的 ω 链会越过 BO，它们的上确界是 TFBO <M t="=\psi_B(\varepsilon_{\Omega_\omega+1})" />，恰好是 <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> 的证明论序数。所以 BH 的增长率是 TFBO 级别（社区估计），而不是 BO。</>}
            en={<>Do not confuse the whole game with the single hydra (+(0(ω))). That one is BO, but longer ω-chains (+(0(ω(ω)))), (+(0(ω(ω(ω))))), … go beyond it; their supremum is TFBO <M t="=\psi_B(\varepsilon_{\Omega_\omega+1})" />, which is exactly the proof-theoretic ordinal of <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" />. So BH grows at TFBO level (a community estimate), not at BO.</>}
          />
        </Caution>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="pto" kicker={{ en: 'Proof theory', zh: '证明论' }} title={{ en: 'What theories can see', zh: '理论看得多远' }}>
        <P
          zh={<>第 6 章说过：理论 <M t="T" /> 的证明论序数 PTO(<M t="T" />)，是它能证明“良序”的最远处。PA 只看到 <M t="\varepsilon_0" />。OCF 最初就是为了写下更强理论的 PTO 而发明的。</>}
          en={<>Recall from Chapter 6: the proof-theoretic ordinal PTO(<M t="T" />) of a theory <M t="T" /> is how far <M t="T" /> can prove well-foundedness. PA sees only up to <M t="\varepsilon_0" />. OCFs were invented precisely to write down the PTOs of stronger theories.</>}
        />
        <div className="scroll-x">
          <table className="grid c08-ladder">
            <thead>
              <tr>
                <th><L en="theory" zh="理论" /></th>
                <th><L en="PTO (Madore ψ unless noted)" zh="PTO（未注明时用 Madore ψ）" /></th>
                <th><L en="notes" zh="备注" /></th>
              </tr>
            </thead>
            <tbody>
              {PTO.map(([a, b, c], i) => (
                <tr key={i}>
                  <td><M t={a} /></td>
                  <td><M t={b} /></td>
                  <td className="muted small"><L {...c} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P
          zh={<>表中的等式是证明论的定理（<Term en="ordinal analysis" zh="序数分析" />）。最后一行 <M t="\mathsf Z_2" /> 是二阶算术，是目前序数分析的前沿，第 10 章再谈。</>}
          en={<>The equalities in the table are theorems of <Term en="ordinal analysis" zh="序数分析" />. The last row, <M t="\mathsf Z_2" />, is second-order arithmetic, the current frontier, revisited in Chapter 10.</>}
        />
        <Expand kind="detail" title={{ en: 'What these theories are, in one line each', zh: '这些理论各是什么（每个一句话）' }}>
          <B
            zh={
              <ul>
                <li><M t="\mathsf{KP}" />：Kripke–Platek 集合论，ZFC 的一个很弱的片段，只允许“有界”的构造。</li>
                <li><M t="\mathsf{ID}_1" />：在算术上加上“一次归纳定义”的最小不动点；<M t="\mathsf{ID}_{<\omega}" /> 允许任意有限次迭代，<M t="\mathsf{ID}_\omega" /> 允许 <M t="\omega" /> 次。</li>
                <li><M t="\Pi^1_1\text{-}\mathsf{CA}_0" />：对 <M t="\Pi^1_1" /> 公式的概括公理，是反推数学“五大系统”中最强的一个。</li>
                <li><M t="\mathsf{BI}" />：Bar 归纳，大致是“对任意公式都可以做良基归纳”。</li>
              </ul>
            }
            en={
              <ul>
                <li><M t="\mathsf{KP}" />: Kripke–Platek set theory, a weak fragment of ZFC allowing only “bounded” constructions.</li>
                <li><M t="\mathsf{ID}_1" />: arithmetic plus the least fixed point of one inductive definition; <M t="\mathsf{ID}_{<\omega}" /> allows any finite number of iterations, <M t="\mathsf{ID}_\omega" /> allows <M t="\omega" /> of them.</li>
                <li><M t="\Pi^1_1\text{-}\mathsf{CA}_0" />: comprehension for <M t="\Pi^1_1" /> formulas, the strongest of the “big five” systems of reverse mathematics.</li>
                <li><M t="\mathsf{BI}" />: bar induction, roughly “well-founded induction for arbitrary formulas.”</li>
              </ul>
            }
          />
        </Expand>
        <P
          zh={<>请注意倒数第二、三行的区别：<b>BO <M t="=\psi(\Omega_\omega)" /> 是 <M t="\Pi^1_1\text{-}\mathsf{CA}_0" />（以及 <M t="\mathsf{ID}_{<\omega}" />）的序数</b>；加上 Bar 归纳的 <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> 走得更远，到 <M t="\psi_B(\varepsilon_{\Omega_\omega+1})" />，即 TFBO。</>}
          en={<>Mind the difference between the last rows: <b>BO <M t="=\psi(\Omega_\omega)" /> is the ordinal of <M t="\Pi^1_1\text{-}\mathsf{CA}_0" /> (and of <M t="\mathsf{ID}_{<\omega}" />)</b>; adding bar induction, <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> reaches further, to <M t="\psi_B(\varepsilon_{\Omega_\omega+1})" />, i.e. TFBO.</>}
        />
        <Expand kind="detail" title={{ en: 'A naming slip to watch for', zh: '一个要当心的命名错误' }}>
          <P
            zh={<>《大数理论》第 15 章的表（式 15.174）把 <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> 的 PTO 写作 <M t="\psi(\varepsilon_{\Omega_\omega+1})" />（Buchholz 记法），这一行常被标成“BO”。这个名字是错的：该序数是 Takeuti–Feferman–Buchholz 序数 TFBO（书中式 16.83 与 5.725 也这么称呼它），而 BO <M t="=\psi(\Omega_\omega)" /> 属于 <M t="\Pi^1_1\text{-}\mathsf{CA}_0" />。本课程遵循标准文献的命名。</>}
            en={<>The PTO table in Chapter 15 of 《大数理论》 (eq. 15.174) gives <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> the ordinal <M t="\psi(\varepsilon_{\Omega_\omega+1})" /> (Buchholz notation), and that row is often labelled “BO.” The label is wrong: this ordinal is the Takeuti–Feferman–Buchholz ordinal TFBO (as the book’s own eqs. 16.83 and 5.725 call it), while BO <M t="=\psi(\Omega_\omega)" /> belongs to <M t="\Pi^1_1\text{-}\mathsf{CA}_0" />. This course follows the standard naming in the literature.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="catchup" kicker={{ en: 'The wow moment', zh: '惊叹时刻' }} title={{ en: 'The slow hierarchy catches up', zh: '慢速增长层次追上来了' }}>
        <P
          zh={<>回忆第 4 章的慢速增长层次：<M t="g_0(n)=0" />，<M t="g_{\alpha+1}(n)=g_\alpha(n)+1" />，<M t="g_\lambda(n)=g_{\lambda[n]}(n)" />。在 <M t="\varepsilon_0" /> 以下，它只是“把 <M t="\omega" /> 换成 <M t="n" />”。</>}
          en={<>Recall Chapter 4’s slow-growing hierarchy: <M t="g_0(n)=0" />, <M t="g_{\alpha+1}(n)=g_\alpha(n)+1" />, <M t="g_\lambda(n)=g_{\lambda[n]}(n)" />. Below <M t="\varepsilon_0" /> it just “replaces <M t="\omega" /> by <M t="n" />.”</>}
        />
        <P
          zh={<>它慢得可怜：<M t="g_{\varepsilon_0}(n)=n\uparrow\uparrow n" />，只相当于快速增长层次的 <M t="f_3" />。照这个速度，它还有希望追上 <M t="f_\alpha" /> 吗？</>}
          en={<>It is pitifully slow: <M t="g_{\varepsilon_0}(n)=n\uparrow\uparrow n" />, comparable only to <M t="f_3" /> in the fast-growing hierarchy. At this pace, can it ever catch <M t="f_\alpha" />?</>}
        />
        <Widget
          title={{ en: 'The race: f_α against g_β', zh: '赛跑：f_α 对 g_β' }}
          hint={{ en: 'For each FGH level, the slow hierarchy’s matching index. Landmarks are evenly spaced, not to scale.', zh: '对每个 FGH 层级，标出与之匹配的 SGH 下标。路标等距排列，不按比例。' }}
        >
          <CatchUp />
        </Widget>
        <Thm name={{ en: 'Girard 1981', zh: 'Girard 1981' }}>
          <B
            zh={<p>在合适的基本列系统下：(i) <M t="g_{\text{BHO}}" /> 与 <M t="f_{\varepsilon_0}" /> 增长率相当；(ii) 第一个满足 <M t="g_\alpha\approx f_\alpha" /> 的 <M t="\alpha" /> 是 <M t="\psi(\Omega_\omega)=" /> BO。</p>}
            en={<p>For suitable systems of fundamental sequences: (i) <M t="g_{\text{BHO}}" /> grows like <M t="f_{\varepsilon_0}" />; (ii) the first <M t="\alpha" /> with <M t="g_\alpha\approx f_\alpha" /> is <M t="\psi(\Omega_\omega)=" /> BO.</p>}
          />
        </Thm>
        <P
          zh={<>书中给出的精确形式是 <M t="f_{\text{BO}}(n-1)\le g_{\text{BO}}(n)\le f_{\text{BO}}(n+1)" />。在 BO 这一点上，用数从下往上造出一个 BO 级别快的函数，和用 <M t="\omega" /> 从下往上造出 BO 本身，难度完全相同。</>}
          en={<>The book states it as <M t="f_{\text{BO}}(n-1)\le g_{\text{BO}}(n)\le f_{\text{BO}}(n+1)" />. At BO, building a BO-fast function out of numbers is exactly as hard as building the ordinal BO out of <M t="\omega" />.</>}
        />
        <Caution>
          <L
            zh={<>追平点强烈依赖基本列的选取。Cichon 和 Wainer 的基本列在 <M t="\varepsilon_0" /> 处就追平；某些 Buchholz 式的基本列甚至在 <M t="\omega^2" /> 就追平。Wainer 本人曾误以为追平点在 <M t="\Gamma_0" />，1989 年才公开更正。“在 BO 处追平”是对“自然”基本列而言的。</>}
            en={<>The catch-up point depends heavily on the fundamental sequences. With Cichon and Wainer’s, the hierarchies already meet at <M t="\varepsilon_0" />; with some Buchholz-style ones, as early as <M t="\omega^2" />. Wainer himself once believed the meeting point was <M t="\Gamma_0" /> and published the correction in 1989. “They meet at BO” refers to the “natural” fundamental sequences.</>}
          />
        </Caution>
        <KeyIdea>
          <L
            zh={<>FGH 本身就是一次折叠：把 <M t="\omega" /> 折成自然数 <M t="n" />。<M t="\psi" /> 把 <M t="\Omega" /> 折成递归序数，<M t="\psi_1" /> 把 <M t="\Omega_2" /> 折成 <M t="\Omega" /> 之上的序数……到了 BO，折叠已经叠了无穷多层，最底下那一层（数）就变得无关紧要了。书中称之为大数学最深刻的一次转变：从以数为中心，转向<b>以序数为中心</b>。</>}
            en={<>FGH is itself a collapse: it folds <M t="\omega" /> into the number <M t="n" />. <M t="\psi" /> folds <M t="\Omega" /> into recursive ordinals, <M t="\psi_1" /> folds <M t="\Omega_2" /> into ordinals above <M t="\Omega" />, and so on. At BO infinitely many folds are stacked, and the bottom layer — numbers — stops mattering. The book calls this the deepest shift in googology so far: from a number-centred view to an <b>ordinal-centred</b> one.</>}
          />
        </KeyIdea>
        <Expand kind="deeper" title={{ en: 'Optional: the θ / ϑ notation', zh: '选读：θ / ϑ 记号' }}>
          <P
            zh={<>你在别处还会遇到 Feferman 的 <M t="\theta" /> 和 Weiermann 的 <M t="\vartheta" />。它们是另一类折叠函数，用法各有约定，本课程不会用到。只举一个例子：第 7 章说 TREE 的增长率“刚好在 SVO 之上”，用 <M t="\vartheta" /> 记号可以精确写成 <M t="\vartheta(\Omega^\omega\omega)" />（社区估计）。</>}
            en={<>Elsewhere you will meet Feferman’s <M t="\theta" /> and Weiermann’s <M t="\vartheta" />. They are other collapsing functions with their own conventions, and this course never uses them. One example: Chapter 7 placed TREE “just above SVO”; in <M t="\vartheta" /> notation that is <M t="\vartheta(\Omega^\omega\omega)" /> (a community estimate).</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="open" kicker={{ en: 'Where we stand', zh: '此刻的位置' }} title={{ en: 'The ruler so far, and what is open', zh: '尺子上的新刻度，以及悬而未决的问题' }}>
        <MB t="\cdots<\text{LVO}<\text{BHO}=\psi(\varepsilon_{\Omega+1})<\psi(\Omega_2)<\cdots<\text{BO}=\psi(\Omega_\omega)" />
        <MB t="<\text{TFBO}=\psi(\psi_\omega(0))<\text{EBO}<\cdots<\omega_1^{\mathrm{CK}}" />
        <P
          zh={<>本章新增的刻度都是递归序数，远在 <M t="\omega_1^{\mathrm{CK}}" /> 之下。<M t="\Omega" /> 只是借来的“脚手架”，最后折叠出来的仍是算法装得下的序数。</>}
          en={<>Every new mark in this chapter is a recursive ordinal, far below <M t="\omega_1^{\mathrm{CK}}" />. <M t="\Omega" /> is only borrowed scaffolding; what comes out of the fold is still an ordinal an algorithm can hold.</>}
        />
        <OpenProblem title={{ en: 'A rigorous, unified googological OCF', zh: '严格、统一的大数 OCF' }}>
          <P
            zh={<>EBO 以上，社区的 OCF 用法“非常混乱”，各人的折叠规则不同。证明论里的 OCF 严格，但很少有大数爱好者真正掌握。把两者接起来，是悬而未决的工作。</>}
            en={<>Above EBO, community OCF usage is “very chaotic,” with everyone using different collapsing rules. Proof-theoretic OCFs are rigorous but rarely mastered by googologists. Connecting the two is unfinished work.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Do the recursive rules match the definition?', zh: '递归规则与集合论定义一致吗？' }}>
          <P
            zh={<>社区实际使用的是递归的折叠规则（找层、改名、基本列），真正的 OCF 却是用集合论的砖块定义的。书中通过逐项枚举论证两者一致，但这不是证明。</>}
            en={<>The community actually uses recursive folding rules (find the layer, rename, fundamental sequences), while a genuine OCF is defined set-theoretically by bricks. The book argues by enumeration that the two agree, but that is not a proof.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Exact growth of BH(n) and the catching function', zh: 'BH(n) 的确切增长率与追平函数' }}>
          <P
            zh={<>“BH 增长率 ≈ TFBO”是“增长率 ≈ PTO”这一经验法则的推论，并未被严格证明。书中还定义了追平函数 <M t="C(\alpha)" />（<M t="C(0)=\psi(\Omega_\omega)" />，<M t="C(1)=\psi(\Omega_{\Omega_\omega})" />……），它的一般行为未知。</>}
            en={<>“BH grows like TFBO” follows the heuristic “growth ≈ PTO” and is not rigorously proved. The book also defines a catching function <M t="C(\alpha)" /> (<M t="C(0)=\psi(\Omega_\omega)" />, <M t="C(1)=\psi(\Omega_{\Omega_\omega})" />, …) whose general behaviour is unknown.</>}
          />
        </OpenProblem>
        <KeyIdea>
          <L
            zh={<>回头看本章最核心的动作：找到坏根，复制坏部，副本改名。它和第 5 章初等序列的规则是同一个骨架。下一章把 OCF 剥得只剩这副骨架，变成一个纯粹的序列游戏——Bashicu 矩阵。(0,0)(1,1)(2,2)(3,3)…… 一路走到 BO，然后远远越过它。</>}
            en={<>Look back at the core move of this chapter: find the bad root, copy the bad part, rename the copies. It is the same skeleton as Chapter 5’s primitive sequences. Next chapter strips the OCF down to that skeleton and turns it into a pure sequence game — the Bashicu matrix system. (0,0)(1,1)(2,2)(3,3)… walks up to BO, and then far beyond.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
