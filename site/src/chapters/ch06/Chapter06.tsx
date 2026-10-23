import './ch06.css'
import '../ch05/ch05.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { FuseLine, GoodsteinStepper, HereditaryBump, HydraGame, PtoLadder, StrategyRace, WormSim } from './widgets'

export default function Chapter06() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Ordinals below <M t="\varepsilon_0" />, Cantor normal form, and “no infinite strictly decreasing sequence of ordinals” — Chapter 3.</>, zh: <><M t="\varepsilon_0" /> 以下的序数、Cantor 标准型，以及“不存在无穷严格递降的序数序列”——第 3 章。</> },
          { en: <>The FGH <M t="f_\alpha" />, the Hardy hierarchy <M t="H_\alpha" /> with <M t="H_{\omega^\alpha}=f_\alpha" />, and the hereditary-base shortcut — Chapter 4.</>, zh: <>FGH <M t="f_\alpha" />、Hardy 层次 <M t="H_\alpha" /> 及 <M t="H_{\omega^\alpha}=f_\alpha" />，以及遗传记法的捷径——第 4 章。</> },
          { en: <>Primitive sequences, their trees (bare root = 0, children <M t="H_i" /> ↦ <M t="\sum\omega^{H_i}" />), bad root and bad part — Chapter 5.</>, zh: <>初等序列及其树（只有根 = 0，子树 <M t="H_i" /> ↦ <M t="\sum\omega^{H_i}" />）、坏根与坏部——第 5 章。</> },
          { en: <>The informal notion of an algorithm (Chapter 2).</>, zh: <>“算法”的直观概念（第 2 章）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="goodstein" kicker={{ en: 'Specimen 1', zh: '标本一' }} title={{ en: 'A sequence that must come home', zh: '一个注定回家的数列' }}>
        <P en="A short rule can name a huge number by saying how long a process lasts. Goodstein sequences and hydras make this concrete: the visible state grows, while a hidden ordinal decreases. Keep those two quantities separate throughout this chapter." zh="一句短规则也能用“过程持续多久”来命名大数。Goodstein 数列和九头蛇把这件事变得具体：眼前的状态越来越大，背后的序数却越来越小。本章始终要分清这两个量。" />
        <P
          zh={<>到目前为止，<M t="\varepsilon_0" /> 都是我们亲手造出来的。这一章去野外：它会在数论、游戏和逻辑本身里自己冒出来。</>}
          en={<>So far every <M t="\varepsilon_0" /> we met was built by hand. This chapter goes into the wild, where it turns up on its own — in number theory, in games, and in logic itself.</>}
        />
        <P
          zh={<>第一个标本来自 1944 年的英国逻辑学家 Reuben Goodstein。先学一种写法：<Term en="hereditary base-b notation" zh="以 b 为底的遗传记法" />——把 <M t="n" /> 写成 <M t="b" /> 进制，再把每个指数、指数的指数……也都写成 <M t="b" /> 进制，直到只剩小于 <M t="b" /> 的数。</>}
          en={<>The first specimen is due to the British logician Reuben Goodstein (1944). It needs one piece of notation, <Term en="hereditary base-b notation" zh="以 b 为底的遗传记法" />: write <M t="n" /> in base <M t="b" />, then write every exponent — and every exponent of an exponent — in base <M t="b" /> too, until only numbers below <M t="b" /> remain.</>}
        />
        <MB t="\begin{aligned}100&=2^{6}+2^{5}+2^{2}\\&=2^{2^{2}+2}+2^{2^{2}+1}+2^{2}.\end{aligned}" />
        <H3 en="Bump the base" zh="换底" />
        <Widget title={{ en: 'Hereditary notation and the bump', zh: '遗传记法与“换底”' }} hint={{ en: 'Watch what happens to the number when every b becomes b+1 — and to the ordinal when every b becomes ω.', zh: '看看把每个 b 换成 b+1 时数怎样变化——以及把 b 换成 ω 时得到什么序数。' }}>
          <HereditaryBump />
        </Widget>
        <Thm kind="definition" name={{ en: 'Goodstein sequences (《大数理论》 Def 20.1–20.2)', zh: 'Goodstein 数列（《大数理论》定义 20.1–20.2）' }}>
          <B
            zh={<p>令 <M t="B_b(x)" /> 为“把 <M t="x" /> 写成以 <M t="b" /> 为底的遗传记法，再把每个 <M t="b" /> 换成 <M t="b+1" />”。定义 <M t="G_0(n)=n" />，<M t="G_{k+1}(n)=B_{k+2}(G_k(n))-1" />（若 <M t="G_k(n)>0" />）。<M t="G(n)" /> 为使 <M t="G_k(n)=0" /> 的最小 <M t="k" />。</p>}
            en={<p>Let <M t="B_b(x)" /> mean “write <M t="x" /> in hereditary base <M t="b" />, then replace every <M t="b" /> by <M t="b+1" />.” Set <M t="G_0(n)=n" /> and <M t="G_{k+1}(n)=B_{k+2}(G_k(n))-1" /> while <M t="G_k(n)>0" />. Let <M t="G(n)" /> be the least <M t="k" /> with <M t="G_k(n)=0" />.</p>}
          />
        </Thm>
        <P
          zh={<>小的很温和：<M t="G(1)=1" />，<M t="G(2)=3" />，<M t="G(3)=5" />（<M t="3\to3\to3\to2\to1\to0" />）。从 4 开始就不一样了：</>}
          en={<>Small cases are tame: <M t="G(1)=1" />, <M t="G(2)=3" />, <M t="G(3)=5" /> (<M t="3\to3\to3\to2\to1\to0" />). Starting from 4 is another story:</>}
        />
        <MB t="\begin{aligned}4=2^2\ &\to\ 3^3-1=26\\&\to 41\to 60\to 83\to 109\to\cdots\end{aligned}" />
        <P
          zh={<>它涨啊涨，涨很久很久。可是 Goodstein 证明了：<b>无论从哪个 <M t="n" /> 出发，数列最终都会回到 0。</b></>}
          en={<>It climbs, and climbs, for a very long time. Yet Goodstein proved: <b>whatever <M t="n" /> you start from, the sequence eventually returns to 0.</b></>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="shadow" kicker={{ en: 'The trick', zh: '诀窍' }} title={{ en: 'The ordinal shadow', zh: '序数之影' }}>
        <P
          zh={<>证明的思路：给每一项投下一个“影子”——把遗传记法里的底 <M t="b" /> 全部换成 <M t="\omega" />。记 <M t="o_b(x)" /> 为 <M t="x" /> 在底 <M t="b" /> 下的影子，例如 <M t="o_3(26)=o_3(2\cdot3^2+2\cdot3+2)=\omega^2\cdot2+\omega\cdot2+2" />。</>}
          en={<>The proof casts a “shadow” of each term: replace the base <M t="b" /> by <M t="\omega" /> everywhere in the hereditary notation. Write <M t="o_b(x)" /> for the shadow of <M t="x" /> in base <M t="b" />; for instance <M t="o_3(26)=o_3(2\cdot3^2+2\cdot3+2)=\omega^2\cdot2+\omega\cdot2+2" />.</>}
        />
        <H3 en="One climbs, one falls" zh="一个在涨，一个在跌" />
        <Widget title={{ en: 'Goodstein stepper with its shadow', zh: 'Goodstein 数列与它的影子' }} hint={{ en: 'Gold: digits of Gₖ. Green: its shadow on the ordinal ruler.', zh: '金线：Gₖ 的位数。绿线：影子在序数尺上的位置。' }}>
          <GoodsteinStepper />
        </Widget>
        <Thm name={{ en: 'Goodstein’s theorem (1944)', zh: 'Goodstein 定理（1944）' }} status="proved">
          <B zh={<p>对每个 <M t="n" />，存在 <M t="k" /> 使 <M t="G_k(n)=0" />。</p>} en={<p>For every <M t="n" /> there is a <M t="k" /> with <M t="G_k(n)=0" />.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>两个事实。(i) 换底不改变影子：<M t="o_{b+1}(B_b(x))=o_b(x)" />，因为遗传记法的“形状”原封不动（系数 <M t="<b<b+1" />）。(ii) 固定底时影子严格单调：<M t="x<y\Rightarrow o_b(x)<o_b(y)" />（对 <M t="y" /> 强归纳：先比最高项的指数——由归纳假设它们的影子同序——再比系数，再比余项）。于是 <M t="o_{k+3}(G_{k+1})=o_{k+3}(B_{k+2}(G_k)-1)<o_{k+3}(B_{k+2}(G_k))=o_{k+2}(G_k)" />。影子构成严格递降的序数序列，由第 3 章的定理它只能有限长，所以数列在有限步内到达 0。</>}
            en={<>Two facts. (i) Bumping the base does not change the shadow: <M t="o_{b+1}(B_b(x))=o_b(x)" />, since the hereditary shape is untouched (coefficients are <M t="<b<b+1" />). (ii) For a fixed base the shadow is strictly monotone: <M t="x<y\Rightarrow o_b(x)<o_b(y)" /> (strong induction on <M t="y" />: compare leading exponents — whose shadows are ordered the same way by induction — then coefficients, then the remainders). Hence <M t="o_{k+3}(G_{k+1})=o_{k+3}(B_{k+2}(G_k)-1)<o_{k+3}(B_{k+2}(G_k))=o_{k+2}(G_k)" />. The shadows form a strictly decreasing sequence of ordinals, which is finite by Chapter 3’s theorem; so the sequence hits 0.</>}
          />
        </Proof>
        <H3 en="How long is “eventually”?" zh="“最终”有多久？" />
        <P
          zh={<>影子的每一步，和第 4 章 Hardy 层次的一步一模一样：减 1 时自变量（底）加 1，碰到极限就把一个 <M t="\omega" /> 换成当前的底。由此可得精确公式（Cichon 1983；本书式 20.56）：</>}
          en={<>Each step of the shadow is exactly a step of Chapter 4’s Hardy hierarchy: subtracting 1 raises the argument (the base) by 1, and at a limit one <M t="\omega" /> is replaced by the current base. This gives an exact formula (Cichon 1983; the book’s eq. 20.56):</>}
        />
        <MB t="G(n)=H_{o_2(n)}(3)-3." />
        <MB t="\begin{aligned}G(4)&=H_{\omega^\omega}(3)-3=f_3(3)-3\\&=3\cdot2^{402\,653\,211}-3.\end{aligned}" />
        <P
          zh={<>认出这个数了吗？<M t="H_{\omega^\omega}(3)" /> 正是第 5 章原版外壳里的 <M t="(0,1,2)[3]=3\cdot2^{402\,653\,211}" />。Goodstein 数列从 4 出发的旅程，和那次初等序列的倒数是同一段旅程。</>}
          en={<>Recognize it? <M t="H_{\omega^\omega}(3)" /> is Chapter 5’s <M t="(0,1,2)[3]=3\cdot2^{402{,}653{,}211}" /> in the original (Hardy) shell. Goodstein’s journey from 4 and that primitive-sequence countdown are the same journey.</>}
        />
        <Expand kind="detail" title={{ en: 'Checking G(4) independently', zh: '独立验证 G(4)' }}>
          <P
            zh={<>不依赖公式，我们直接模拟了数列，只把两类显然的长串步骤合并计算：末位的倒数，以及用掉一个 <M t="\omega" /> 位时底的翻倍。最后阶段从底 <M t="b" />（<M t="b+1=3\cdot2^{28}" />）出发，再翻倍 <M t="402\,653\,183" /> 次；数列在底为 <M t="3\cdot2^{402\,653\,211}-1" /> 时到达 0，而第 <M t="k" /> 步的底是 <M t="k+2" />，所以 <M t="G(4)=3\cdot2^{402\,653\,211}-3" />。它约有 1.2 亿位。</>}
            en={<>Without the formula, we simulated the sequence directly, merging only two kinds of obvious long runs: the countdown of the last digit, and the doubling of the base when an <M t="\omega" />-digit is spent. The last phase starts at base <M t="b" /> with <M t="b+1=3\cdot2^{28}" /> and doubles <M t="402{,}653{,}183" /> more times; the sequence reaches 0 at base <M t="3\cdot2^{402{,}653{,}211}-1" />, so <M t="G(4)=3\cdot2^{402{,}653{,}211}-3" /> (at step <M t="k" /> the base is <M t="k+2" />). That number has about 121 million digits.</>}
          />
          <P
            zh={<>同一公式给出（本书表）：<M t="G(5)=f_4(4)-3" />，<M t="G(8)=f_{\omega+1}(3)-3" />，<M t="G(2\uparrow\uparrow n)=H_{\omega\uparrow\uparrow n}(3)-3" />。所以 <M t="G" /> 的增长率是 <M t="\varepsilon_0" />。</>}
            en={<>The same formula gives (book’s table): <M t="G(5)=f_4(4)-3" />, <M t="G(8)=f_{\omega+1}(3)-3" />, <M t="G(2\uparrow\uparrow n)=H_{\omega\uparrow\uparrow n}(3)-3" />. So <M t="G" /> has growth rate <M t="\varepsilon_0" />.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="hydra" kicker={{ en: 'Specimen 2', zh: '标本二' }} title={{ en: 'Hercules and the hydra', zh: '赫拉克勒斯与九头蛇' }}>
        <P
          zh={<>希腊神话里，九头蛇每被砍掉一个头就长出两个。1982 年，Laurie Kirby 和 Jeff Paris 设计了一个更凶的版本——而且仍然打得赢。</>}
          en={<>In the Greek myth, every head Hercules cut off grew back as two. In 1982 Laurie Kirby and Jeff Paris designed a far nastier hydra — one that can still be beaten.</>}
        />
        <Thm kind="definition" name={{ en: 'The Kirby–Paris hydra (《大数理论》 Def 20.3)', zh: 'Kirby–Paris 九头蛇（《大数理论》定义 20.3）' }}>
          <B
            zh={<p>九头蛇是一棵有根树，叶子是它的头。第 <M t="m" /> 刀砍掉一个头 <M t="h" />：若 <M t="h" /> 的父节点 <M t="p" /> 不是根，则把砍完后 <M t="p" /> 以上的整棵子树复制 <M t="m" /> 份，接在 <M t="p" /> 的父节点（<M t="h" /> 的祖父）上；若 <M t="p" /> 是根，什么也不长。只剩根时，赫拉克勒斯获胜。</p>}
            en={<p>A hydra is a rooted tree; its leaves are heads. Chop number <M t="m" /> removes a head <M t="h" />. If <M t="h" />’s parent <M t="p" /> is not the root, the subtree at <M t="p" /> (after the cut) is copied <M t="m" /> times and the copies are attached to <M t="p" />’s parent, <M t="h" />’s grandparent. If <M t="p" /> is the root, nothing regrows. Hercules wins when only the root is left.</p>}
          />
        </Thm>
        <Widget title={{ en: 'Fight the hydra', zh: '与九头蛇搏斗' }} hint={{ en: 'Pink rings: fresh heads. Try height 4.', zh: '粉色圆圈：新长的头。试试高度 4。' }}>
          <HydraGame />
        </Widget>
        <H3 en="How many chops?" zh="要砍多少刀？" />
        <P
          zh={<>按本书的规矩（总是砍最右边的头），高为 2 的直蛇要 3 刀，高为 3 的要 <b>37</b> 刀：在第 8 刀后它有 10 个头，在第 18 刀后有 19 个头。高为 4 的……你可以一直砍到地老天荒。</>}
          en={<>By the book’s convention (always chop the rightmost head), a straight hydra of height 2 takes 3 chops and one of height 3 takes <b>37</b>: after chop 8 it has 10 heads, after chop 18 it has 19. Height 4 — you can keep chopping until the end of time.</>}
        />
        <Expand kind="detail" title={{ en: 'Hydra(2) = 3, not 4', zh: 'Hydra(2) = 3，而不是 4' }}>
          <P
            zh={<>本书式 (20.145) 印成 Hydra(2) = 4，但它自己列出的过程 <M t="((()))\to(()())\to(())\to()" /> 只有 3 步。我们的程序也给出 3。Hydra(3) = 37 与本书一致。</>}
            en={<>The book’s eq. (20.145) prints Hydra(2) = 4, but its own list <M t="((()))\to(()())\to(())\to()" /> has 3 steps, and our program agrees: 3. Hydra(3) = 37 matches the book.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="always-win" kicker={{ en: 'The theorem', zh: '定理' }} title={{ en: 'Why Hercules always wins', zh: '为什么赫拉克勒斯总会赢' }}>
        <P
          zh={<>给九头蛇也投一个影子：用第 5 章的树序数，只是每个节点上要先把各分支<b>从大到小排好</b>再相加——这叫 Hessenberg <Term en="natural sum" zh="自然和" /> <M t="\oplus" />，它对每个加项严格单调。</>}
          en={<>Give the hydra a shadow too: Chapter 5’s tree ordinal, except that at each node the branches are first <b>sorted in decreasing order</b> and then added. This is the Hessenberg <Term en="natural sum" zh="自然和" /> <M t="\oplus" />, which is strictly increasing in each summand.</>}
        />
        <H3 en="Every strategy wins" zh="怎么砍都会赢" />
        <Thm name={{ en: 'Kirby–Paris (1982)', zh: 'Kirby–Paris（1982）' }} status="proved">
          <B zh={<p>无论赫拉克勒斯每一刀砍哪个头，九头蛇都会在有限刀内死去。</p>} en={<p>Whichever head Hercules chops at each step, the hydra dies after finitely many chops.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>设头 <M t="h" /> 的父节点 <M t="p" /> 不是根。在 <M t="p" /> 处，<M t="h" /> 贡献 <M t="\omega^0=1" />，所以 <M t="p" /> 作为祖父 <M t="g" /> 的一个分支价值 <M t="\omega^{\gamma+1}" />。砍完后它变成 <M t="m+1" /> 个分支，每个价值 <M t="\omega^\gamma" />；而 <M t="\omega^\gamma\cdot(m+1)<\omega^{\gamma+1}" />。把 <M t="g" /> 的一个加项换成有限多个更小的项，自然和变小；再沿着到根的路径往下，<M t="\omega^{(\cdot)}" /> 和 <M t="\oplus" /> 都严格单调，所以整棵树的序数严格下降。若 <M t="p" /> 是根，只是删掉一个加项 1，也下降。由第 3 章的定理，下降不能无穷进行。</>}
            en={<>Let head <M t="h" /> have parent <M t="p" /> other than the root. At <M t="p" />, <M t="h" /> contributes <M t="\omega^0=1" />, so <M t="p" />, as a branch of the grandparent <M t="g" />, is worth <M t="\omega^{\gamma+1}" />. After the chop it becomes <M t="m+1" /> branches of value <M t="\omega^\gamma" /> each, and <M t="\omega^\gamma\cdot(m+1)<\omega^{\gamma+1}" />. Replacing one summand at <M t="g" /> by finitely many smaller ones lowers the natural sum; going down the path to the root, both <M t="\omega^{(\cdot)}" /> and <M t="\oplus" /> are strictly monotone, so the ordinal of the whole hydra strictly drops. If <M t="p" /> is the root we just delete a summand 1. By Chapter 3’s theorem the descent cannot go on forever.</>}
          />
        </Proof>
        <Quiz
          q={{ zh: <p>赫拉克勒斯蒙上眼睛，每一刀都随机挑一个头砍。他有可能输吗（九头蛇永远不死）？</p>, en: <p>Hercules is blindfolded and chops a random head each time. Can he lose — can the hydra live forever?</p> }}
          options={[
            { zh: <p>能：运气差时蛇会无限长大</p>, en: <p>Yes: with bad luck it grows without bound</p> },
            { zh: <p>概率为 0，但理论上可能</p>, en: <p>Only with probability 0</p> },
            { zh: <p>不可能：每一种砍法都会赢</p>, en: <p>No: every sequence of choices wins</p> },
          ]}
          answer={2}
          explain={{
            zh: <p>定理对<b>任何</b>砍法成立，不是“几乎必然”。每一刀都让序数严格下降，而序数没有无穷降链——不管刀落在哪里。</p>,
            en: <p>The theorem holds for <b>every</b> sequence of choices, not “almost surely”. Each chop strictly lowers the ordinal, and ordinals have no infinite descending chains — wherever the blade falls.</p>,
          }}
        />
        <Widget title={{ en: 'Race the strategies', zh: '策略赛跑' }}>
          <StrategyRace />
        </Widget>
        <P
          zh={<>策略决定快慢，不决定输赢。本书估计：总砍最右边的头，<M t="\mathrm{Hydra}(n)" /> 的增长率是 <M t="\varepsilon_0" />；最快的策略（总砍最深的头）只有指数塔级别，即刻度 3。</>}
          en={<>Strategy decides how long, never whether. The book estimates that the rightmost-head count <M t="\mathrm{Hydra}(n)" /> grows at rate <M t="\varepsilon_0" />, while the fastest strategy (always chop a deepest head) only reaches tower level, mark 3.</>}
        />
        <H3 en="The hydra is a primitive sequence" zh="九头蛇就是初等序列" />
        <P
          zh={<>把九头蛇读成第 5 章的初等序列：按先序（从左到右）列出所有<b>非根</b>节点，每个节点记作“深度 − 1”（根的孩子记 0）。砍最右边的头就是删掉末项；它的父节点 <M t="p" /> 正是坏根；<M t="p" /> 以上的子树正是坏部。第 <M t="m" /> 刀就是带 <M t="m+1" /> 份坏部的展开：</>}
          en={<>Read the hydra as a Chapter 5 primitive sequence: list the <b>non-root</b> nodes in pre-order (left to right), writing each node’s depth minus 1 (children of the root get 0). Chopping the rightmost head deletes the last term; its parent <M t="p" /> is the bad root; the subtree at <M t="p" /> is the bad part. Chop <M t="m" /> is an expansion with <M t="m+1" /> copies of the bad part:</>}
        />
        <MB t="\begin{gathered}(0,1,2,2,1)\ \xrightarrow{\ m=3\ }\\(0,1,2,2,\ 0,1,2,2,\ 0,1,2,2,\ 0,1,2,2).\end{gathered}" />
        <P
          zh={<>所以本书把这类记号叫作“Hydra 型”记号。第 9 章的 Bashicu 矩阵，就是长着多行身体的九头蛇。</>}
          en={<>That is why the book calls this family “hydra-type” notations. Chapter 9’s Bashicu matrices are hydras with multi-row bodies.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="worm" kicker={{ en: 'Specimen 3', zh: '标本三' }} title={{ en: 'Beklemishev’s worm', zh: 'Beklemishev 的虫子' }}>
        <P
          zh={<>2006 年前后，Lev Beklemishev 从可证性逻辑里提炼出一个更朴素的游戏：一条“虫子”就是一串自然数 <M t="[W_0,\ldots,W_n]" />。</>}
          en={<>Around 2006 Lev Beklemishev distilled an even plainer game from provability logic. A “worm” is a list of natural numbers <M t="[W_0,\ldots,W_n]" />.</>}
        />
        <Thm kind="definition" name={{ en: 'Worm step, round m (《大数理论》 Def 20.6)', zh: '第 m 轮的变换（《大数理论》定义 20.6）' }}>
          <B
            zh={<p>若 <M t="W_n=0" />，删去它。否则令 <M t="k" /> 为满足 <M t="W_k<W_n" /> 的最大 <M t="k<n" />，好部 <M t="g=[W_0,\ldots,W_k]" />（无此 <M t="k" /> 时为空），坏部 <M t="b=[W_{k+1},\ldots,W_{n-1},W_n-1]" />，新虫为 <M t="g" /> 后接 <M t="m+1" /> 份 <M t="b" />。</p>}
            en={<p>If <M t="W_n=0" />, delete it. Otherwise let <M t="k" /> be the largest <M t="k<n" /> with <M t="W_k<W_n" />, the good part <M t="g=[W_0,\ldots,W_k]" /> (empty if no such <M t="k" />), the bad part <M t="b=[W_{k+1},\ldots,W_{n-1},W_n-1]" />, and the new worm <M t="g" /> followed by <M t="m+1" /> copies of <M t="b" />.</p>}
          />
        </Thm>
        <Widget title={{ en: 'Feed the worm', zh: '喂虫子' }} hint={{ en: 'The ordinal is the worm read as a primitive sequence (missing intermediate heights filled in). It drops at every round.', zh: '序数是把虫子读成初等序列（补上中间缺的高度）得到的。它每一轮都下降。' }}>
          <WormSim />
        </Widget>
        <P
          zh={<><M t="\mathrm{Worm}(1)=3" />（<M t="[1]\to[0,0]\to[0]\to[\,]" />），<M t="\mathrm{Worm}(2)=51" />，与本书一致；<M t="\mathrm{Worm}(3)" /> 已经大得写不下。和 Goodstein、九头蛇一样，<M t="\mathrm{Worm}(n)" /> 的增长率是 <M t="\varepsilon_0" />。</>}
          en={<><M t="\mathrm{Worm}(1)=3" /> (<M t="[1]\to[0,0]\to[0]\to[\,]" />) and <M t="\mathrm{Worm}(2)=51" />, matching the book; <M t="\mathrm{Worm}(3)" /> is already beyond writing. Like Goodstein and the hydra, <M t="\mathrm{Worm}(n)" /> grows at rate <M t="\varepsilon_0" />.</>}
        />
        <Caution>
          <L
            zh={<>小部件的序数标签是我们自己的翻译（虫子 → 初等序列），程序检验了它在上千个随机局面里每轮严格下降、极限也对得上；它不一定与 Beklemishev 原文的序数赋值逐字相同。</>}
            en={<>The widget’s ordinal label is our own translation (worm → primitive sequence). A program checked that it strictly drops in thousands of random positions and has the right limits; it need not coincide verbatim with Beklemishev’s own ordinal assignment.</>}
          />
        </Caution>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="fuse" kicker={{ en: 'Specimen 4', zh: '标本四' }} title={{ en: 'Burning ropes', zh: '燃烧的绳子' }}>
        <P
          zh={<>经典谜题：每根绳子烧完恰好 1 小时，但烧得不均匀。两头同时点燃，30 分钟烧完。用若干根绳子，能精确量出哪些时间？</>}
          en={<>A classic puzzle: each rope burns for exactly one hour, but unevenly. Light both ends and it is gone in 30 minutes. With several ropes, which times can you measure exactly?</>}
        />
        <P
          zh={<>抽象出来：<M t="0" /> 是<Term en="fusible number" zh="可熔数" />；若 <M t="x,y" /> 是可熔数且 <M t="|x-y|<1" />，则 <M t="\tfrac{x+y+1}{2}" /> 也是（一根绳子的两端分别在时刻 <M t="x" /> 与 <M t="y" /> 点燃）。</>}
          en={<>Abstractly: <M t="0" /> is a <Term en="fusible number" zh="可熔数" />, and if <M t="x,y" /> are fusible with <M t="|x-y|<1" />, so is <M t="\tfrac{x+y+1}{2}" /> (light the two ends of a rope at times <M t="x" /> and <M t="y" />).</>}
        />
        <Widget title={{ en: 'Fusible numbers on the line', zh: '数轴上的可熔数' }}>
          <FuseLine />
        </Widget>
        <Thm kind="fact" name={{ en: 'Erickson, Nivasch, Xu (LICS 2021; LMCS 2022)', zh: 'Erickson、Nivasch、Xu（LICS 2021；LMCS 2022）' }} status="proved">
          <B
            zh={<p>可熔数在实数的通常顺序下是良序集，序型恰为 <M t="\varepsilon_0" />。而“对每个自然数 <M t="n" />，都存在大于 <M t="n" /> 的最小可熔数”这一真命题，在 Peano 算术中不可证。</p>}
            en={<p>The fusible numbers, in their usual order as reals, are well-ordered with order type exactly <M t="\varepsilon_0" />. And the true statement “for every natural number <M t="n" /> there is a least fusible number greater than <M t="n" />” is not provable in Peano arithmetic.</p>}
          />
        </Thm>
        <P
          zh={<>一个来自日常谜题的实数子集，里面藏着 <M t="\varepsilon_0" />。“在 Peano 算术中不可证”是什么意思？这是本章后半部分的主题。</>}
          en={<>A set of reals born from a household puzzle hides <M t="\varepsilon_0" />. What does “not provable in Peano arithmetic” mean? That is the second half of this chapter.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="unprovable" kicker={{ en: 'Logic enters', zh: '逻辑登场' }} title={{ en: 'True but unprovable', zh: '真，却不可证' }}>
        <P
          zh={<>一个<b>公理系统</b>是一份有限（或可由算法列出）的基本命题清单，外加固定的推理规则。一个<b>证明</b>是一串有限的公式，每一条要么是公理，要么由前面的公式按规则得出——对不对可以由程序机械地检查。</>}
          en={<>An <b>axiom system</b> is a finite (or algorithmically listable) list of basic statements together with fixed rules of inference. A <b>proof</b> is a finite list of formulas, each an axiom or obtained from earlier ones by a rule — so whether it is correct can be checked mechanically by a program.</>}
        />
        <P
          zh={<><Term en="Peano arithmetic (PA)" zh="Peano 算术（PA）" /> 是描述自然数的标准一阶理论：关于 <M t="0" />、后继、<M t="+" />、<M t="\times" /> 的几条基本等式，加上对<b>每一个</b>一阶公式 <M t="\varphi" /> 的归纳公理。几乎所有初等数论都能在 PA 里证明。</>}
          en={<><Term en="Peano arithmetic (PA)" zh="Peano 算术（PA）" /> is the standard first-order theory of the natural numbers: a few basic equations for <M t="0" />, successor, <M t="+" />, <M t="\times" />, plus an induction axiom for <b>every</b> first-order formula <M t="\varphi" />. Nearly all of elementary number theory is provable in PA.</>}
        />
        <Expand kind="detail" title={{ en: 'The axioms of PA', zh: 'PA 的公理' }}>
          <MB t="\begin{aligned}&Sx\neq0,\quad Sx=Sy\to x=y,\\&x+0=x,\quad x+Sy=S(x+y),\\&x\cdot0=0,\quad x\cdot Sy=x\cdot y+x,\\&\varphi(0)\wedge\forall x\,(\varphi(x)\to\varphi(Sx))\\&\qquad\to\ \forall x\,\varphi(x).\end{aligned}" />
          <P
            zh={<>“一阶”意味着只能对自然数量化，不能对“自然数的集合”量化。限制归纳公式中量词交替的层数，得到子系统 <M t="\mathrm{I}\Sigma_n" />；PA 是它们的并。</>}
            en={<>“First-order” means quantifiers range over numbers, not over sets of numbers. Bounding the quantifier alternations allowed in induction gives the subsystems <M t="\mathrm{I}\Sigma_n" />; PA is their union.</>}
          />
        </Expand>
        <Thm name={{ en: 'Gödel’s incompleteness theorems (1931), as slogans', zh: 'Gödel 不完备定理（1931），口号版' }} status="proved">
          <B
            zh={<ul><li><b>第一定理：</b>任何相容的、可由算法列出公理、且包含基本算术的理论 <M t="T" />，都有它既不能证明也不能否证的算术命题。（若 <M t="T" /> 只证明真命题，那么其中有真却不可证的命题。）</li><li><b>第二定理：</b>这样的 <M t="T" /> 不能证明自身的相容性 <M t="\mathrm{Con}(T)" />。</li></ul>}
            en={<ul><li><b>First:</b> every consistent theory <M t="T" /> with an algorithmically listable set of axioms that contains basic arithmetic has arithmetic statements it can neither prove nor refute. (If <M t="T" /> proves only true statements, some of these are true but unprovable.)</li><li><b>Second:</b> such a <M t="T" /> cannot prove its own consistency <M t="\mathrm{Con}(T)" />.</li></ul>}
          />
        </Thm>
        <P
          zh={<>Gödel 的不可证命题是精心构造的“自指”句子。长期以来人们怀疑：是否有<b>自然的</b>数学命题也逃出了 PA 的掌心？第 10 章会把这两个定理说得更精确。</>}
          en={<>Gödel’s unprovable sentences are carefully engineered self-referential statements. For decades people wondered whether any <b>natural</b> mathematical statement escapes PA too. Chapter 10 states both theorems precisely.</>}
        />
        <Thm name={{ en: 'Kirby–Paris (1982)', zh: 'Kirby–Paris（1982）' }} status="proved">
          <B
            zh={<p>Goodstein 定理在 PA 中不可证。九头蛇定理（每个可计算的砍头策略都会赢）在 PA 中也不可证。两者都是真的，只是 PA 证明不了。</p>}
            en={<p>Goodstein’s theorem is not provable in PA. Neither is the hydra theorem (every computable chopping strategy wins). Both are true; PA just cannot prove them.</p>}
          />
        </Thm>
        <P
          zh={<>它们紧随 Paris–Harrington（1977）之后，是最早一批“自然的”不完备性例子。它们的证明只用了一件事：<M t="\varepsilon_0" /> 以下没有无穷降链。PA 看不到的，正是这件事的全部。</>}
          en={<>Following Paris–Harrington (1977), they were among the first “natural” incompleteness examples. Their proofs used one thing only: there is no infinite descent below <M t="\varepsilon_0" />. That is exactly what PA cannot see in full.</>}
        />
        <Quiz
          q={{ zh: <p>PA 证明不了 Goodstein 定理。那么，PA 能证明“从 4 出发的 Goodstein 数列会到达 0”吗？</p>, en: <p>PA cannot prove Goodstein’s theorem. Can PA prove that the Goodstein sequence starting at 4 reaches 0?</p> }}
          options={[
            { zh: <p>不能：既然一般情形不可证，具体情形也不可证</p>, en: <p>No: if the general case is unprovable, so is this one</p> },
            { zh: <p>能：一个具体的有限计算总可以在 PA 里写成证明</p>, en: <p>Yes: a specific finite computation can always be written out as a PA proof</p> },
            { zh: <p>无法判断</p>, en: <p>It is undecidable</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>数列确实在 <M t="3\cdot2^{402\,653\,211}-3" /> 步后到 0，PA 可以逐步验证这一有限计算（“<M t="\Sigma_1" /> 完全性”），尽管证明长得离谱。对每一个具体的 <M t="n" /> 都是如此。PA 证明不了的是那个“对一切 <M t="n" />”。</p>,
            en: <p>The sequence really does reach 0 after <M t="3\cdot2^{402{,}653{,}211}-3" /> steps, and PA can verify that finite computation step by step (“<M t="\Sigma_1" />-completeness”), absurdly long as the proof is. The same holds for each specific <M t="n" />. What PA cannot prove is the “for all <M t="n" />”.</p>,
          }}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="pto" kicker={{ en: 'Measuring theories', zh: '丈量理论' }} title={{ en: 'The proof-theoretic ordinal', zh: '证明论序数' }}>
        <P
          zh={<>为什么偏偏是 <M t="\varepsilon_0" />？用一个可计算的良序记号（例如 Cantor 标准型）表示 <M t="\alpha" /> 以下的序数，令 <M t="\mathrm{TI}(\alpha)" /> 为<Term en="transfinite induction" zh="超限归纳" />原理：若某性质对所有比 <M t="\beta" /> 小的序数成立就对 <M t="\beta" /> 成立，则它对所有 <M t="\beta<\alpha" /> 成立。</>}
          en={<>Why <M t="\varepsilon_0" /> in particular? Represent the ordinals below <M t="\alpha" /> in a computable notation (say, Cantor normal forms) and let <M t="\mathrm{TI}(\alpha)" /> be the principle of <Term en="transfinite induction" zh="超限归纳" />: if a property holds at <M t="\beta" /> whenever it holds below <M t="\beta" />, then it holds for all <M t="\beta<\alpha" />.</>}
        />
        <P
          zh={<><M t="\mathrm{TI}(\alpha)" /> 等价于“<M t="\alpha" /> 以下没有（可定义的）无穷降链”。理论 <M t="T" /> 的<Term en="proof-theoretic ordinal" zh="证明论序数" /> <M t="\mathrm{PTO}(T)" />，直观地说，是 <M t="T" /> 能证明 <M t="\mathrm{TI}(\alpha)" /> 的那些 <M t="\alpha" /> 的上确界：<M t="T" /> 能证明“一定会结束”的最长倒数。</>}
          en={<><M t="\mathrm{TI}(\alpha)" /> amounts to “there is no (definable) infinite descending chain below <M t="\alpha" />”. The <Term en="proof-theoretic ordinal" zh="证明论序数" /> <M t="\mathrm{PTO}(T)" /> of a theory <M t="T" /> is, informally, the supremum of the <M t="\alpha" /> for which <M t="T" /> proves <M t="\mathrm{TI}(\alpha)" />: the longest countdown <M t="T" /> can prove always ends.</>}
        />
        <Thm name={{ en: 'Gentzen (1936, 1943)', zh: 'Gentzen（1936，1943）' }} status="proved">
          <B
            zh={<p>PA 能证明每个 <M t="\alpha<\varepsilon_0" /> 的 <M t="\mathrm{TI}(\alpha)" />，但不能证明 <M t="\mathrm{TI}(\varepsilon_0)" />。即 <M t="\mathrm{PTO}(\mathrm{PA})=\varepsilon_0" />。</p>}
            en={<p>PA proves <M t="\mathrm{TI}(\alpha)" /> for every <M t="\alpha<\varepsilon_0" />, but not <M t="\mathrm{TI}(\varepsilon_0)" />. That is, <M t="\mathrm{PTO}(\mathrm{PA})=\varepsilon_0" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>上半部分的思路：1936 年 Gentzen 用“切消”证明，若在一个很弱的系统上加上 <M t="\mathrm{TI}(\varepsilon_0)" />（对简单性质），就能证明 <M t="\mathrm{Con}(\mathrm{PA})" />：每个 PA 证明都被赋予一个 <M t="\varepsilon_0" /> 以下的序数，消去一次切割序数就下降。若 PA 能证明 <M t="\mathrm{TI}(\varepsilon_0)" />，它就能证明自身相容，违反 Gödel 第二定理。下半部分（1943）：对 <M t="\omega" /> 塔的高度做元归纳，逐层把 <M t="\mathrm{TI}(\alpha)" /> 提升为 <M t="\mathrm{TI}(\omega^\alpha)" />。</>}
            en={<>Upper half, the idea: in 1936 Gentzen used cut elimination to show that a weak system plus <M t="\mathrm{TI}(\varepsilon_0)" /> (for simple properties) proves <M t="\mathrm{Con}(\mathrm{PA})" /> — each PA proof is assigned an ordinal below <M t="\varepsilon_0" />, and eliminating a cut lowers it. If PA proved <M t="\mathrm{TI}(\varepsilon_0)" />, it would prove its own consistency, against Gödel’s second theorem. Lower half (1943): by a meta-induction on the height of the <M t="\omega" />-tower, lift <M t="\mathrm{TI}(\alpha)" /> to <M t="\mathrm{TI}(\omega^\alpha)" /> one storey at a time.</>}
          />
        </Proof>
        <Widget title={{ en: 'What can a theory see?', zh: '一个理论能看多远？' }} hint={{ en: 'Click a theory. Slide the hydra height: PA proves each fixed height, never all heights at once.', zh: '点击一个理论。拖动九头蛇高度：PA 能证明每一个固定高度，却证明不了所有高度。' }}>
          <PtoLadder />
        </Widget>
        <P
          zh={<>其他里程碑：<M t="\mathrm{PTO}(\mathrm{RCA}_0)=\omega^\omega" />（反推数学的基础系统），<M t="\mathrm{PTO}(\mathrm{ATR}_0)=\Gamma_0" />（第 7 章）。每个 PTO 都是可计算序数，因为公理系统本身是可计算的。</>}
          en={<>Other landmarks: <M t="\mathrm{PTO}(\mathrm{RCA}_0)=\omega^\omega" /> (the base system of reverse mathematics) and <M t="\mathrm{PTO}(\mathrm{ATR}_0)=\Gamma_0" /> (Chapter 7). Every PTO is a computable ordinal, because the axiom systems themselves are computable.</>}
        />
        <H3 en="Growth ≈ PTO" zh="增长率 ≈ 证明论序数" />
        <P
          zh={<>一个函数在 <M t="T" /> 中<b>可证全</b>，是指 <M t="T" /> 能证明计算它的程序对每个输入都停机。对 PA 有一个精确的定理（Kreisel 1952；Wainer 1970；Buchholz–Wainer 1987）：</>}
          en={<>A function is <b>provably total</b> in <M t="T" /> if <M t="T" /> proves that a program computing it halts on every input. For PA there is a sharp theorem (Kreisel 1952; Wainer 1970; Buchholz–Wainer 1987):</>}
        />
        <Thm name={{ en: '(provably total functions of PA)', zh: '（PA 的可证全函数）' }} status="proved">
          <B
            zh={<p>一个可计算函数在 PA 中可证全，当且仅当它被某个 <M t="f_\alpha" />（<M t="\alpha<\varepsilon_0" />，标准基本列）最终控制。</p>}
            en={<p>A computable function is provably total in PA if and only if it is eventually dominated by some <M t="f_\alpha" /> with <M t="\alpha<\varepsilon_0" /> (standard fundamental sequences).</p>}
          />
        </Thm>
        <P
          zh={<>这立刻给出 Goodstein 定理不可证的一个证明思路（Cichon 1983）：<M t="G(2\uparrow\uparrow n)=H_{\omega\uparrow\uparrow n}(3)-3" /> 由此可证 <M t="G" /> 不被任何 <M t="f_\alpha" />（<M t="\alpha<\varepsilon_0" />）最终控制，所以 <M t="G" /> 在 PA 中不可证全——而“<M t="G" /> 处处有定义”正是 Goodstein 定理。</>}
          en={<>This yields a proof idea for Goodstein’s independence (Cichon 1983): <M t="G(2\uparrow\uparrow n)=H_{\omega\uparrow\uparrow n}(3)-3" /> implies that <M t="G" /> is not eventually dominated by any <M t="f_\alpha" /> with <M t="\alpha<\varepsilon_0" />, so <M t="G" /> is not provably total in PA — and “<M t="G" /> is total” is Goodstein’s theorem.</>}
        />
        <Caution>
          <L
            zh={<>“增长率 ≈ PTO”对 PA 及若干具体系统是定理；一般情形只是经验法则，本书也称其关键一步“其实只是一个猜测”。还要注意刻度：对 <M t="\mathrm{I}\Sigma_1" />，PTO 是 <M t="\omega^\omega" />，可证全函数却只到 <M t="f_\omega" /> 以下——Hardy 刻度 <M t="H_{\omega^\alpha}=f_\alpha" /> 解释了这一层指数的差距；到 <M t="\varepsilon_0" /> 这个不动点，两种刻度才追平。</>}
            en={<>“Growth ≈ PTO” is a theorem for PA and several specific systems, but only a rule of thumb in general; the book itself calls the key step “really only a guess”. Mind the scale, too: for <M t="\mathrm{I}\Sigma_1" /> the PTO is <M t="\omega^\omega" /> while the provably total functions stay below <M t="f_\omega" /> — the Hardy scale <M t="H_{\omega^\alpha}=f_\alpha" /> accounts for that one exponent, and only at the fixed point <M t="\varepsilon_0" /> do the two scales meet.</>}
          />
        </Caution>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="open" kicker={{ en: 'Frontier', zh: '前沿' }} title={{ en: 'What is still open', zh: '仍未解决的问题' }}>
        <OpenProblem title={{ en: 'Does unprovable mean fast?', zh: '不可证就意味着增长快吗？' }}>
          <P
            zh={<>本章的例子里，不可证的命题都对应着长到 <M t="\varepsilon_0" /> 的函数。但没有一般定理保证这一点：本书举出过一个与某个强公理等价的函数，却只长到 <M t="\varepsilon_0" />。什么样的“自然”独立命题一定给出快速增长？这还没有精确的答案。</>}
            en={<>In this chapter every unprovable statement came with a function growing at <M t="\varepsilon_0" />. No general theorem guarantees this: the book exhibits a function whose totality is equivalent to a strong axiom yet which only grows like <M t="\varepsilon_0" />. Which “natural” independent statements must produce fast growth has no precise answer yet.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Proof-theoretic ordinals of strong theories', zh: '强理论的证明论序数' }}>
          <P
            zh={<>序数分析的前沿是二阶算术 <M t="Z_2" />：T. Arai 2023 年的预印本（arXiv:2311.12459，对 <M t="\Pi_N" />-收集公理的序数分析）声称做到了这一步，学界仍在检验（第 10 章）。三阶算术、更不用说 ZFC 的证明论序数，至今毫无头绪。第 7–10 章会沿着这把尺子一路往上爬。</>}
            en={<>The frontier of ordinal analysis is second-order arithmetic <M t="Z_2" />: a 2023 preprint by T. Arai (arXiv:2311.12459, an ordinal analysis of <M t="\Pi_N" />-collection) claims to reach it, and it is still being vetted (Chapter 10). For third-order arithmetic, let alone ZFC, the proof-theoretic ordinal is wide open. Chapters 7–10 climb this ruler step by step.</>}
          />
        </OpenProblem>
        <KeyIdea>
          <L
            zh={<><M t="\varepsilon_0" /> 不只是 <M t="\omega" /> 塔的极限：它是 Goodstein 数列、九头蛇、虫子和可熔数的共同长度，也是 Peano 算术能看清的极限。要越过它，需要新的思想——下一章：不动点与 Veblen 函数。</>}
            en={<><M t="\varepsilon_0" /> is more than the limit of <M t="\omega" />-towers: it is the common length of Goodstein sequences, hydras, worms and fuses, and the limit of what Peano arithmetic can see. Going beyond it needs a new idea — next chapter: fixed points and the Veblen functions.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
