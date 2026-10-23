import './ch11.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { BehaviourGallery, HaltingTable, InvariantProver, ParadoxGame, TMWorkbench, TNFExplorer } from './widgets'

export default function Chapter11() {
  return (
    <>
      <Prereq
        items={[
          { en: <>The informal notions “algorithm” and “computable”, the Church–Turing thesis, and diagonalization (Chapter 2).</>, zh: <>“算法”“可计算”的非正式说法、Church–Turing 论题，以及对角化（第 2 章）。</> },
          { en: <>Countable vs uncountable sets and Cantor’s diagonal argument (Chapter 3).</>, zh: <>可数与不可数集合、Cantor 对角线论证（第 3 章）。</> },
          { en: <>Recursive ordinals and <M t="\Omega=\omega_1^{\mathrm{CK}}" />, the first non-recursive ordinal (Chapter 8) — only in one optional panel.</>, zh: <>递归序数与 <M t="\Omega=\omega_1^{\mathrm{CK}}" />，即第一个非递归序数（第 8 章）——只在一个选读面板里用到。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="prologue" kicker={{ en: 'Act V opens', zh: '第五幕开场' }} title={{ en: 'A challenger with no recipe', zh: '一位不带配方的挑战者' }}>
        <P
          zh={<>到目前为止，擂台上的每一位擂主——从阿基米德的“万万”到 Bashicu 矩阵——都带着一份<b>配方</b>：一套有耐心的抄写员可以机械执行的步骤。</>}
          en={<>So far every champion in the duel — from Archimedes’ myriads to the Bashicu matrix — came with a <b>recipe</b>: steps a patient clerk could carry out mechanically.</>}
        />
        <P
          zh={<>现在上来一位新选手，他说：“我的数是：所有不超过 1000 个符号、并且会停下来的程序中，最大的那个输出。”</>}
          en={<>Now a new challenger steps up: “My number is the largest output of any program of at most 1000 symbols that eventually halts.”</>}
        />
        <P
          zh={<>他没有发明任何新配方。他只是对<b>所有</b>配方取了最大值。这合法吗？</>}
          en={<>He invented no new recipe. He simply took the maximum over <b>all</b> recipes. Is that allowed?</>}
        />
        <P
          zh={<>程序只有有限多个，所以这个最大值是一个确定的自然数。但要把它算出来，你得先知道<b>哪些程序会停</b>。本章要说明：这正是任何程序都回答不了的问题。</>}
          en={<>There are finitely many such programs, so the maximum is a definite natural number. But to compute it you must first know <b>which programs halt</b>. This chapter shows that this is exactly the question no program can answer.</>}
        />
        <H3 en="1936" zh="1936 年" />
        <P
          zh={<>1928 年，Hilbert 和 Ackermann 提出了<Term en="Entscheidungsproblem" zh="判定问题" />：能否找到一个机械的方法，判断任意一条一阶逻辑命题能否被证明？</>}
          en={<>In 1928 Hilbert and Ackermann posed the <Term en="Entscheidungsproblem" zh="判定问题" />: is there a mechanical method that decides whether any given statement of first-order logic is provable?</>}
        />
        <P
          zh={<>要证明“这样的方法不存在”，首先得精确地说清楚什么叫“机械的方法”。1936 年，两个答案相隔几个月出现：普林斯顿的 Alonzo Church 用 λ 演算，剑桥 23 岁的 Alan Turing 用一台想象中的机器。</>}
          en={<>To prove that no such method exists, you first need a precise meaning for “mechanical method.” In 1936 two answers appeared months apart: Alonzo Church in Princeton with the λ-calculus, and the 23-year-old Alan Turing in Cambridge with an imaginary machine.</>}
        />
        <P
          zh={<>两人得出同一个结论：判定问题无解。我们沿 Turing 的路走，因为他的机器最具体、最容易“看见”。</>}
          en={<>Both reached the same verdict: the Entscheidungsproblem has no solution. We follow Turing, because his machines are the most concrete — you can watch them work.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="machine" kicker={{ en: 'The model', zh: '模型' }} title={{ en: 'A clerk on a strip of paper', zh: '纸带上的抄写员' }}>
        <P
          zh={<>Turing 的出发点是一个正在做计算的人。他的记忆有限，一次只看几个符号，一次只改一个符号，然后把注意力挪一点点。</>}
          en={<>Turing started from a human doing a computation. Her memory is finite; she looks at a few symbols at a time, changes one symbol at a time, then shifts her attention a little.</>}
        />
        <P
          zh={<>把一切非本质的东西剥掉：纸变成一条格子带，符号只剩 0 和 1，“心里的状态”变成有限个字母 A、B、C……</>}
          en={<>Strip away everything inessential: the paper becomes a strip of cells, the symbols shrink to 0 and 1, and her “state of mind” becomes one of finitely many letters A, B, C, …</>}
        />
        <Thm kind="definition" name={{ en: 'Turing machine (the book’s conventions, §25.3)', zh: 'Turing 机（采用书中 §25.3 的约定）' }}>
          <B
            zh={
              <ul>
                <li>一条两端无穷的<Term en="tape" zh="纸带" />，每格是 0 或 1；除输入外全是 0。</li>
                <li>一个<Term en="head" zh="读头" />指着某一格；机器处于某个<Term en="state" zh="状态" /> A、B、C……，另有一个特殊的<b>停机状态 Z</b>（书中也写作 H）。</li>
                <li>一张<b>转移表</b>：对每个“状态 + 读到的符号”，规定三件事——写什么、往左还是往右走一格、进入哪个状态。写成三个字符，例如 <code>1RB</code> 表示“写 1，右移，进入 B”。</li>
                <li>从状态 A 出发。每一<b>步</b>：读、写、移动、换状态。进入 Z 的那一步也算一步，然后机器<Term en="halt" zh="停机" />。</li>
              </ul>
            }
            en={
              <ul>
                <li>A two-way infinite <Term en="tape" zh="纸带" /> of cells, each 0 or 1; all 0 except for the input.</li>
                <li>A <Term en="head" zh="读头" /> on one cell, and a current <Term en="state" zh="状态" /> A, B, C, …, plus a special <b>halting state Z</b> (the book also writes H).</li>
                <li>A <b>transition table</b>: for each “state + symbol read” it says what to write, whether to move one cell left or right, and which state comes next — three characters, e.g. <code>1RB</code> = “write 1, move right, go to B”.</li>
                <li>Start in state A. Each <b>step</b>: read, write, move, switch state. The step into Z counts; then the machine <Term en="halts" zh="停机" />.</li>
              </ul>
            }
          />
        </Thm>
        <P
          zh={<>整张表可以写成一行：按 A0 A1 _ B0 B1 _ … 的顺序排列。例如 <code>1RB1LB_1LA1RZ</code> 就是一台完整的二状态机器。<code>---</code> 表示一个没用上的格子。</>}
          en={<>The whole table fits on one line, in the order A0 A1 _ B0 B1 _ …. For example <code>1RB1LB_1LA1RZ</code> is a complete 2-state machine. <code>---</code> marks an unused entry.</>}
        />
        <Expand kind="detail" title={{ en: 'Conventions differ between books', zh: '不同书的约定不一样' }}>
          <P
            zh={<>有的书用单向无穷纸带、更多符号、或把“写”和“移动”拆成两种指令。对“能算什么”来说，这些模型全都等价；但对下一章的忙碌海狸数值来说，约定会影响具体数字。我们始终用本章定义中的约定（也是 bbchallenge 社区的约定）。</>}
            en={<>Some books use one-way tapes, more symbols, or separate “write” and “move” instructions. For <i>what can be computed</i> all these are equivalent, but the exact Busy Beaver values of the next chapter depend on the convention. We always use the one in the definition (also the bbchallenge community’s).</>}
          />
          <P
            zh={<>本章的模拟器中，如果机器碰到一个 <code>---</code> 格子，就当它是 <code>1RZ</code>：写 1、停机，并计一步。这正是下文“树标准形”填空的方式。</>}
            en={<>In this chapter’s simulators, reaching an undefined <code>---</code> entry is treated as <code>1RZ</code>: write 1, halt, count one step. That is exactly how Tree Normal Form fills in entries later in this chapter.</>}
          />
        </Expand>
        <Widget
          title={{ en: 'Turing-machine workbench', zh: 'Turing 机工作台' }}
          hint={{ en: 'Edit any entry of the table, or paste a code. The highlighted entry is the one just used.', zh: '可以改表里任何一格，或直接粘贴代码。高亮的格子是刚刚用到的那条转移。' }}
        >
          <TMWorkbench />
        </Widget>
        <H3 en="Six steps, four ones" zh="六步，四个 1" />
        <P
          zh={<>先看预设的二状态冠军 <code>1RB1LB_1LA1RZ</code>。从全 0 纸带出发，它左右横跳，6 步后停下，留下 4 个连续的 1。</>}
          en={<>Start with the preset 2-state champion <code>1RB1LB_1LA1RZ</code>. From a blank tape it zig-zags, halts after 6 steps, and leaves 4 ones in a row.</>}
        />
        <P
          zh={<>现在试着改一格。你能造出一台走得更久、但最终仍会停下的二状态机器吗？下一章会告诉你：不能——而这个“不能”有一个名字。</>}
          en={<>Now change one entry. Can you build a 2-state machine that runs longer than 6 steps and still halts? The next chapter will tell you: you can’t — and that “can’t” has a name.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="programming" kicker={{ en: 'Programming the strip', zh: '在纸带上编程' }} title={{ en: 'Numbers in, numbers out', zh: '数进去，数出来' }}>
        <P
          zh={<>要让机器计算函数，先约定怎么写数。书中的约定：输入 <M t="n" /> 写成连续 <M t="n+1" /> 个 1（这样 0 也看得见），多个输入之间隔一个 0，读头放在最左边的 1 上。</>}
          en={<>To compute functions we need a way to write numbers. The book’s convention: input <M t="n" /> is <M t="n+1" /> consecutive ones (so that 0 is visible), several inputs are separated by a single 0, and the head starts on the leftmost 1.</>}
        />
        <P
          zh={<>输出是机器停机时纸带上 1 的总数。</>}
          en={<>The output is the total number of ones on the tape when the machine halts.</>}
        />
        <P
          zh={<>在这种约定下，加法几乎是白送的：输入 <M t="a,b" /> 一共有 <M t="(a+1)+(b+1)" /> 个 1，只要擦掉两个就得到 <M t="a+b" />。工作台里的“加法器”只用 3 个状态。</>}
          en={<>With this convention addition is almost free: inputs <M t="a,b" /> put <M t="(a+1)+(b+1)" /> ones on the tape, so erasing two of them leaves <M t="a+b" />. The workbench’s “adder” needs only 3 states.</>}
        />
        <P
          zh={<>“倍增器”要真正干活：它一次从输入块里取走一个 1，跑到右边，在输出块末尾写两个 1，再跑回来。7 个状态。把它放到工作台里看它来回奔波。</>}
          en={<>The “doubler” has to work for it: it removes one 1 from the input block, runs right, appends two ones to the output block, and runs back — 7 states. Load it in the workbench and watch it shuttle.</>}
        />
        <Thm kind="definition" name={{ en: 'Turing-computable', zh: 'Turing 可计算' }}>
          <B
            zh={<p>函数 <M t="f:\mathbb N^k\to\mathbb N" /> 是 <b>Turing 可计算的</b>，如果存在一台 Turing 机，对每组输入都会停机，并且输出 <M t="f" /> 的值。</p>}
            en={<p>A function <M t="f:\mathbb N^k\to\mathbb N" /> is <b>Turing-computable</b> if some Turing machine, on every input, halts with output equal to the value of <M t="f" />.</p>}
          />
        </Thm>
        <H3 en="Machines are data" zh="机器也是数据" />
        <P
          zh={<>Turing 1936 年论文中最深的发现是<Term en="universal Turing machine" zh="通用 Turing 机" /> U：把任意机器 M 的代码和输入 x 一起写在纸带上，U 就能一步一步模拟 M 在 x 上的运行。</>}
          en={<>The deepest idea in Turing’s 1936 paper is the <Term en="universal Turing machine" zh="通用 Turing 机" /> U: write the code of any machine M and an input x on its tape, and U simulates M on x step by step.</>}
        />
        <P
          zh={<>程序可以被当作数据读入——这正是今天每一台存储程序计算机的原理。能模拟 U 的系统叫 <Term en="Turing-complete" zh="Turing 完备" />。</>}
          en={<>Programs can be read in as data — the principle behind every stored-program computer today. A system that can simulate U is called <Term en="Turing-complete" zh="Turing 完备" />.</>}
        />
        <P
          zh={<>机器既然是有限长的代码，就可以数一数。<M t="n" /> 个状态的转移表有 <M t="2n" /> 格，每格要选写什么（2 种）、往哪走（2 种）、进哪个状态（<M t="n+1" /> 种，含 Z），所以共有</>}
          en={<>Since machines are finite codes, we can count them. An <M t="n" />-state table has <M t="2n" /> entries; each chooses a symbol (2 ways), a direction (2 ways) and a next state (<M t="n+1" /> ways, including Z). So there are</>}
        />
        <MB t="\begin{gathered}(4n+4)^{2n}\\ \small n=2:\ 20{,}736;\qquad n=5:\ 63{,}403{,}380{,}965{,}376\end{gathered}" />
        <P
          zh={<>张表。数目惊人，但始终是有限的；全体机器则是<b>可数</b>多台。</>}
          en={<>tables. Enormous, but finite for each <M t="n" />; and all machines together form a <b>countable</b> set.</>}
        />
        <Thm name={{ en: 'most functions are uncomputable', zh: '绝大多数函数不可计算' }}>
          <B
            zh={<p>存在函数 <M t="\mathbb N\to\{0,1\}" />，它不是 Turing 可计算的。</p>}
            en={<p>Some function <M t="\mathbb N\to\{0,1\}" /> is not Turing-computable.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>每台机器至多计算一个函数，而机器只有可数多台。但全体函数 <M t="\mathbb N\to\{0,1\}" />，也就是全体无穷 0/1 序列，按第 3 章的 Cantor 对角线论证是不可数的。所以总有函数没有机器去算它。</>}
            en={<>Each machine computes at most one function, and there are only countably many machines. But the functions <M t="\mathbb N\to\{0,1\}" /> — the infinite 0/1 sequences — are uncountable by Cantor’s diagonal argument (Chapter 3). So some function is left without a machine.</>}
          />
        </Proof>
        <P
          zh={<>这个证明只说“存在”，没有指出是哪一个。不可计算的函数其实才是常态。本章的主角是一个<b>具体的、自然的</b>例子：停机问题。</>}
          en={<>This proof says “there exists” without pointing to one. Uncomputable functions are actually the norm. The star of this chapter is a <b>specific, natural</b> example: the halting problem.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="behaviours" kicker={{ en: 'Field guide', zh: '野外图鉴' }} title={{ en: 'What machines do all day', zh: '机器整天在干什么' }}>
        <P
          zh={<>要看清一台机器的行为，最好的办法是<Term en="space-time diagram" zh="时空图" />：每走一步，就把整条纸带画成一行，时间向下流动。金色是 1，彩色小块是读头（颜色表示状态）。</>}
          en={<>The best way to see what a machine is doing is a <Term en="space-time diagram" zh="时空图" />: after each step, draw the whole tape as one row, with time flowing downward. Gold is a 1; the coloured mark is the head (its colour shows the state).</>}
        />
        <Widget
          title={{ en: 'Five kinds of behaviour', zh: '五种行为' }}
          hint={{ en: 'Switch between machines and stretch the time axis. Each never-halting shape needs a different proof that it never halts.', zh: '切换机器，拉长时间轴。每种“不停机”的形状，都需要一种不同的证明方法。' }}
        >
          <BehaviourGallery />
        </Widget>
        <P
          zh={<>循环机、平移循环机、弹跳机、计数器——这四种“不停机”的形状一直延续到五状态机器。下一章证明 BB(5) 时，每一种都要靠专门的程序去识别。</>}
          en={<>Cyclers, translated cyclers, bouncers, counters: these four never-halting shapes persist all the way up to 5-state machines. In the next chapter’s proof of BB(5), each one needs its own dedicated recognizer.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="church-turing" kicker={{ en: 'One notion', zh: '殊途同归' }} title={{ en: 'Every model computes the same things', zh: '所有模型算的东西都一样' }}>
        <P
          zh={<>1936 年前后，“可计算”的定义一下子冒出好几个：Church 的 λ 演算、Gödel–Herbrand–Kleene 的递归函数、Turing 机、Post 的产生式系统。它们看上去毫无关系。</>}
          en={<>Around 1936 several definitions of “computable” appeared at once: Church’s λ-calculus, the recursive functions of Gödel, Herbrand and Kleene, Turing machines, Post’s production systems. They look nothing alike.</>}
        />
        <Thm name={{ en: 'equivalence of the classical models (Kleene 1936, Turing 1937)', zh: '经典模型的等价性（Kleene 1936，Turing 1937）' }}>
          <B
            zh={<p>对函数 <M t="f:\mathbb N^k\to\mathbb N" />，以下三者等价：<M t="f" /> 是 Turing 可计算的；<M t="f" /> 是（μ-）递归函数；<M t="f" /> 是 λ 可定义的。</p>}
            en={<p>For <M t="f:\mathbb N^k\to\mathbb N" /> the following are equivalent: <M t="f" /> is Turing-computable; <M t="f" /> is (μ-)recursive; <M t="f" /> is λ-definable.</p>}
          />
        </Thm>
        <P
          zh={<>证明是工程活：每个模型都能模拟另外两个。真正有意思的是这个巧合背后的信念。</>}
          en={<>The proof is engineering: each model simulates the others. What is interesting is the belief this coincidence supports.</>}
        />
        <Thm kind="fact" name={{ en: 'Church–Turing thesis', zh: 'Church–Turing 论题' }} status="conjecture">
          <B
            zh={<p>凡是能用“有效的机械方法”计算的函数，都是 Turing 可计算的。</p>}
            en={<p>Every function computable by an effective mechanical procedure is Turing-computable.</p>}
          />
        </Thm>
        <P
          zh={<>第 2 章已经见过它。现在一边被说精确了（Turing 可计算），另一边（“有效的机械方法”）仍然是直觉概念——所以它是论题，不是定理，书中也把它标为“猜想 25.1”。</>}
          en={<>Chapter 2 met it informally. Now one side is precise (Turing-computable), while the other (“effective mechanical procedure”) is still an intuition — so it is a thesis, not a theorem. The book labels it “Conjecture 25.1.”</>}
        />
        <P
          zh={<>证据是压倒性的：九十年来提出的每一个合理模型，包括你手上的编程语言，都恰好算出同一批函数。Gödel 本人正是读了 Turing 对“抄写员”的分析才被说服。</>}
          en={<>The evidence is overwhelming: every reasonable model proposed in ninety years, including your favourite programming language, computes exactly the same functions. Gödel himself was convinced by Turing’s analysis of the human clerk.</>}
        />
        <P
          zh={<>从现在起，“可计算”就指 Turing 可计算。</>}
          en={<>From now on, “computable” means Turing-computable.</>}
        />
        <Expand kind="deeper" title={{ en: 'The other two models in one page', zh: '一页纸讲完另外两种模型' }}>
          <P
            zh={<><b>递归函数。</b>从零函数、后继 <M t="S(x)=x+1" />、投影出发，允许复合与<b>原始递归</b> <M t="h(x,0)=f(x),\ h(x,y+1)=g(x,y,h(x,y))" />，得到<Term en="primitive recursive" zh="原始递归" />函数：加、乘、乘方、箭头的每一层都在其中。</>}
            en={<><b>Recursive functions.</b> Start from zero, successor <M t="S(x)=x+1" /> and projections; close under composition and <b>primitive recursion</b> <M t="h(x,0)=f(x),\ h(x,y+1)=g(x,y,h(x,y))" />. This gives the <Term en="primitive recursive" zh="原始递归" /> functions: +, ×, powers, each fixed level of arrows.</>}
          />
          <P
            zh={<>它们不够：Ackermann 函数 <M t="\mathrm{Ack}(0,n)=n+1,\ \mathrm{Ack}(m{+}1,0)=\mathrm{Ack}(m,1),\ \mathrm{Ack}(m{+}1,n{+}1)=\mathrm{Ack}(m,\mathrm{Ack}(m{+}1,n))" /> 支配每一个一元原始递归函数，于是对角线 <M t="\mathrm{Ack}(n,n)" /> 不是原始递归的——这就是第 2 章那一步对角化。</>}
            en={<>They are not enough: the Ackermann function <M t="\mathrm{Ack}(0,n)=n+1,\ \mathrm{Ack}(m{+}1,0)=\mathrm{Ack}(m,1),\ \mathrm{Ack}(m{+}1,n{+}1)=\mathrm{Ack}(m,\mathrm{Ack}(m{+}1,n))" /> dominates every unary primitive recursive function, so its diagonal <M t="\mathrm{Ack}(n,n)" /> is not primitive recursive — Chapter 2’s diagonal move again.</>}
          />
          <P
            zh={<>补上<b>极小化</b> <M t="\mu y[f(x,y)=0]" />（“找最小的 y”，可能永远找不到），就得到全部（部分）递归函数。“可能找不到”正是停机问题的来源。</>}
            en={<>Adding <b>minimisation</b> <M t="\mu y[f(x,y)=0]" /> (“search for the least y” — which may search forever) gives all (partial) recursive functions. That “may search forever” is where the halting problem lives.</>}
          />
          <P
            zh={<><b>λ 演算。</b>只有变量、函数抽象 <M t="\lambda x.M" /> 和应用 <M t="MN" />，唯一的计算规则是代入：<M t="(\lambda x.M)N\to M[x:=N]" />。数 <M t="n" /> 编码成“把函数用 n 次”：<M t="\bar n=\lambda f.\lambda x.f^{n}x" />。</>}
            en={<><b>λ-calculus.</b> Only variables, abstraction <M t="\lambda x.M" /> and application <M t="MN" />; the single rule is substitution, <M t="(\lambda x.M)N\to M[x:=N]" />. The number <M t="n" /> becomes “apply a function n times”: <M t="\bar n=\lambda f.\lambda x.f^{n}x" />.</>}
          />
          <P
            zh={<>项 <M t="(\lambda x.xx)(\lambda x.xx)" /> 代入一次又变回自己，永远算不完——这是 λ 演算里的“不停机”。</>}
            en={<>The term <M t="(\lambda x.xx)(\lambda x.xx)" /> rewrites to itself forever — non-halting, λ-style.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="halting" kicker={{ en: 'The big move', zh: '关键一步' }} title={{ en: 'The halting problem', zh: '停机问题' }}>
        <P
          zh={<>给你一台机器 M 和一个输入 x：M 在 x 上最终会停吗？</>}
          en={<>You are given a machine M and an input x. Will M eventually halt on x?</>}
        />
        <P
          zh={<>直接运行只能给出一半答案：如果它停了，你会看到；如果它不停，你就永远等下去，而且永远不知道“再等一会儿”会不会有结果。</>}
          en={<>Running it gives only half an answer. If it halts, you see it. If not, you wait forever, never knowing whether a little more patience would have paid off.</>}
        />
        <P
          zh={<>假设有一位全知的<b>神谕</b> HALT，对任何 (M, x) 都能在有限时间内答对。现在由你来扮演它。</>}
          en={<>Suppose an all-knowing <b>oracle</b> HALT answers correctly, in finite time, for every pair (M, x). Below, you play the oracle.</>}
        />
        <Widget
          title={{ en: 'The paradox machine', zh: '悖论机器' }}
          hint={{ en: 'Whatever you answer, TROLL does the opposite. Try patching yourself, too.', zh: '无论你怎么回答，TROLL 都反着干。也试试给自己打补丁。' }}
        >
          <ParadoxGame />
        </Widget>
        <Thm name={{ en: 'the halting theorem (Turing 1936)', zh: '停机定理（Turing 1936）' }}>
          <B
            zh={<p>不存在这样的 Turing 机 HALT：对任意机器的代码 ⟨M⟩ 和输入 x，HALT(⟨M⟩, x) 总会停机，并且当 M 在 x 上停机时输出 1，否则输出 0。</p>}
            en={<p>There is no Turing machine HALT that, for every machine code ⟨M⟩ and input x, halts on (⟨M⟩, x) and outputs 1 if M halts on x, and 0 otherwise.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>假设 HALT 存在。造一台机器 TROLL：输入 x 时，先运行 HALT(x, x)；若得到 1 就进入死循环，若得到 0 就停机。TROLL 由 HALT 拼装而成，所以它也是一台 Turing 机，有自己的代码 t。现在问：TROLL 在输入 t 上停不停？按构造，TROLL(t) 停机 ⇔ HALT(t, t) = 0 ⇔ TROLL 在 t 上不停机。矛盾。</>}
            en={<>Suppose HALT exists. Build TROLL: on input x, run HALT(x, x); if it says 1, loop forever; if 0, halt. TROLL is assembled from HALT, so it is a Turing machine with some code t. Does TROLL halt on input t? By construction, TROLL(t) halts ⇔ HALT(t, t) = 0 ⇔ TROLL does not halt on t. Contradiction.</>}
          />
        </Proof>
        <H3 en="Where the self-reference hides" zh="自指藏在哪里" />
        <P
          zh={<>关键一步是把 TROLL <b>自己的代码</b>喂给它。这和第 2 章的对角函数 <M t="d(n)=n\uparrow^{n}n" />、第 3 章 Cantor 的对角线是同一个动作：沿对角线走，处处唱反调。</>}
          en={<>The key move is feeding TROLL <b>its own code</b>. It is the same move as Chapter 2’s diagonal function <M t="d(n)=n\uparrow^{n}n" /> and Cantor’s diagonal in Chapter 3: walk down the diagonal and disagree everywhere.</>}
        />
        <Widget
          title={{ en: 'The halting table and its diagonal', zh: '停机表与它的对角线' }}
          hint={{ en: 'Rows are programs, columns are inputs. Click a row to see where TROLL disagrees with it.', zh: '行是程序，列是输入。点一行，看 TROLL 在哪里和它唱反调。' }}
        >
          <HaltingTable />
        </Widget>
        <P
          zh={<>如果表中列出了<b>所有</b>程序，TROLL 也应该是其中某一行，比如第 k 行。可它在第 k 格上与第 k 行相反——它不可能在表里。</>}
          en={<>If the table listed <b>all</b> programs, TROLL would be some row, say row k. But it disagrees with row k in column k — so it cannot be in the table.</>}
        />
        <P
          zh={<>注意表的最后一行：要写出 TROLL 的那一格，就得先知道 Goldbach 猜想是否成立。停机判定器若存在，就能顺手解决所有这类猜想。</>}
          en={<>Notice the last row: to fill in TROLL’s entry there, you would have to know whether Goldbach’s conjecture holds. A halting decider, if it existed, would settle every conjecture of this kind in passing.</>}
        />
        <Caution>
          <L
            zh={<>停机定理不是说“某台特定机器的停机性不可判定”。对每个固定的 (M, x)，“输出 1”和“输出 0”这两个程序里总有一个是对的。不可能的是一台<b>对所有输入都正确</b>的判定器。</>}
            en={<>The halting theorem does not say “some particular machine’s halting is undecidable.” For each fixed (M, x), one of the two programs “print 1” and “print 0” is correct. What cannot exist is one decider that is right <b>on all inputs</b>.</>}
          />
        </Caution>
        <Quiz
          q={{
            zh: <p>令 <M t="g(n)=1" />（若 Goldbach 猜想成立），否则 <M t="g(n)=0" />。函数 <M t="g" /> 可计算吗？</p>,
            en: <p>Let <M t="g(n)=1" /> if Goldbach’s conjecture is true and <M t="g(n)=0" /> otherwise. Is <M t="g" /> computable?</p>,
          }}
          options={[
            { zh: <p>可计算</p>, en: <p>Yes, computable</p> },
            { zh: <p>不可计算</p>, en: <p>No, uncomputable</p> },
            { zh: <p>要等 Goldbach 猜想解决才知道</p>, en: <p>Unknown until Goldbach is settled</p> },
          ]}
          answer={0}
          explain={{
            zh: <p><M t="g" /> 要么是常数 1，要么是常数 0，两个常数函数都可计算。我们不知道<b>哪个</b>程序算的是 <M t="g" />，但可计算性只问这样的程序是否存在。</p>,
            en: <p><M t="g" /> is either the constant 1 or the constant 0, and both are computable. We don’t know <b>which</b> program computes <M t="g" />, but computability only asks whether such a program exists.</p>,
          }}
        />
        <Expand kind="detail" title={{ en: 'The blank-tape version (used in Chapter 12)', zh: '空白纸带版本（第 12 章要用）' }}>
          <P
            zh={<>“M 从<b>全 0 纸带</b>出发会停吗？”同样不可判定。给定 (M, x)，造一台机器 <M t="M_x" />：先把 x 写到纸带上，再把读头挪回去，然后运行 M。<M t="M_x" /> 在空白纸带上停机 ⇔ M 在 x 上停机。</>}
            en={<>“Does M halt starting from an <b>all-0 tape</b>?” is undecidable too. Given (M, x), build <M t="M_x" />: write x on the tape, return the head, then run M. <M t="M_x" /> halts on blank tape ⇔ M halts on x.</>}
          />
          <P
            zh={<>从 (M, x) 算出 <M t="M_x" /> 的代码是机械的。所以若空白纸带版本可判定，原版也可判定，与停机定理矛盾。</>}
            en={<>Computing the code of <M t="M_x" /> from (M, x) is mechanical. So if the blank-tape version were decidable, so would be the original — contradicting the halting theorem.</>}
          />
          <P
            zh={<>同样的“归约”也回答了 Hilbert 的判定问题：可以把“M 停机”写成一条一阶逻辑命题“某个公理集推出某句话”，所以判定可证性至少和判定停机一样难。</>}
            en={<>The same kind of reduction answers Hilbert’s Entscheidungsproblem: “M halts” can be written as “these axioms prove that sentence” in first-order logic, so deciding provability is at least as hard as deciding halting.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="not-big" kicker={{ en: 'A warning', zh: '一个提醒' }} title={{ en: 'Uncomputable does not mean huge', zh: '不可计算 ≠ 巨大' }}>
        <P
          zh={<>停机函数 <M t="h(M,x)" /> 只取 0 和 1 两个值，却不可计算。“不可计算”说的是没有统一的方法，跟数值大小毫无关系。</>}
          en={<>The halting function <M t="h(M,x)" /> takes only the values 0 and 1, yet it is uncomputable. Uncomputability is about the absence of a uniform method, not about size.</>}
        />
        <P
          zh={<>更极端的例子是 Chaitin 的 <M t="\Omega" />（1975）：随机挑一个程序，它会停机的概率。它是 0 和 1 之间的一个实数，但它的二进制位无法被计算。</>}
          en={<>A more striking example is Chaitin’s <M t="\Omega" /> (1975): the probability that a randomly chosen program halts. It is a real number between 0 and 1, yet its binary digits cannot be computed.</>}
        />
        <MB t="\Omega=\sum_{p\ \text{halts}}2^{-|p|},\qquad 0<\Omega<1." />
        <Expand kind="detail" title={{ en: 'Why knowing Ω would solve the halting problem', zh: '为什么知道 Ω 就能解决停机问题' }}>
          <P
            zh={<>这里的程序取自一台“无前缀”的通用机器：没有一个合法程序是另一个合法程序的前缀，所以 <M t="\Omega=\sum_{p\ \text{halts}}2^{-|p|}" /> 不超过 1。</>}
            en={<>The programs here come from a “prefix-free” universal machine: no valid program is a prefix of another, which keeps <M t="\Omega=\sum_{p\ \text{halts}}2^{-|p|}" /> at most 1.</>}
          />
          <P
            zh={<>设你知道 <M t="\Omega" /> 的前 N 位，得到 <M t="\Omega_N\le\Omega<\Omega_N+2^{-N}" />。把所有程序交错运行，每停一个就把 <M t="2^{-|p|}" /> 加进总和，直到总和 <M t="\ge\Omega_N" />。</>}
            en={<>Suppose you know the first N bits of <M t="\Omega" />, giving <M t="\Omega_N\le\Omega<\Omega_N+2^{-N}" />. Run all programs in parallel, adding <M t="2^{-|p|}" /> for each one that halts, until the running total reaches <M t="\Omega_N" />.</>}
          />
          <P
            zh={<>此时任何长度 ≤ N 但还没停的程序都永远不会停：它若再停，总和会再增加至少 <M t="2^{-N}" />，超过 <M t="\Omega" />。所以 <M t="\Omega" /> 的数位不可计算。</>}
            en={<>At that moment, any program of length ≤ N that has not halted never will: its halting would add at least <M t="2^{-N}" /> and push the total past <M t="\Omega" />. Hence the digits of <M t="\Omega" /> are uncomputable.</>}
          />
        </Expand>
        <P
          zh={<>反过来，不可计算的函数也可以长得极慢。下一章的忙碌海狸函数有一个“反函数”，它不可计算，却最终比任何单调不减、无界的可计算函数都长得慢（第 12 章证明）。</>}
          en={<>Conversely, an uncomputable function can grow extremely slowly. The next chapter’s Busy Beaver function has an “inverse” that is uncomputable yet is eventually below every nondecreasing, unbounded computable function (proved in Chapter 12).</>}
        />
        <P
          zh={<>大数爱好者真正关心的问题是：有没有不可计算的函数，比<b>每一个</b>可计算函数都长得快？答案是有，它就是下一章的主角。</>}
          en={<>The googologist’s real question is: is there an uncomputable function that outgrows <b>every</b> computable function? There is — and it is the star of the next chapter.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="small" kicker={{ en: 'Hands on', zh: '动手' }} title={{ en: 'Settling every small machine', zh: '把小机器一台台判完' }}>
        <P
          zh={<>停机问题在一般情况下无解，但对状态很少的机器，我们可以尝试<b>逐台</b>判定。第一步是把机器的数量压下来。</>}
          en={<>The halting problem is unsolvable in general, but for machines with very few states we can try to settle them <b>one by one</b>. Step one: cut down how many machines there are.</>}
        />
        <P
          zh={<><Term en="Tree Normal Form" zh="树标准形" />（TNF）的做法：先只规定 A0 = <code>1RB</code>，其余全空。运行，碰到空格子时才“分叉”——要么在这里停机，要么填入一条新转移。新状态按首次出现的顺序命名。</>}
          en={<><Term en="Tree Normal Form" zh="树标准形" /> (TNF) works like this: fix A0 = <code>1RB</code> and leave everything else empty. Run; only when an empty entry is reached do we branch — either halt there, or fill in a new transition. New states are named in order of first use.</>}
        />
        <P
          zh={<>这样，永远用不到的格子不会被枚举，只是改名字的“同构”机器也只算一次。</>}
          en={<>Entries that are never used are never enumerated, and machines that differ only by renaming states are counted once.</>}
        />
        <Widget
          title={{ en: 'Every 2-state machine, classified', zh: '所有二状态机器，逐台分类' }}
          hint={{ en: 'Pick a machine to see its first 36 steps. Then try the 3-state enumeration.', zh: '点一台机器，看它前 36 步的时空图。然后试试三状态的枚举。' }}
        >
          <TNFExplorer />
        </Widget>
        <P
          zh={<>结果：二状态的 TNF 树只有 41 片叶子。15 台停机（正是书中列出的 15 台），最长 6 步，最多 4 个 1；其余 26 台不停：3 台循环机，23 台平移循环机。</>}
          en={<>The result: the 2-state TNF tree has just 41 leaves. 15 halt (exactly the 15 the book lists), the longest after 6 steps, the most ones being 4; the other 26 never halt — 3 cyclers and 23 translated cyclers.</>}
        />
        <P
          zh={<>（分类由小程序自动做出；每种情形都能从时空图上手工验证。）三状态有 4057 片叶子，停机者最多走 21 步，最多留下 6 个 1。</>}
          en={<>(The widget classifies by simple automatic tests; each case is easy to confirm from its diagram.) Three states give 4057 leaves, whose halting members run at most 21 steps and leave at most 6 ones.</>}
        />
        <H3 en="Proving that a machine never halts" zh="怎样证明一台机器永不停机" />
        <P
          zh={<>“跑了一百万步还没停”不是证明。真正的证明要找一个<Term en="invariant" zh="不变量" />：一个格局集合 C，机器一旦进入就出不来，而 C 里又没有即将停机的格局。</>}
          en={<>“Still running after a million steps” is not a proof. A real proof finds an <Term en="invariant" zh="不变量" />: a set C of configurations that the machine can never leave, and which contains no configuration about to halt.</>}
        />
        <Thm name={{ en: 'closed set of configurations', zh: '封闭格局集' }}>
          <B
            zh={<p>设 C 是一个格局集合，满足：(1) 初始格局属于 C；(2) C 中任一格局走一步后仍在 C 中；(3) C 中没有格局的下一步是停机转移。那么机器永不停机。</p>}
            en={<p>Let C be a set of configurations such that (1) the starting configuration is in C; (2) one step from any configuration in C stays in C; (3) no configuration in C is about to take a halting transition. Then the machine never halts.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>对 k 归纳，由 (1)(2) 知第 k 步的格局对每个 k 都在 C 中；由 (3)，没有哪一步是停机。</>}
            en={<>By (1), (2) and induction on k, the configuration after k steps lies in C for every k; by (3), none of those steps halts.</>}
          />
        </Proof>
        <Widget
          title={{ en: 'An invariant at work', zh: '一个不变量的实战' }}
          hint={{ en: 'Rows of the diagram are coloured by the part of C they belong to. Then run the closure check — and try the sloppy version.', zh: '时空图每一行按它属于 C 的哪一部分着色。然后运行封闭性检验——再试试粗糙的版本。' }}
        >
          <InvariantProver />
        </Widget>
        <P
          zh={<>对机器 <code>1RB0LA_1LA---</code>，精心设计的 C 有三种形状。写法：纸带内容，状态字母写在被读格子的前面，左边全是 0。三行就验证完所有长度：</>}
          en={<>For the machine <code>1RB0LA_1LA---</code>, the careful C has three shapes. Notation: tape contents, with the state letter just before the scanned cell and blanks to the left. Three lines check every length:</>}
        />
        <MB t="\begin{aligned}\texttt{A}1v\ &\xrightarrow{\ \texttt{0LA}\ }\ \texttt{A}00v,\\ \texttt{A}0,\ \texttt{A}00v\ &\xrightarrow{\ \texttt{1RB}\ }\ 1\texttt{B}0v,\\ 1\texttt{B}0v\ &\xrightarrow{\ \texttt{1LA}\ }\ \texttt{A}11v.\end{aligned}" />
        <P
          zh={<>每个结果仍在 C 中，而 C 里状态 B 总读到 0。唯一的停机入口 B1 永远用不上。证毕。</>}
          en={<>Every result is again in C, and in C state B always reads a 0. The only exit, entry B1, is never used. Done.</>}
        />
        <P
          zh={<>粗糙版本失败了：它包含 <code>1B1</code>，而那正是停机格局。不变量必须“刚好够紧”。</>}
          en={<>The sloppy version fails: it contains <code>1B1</code>, which is a halting configuration. An invariant has to be just tight enough.</>}
        />
        <P
          zh={<>这就是<Term en="closed tape language" zh="封闭磁带语言" />（CTL）方法。当 C 能用有限自动机描述时，计算机可以自动搜索它——下一章证明 BB(5) 时，几百万台机器就是这样被判定的。</>}
          en={<>This is the <Term en="closed tape language" zh="封闭磁带语言" /> (CTL) method. When C can be described by a finite automaton, a computer can search for it automatically — in the next chapter’s proof of BB(5), millions of machines are settled this way.</>}
        />
        <Quiz
          q={{
            zh: <p>“从空白纸带出发的 4 状态机器会不会停机？”这个问题（只限 4 状态）可判定吗？</p>,
            en: <p>Is the problem “does this 4-state machine halt on a blank tape?” (restricted to 4-state machines) decidable?</p>,
          }}
          options={[
            { zh: <p>可判定</p>, en: <p>Decidable</p> },
            { zh: <p>不可判定，因为停机问题不可判定</p>, en: <p>Undecidable, because the halting problem is</p> },
          ]}
          answer={0}
          explain={{
            zh: <p>4 状态机器只有有限多台。把每台的正确答案列成一张有限的表，查表的程序就是判定器——而且停机者最多走 107 步这一事实（第 12 章）还让这张表可以被实际算出来。停机定理只禁止对<b>无穷</b>多台机器统一判定。</p>,
            en: <p>There are finitely many 4-state machines. A program that looks up a finite table of correct answers decides the problem — and the fact that halting ones stop within 107 steps (Chapter 12) even lets us build that table. The halting theorem only forbids a uniform decider for <b>infinitely</b> many machines.</p>,
          }}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="oracles" kicker={{ en: 'Above the halting problem', zh: '停机问题之上' }} title={{ en: 'Oracles and jumps', zh: '神谕与跳跃' }}>
        <P
          zh={<>假如真有一个黑盒子能瞬间回答停机问题呢？Turing 在 1939 年就考虑过：<Term en="oracle machine" zh="神谕机" />。</>}
          en={<>What if we simply had a black box that answers halting questions instantly? Turing considered this in 1939: the <Term en="oracle machine" zh="神谕机" />.</>}
        />
        <Thm kind="definition" name={{ en: 'oracle machine and Turing jump', zh: '神谕机与 Turing 跳跃' }}>
          <B
            zh={<p>给定集合 <M t="X\subseteq\mathbb N" />，一台<b>带神谕 X 的机器</b>是普通 Turing 机，外加一条指令：“问一下 <M t="n\in X" /> 吗？”并在一步之内得到答案。<M t="X" /> 的<b>跳跃</b> <M t="X'" /> 是“带神谕 X 的机器的停机问题”。</p>}
            en={<p>For a set <M t="X\subseteq\mathbb N" />, a <b>machine with oracle X</b> is an ordinary Turing machine with one extra instruction: “is <M t="n\in X" />?”, answered in one step. The <b>jump</b> <M t="X'" /> of <M t="X" /> is the halting problem for machines with oracle X.</p>}
          />
        </Thm>
        <P
          zh={<>停机定理的证明逐字照搬：带神谕 X 的机器判定不了 <M t="X'" />。TROLL 也可以带着同一个神谕。</>}
          en={<>The proof of the halting theorem goes through word for word: no machine with oracle X decides <M t="X'" />. TROLL simply carries the same oracle.</>}
        />
        <P
          zh={<>于是得到一座永无尽头的阶梯：<M t="\varnothing" />（可计算），<M t="\varnothing'" />（停机问题），<M t="\varnothing''" />，……每一级都严格更难。</>}
          en={<>So we get an endless staircase: <M t="\varnothing" /> (computable), <M t="\varnothing'" /> (the halting problem), <M t="\varnothing''" />, … each strictly harder than the one below.</>}
        />
        <H3 en="Counting quantifiers" zh="数一数量词" />
        <P
          zh={<>每一级对应一种逻辑形状。“M 会停”= “<b>存在</b>一个步数 s，M 在 s 步时停了”，形如 ∃，即第 10 章量词层级里的 <M t="\Sigma_1" />。Goldbach 猜想 = “<b>对所有</b>偶数 n ≥ 4，n 是两素数之和”，形如 ∀，记作 <M t="\Pi_1" />，即“某台机器永不停”。</>}
          en={<>Each level matches a logical shape. “M halts” = “<b>there exists</b> a step count s at which M has halted” — an ∃ statement, class <M t="\Sigma_1" /> in Chapter 10’s quantifier count. Goldbach’s conjecture = “<b>for all</b> even n ≥ 4, n is a sum of two primes” — a ∀ statement, <M t="\Pi_1" />, i.e. “some machine never halts.”</>}
        />
        <P
          zh={<>孪生素数猜想 = “对所有 x，存在 p &gt; x 使 p、p+2 都是素数”，形如 ∀∃，即 <M t="\Pi_2" />：它说的是“某台机器在<b>每个</b>输入上都停”。这需要 <M t="\varnothing''" /> 才能判定。</>}
          en={<>The twin prime conjecture = “for all x there is p &gt; x with p and p+2 prime” — a ∀∃ statement, <M t="\Pi_2" />: it says “some machine halts on <b>every</b> input.” Deciding such statements needs <M t="\varnothing''" />.</>}
        />
        <Thm kind="fact" name={{ en: 'Post’s theorem (1948)', zh: 'Post 定理（1948）' }} status="proved">
          <B
            zh={<p>一个集合是 <M t="\Sigma_{n+1}" /> 的，当且仅当它能被带神谕 <M t="\varnothing^{(n)}" /> 的机器“半判定”（属于时停机，不属于时不停）。</p>}
            en={<p>A set is <M t="\Sigma_{n+1}" /> if and only if some machine with oracle <M t="\varnothing^{(n)}" /> semi-decides it (halts exactly on its members).</p>}
          />
        </Thm>
        <P
          zh={<>下一章要用到这座阶梯：忙碌海狸函数用 <M t="\varnothing'" /> 就能算；而为“带神谕的机器”定义的忙碌海狸则住在更高的楼层。</>}
          en={<>The next chapter uses this staircase: the Busy Beaver function is computable from <M t="\varnothing'" />, while Busy Beavers defined for oracle machines live on higher floors.</>}
        />
        <Expand kind="deeper" title={{ en: 'Turing degrees, Kleene’s O and Ω = ω₁ᶜᴷ', zh: 'Turing 度、Kleene 的 O 与 Ω = ω₁ᶜᴷ' }}>
          <P
            zh={<>若 A 能被带神谕 B 的机器判定，记 <M t="A\le_T B" />。互相可归约的集合属于同一个 <Term en="Turing degree" zh="Turing 度" />。Muchnik（1956）与 Friedberg（1957）各自证明：存在严格介于 <M t="\varnothing" /> 和 <M t="\varnothing'" /> 之间的度——Post 问题的答案。</>}
            en={<>Write <M t="A\le_T B" /> if a machine with oracle B decides A; mutually reducible sets share a <Term en="Turing degree" zh="Turing 度" />. Muchnik (1956) and Friedberg (1957) independently showed there are degrees strictly between <M t="\varnothing" /> and <M t="\varnothing'" /> — the answer to Post’s problem.</>}
          />
          <P
            zh={<>Kleene 用自然数给递归序数“起名字”：0 是 0 的名字；若 n 是 α 的名字，<M t="2^n" /> 就是 α+1 的名字；若第 e 号程序 <M t="\varphi_e" /> 依次输出一列越来越大的序数的名字，<M t="3\cdot5^e" /> 就是它们上确界的名字。</>}
            en={<>Kleene named recursive ordinals with natural numbers: 0 names 0; if n names α, then <M t="2^n" /> names α+1; if program number e, <M t="\varphi_e" />, lists names of an increasing sequence of ordinals, then <M t="3\cdot5^e" /> names their supremum.</>}
          />
          <P
            zh={<>能这样起名字的序数，恰好是第 8 章的递归序数，它们的上确界是 <M t="\omega_1^{\mathrm{CK}}" />，即第 8 章的 Ω。注意极限处的“基本列”是由程序给出的，依赖于对程序的编号方式。</>}
            en={<>The ordinals with names are exactly Chapter 8’s recursive ordinals, and their supremum is <M t="\omega_1^{\mathrm{CK}}" /> — Chapter 8’s Ω. Note that the fundamental sequences at limits come from programs, so they depend on how programs are numbered.</>}
          />
          <P
            zh={<>判断“n 是不是一个合法名字”，比阶梯上任何一级 <M t="\varnothing^{(k)}" /> 都难得多（Kleene 证明它是 <M t="\Pi^1_1" /> 完全的）。可计算性的世界远比停机问题辽阔。</>}
            en={<>Deciding whether n is a valid name is far harder than any rung <M t="\varnothing^{(k)}" /> (Kleene showed it is <M t="\Pi^1_1" />-complete). The world beyond computability is much wider than the halting problem.</>}
          />
        </Expand>
        <KeyIdea>
          <L
            zh={<>Turing 机把“算法”变成了精确的数学对象。停机问题说：没有算法能预言所有算法。但是，“所有会停的 n 状态机器里，走得最远的那台走了几步”仍然是一个确定的有限数。下一章，我们把这个数变成一个函数——它会超过本课程到目前为止的一切。</>}
            en={<>Turing machines turn “algorithm” into a precise mathematical object. The halting problem says no algorithm predicts all algorithms. Yet “the longest run among the n-state machines that halt” is still a definite finite number. Next chapter we turn it into a function — one that outruns everything in this course so far.</>}
          />
        </KeyIdea>
        <OpenProblem title={{ en: 'The physical Church–Turing thesis', zh: '物理版 Church–Turing 论题' }}>
          <P
            zh={<>自然界里有没有某种物理过程，能算出 Turing 机算不出的函数（比如解决停机问题）？书中列出了多种设想中的“超计算”模型，并总结说：至今看不到造出这种机器的希望。但这并没有被证明。</>}
            en={<>Could some physical process compute a function no Turing machine can — for instance, solve the halting problem? The book surveys many proposed “hypercomputation” models and concludes there is so far no hope of building one. But nobody has proved it impossible.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'The Collatz conjecture is a halting question', zh: 'Collatz 猜想是一个停机问题' }}>
          <P
            zh={<>“从每个 x ≥ 1 出发的 Collatz 序列都会到达 1”等价于：程序“从 x 出发反复做 n ↦ n/2 或 3n+1，直到 1”在每个输入上都停机。这是一个 <M t="\Pi_2" /> 命题，至今未解决。下一章会看到，类似 Collatz 的问题正是决定忙碌海狸数值的拦路虎。</>}
            en={<>“The Collatz sequence from every x ≥ 1 reaches 1” says that the program “repeat n ↦ n/2 or 3n+1 from x until 1” halts on every input — a <M t="\Pi_2" /> statement, still open. The next chapter shows that Collatz-like problems are exactly what blocks us from knowing Busy Beaver values.</>}
          />
        </OpenProblem>
      </Section>
    </>
  )
}
