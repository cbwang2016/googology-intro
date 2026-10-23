import './ch09.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Status, Thm, Widget } from '../../ui/blocks'
import { EXP_PRESETS } from './data'
import { AnatomyFig, BmsExpander, FsWalker, PssTranslator, RuleCompare } from './widgets'
import { DescentChain, Mountain, StrengthLadder } from './widgets2'

const Mx = ({ s }: { s: string }) => <span className="mono c09-mx">{s}</span>
const TWO_ROW_PRESETS = EXP_PRESETS.filter((p) => !p.s.startsWith('(0,0,0'))

export default function Chapter09() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Ordinals, ε₀, and the theorem that there is no infinite strictly decreasing sequence of ordinals (Chapter 3).</>, zh: <>序数、ε₀，以及“不存在无穷严格递降的序数列”这条定理（第 3 章）。</> },
          { en: <>Fundamental sequences: a limit is the sup of its terms S[0], S[1], … (Chapter 4).</>, zh: <>基本列：极限序数是它的各项 S[0], S[1], … 的上确界（第 4 章）。</> },
          { en: <>Primitive sequences (PrSS) with parent, bad root, bad part, good part; (0,1,…,n) has value ω↑↑n (Chapter 5).</>, zh: <>初等序列 PrSS，以及父项、坏根、坏部、好部；(0,1,…,n) 的值是 ω↑↑n（第 5 章）。</> },
          { en: <>ζ₀, Γ₀, SVO, LVO (Chapter 7); Madore’s ψ, Ω, <M t="\mathrm{BHO}=\psi(\varepsilon_{\Omega+1})" />, <M t="\mathrm{BO}=\psi(\Omega_\omega)" /> and the Buchholz hydra (Chapter 8).</>, zh: <>ζ₀、Γ₀、SVO、LVO（第 7 章）；Madore 的 ψ、Ω、<M t="\mathrm{BHO}=\psi(\varepsilon_{\Omega+1})" />、<M t="\mathrm{BO}=\psi(\Omega_\omega)" /> 以及 Buchholz 九头蛇（第 8 章）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="copying" kicker={{ en: 'A new challenger', zh: '新的挑战者' }} title={{ en: 'Past Buchholz with nothing but small integers', zh: '只用小整数，越过 Buchholz' }}>
        <P
          zh={<>第 8 章我们登上了 Buchholz 序数 <M t="\mathrm{BO}=\psi(\Omega_\omega)" />。代价不小：先借来一串“够不着”的序数 <M t="\Omega,\Omega_2,\dots,\Omega_\omega" />，再把它们一层层折叠回来。</>}
          en={<>Chapter 8 reached Buchholz’s ordinal <M t="\mathrm{BO}=\psi(\Omega_\omega)" />. It came at a price: borrow a tower of unreachable ordinals <M t="\Omega,\Omega_2,\dots,\Omega_\omega" />, then fold them back down layer by layer.</>}
        />
        <P
          zh={<>2014 年，日文 Googology Wiki 的用户 BashicuHyudora 提出了一个大胆得多的东西：一张由小自然数组成的表格，外加一条复制规则。没有 Ω，没有闭包，什么都不借。</>}
          en={<>In 2014 BashicuHyudora, a user of the Japanese Googology Wiki, proposed something far cheekier: a grid of small natural numbers plus one copying rule. No Ω, no closure sets, nothing borrowed.</>}
        />
        <P
          zh={<>它的规则改了好几版，2018 年才定型（第四版，称 BM4）。这就是 <Term en="Bashicu Matrix System (BMS)" zh="Bashicu 矩阵（BMS）" />。《大数理论》称这类 Worm 型记号是“目前最为强大，且被人们所广泛接受的递归记号体系”。</>}
          en={<>The rules went through several versions before settling in 2018 (the fourth, called BM4). This is the <Term en="Bashicu Matrix System (BMS)" zh="Bashicu 矩阵（BMS）" />. 曹知秋’s book calls these Worm-type notations “the most powerful recursive notation systems that are widely accepted today.”</>}
        />
        <H3 en="Warm-up: a primitive sequence is a one-row matrix" zh="热身：初等序列就是单行矩阵" />
        <P
          zh={<>把第 5 章的初等序列 (0,1,2,2) 竖着写，每一项单独一列：<Mx s="(0)(1)(2)(2)" />。展开规则完全不变：末项 2 往左找第一个更小的数，即坏根 1；删去末项，把坏部 (1)(2) 一遍遍复制。</>}
          en={<>Write Chapter 5’s primitive sequence (0,1,2,2) one term per column: <Mx s="(0)(1)(2)(2)" />. The rule is unchanged: the last term 2 looks left for the first smaller entry, the bad root 1; delete the last term and copy the bad part (1)(2) again and again.</>}
        />
        <AnatomyFig
          s="(0)(1)(2)(2)"
          caption={<L en={<>Top: the arcs join each entry to its parent; green = bad root, red = bad part, dashed = the deleted last term. Bottom: S[2] = G B⁰ B¹ B². Value: <M t="\omega^{\omega^2}" />, approached by <M t="\omega^{\omega\cdot k}" />.</>} zh={<>上：弧把每个数连到它的父项；绿框是坏根，红色是坏部，虚线是要删掉的末项。下：S[2] = G B⁰ B¹ B²。值为 <M t="\omega^{\omega^2}" />，各项 <M t="\omega^{\omega\cdot k}" /> 逼近它。</>} />}
        />
        <P
          zh={<>问题是：单行的天花板是 ε₀。<Mx s="(0)(1)(2)…(n)" /> 的值是 <M t="\omega\uparrow\uparrow n" />，永远够不到 ε₀ 本身。怎么办？</>}
          en={<>The catch: one row tops out at ε₀. The sequence <Mx s="(0)(1)(2)…(n)" /> has value <M t="\omega\uparrow\uparrow n" /> and never reaches ε₀ itself. What now?</>}
        />
        <H3 en="Add a second row" zh="加一行" />
        <P
          zh={<>Bashicu 的回答：在每一项下面再写一个数。第二行不单独做事，它的作用是<b>记账</b>：告诉第一行，每复制一次要往上抬多少。</>}
          en={<>Bashicu’s answer: write a second number under each term. The second row does nothing on its own. Its job is <b>bookkeeping</b>: it tells the first row how much to climb with each copy.</>}
        />
        <Thm kind="definition" name={{ en: '2-row BMS, part 1: parents (book Def. 6.4–6.12, 0-indexed)', zh: '双行 BMS（一）：父项（书中定义 6.4–6.12，从 0 编号）' }}>
          <B
            zh={
              <ol>
                <li><b>父项</b>，第 0 行：左边第一个比它小的数。<b>祖先</b>：父项、父项的父项……</li>
                <li><b>父项</b>，第 1 行：左边第一个比它小、并且<b>正上方是“它上方那个数”的祖先</b>的数。</li>
              </ol>
            }
            en={
              <ol>
                <li><b>Parent</b> in row 0: the first smaller entry to the left. <b>Ancestors</b>: the parent, its parent, and so on.</li>
                <li><b>Parent</b> in row 1: the first smaller entry to the left <b>whose top entry is an ancestor of the top entry above it</b>.</li>
              </ol>
            }
          />
        </Thm>
        <Thm kind="definition" name={{ en: '2-row BMS, part 2: the expansion', zh: '双行 BMS（二）：展开' }}>
          <B
            zh={
              <ol start={3}>
                <li><b>坏根</b>：看末列最下面的非零数，它的父项所在的列。坏根到末列之前是<b>坏部</b> B，坏根之前是<b>好部</b> G。</li>
                <li><b>阶差向量</b> Δ = 末列 − 坏根，但这个最下面非零数所在的行及其以下记为 0。</li>
                <li>末列全为 0：删掉它，值加 1。否则 <M t="S[n]=G\,B\,(B+\Delta)\,(B+2\Delta)\cdots(B+n\Delta)" />，<M t="S=\sup_n S[n]" />。</li>
              </ol>
            }
            en={
              <ol start={3}>
                <li><b>Bad root</b>: take the lowermost nonzero entry of the last column; the bad root is the column of its parent. From the bad root up to (not including) the last column is the <b>bad part</b> B; everything before it is the <b>good part</b> G.</li>
                <li><b>Ascension offset</b> Δ = last column − bad root, except that Δ is 0 in the row of that lowermost nonzero entry and below.</li>
                <li>If the last column is all zeros, delete it and add 1. Otherwise <M t="S[n]=G\,B\,(B+\Delta)\,(B+2\Delta)\cdots(B+n\Delta)" />, and <M t="S=\sup_n S[n]" />.</li>
              </ol>
            }
          />
        </Thm>
        <P
          zh={<>试试 <Mx s="(0,0)(1,1)" />：末列 (1,1) 最下面的非零数在第 1 行，父项是第 0 列，所以坏根是 c0，G 为空，B = (0,0)，Δ = (1,0)。每复制一次，第一行就多爬一格。</>}
          en={<>Try <Mx s="(0,0)(1,1)" />. The last column (1,1) has its lowermost nonzero entry in row 1, whose parent is column 0. So the bad root is c0, G is empty, B = (0,0) and Δ = (1,0). Each copy climbs one step higher in the first row.</>}
        />
        <Widget title={{ en: 'Two-row expander', zh: '双行展开器' }} hint={{ en: 'Step through the stages 1 → 5. At stage 5, slide n.', zh: '依次点阶段 1 → 5；到第 5 步拖动 n。' }}>
          <BmsExpander presets={TWO_ROW_PRESETS} initial={1} />
        </Widget>
        <Thm name={{ en: '(two columns hold all of PrSS)', zh: '（两列装下整个 PrSS）' }}>
          <MB t="(0,0)(1,1)=\varepsilon_0" />
        </Thm>
        <Proof>
          <L
            zh={<>按定义，<M t="(0,0)(1,1)[n]=(0,0)(1,0)(2,0)\cdots(n,0)" />。第二行全是 0，可以整行去掉，剩下初等序列 <M t="(0)(1)\cdots(n)" />，由第 5 章它的值是 <M t="\omega\uparrow\uparrow n" />。所以 <M t="(0,0)(1,1)=\sup_n\omega\uparrow\uparrow n=\varepsilon_0" />。</>}
            en={<>By the rule, <M t="(0,0)(1,1)[n]=(0,0)(1,0)(2,0)\cdots(n,0)" />. Its second row is all zeros and can be dropped, leaving the primitive sequence <M t="(0)(1)\cdots(n)" /> of value <M t="\omega\uparrow\uparrow n" /> (Chapter 5). Hence <M t="(0,0)(1,1)=\sup_n\omega\uparrow\uparrow n=\varepsilon_0" />.</>}
          />
        </Proof>
        <KeyIdea>
          <L
            zh={<>第二行里的一个 1，就让第一行“每复制一次多爬一格”。整个初等序列的世界，被压缩进了两列。这个“下一行驱动上一行”的模式，会在每多加一行时重演一次。</>}
            en={<>A single 1 in the second row makes the first row climb one step per copy. The entire world of primitive sequences is squeezed into two columns. This pattern, the lower row driving the row above, repeats every time we add a row.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="pss" kicker={{ en: 'Two rows', zh: '双行' }} title={{ en: 'Two rows are the PSS hydra in disguise', zh: '双行其实是乔装的 PSS Hydra' }}>
        <P
          zh={<>第二行的父项规则“正上方必须是祖先”看起来很怪。它从哪里来？答案藏在一个更早的记号里：<Term en="PSS Hydra" zh="PSS Hydra" />（pair sequence system）。</>}
          en={<>The row-1 parent rule, “the entry on top must be an ancestor,” looks strange. Where does it come from? The answer hides in an older notation, the <Term en="PSS hydra" zh="PSS Hydra" /> (pair sequence system).</>}
        />
        <P
          zh={<>PSS 的项是嵌套的 <M t="p_k" />（书中写作 <M t="\psi^H_k" />），例如 <M t="p_1(p_2(p_3))" />。展开规则：最里面、最后的 <M t="p_{k+1}" /> 往外层找，找到第一个包住它的 <M t="p_k" />，然后把这个 <M t="p_k(\cdots)" /> 一层层套进自己里面。</>}
          en={<>PSS terms are nested <M t="p_k" /> (the book writes <M t="\psi^H_k" />), such as <M t="p_1(p_2(p_3))" />. The rule: the innermost last <M t="p_{k+1}" /> looks outward for the first enclosing <M t="p_k" />, then nests copies of that <M t="p_k(\cdots)" /> inside one another.</>}
        />
        <Widget title={{ en: 'PSS ↔ 2-row BMS translator', zh: 'PSS ↔ 双行 BMS 翻译器' }} hint={{ en: 'A column (d, s) is the term pₛ₊₁ at bracket depth d; a row-0 parent is the enclosing term. Gold = last term, green = bad root, pink = rest of the bad part.', zh: '一列 (d, s) 就是第 d 层括号里的一项 pₛ₊₁；第 0 行的父项就是直接包住它的项。金色 = 最后一项，绿色 = 坏根，粉色 = 坏部其余部分。' }}>
          <PssTranslator />
        </Widget>
        <H3 en="What the strange rule means" zh="怪规则的含义" />
        <P
          zh={<>于是那条怪规则就有了含义：“第 1 行的父项必须是第 0 行的祖先”，翻译过来就是“只在<b>外层括号</b>里找更小的下标”，旁边的兄弟项一律不算。试试预设 <Mx s="(0,0)(1,1)(2,0)(2,1)(3,1)" />：末列 c4 第 1 行是 1，c2 的 0 虽然更小，却不能当它的父项，因为 c2 不包住它；坏根于是落在 c0。</>}
          en={<>So the strange rule has a meaning: “the row-1 parent must be a row-0 ancestor” translates to “look for a smaller subscript only among the <b>enclosing brackets</b>.” Siblings don’t count. Try the preset <Mx s="(0,0)(1,1)(2,0)(2,1)(3,1)" />: the last column c4 has a 1 in row 1, and c2’s 0 is smaller, but c2 does not enclose c4, so it cannot be the parent. The bad root falls back to c0.</>}
        />
        <H3 en="One matrix sweeps through Chapters 7 and 8" zh="一个矩阵，扫过第 7、8 两章" />
        <P
          zh={<>现在看 <Mx s="(0,0)(1,1)(2,2)" />。坏根是 c1，Δ = (1,0)，于是 <M t="[n]=(0,0)(1,1)(2,1)(3,1)\cdots(n+1,1)" />。第二行停在 1 不动，所有的攀登都发生在第一行：每多复制一份，第一行就多爬一格。把这些项的值排出来，看它们在第 7、8 章的尺子上落在哪里：</>}
          en={<>Now look at <Mx s="(0,0)(1,1)(2,2)" />. The bad root is c1 and Δ = (1,0), so <M t="[n]=(0,0)(1,1)(2,1)(3,1)\cdots(n+1,1)" />. Row 1 stays at 1 and all the climbing happens in row 0: each extra copy is one more step up. Line up the values of these terms and see where they land on the ruler of Chapters 7 and 8:</>}
        />
        <Widget title={{ en: 'Walking a fundamental sequence', zh: '沿着基本列走' }} hint={{ en: 'Values from the book’s tables; ψ = Madore’s ψ (MOCF); — = not given.', zh: '值取自书中的表格；ψ 指 Madore 的 ψ（MOCF）；“—”表示书中未给出。' }}>
          <FsWalker initial={1} />
        </Widget>
        <P
          zh={<>ζ₀、Γ₀、LVO……第 7 章整整一章的 Veblen 层级，在这里只是第一行多几个数。极限是 <M t="(0,0)(1,1)(2,2)=\mathrm{BHO}=\psi(\varepsilon_{\Omega+1})" />，第 8 章的 Bachmann–Howard 序数。<Status kind="folklore" /></>}
          en={<>ζ₀, Γ₀, LVO, … the whole Veblen hierarchy of Chapter 7 is just a few more entries in the top row. The limit is <M t="(0,0)(1,1)(2,2)=\mathrm{BHO}=\psi(\varepsilon_{\Omega+1})" />, Chapter 8’s Bachmann–Howard ordinal. <Status kind="folklore" /></>}
        />
        <P
          zh={<>继续：<Mx s="(0,0)(1,1)(2,2)(3,3)…" /> 走过 <M t="\psi(\psi_2(0)),\psi(\psi_3(0)),\dots" />，极限是 <M t="\mathrm{BO}=\psi(\Omega_\omega)" />——双行 BMS（即 PSS Hydra）的极限，也是 <M t="\Pi^1_1\text{-}\mathsf{CA}_0" /> 的证明论序数（PSS 的良序性与序型 2018 年已被证明）。它恰好是第 8 章单条九头蛇 (+(0(ω))) 的值；而整个 Buchholz 九头蛇游戏的增长率约为更大的 TFBO（<M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> 的证明论序数）。<Status kind="proved" /></>}
          en={<>Keep going: <Mx s="(0,0)(1,1)(2,2)(3,3)…" /> runs through <M t="\psi(\psi_2(0)),\psi(\psi_3(0)),\dots" /> with limit <M t="\mathrm{BO}=\psi(\Omega_\omega)" />: the limit of 2-row BMS (the PSS hydra), and the proof-theoretic ordinal of <M t="\Pi^1_1\text{-}\mathsf{CA}_0" /> (PSS was proved well-founded, with this order type, in 2018). It is the value of Chapter 8’s single hydra (+(0(ω))); the Buchholz hydra <i>game</i> as a whole grows like the larger TFBO, the ordinal of <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" />. <Status kind="proved" /></>}
        />
        <Caution>
          <L
            zh={<>除了 ε₀（第一节已证）和双行极限 BO（2018 年已证）之外，中间各项的值都来自社区的分析（书中也以分析的方式给出），不是形式化证明。</>}
            en={<>Apart from ε₀ (proved in the first section) and the 2-row limit BO (proved in 2018), the intermediate values come from community analysis (the book presents them the same way), not from formal proofs.</>}
          />
        </Caution>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="rules" kicker={{ en: 'The full rule', zh: '完整规则' }} title={{ en: 'Any number of rows', zh: '任意多行' }}>
        <P
          zh={<>现在允许任意多行。约定：按列从左到右书写，如 <Mx s="(0,0,0)(1,1,1)" />；行和列都从 0 编号，第 0 行在最上面；列末尾的 0 可以省略（第一个 0 除外），例如 <Mx s="(0)(1,1,1)" />。</>}
          en={<>Now allow any number of rows. Conventions: write columns left to right, like <Mx s="(0,0,0)(1,1,1)" />; rows and columns are numbered from 0, row 0 on top; trailing zeros of a column may be dropped (except the very first 0), e.g. <Mx s="(0)(1,1,1)" />.</>}
        />
        <H3 en="The rule in full" zh="完整的规则" />
        <Thm kind="definition" name={{ en: 'BMS, part 1: parents and the bad root (book Def. 13.1–13.4)', zh: 'BMS（一）：父项与坏根（书中定义 13.1–13.4）' }}>
          <B
            zh={
              <ol>
                <li><b>父项</b>。第 0 行：左边第一个更小的数。第 y 行（y &gt; 0）：左边第一个更小、并且正上方（第 y−1 行）是“它正上方那个数”的祖先的数。<b>祖先</b>：父项、父项的父项……</li>
                <li><b>坏根</b>：末列中最下面的非零数，记它在第 t 行；它的父项所在的列 r 就是坏根。G = 坏根之前的列，B = 从坏根到末列之前的列。</li>
              </ol>
            }
            en={
              <ol>
                <li><b>Parent.</b> Row 0: the first smaller entry to the left. Row y &gt; 0: the first smaller entry to the left whose entry directly above (row y−1) is an ancestor of the entry directly above the given one. <b>Ancestors</b>: the parent, its parent, and so on.</li>
                <li><b>Bad root.</b> Take the lowermost nonzero entry of the last column, in row t. The column r of its parent is the bad root. G = the columns before r; B = the columns from r up to (not including) the last.</li>
              </ol>
            }
          />
        </Thm>
        <Thm kind="definition" name={{ en: 'BMS, part 2: Δ, the special rule, the expansion', zh: 'BMS（二）：Δ、额外规则与展开' }}>
          <B
            zh={
              <ol start={3}>
                <li><b>阶差向量</b>：<M t="\Delta_y=L_y-R_y" />（<M t="y<t" />），<M t="\Delta_y=0" />（<M t="y\ge t" />），L 为末列，R 为坏根列。</li>
                <li><b>额外规则</b>（书中用红字标出）：坏部中的一个数，只有当坏根在它<b>同一行的祖先</b>之中（或它就在坏根列里）时才提升；否则在所有复制中原样不动。</li>
                <li>末列全为 0：删去它，值加 1。否则 <M t="S[n]=G\,B^{(0)}B^{(1)}\cdots B^{(n)}" />，其中 <M t="B^{(k)}" /> 是给 B 中每个要提升的数加上 <M t="k\Delta" />；<M t="S=\sup_n S[n]" />。</li>
              </ol>
            }
            en={
              <ol start={3}>
                <li><b>Ascension offset.</b> <M t="\Delta_y=L_y-R_y" /> for <M t="y<t" /> and <M t="\Delta_y=0" /> for <M t="y\ge t" />, where L is the last column and R the bad root.</li>
                <li><b>Special rule</b> (printed in red in the book): an entry of B ascends only if the bad root is among its <b>ancestors in its own row</b> (or it lies in the bad-root column). Otherwise it stays unchanged in every copy.</li>
                <li>If the last column is all zeros, delete it and add 1. Otherwise <M t="S[n]=G\,B^{(0)}B^{(1)}\cdots B^{(n)}" />, where <M t="B^{(k)}" /> adds <M t="k\Delta" /> to every ascending entry of B, and <M t="S=\sup_n S[n]" />.</li>
              </ol>
            }
          />
        </Thm>
        <Thm kind="lemma" name={{ en: '(the bad part hangs below the root)', zh: '（坏部挂在坏根之下）' }}>
          <B
            zh={<p>设坏根为 r，末列为 L。则对每个 <M t="r<x<L" />，有 <M t="S_{x0}>S_{r0}" />，且 r 是 x 在第 0 行的祖先。因此 1 行或 2 行的 BMS 中额外规则从不起作用。</p>}
            en={<p>Let r be the bad root and L the last column. For every <M t="r<x<L" />, <M t="S_{x0}>S_{r0}" /> and r is a row-0 ancestor of x. Consequently the special rule never fires in 1- or 2-row BMS.</p>}
          />
        </Thm>
        <Expand kind="proof" title={{ en: 'Proof of the lemma', zh: '引理的证明' }}>
          <L
            zh={<>第 y 行的父项按定义是第 y−1 行的祖先，再由传递性，第 y 行的祖先集合包含于第 y−1 行的祖先集合；所以 r 是 L 在第 0 行的祖先。设这条链为 <M t="L=c_0>c_1>\cdots>c_m=r" />。<M t="c_{i+1}" /> 是 <M t="c_i" /> 左边最近的更小者，所以二者之间每一列的第 0 行都 <M t="\ge S_{c_i0}>S_{r0}" />。于是 <M t="(r,L)" /> 中每列都大于 <M t="S_{r0}" />；从 x 出发沿父项链往左走，值严格下降，又不能越过更小的 r，只能停在 r。两行时，<M t="t\ge1" /> 推出 <M t="\Delta_1=0" />，<M t="t=0" /> 推出 <M t="\Delta=0" />，所以只有第 0 行会提升，而那里每个坏部的数都是 r 的后代。</>}
            en={<>A row-y parent is by definition a row-(y−1) ancestor, so by transitivity row-y ancestors are row-(y−1) ancestors; hence r is a row-0 ancestor of L. Write the chain <M t="L=c_0>c_1>\cdots>c_m=r" />. Since <M t="c_{i+1}" /> is the nearest smaller column left of <M t="c_i" />, every column strictly between them has row-0 entry <M t="\ge S_{c_i0}>S_{r0}" />. So every column in <M t="(r,L)" /> exceeds <M t="S_{r0}" />, and the parent chain of such an x decreases strictly without being able to jump past the smaller r: it ends at r. With two rows, <M t="t\ge1" /> forces <M t="\Delta_1=0" /> and <M t="t=0" /> forces <M t="\Delta=0" />, so only row 0 ascends, where every bad-part entry descends from r.</>}
          />
        </Expand>
        <P
          zh={<>所以额外规则从 3 行开始才真正出场：第 1 行起的祖先链可以“绕过”坏根。</>}
          en={<>So the special rule first matters at three rows, where ancestor chains in row 1 and below can bypass the bad root.</>}
        />
        <Widget title={{ en: 'The BMS expander', zh: 'BMS 展开器' }}>
          <BmsExpander initial={5} />
        </Widget>
        <H3 en="A three-row example" zh="一个三行的例子" />
        <P
          zh={<>书中第一个三行例子 <Mx s="(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,2,0)" />：末列最下面的非零数在第 1 行，它的父项在 c1，Δ = (1,0,0)，结果是 <Mx s="…(3,1,0)(2,1,1)(3,1,1)(4,1,0)(3,1,1)(4,1,1)(5,1,0)…" />（书中式 13.18）。</>}
          en={<>The book’s first 3-row example, <Mx s="(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,2,0)" />: the lowermost nonzero entry of the last column is in row 1, its parent is c1, Δ = (1,0,0), and the result is <Mx s="…(3,1,0)(2,1,1)(3,1,1)(4,1,0)(3,1,1)(4,1,1)(5,1,0)…" /> (book eq. 13.18).</>}
        />
        <Expand kind="detail" title={{ en: 'The formal definition, and the edge cases', zh: '形式化定义与边界情形' }}>
          <P
            zh={<>书中 13.39–13.64 的形式化写法（<M t="S_{xy}" /> 是第 x 列第 y 行，<M t="X" /> 是列数）：</>}
            en={<>The book’s formal version, 13.39–13.64 (<M t="S_{xy}" /> is column x, row y; <M t="X" /> is the number of columns):</>}
          />
          <MB t="\begin{aligned}P_0(x)&=\max\{p<x: S_{p0}<S_{x0}\}\\ P_y(x)&=\max\{p<x: S_{py}<S_{xy}\ \wedge\ \exists a\ p=P_{y-1}^{\,a}(x)\}\quad(y>0)\\ t&=\max\{y: S_{(X-1)y}>0\},\qquad r=P_t(X-1)\\ \Delta_y&=S_{(X-1)y}-S_{ry}\ (y<t),\qquad \Delta_y=0\ (y\ge t)\\ A_{xy}&=1\iff \exists a\ge0:\ r=P_y^{\,a}(r+x)\\ B^{(a)}_{xy}&=S_{(r+x)y}+a\cdot\Delta_y\cdot A_{xy}\end{aligned}" />
          <P
            zh={<>arXiv 论文里的形式化把 t 取为“末列有父项的最低一行”。对标准表达式，这和“最下面的非零数”完全一致；展开器用的是论文的写法，这样输入非标准矩阵也不会出错。</>}
            en={<>The arXiv formalisation takes t to be the lowest row in which the last column has a parent. For standard expressions this is exactly the lowermost nonzero entry. The expander uses that form, so nonstandard input never crashes it.</>}
          />
          <P
            zh={<><b>标准表达式</b>：从极限 <Mx s="(0,…,0)(1,…,1)" /> 出发、反复取基本列能得到的矩阵。定理 13.1 给出三条必要（但不充分）条件：首列全 0；每列从上往下不增；每个非零数 ≤ 父项 + 1。</>}
            en={<><b>Standard expressions</b> are the matrices reachable from the limits <Mx s="(0,…,0)(1,…,1)" /> by repeatedly taking fundamental-sequence terms. Theorem 13.1 gives three necessary (not sufficient) conditions: the first column is all zeros; each column is non-increasing downward; each nonzero entry is at most its parent + 1.</>}
          />
          <P
            zh={<>书中式 13.8 的第二行印错了，应以 13.18 为准。</>}
            en={<>The book’s eq. 13.8 prints a garbled second row; 13.18 is the correct result.</>}
          />
        </Expand>
        <Expand kind="detail" title={{ en: 'What the code was checked against', zh: '代码核对过哪些例子' }}>
          <P
            zh={<>本章所有矩阵计算都由同一份 TypeScript 实现完成（逐字实现上面的定义），并逐项核对了书中的式 13.18、13.27（四行，Δ = (7,3,1,0)）、13.34（坏根 c1，Δ = (1,1,0)）、双行例 6.270、0-Y 展开 14.161，以及无规则时的 13.1777–13.1780。</>}
            en={<>Every matrix computation in this chapter runs on one TypeScript implementation of the definition. It reproduces the book’s eqs. 13.18, 13.27 (four rows, Δ = (7,3,1,0)), 13.34 (bad root c1, Δ = (1,1,0)), the 2-row example 6.270, the 0-Y expansion 14.161, and the rule-off chain 13.1777–13.1780.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="limits" kicker={{ en: 'Self-similarity', zh: '自相似' }} title={{ en: 'Each new row swallows all the old ones', zh: '每多一行，吞掉之前的一切' }}>
        <P
          zh={<>第一节的 <M t="(0,0)(1,1)=\varepsilon_0" /> 是单行的极限。再加一行：</>}
          en={<>The first section’s identity <M t="(0,0)(1,1)=\varepsilon_0" /> is the limit of one row. Add a row:</>}
        />
        <MB t="(0,0,0)(1,1,1)[n]=(0,0,0)(1,1,0)(2,2,0)\cdots(n,n,0)=(0,0)(1,1)\cdots(n,n)." />
        <P
          zh={<>末列 (1,1,1) 在每一行的父项都是 c0，t = 2，Δ = (1,1,0)，B = (0,0,0)。去掉全 0 的最后一行，就是双行的 <Mx s="(0,0)(1,1)…(n,n)" />：它们的上确界正是双行的极限 BO。</>}
          en={<>The last column (1,1,1) has parent c0 in every row and Δ = (1,1,0). Drop the all-zero bottom row and you get the 2-row <Mx s="(0,0)(1,1)…(n,n)" />, whose sup is the 2-row limit, BO.</>}
        />
        <P
          zh={<>一般地，<M t="(0,\dots,0)(1,\dots,1)" />（每列 k+1 个数）是 k 行 BMS 的极限。三行的极限叫 <b>TSSO</b>，四行叫 <b>QSSO</b>，所有有限行的极限叫<b>小 Hydra 序数 SHO</b>：</>}
          en={<>In general <M t="(0,\dots,0)(1,\dots,1)" /> with k+1 entries per column is the limit of k-row BMS. The 3-row limit is called <b>TSSO</b>, the 4-row limit <b>QSSO</b>, and the limit of all finite-row BMS is the <b>Small Hydra Ordinal, SHO</b>:</>}
        />
        <MB t="\mathrm{SHO}=\sup_k\,(\underbrace{0,\dots,0}_{k})(\underbrace{1,\dots,1}_{k})." />
        <H3 en="Length versus height" zh="长度与高度" />
        <Quiz
          q={{
            zh: <p>哪个更大？<span className="mono">X = (0,0,0)(1,1,0)(2,2,0)…(99,99,0)</span>（100 列，数一直到 99），还是 <span className="mono">Y = (0,0,0)(1,1,1)</span>（两列，最大的数是 1）？</p>,
            en: <p>Which is larger: <span className="mono">X = (0,0,0)(1,1,0)(2,2,0)…(99,99,0)</span> (100 columns, entries up to 99) or <span className="mono">Y = (0,0,0)(1,1,1)</span> (two columns, nothing above 1)?</p>,
          }}
          options={[
            { zh: <p>X，它长得多、数也大得多</p>, en: <p>X: it is far longer, with far bigger entries</p> },
            { zh: <p>Y</p>, en: <p>Y</p> },
            { zh: <p>一样大</p>, en: <p>They are equal</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>X 正是 Y[99]，基本列的一项，所以 X &lt; Y。更妙的是，你根本不用展开：像查字典一样逐列比较，第 1 列 (1,1,1) &gt; (1,1,0)，Y 就赢了。后面我们会看到，“字典序就是大小”是一条深刻的定理。</p>,
            en: <p>X is exactly Y[99], a term of Y’s fundamental sequence, so X &lt; Y. Better still, you need not expand anything: compare column by column like words in a dictionary, and column 1 already decides it, (1,1,1) &gt; (1,1,0). That “dictionary order is size order” is a deep theorem, as we will see.</p>,
          }}
        />
        <H3 en="A number from the matrix" zh="从矩阵得到一个数" />
        <P
          zh={<>和第 5 章一样，加一个“迭代外壳”就得到大数函数：展开 S[n] 只取有限项，每走一步方括号里的 n 加 1；遇到后继就删末列，n 也加 1；矩阵变空时，方括号里的数就是结果。</>}
          en={<>As in Chapter 5, an iteration shell turns the notation into a big-number function: expand S[n] to finitely many terms and raise the bracket n by 1 at each step; at a successor, delete the last column and also raise n; when the matrix is empty, the bracket is the answer.</>}
        />
        <P
          zh={<>书中定义 <M t="\mathrm{Bm}(n)" /> 为从 <M t="(0,\dots,0)(1,\dots,1)[n]" />（n 个 0、n 个 1）出发这样算出的结果，它在快速增长层次中处在 SHO 的位置。<Status kind="folklore" /> 它一定会停下——这正是第 6 节要讲的定理。</>}
          en={<>The book defines <M t="\mathrm{Bm}(n)" /> as the result of this game started from <M t="(0,\dots,0)(1,\dots,1)[n]" /> with n zeros and n ones; it sits at SHO in the fast-growing hierarchy. <Status kind="folklore" /> That the game always ends is exactly the theorem of the well-ordering section.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="special-rule" kicker={{ en: 'The fragile clause', zh: '脆弱的一条' }} title={{ en: 'The rule that holds everything up', zh: '撑起一切的那条规则' }}>
        <P
          zh={<>回顾 BMS 定义里的<b>额外规则</b>：坏部中某个数的同行祖先里如果没有坏根，它就不提升。最小的例子是 <Mx s="(0,0,0)(1,1,1)(2,0,0)(1,1,1)" />。</>}
          en={<>Recall the <b>special rule</b> from the BMS definition: if an entry of the bad part does not have the bad root among its ancestors in its own row, it does not ascend. The smallest example is <Mx s="(0,0,0)(1,1,1)(2,0,0)(1,1,1)" />.</>}
        />
        <P
          zh={<>坏根是 c0，Δ = (1,1,0)。c2 第 1 行的 0 没有父项，它的祖先里当然没有坏根，所以每份复制里它都保持为 0；没有这条规则，它会变成 1、2、……</>}
          en={<>The bad root is c0 and Δ = (1,1,0). The 0 in row 1 of c2 has no parent, so the bad root is not among its ancestors, and it stays 0 in every copy. Without the rule it would become 1, 2, …</>}
        />
        <H3 en="Side by side" zh="并排比较" />
        <Widget title={{ en: 'Special rule: on vs off — the same S[n], computed both ways', zh: '额外规则：开与关——同一个 S[n] 的两种算法' }}>
          <RuleCompare />
        </Widget>
        <H3 en="Without it: an endless staircase down" zh="没有它：一条走不完的下坡" />
        <P
          zh={<>差一个数有什么关系？书中 §13.10 给出了答案。从范例 <M t="A_0=" /> <Mx s="(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)" /> 出发，关掉规则，(3,1,0) 被抬成了 (4,2,0)。</>}
          en={<>Does one entry matter? The book’s §13.10 answers. Start from the showcase <M t="A_0=" /> <Mx s="(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)" /> with the rule off: (3,1,0) gets lifted to (4,2,0).</>}
        />
        <P
          zh={<>只靠合法的基本列步骤（每一步都取某个 S[n]），就能从 <M t="A_0" /> 走到 <M t="A_1" />，它的结尾和 <M t="A_0" /> 一模一样，只是整体抬高了一格；再从 <M t="A_1" /> 走到 <M t="A_2" />……</>}
          en={<>Using only legal fundamental-sequence steps (each step replaces S by some S[n]), you can walk from <M t="A_0" /> to <M t="A_1" />, whose tail is a copy of <M t="A_0" />’s tail shifted up by one. From <M t="A_1" /> you reach <M t="A_2" /> the same way, and so on.</>}
        />
        <H3 en="Watch it fall forever" zh="看它永远往下掉" />
        <Widget title={{ en: 'The infinite descent (special rule off)', zh: '无穷降链（关掉额外规则）' }} hint={{ en: 'Every step is S → S[n]; the route was found by computer search.', zh: '每一步都是 S → S[n]；路线由程序搜索得到。' }}>
          <DescentChain />
        </Widget>
        <H3 en="Why this is fatal" zh="为什么这是致命的" />
        <P
          zh={<>每一步都是“取基本列的一项”，所以如果这些矩阵代表序数，每一步都严格变小。可是模式永远重复下去：<M t="A_0>A_1>A_2>\cdots" /> 是一条无穷严格递降链。由第 3 章的定理，序数里没有这种东西。</>}
          en={<>Each step takes a fundamental-sequence term, so if these matrices denoted ordinals, every step would strictly decrease. Yet the pattern repeats forever: <M t="A_0>A_1>A_2>\cdots" /> is an infinite strictly decreasing chain. By Chapter 3’s theorem, ordinals have no such thing.</>}
        />
        <P
          zh={<>这不是假想的危险。据 Rachel Hunter 的良序性论文（arXiv:2307.04606）介绍，BMS 的前三个正式版本 BM1、BM2、BM3 都<b>不是</b>良基的。</>}
          en={<>This is no idle worry. According to Rachel Hunter’s well-ordering paper (arXiv:2307.04606), the first three official versions, BM1, BM2 and BM3, were all <b>not</b> well-founded.</>}
        />
        <Quiz
          q={{
            zh: <p>关掉额外规则后，矩阵 <M t="A_0,A_1,A_2,\dots" /> 越来越长、数越来越大，而且每个都由前一个经合法的展开得到。这说明什么？</p>,
            en: <p>With the special rule off, the matrices <M t="A_0,A_1,A_2,\dots" /> keep getting longer with larger entries, and each comes from the previous one by legal expansions. What does this show?</p>,
          }}
          options={[
            { zh: <p>它们代表越来越大的序数，没什么问题</p>, en: <p>They denote larger and larger ordinals; nothing is wrong</p> },
            { zh: <p>无法给它们赋上序数，使展开总是变小：这个系统不是良序的</p>, en: <p>No assignment of ordinals can make every expansion smaller: the system is not well-ordered</p> },
            { zh: <p>只要再算久一点，链条最终会到 0</p>, en: <p>Compute a bit longer and the chain eventually reaches 0</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>“长”和“大”是错觉：S[n] 总应该比 S 小。若能赋值，就得到无穷递降的序数列，与第 3 章矛盾。所以去掉这条规则，多行 BMS 根本不是序数记号。</p>,
            en: <p>“Longer” and “bigger entries” are an illusion: S[n] must always be smaller than S. Any assignment of ordinals would give an infinite decreasing sequence of ordinals, contradicting Chapter 3. Without the rule, multi-row BMS is not an ordinal notation at all.</p>,
          }}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="well-ordered" kicker={{ en: 'Does it always stop?', zh: '它总会停下吗？' }} title={{ en: 'Proving that BMS is well-ordered', zh: '证明 BMS 是良序的' }}>
        <P
          zh={<>第 5 章说明初等序列会停下，靠的是把每个序列对应到一个小于 ε₀ 的序数。对 BMS 不能照搬：我们手里没有一套已经信得过、又足够大的序数记号可以对应过去。</>}
          en={<>Chapter 5 argued that primitive sequences terminate by mapping each one to an ordinal below ε₀. For BMS that trick fails: we have no trusted ordinal notation big enough to map it into.</>}
        />
        <P
          zh={<>于是“BMS 是不是良序的”成了大数界最著名的难题之一，悬了将近八年。书中说，判断一个记号的良序性“几乎是整个大数领域最困难的问题之一”。</>}
          en={<>So “is BMS well-ordered?” became one of the most famous problems in googology, open for almost eight years. The book calls deciding well-ordering “almost one of the hardest problems in the whole field.”</>}
        />
        <Thm name={{ en: 'BMS is well-ordered (book Thm 13.6 / 13.10)', zh: 'BMS 是良序的（书中定理 13.6 / 13.10）' }} status="proved">
          <B
            zh={<p>标准 BMS 表达式之间的大小顺序就是<b>字典序</b>：逐列比较，每列内从上往下比较。并且这个顺序是良序：任何一条“不断取基本列”的链都会在有限步内走到空矩阵。</p>}
            en={<p>The order on standard BMS expressions is the <b>lexicographic order</b>: compare column by column, and within a column from the top down. This order is a well-order: every chain of fundamental-sequence steps reaches the empty matrix in finitely many steps.</p>}
          />
        </Thm>
        <P
          zh={<>据书中介绍，test_alpha0 在 2022 年给出了证明概要；完整的证明由 Rachel Hunter 发表：《Well-Orderedness of the Bashicu Matrix System》，arXiv:2307.04606（2023）。</>}
          en={<>According to the book, test_alpha0 sketched a proof in 2022; a full proof was posted by Rachel Hunter: “Well-Orderedness of the Bashicu Matrix System”, arXiv:2307.04606 (2023).</>}
        />
        <H3 en="The idea, in one picture" zh="一图看懂证明思路" />
        <P
          zh={<>证明把每一列映到一个<b>稳定序数</b>上。粗略地说，<M t="\alpha" /> 对 <M t="\beta" /> 稳定，是指较小的宇宙 <M t="L_\alpha" /> 是较大宇宙 <M t="L_\beta" /> 的一个“信息不走样的缩影”。第 10 章会把这些概念讲清楚。</>}
          en={<>The proof maps every column to a <b>stable ordinal</b>. Roughly, α being stable up to β means that the smaller universe <M t="L_\alpha" /> is a faithful miniature of the larger <M t="L_\beta" />. Chapter 10 makes these notions precise.</>}
        />
        <P
          zh={<>对应的方式是：若第 i 列是第 j 列在第 m 行的祖先，就要求 i 的像对 j 的像“m 阶稳定”。“复制坏部”恰好对应于“把一个结构反射到更低处”，而反射总是落在更小的序数上。于是每次展开都严格变小。</>}
          en={<>The rule of the map: if column i is an ancestor of column j in row m, the image of i must be “m-stable” up to the image of j. Copying a bad part then corresponds to reflecting a configuration downward, and a reflection always lands on smaller ordinals. So every expansion strictly decreases.</>}
        />
        <Expand kind="deeper" title={{ en: 'The proof skeleton (book §13.10)', zh: '证明骨架（书中 §13.10）' }}>
          <B
            zh={
              <ol>
                <li>定理 13.7：BMS 上的字典序是全序。</li>
                <li>定理 13.8：五条结构引理，说明复制时祖先关系得以保持（对行号 k 归纳）。</li>
                <li>定理 13.9：稳定序数的反射引理。记 <M t="\alpha<_n\beta" /> 当且仅当 <M t="L_\alpha\prec_{\Sigma_{n+1}}L_\beta" />。高于 α 的一组序数，可以“反射”到 α 以下。</li>
                <li>稳定表示：映射 f 把列送到序数，使得 i 是 j 的 m-祖先时 <M t="f(i)<_m f(j)" />。令 <M t="o(A)" /> 为能界住这样的 f 的最小序数。</li>
                <li>从极限出发，对展开次数归纳，证明 o 保序。于是 BMS 嵌入序数，是良序的。</li>
              </ol>
            }
            en={
              <ol>
                <li>Theorem 13.7: lexicographic order on BMS is total.</li>
                <li>Theorem 13.8: five structural lemmas showing that ancestor relations survive copying (induction on the row k).</li>
                <li>Theorem 13.9: a reflection lemma for stable ordinals. Write <M t="\alpha<_n\beta" /> iff <M t="L_\alpha\prec_{\Sigma_{n+1}}L_\beta" />. A configuration of ordinals above α can be reflected below α.</li>
                <li>A stable representation is a map f from columns to ordinals with <M t="f(i)<_m f(j)" /> whenever i is an m-ancestor of j. Let <M t="o(A)" /> be the least ordinal bounding such an f.</li>
                <li>Induct on the number of expansions from the limit to show that o is order-preserving. So BMS embeds into the ordinals and is well-ordered.</li>
              </ol>
            }
          />
          <P
            zh={<>全部序数都落在最小的“对某个 β 各阶都稳定”的序数 σ 之下，所以这个证明顺带给出了 SHO 的一个上界。</>}
            en={<>All the ordinals used lie below σ, the least ordinal that is n-stable up to some β for every n, so the proof also yields an upper bound on SHO.</>}
          />
        </Expand>
        <Caution>
          <L
            zh={<>诚实的说明：这是一篇 arXiv 预印本，社区和《大数理论》都接受它；它的论证用到 Σₙ 初等子结构等集合论工具，篇幅较长，这里只描述而不复述。</>}
            en={<>An honest note: this is an arXiv preprint, accepted by the community and by the book. Its argument uses set-theoretic tools such as Σₙ-elementary substructures, and is long, so we describe it rather than reproduce it.</>}
          />
        </Caution>
        <KeyIdea>
          <L
            zh={<>一个只会“复制、加 Δ”的整数游戏，它的终止性要用可构成宇宙 L 里的稳定序数来证明。规则简单，不代表证明简单。</>}
            en={<>An integer game that only copies and adds Δ needs stable ordinals inside the constructible universe L to prove that it stops. Simple rules do not mean simple proofs.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="ladder" kicker={{ en: 'The map', zh: '地图' }} title={{ en: 'The ladder beyond BO', zh: 'BO 之上的阶梯' }}>
        <P
          zh={<>到 3 行，BMS 突然变得极其强大。书中说，BMS 的详细分析多年来一直是大数社区最重要的工作之一，“至今也没有彻底完成”。</>}
          en={<>At three rows BMS suddenly becomes enormously strong. The book says detailed analysis of BMS was for years among the most important work in the googology community, and “it is still not completely finished.”</>}
        />
        <P
          zh={<>BO 以上的名字（TFBO、EBO、JO、SRO、SSO、LRO、TSSO、QSSO、SHO）这里只是名字。它们的含义依赖“反射”“稳定”“投影”等思想，第 10 章会解释。这些位置来自社区的分析，属于社区估计。 <Status kind="folklore" /></>}
          en={<>Above BO the names (TFBO, EBO, JO, SRO, SSO, LRO, TSSO, QSSO, SHO) are only names here. Their meaning relies on reflection, stability and projection, which Chapter 10 explains. Their positions come from community analysis and are community estimates. <Status kind="folklore" /></>}
        />
        <H3 en="The ladder, rung by rung" zh="逐级看阶梯" />
        <Widget title={{ en: 'The strength ladder', zh: '强度阶梯' }} hint={{ en: 'Click a rung. Order on the ladder is plain dictionary order on the matrices.', zh: '点击一级台阶。阶梯上的先后，就是矩阵的字典序。' }}>
          <StrengthLadder />
        </Widget>
        <H3 en="Where does the strength come from?" zh="力量从哪里来？" />
        <P
          zh={<>书中目前的解释叫<Term en="multi-row transfer" zh="多行传递" />。行从上往下编号为 1, 2, …，然后从最下面一行开始逐行删去；如果删掉第 n 行会改变坏根，就说这个表达式有“n 行传递”。</>}
          en={<>The book’s current explanation is called <Term en="multi-row transfer" zh="多行传递" />. Number the rows 1, 2, … from the top and delete rows from the bottom up. If deleting row n changes the bad root, the expression has an “n-row transfer.”</>}
        />
        <P
          zh={<>PrSS 只有 1 行传递，强度 ε₀；PSS 有 2 行传递，强度 BO；BMS 拥有每一种有限行传递，强度 SHO。反过来，一个只复制坏根本身的“无传递 BMS”，极限只有 ε₀。</>}
          en={<>PrSS has 1-row transfer: strength ε₀. PSS has 2-row transfer: strength BO. BMS has every finite n-row transfer: strength SHO. Conversely, a “transfer-free BMS” that copies only the bad root itself has limit just ε₀.</>}
        />
        <Expand kind="deeper" title={{ en: 'Lifting, and the conjecture that it is useless', zh: '提升效应，以及“提升无用”猜想' }}>
          <P
            zh={<>和 OCF 相比，BMS 在某些位置强度会“跳一下”，书中叫<b>提升效应</b>：当末列有三行非零时，复制会让坏部第二行增加。第一次提升发生在 (2,1,0) 和 (2,1,0)(1,1,1) 之间。</>}
            en={<>Compared with an OCF, BMS jumps in strength at certain points; the book calls it the <b>lifting effect</b>. When the last column has three nonzero rows, copying makes the second row of the bad part grow. The first lift happens between (2,1,0) and (2,1,0)(1,1,1).</>}
          />
          <P
            zh={<>人们构造了各种“无提升”的变体（IBMS、BM3.3、test_alpha0 的 UPMS）。结果 BM3.3 和 BM4 在 (0,0,0)(1,1,1)(2,2,1)(3,0,0) 处追平了。这引出了<b>“提升无用”猜想</b>：BMS 的力量并不来自提升。</>}
            en={<>People built “non-lifting” variants (IBMS, BM3.3, test_alpha0’s UPMS). BM3.3 and BM4 turn out to catch up at (0,0,0)(1,1,1)(2,2,1)(3,0,0). This led to the <b>“lifting is useless” conjecture</b>: BMS’s strength does not come from lifting.</>}
          />
        </Expand>
        <Expand kind="deeper" title={{ en: 'Bigger bad parts, transfinite entries', zh: '更大的坏部、超限元素' }}>
          <P
            zh={<>把坏部做得更大（急模式 BHM、BSM）并不带来本质的提升：n 行 BHM 夹在 n 行和 n+1 行 BMS 之间，所以如果这个规律一直成立，两者极限相同。书中的结论是：表达式数值的大小并不能直接反映记号的强弱。</>}
            en={<>Making the bad part bigger (the sudden modes BHM and BSM) brings no fundamental gain: n-row BHM sits between n-row and (n+1)-row BMS, so if the pattern holds for all n their limits coincide. The book’s moral: the size of an expression does not directly reflect the strength of a notation.</>}
          />
          <P
            zh={<>允许超限行数的 TBMS 走得稍远一点，但用下一节的 Y 序列来量，只是“微不足道的一步”。</>}
            en={<>TBMS, with transfinitely many rows, goes a little further, but measured by the Y sequence of the next section it is “a negligible step.”</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="mountains" kicker={{ en: 'Teaser', zh: '预告' }} title={{ en: 'Mountains: the Y-sequence family', zh: '山脉：Y 序列家族' }}>
        <P
          zh={<>BMS 之后，社区换了一种画法：只写一行数，但允许“跳跃”。Y 家族的序列从 1 开始。</>}
          en={<>After BMS the community switched pictures: a single row again, but with jumps. Y-family sequences start at 1.</>}
        />
        <P
          zh={<>第一步是 <b>LPrSS</b>：坏根仍是左边第一个更小的数，阶差 d = 末项 − 坏根，每复制一次加 d − 1。例如 (1,4,6,4) 的坏根是 1，d = 3，展开为 (1,4,6,3,6,8,5,8,10,…)。它的极限是 φ(ω,0)。</>}
          en={<>First comes <b>LPrSS</b>: the bad root is the first smaller entry to the left, d = last − bad root, and each copy adds d − 1. For example (1,4,6,4) has bad root 1 and d = 3, so it expands to (1,4,6,3,6,8,5,8,10,…). Its limit is φ(ω,0).</>}
        />
        <P
          zh={<><b>0-Y 序列</b>更进一步：对序列反复取“每项 − 它的父项”，一层层往上画，就得到一座<b>山脉</b>。山脉的父项结构，正好就是 BMS 矩阵的父项结构。</>}
          en={<>The <b>0-Y sequence</b> goes further: repeatedly take “entry − its parent,” stacking layer on layer, and you get a <b>mountain</b>. The parent structure of the mountain is exactly that of a BMS matrix.</>}
        />
        <H3 en="Draw the mountain" zh="画出山脉" />
        <Widget title={{ en: 'BMS ↔ 0-Y mountain', zh: 'BMS ↔ 0-Y 山脉' }} hint={{ en: 'Expand the matrix; the result is translated back to 0-Y.', zh: '展开矩阵，结果再翻译回 0-Y。' }}>
          <Mountain />
        </Widget>
        <H3 en="Checking against the book" zh="与书对照" />
        <P
          zh={<>书中的例子：0-Y(1,4,10,13) 对应 <Mx s="(0,0,0)(1,1,1)(2,2,2)(3,1,1)" />，展开为 (1,4,10,12,16,23,26,31,39,…)。组件把矩阵展开后再翻译回来，得到的正是这一串。书中说 BMS 和 0-Y “完全等价”，同时也坦白：这种等价性“尚未得到严格的证明”。<Status kind="open" /></>}
          en={<>The book’s example: 0-Y(1,4,10,13) corresponds to <Mx s="(0,0,0)(1,1,1)(2,2,2)(3,1,1)" /> and expands to (1,4,10,12,16,23,26,31,39,…). Expanding the matrix in the widget and translating back gives exactly this sequence. The book calls BMS and 0-Y “completely equivalent,” and admits in the same breath that the equivalence “has not yet been rigorously proved.” <Status kind="open" /></>}
        />
        <H3 en="And the mountains keep rising" zh="山还在往上长" />
        <P
          zh={<>0-Y(1,3) = ε₀，0-Y(1,4) = BO，0-Y(1,ω) = SHO。真正的 Y 序列（1-Y）走得更远：<b>整个 BMS 只到 Y(1,3)</b>。ω-Y 的极限叫中等 Hydra 序数 MHO。<Status kind="folklore" /></>}
          en={<>0-Y(1,3) = ε₀, 0-Y(1,4) = BO, 0-Y(1,ω) = SHO. The real Y sequence (1-Y) goes much further: <b>all of BMS reaches only Y(1,3)</b>. The limit of ω-Y is called the Medium Hydra Ordinal, MHO. <Status kind="folklore" /></>}
        />
        <P
          zh={<>规则也越来越野：1-Y 要“提取”出 ω 行，ω-Y 的山脉有 <M t="\omega^\omega" /> 行。书中一个 ω-Y 的例子：(1,6,30,155,575,1046,867) 展开到 …,866,1616,3680,7201,5393,…</>}
          en={<>The rules get wilder: 1-Y “extracts” rows up to ω, and ω-Y mountains have <M t="\omega^\omega" /> rows. One ω-Y example from the book: (1,6,30,155,575,1046,867) expands to …,866,1616,3680,7201,5393,…</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="frontier" kicker={{ en: 'Open problems', zh: '开放问题' }} title={{ en: 'The frontier', zh: '前沿' }}>
        <P
          zh={<>BMS 的故事还没写完。下面这些问题，大多是由业余爱好者在论坛和 Discord 上推进的。</>}
          en={<>The BMS story is not finished. Most of these problems are being pushed forward by amateurs on forums and Discord.</>}
        />
        <OpenProblem title={{ en: 'A complete analysis of BMS', zh: 'BMS 的完整分析' }}>
          <P
            zh={<>3 行以上的大片区域仍是书中所说“尚未被完全解析的混沌区域”。每个标准矩阵究竟对应哪个序数，没有人能完整说清。</>}
            en={<>Above three rows, large regions remain what the book calls “the chaotic region not yet fully analysed.” Nobody can yet say which ordinal every standard matrix denotes.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Is BMS really equivalent to 0-Y?', zh: 'BMS 真的等价于 0-Y 吗？' }}>
          <P
            zh={<>两者的翻译在所有已知例子上都吻合，但没有严格证明。在证明之前，0-Y 的良序性只能借 BMS 的结果“启发式地”得到。</>}
            en={<>The translation matches on every known example, but there is no rigorous proof. Until there is, 0-Y’s well-ordering follows from BMS’s only heuristically.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Is lifting useless?', zh: '“提升无用”吗？' }}>
          <P
            zh={<>猜想：BMS 的力量不来自提升效应。“多行传递”是目前的解释，但它是一种解读，不是定理。<Status kind="conjecture" /></>}
            en={<>Conjecture: BMS’s strength does not come from the lifting effect. Multi-row transfer is the current explanation, but it is an interpretation, not a theorem. <Status kind="conjecture" /></>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'BMS and second-order arithmetic', zh: 'BMS 与二阶算术' }}>
          <P
            zh={<>社区里有人猜测，SHO 与二阶算术 <M t="Z_2" /> 的证明论序数（第 6 章的 PTO）有关。目前没有可靠证据支持或否定，《大数理论》也没有这样的说法。<Status kind="conjecture" /></>}
            en={<>Some in the community have guessed that SHO is related to the proof-theoretic ordinal (Chapter 6’s PTO) of second-order arithmetic <M t="Z_2" />. There is no reliable evidence either way, and the book makes no such claim. <Status kind="conjecture" /></>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Ideal α-Y, LHO, FOS, FFFZ', zh: '理想 α-Y、LHO、FOS、FFFZ' }}>
          <P
            zh={<>“理想的 α-Y”应该有什么性质，人们很久都不知道；书中说“我们还不知道 LHO（大 Hydra 序数）应该如何定义”。更远的 FOS、FFFZ “还没有稳定可靠的定义”。传递理论之上还有什么结构？没人知道。</>}
            en={<>For a long time nobody knew what properties the “ideal α-Y” should have; the book says “we do not yet know how LHO (the Large Hydra Ordinal) should be defined.” Further out, FOS and FFFZ “have no stable and reliable definition yet.” What lies beyond transfer theory? Nobody knows.</>}
          />
        </OpenProblem>
        <KeyIdea>
          <L
            zh={<>BMS 的每一步都是机械的整数运算，所以 Bm(n) 是可计算函数，SHO 是一个递归序数——依旧低于第 8 章的 <M t="\Omega=\omega_1^{\mathrm{CK}}" />。可是阶梯上那些名字（EBO、SSO、TSSO……）在说“反射”“稳定”。它们到底是什么？下一章，我们走进逻辑与集合论，去看清这些名字背后的风景。</>}
            en={<>Every BMS step is mechanical integer arithmetic, so Bm(n) is computable and SHO is a recursive ordinal, still below Chapter 8’s <M t="\Omega=\omega_1^{\mathrm{CK}}" />. Yet the names on the ladder (EBO, SSO, TSSO, …) speak of reflection and stability. What are they? Next chapter, we enter logic and set theory to see the landscape behind those names.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
