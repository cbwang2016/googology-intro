import './ch05.css'
import katex from 'katex'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { BrokenRule, Countdown, Expander, MountainTree, Odometer, ShellTable } from './widgets'

/** Display math with a narrower layout for phones (both are top-level .mb blocks; CSS shows one). */
function MBR({ wide, narrow }: { wide: string; narrow: string }) {
  const r = (x: string) => ({ __html: katex.renderToString(x, { displayMode: true, throwOnError: false }) })
  return (
    <>
      <div className="mb c05-wide" dangerouslySetInnerHTML={r(wide)} />
      <div className="mb c05-narrow" dangerouslySetInnerHTML={r(narrow)} />
    </>
  )
}

export default function Chapter05() {
  return (
    <>
      <Prereq
        items={[
          { en: <>The two moves of googology: iterate (mark +1) and diagonalize (jump to a limit) — Chapter 2.</>, zh: <>大数的两个基本动作：迭代（刻度 +1）与对角化（跳到极限）——第 2 章。</> },
          { en: <>Ordinals up to <M t="\varepsilon_0" />, Cantor normal form, and the theorem that there is no infinite strictly decreasing sequence of ordinals — Chapter 3.</>, zh: <>直到 <M t="\varepsilon_0" /> 的序数、Cantor 标准型，以及定理“不存在无穷严格递降的序数序列”——第 3 章。</> },
          { en: <>Standard fundamental sequences <M t="\alpha[n]" /> (Def 3.6), the fast-growing hierarchy <M t="f_\alpha" />, the Hardy hierarchy <M t="H_\alpha" />, the convention <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />, and <M t="f_{\omega+1}(64)>G(64)" /> — Chapter 4.</>, zh: <>标准基本列 <M t="\alpha[n]" />（定义 3.6）、快速增长层次 <M t="f_\alpha" />、Hardy 层次 <M t="H_\alpha" />、约定 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />，以及 <M t="f_{\omega+1}(64)>G(64)" />——第 4 章。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="odometer" kicker={{ en: 'Linear arrays', zh: '线性数阵' }} title={{ en: 'An odometer that counts in base ω', zh: '逢 ω 进一的里程表' }}>
        <P en="The fast-growing hierarchy turns an ordinal index and a finite input into a number. Can we package that machinery into a short string of integers? Watch a string expand while its ordinal label falls: the expansion makes the number; the falling label explains why it finishes." zh="快速增长层次把序数索引和有限输入变成一个数。能否把这套机器装进一小串整数？接下来，一边看字符串膨胀，一边看它的序数标签下降：展开产生大数，下降解释它为何终止。" />
        <P
          zh={<>到第 2 章为止，每登上一个新刻度都要发明一个新符号：多一个箭头，多一层 Graham。这样爬下去，符号会先用完。</>}
          en={<>Up to Chapter 2, every new mark on the ruler cost a new symbol: one more arrow, one more Graham layer. Climb like that and you run out of symbols long before you run out of ruler.</>}
        />
        <P
          zh={<>第一个系统化的办法是给函数挂上一<b>串</b>下标，像汽车的里程表一样：<M t="F_{a_m,\ldots,a_1,a_0}(n)" />。最右边一位走得最快，往左越来越慢。</>}
          en={<>The first systematic fix is to give a function a whole <b>row</b> of indices, like a car’s odometer: <M t="F_{a_m,\ldots,a_1,a_0}(n)" />. The rightmost wheel turns fastest; each wheel to the left turns more slowly.</>}
        />
        <Thm kind="definition" name={{ en: 'Linear arrays (《大数理论》 Def 2.13)', zh: '线性数阵（《大数理论》定义 2.13）' }}>
          <MB t="\begin{aligned}&(1)\quad F_0(n)=n+1\\&(2)\quad F_{\#,m+1}(n)=F_{\#,m}^{\,n}(n)\\&(3)\quad F_{\#,m+1,0,Z}(n)=F_{\#,m,n,Z}(n)\end{aligned}" />
          <B
            zh={<p><M t="\#" /> 是任意一串数（可以为空），<M t="Z" /> 是一串 0（可以为空），最前面的 0 自动略去。</p>}
            en={<p><M t="\#" /> is any finite row (possibly empty), <M t="Z" /> is a run of zeros (possibly empty), and leading zeros are dropped.</p>}
          />
        </Thm>
        <P
          zh={<>规则 (2) 是老朋友“迭代 <M t="n" /> 次”，刻度 +1。规则 (3) 是<b>进位</b>：某一位减 1，紧挨着它的那个 0 变成 <M t="n" />。这正是对角化——借位时你借到的不是 9，而是 <M t="n" />。</>}
          en={<>Rule (2) is our old friend “iterate <M t="n" /> times”: mark +1. Rule (3) is a <b>carry</b>: one wheel goes down by 1 and the zero right after it becomes <M t="n" />. That is diagonalization — when you borrow, you get <M t="n" />, not 9.</>}
        />
        <Widget title={{ en: 'The base-ω odometer', zh: 'ω 进制里程表' }} hint={{ en: 'Build indices with the only two moves there are. The line under the index shows the rule that defines it.', zh: '只用这两种动作搭出下标。下标下面那行是定义它的规则。' }}>
          <Odometer />
        </Widget>
        <Thm kind="fact" name={{ en: '(arrays are base-ω numerals)', zh: '（数阵就是 ω 进制数）' }} status="proved">
          <MBR wide="F_{a_m,\ldots,a_1,a_0}(n)=f_{\omega^m\cdot a_m+\cdots+\omega\cdot a_1+a_0}(n)." narrow="\begin{aligned}&F_{a_m,\ldots,a_1,a_0}(n)\\&\ =f_{\omega^m\cdot a_m+\cdots+\omega\cdot a_1+a_0}(n).\end{aligned}" />
        </Thm>
        <Proof>
          <L
            zh={<>两边的规则逐条吻合：(1) 是 <M t="f_0" />；(2) 是 FGH 的后继规则；(3) 正是定义 3.6 的基本列，例如 <M t="(\omega^2\cdot 3)[n]=\omega^2\cdot 2+\omega\cdot n" /> 对应 <M t="F_{3,0,0}(n)=F_{2,n,0}(n)" />。</>}
            en={<>The rules match line by line: (1) is <M t="f_0" />; (2) is the FGH successor rule; (3) is exactly Def 3.6, e.g. <M t="(\omega^2\cdot 3)[n]=\omega^2\cdot 2+\omega\cdot n" /> matches <M t="F_{3,0,0}(n)=F_{2,n,0}(n)" />.</>}
          />
        </Proof>
        <P
          zh={<>所以有 <M t="m+1" /> 位的数阵恰好走遍 <M t="\omega^{m+1}" /> 以下的刻度，而所有数阵合起来停在 <M t="\omega^\omega" /> 之下。这是 Jonathan Bowers 的“线性数阵”经本书简化后的版本，强度相同。</>}
          en={<>So arrays with <M t="m+1" /> wheels cover exactly the marks below <M t="\omega^{m+1}" />, and all arrays together stop just below <M t="\omega^\omega" />. This is the book’s streamlined version of Jonathan Bowers’ linear arrays, with the same strength.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="prss" kicker={{ en: 'A new challenger', zh: '新挑战者' }} title={{ en: 'A copying game', zh: '一个复制游戏' }}>
        <P
          zh={<>2014 年，日本大数爱好者 Bashicu 在 2channel 论坛的“巨大数探索”帖里贴出一段 BASIC 程序。它只用一串自然数，却一口气越过了数阵、越过了 <M t="\omega^\omega" />，一直走到 <M t="\varepsilon_0" />。</>}
          en={<>In 2014 the Japanese googologist Bashicu posted a short BASIC program to the big-number thread on the 2channel forum. It used nothing but a list of natural numbers, yet it sailed past arrays, past <M t="\omega^\omega" />, all the way to <M t="\varepsilon_0" />.</>}
        />
        <P
          zh={<>日文原名“原始数列”，经英文 Primitive Sequence System 转译，中文社区习惯称它<Term en="primitive sequence system (PrSS)" zh="初等序列" />。我们用本书的教学版：序列写在圆括号里，自变量写在方括号里，例如 <M t="(0,1,2)[3]" />。</>}
          en={<>The Japanese name is 原始数列; in English it is the <Term en="primitive sequence system (PrSS)" zh="初等序列" />. We use the book’s teaching version: the sequence goes in round brackets and the argument in square brackets, as in <M t="(0,1,2)[3]" />.</>}
        />
        <H3 en="Zeros are iterations" zh="0 就是迭代" />
        <P
          zh={<>从刻度 0 出发：<M t="()[n]=n+1" />。迭代 <M t="n" /> 次，刻度 +1——但这里不把“0”改成“1”，而是在末尾<b>再添一个 0</b>：</>}
          en={<>Start at mark 0: <M t="()[n]=n+1" />. Iterating <M t="n" /> times adds 1 to the mark — but instead of changing a digit, we <b>append a 0</b>:</>}
        />
        <MBR wide="(0)[n]=()^{n}[n]\sim 1,\qquad (0,0)[n]=(0)^{n}[n]\sim 2,\qquad (\underbrace{0,\ldots,0}_{m})[n]\sim m." narrow="\begin{gathered}(0)[n]=()^{n}[n]\sim 1,\\ (0,0)[n]=(0)^{n}[n]\sim 2,\\ (\underbrace{0,\ldots,0}_{m})[n]\sim m.\end{gathered}" />
        <H3 en="Folding is diagonalization" zh="折叠就是对角化" />
        <P
          zh={<>要越过所有有限刻度，就对角化：用 <M t="n" /> 个 0。PrSS 的妙处在于记法——把重复的“循环节” 0 只留一个，后面再添一项“循环节首项 + 1”：</>}
          en={<>To pass every finite mark, diagonalize: use <M t="n" /> zeros. PrSS’s trick is the notation — keep one copy of the repeating block “0” and append one term equal to (first term of the block) + 1:</>}
        />
        <MB t="(0,1)[n]=(\underbrace{0,0,\ldots,0}_{n})[n]\sim\omega." />
        <P
          zh={<>同样的折叠一再发生：<M t="(0,1,0,1)" /> 折叠了跟在 <M t="(0,1)" /> 后面的那串 0；<M t="(0,1,1)" /> 折叠了循环节 <M t="0,1" />；<M t="(0,1,2)" /> 折叠了循环节 <M t="1" />。</>}
          en={<>The same fold happens again and again: <M t="(0,1,0,1)" /> folds the zeros that follow <M t="(0,1)" />; <M t="(0,1,1)" /> folds the block <M t="0,1" />; <M t="(0,1,2)" /> folds the block <M t="1" />.</>}
        />
        <H3 en="The rules" zh="正式规则" />
        <Thm kind="definition" name={{ en: 'PrSS (《大数理论》 Def 2.16)', zh: '初等序列（《大数理论》定义 2.16）' }}>
          <MB t="\begin{aligned}&(1)\quad ()[n]=n+1\\&(2)\quad (\#,0)[n]=(\#)^{n}[n]\\&(3)\quad (\#_1,a_i,\#_2,a_m)[n]\ \ (a_m\neq 0)\\&\qquad=(\#_1,\underbrace{a_i,\#_2,\ \ldots,\ a_i,\#_2}_{n})[n]\end{aligned}" />
          <B
            zh={<p>其中 <M t="a_i" /> 是 <M t="a_m" /> 左边、从右往左第一个比 <M t="a_m" /> <b>小</b>的项（在标准表达式里它恰好等于 <M t="a_m-1" />）。<M t="(\#)^n[n]" /> 表示把 <M t="(\#)[\cdot]" /> 迭代 <M t="n" /> 次。</p>}
            en={<p>Here <M t="a_i" /> is the first term to the left of <M t="a_m" /> that is <b>smaller</b> than <M t="a_m" /> (in standard expressions it equals <M t="a_m-1" />), and <M t="(\#)^n[n]" /> means <M t="(\#)[\cdot]" /> iterated <M t="n" /> times.</p>}
          />
        </Thm>
        <H3 en="Vocabulary for the next five chapters" zh="后面五章都要用的词" />
        <B
          zh={
            <ul>
              <li>某一项的<Term en="parent" zh="父项" />：它左边离它最近、比它小的项。</li>
              <li><Term en="bad root" zh="坏根" /> <M t="a_i" />：末项的父项。</li>
              <li><Term en="bad part" zh="坏部" />：从坏根到末项之前的那一段 <M t="a_i,\#_2" />，也就是被复制的循环节。</li>
              <li><Term en="good part" zh="好部" />：坏根之前、原样保留的 <M t="\#_1" />。</li>
            </ul>
          }
          en={
            <ul>
              <li>The <Term en="parent" zh="父项" /> of a term: the nearest term to its left that is smaller.</li>
              <li>The <Term en="bad root" zh="坏根" /> <M t="a_i" />: the parent of the last term.</li>
              <li>The <Term en="bad part" zh="坏部" />: the stretch <M t="a_i,\#_2" /> from the bad root up to (not including) the last term — the block that gets copied.</li>
              <li>The <Term en="good part" zh="好部" />: everything <M t="\#_1" /> before the bad root, kept as is.</li>
            </ul>
          }
        />
        <H3 en="One expansion, dissected" zh="解剖一次展开" />
        <Widget title={{ en: 'Anatomy of one expansion', zh: '一次展开的解剖图' }} hint={{ en: 'Edit the sequence or pick one. The ordinal line checks the result against Def 3.6.', zh: '编辑序列或选一个现成的。最下面一行用定义 3.6 核对结果。' }}>
          <Expander />
        </Widget>
        <H3 en="Four digits beat Graham’s number" zh="四个数字打败 Graham 数" />
        <Thm name={{ en: '(a four-term sequence)', zh: '（一个四项序列）' }}>
          <B zh={<p><M t="(0,1,0,0)[3]>G(64)" />，即 Graham 数。</p>} en={<p><M t="(0,1,0,0)[3]>G(64)" />, Graham’s number.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>规则 (1)(2) 与 FGH 的 <M t="f_0" /> 和后继规则一样，所以 <M t="m" /> 个 0 给出 <M t="f_m" />。于是 <M t="(0,1)[x]=f_x(x)=f_\omega(x)" />，<M t="(0,1,0)=f_{\omega+1}" />，<M t="(0,1,0,0)[3]=f_{\omega+2}(3)=f_{\omega+1}(f_{\omega+1}(f_{\omega+1}(3)))" />。由于 <M t="f_{\omega+1}(3)\ge f_\omega(3)=f_3(3)>64" />，且 <M t="f_{\omega+1}" /> 严格递增（第 4 章），得 <M t="f_{\omega+2}(3)>f_{\omega+1}(64)>G(64)" />，最后一步是第 4 章的定理。</>}
            en={<>Rules (1)–(2) are FGH’s <M t="f_0" /> and successor rule, so <M t="m" /> zeros give <M t="f_m" />. Hence <M t="(0,1)[x]=f_x(x)=f_\omega(x)" />, <M t="(0,1,0)=f_{\omega+1}" />, and <M t="(0,1,0,0)[3]=f_{\omega+2}(3)=f_{\omega+1}(f_{\omega+1}(f_{\omega+1}(3)))" />. Since <M t="f_{\omega+1}(3)\ge f_\omega(3)=f_3(3)>64" /> and <M t="f_{\omega+1}" /> is strictly increasing (Chapter 4), we get <M t="f_{\omega+2}(3)>f_{\omega+1}(64)>G(64)" />, the last step being Chapter 4’s theorem.</>}
          />
        </Proof>
        <P
          zh={<>而 <M t="(0,1,2)" /> 只用了三个不同的数字，就已经站在 <M t="\omega^\omega" />——全部线性数阵的极限。</>}
          en={<>And <M t="(0,1,2)" />, with just three distinct digits, already stands at <M t="\omega^\omega" /> — the limit of all linear arrays.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="mountains" kicker={{ en: 'Seeing the structure', zh: '看见结构' }} title={{ en: 'Mountains, trees and ordinals', zh: '山、树与序数' }}>
        <P
          zh={<>把外壳（方括号和迭代）拿掉，只看序列本身。规则 (2) 变成“+1”，规则 (3) 变成“取极限”，序列就直接成了<b>序数</b>的名字：</>}
          en={<>Strip off the shell — the square brackets and the iteration — and look at the sequence alone. Rule (2) becomes “+1”, rule (3) becomes “take the limit”, and the sequence becomes a name for an <b>ordinal</b>:</>}
        />
        <Thm kind="definition" name={{ en: 'PrSS as an ordinal notation (Def 2.18)', zh: '作为序数记号的初等序列（定义 2.18）' }}>
          <MBR wide="\begin{aligned}&()=0,\qquad (\#,0)=(\#)+1,\\&(\#_1,a_i,\#_2,a_m)=\sup\{(\#_1,a_i,\#_2),\ (\#_1,a_i,\#_2,a_i,\#_2),\ \ldots\}\quad(a_m\neq0).\end{aligned}" narrow="\begin{aligned}&()=0,\qquad (\#,0)=(\#)+1,\\&(\#_1,a_i,\#_2,a_m)\quad(a_m\neq0)\\&\ =\sup\{(\#_1,a_i,\#_2),\\&\qquad (\#_1,a_i,\#_2,a_i,\#_2),\ \ldots\}.\end{aligned}" />
        </Thm>
        <MBR wide="\begin{aligned}(0)&=1 & (0,1)&=\omega & (0,1,0,1)&=\omega\cdot2 & (0,1,1)&=\omega^2\\ (0,1,2)&=\omega^\omega & (0,1,2,1)&=\omega^{\omega+1} & (0,1,2,2)&=\omega^{\omega^2} & (0,1,2,3)&=\omega^{\omega^\omega}\end{aligned}" narrow="\begin{aligned}(0)&=1 & (0,1)&=\omega\\ (0,1,0,1)&=\omega\cdot2 & (0,1,1)&=\omega^2\\ (0,1,2)&=\omega^\omega & (0,1,2,1)&=\omega^{\omega+1}\\ (0,1,2,2)&=\omega^{\omega^2} & (0,1,2,3)&=\omega^{\omega^\omega}\end{aligned}" />
        <H3 en="Reading a sequence" zh="读出一个序列" />
        <P
          zh={<>有一个简单的翻译算法：在每个 0 处切开，各段用加号相连；单独的 <M t="(0)" /> 读作 1；<M t="(0,X)" /> 读作 <M t="\omega^{X'}" />，其中 <M t="X'" /> 是把 <M t="X" /> 每项减 1，再递归地读。</>}
          en={<>There is a simple translation: cut before every 0 and join the pieces with plus signs; a lone <M t="(0)" /> reads as 1; <M t="(0,X)" /> reads as <M t="\omega^{X'}" />, where <M t="X'" /> is <M t="X" /> with every term lowered by 1, read recursively.</>}
        />
        <MBR wide="(0,1,2,2,\;0,1,2,1,1,\;0,1,2,1,1,\;0,1,1,1)=\omega^{\omega^2}+\omega^{\omega+2}\cdot2+\omega^3." narrow="\begin{gathered}(0,1,2,2,\;0,1,2,1,1,\\ 0,1,2,1,1,\;0,1,1,1)\\ =\omega^{\omega^2}+\omega^{\omega+2}\cdot2+\omega^3.\end{gathered}" />
        <H3 en="Mountains and trees" zh="山形图与树" />
        <P
          zh={<>更好的办法是<b>画出来</b>。把每一项画成一根高度为“值 + 1”的柱子，并把它连到它的父项。这些连线构成一棵根在下面的树——这就是第 6 章九头蛇的身体。</>}
          en={<>Better still, <b>draw it</b>. Make each term a column of height value + 1 and link it to its parent. The links form a tree with its root at the bottom — the very body of Chapter 6’s hydra.</>}
        />
        <P
          zh={<>树的值：只有根的树是 0；若根上长着子树 <M t="H_1,\ldots,H_k" />，值就是 <M t="\omega^{H_1}+\cdots+\omega^{H_k}" />。</>}
          en={<>The value of a tree: a bare root is 0; a root carrying subtrees <M t="H_1,\ldots,H_k" /> is worth <M t="\omega^{H_1}+\cdots+\omega^{H_k}" />.</>}
        />
        <Widget title={{ en: 'Sequence ↔ mountain ↔ tree ↔ ordinal', zh: '序列 ↔ 山 ↔ 树 ↔ 序数' }} hint={{ en: 'Hover a column to find its node. Each colour is one block between consecutive 0s — one summand of the ordinal.', zh: '鼠标指向柱子，找到对应的节点。每种颜色是两个 0 之间的一段，也就是序数的一个加项。' }}>
          <MountainTree />
        </Widget>
        <H3 en="Standard expressions" zh="标准表达式" />
        <P
          zh={<>不是每个序列都“规范”。本书把从极限 <M t="(0,1,2,3,\ldots)" /> 出发、经展开和截断能得到的序列叫<Term en="standard expression" zh="标准表达式" />（定义 2.19）。标准表达式一定从 0 开始、每步至多升 1（定理 2.1），但反过来不成立。</>}
          en={<>Not every sequence is “canonical”. The book calls a sequence a <Term en="standard expression" zh="标准表达式" /> if it can be reached from the limit <M t="(0,1,2,3,\ldots)" /> by expanding and truncating (Def 2.19). Standard expressions start at 0 and climb by at most 1 per step (Theorem 2.1) — but the converse fails.</>}
        />
        <P
          zh={<>在树的语言里，标准表达式恰好是每个节点上各分支从左到右<b>不增</b>的那些，也就是由 Cantor 标准型翻译回来的序列。小部件就是这样判断的；我们也用程序验证过，长度 7 以内两种说法完全一致。</>}
          en={<>In tree language, the standard expressions are exactly those whose branches are in <b>non-increasing</b> order at every node — the sequences you get back from Cantor normal forms. That is the widget’s test; we also checked by program that both descriptions agree for all sequences up to length 7.</>}
        />
        <Quiz
          q={{ zh: <p><M t="(0,1,1,2)" /> 和 <M t="(0,1,2)" /> 哪个代表的序数更大？</p>, en: <p>Which names the larger ordinal: <M t="(0,1,1,2)" /> or <M t="(0,1,2)" />?</p> }}
          options={[
            { zh: <p><M t="(0,1,1,2)" />：它更长，还多了一个 1</p>, en: <p><M t="(0,1,1,2)" />: it is longer and has an extra 1</p> },
            { zh: <p><M t="(0,1,2)" /></p>, en: <p><M t="(0,1,2)" /></p> },
            { zh: <p>一样大</p>, en: <p>They are equal</p> },
          ]}
          answer={2}
          explain={{
            zh: <p>翻译一下：<M t="(0,1,1,2)=\omega^{(0,0,1)}=\omega^{1+\omega}=\omega^{\omega}" />。多出来的那个 1 被 <M t="1+\omega=\omega" /> 吞掉了。展开也一样：<M t="(0,1,1,2)[n]=(0,1,1,1,\ldots,1)" />，与 <M t="(0,1,2)" /> 的展开只差开头那一项。它是一个非标准表达式，标准形就是 <M t="(0,1,2)" />。</p>,
            en: <p>Translate: <M t="(0,1,1,2)=\omega^{(0,0,1)}=\omega^{1+\omega}=\omega^{\omega}" />. The extra 1 is swallowed by <M t="1+\omega=\omega" />. Expanding agrees: <M t="(0,1,1,2)[n]=(0,1,1,1,\ldots,1)" /> differs from the expansion of <M t="(0,1,2)" /> by one term at the start. It is non-standard, and its standard form is <M t="(0,1,2)" />.</p>,
          }}
        />
        <H3 en="Expansion = fundamental sequence" zh="展开 = 基本列" />
        <Thm kind="fact" name={{ en: '(the rules agree with Def 3.6)', zh: '（展开规则与定义 3.6 一致）' }} status="proved">
          <B
            zh={<p>若 <M t="s" /> 是标准表达式、读作序数 <M t="\alpha" />，则对每个 <M t="n" />，按规则 (3) 展开得到的 <M t="s[n]" /> 读作 <M t="\alpha[n]" />（第 4 章的标准基本列）。因此本书的外壳给出 <M t="(s)[n]=f_\alpha(n)" />。</p>}
            en={<p>If a standard expression <M t="s" /> reads as <M t="\alpha" />, then for every <M t="n" /> its rule-(3) expansion reads as <M t="\alpha[n]" />, Chapter 4’s standard fundamental sequence. Hence the book’s shell gives <M t="(s)[n]=f_\alpha(n)" />.</p>}
          />
        </Thm>
        <Expand kind="proof" title={{ en: 'Why expansion equals the fundamental sequence', zh: '为什么展开恰好是基本列' }}>
          <P
            zh={<>末项是一片叶子，它的父项正是坏根 <M t="r" />。在 <M t="r" /> 的子树里，这片叶子是最后一个分支，贡献 <M t="\omega^0=1" />，所以 <M t="r" /> 的子树值为 <M t="\omega^{\gamma+1}" />，其中 <M t="\gamma" /> 是 <M t="r" /> 其余分支之和。</>}
            en={<>The last term is a leaf whose parent is the bad root <M t="r" />. Inside <M t="r" />’s subtree that leaf is the last branch and contributes <M t="\omega^0=1" />, so <M t="r" />’s subtree is worth <M t="\omega^{\gamma+1}" />, where <M t="\gamma" /> sums <M t="r" />’s other branches.</>}
          />
          <P
            zh={<>删去叶子后 <M t="r" /> 的子树值为 <M t="\omega^\gamma" />；坏部恰好是这棵子树，复制成 <M t="n" /> 份并排挂在 <M t="r" /> 的父节点上，得到 <M t="\omega^\gamma\cdot n=\omega^{\gamma+1}[n]" />（定义 3.6）。</>}
            en={<>Removing the leaf leaves <M t="\omega^\gamma" />; the bad part is exactly this subtree, and <M t="n" /> copies side by side under <M t="r" />’s parent are worth <M t="\omega^\gamma\cdot n=\omega^{\gamma+1}[n]" /> (Def 3.6).</>}
          />
          <P
            zh={<>这棵子树位于树的最右边那条“脊柱”上。沿脊柱往下回到根，每一层都是“前面的项 + 最后一项”，而定义 3.6 的两条规则 <M t="(\beta+\lambda)[n]=\beta+\lambda[n]" /> 和 <M t="\omega^\lambda[n]=\omega^{\lambda[n]}" /> 正好把这个改动一层层传到根。标准表达式各分支有序，保证每一层都是 Cantor 标准型。外壳部分：规则 (1)(2) 就是 FGH 的前两条规则，对 <M t="\alpha" /> 做超限归纳即得 <M t="(s)[n]=f_\alpha(n)" />。</>}
            en={<>That subtree hangs on the rightmost “spine” of the tree. Walking down the spine to the root, every level has the shape “earlier terms + last term”, and Def 3.6’s rules <M t="(\beta+\lambda)[n]=\beta+\lambda[n]" /> and <M t="\omega^\lambda[n]=\omega^{\lambda[n]}" /> carry the change down level by level. Sorted branches guarantee that every level is in Cantor normal form. For the shell: rules (1)–(2) are FGH’s first two rules, and transfinite induction on <M t="\alpha" /> gives <M t="(s)[n]=f_\alpha(n)" />.</>}
          />
          <P
            zh={<>作为交叉检验，我们用程序对长度不超过 9 的全部标准表达式、<M t="n=0,\ldots,4" /> 共 3590 种情形逐一比对，全部吻合。</>}
            en={<>As a cross-check, a program compared both sides for every standard expression of length at most 9 and <M t="n=0,\ldots,4" /> — 3,590 cases, all equal.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="countdown" kicker={{ en: 'Watch it stop', zh: '看它停下' }} title={{ en: 'The great countdown', zh: '大倒数' }}>
        <P
          zh={<>展开会让序列越来越长，方括号里的数越来越大。它真的会停吗？</>}
          en={<>Expanding makes the sequence longer and the number in the brackets bigger. Does it really ever stop?</>}
        />
        <P
          zh={<>为了能把全过程放进一屏，我们换用本书介绍的“原版”外壳（定义 2.17）：末尾的 0 不再表示迭代，只让自变量 +1；规则 (3) 不变：</>}
          en={<>To fit a whole run on one screen we switch to the book’s “original” shell (Def 2.17): a trailing 0 no longer means iteration; it only adds 1 to the argument. Rule (3) is unchanged:</>}
        />
        <MB t="()[n]=n,\qquad (\#,0)[n]=(\#)[n+1]." />
        <H3 en="The countdown" zh="倒数开始" />
        <Widget title={{ en: 'Countdown with an ordinal altimeter', zh: '带序数高度计的倒数' }} hint={{ en: 'Each line carries the ordinal its sequence names; the altimeter shows where it sits. Step through (0,1,2)[2]; for (0,1,2)[3], switch on fast-forward.', zh: '每一行旁标着序列所读的序数，右边的高度计显示它在序数尺上的位置。先一步一步走 (0,1,2)[2]；走 (0,1,2)[3] 时请打开快进。' }}>
          <Countdown />
        </Widget>
        <P
          zh={<><M t="(0,1,2)[2]" /> 走 10 步停在 8。序数一路是 <M t="\omega^\omega,\ \omega^2,\ \omega\cdot2,\ \omega+2,\ \omega+1,\ \omega,\ 4,3,2,1,0" />——方括号里的数在涨，序数只在跌。</>}
          en={<><M t="(0,1,2)[2]" /> stops at 8 after 10 steps. Its ordinals run <M t="\omega^\omega,\ \omega^2,\ \omega\cdot2,\ \omega+2,\ \omega+1,\ \omega,\ 4,3,2,1,0" /> — the bracket keeps rising while the ordinal only falls.</>}
        />
        <P
          zh={<><M t="(0,1,2)[3]" /> 要长得多：它走到 <M t="(0,1,1)[3\times2^{27}]" />，即 <M t="(0,1,1)[402\,653\,184]" />，最后得到</>}
          en={<><M t="(0,1,2)[3]" /> runs much longer: it reaches <M t="(0,1,1)[3\times2^{27}]" />, that is <M t="(0,1,1)[402{,}653{,}184]" />, and finally</>}
        />
        <MBR wide="(0,1,2)[3]=3\cdot2^{27}\cdot2^{3\cdot2^{27}}=3\cdot2^{402\,653\,211}." narrow="\begin{aligned}(0,1,2)[3]&=3\cdot2^{27}\cdot2^{3\cdot2^{27}}\\&=3\cdot2^{402\,653\,211}.\end{aligned}" />
        <P
          zh={<>记住这个数。下一章它会在一个看似毫不相干的地方再次出现。</>}
          en={<>Remember this number. It will reappear in the next chapter, somewhere that looks completely unrelated.</>}
        />
        <KeyIdea>
          <L
            zh={<>序列可以变长，自变量可以爆炸，但它的序数<b>每一步都严格下降</b>。而第 3 章证明过：序数不存在无穷严格递降序列。所以倒数一定会结束。</>}
            en={<>The sequence may lengthen and the argument may explode, but its ordinal <b>strictly drops at every step</b>. And Chapter 3 proved that there is no infinite strictly decreasing sequence of ordinals. So the countdown must end.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="shell" kicker={{ en: 'Core and shell', zh: '内核与外壳' }} title={{ en: 'Same core, different shell', zh: '同一个内核，不同的外壳' }}>
        <P
          zh={<>两种外壳用的是同一条规则 (3)，只是对“末尾的 0”理解不同。本书的外壳给出 <M t="(s)[n]=f_\alpha(n)" />；原版外壳一步步对照第 4 章的 Hardy 层次（<M t="H_0(n)=n" />，<M t="H_{\alpha+1}(n)=H_\alpha(n+1)" />，极限处取基本列），得到 <M t="(s)[n]=H_\alpha(n)" />。</>}
          en={<>Both shells share rule (3); they differ only in what a trailing 0 means. The book’s shell gives <M t="(s)[n]=f_\alpha(n)" />. The original shell matches Chapter 4’s Hardy hierarchy step for step (<M t="H_0(n)=n" />, <M t="H_{\alpha+1}(n)=H_\alpha(n+1)" />, fundamental sequences at limits), so <M t="(s)[n]=H_\alpha(n)" />.</>}
        />
        <Widget title={{ en: 'Two shells side by side', zh: '两种外壳并排比较' }}>
          <ShellTable />
        </Widget>
        <P
          zh={<>每一行都相同：<M t="H_{\omega^\alpha}=f_\alpha" />（第 4 章）。Hardy 外壳要多走一层指数，<M t="\omega^\alpha\mapsto\alpha" />。在低处这差距很大：<M t="\omega" /> 对 1。</>}
          en={<>Every row matches: <M t="H_{\omega^\alpha}=f_\alpha" /> (Chapter 4). The Hardy shell needs one extra exponent, <M t="\omega^\alpha\mapsto\alpha" />. Low down that gap is large: <M t="\omega" /> versus 1.</>}
        />
        <Quiz
          q={{ zh: <p>Hardy 外壳在低处比 FGH 外壳弱一整层指数。到了 PrSS 的极限，原版 PrSS 的增长率比本书版本低多少？</p>, en: <p>Low down, the Hardy shell lags a whole exponent behind the FGH shell. At the limit of PrSS, how far behind is the original PrSS?</p> }}
          options={[
            { zh: <p>还是差一层：<M t="\log_\omega\varepsilon_0" /> 对 <M t="\varepsilon_0" /></p>, en: <p>Still one exponent: <M t="\log_\omega\varepsilon_0" /> vs <M t="\varepsilon_0" /></p> },
            { zh: <p>一点也不差：两者都是 <M t="\varepsilon_0" /></p>, en: <p>Not at all: both are <M t="\varepsilon_0" /></p> },
            { zh: <p>差得更多，因为差距会累积</p>, en: <p>Even more, because the gap accumulates</p> },
          ]}
          answer={1}
          explain={{
            zh: <p><M t="\varepsilon_0" /> 是 <M t="\alpha\mapsto\omega^\alpha" /> 的不动点：<M t="\omega^{\varepsilon_0}=\varepsilon_0" />。所以“多一层指数”在这里一文不值，两条曲线<b>追平</b>了。外壳在低处显得重要，在高处无关紧要。</p>,
            en: <p><M t="\varepsilon_0" /> is the fixed point of <M t="\alpha\mapsto\omega^\alpha" />: <M t="\omega^{\varepsilon_0}=\varepsilon_0" />. So “one more exponent” is worth nothing there, and the two curves <b>catch up</b>. The shell looks important low down and stops mattering higher up.</p>,
          }}
        />
        <KeyIdea>
          <L
            zh={<>本书的口号：<b>大数记号 = 序数内核 + 迭代外壳</b>。强度由内核里的序数结构决定；外壳只负责把序数“兑换”成数。</>}
            en={<>The book’s slogan: <b>big-number notation = ordinal core + iteration shell</b>. Strength comes from the ordinal structure of the core; the shell merely cashes ordinals into numbers.</>}
          />
        </KeyIdea>
        <Expand kind="deeper" title={{ en: 'Which shell is “original”?', zh: '哪个外壳才是“原版”？' }}>
          <P
            zh={<>本书把 Hardy 外壳（定义 2.17）称为原版。Bashicu 2014 年的程序在细节上又有所不同：它每一步都把方括号里的数平方，复制次数也随之变化。根据追平，这些差别都不影响极限 <M t="\varepsilon_0" />。</>}
            en={<>The book calls the Hardy shell (Def 2.17) the original. Bashicu’s 2014 program differed again in detail: it squared the number in the brackets at each step, which also changed the number of copies. By catching, none of these differences affect the limit <M t="\varepsilon_0" />.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="epsilon0" kicker={{ en: 'The limit', zh: '极限' }} title={{ en: 'The ladder to ε₀', zh: '通往 ε₀ 的梯子' }}>
        <P
          zh={<>序列 <M t="(0,1,2,\ldots,k)" /> 的树是一根直棍。直棍每长一节，序数就多一层指数：</>}
          en={<>The tree of <M t="(0,1,2,\ldots,k)" /> is a straight stick. Each extra segment adds one more storey to the exponent tower:</>}
        />
        <MBR wide="(0)=1,\quad (0,1)=\omega,\quad (0,1,2)=\omega^{\omega},\quad (0,1,2,3)=\omega^{\omega^{\omega}},\quad (0,1,\ldots,k)=\omega\uparrow\uparrow k." narrow="\begin{gathered}(0)=1,\quad (0,1)=\omega,\quad (0,1,2)=\omega^{\omega},\\ (0,1,2,3)=\omega^{\omega^{\omega}},\\ (0,1,\ldots,k)=\omega\uparrow\uparrow k.\end{gathered}" />
        <P
          zh={<>没有哪个有限序列能写出 <M t="\varepsilon_0" />：每个序列都在某个 <M t="\omega\uparrow\uparrow k" /> 之下。把梯子的高度也交给 <M t="n" />，就得到整个记号的对角线：</>}
          en={<>No finite sequence names <M t="\varepsilon_0" />: each one sits below some <M t="\omega\uparrow\uparrow k" />. Let the height of the ladder depend on <M t="n" /> too, and you get the diagonal of the whole notation:</>}
        />
        <MBR wide="F(n)=(0,1,2,\ldots,n)[n]=f_{\omega\uparrow\uparrow n}(n)=f_{\varepsilon_0}(n)." narrow="\begin{aligned}F(n)&=(0,1,2,\ldots,n)[n]\\&=f_{\omega\uparrow\uparrow n}(n)=f_{\varepsilon_0}(n).\end{aligned}" />
        <P
          zh={<>这就是 PrSS 的极限：<M t="(0,1,2,3,\ldots)=\varepsilon_0" />，它的强度是 <M t="\varepsilon_0" />。三条规则、一串自然数，就越过了第 3 章那座无限高的 <M t="\omega" /> 塔。</>}
          en={<>This is PrSS’s limit: <M t="(0,1,2,3,\ldots)=\varepsilon_0" />, and its strength is <M t="\varepsilon_0" />. Three rules and a list of natural numbers have climbed Chapter 3’s infinitely tall tower of <M t="\omega" />’s.</>}
        />
        <Expand kind="detail" title={{ en: 'The convention ε₀[n] = ω↑↑n', zh: '约定 ε₀[n] = ω↑↑n' }}>
          <P
            zh={<>本课程约定 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />（<M t="\omega\uparrow\uparrow0=1" />），这正好是 PrSS 的梯子：<M t="n+1" /> 项的直棍。本书在第 3 章用的是 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow(n-1)" />，相差一格。两种约定下的 <M t="f_{\varepsilon_0}" /> 满足 <M t="f^{\text{book}}_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow(n-1)}(n)\le f_{\varepsilon_0}(n)" />，且后者又被前者在 <M t="n+1" /> 处的值控制，增长率完全相同。</>}
            en={<>This course uses <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" /> (with <M t="\omega\uparrow\uparrow0=1" />), which is exactly PrSS’s ladder: a stick of <M t="n+1" /> terms. The book’s Chapter 3 uses <M t="\varepsilon_0[n]=\omega\uparrow\uparrow(n-1)" />, shifted by one. The two versions satisfy <M t="f^{\text{book}}_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow(n-1)}(n)\le f_{\varepsilon_0}(n)" />, while the latter is in turn bounded by the former at <M t="n+1" />; their growth rate is identical.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="wellorder" kicker={{ en: 'The sword of Damocles', zh: '达摩克利斯之剑' }} title={{ en: 'Why it must stop — and how to break it', zh: '为什么一定会停——以及怎样把它弄坏' }}>
        <P
          zh={<>规则 (3) 删掉末项，只复制坏部，<b>不</b>复制末项本身。想让记号更强？一个诱人的改法（本书式 2.387）：把末项也放进循环节一起复制。序列会变得更长——看起来只会更大。</>}
          en={<>Rule (3) deletes the last term and copies the bad part <i>without</i> it. Want a stronger notation? A tempting tweak (the book’s eq. 2.387): copy the last term along with the bad part. Sequences get longer, so surely the numbers get bigger.</>}
        />
        <H3 en="Two machines, one start" zh="两台机器，同一个起点" />
        <Widget title={{ en: 'Break the rule', zh: '把规则弄坏' }} hint={{ en: 'Both machines start from (0,1,2)[2].', zh: '两台机器都从 (0,1,2)[2] 出发。' }}>
          <BrokenRule />
        </Widget>
        <P
          zh={<>坏规则下，<M t="(0,1,2)[2]\to(0,1,2,1,2)[2]\to(0,1,2,1,2,1,2)[2]\to\cdots" /> 永不结束，所以 <M t="(0,1,2)[2]" /> 根本不代表任何数。它的序数标签不降反升——再也没有什么能保证停机。</>}
          en={<>Under the broken rule, <M t="(0,1,2)[2]\to(0,1,2,1,2)[2]\to(0,1,2,1,2,1,2)[2]\to\cdots" /> never ends, so <M t="(0,1,2)[2]" /> names no number at all. Its ordinal label goes up instead of down, and nothing forces it to halt.</>}
        />
        <P
          zh={<>这种无穷展开叫<Term en="infinite descending chain" zh="无穷降链" />，有它的记号叫<b>非良序</b>的。它和停机问题很像：一个记号良序，等于说它的展开程序总会停机。</>}
          en={<>An endless expansion like this is an <Term en="infinite descending chain" zh="无穷降链" />, and a notation with one is <b>ill-founded</b>. It resembles the halting problem: a notation is well-founded exactly when its expansion program always halts.</>}
        />
        <Thm name={{ en: '(PrSS is well-founded)', zh: '（初等序列是良序的）' }} status="proved">
          <B
            zh={<p>对每个标准表达式 <M t="s" /> 和每个 <M t="n" />，按任一种外壳展开 <M t="(s)[n]" />，都会在有限步内到达 <M t="()" />。</p>}
            en={<p>For every standard expression <M t="s" /> and every <M t="n" />, expanding <M t="(s)[n]" /> in either shell reaches <M t="()" /> after finitely many steps.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>删去末尾的 0 把序数从 <M t="\alpha+1" /> 变成 <M t="\alpha" />；按规则 (3) 展开把 <M t="\alpha" /> 变成 <M t="\alpha[n]<\alpha" />（见“山、树与序数”一节的事实“展开 = 基本列”）。所以每一步序数都严格下降。若展开永不结束，就得到一个无穷严格递降的序数序列，与第 3 章的定理矛盾。（本书的 FGH 外壳要同时追踪几层嵌套的调用；对“序数的有限多重集合”做同样的论证即可。）</>}
            en={<>Dropping a trailing 0 takes <M t="\alpha+1" /> to <M t="\alpha" />; a rule-(3) expansion takes <M t="\alpha" /> to <M t="\alpha[n]<\alpha" /> (the fact “expansion = fundamental sequence” from the section on mountains and trees). So the ordinal strictly drops at every step. An endless expansion would give an infinite strictly decreasing sequence of ordinals, contradicting Chapter 3’s theorem. (The book’s FGH shell keeps several nested calls alive at once; the same argument runs on the finite multiset of their ordinals.)</>}
          />
        </Proof>
        <H3 en="How rigorous is this?" zh="这有多严格？" />
        <Caution>
          <L
            zh={<>诚实地说：本书在这里只给出了一个直观的“说明”，因为它跳过了序列与序数对应关系的证明，并明确说这“远非严格的证明”。上面“展开 = 基本列”的推导补上了这一环；书中还引用了两篇更完整的严格证明：WWW620 与 みずどら 2024 年的网络文章。同样的树结构在 Kirby–Paris 九头蛇（1982）中早已被严格处理过，第 6 章细说。</>}
            en={<>In fairness: at this point the book offers only an intuitive “explanation”, because it skips proving the sequence–ordinal correspondence, and it says plainly that this is “far from a rigorous proof”. The derivation “expansion = fundamental sequence” fills that gap; the book also cites two fuller rigorous proofs, online write-ups by WWW620 and みずどら (both 2024). The same tree structure was handled rigorously long before, in the Kirby–Paris hydra (1982) — more in Chapter 6.</>}
          />
        </Caution>
        <H3 en="Walking a tightrope" zh="走钢丝" />
        <P
          zh={<>本书称良序性是“悬在所有大数记号头上的达摩克利斯之剑”。记号越强，展开越复杂，离非良序就越近。</>}
          en={<>The book calls well-foundedness “the sword of Damocles hanging over every big-number notation”. The stronger the notation and the more intricate its expansion, the closer it walks to ill-foundedness.</>}
        />
        <P
          zh={<>社区的做法是：大量枚举、拼命构造无穷降链；找不到就“暂时视为良序”，找到了就修补规则。这只是不完全归纳。良序性没有“部分成立”——一条降链就足以让一个记号失去几乎全部强度。</>}
          en={<>Community practice: enumerate heavily and try hard to build descending chains; if none turns up, treat the notation as well-founded “for now”; if one does, patch the rules. That is incomplete induction. And there is no “partly well-founded” — a single chain can wipe out almost all of a notation’s strength.</>}
        />
        <Expand kind="deeper" title={{ en: 'The well-ordering limit', zh: '良序极限' }}>
          <P
            zh={<>若一个记号有无穷降链，可以证明它有一条“最小”的。降链之下的部分仍是良序的，可以照常使用；这条界线叫记号的<b>良序极限</b>。理论上它可以任意大，但实践中通常远低于设计者期望的“理想极限”。</>}
            en={<>If a notation has an infinite descending chain, one can show it has a least one. Everything below it is still well-founded and usable; that boundary is the notation’s <b>well-ordering limit</b>. In principle it can be anything, but in practice it is usually far below the “ideal limit” the inventor hoped for.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="toolkit" kicker={{ en: 'Packing for the road', zh: '整装出发' }} title={{ en: 'What we carry forward', zh: '带上路的东西' }}>
        <P
          zh={<>初等序列给了我们一套会反复出现的语言：<b>父项</b>（左边最近的更小项）、<b>坏根</b>（末项的父项）、<b>坏部</b>（被复制的那段）、<b>好部</b>（原样保留的前缀）。</>}
          en={<>Primitive sequences hand us a vocabulary that keeps coming back: the <b>parent</b> (nearest smaller term to the left), the <b>bad root</b> (the last term’s parent), the <b>bad part</b> (the block that gets copied) and the <b>good part</b> (the prefix kept as is).</>}
        />
        <P
          zh={<>第 6 章里，砍九头蛇的头就是在展开初等序列。第 9 章的 Bashicu 矩阵把同一个游戏推广到多行，强度远远超过 <M t="\varepsilon_0" />。</>}
          en={<>In Chapter 6, chopping a hydra’s head will turn out to be a PrSS expansion. In Chapter 9, the Bashicu matrix system plays the same game with several rows, reaching far beyond <M t="\varepsilon_0" />.</>}
        />
        <OpenProblem title={{ en: 'Proving strong notations well-founded', zh: '证明强记号的良序性' }}>
          <P
            zh={<>PrSS 的良序性很好证明，但许多更强的记号至今悬而未决。本书称之为整个大数领域最难的问题之一：缺乏数学工具，而且有原则性障碍——第 6 章会看到，一个记号的序型若超过某个公理体系的“证明论序数”，这个体系就根本证明不了它良序。</>}
            en={<>PrSS is easy to prove well-founded, but many stronger notations remain undecided. The book calls this one of the hardest problems in googology: the tools are missing, and there is a barrier of principle — as Chapter 6 shows, if a notation’s order type exceeds a theory’s “proof-theoretic ordinal”, that theory cannot prove it well-founded at all.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'How reliable are notation analyses?', zh: '记号分析有多可靠？' }}>
          <P
            zh={<>本章的“<M t="(0,1,2)=\omega^\omega" />”是严格定理；但对更复杂的记号，社区的强度分析大多靠列举关键节点、找规律，本书坦言这只是猜想，新的分析常推翻旧的。现有结论里有多少是错的，没有人知道。</>}
            en={<>This chapter’s “<M t="(0,1,2)=\omega^\omega" />” is a theorem. For more intricate notations, though, most community analyses list key nodes and spot patterns; the book admits these are conjectures and newer analyses often overturn older ones. Nobody knows how many accepted results are wrong.</>}
          />
        </OpenProblem>
        <KeyIdea>
          <L
            zh={<>我们用一个复制游戏爬到了 <M t="\varepsilon_0" />。下一章会发现，<M t="\varepsilon_0" /> 不是人造的玩具：它藏在数论、游戏和逻辑本身里——它正是算术所能证明的边界。</>}
            en={<>A copying game has carried us to <M t="\varepsilon_0" />. Next chapter we find that <M t="\varepsilon_0" /> is no artificial toy: it hides in number theory, in games, and in logic itself — it is exactly the edge of what arithmetic can prove.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
