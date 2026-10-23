import '../ch11/ch11.css'
import './ch12.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { Antihydra, BB5Run, BeatTheBeaver, ChampionRunner, CollatzOrbit, IndependenceChart, Pipeline } from './widgets'

export default function Chapter12() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Turing machines in the <code>1RB</code> notation, the halting theorem and its blank-tape version, oracles and the jump <M t="\varnothing'" />, invariants (closed sets of configurations), Tree Normal Form (Chapter 11).</>, zh: <><code>1RB</code> 记法下的 Turing 机、停机定理及其空白纸带版本、神谕与跳跃 <M t="\varnothing'" />、不变量（封闭格局集）、树标准形（第 11 章）。</> },
          { en: <>Knuth arrows and Graham’s number (Chapter 2); the fast-growing hierarchy <M t="f_\alpha" /> (Chapter 4).</>, zh: <>Knuth 箭头与 Graham 数（第 2 章）；快速增长层次 <M t="f_\alpha" />（第 4 章）。</> },
          { en: <>Gödel’s second incompleteness theorem, precise form (Chapter 10); <M t="\Omega=\omega_1^{\mathrm{CK}}" /> (Chapter 8).</>, zh: <>Gödel 第二不完备定理的精确形式（第 10 章）；<M t="\Omega=\omega_1^{\mathrm{CK}}" />（第 8 章）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="game" kicker={{ en: 'The game', zh: '游戏' }} title={{ en: 'Radó’s busy beavers', zh: 'Radó 的忙碌海狸' }}>
        <P
          zh={<>1962 年，俄亥俄州立大学的 Tibor Radó 在论文《论不可计算函数》中提出一个游戏：用 n 个状态造一台 Turing 机，从空白纸带出发，<b>必须停机</b>——但要在停机前尽可能“忙碌”。</>}
          en={<>In 1962 Tibor Radó of Ohio State proposed a game in his paper “On non-computable functions”: build an n-state Turing machine that, started on a blank tape, <b>must halt</b> — but only after being as busy as possible.</>}
        />
        <P
          zh={<>这正是第 11 章开头那位挑战者的数，只是把“程序”换成了 Turing 机：对所有会停的机器取最大值。</>}
          en={<>This is exactly the opening challenger’s number from Chapter 11, with “program” made precise as “Turing machine”: a maximum over all machines that halt.</>}
        />
        <Thm kind="definition" name={{ en: 'Busy Beaver functions', zh: '忙碌海狸函数' }}>
          <B
            zh={
              <>
                <p>考虑所有 n 状态、两符号、从全 0 纸带和状态 A 出发并最终停机的 Turing 机（第 11 章的约定：停机那一步也计入步数）。</p>
                <ul>
                  <li><M t="\mathrm{BB}(n)=S(n)" />：这些机器中<b>最多的步数</b>；</li>
                  <li><M t="\Sigma(n)" />：这些机器停机时纸带上<b>最多的 1 的个数</b>。</li>
                </ul>
              </>
            }
            en={
              <>
                <p>Consider all n-state, 2-symbol Turing machines that, started in state A on an all-0 tape, eventually halt (Chapter 11’s conventions: the halting step counts).</p>
                <ul>
                  <li><M t="\mathrm{BB}(n)=S(n)" />: the <b>largest number of steps</b> among them;</li>
                  <li><M t="\Sigma(n)" />: the <b>largest number of ones</b> they leave on the tape.</li>
                </ul>
              </>
            }
          />
        </Thm>
        <Caution>
          <L
            zh={<>记号冲突：本课程沿用现代用法（bbchallenge、维基百科），<b>BB = S = 步数</b>，<M t="\Sigma" /> = 1 的个数。书中两者都叫 BB：定义 26.1 写“记为 Σ(n) 或 BB(n)”，并把它描述为“扫过的最大格子数”，可书中给出的数值 4、6、13、4098 其实是 1 的个数；定义 26.2 又说 S(n)“有时也称为 BB(n)”。</>}
            en={<>Notation clash. This course follows modern usage (bbchallenge, Wikipedia): <b>BB = S = steps</b>, <M t="\Sigma" /> = ones. The book calls both “BB”: its Def. 26.1 writes “Σ(n) or BB(n)” and describes it as the maximum number of cells swept, though its values 4, 6, 13, 4098 are numbers of ones; Def. 26.2 says S(n) is “sometimes also called BB(n)”.</>}
          />
        </Caution>
        <Thm name={{ en: 'well-defined', zh: '良定义' }}>
          <B
            zh={<p><M t="S(n)" /> 和 <M t="\Sigma(n)" /> 对每个 <M t="n\ge1" /> 都是确定的自然数，且 <M t="\Sigma(n)\le S(n)" />。</p>}
            en={<p><M t="S(n)" /> and <M t="\Sigma(n)" /> are well-defined natural numbers for every <M t="n\ge1" />, and <M t="\Sigma(n)\le S(n)" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>n 状态机器只有 <M t="(4n+4)^{2n}" /> 台，其中至少一台会停（A0 = <code>1RZ</code>）。对非空有限集合取最大值即可。每步至多新增一个 1，所以 1 的个数不超过步数。</>}
            en={<>There are only <M t="(4n+4)^{2n}" /> n-state machines, and at least one halts (A0 = <code>1RZ</code>). Take the maximum over a nonempty finite set. Each step adds at most one 1, so the ones never exceed the steps.</>}
          />
        </Proof>
        <P
          zh={<>良定义，但不可计算——这一章的全部张力就在这里。先亲手玩一玩。</>}
          en={<>Well-defined, yet uncomputable: that tension drives the whole chapter. First, play.</>}
        />
        <Widget
          title={{ en: 'Beat the beaver', zh: '挑战海狸' }}
          hint={{ en: 'Edit the table and try to run longer than the record. Then let 20,000 random machines try.', zh: '修改转移表，试着跑得比纪录更久。然后让 20,000 台随机机器来试。' }}
        >
          <BeatTheBeaver />
        </Widget>
        <P
          zh={<>注意小工具是怎么宣布“永不停机”的：它只是跑了 <M t="S(n)+1" /> 步。知道 <M t="S(n)" /> 就等于掌握了全部 n 状态机器的停机问题。这一点是下文不可计算性证明的核心。</>}
          en={<>Notice how the widget declares “never halts”: it just runs <M t="S(n)+1" /> steps. Knowing <M t="S(n)" /> solves the halting problem for every n-state machine. That observation drives the uncomputability proof later in this chapter.</>}
        />
        <P
          zh={<>随机搜索也很说明问题：三、四状态时，随机机器几乎从不接近纪录。冠军是极其稀有的。</>}
          en={<>The random search is telling too: at 3 and 4 states, random machines almost never come near the record. Champions are vanishingly rare.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="champions" kicker={{ en: 'Hall of fame', zh: '名人堂' }} title={{ en: 'The known values', zh: '已知的值' }}>
        <div className="scroll-x">
          <table className="grid c12-values">
            <thead>
              <tr>
                <th>n</th>
                <th>
                  <M t="S(n)=\mathrm{BB}(n)" />
                </th>
                <th>
                  <M t="\Sigma(n)" />
                </th>
                <th>
                  <L en="champion (S)" zh="冠军（S）" />
                </th>
                <th>
                  <L en="proved" zh="证明" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>1</td><td>1</td><td className="mono">1RZ---</td><td>—</td></tr>
              <tr><td>2</td><td>6</td><td>4</td><td className="mono">1RB1LB_1LA1RZ</td><td>Radó 1962</td></tr>
              <tr><td>3</td><td>21</td><td>6</td><td className="mono">1RB1RZ_1LB0RC_1LC1LA</td><td>Lin–Radó 1965</td></tr>
              <tr><td>4</td><td>107</td><td>13</td><td className="mono">1RB1LB_1LA0LC_1RZ1LD_1RD0RA</td><td>Brady 1983</td></tr>
              <tr><td>5</td><td>47,176,870</td><td>4098</td><td className="mono">1RB1LC_1RC1RB_1RD0LE_1LA1LD_1RZ0LA</td><td>bbchallenge 2024</td></tr>
              <tr><td>6</td><td><M t=">2\uparrow\uparrow\uparrow 5" /></td><td><M t=">2\uparrow\uparrow\uparrow 5" /></td><td className="mono small">1RB1RA_1RC1RZ_1LD0RF_1RA0LE_0LD1RC_1RA0RE</td><td><L en="open" zh="未解决" /></td></tr>
            </tbody>
          </table>
        </div>
        <P
          zh={<>表中每个数值都由下一幕的模拟器现场跑出来。先猜一猜：</>}
          en={<>Every value in the table is reproduced live by the simulator in the next scenes. First, a guess:</>}
        />
        <Quiz
          q={{
            zh: <p>跑得最久的三状态机器（21 步）留下的 1 也最多吗？</p>,
            en: <p>Does the longest-running 3-state machine (21 steps) also leave the most ones?</p>,
          }}
          options={[
            { zh: <p>是，跑得久自然写得多</p>, en: <p>Yes — more time, more ones</p> },
            { zh: <p>不是</p>, en: <p>No</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>它只留下 5 个 1。<M t="\Sigma(3)=6" /> 的冠军 <code className="c12-code">1RB1RZ_0RC1RB_1LC1LA</code> 只走 14 步。长时间运行常常意味着反复擦写同一片区域。</p>,
            en: <p>It leaves only 5. The <M t="\Sigma(3)=6" /> champion <code className="c12-code">1RB1RZ_0RC1RB_1LC1LA</code> runs just 14 steps. Long runs often mean rewriting the same region over and over.</p>,
          }}
        />
        <Widget
          title={{ en: 'The champions, live', zh: '冠军现场' }}
          hint={{ en: 'Compare the S(3) and Σ(3) champions, then watch BB(4) build its 13 ones in 107 steps.', zh: '对比 S(3) 与 Σ(3) 的冠军，再看 BB(4) 如何用 107 步写下 13 个 1。' }}
        >
          <ChampionRunner />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="bb5" kicker={{ en: 'Five states', zh: '五个状态' }} title={{ en: '47,176,870 steps', zh: '47,176,870 步' }}>
        <P
          zh={<>1989 年，Heiner Marxen 和 Jürgen Buntrock 用计算机搜索找到了一台五状态机器：它走 47,176,870 步后停机，留下 4098 个 1。此后三十多年，再没人找到更好的。</>}
          en={<>In 1989 Heiner Marxen and Jürgen Buntrock found, by computer search, a 5-state machine that halts after 47,176,870 steps leaving 4098 ones. For more than thirty years nobody found a better one.</>}
        />
        <P
          zh={<>四千七百万步对 1989 年的电脑是大工程；对你的浏览器只是零点几秒。</>}
          en={<>Forty-seven million steps was serious work for a 1989 computer. For your browser it is a fraction of a second.</>}
        />
        <Widget
          title={{ en: 'Run the BB(5) champion', zh: '运行 BB(5) 冠军' }}
          hint={{ en: 'A raw step-by-step simulation. The run pauses at each landmark g(x) and checks the tape.', zh: '逐步的原始模拟。每到一个路标 g(x)，就暂停检查纸带。' }}
        >
          <BB5Run />
        </Widget>
        <H3 en="A Collatz machine in disguise" zh="一台伪装的 Collatz 机器" />
        <P
          zh={<>那些路标是什么？记 <M t="g(x)" /> 为这样的格局：纸带上只有连续 <M t="x" /> 个 1，读头处于状态 A，位于这串 1 左边紧挨着的空格上。起点就是 <M t="g(0)" />。</>}
          en={<>What are the landmarks? Let <M t="g(x)" /> be the configuration whose tape is blank except for <M t="x" /> consecutive ones, with the head in state A on the blank cell just left of them. The start is <M t="g(0)" />.</>}
        />
        <Thm kind="fact" name={{ en: 'the macro rules of the BB(5) champion (book eq. 26.24–26.26)', zh: 'BB(5) 冠军的宏规则（书中式 26.24–26.26）' }} status="proved">
          <MB t="\begin{aligned} g(3n)&\xrightarrow{\;5n^2+19n+15\;}g(5n+6),\\ g(3n+1)&\xrightarrow{\;5n^2+25n+27\;}g(5n+9),\\ g(3n+2)&\xrightarrow{\;6n+12\;}\text{HALT}.\end{aligned}" />
          <B
            zh={<p>箭头上方是所需步数；第三种情形停机时留下 <M t="n+4" /> 个 1。（我们用原始模拟对 <M t="x<200" /> 逐一核对过三条规则；一般情形可对 n 归纳证明。）</p>}
            en={<p>The labels are step counts; the halting case leaves <M t="n+4" /> ones. (We checked all three rules against raw simulation for every <M t="x<200" />; the general case is a routine induction on n.)</p>}
          />
        </Thm>
        <P
          zh={<>这是一个 Collatz 式映射：按 <M t="x \bmod 3" /> 分三类，两类乘以约 5/3，一类停机。从 0 出发的轨道是</>}
          en={<>This is a Collatz-type map: split by <M t="x \bmod 3" />; two classes multiply by about 5/3, one halts. From 0 the orbit is</>}
        />
        <MB t="\begin{gathered}0\to6\to16\to34\to64\to114\\ \to196\to334\to564\to946\\ \to1584\to2646\to4416\\ \to7366\to12284\to\text{HALT}.\end{gathered}" />
        <P
          zh={<><M t="12284=3\cdot4094+2" />，所以第 15 段用 <M t="6\cdot4094+12=24576" /> 步停机，留下 <M t="4094+4=4098" /> 个 1。各段步数相加恰为 47,176,870。</>}
          en={<><M t="12284=3\cdot4094+2" />, so the last leg halts after <M t="6\cdot4094+12=24576" /> steps with <M t="4094+4=4098" /> ones. The leg lengths add up to exactly 47,176,870.</>}
        />
        <Widget
          title={{ en: 'The orbit, leg by leg', zh: '轨道，一段一段地走' }}
          hint={{ en: 'Start the map from other values of x. Most orbits die quickly; the real one, from 0, survives 14 legs.', zh: '从别的 x 出发试试。大多数轨道很快就停；从 0 出发的真实轨道活过了 14 段。' }}
        >
          <CollatzOrbit />
        </Widget>
        <P
          zh={<>如果把 <M t="x \bmod 3" /> 看作随机的，每一段都有约 1/3 的机会停机。活过 14 段的概率约为 <M t="(2/3)^{14}\approx0.3\%" />：BB(5) 冠军是一次幸运的长寿。</>}
          en={<>If <M t="x \bmod 3" /> behaved randomly, each leg would halt with probability about 1/3. Surviving 14 legs has probability about <M t="(2/3)^{14}\approx0.3\%" />: the BB(5) champion is a lucky survivor.</>}
        />
        <P
          zh={<>这不是巧合。要让一台小机器跑得极久却仍然停机，最便宜的办法就是实现一个“看起来随机”的算术迭代。这也意味着：确定 BB 的值，迟早要撞上 Collatz 一类的难题。</>}
          en={<>This is no accident. The cheapest way for a small machine to run very long and still halt is to implement an arithmetic iteration that looks random. Which means that pinning down BB values runs, sooner or later, into Collatz-type problems.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="uncomputable" kicker={{ en: 'The big move', zh: '关键一步' }} title={{ en: 'Faster than every computable function', zh: '比一切可计算函数都快' }}>
        <Thm name={{ en: 'Radó 1962', zh: 'Radó 1962' }}>
          <B
            zh={<p><M t="S" /> 不可计算。</p>}
            en={<p><M t="S" /> is not computable.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>若 <M t="S" /> 可计算，就能判定空白纸带停机问题：给定 n 状态机器 M，先算 <M t="S(n)" />，再运行 M 共 <M t="S(n)" /> 步；这时还没停，就永远不会停。但第 11 章证明了空白纸带停机问题不可判定。</>}
            en={<>If <M t="S" /> were computable, we could decide the blank-tape halting problem: given an n-state machine M, compute <M t="S(n)" /> and run M for <M t="S(n)" /> steps; if it has not halted by then, it never will. But Chapter 11 showed the blank-tape halting problem is undecidable.</>}
          />
        </Proof>
        <P
          zh={<>这还只是“不可计算”。对大数来说，更重要的是它<b>长得有多快</b>。</>}
          en={<>That is mere uncomputability. For googology the real point is <b>how fast it grows</b>.</>}
        />
        <Thm name={{ en: 'domination (Radó 1962)', zh: '支配定理（Radó 1962）' }}>
          <B
            zh={<p>对每个可计算函数 <M t="f:\mathbb N\to\mathbb N" />，存在 <M t="N" />，使得对所有 <M t="n\ge N" /> 有 <M t="S(n)\ge\Sigma(n)>f(n)" />。</p>}
            en={<p>For every computable <M t="f:\mathbb N\to\mathbb N" /> there is <M t="N" /> with <M t="S(n)\ge\Sigma(n)>f(n)" /> for all <M t="n\ge N" />.</p>}
          />
        </Thm>
        <P
          zh={<>证明思路：把 <M t="f" /> 加固成一个严格递增、至少平方增长的可计算函数 <M t="F" />。造一台机器：先用 n 个状态写下 n 个 1，再把 <M t="F" /> 的机器（C 个状态）运行<b>两遍</b>。它有 <M t="n+2C" /> 个状态，留下 <M t="F(F(n))" /> 个 1。</>}
          en={<>Idea: strengthen <M t="f" /> to a computable <M t="F" /> that is strictly increasing and at least quadratic. Build a machine that writes n ones with n states, then runs a C-state machine for <M t="F" /> <b>twice</b>. It has <M t="n+2C" /> states and leaves <M t="F(F(n))" /> ones.</>}
        />
        <P
          zh={<>由于 <M t="F(n)\ge n^2>n+2C" />，有 <M t="\Sigma(n+2C)\ge F(F(n))>F(n+2C)\ge f(n+2C)" />。第二遍运行吸收了常数 2C 的代价。</>}
          en={<>Since <M t="F(n)\ge n^2>n+2C" />, we get <M t="\Sigma(n+2C)\ge F(F(n))>F(n+2C)\ge f(n+2C)" />. The second run pays for the constant overhead 2C.</>}
        />
        <Expand kind="proof" title={{ en: 'Radó’s domination theorem, in full', zh: 'Radó 支配定理的完整证明' }}>
          <P
            zh={<><b>第 1 步（加固）。</b>令 <M t="F(x)=\sum_{i\le x}\bigl(f(i)+i^2\bigr)+x" />。<M t="F" /> 可计算；<M t="F(x)\ge f(x)" />；<M t="F(x)\ge x^2" />；且 <M t="F(x+1)-F(x)=f(x+1)+(x+1)^2+1>0" />，即严格递增。</>}
            en={<><b>Step 1 (strengthen).</b> Let <M t="F(x)=\sum_{i\le x}\bigl(f(i)+i^2\bigr)+x" />. Then <M t="F" /> is computable, <M t="F(x)\ge f(x)" />, <M t="F(x)\ge x^2" />, and <M t="F(x+1)-F(x)=f(x+1)+(x+1)^2+1>0" />, so <M t="F" /> is strictly increasing.</>}
          />
          <P
            zh={<><b>第 2 步（输入输出约定）。</b>称机器 <M t="M_F" /> “一元地计算 F”，如果从这样的格局出发：纸带上只有一串 x 个 1、读头在这串 1 右边紧挨着的空格上、处于 <M t="M_F" /> 的起始状态，它总会停机，并停在同样形式的格局上，只是 1 的个数变成 <M t="F(x)" />。由于 <M t="F" /> 可计算，这样的 <M t="M_F" /> 存在（在不同输入输出约定之间转换只是常规编程），设它有 C 个状态。</>}
            en={<><b>Step 2 (I/O convention).</b> Say <M t="M_F" /> computes F in unary if, started in its start state on a tape that is blank except for a block of x ones, with the head on the blank cell just right of the block, it always halts in a configuration of the same shape with <M t="F(x)" /> ones. Since F is computable such an <M t="M_F" /> exists (converting between I/O conventions is routine programming); say it has C states.</>}
          />
          <P
            zh={<><b>第 3 步（拼装）。</b>对 <M t="n\ge1" />，造机器 <M t="W_n" />：状态 <M t="1,\dots,n" /> 中第 i 个读到 0 时执行“写 1、右移、进入第 i+1 个”，第 n 个则进入 <M t="M_F" /> 第一份拷贝的起始状态。把第一份拷贝里的每条停机转移改为（写的符号、移动方向不变）进入第二份拷贝的起始状态。</>}
            en={<><b>Step 3 (assemble).</b> For <M t="n\ge1" /> build <M t="W_n" />: states <M t="1,\dots,n" />, where state i on reading 0 writes 1, moves right and goes to state i+1, and state n goes to the start of a first copy of <M t="M_F" />. Redirect every halting transition of the first copy (same symbol written, same move) into the start state of a second copy.</>}
          />
          <P
            zh={<>从空白纸带出发，<M t="W_n" /> 写下 n 个 1 并停在第 2 步的输入格局上；第一份拷贝把它变成 <M t="F(n)" /> 个 1 的同形格局；第二份拷贝再变成 <M t="F(F(n))" /> 个 1，然后停机。<M t="W_n" /> 有 <M t="n+2C" /> 个状态，所以 <M t="\Sigma(n+2C)\ge F(F(n))" />。</>}
            en={<>From a blank tape, <M t="W_n" /> writes n ones and lands in the input configuration of Step 2; the first copy turns it into a block of <M t="F(n)" /> ones of the same shape; the second copy into <M t="F(F(n))" /> ones, and halts. <M t="W_n" /> has <M t="n+2C" /> states, so <M t="\Sigma(n+2C)\ge F(F(n))" />.</>}
          />
          <P
            zh={<><b>第 4 步（比较）。</b>若 <M t="n\ge2C+1" />，则 <M t="n^2-n=n(n-1)\ge(2C+1)\,2C>2C" />，故 <M t="F(n)\ge n^2>n+2C" />。<M t="F" /> 严格递增，于是</>}
            en={<><b>Step 4 (compare).</b> If <M t="n\ge2C+1" /> then <M t="n^2-n=n(n-1)\ge(2C+1)\,2C>2C" />, so <M t="F(n)\ge n^2>n+2C" />. As F is strictly increasing,</>}
          />
          <MB t="\begin{aligned}\Sigma(n+2C)\ &\ge\ F(F(n))\\ &>\ F(n+2C)\\ &\ge\ f(n+2C).\end{aligned}" />
          <P
            zh={<>令 <M t="m=n+2C" />：对所有 <M t="m\ge4C+1" /> 有 <M t="\Sigma(m)>f(m)" />。最后 <M t="S(m)\ge\Sigma(m)" />。</>}
            en={<>Writing <M t="m=n+2C" />: <M t="\Sigma(m)>f(m)" /> for all <M t="m\ge4C+1" />. Finally <M t="S(m)\ge\Sigma(m)" />.</>}
          />
        </Expand>
        <P
          zh={<>第二个证明顺手得到：若 <M t="S" /> 可计算，取 <M t="f=S" />，就有 <M t="S(n)>S(n)" />。</>}
          en={<>A second proof of uncomputability falls out: if <M t="S" /> were computable, take <M t="f=S" /> and get <M t="S(n)>S(n)" />.</>}
        />
        <KeyIdea>
          <L
            zh={<>第 4 至 9 章的每一个函数——<M t="f_{\varepsilon_0}" />、<M t="f_{\Gamma_0}" />、TREE、Buchholz 九头蛇、BMS——都是可计算的：都有一个程序在算它。所以忙碌海狸最终会超过它们全部。在增长之尺上，它越过了所有递归序数。</>}
            en={<>Every function from Chapters 4–9 — <M t="f_{\varepsilon_0}" />, <M t="f_{\Gamma_0}" />, TREE, the Buchholz hydra, BMS — is computable: some program computes it. So the busy beaver eventually overtakes all of them. On the ruler of growth it has passed every recursive ordinal.</>}
          />
        </KeyIdea>
        <Expand kind="detail" title={{ en: 'The inverse of S: uncomputable, and slower than anything', zh: 'S 的反函数：不可计算，且慢于一切' }}>
          <P
            zh={<>令 <M t="S^{-1}(m)=\min\{n: S(n)\ge m\}" />。它不可计算：否则 <M t="S(n)=\min\{m: S^{-1}(m)>n\}-1" /> 也可计算。</>}
            en={<>Let <M t="S^{-1}(m)=\min\{n: S(n)\ge m\}" />. It is uncomputable, since otherwise <M t="S(n)=\min\{m: S^{-1}(m)>n\}-1" /> would be computable.</>}
          />
          <P
            zh={<><b>断言：</b>对任何可计算、单调不减且无界的 <M t="h" />，最终有 <M t="S^{-1}(m)\le h(m)" />。令 <M t="u(k)=\min\{m: h(m)\ge k+1\}" />，它可计算，所以存在 <M t="K" /> 使 <M t="k\ge K" /> 时 <M t="S(k)>u(k)" />。</>}
            en={<><b>Claim:</b> for every computable, nondecreasing, unbounded <M t="h" />, eventually <M t="S^{-1}(m)\le h(m)" />. Let <M t="u(k)=\min\{m: h(m)\ge k+1\}" />; it is computable, so by domination there is <M t="K" /> with <M t="S(k)>u(k)" /> for <M t="k\ge K" />.</>}
          />
          <P
            zh={<>取 m 足够大使 <M t="k:=S^{-1}(m)-1\ge K" />。由 <M t="S^{-1}" /> 的定义，<M t="S(k)<m" />，于是 <M t="m>u(k)" />，从而 <M t="h(m)\ge h(u(k))\ge k+1=S^{-1}(m)" />。单调性不能省：令 <M t="h(m)" /> 为“恰在第 <M t="m-1" /> 步停机的机器的最少状态数”（没有则取 m），它可计算且趋于无穷，却在 <M t="m=S(n)+1" /> 处只有 <M t="h(m)\le n<S^{-1}(m)" />。</>}
            en={<>Take m large enough that <M t="k:=S^{-1}(m)-1\ge K" />. By definition of <M t="S^{-1}" />, <M t="S(k)<m" />, so <M t="m>u(k)" /> and <M t="h(m)\ge h(u(k))\ge k+1=S^{-1}(m)" />. Monotonicity matters: let <M t="h(m)" /> be the fewest states of a machine halting at exactly step <M t="m-1" /> (or m if none). It is computable and tends to infinity, yet at <M t="m=S(n)+1" /> it gives <M t="h(m)\le n<S^{-1}(m)" />.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="proof" kicker={{ en: 'A modern epic', zh: '一部现代史诗' }} title={{ en: 'How BB(5) was proved', zh: 'BB(5) 是怎样被证明的' }}>
        <P
          zh={<>要证明 <M t="S(5)=47{,}176{,}870" />，只找到冠军不够。还必须证明：其余每一台五状态机器，要么停得更早，要么<b>永远不停</b>。后者是停机问题——只能一台一台地啃。</>}
          en={<>To prove <M t="S(5)=47{,}176{,}870" /> it is not enough to exhibit the champion. One must show that every other 5-state machine either halts sooner or <b>never halts</b> — the halting problem, attacked machine by machine.</>}
        />
        <P
          zh={<>2020 年，Scott Aaronson 在综述《The Busy Beaver Frontier》中猜测 <M t="S(5)" /> 就是 47,176,870。读到这篇综述的 Tristan Stérin 于 2022 年发起了在线协作项目 bbchallenge。</>}
          en={<>In his 2020 survey “The Busy Beaver Frontier”, Scott Aaronson conjectured that <M t="S(5)" /> is 47,176,870. Reading it inspired Tristan Stérin to launch the online collaboration bbchallenge in 2022.</>}
        />
        <P
          zh={<>2024 年 7 月 2 日，项目宣布完成：证明由化名 mxdys 的贡献者写成 Coq 形式化证明（Coq-BB5），每一步都由计算机核验。论文《Determination of the fifth Busy Beaver value》于 2025 年 9 月发布在 arXiv（2509.12337），作者列表二十余人，许多人以网名署名。</>}
          en={<>On 2 July 2024 the project announced success: a proof formalised in the Coq proof assistant (Coq-BB5, by the contributor mxdys), every step machine-checked. The paper “Determination of the fifth Busy Beaver value” appeared on arXiv in September 2025 (2509.12337), with some twenty authors, many under their online handles.</>}
        />
        <Widget
          title={{ en: 'The decider pipeline: 181,385,789 machines', zh: '判定流水线：181,385,789 台机器' }}
          hint={{ en: 'Click a stage. Each one proves non-halting (or halting) for the machines the earlier stages left over.', zh: '点击一个阶段。每一阶段处理前面阶段剩下的机器，证明它们不停机（或停机）。' }}
        >
          <Pipeline />
        </Widget>
        <P
          zh={<>流水线里绝大多数非停机证明，本质都是第 11 章的不变量法：找一个包含初始格局、在走步下封闭、又不含停机格局的格局集合 C。区别只在于 C 用什么来描述、由谁去找。</>}
          en={<>Almost every non-halting proof in the pipeline is Chapter 11’s invariant method: find a set C of configurations that contains the start, is closed under steps, and contains no halting configuration. The deciders differ only in how C is described and how it is found.</>}
        />
        <H3 en="The last holdouts" zh="最后的钉子户" />
        <P
          zh={<>最难的机器以 Georgi Georgiev（网名 Skelet）的编号命名。Skelet #1 是平移循环机，但要约 <M t="5.42\times10^{51}" /> 步后才进入周期，周期长 8,468,569,863——再快的模拟也等不到。</>}
          en={<>The hardest machines carry numbers from the list of Georgi Georgiev (“Skelet”). Skelet #1 is a translated cycler — but it enters its cycle only after about <M t="5.42\times10^{51}" /> steps, with period 8,468,569,863. No simulation will ever get there.</>}
        />
        <P
          zh={<>Skelet #17 与 Skelet #1 被公认为最难的两台。Chris Xu 证明 #17 在模拟一种 Gray 码计数器、永不停机（2023 年完成草稿，2024 年 7 月发布于 arXiv 2407.02426），mxdys 随后把它形式化——这是 BB(5) 证明的最后一块拼图。</>}
          en={<>Skelet #17 and Skelet #1 were considered the two hardest. Chris Xu proved that #17 simulates a kind of Gray-code counter and never halts (sketched in 2023, posted July 2024 as arXiv 2407.02426), and mxdys formalised it — the last piece of the BB(5) proof.</>}
        />
        <P
          zh={<>同样的方法也重新证明了 <M t="S(4)=107" />，并解决了其他一些小规模情形；但五状态需要的非正则、手工的论证，在四状态时从未需要过：4 与 5 之间有一道真实的鸿沟。</>}
          en={<>The same machinery re-proved <M t="S(4)=107" /> and settled other small classes; but 5 states needed irregular, hand-made arguments that 4 states never did. There is a real gap between 4 and 5.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="bb6" kicker={{ en: 'Here be dragons', zh: '此处有龙' }} title={{ en: 'BB(6) and the cryptids', zh: 'BB(6) 与“隐兽”' }}>
        <P
          zh={<>六个状态就失控了。2022 年 Pavel Kropitz 找到一台机器，证明 <M t="S(6)>10\uparrow\uparrow15" />。2025 年 6 月，mxdys 连续刷新纪录，最终达到五级运算的量级：</>}
          en={<>At six states things explode. In 2022 Pavel Kropitz found a machine proving <M t="S(6)>10\uparrow\uparrow15" />. In June 2025 mxdys broke the record twice in a few days, reaching pentation:</>}
        />
        <MB t="\begin{gathered}S(6)\ >\ \Sigma(6)\ >\ 2\uparrow\uparrow\uparrow 5,\\ 2\uparrow\uparrow\uparrow 5=2\uparrow\uparrow 2\uparrow\uparrow 2\uparrow\uparrow 2\uparrow\uparrow 2.\end{gathered}" />
        <P
          zh={<>冠军是 <code className="c12-code">1RB1RA_1RC1RZ_1LD0RF_1RA0LE_0LD1RC_1RA0RE</code>，也就是书中的“最强六状态机器”。截至 2026 年 10 月，bbchallenge 维基把同一台机器的下界写成 <M t="10\uparrow\uparrow10\uparrow\uparrow10\uparrow\uparrow 8" />。</>}
          en={<>The champion is <code className="c12-code">1RB1RA_1RC1RZ_1LD0RF_1RA0LE_0LD1RC_1RA0RE</code>, the book’s “strongest 6-state machine”. As of October 2026 the bbchallenge wiki states its bound as <M t="10\uparrow\uparrow10\uparrow\uparrow10\uparrow\uparrow 8" />.</>}
        />
        <P
          zh={<>但下界不是难点。要确定 <M t="S(6)" />，必须判定每一台六状态机器——其中有些机器在做 Collatz 式的随机游走，没人能证明它们停或不停。社区管它们叫<Term en="cryptid" zh="隐兽" />。</>}
          en={<>But lower bounds are not the obstacle. Determining <M t="S(6)" /> requires deciding every 6-state machine — and some of them perform Collatz-like random walks that nobody can settle either way. The community calls them <Term en="cryptid" zh="隐兽" />s.</>}
        />
        <H3 en="Antihydra" zh="Antihydra（反九头蛇）" />
        <P
          zh={<>2024 年 6 月 28 日，mxdys 报告了六状态机器 <code className="c12-code">1RB1RA_0LC1LE_1LD1LC_1LA0LB_1LF1RE_---0RA</code>，Racheline 很快找出了它的宏规则。记 <M t="A(a,b)" /> 为纸带 <M t="0^\infty 1^a\,0\,1^b" />、读头在状态 E 位于右端之后：</>}
          en={<>On 28 June 2024 mxdys reported the 6-state machine <code className="c12-code">1RB1RA_0LC1LE_1LD1LC_1LA0LB_1LF1RE_---0RA</code>, and Racheline soon found its macro rules. Let <M t="A(a,b)" /> be the tape <M t="0^\infty 1^a\,0\,1^b" /> with the head in state E just past the right end:</>}
        />
        <MB t="\begin{aligned} A(a,\,2b)&\to A(a+2,\,3b+2),\\ A(a+1,\,2b+1)&\to A(a,\,3b+3),\\ A(0,\,2b+1)&\to\text{HALT}.\end{aligned}" />
        <P
          zh={<>从空白纸带出发，11 步后到达 <M t="A(0,4)" />。换句话说：反复做 <M t="b\mapsto\lfloor 3b/2\rfloor+2" />；b 为偶数时计数器 a 加 2，为奇数时减 1；若 a 已为 0 时遇到奇数，就停机。</>}
          en={<>From a blank tape it reaches <M t="A(0,4)" /> after 11 steps. In other words: iterate <M t="b\mapsto\lfloor 3b/2\rfloor+2" />; the counter a gains 2 on each even b and loses 1 on each odd b; the machine halts if an odd b arrives when a is already 0.</>}
        />
        <Widget
          title={{ en: 'Iterate the Antihydra', zh: '迭代 Antihydra' }}
          hint={{ en: 'The counter a performs a random-looking walk with upward drift. Will it ever hit 0 on an odd b?', zh: '计数器 a 像随机游走一样带着向上的漂移。它会在某个奇数 b 处跌到 0 吗？' }}
        >
          <Antihydra />
        </Widget>
        <P
          zh={<>若 b 的奇偶像抛硬币，a 就是每步 +2 或 −1 的随机游走。从高度 a 出发、最终跌破 0（即停机）的概率是 <M t="r^{a+1}" />，其中 r 是 <M t="r=\tfrac12 r^3+\tfrac12" /> 在 (0,1) 内的根，即 <M t="r=(\sqrt5-1)/2\approx0.618" />。</>}
          en={<>If the parity of b behaved like coin flips, a would be a random walk with steps +2 and −1. Starting from height a, the probability of ever dropping below 0 (i.e. halting) is <M t="r^{a+1}" />, where r is the root in (0,1) of <M t="r=\tfrac12 r^3+\tfrac12" />, namely <M t="r=(\sqrt5-1)/2\approx0.618" />.</>}
        />
        <P
          zh={<>bbchallenge 已把它模拟了 <M t="2^{38}" /> 个规则步，此时 a 已超过 <M t="2^{37}" />。启发式地说，它几乎必然永不停机；但要<b>证明</b>这一点，需要关于 <M t="(3/2)^k" /> 奇偶性的定理，这超出了现有数论的能力。</>}
          en={<>bbchallenge has simulated <M t="2^{38}" /> rule steps, by which point a exceeds <M t="2^{37}" />. Heuristically it almost surely never halts; but <b>proving</b> it requires a theorem about the parities of iterates of <M t="3b/2" />, beyond current number theory.</>}
        />
        <OpenProblem title={{ en: 'Does Antihydra halt?', zh: 'Antihydra 会停机吗？' }}>
          <P
            zh={<>这是一个纯粹的 Collatz 式问题。只要它没有被解决，<M t="S(6)" /> 就无法确定。截至 2026 年 10 月，六状态还剩约 663 台（按等价类计）未判定的机器。</>}
            en={<>A pure Collatz-type question. As long as it is open, <M t="S(6)" /> cannot be determined. As of October 2026 about 663 six-state machines (up to equivalence) remained undecided.</>}
          />
        </OpenProblem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="independence" kicker={{ en: 'Beyond proof', zh: '超越证明' }} title={{ en: 'Busy beavers that ZFC cannot tame', zh: 'ZFC 驯服不了的海狸' }}>
        <P
          zh={<>很多猜想都是“某台机器永不停机”。书中给出的例子：一台 25 状态机器当且仅当 Goldbach 猜想不成立时停机；15 状态对应 Erdős 关于 2 的幂的三进制猜想；744 状态对应黎曼猜想。这些数字也出现在 bbchallenge 2025 年的 BB(5) 论文中，其中 Goldbach 机器已用 Lean 形式化验证。</>}
          en={<>Many conjectures say “some machine never halts.” The book’s examples: a 25-state machine halts iff Goldbach’s conjecture fails; 15 states for Erdős’s conjecture on powers of 2 in base 3; 744 states for the Riemann hypothesis. The same figures appear in bbchallenge’s 2025 BB(5) paper, where the Goldbach machine is verified in Lean.</>}
        />
        <P
          zh={<>所以知道 <M t="S(25)" /> 就能解决 Goldbach 猜想：把那台机器跑 <M t="S(25)" /> 步。书中也指出这是循环论证：要算出 <M t="S(25)" />，本来就得先判定那台机器。</>}
          en={<>So knowing <M t="S(25)" /> would settle Goldbach: run that machine for <M t="S(25)" /> steps. As the book notes, this is circular in practice — computing <M t="S(25)" /> requires deciding that very machine.</>}
        />
        <Thm name={{ en: 'the proof-theoretic barrier', zh: '证明论屏障' }}>
          <B
            zh={<p>设 T 是一个相容、可计算公理化、且包含基础算术的理论（例如 PA 或 ZFC）。则存在 <M t="n_T" />，使得对每个 <M t="n\ge n_T" />，T 证明不了任何形如 <M t="S(n)\le k" /> 的命题。特别地，T 无法确定 <M t="S(n)" /> 的值。</p>}
            en={<p>Let T be a consistent, computably axiomatised theory containing basic arithmetic (e.g. PA or ZFC). Then there is <M t="n_T" /> such that for every <M t="n\ge n_T" />, T proves no statement of the form <M t="S(n)\le k" />. In particular T cannot determine <M t="S(n)" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>令 <M t="M_T" /> 是一台逐个枚举 T 的证明、找到 “0 = 1” 的证明就停机的机器，设它有 <M t="n_T" /> 个状态；对 <M t="n\ge n_T" />，添加用不到的状态补成 n 状态机器 M。T 能证明“M 不停机 ⇔ Con(T)”。若 T ⊢ <M t="S(n)\le k" />，由于 T 相容，M 在前 k 步确实没停，这是有限计算，T 能验证。于是 T ⊢ “M 永不停机”，即 T ⊢ Con(T)，与 Gödel 第二不完备定理（第 10 章）矛盾。</>}
            en={<>Let <M t="M_T" /> enumerate all T-proofs and halt on finding a proof of “0 = 1”; say it has <M t="n_T" /> states. For <M t="n\ge n_T" /> pad it with unreachable states to an n-state machine M; T proves “M never halts ⇔ Con(T)”. If T ⊢ <M t="S(n)\le k" />: since T is consistent, M has not halted within k steps, a finite computation T can verify. Hence T ⊢ “M never halts”, i.e. T ⊢ Con(T), contradicting Gödel’s second incompleteness theorem (Chapter 10).</>}
          />
        </Proof>
        <P
          zh={<>下界总是可以证明的：把冠军跑一遍就行。T 永远够不着的是<b>上界</b>。<M t="n_T" /> 越大，T 越强——它是衡量理论强度的一把尺子。</>}
          en={<>Lower bounds are always provable: just run a champion. What T can never reach are <b>upper bounds</b>. The larger <M t="n_T" />, the stronger T: it is a yardstick for the strength of theories.</>}
        />
        <H3 en="How small is n_ZFC?" zh="n_ZFC 有多小？" />
        <P
          zh={<>书中写道：存在一台 432 状态的机器，它的停机性在 ZFC 中不可判定，所以 <M t="S(432)" /> 的值无法在 ZFC 中证明。这个纪录来自 Andrew J. Wade（2025 年 8 月 19 日）。从那以后它又被大幅压低了：</>}
          en={<>The book says there is a 432-state machine whose halting ZFC cannot decide, so the value of <M t="S(432)" /> is unprovable in ZFC. That record is Andrew J. Wade’s (19 August 2025). It has since dropped sharply:</>}
        />
        <Widget
          title={{ en: 'The shrinking independence record', zh: '不断缩小的独立性纪录' }}
          hint={{ en: 'Log scale. Hover or tap a point. The green band is where BB is known; the gap above it is where BB is unknown but possibly provable.', zh: '对数坐标。悬停或点击数据点。绿色带是 BB 已知的范围；它与金线之间，是 BB 未知但也许可证的区域。' }}
        >
          <IndependenceChart />
        </Widget>
        <P
          zh={<>截至 2026 年 10 月 20 日，bbchallenge 维基记载：Mira（借助 ChatGPT）与 Jeff Ketchersid（借助 Claude 完成 Rocq 形式化）于 2026 年 10 月 13 日给出 254 状态，Elliot Glazer 于 10 月 19 日给出 <b>230 状态</b>，同样有 Rocq 形式化。于是已知 <M t="6\le n_{\mathrm{ZF}}\le230" />。</>}
          en={<>As of 20 October 2026 the bbchallenge wiki records 254 states by Mira (with ChatGPT) and Jeff Ketchersid (Rocq formalisation, with Claude) on 13 October 2026, and <b>230 states</b> by Elliot Glazer on 19 October, also formalised in Rocq. So <M t="6\le n_{\mathrm{ZF}}\le230" />.</>}
        />
        <P
          zh={<>这里写 ZF 而不是 ZFC：由 Shoenfield 绝对性定理，加入选择公理不影响任何关于 Turing 机停机的结论。Aaronson 猜测真正的阈值小得多：<M t="n_{\mathrm{ZF}}\le20" />。</>}
          en={<>ZF rather than ZFC: by Shoenfield absoluteness, the axiom of choice changes nothing about whether Turing machines halt. Aaronson conjectures the true threshold is far smaller, <M t="n_{\mathrm{ZF}}\le20" />.</>}
        />
        <Caution>
          <L
            zh={<>这些最新纪录非常新（发表时距今只有几天），后续可能还有变化或勘误。请以 wiki.bbchallenge.org 的“Logical independence”页面为准。</>}
            en={<>These records are very recent (days old at the time of writing) and may change or be corrected. The authoritative source is the “Logical independence” page at wiki.bbchallenge.org.</>}
          />
        </Caution>
        <Quiz
          q={{
            zh: <p>假设 ZFC 相容，那么 ZFC 无法证明 <M t="S(230)" /> 的任何上界。这是否说明 <M t="S(230)" /> 没有确定的值？</p>,
            en: <p>Assuming ZFC is consistent, ZFC proves no upper bound on <M t="S(230)" />. Does that mean <M t="S(230)" /> has no definite value?</p>,
          }}
          options={[
            { zh: <p>是，它的值取决于用哪个公理系统</p>, en: <p>Yes — its value depends on the axiom system</p> },
            { zh: <p>不是，它是一个确定的自然数，只是 ZFC 证明不了它是多少</p>, en: <p>No — it is a definite natural number; ZFC just can’t prove which</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>每台 230 状态机器要么在某一步停机，要么不停——这是关于有限计算的事实。<M t="S(230)" /> 是有限集合的最大值，是一个确定的数。不可证明性限制的是 ZFC 的能力，而不是这个数本身。</p>,
            en: <p>Each 230-state machine either halts at some step or does not — a fact about finite computations. <M t="S(230)" /> is the maximum of a finite set: a definite number. Unprovability limits ZFC, not the number.</p>,
          }}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="beyond" kicker={{ en: 'The ruler', zh: '增长之尺' }} title={{ en: 'Beyond the busy beaver', zh: '忙碌海狸之上' }}>
        <P
          zh={<>在增长之尺上，<M t="S" /> 放在哪里？它支配所有可计算函数，所以超过了任何递归序数 α 对应的 <M t="f_\alpha" />。书中按惯例写作 <M t="S(n)\sim\omega_1^{\mathrm{CK}}" />，即第 8 章的 Ω。</>}
          en={<>Where does <M t="S" /> sit on the ruler of growth? It dominates every computable function, hence every <M t="f_\alpha" /> for a recursive α. The book writes <M t="S(n)\sim\omega_1^{\mathrm{CK}}" /> by convention — Chapter 8’s Ω.</>}
        />
        <Caution>
          <L
            zh={<>这只是一个<b>约定</b>的标签，不是 FGH 意义下的精确陈述。<M t="\omega_1^{\mathrm{CK}}" /> 的基本列依赖于对程序的编号，书中指出：在某些编号下，<M t="f_{\omega_1^{\mathrm{CK}}}" /> 甚至可以被 <M t="f_{\omega+3}" /> 界住，它也并不“约等于 BB”。</>}
            en={<>This is a <b>conventional</b> label, not an exact FGH statement. Fundamental sequences for <M t="\omega_1^{\mathrm{CK}}" /> depend on how programs are numbered; the book notes that under some numberings <M t="f_{\omega_1^{\mathrm{CK}}}" /> is even bounded by <M t="f_{\omega+3}" />, and it is not “≈ BB”.</>}
          />
        </Caution>
        <H3 en="Climbing with oracles" zh="借神谕向上爬" />
        <P
          zh={<>第 11 章的神谕阶梯给出下一级：带停机神谕 <M t="\varnothing'" /> 的机器也有自己的忙碌海狸，书中记作 <M t="\Sigma_2(n)" />（请勿与第 11 章算术层次里的 <M t="\Sigma_2" /> 混淆）。</>}
          en={<>Chapter 11’s oracle staircase gives the next rung: machines with the halting oracle <M t="\varnothing'" /> have their own busy beaver, written <M t="\Sigma_2(n)" /> in the book (not to be confused with the arithmetic class <M t="\Sigma_2" /> of Chapter 11).</>}
        />
        <P
          zh={<>同一个 Radó 论证表明，它支配所有可用 <M t="\varnothing'" /> 计算的函数——包括 <M t="S" /> 本身，因为 <M t="S" /> 可以借 <M t="\varnothing'" /> 计算：先问哪些 n 状态机器会停，再把它们跑完取最大值。</>}
          en={<>Radó’s argument, relativised, shows it dominates every function computable from <M t="\varnothing'" /> — including <M t="S" /> itself, which is computable from <M t="\varnothing'" />: ask which n-state machines halt, run those, take the maximum.</>}
        />
        <P
          zh={<>继续下去得到 <M t="\Sigma_3,\Sigma_4,\dots" />，书中按惯例标为 <M t="\omega_2^{\mathrm{CK}},\omega_3^{\mathrm{CK}},\dots" />。Goucher 的 <M t="\Xi" /> 函数把神谕做成一个组合子，<M t="\Xi(1..7)=1,2,3,4,6,17,51" />。无限时间 Turing 机（Hamkins–Lewis 2000）则允许机器跑超限多步。</>}
          en={<>Continuing gives <M t="\Sigma_3,\Sigma_4,\dots" />, labelled by convention <M t="\omega_2^{\mathrm{CK}},\omega_3^{\mathrm{CK}},\dots" />. Goucher’s <M t="\Xi" /> function builds the oracle into a combinator, with <M t="\Xi(1..7)=1,2,3,4,6,17,51" />. Infinite-time Turing machines (Hamkins–Lewis 2000) let machines run for transfinitely many steps.</>}
        />
        <KeyIdea>
          <L
            zh={<>这些都还是“计算”：哪怕带了神谕、跑了超限步，函数的定义仍然指向一个具体的机器模型。下一章彻底换一种武器——不再问“机器能算出什么”，而问“逻辑能<b>定义</b>出什么”。那就是 Rayo 数，以及擂台的终局。</>}
            en={<>All of these are still computation: even with oracles or transfinite time, the definition points at a concrete machine model. The next chapter switches weapons entirely — not “what can a machine compute?” but “what can logic <b>define</b>?” That is Rayo’s number, and the endgame of the duel.</>}
          />
        </KeyIdea>
        <OpenProblem title={{ en: 'The value of BB(6)', zh: 'BB(6) 的值' }}>
          <P
            zh={<>只知道下界 <M t="S(6)>\Sigma(6)>2\uparrow\uparrow\uparrow 5" />。要确定它，至少要解决 Antihydra 这类 Collatz 式问题。BB(6) 是否大于 Graham 数，也还不知道；Aaronson 认为 BB(7) 很可能已经超过了。</>}
            en={<>Only lower bounds such as <M t="S(6)>\Sigma(6)>2\uparrow\uparrow\uparrow 5" /> are known. Determining it requires at least resolving Collatz-type problems such as Antihydra. Whether BB(6) exceeds Graham’s number is unknown; Aaronson expects BB(7) probably does.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Where does provability end?', zh: '可证性的边界在哪里？' }}>
          <P
            zh={<>已知 <M t="6\le n_{\mathrm{ZF}}\le230" />（2026 年 10 月）。真正的阈值是多少？Aaronson 猜测 <M t="n_{\mathrm{ZF}}\le20" />、<M t="n_{\mathrm{PA}}\le10" />。另一个开放问题是 <M t="S(n)" /> 与 <M t="\Sigma(n)" /> 之间的精确关系：已证明 <M t="S(n)<\Sigma(3n+6)" />，书中猜测大致有 <M t="S(n)\approx\Sigma(n)^2" />。</>}
            en={<>We know <M t="6\le n_{\mathrm{ZF}}\le230" /> (October 2026). What is the true threshold? Aaronson conjectures <M t="n_{\mathrm{ZF}}\le20" /> and <M t="n_{\mathrm{PA}}\le10" />. Also open: the exact relationship between <M t="S(n)" /> and <M t="\Sigma(n)" />. It is proved that <M t="S(n)<\Sigma(3n+6)" />; the book conjectures roughly <M t="S(n)\approx\Sigma(n)^2" />.</>}
          />
        </OpenProblem>
      </Section>
    </>
  )
}
