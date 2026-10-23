import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { ArrowProgram, CubeColoring, DiagonalTable, Dominoes, GrahamLayers, OperationLadder, RewriteMachine, SizeExplorer } from './widgets'

export default function Chapter02() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Exponents, towers, and evaluating towers from the top (Chapter 1).</>, zh: <>乘方、指数塔，以及指数塔从上往下算（第 1 章）。</> },
          { en: <>The idea that a notation is judged by the sequence of numbers it can write (Chapter 1, last section).</>, zh: <>用“能写出的数列”来评价一种记号（第 1 章最后一节）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="ladder" kicker={{ en: 'Round 6', zh: '第六回合' }} title={{ en: 'A machine that repeats', zh: '一台“重复”的机器' }}>
        <P
          zh={
            <>
              上一章结尾，我们发现了一个规律：每个新招数，都是把上一个招数<b>重复</b>很多次。加法是重复“加一”，乘法是重复加法，乘方是重复乘法，指数塔是重复乘方。这个规律为什么要停下？1976 年，计算机科学家高德纳（Donald Knuth）发明了一个简洁的记号，让它永远不用停下：<b>箭头</b>。
            </>
          }
          en={
            <>
              At the end of the last chapter we spotted a pattern: every new trick <b>repeats</b> the previous one many times. Addition
              repeats “add one”; multiplication repeats addition; powers repeat multiplication; towers repeat powers. Why should the
              pattern ever stop? In 1976 the computer scientist Donald Knuth introduced a compact notation that lets it run forever:{' '}
              <b>arrows</b>.
            </>
          }
        />
        <MB t="a\uparrow b=a^b,\qquad a\uparrow\uparrow b=\underbrace{a\uparrow a\uparrow\cdots\uparrow a}_{b\ \text{个/copies}},\qquad a\uparrow\uparrow\uparrow b=\underbrace{a\uparrow\uparrow a\uparrow\uparrow\cdots\uparrow\uparrow a}_{b\ \text{个/copies}},\ \ldots" />
        <P
          zh={<>和指数塔一样，同一种箭头连写时<b>从右往左</b>算。于是 <M t="a\uparrow\uparrow b" /> 就是 <M t="b" /> 层的指数塔，而 <M t="a\uparrow\uparrow\uparrow b" /> 是把“搭塔”这件事重复 <M t="b" /> 次。点一点每一级运算看看：</>}
          en={<>As with towers, a chain of the same arrow is evaluated <b>from the right</b>. So <M t="a\uparrow\uparrow b" /> is a tower of height <M t="b" />, and <M t="a\uparrow\uparrow\uparrow b" /> repeats “build a tower” <M t="b" /> times. Click through the levels:</>}
        />
        <Widget title={{ en: 'The ladder of operations', zh: '运算的阶梯' }}>
          <OperationLadder />
        </Widget>
        <P
          zh={
            <>
              试试 <M t="3\uparrow\uparrow\uparrow3" />。它等于 <M t="3\uparrow\uparrow(3\uparrow\uparrow3)" />，也就是一座由 3 组成、高 <M t="3\uparrow\uparrow3=7\,625\,597\,484\,987" /> 层的指数塔。如果每个 3 写 2 厘米高，这座塔从地球一直伸到太阳。它有个昵称叫 <b>tritri</b>。而这只是三个箭头。
            </>
          }
          en={
            <>
              Try <M t="3\uparrow\uparrow\uparrow3" />. It equals <M t="3\uparrow\uparrow(3\uparrow\uparrow3)" />: a tower of 3’s that
              is <M t="3\uparrow\uparrow3=7{,}625{,}597{,}484{,}987" /> levels tall. Write each 3 two centimetres high and the tower
              reaches from the Earth to the Sun. Its nickname is <b>tritri</b>. And that is only three arrows.
            </>
          }
        />
        <P
          zh={
            <>
              顺便为第 1 章的耆那教数学家收个尾：按《大数理论》的估算，他们的 UAA 是一座“塔的塔”，嵌套约 11 层，大约相当于 <M t="10\uparrow\uparrow\uparrow12" />；最大的 UAnAn 大约是 <M t="10\uparrow\uparrow\uparrow39" />。两千多年来最强的古代大数，用<b>三个箭头</b>就写下了。
            </>
          }
          en={
            <>
              This also settles the Jain mathematicians of Chapter 1. By the estimate in 曹知秋’s notes, their UAA is a tower of towers
              nested about 11 deep, roughly <M t="10\uparrow\uparrow\uparrow12" />; their biggest, UAnAn, is roughly{' '}
              <M t="10\uparrow\uparrow\uparrow39" />. Two thousand years of champions, written with <b>three arrows</b>.
            </>
          }
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="recursion" kicker={{ en: 'Making it rigorous', zh: '把它说严格' }} title={{ en: '“And so on” is not a definition', zh: '“以此类推”不是定义' }}>
        <P
          zh={
            <>
              上面的定义用了省略号和“以此类推”。对小数字这没问题，但当我们要写“<M t="b" /> 个箭头”而 <M t="b" /> 本身大得写不出来时，省略号就靠不住了：你根本没法“列出来”。数学家的办法是<b>递归定义</b>：只规定两件事——<b>起点</b>是什么，以及<b>怎样从上一步得到下一步</b>。
            </>
          }
          en={
            <>
              The definitions above lean on dots and “and so on.” That is fine for small cases, but once we want “<M t="b" /> arrows” with{' '}
              <M t="b" /> too large to write, dots can no longer be trusted: you cannot list anything out. Mathematicians use a{' '}
              <b>recursive definition</b>, which specifies just two things: <b>where to start</b>, and <b>how to get each step from the
              previous one</b>.
            </>
          }
        />
        <P
          zh={<>比如加法可以完全由“加一”来定义：<M t="a+0=a" />，以及 <M t="a+(b+1)=(a+b)+1" />。同理，乘法和乘方：</>}
          en={<>Addition, for instance, is fully defined from “add one”: <M t="a+0=a" /> and <M t="a+(b+1)=(a+b)+1" />. Likewise multiplication and powers:</>}
        />
        <MB t="a\times0=0,\quad a\times(b+1)=a+a\times b;\qquad a^0=1,\quad a^{b+1}=a\times a^{b}." />
        <Thm kind="definition" name={{ en: 'Knuth arrows (《大数理论》 Def. 2.11)', zh: 'Knuth 箭头（《大数理论》定义 2.11）' }}>
          <B
            zh={<p>对正整数 <M t="a,c" /> 和自然数 <M t="b" />，<M t="a\uparrow^{c}b" />（<M t="c" /> 个箭头）定义为：</p>}
            en={<p>For positive integers <M t="a,c" /> and a natural number <M t="b" />, define <M t="a\uparrow^{c}b" /> (<M t="c" /> arrows) by:</p>}
          />
          <MB t="\begin{aligned}&(1)\quad a\uparrow^{1}b=a^{b}\\&(2)\quad a\uparrow^{c}0=1\\&(3)\quad a\uparrow^{c+1}(b+1)=a\uparrow^{c}\bigl(a\uparrow^{c+1}b\bigr)\end{aligned}" />
        </Thm>
        <P
          zh={
            <>
              三行字，没有省略号，却定义了无穷多种运算。规则 (3) 是发动机：要算 <M t="c+1" /> 个箭头，就先算一个“少一点”的同类问题，再交给 <M t="c" /> 个箭头。让机器一步一步替你展开：
            </>
          }
          en={
            <>
              Three lines, no dots — and infinitely many operations defined. Rule (3) is the engine: to compute with <M t="c+1" />{' '}
              arrows, first solve a slightly smaller problem of the same kind, then hand the result to <M t="c" /> arrows. Let the machine
              unfold it for you step by step:
            </>
          }
        />
        <Widget title={{ en: 'The unfolding machine', zh: '展开机' }} hint={{ en: 'Every line follows from the previous by exactly one rule.', zh: '每一行都由上一行恰好用一条规则得到。' }}>
          <RewriteMachine />
        </Widget>
        <P
          zh={<>注意 <M t="3\uparrow\uparrow\uparrow3" /> 会“卡住”：定义仍然唯一确定了它的值，只是展开它需要的步数本身就是一个天文数字。这一点以后会反复出现：<b>“确定”和“算得出来”是两回事</b>。</>}
          en={<>Notice that <M t="3\uparrow\uparrow\uparrow3" /> gets “stuck”: the definition still pins down its value exactly, but unfolding it takes an astronomical number of steps. This theme will return again and again: <b>“determined” and “computable in practice” are different things</b>.</>}
        />
        <H3 en="Proof by induction: the domino principle" zh="数学归纳法：多米诺骨牌原理" />
        <P
          zh={
            <>
              递归定义有一个天然的搭档：<b>数学归纳法</b>。想证明某个关于自然数的命题 <M t="P(n)" /> 对所有 <M t="n" /> 都成立，只要证明两件事：(i) <M t="P(0)" /> 成立；(ii) 只要 <M t="P(k)" /> 成立，<M t="P(k+1)" /> 就成立。就像一排多米诺骨牌：第一块会倒，而且每一块倒下都会推倒下一块，那么所有骨牌都会倒。
            </>
          }
          en={
            <>
              Recursive definitions have a natural partner: <b>mathematical induction</b>. To prove a statement <M t="P(n)" /> for every
              natural number <M t="n" />, prove two things: (i) <M t="P(0)" /> holds; (ii) whenever <M t="P(k)" /> holds, so does{' '}
              <M t="P(k+1)" />. Like a row of dominoes: the first one falls, and each falling domino knocks over the next — so they all
              fall.
            </>
          }
        />
        <Widget title={{ en: 'Induction', zh: '归纳法' }}>
          <Dominoes />
        </Widget>
        <Thm name={{ en: '(two easy facts)', zh: '（两个简单的事实）' }}>
          <B
            zh={<p>对所有正整数 <M t="a,c" />：(a) <M t="a\uparrow^{c}1=a" />；(b) <M t="2\uparrow^{c}2=4" />。</p>}
            en={<p>For all positive integers <M t="a,c" />: (a) <M t="a\uparrow^{c}1=a" />; (b) <M t="2\uparrow^{c}2=4" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={
              <>
                对 <M t="c" /> 归纳。(a) <M t="c=1" /> 时 <M t="a\uparrow1=a^1=a" />。若 <M t="a\uparrow^{c}1=a" />，则由规则 (3)、(2)：<M t="a\uparrow^{c+1}1=a\uparrow^{c}(a\uparrow^{c+1}0)=a\uparrow^{c}1=a" />。(b) <M t="c=1" /> 时 <M t="2^2=4" />。若 <M t="2\uparrow^{c}2=4" />，则 <M t="2\uparrow^{c+1}2=2\uparrow^{c}(2\uparrow^{c+1}1)=2\uparrow^{c}2=4" />，这里用了 (a)。
              </>
            }
            en={
              <>
                Induct on <M t="c" />. (a) For <M t="c=1" />, <M t="a\uparrow1=a^1=a" />. If <M t="a\uparrow^{c}1=a" />, then by rules
                (3) and (2), <M t="a\uparrow^{c+1}1=a\uparrow^{c}(a\uparrow^{c+1}0)=a\uparrow^{c}1=a" />. (b) For <M t="c=1" />,{' '}
                <M t="2^2=4" />. If <M t="2\uparrow^{c}2=4" />, then <M t="2\uparrow^{c+1}2=2\uparrow^{c}(2\uparrow^{c+1}1)=2\uparrow^{c}2=4" />,
                using (a).
              </>
            }
          />
        </Proof>
        <P
          zh={<>所以“2 和 2 之间放多少个箭头都是 4”——这是个有趣的特例，也提醒我们：<b>大数的力量来自参数一起变大</b>。</>}
          en={<>So “any number of arrows between 2 and 2 gives 4” — a funny special case, and a reminder that <b>the power comes from letting the inputs grow together</b>.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="ruler" kicker={{ en: 'Measuring', zh: '丈量' }} title={{ en: 'A ruler for growth', zh: '一把丈量增长的尺子' }}>
        <P
          zh={
            <>
              现在我们有了无穷多级运算。怎样给它们排座次？第 1 章说过，要比的不是某一个数，而是整个数列。我们把每种记号“对角地”变成一个单变量函数，再给它一个<b>刻度</b>（增长率）：
            </>
          }
          en={
            <>
              We now have infinitely many operations. How do we rank them? As Chapter 1 taught, we compare whole sequences, not single
              numbers. Turn each operation into a one-variable function and give it a <b>mark</b> on a ruler — its growth rate:
            </>
          }
        />
        <div className="scroll-x">
          <table className="grid">
            <thead>
              <tr>
                <th>
                  <L en="function" zh="函数" />
                </th>
                <th>
                  <M t="n+1" />
                </th>
                <th>
                  <M t="n+n" />
                </th>
                <th>
                  <M t="n\uparrow n" />
                </th>
                <th>
                  <M t="n\uparrow\uparrow n" />
                </th>
                <th>
                  <M t="n\uparrow\uparrow\uparrow n" />
                </th>
                <th>
                  <M t="n\uparrow^{m}n" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <L en="mark" zh="刻度" />
                </th>
                <td>0</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>
                  <M t="m+1" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <P
          zh={
            <>
              规则只有一条：<b>把一个函数重复 <M t="n" /> 次，刻度加一</b>。“加一”重复 <M t="n" /> 次得到 <M t="n+n" />；“加倍”重复 <M t="n" /> 次得到 <M t="n\cdot2^n" />，和乘方同一个刻度。这样，第 1 章的划记是 0，位值制 <M t="10^n" /> 是 2，指数塔是 3。注意，乘法被“跳过”了——因为在这把尺子上，乘法和加法一样只是“一次重复”的产物，没有本质区别。
            </>
          }
          en={
            <>
              One rule: <b>iterating a function <M t="n" /> times adds one to its mark</b>. Iterating “add one” <M t="n" /> times gives{' '}
              <M t="n+n" />; iterating “double” <M t="n" /> times gives <M t="n\cdot2^n" />, the same mark as powers. So Chapter 1’s
              tallies sit at 0, place value <M t="10^n" /> at 2, and towers at 3. Multiplication gets “skipped” — on this ruler it is not
              essentially different from addition.
            </>
          }
        />
        <Caution>
          <L
            zh={<>这里的刻度目前还只是直觉上的标签。第 4 章会用“快速增长层次”给它们一个精确的定义；而“增长率”到底该怎么严格定义，至今仍是一个开放问题。</>}
            en={<>For now these marks are intuitive labels. Chapter 4 gives them a precise meaning through the fast-growing hierarchy — and how to define “growth rate” rigorously in general is still an open problem.</>}
          />
        </Caution>
        <Widget title={{ en: 'How big is it, really?', zh: '它到底有多大？' }}>
          <SizeExplorer />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="diagonal" kicker={{ en: 'The big move', zh: '关键一步' }} title={{ en: 'Diagonalization — and the first infinity', zh: '对角化——以及第一个无穷' }}>
        <P
          zh={
            <>
              刻度 1、2、3……每加一个箭头就往上走一格。有没有一个函数比<b>所有</b>这些都快？有，而且办法简单得惊人：让箭头的个数也随着 <M t="n" /> 变——
            </>
          }
          en={
            <>
              Marks 1, 2, 3, … — each extra arrow climbs one notch. Is there a function faster than <b>all</b> of them? Yes, and the trick
              is startlingly simple: let the number of arrows grow with <M t="n" /> too —
            </>
          }
        />
        <MB t="d(n)=n\uparrow^{n}n:\qquad 1\uparrow1=1,\quad 2\uparrow\uparrow2=4,\quad 3\uparrow\uparrow\uparrow3,\quad 4\uparrow\uparrow\uparrow\uparrow4,\ \ldots" />
        <P
          zh={<>把所有行排成一张表，<M t="d(n)=n\uparrow^{n}n" /> 就是沿着对角线一路往下走。这个手法叫<b>对角化</b>，它是整个大数数学最重要的武器之一。</>}
          en={<>Lay the rows out as a table, and <M t="d(n)=n\uparrow^{n}n" /> walks down the diagonal. The technique is called <b>diagonalization</b>, one of the most important weapons in all of googology.</>}
        />
        <Widget title={{ en: 'The diagonal', zh: '对角线' }}>
          <DiagonalTable />
        </Widget>
        <Thm name={{ en: '(the diagonal beats every row)', zh: '（对角线胜过每一行）' }}>
          <B
            zh={<p>对每个固定的箭头数 <M t="m" />，只要 <M t="n>m" /> 且 <M t="n\ge3" />，就有 <M t="d(n)=n\uparrow^{n}n>n\uparrow^{m}n" />。</p>}
            en={<p>For every fixed number of arrows <M t="m" />, whenever <M t="n>m" /> and <M t="n\ge3" />, we have <M t="d(n)=n\uparrow^{n}n>n\uparrow^{m}n" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>关键引理是“对 <M t="a\ge3,\,b\ge2" />，多一个箭头严格更大”：<M t="a\uparrow^{c+1}b>a\uparrow^{c}b" />（证明见下面展开）。从 <M t="m" /> 个箭头开始一个一个加到 <M t="n" /> 个，每加一个都严格变大，所以 <M t="n\uparrow^{n}n>n\uparrow^{m}n" />。</>}
            en={<>The key lemma: for <M t="a\ge3,\,b\ge2" />, one more arrow is strictly bigger, <M t="a\uparrow^{c+1}b>a\uparrow^{c}b" /> (proof below). Adding arrows one at a time from <M t="m" /> up to <M t="n" />, each step strictly increases the value, so <M t="n\uparrow^{n}n>n\uparrow^{m}n" />.</>}
          />
        </Proof>
        <Expand title={{ en: 'The three monotonicity lemmas', zh: '三条单调性引理' }}>
          <B
            zh={<p>以下 <M t="a\ge2" />，<M t="c\ge1" />。</p>}
            en={<p>Throughout, <M t="a\ge2" /> and <M t="c\ge1" />.</p>}
          />
          <Thm kind="lemma" name={{ en: 'A', zh: 'A' }}>
            <L en={<>For every natural number <M t="x" />, <M t="a\uparrow^{c}x\ge x+1" />.</>} zh={<>对每个自然数 <M t="x" />，<M t="a\uparrow^{c}x\ge x+1" />。</>} />
          </Thm>
          <Proof>
            <L
              zh={<>对 <M t="c" /> 归纳。<M t="c=1" />：<M t="a^x\ge2^x\ge x+1" />（对 <M t="x" /> 归纳：<M t="2^{x+1}=2\cdot2^x\ge2(x+1)\ge x+2" />）。假设对 <M t="c" /> 成立，再对 <M t="x" /> 归纳证明 <M t="c+1" /> 的情形：<M t="x=0" /> 时 <M t="a\uparrow^{c+1}0=1" />；且 <M t="a\uparrow^{c+1}(x+1)=a\uparrow^{c}(a\uparrow^{c+1}x)\ge a\uparrow^{c+1}x+1\ge x+2" />。</>}
              en={<>Induct on <M t="c" />. For <M t="c=1" />: <M t="a^x\ge2^x\ge x+1" /> (by induction on <M t="x" />: <M t="2^{x+1}=2\cdot2^x\ge2(x+1)\ge x+2" />). Assuming it for <M t="c" />, induct on <M t="x" /> for <M t="c+1" />: at <M t="x=0" />, <M t="a\uparrow^{c+1}0=1" />; and <M t="a\uparrow^{c+1}(x+1)=a\uparrow^{c}(a\uparrow^{c+1}x)\ge a\uparrow^{c+1}x+1\ge x+2" />.</>}
            />
          </Proof>
          <Thm kind="lemma" name={{ en: 'B', zh: 'B' }}>
            <L en={<><M t="a\uparrow^{c}b" /> is strictly increasing in <M t="b" />.</>} zh={<><M t="a\uparrow^{c}b" /> 关于 <M t="b" /> 严格递增。</>} />
          </Thm>
          <Proof>
            <L
              zh={<><M t="c=1" />：<M t="a^{b+1}=a\cdot a^b>a^b" />。<M t="c\ge2" />：由规则 (3) 和引理 A，<M t="a\uparrow^{c}(b+1)=a\uparrow^{c-1}(a\uparrow^{c}b)\ge a\uparrow^{c}b+1" />。</>}
              en={<>For <M t="c=1" />: <M t="a^{b+1}=a\cdot a^b>a^b" />. For <M t="c\ge2" />, by rule (3) and Lemma A: <M t="a\uparrow^{c}(b+1)=a\uparrow^{c-1}(a\uparrow^{c}b)\ge a\uparrow^{c}b+1" />.</>}
            />
          </Proof>
          <Thm kind="lemma" name={{ en: 'C', zh: 'C' }}>
            <L en={<>If <M t="a\ge3" /> and <M t="b\ge2" />, then <M t="a\uparrow^{c+1}b>a\uparrow^{c}b" />.</>} zh={<>若 <M t="a\ge3" /> 且 <M t="b\ge2" />，则 <M t="a\uparrow^{c+1}b>a\uparrow^{c}b" />。</>} />
          </Thm>
          <Proof>
            <L
              zh={<>对 <M t="b" /> 归纳。<M t="b=2" />：<M t="a\uparrow^{c+1}2=a\uparrow^{c}(a\uparrow^{c+1}1)=a\uparrow^{c}a>a\uparrow^{c}2" />（用事实 (a) 和引理 B，<M t="a>2" />）。归纳步：由归纳假设和引理 A，<M t="a\uparrow^{c+1}b>a\uparrow^{c}b\ge b+1" />，所以 <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}(a\uparrow^{c+1}b)>a\uparrow^{c}(b+1)" />（引理 B）。</>}
              en={<>Induct on <M t="b" />. For <M t="b=2" />: <M t="a\uparrow^{c+1}2=a\uparrow^{c}(a\uparrow^{c+1}1)=a\uparrow^{c}a>a\uparrow^{c}2" /> by fact (a) and Lemma B, since <M t="a>2" />. Step: by hypothesis and Lemma A, <M t="a\uparrow^{c+1}b>a\uparrow^{c}b\ge b+1" />, so <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}(a\uparrow^{c+1}b)>a\uparrow^{c}(b+1)" /> by Lemma B.</>}
            />
          </Proof>
        </Expand>
        <P
          zh={
            <>
              现在问题来了：对角线函数 <M t="d(n)=n\uparrow^{n}n" />（箭头个数随 <M t="n" /> 一起变大）的刻度是多少？刚才证明了，它比刻度 1、2、3……的每一个都快，所以它的刻度不能是任何自然数。但它显然又是一个具体的、可以写下来的函数。我们只好给它一个<b>新的刻度</b>，排在所有自然数之后。按照传统，这个刻度叫做
            </>
          }
          en={
            <>
              Now the question: what is the mark of the diagonal function <M t="d(n)=n\uparrow^{n}n" /> (the number of arrows grows with <M t="n" />)? We just proved it is faster than marks 1, 2, 3, … — every one of them — so its mark
              cannot be any natural number. Yet it is a perfectly concrete function. We are forced to invent a <b>new mark</b>, placed
              after all the natural numbers. By tradition it is called
            </>
          }
        />
        <MB t="\omega\quad(\text{omega})." />
        <P
          zh={
            <>
              这是我们遇见的第一个<b>无穷</b>——但它不是“无穷大”那种模糊的说法，而是一个精确的位置：所有自然数之后的第一个位置。它不是用来数“有多少”的，而是用来标“第几”的。下一幕整幕都在研究这种数，它们叫做<Term en="ordinals" zh="序数" />。
            </>
          }
          en={
            <>
              This is the first <b>infinity</b> we meet — not the vague “infinitely large,” but a precise position: the first place after
              all the natural numbers. It does not count “how many”; it labels “which place.” The whole next act studies such numbers,
              called <Term en="ordinals" zh="序数" />.
            </>
          }
        />
        <Expand kind="deeper" title={{ en: 'Ackermann’s function (1928)', zh: 'Ackermann 函数（1928）' }}>
          <P
            zh={
              <>
                同样的对角化思想早在 1928 年就出现了。Ackermann 定义了 <M t="A(0,n)=n+1" />，<M t="A(m,0)=A(m-1,1)" />，<M t="A(m,n)=A(m-1,A(m,n-1))" />。它的“对角线” <M t="A(n,n)" /> 和 <M t="n\uparrow^{n}n" /> 处在同一个刻度 <M t="\omega" />。Ackermann 用它证明了：存在一个显然可以计算、却不能只用“有固定上限的循环”（原始递归）算出来的函数——这是可计算性理论史上的里程碑，第 11 章会再回到这个话题。
              </>
            }
            en={
              <>
                The same diagonal idea appeared in 1928. Ackermann defined <M t="A(0,n)=n+1" />, <M t="A(m,0)=A(m-1,1)" />,{' '}
                <M t="A(m,n)=A(m-1,A(m,n-1))" />. Its diagonal <M t="A(n,n)" /> sits at the same mark <M t="\omega" /> as{' '}
                <M t="n\uparrow^{n}n" />. Ackermann used it to show that some obviously computable function cannot be computed using only
                loops with a bound fixed in advance (“primitive recursion”) — a milestone in the history of computability, which we
                revisit in Chapter 11.
              </>
            }
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="graham" kicker={{ en: 'Round 7', zh: '第七回合' }} title={{ en: 'Graham’s number', zh: 'Graham 数' }}>
        <P
          zh={
            <>
              对角化之后呢？还是那个老招数：<b>重复</b>。函数 <M t="x\mapsto3\uparrow^{x}3" /> 已经在刻度 <M t="\omega" /> 上；把它重复 64 次，就得到了大概是世界上最有名的大数：
            </>
          }
          en={<>After diagonalizing, what next? The old trick: <b>repeat</b>. The function <M t="x\mapsto3\uparrow^{x}3" /> already sits at mark <M t="\omega" />; repeat it 64 times and you get perhaps the most famous big number in the world:</>}
        />
        <Thm kind="definition" name={{ en: 'Graham’s number', zh: 'Graham 数' }}>
          <MB t="G(0)=4,\qquad G(n+1)=3\uparrow^{G(n)}3,\qquad \text{Graham's number}=G(64)." />
        </Thm>
        <Widget title={{ en: '64 layers', zh: '64 层' }}>
          <GrahamLayers />
        </Widget>
        <P
          zh={
            <>
              按我们的尺子，把刻度 <M t="\omega" /> 的函数重复 <M t="n" /> 次，刻度就是 <M t="\omega+1" />。Graham 数就是这样一个 <M t="\omega+1" /> 级函数在 64 处的值。第 4 章会严格证明：<M t="f_{\omega+1}(64)" /> 比 Graham 数还大。
            </>
          }
          en={
            <>
              On our ruler, repeating a mark-<M t="\omega" /> function <M t="n" /> times gives mark <M t="\omega+1" />. Graham’s number is
              the value at 64 of such an <M t="\omega+1" /> function. In Chapter 4 we will prove rigorously that <M t="f_{\omega+1}(64)" />{' '}
              exceeds it.
            </>
          }
        />
        <H3 en="Where it came from" zh="它从哪里来" />
        <P
          zh={
            <>
              Graham 数并不是为了“比大”而发明的。1971 年，Ronald Graham 和 Bruce Rothschild 研究了这样一个问题：在 <M t="n" /> 维立方体中，把每两个顶点用线段连起来，每条线段涂成红色或蓝色。<b>是否一定能找到四个共面的顶点，它们之间的六条线段颜色全都相同？</b>维数够高时答案是“一定能”。最小的这种维数 <M t="N^*" /> 是多少？下面是三维的情形，你来试试能不能避开：
            </>
          }
          en={
            <>
              Graham’s number was not invented to win a duel. In 1971 Ronald Graham and Bruce Rothschild studied this question: join every
              pair of corners of an <M t="n" />-dimensional cube with a segment and colour each segment red or blue.{' '}
              <b>Must there be four coplanar corners whose six connecting segments all share one colour?</b> In high enough dimension the
              answer is yes. What is the smallest such dimension <M t="N^*" />? Here is the 3-dimensional case — can you avoid it?
            </>
          }
        />
        <Widget title={{ en: 'Graham’s problem in 3 dimensions', zh: '三维的 Graham 问题' }} hint={{ en: 'Click a segment to cycle red → blue → uncoloured. Drag to rotate.', zh: '点击线段在 红 → 蓝 → 不涂 之间切换；拖动可以旋转。' }}>
          <CubeColoring />
        </Widget>
        <P
          zh={
            <>
              三维很容易避开。Graham 和 Rothschild 证明了答案存在，并给出了一个巨大的上界；后来 Martin Gardner 在《科学美国人》上介绍时，用一个更容易解释的数 <M t="G(64)" /> 作为上界，这就是“Graham 数”这个名字的由来。现在已知的结果是：
            </>
          }
          en={
            <>
              Three dimensions are easy to escape. Graham and Rothschild proved that <M t="N^*" /> exists and gave an enormous upper bound;
              when Martin Gardner described it in <i>Scientific American</i>, he used the easier-to-explain <M t="G(64)" /> as the bound —
              and the name “Graham’s number” stuck. Today we know:
            </>
          }
        />
        <MB t="13\ \le\ N^*\ <\ 2\uparrow\uparrow\uparrow5." />
        <OpenProblem title={{ en: 'The exact value of N*', zh: 'N* 的精确值' }}>
          <P
            zh={<>下界 13 来自 Lavrov–Lee–Mackey（2014），上界 <M t="2\uparrow\uparrow\uparrow5" /> 来自 Lipka（2019），比 Graham 数小得不可想象。真正的答案在 13 和这个上界之间的什么地方，没有人知道。</>}
            en={<>The lower bound 13 is due to Lavrov, Lee and Mackey (2014); the upper bound <M t="2\uparrow\uparrow\uparrow5" />, unimaginably smaller than Graham’s number, to Lipka (2019). Where between them the true answer lies, nobody knows.</>}
          />
        </OpenProblem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="algorithm" kicker={{ en: 'A word we will need', zh: '一个以后要用的词' }} title={{ en: 'What is an algorithm?', zh: '什么是算法？' }}>
        <P
          zh={
            <>
              到目前为止，我们定义的每一个数都有一个共同点：存在一份<b>有限、精确的操作说明</b>，任何人（或机器）只要机械地照做，原则上就能算出它——哪怕要算到宇宙毁灭。这样的说明叫<b>算法</b>。箭头的递归定义，几乎可以逐字翻译成一段计算机程序：
            </>
          }
          en={
            <>
              Every number we have defined so far shares one feature: there is a <b>finite, precise list of instructions</b> that anyone —
              or any machine — could follow mechanically to compute it, at least in principle, even if it would take longer than the life
              of the universe. Such a list is an <b>algorithm</b>. The recursive definition of arrows translates almost word for word into
              a computer program:
            </>
          }
        />
        <Widget title={{ en: 'Arrows as a program', zh: '把箭头写成程序' }}>
          <ArrowProgram />
        </Widget>
        <P
          zh={
            <>
              “能用某个算法算出来”叫做<b>可计算</b>。人们相信，任何一种“机械地计算”的合理方式，能算出的东西都完全一样——这被称为 <Term en="Church–Turing thesis" zh="Church–Turing 论题" />。它不是定理，因为“机械地计算”本身不是一个数学定义；但几十年来提出的每一种计算模型都被证明是等价的。第 11 章我们会把“算法”严格化为图灵机。
            </>
          }
          en={
            <>
              Something that some algorithm can produce is called <b>computable</b>. It is widely believed that every reasonable notion of
              “mechanical computation” computes exactly the same things — the <Term en="Church–Turing thesis" zh="Church–Turing 论题" />. It
              is not a theorem, since “mechanical computation” is not itself a mathematical definition; but every model of computation
              proposed over the decades has turned out equivalent. In Chapter 11 we make “algorithm” precise with Turing machines.
            </>
          }
        />
        <P
          zh={<>记住这个词。到第三幕，我们会遇到一个序数，它被定义为“任何算法都够不着的第一个位置”；到第五幕，我们会遇到比任何可计算函数都长得快的函数。</>}
          en={<>Keep this word in mind. In Act III we will meet an ordinal defined as “the first position no algorithm can reach,” and in Act V, functions that outgrow every computable function.</>}
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
            zh: <p><M t="x\mapsto3\uparrow^{x}3" /> 的刻度是 <M t="\omega" />（箭头数随变量变化），<M t="G(n)" /> 是把它重复 <M t="n" /> 次，所以刻度加一：<M t="\omega+1" />。64 只是我们代入的输入。</p>,
            en: <p><M t="x\mapsto3\uparrow^{x}3" /> sits at <M t="\omega" /> (the arrow count varies), and <M t="G(n)" /> iterates it <M t="n" /> times, adding one: <M t="\omega+1" />. The 64 is just the input we plug in.</p>,
          }}
        />
        <KeyIdea>
          <L
            zh={
              <>
                整个大数数学只有两个基本动作：<b>重复</b>（刻度 +1）和<b>对角化</b>（越过一整列刻度，到达一个新的极限）。我们已经用它们从 0 走到了 <M t="\omega+1" />。可是 <M t="\omega" /> 之后还有什么？<M t="\omega+2" />、<M t="\omega+\omega" />……这些“无穷之后的位置”到底是什么东西，能不能严格地讨论？下一章，我们正式走进序数的世界。
              </>
            }
            en={
              <>
                All of googology runs on two moves: <b>repeat</b> (mark +1) and <b>diagonalize</b> (leap past a whole sequence of marks to
                a new limit). With them we have climbed from 0 to <M t="\omega+1" />. But what lies beyond <M t="\omega" />?{' '}
                <M t="\omega+2" />, <M t="\omega+\omega" />, … What exactly are these “positions after infinity,” and can we reason about
                them rigorously? Next chapter, we enter the world of ordinals.
              </>
            }
          />
        </KeyIdea>
      </Section>
    </>
  )
}
