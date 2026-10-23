import './ch02.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { ArrowProgram, CubeColoring, DiagonalTable, GrahamLayers, OperationLadder, RewriteMachine, SizeExplorer } from './widgets'

export default function Chapter02() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Exponents, towers of exponents, and the top-down evaluation rule <M t="a^{b^c}=a^{(b^c)}" /> (Chapter 1).</>, zh: <>乘方、指数塔，以及从上往下算的约定 <M t="a^{b^c}=a^{(b^c)}" />（第 1 章）。</> },
          { en: <>Judging a notation by the whole sequence of numbers it writes, not by one number (Chapter 1, last section).</>, zh: <>评价一种记号要看它写出的整个数列，而不是某一个数（第 1 章最后一节）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="ladder" kicker={{ en: 'Round 6', zh: '第六回合' }} title={{ en: 'A machine that repeats', zh: '一台“重复”的机器' }}>
        <P
          zh={<>第 1 章的规律：每个新招数都是把上一个招数<b>重复</b>很多次。加法重复“加一”，乘法重复加法，乘方重复乘法，指数塔重复乘方。这个规律凭什么要停？1976 年，高德纳（Donald Knuth）用<b>箭头</b>让它永远不停。</>}
          en={<>Chapter 1’s pattern: every new trick <b>repeats</b> the previous one. Addition repeats “add one,” multiplication repeats addition, powers repeat multiplication, towers repeat powers. Why should it ever stop? In 1976 Donald Knuth made it run forever with <b>arrows</b>.</>}
        />
        <MB t="a\uparrow b=a^b,\qquad a\uparrow\uparrow b=\underbrace{a\uparrow a\uparrow\cdots\uparrow a}_{b\ \text{个/copies}},\qquad a\uparrow\uparrow\uparrow b=\underbrace{a\uparrow\uparrow a\uparrow\uparrow\cdots\uparrow\uparrow a}_{b\ \text{个/copies}},\ \ldots" />
        <P
          zh={<>同种箭头连写时<b>从右往左</b>算，和指数塔一样。所以 <M t="a\uparrow\uparrow b" /> 是 <M t="b" /> 层的指数塔，<M t="a\uparrow\uparrow\uparrow b" /> 是把“搭塔”重复 <M t="b" /> 次。</>}
          en={<>A chain of equal arrows is evaluated <b>from the right</b>, like a tower. So <M t="a\uparrow\uparrow b" /> is a tower of height <M t="b" />, and <M t="a\uparrow\uparrow\uparrow b" /> repeats “build a tower” <M t="b" /> times.</>}
        />
        <H3 en="Climb the ladder" zh="沿阶梯往上" />
        <Widget title={{ en: 'The ladder of operations', zh: '运算的阶梯' }}>
          <OperationLadder />
        </Widget>
        <P
          zh={<><M t="3\uparrow\uparrow\uparrow3=3\uparrow\uparrow(3\uparrow\uparrow3)" /> 是一座由 3 组成、高 <M t="3\uparrow\uparrow3=7\,625\,597\,484\,987" /> 层的指数塔。每个 3 写 2 厘米高，这座塔大约从地球伸到太阳。它的昵称是 <b>tritri</b>——而这才三个箭头。</>}
          en={<><M t="3\uparrow\uparrow\uparrow3=3\uparrow\uparrow(3\uparrow\uparrow3)" /> is a tower of 3’s that is <M t="3\uparrow\uparrow3=7{,}625{,}597{,}484{,}987" /> levels tall. Write each 3 two centimetres high and it reaches roughly from the Earth to the Sun. Its nickname is <b>tritri</b> — and that is only three arrows.</>}
        />
        <P
          zh={<>第 1 章的耆那教数学家也可以收尾了：按《大数理论》的估算，他们的 UAA 约为 <M t="10\uparrow\uparrow\uparrow12" />，最大的 UAnAn 约为 <M t="10\uparrow\uparrow\uparrow39" />。两千年的古代冠军，<b>三个箭头</b>就写完了。</>}
          en={<>This also settles Chapter 1’s Jain mathematicians. By the estimates in 曹知秋’s book, their UAA is roughly <M t="10\uparrow\uparrow\uparrow12" /> and their largest, UAnAn, roughly <M t="10\uparrow\uparrow\uparrow39" />. Two thousand years of champions, written with <b>three arrows</b>.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="recursion" kicker={{ en: 'Making it rigorous', zh: '把它说严格' }} title={{ en: '“And so on” is not a definition', zh: '“以此类推”不是定义' }}>
        <P
          zh={<>省略号对小例子没问题，可一旦箭头个数本身大得写不出来，“以此类推”就靠不住了。正确的工具是<b>递归定义</b>：规定起点，再规定如何由上一步得到下一步。比如 <M t="a+0=a" />、<M t="a+(b+1)=(a+b)+1" />，以及</>}
          en={<>Dots are fine for small cases, but once the number of arrows is too large to write, “and so on” cannot be trusted. The right tool is a <b>recursive definition</b>: say where to start and how each step follows from the previous one. For instance <M t="a+0=a" />, <M t="a+(b+1)=(a+b)+1" />, and</>}
        />
        <MB t="a\times0=0,\quad a\times(b+1)=a+a\times b;\qquad a^0=1,\quad a^{b+1}=a\times a^{b}." />
        <H3 en="Knuth’s arrows, defined" zh="箭头的严格定义" />
        <Thm kind="definition" name={{ en: 'Knuth arrows (《大数理论》 Def. 2.11)', zh: 'Knuth 箭头（《大数理论》定义 2.11）' }}>
          <B
            zh={<p>对正整数 <M t="a,c" /> 和自然数 <M t="b" />，<M t="a\uparrow^{c}b" />（<M t="c" /> 个箭头）定义为：</p>}
            en={<p>For positive integers <M t="a,c" /> and a natural number <M t="b" />, define <M t="a\uparrow^{c}b" /> (<M t="c" /> arrows) by</p>}
          />
          <MB t="\begin{aligned}&(1)\quad a\uparrow^{1}b=a^{b}\\&(2)\quad a\uparrow^{c}0=1\\&(3)\quad a\uparrow^{c+1}(b+1)=a\uparrow^{c}\bigl(a\uparrow^{c+1}b\bigr)\end{aligned}" />
        </Thm>
        <P
          zh={<>三行字，没有省略号，定义了无穷多种运算。规则 (3) 是发动机：<M t="c+1" /> 个箭头的问题，先化成一个更小的同类问题，再交给 <M t="c" /> 个箭头。</>}
          en={<>Three lines, no dots, infinitely many operations. Rule (3) is the engine: a problem with <M t="c+1" /> arrows becomes a smaller problem of the same kind, whose answer is handed to <M t="c" /> arrows.</>}
        />
        <Widget title={{ en: 'The unfolding machine', zh: '展开机' }} hint={{ en: 'Every line follows from the previous by exactly one rule.', zh: '每一行都由上一行恰好用一条规则得到。' }}>
          <RewriteMachine />
        </Widget>
        <P
          zh={<><M t="3\uparrow\uparrow\uparrow3" /> 会“卡住”：定义唯一确定了它的值，但展开所需的步数本身就是天文数字。<b>“确定”和“算得出来”是两回事</b>——这个主题会反复出现。</>}
          en={<><M t="3\uparrow\uparrow\uparrow3" /> gets stuck: the definition pins down its value exactly, but unfolding takes an astronomical number of steps. <b>“Determined” and “computable in practice” are different things</b> — a recurring theme.</>}
        />
        <H3 en="Two facts by induction" zh="两个归纳法事实" />
        <P
          zh={<>递归定义的天然搭档是数学归纳法。下面这个小结论之后会反复用到。</>}
          en={<>The natural partner of recursion is induction. Here is a small result we will use again and again.</>}
        />
        <Thm name={{ en: '(two easy facts)', zh: '（两个简单的事实）' }}>
          <B
            zh={<p>对所有正整数 <M t="a,c" />：(a) <M t="a\uparrow^{c}1=a" />；(b) <M t="2\uparrow^{c}2=4" />。</p>}
            en={<p>For all positive integers <M t="a,c" />: (a) <M t="a\uparrow^{c}1=a" />; (b) <M t="2\uparrow^{c}2=4" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>对 <M t="c" /> 归纳。(a) <M t="a\uparrow1=a" />；<M t="a\uparrow^{c+1}1=a\uparrow^{c}(a\uparrow^{c+1}0)=a\uparrow^{c}1=a" />。(b) <M t="2^2=4" />；<M t="2\uparrow^{c+1}2=2\uparrow^{c}(2\uparrow^{c+1}1)=2\uparrow^{c}2=4" />，用到 (a)。</>}
            en={<>Induct on <M t="c" />. (a) <M t="a\uparrow1=a" />; <M t="a\uparrow^{c+1}1=a\uparrow^{c}(a\uparrow^{c+1}0)=a\uparrow^{c}1=a" />. (b) <M t="2^2=4" />; <M t="2\uparrow^{c+1}2=2\uparrow^{c}(2\uparrow^{c+1}1)=2\uparrow^{c}2=4" />, using (a).</>}
          />
        </Proof>
        <P
          zh={<>所以 2 和 2 之间放多少个箭头都是 4。<b>大数的力量来自参数一起变大</b>。</>}
          en={<>So any number of arrows between 2 and 2 gives 4. <b>The power comes from letting the inputs grow together.</b></>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="ruler" kicker={{ en: 'Measuring', zh: '丈量' }} title={{ en: 'A ruler for growth', zh: '一把丈量增长的尺子' }}>
        <P
          zh={<>无穷多级运算，怎样排座次？第 1 章说过，比的是整个数列。把每种运算变成单变量函数，给它一个<b>刻度</b>（增长率）：</>}
          en={<>Infinitely many operations — how do we rank them? As Chapter 1 said, compare whole sequences. Turn each operation into a one-variable function and give it a <b>mark</b>, its growth rate:</>}
        />
        <div className="scroll-x">
          <table className="grid">
            <thead>
              <tr>
                <th><L en="function" zh="函数" /></th>
                <th><M t="n+1" /></th>
                <th><M t="n+n" /></th>
                <th><M t="n\uparrow n" /></th>
                <th><M t="n\uparrow\uparrow n" /></th>
                <th><M t="n\uparrow\uparrow\uparrow n" /></th>
                <th><M t="n\uparrow^{m}n" /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th><L en="mark" zh="刻度" /></th>
                <td>0</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td><M t="m+1" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <P
          zh={<>规则只有一条：<b>把函数重复 <M t="n" /> 次，刻度加一</b>。“加一”重复 <M t="n" /> 次是 <M t="n+n" />；“加倍”重复 <M t="n" /> 次是 <M t="n\cdot2^n" />，和乘方同一刻度。于是第 1 章的划记在 0，<M t="10^n" /> 在 2，指数塔在 3。乘法被“跳过”了：在这把尺子上，乘一个常数和加法没有本质区别。</>}
          en={<>One rule: <b>iterating a function <M t="n" /> times adds one to its mark</b>. Iterating “add one” gives <M t="n+n" />; iterating “double” gives <M t="n\cdot2^n" />, the same mark as powers. So Chapter 1’s tallies sit at 0, <M t="10^n" /> at 2, towers at 3. Multiplication is “skipped”: on this ruler, multiplying by a constant is no different in kind from adding.</>}
        />
        <Caution>
          <L
            zh={<>这些刻度目前只是直觉标签。第 4 章用快速增长层次 <M t="f_\alpha" /> 把它们变成定理（例如 <M t="f_{m+1}" /> 恰好夹在 <M t="m" /> 个和 <M t="m+1" /> 个箭头之间），也会看到精确的尺子在边界上会差一格；而“增长率”的一般严格定义至今仍是开放问题。</>}
            en={<>For now these marks are intuitive labels. Chapter 4 turns them into theorems with the fast-growing hierarchy <M t="f_\alpha" /> (e.g. <M t="f_{m+1}" /> sits exactly between <M t="m" /> and <M t="m+1" /> arrows), and shows the precise ruler can be off by one at the boundaries; a rigorous general definition of “growth rate” is still an open problem.</>}
          />
        </Caution>
        <Widget title={{ en: 'How big is it, really?', zh: '它到底有多大？' }}>
          <SizeExplorer />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="diagonal" kicker={{ en: 'The big move', zh: '关键一步' }} title={{ en: 'Diagonalization — and the first infinity', zh: '对角化——以及第一个无穷' }}>
        <P
          zh={<>每多一个箭头，刻度上升一格。有没有函数比<b>所有</b>这些都快？有，办法简单得惊人：让箭头个数也随 <M t="n" /> 变。</>}
          en={<>Each extra arrow climbs one notch. Is there a function faster than <b>all</b> of them? Yes, and the trick is startlingly simple: let the number of arrows grow with <M t="n" />.</>}
        />
        <MB t="d(n)=n\uparrow^{n}n:\qquad 1\uparrow1=1,\quad 2\uparrow\uparrow2=4,\quad 3\uparrow\uparrow\uparrow3,\quad 4\uparrow\uparrow\uparrow\uparrow4,\ \ldots" />
        <H3 en="Walking the diagonal" zh="沿对角线走" />
        <P
          zh={<><M t="d(n)" /> 沿着这张表的对角线走。这一招叫<Term en="diagonalization" zh="对角化" />。</>}
          en={<><M t="d(n)" /> walks down the diagonal of this table: <Term en="diagonalization" zh="对角化" />.</>}
        />
        <Widget title={{ en: 'The diagonal', zh: '对角线' }}>
          <DiagonalTable />
        </Widget>
        <Thm name={{ en: '(the diagonal beats every row)', zh: '（对角线胜过每一行）' }}>
          <B
            zh={<p>对每个固定的箭头数 <M t="m\ge1" />，只要 <M t="n>m" /> 且 <M t="n\ge3" />，就有 <M t="d(n)=n\uparrow^{n}n>n\uparrow^{m}n" />。</p>}
            en={<p>For every fixed number of arrows <M t="m\ge1" />, whenever <M t="n>m" /> and <M t="n\ge3" />, <M t="d(n)=n\uparrow^{n}n>n\uparrow^{m}n" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>由引理 C（下面展开）：<M t="a\ge3,\,b\ge2" /> 时多一个箭头严格更大。从 <M t="m" /> 个箭头一个一个加到 <M t="n" /> 个即可。</>}
            en={<>By Lemma C (panel below), for <M t="a\ge3,\,b\ge2" /> one more arrow is strictly bigger. Add arrows one at a time from <M t="m" /> up to <M t="n" />.</>}
          />
        </Proof>
        <Expand title={{ en: 'The three monotonicity lemmas', zh: '三条单调性引理' }}>
          <B zh={<p>以下 <M t="a\ge2" />，<M t="c\ge1" />。</p>} en={<p>Throughout, <M t="a\ge2" /> and <M t="c\ge1" />.</p>} />
          <Thm kind="lemma" name={{ en: 'A', zh: 'A' }}>
            <L en={<>For every natural number <M t="x" />, <M t="a\uparrow^{c}x\ge x+1" />.</>} zh={<>对每个自然数 <M t="x" />，<M t="a\uparrow^{c}x\ge x+1" />。</>} />
          </Thm>
          <Proof>
            <L
              zh={<>对 <M t="c" /> 归纳。<M t="c=1" />：<M t="a^x\ge2^x\ge x+1" />。设对 <M t="c" /> 成立，对 <M t="x" /> 归纳：<M t="a\uparrow^{c+1}0=1" />；<M t="a\uparrow^{c+1}(x+1)=a\uparrow^{c}(a\uparrow^{c+1}x)\ge a\uparrow^{c+1}x+1\ge x+2" />。</>}
              en={<>Induct on <M t="c" />. For <M t="c=1" />: <M t="a^x\ge2^x\ge x+1" />. Assuming it for <M t="c" />, induct on <M t="x" />: <M t="a\uparrow^{c+1}0=1" />, and <M t="a\uparrow^{c+1}(x+1)=a\uparrow^{c}(a\uparrow^{c+1}x)\ge a\uparrow^{c+1}x+1\ge x+2" />.</>}
            />
          </Proof>
          <Thm kind="lemma" name={{ en: 'B', zh: 'B' }}>
            <L en={<><M t="a\uparrow^{c}b" /> is strictly increasing in <M t="b" />.</>} zh={<><M t="a\uparrow^{c}b" /> 关于 <M t="b" /> 严格递增。</>} />
          </Thm>
          <Proof>
            <L
              zh={<><M t="c=1" /> 显然。<M t="c\ge2" />：由规则 (3) 和引理 A，<M t="a\uparrow^{c}(b+1)=a\uparrow^{c-1}(a\uparrow^{c}b)\ge a\uparrow^{c}b+1" />。</>}
              en={<>Clear for <M t="c=1" />. For <M t="c\ge2" />, by rule (3) and Lemma A, <M t="a\uparrow^{c}(b+1)=a\uparrow^{c-1}(a\uparrow^{c}b)\ge a\uparrow^{c}b+1" />.</>}
            />
          </Proof>
          <Thm kind="lemma" name={{ en: 'C', zh: 'C' }}>
            <L en={<>If <M t="a\ge3" /> and <M t="b\ge2" />, then <M t="a\uparrow^{c+1}b>a\uparrow^{c}b" />.</>} zh={<>若 <M t="a\ge3" /> 且 <M t="b\ge2" />，则 <M t="a\uparrow^{c+1}b>a\uparrow^{c}b" />。</>} />
          </Thm>
          <Proof>
            <L
              zh={<>对 <M t="b" /> 归纳。<M t="b=2" />：<M t="a\uparrow^{c+1}2=a\uparrow^{c}(a\uparrow^{c+1}1)=a\uparrow^{c}a>a\uparrow^{c}2" />（事实 (a)、引理 B、<M t="a>2" />）。归纳步：<M t="a\uparrow^{c+1}b>a\uparrow^{c}b\ge b+1" />，故 <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}(a\uparrow^{c+1}b)>a\uparrow^{c}(b+1)" />（引理 B）。</>}
              en={<>Induct on <M t="b" />. For <M t="b=2" />: <M t="a\uparrow^{c+1}2=a\uparrow^{c}(a\uparrow^{c+1}1)=a\uparrow^{c}a>a\uparrow^{c}2" /> (fact (a), Lemma B, <M t="a>2" />). Step: <M t="a\uparrow^{c+1}b>a\uparrow^{c}b\ge b+1" />, so <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}(a\uparrow^{c+1}b)>a\uparrow^{c}(b+1)" /> by Lemma B.</>}
            />
          </Proof>
        </Expand>
        <P
          zh={<>那么对角函数 <M t="d(n)=n\uparrow^{n}n" /> 的刻度是多少？它比刻度 1、2、3……的每一个都快，所以不能是任何自然数；可它又是一个具体、可写下的函数。我们只好发明一个<b>新刻度</b>，排在所有自然数之后。按传统，它叫</>}
          en={<>So what is the mark of the diagonal function <M t="d(n)=n\uparrow^{n}n" />? It beats marks 1, 2, 3, … — every one — so its mark is no natural number. Yet it is a perfectly concrete function. We are forced to invent a <b>new mark</b>, placed after all natural numbers. By tradition it is called</>}
        />
        <MB t="\omega\quad(\text{omega})." />
        <P
          zh={<>这是我们遇见的第一个<b>无穷</b>：不是模糊的“无穷大”，而是一个精确的位置——所有自然数之后的第一个位置。它标的是“第几”，不是“有多少”。整个第二幕都在研究这种数：<Term en="ordinals" zh="序数" />。</>}
          en={<>This is the first <b>infinity</b> we meet: not a vague “infinitely large,” but a precise position — the first place after all natural numbers. It labels “which place,” not “how many.” All of Act II studies such numbers, the <Term en="ordinals" zh="序数" />.</>}
        />
        <Expand kind="deeper" title={{ en: 'Ackermann’s function (1928)', zh: 'Ackermann 函数（1928）' }}>
          <P
            zh={<>同样的对角化思想 1928 年就出现了。Ackermann 函数的一种常见形式（Péter–Robinson 版本）是 <M t="A(0,n)=n+1" />，<M t="A(m+1,0)=A(m,1)" />，<M t="A(m+1,n+1)=A(m,A(m+1,n))" />。它的对角线 <M t="A(n,n)" /> 和 <M t="n\uparrow^{n}n" /> 同在刻度 <M t="\omega" />。它说明：存在显然可计算、却不能只用“上限预先固定的循环”（原始递归）算出的函数。第 11 章会再提到它。</>}
            en={<>The same diagonal idea appeared in 1928. A common form of Ackermann’s function (the Péter–Robinson version) is <M t="A(0,n)=n+1" />, <M t="A(m+1,0)=A(m,1)" />, <M t="A(m+1,n+1)=A(m,A(m+1,n))" />. Its diagonal <M t="A(n,n)" /> sits at the same mark <M t="\omega" /> as <M t="n\uparrow^{n}n" />. It shows that some obviously computable function cannot be computed with loops whose bounds are fixed in advance (“primitive recursion”). Chapter 11 returns to it.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="graham" kicker={{ en: 'Round 7', zh: '第七回合' }} title={{ en: 'Graham’s number', zh: 'Graham 数' }}>
        <P
          zh={<>对角化之后呢？还是老招数：<b>重复</b>。函数 <M t="x\mapsto3\uparrow^{x}3" /> 已在刻度 <M t="\omega" />；把它重复 64 次，就得到大概是世界上最有名的大数。</>}
          en={<>After diagonalizing, what next? The old trick: <b>repeat</b>. The function <M t="x\mapsto3\uparrow^{x}3" /> sits at mark <M t="\omega" />; iterate it 64 times and you get perhaps the most famous big number in the world.</>}
        />
        <Thm kind="definition" name={{ en: 'Graham’s number', zh: 'Graham 数' }}>
          <figure className="c02-milestone"><figcaption><L en="New milestone" zh="新的里程碑" /><strong><L en="Graham’s number" zh="Graham 数" /></strong></figcaption>
<MB t="G(0)=4,\qquad G(n+1)=3\uparrow^{G(n)}3,\qquad \text{Graham's number}=G(64)." />
        </figure>
        </Thm>
        <Widget title={{ en: '64 layers', zh: '64 层' }}>
          <GrahamLayers />
        </Widget>
        <P
          zh={<>按我们的尺子，把刻度 <M t="\omega" /> 的函数重复 <M t="n" /> 次，刻度是 <M t="\omega+1" />；Graham 数就是这样一个函数在 64 处的值。第 4 章会在刻度 <M t="\omega+1" /> 上定义一个标准函数 <M t="f_{\omega+1}" />，并严格证明 <M t="f_{\omega+1}(64)" /> 比 Graham 数还大。</>}
          en={<>On our ruler, iterating a mark-<M t="\omega" /> function <M t="n" /> times gives mark <M t="\omega+1" />, and Graham’s number is such a function’s value at 64. Chapter 4 defines a standard function <M t="f_{\omega+1}" /> at this mark and proves rigorously that <M t="f_{\omega+1}(64)" /> exceeds Graham’s number.</>}
        />
        <H3 en="Where it came from" zh="它从哪里来" />
        <P
          zh={<>Graham 数不是为了比大而发明的。1971 年，Ronald Graham 和 Bruce Rothschild 研究：<M t="n" /> 维立方体的顶点两两连线，每条线涂红或蓝，<b>是否一定有四个共面的顶点，它们之间的六条线同色？</b>维数够高时答案是肯定的。最小的这种维数 <M t="N^*" /> 是多少？先在三维里试试能不能避开：</>}
          en={<>Graham’s number was not invented to win a duel. In 1971 Ronald Graham and Bruce Rothschild asked: join every pair of corners of an <M t="n" />-cube and colour each segment red or blue; <b>must there be four coplanar corners whose six segments share one colour?</b> In high enough dimension, yes. What is the least such dimension <M t="N^*" />? Try to escape in 3 dimensions:</>}
        />
        <Widget title={{ en: 'Graham’s problem in 3 dimensions', zh: '三维的 Graham 问题' }} hint={{ en: 'Click a segment: red → blue → uncoloured. Drag to rotate.', zh: '点击线段：红 → 蓝 → 不涂；拖动可旋转。' }}>
          <CubeColoring />
        </Widget>
        <P
          zh={<>三维很容易避开。Graham 和 Rothschild 证明 <M t="N^*" /> 存在并给出一个巨大的上界；1977 年 Martin Gardner 在《科学美国人》介绍时，用了一个更好解释的上界 <M t="G(64)" />，“Graham 数”由此得名。现在已知：</>}
          en={<>Three dimensions are easy to escape. Graham and Rothschild proved <M t="N^*" /> exists with an enormous bound; when Martin Gardner described it in <i>Scientific American</i> (1977) he used the easier-to-explain bound <M t="G(64)" />, and the name stuck. Today we know:</>}
        />
        <MB t="13\ \le\ N^*\ <\ 2\uparrow\uparrow\uparrow5." />
        <OpenProblem title={{ en: 'The exact value of N*', zh: 'N* 的精确值' }}>
          <P
            zh={<>下界 13 来自 Barkley（2008）；上界先由 Lavrov–Lee–Mackey（2014）降到 <M t="2\uparrow\uparrow\uparrow6" />，再由 Lipka（2019）降到 <M t="2\uparrow\uparrow\uparrow5" />，比 Graham 数小得不可想象。真正的答案在哪里，没有人知道。</>}
            en={<>The lower bound 13 is due to Barkley (2008). The upper bound was cut to <M t="2\uparrow\uparrow\uparrow6" /> by Lavrov, Lee and Mackey (2014) and to <M t="2\uparrow\uparrow\uparrow5" /> by Lipka (2019) — unimaginably smaller than Graham’s number. Where the true answer lies, nobody knows.</>}
          />
        </OpenProblem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="algorithm" kicker={{ en: 'A word we will need', zh: '一个以后要用的词' }} title={{ en: 'What is an algorithm?', zh: '什么是算法？' }}>
        <P
          zh={<>迄今每个数都有一份<b>有限、精确的操作说明</b>，机械照做原则上就能算出它（哪怕要算到宇宙终结）。这样的说明叫<b>算法</b>。箭头的递归定义几乎能逐字译成程序：</>}
          en={<>Every number so far comes with a <b>finite, precise list of instructions</b> a machine could follow to compute it, in principle. Such a list is an <b>algorithm</b>. The recursive definition of arrows is almost literally a program:</>}
        />
        <Widget title={{ en: 'Arrows as a program', zh: '把箭头写成程序' }}>
          <ArrowProgram />
        </Widget>
        <P
          zh={<>能被某个算法算出来，叫<b>可计算</b>。人们相信，任何合理的“机械计算”方式能算的东西都一样——这就是 <Term en="Church–Turing thesis" zh="Church–Turing 论题" />。它不是定理，因为“机械计算”本身不是数学定义；但迄今提出的每种计算模型都被证明等价。第 11 章会用图灵机把“算法”严格化。</>}
          en={<>Something some algorithm can produce is <b>computable</b>. It is widely believed that every reasonable notion of mechanical computation computes the same things: the <Term en="Church–Turing thesis" zh="Church–Turing 论题" />. It is not a theorem, since “mechanical computation” is not a mathematical definition; but every model proposed so far has turned out equivalent. Chapter 11 makes “algorithm” precise with Turing machines.</>}
        />
        <P
          zh={<>记住这个词。第三幕会遇到一个序数，它被定义为“任何算法都够不着的第一个位置”；第五幕会遇到比任何可计算函数都长得快的函数。</>}
          en={<>Keep this word in mind. In Act III we meet an ordinal defined as “the first position no algorithm can reach”; in Act V, functions that outgrow every computable function.</>}
        />
        <Quiz
          q={{ zh: <p>函数 <M t="n\mapsto G(n)" />（Graham 函数）在我们的尺子上是什么刻度？</p>, en: <p>Where does <M t="n\mapsto G(n)" /> (Graham’s function) sit on our ruler?</p> }}
          options={[
            { zh: <p>64</p>, en: <p>64</p> },
            { zh: <p><M t="\omega" /></p>, en: <p><M t="\omega" /></p> },
            { zh: <p><M t="\omega+1" /></p>, en: <p><M t="\omega+1" /></p> },
          ]}
          answer={2}
          explain={{
            zh: <p><M t="x\mapsto3\uparrow^{x}3" /> 在刻度 <M t="\omega" />（箭头数随变量变化），<M t="G(n)" /> 把它重复 <M t="n" /> 次，刻度加一：<M t="\omega+1" />。64 只是代入的输入。</p>,
            en: <p><M t="x\mapsto3\uparrow^{x}3" /> sits at <M t="\omega" /> (the arrow count varies), and <M t="G(n)" /> iterates it <M t="n" /> times, adding one: <M t="\omega+1" />. The 64 is just the input.</p>,
          }}
        />
        <KeyIdea>
          <L
            zh={<>整个大数数学只有两个基本动作：<b>重复</b>（刻度 +1）和<b>对角化</b>（越过一整列刻度，到达新的极限）。我们已经用它们从 0 走到了 <M t="\omega+1" />。<M t="\omega" /> 之后的 <M t="\omega+2" />、<M t="\omega+\omega" />……这些“无穷之后的位置”到底是什么？下一章正式走进序数的世界。</>}
            en={<>All of googology runs on two moves: <b>repeat</b> (mark +1) and <b>diagonalize</b> (leap past a whole sequence of marks to a new limit). With them we have climbed from 0 to <M t="\omega+1" />. But what are <M t="\omega+2" />, <M t="\omega+\omega" />, … — these “positions after infinity”? Next chapter we enter the world of ordinals.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
