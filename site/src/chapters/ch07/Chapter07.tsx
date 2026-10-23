import { LimitWorkshop } from '../ch07/LimitWorkshop'
import './ch07.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { FSExplorer, FixedPointMachine, Odometer, TwoRoads, VeblenGrid } from './widgets'
import { EmbeddingChecker, ExhaustiveSearch, TreeGame } from './treeWidgets'

export default function Chapter07() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Ordinals, successor vs limit, supremum, ordinal +, ·, ^ and Cantor normal form; ε₀ = sup{'{'}ω, ω^ω, …{'}'} with ω^ε₀ = ε₀ (Chapter 3).</>, zh: <>序数、后继与极限、上确界、序数的加乘幂与 Cantor 范式；ε₀ = sup{'{'}ω, ω^ω, …{'}'}，且 ω^ε₀ = ε₀（第 3 章）。</> },
          { en: <>No infinite strictly decreasing sequence of ordinals (Chapter 3).</>, zh: <>不存在无穷严格递减的序数列（第 3 章）。</> },
          { en: <>Fundamental sequences α[n], the convention ε₀[n] = ω↑↑n, and the fast-growing hierarchy f_α (Chapter 4).</>, zh: <>基本列 α[n]、约定 ε₀[n] = ω↑↑n，以及快速增长层次 f_α（第 4 章）。</> },
          { en: <>Hydras and the proof-theoretic ordinal PTO; PTO(PA) = ε₀ (Chapter 6).</>, zh: <>九头蛇与证明论序数 PTO；PTO(PA) = ε₀（第 6 章）。</> },
        ]}
      />

      {/* ================================================================ */}
      <Section id="machine" kicker={{ en: 'Round ε₀+1', zh: '第 ε₀+1 回合' }} title={{ en: 'A machine that manufactures infinities', zh: '一台制造无穷的机器' }}>
        <P
          zh={<>第 6 章用 ε₀ 衡量 Goodstein 与九头蛇的增长。决斗需要的仍是有限数：我们要加强的是产生它的配方。本章先造更强的序数索引，再回到树游戏，看看这些索引为什么有用。</>}
          en={<>Chapter 6 used ε₀ to measure Goodstein and hydra growth. The duel still asks for a finite number; what we need to strengthen is its recipe. We will first build stronger ordinal indices, then return to a tree game that gives those indices a purpose.</>}
        />
        <P
          zh={<>真正的一跳要像 <M t="\varepsilon_0" /> 本身那样猛：从 0 出发反复作用 <M t="\alpha\mapsto\omega^\alpha" />，再取上确界。</>}
          en={<>A real leap must be as violent as <M t="\varepsilon_0" /> itself: apply <M t="\alpha\mapsto\omega^\alpha" /> to 0 again and again, then take the supremum.</>}
        />
        <MB t="\begin{gathered}0\mapsto 1\mapsto \omega\mapsto \omega^\omega\mapsto \omega^{\omega^\omega}\mapsto \cdots\\ \varepsilon_0=\sup\{0,1,\omega,\omega^\omega,\ldots\},\quad \omega^{\varepsilon_0}=\varepsilon_0.\end{gathered}" />
        <P
          zh={<>这是一台机器，而且它不挑原料：喂给它任何递增的映射 <M t="f" />，它都会转起来。</>}
          en={<>That is a machine, and it is not picky: feed it any increasing map <M t="f" /> and it will run.</>}
        />
        <H3 en="Three moves: iterate, take the sup, jump out" zh="三个动作：迭代、取上确界、跳出" />
        <B
          zh={
            <ol>
              <li><b>迭代</b>：<M t="\alpha,\ f(\alpha),\ f(f(\alpha)),\ \ldots" /></li>
              <li><b>取上确界</b>：极限 <M t="\lambda" /> 往往满足 <M t="f(\lambda)=\lambda" />，叫做 <M t="f" /> 的<Term en="fixed point" zh="不动点" />。</li>
              <li><b>跳出</b>：在不动点上 <M t="f" /> 原地踏步，那就先 +1，再从头迭代，奔向下一个不动点。</li>
            </ol>
          }
          en={
            <ol>
              <li><b>Iterate</b>: <M t="\alpha,\ f(\alpha),\ f(f(\alpha)),\ \ldots" /></li>
              <li><b>Take the sup</b>: the limit <M t="\lambda" /> often satisfies <M t="f(\lambda)=\lambda" />, a <Term en="fixed point" zh="不动点" /> of <M t="f" />.</li>
              <li><b>Jump out</b>: at a fixed point <M t="f" /> marks time, so add 1 and iterate again, racing to the next fixed point.</li>
            </ol>
          }
        />
        <Widget
          title={{ en: 'The fixed-point machine', zh: '不动点机器' }}
          hint={{ en: 'Pick a map. Every value is computed exactly. Press +1 repeatedly and watch the fixed points line up.', zh: '选一个映射，所有值都由程序精确算出。反复按 +1，看不动点一个个排好队。' }}
        >
          <FixedPointMachine />
        </Widget>
        <P
          zh={<>几个值得记住的结果：<M t="1+\alpha" /> 的第一个不动点是 <M t="\omega" />，<M t="\omega+\alpha" /> 的是 <M t="\omega^2" />，<M t="\omega\cdot\alpha" /> 的第一个非零不动点是 <M t="\omega^\omega" />，<M t="\omega^\alpha" /> 的是 <M t="\varepsilon_0" />。</>}
          en={<>Worth remembering: the first fixed point of <M t="1+\alpha" /> is <M t="\omega" />; of <M t="\omega+\alpha" />, <M t="\omega^2" />; of <M t="\omega\cdot\alpha" /> (first non-zero one), <M t="\omega^\omega" />; of <M t="\omega^\alpha" />, <M t="\varepsilon_0" />.</>}
        />
        <P
          zh={<>在机器里试试 <M t="\omega\cdot\alpha" /> 换个起点，比如 <M t="\omega^3\cdot3+\omega" />：迭代仍然停在 <M t="\omega^\omega" />。起点无关紧要，只要它在第一个不动点之下。</>}
          en={<>Try <M t="\omega\cdot\alpha" /> from another start, say <M t="\omega^3\cdot3+\omega" />: the iteration still lands on <M t="\omega^\omega" />. The start does not matter, as long as it is below the first fixed point.</>}
        />
        <Quiz
          q={{
            zh: <p>映射 <M t="\alpha\mapsto1+\alpha" /> 的第一个不动点是 <M t="\omega" />。现在 +1 跳出，从 <M t="\omega+1" /> 出发继续迭代。要迭代多少次才能到达下一个不动点？</p>,
            en: <p>The first fixed point of <M t="\alpha\mapsto1+\alpha" /> is <M t="\omega" />. Now jump out with +1 and iterate from <M t="\omega+1" />. How many iterations until the next fixed point?</p>,
          }}
          options={[
            { zh: <p>无穷多次，极限是 <M t="\omega\cdot2" /></p>, en: <p>Infinitely many; the limit is <M t="\omega\cdot2" /></p> },
            { zh: <p>零次：<M t="\omega+1" /> 本身就是不动点</p>, en: <p>Zero: <M t="\omega+1" /> is already a fixed point</p> },
            { zh: <p>再也没有不动点了</p>, en: <p>There is no further fixed point</p> },
          ]}
          answer={1}
          explain={{
            zh: <p><M t="1+(\omega+1)=(1+\omega)+1=\omega+1" />。左边加的 1 被 <M t="\omega" /> 吞掉了，所以每个 <M t="\alpha\ge\omega" /> 都是不动点，第 β 个（从 0 数起）就是 <M t="\omega+\beta" />。这台机器的“跳出”有时一步都不用走。</p>,
            en: <p><M t="1+(\omega+1)=(1+\omega)+1=\omega+1" />. The 1 added on the left is swallowed by <M t="\omega" />, so every <M t="\alpha\ge\omega" /> is a fixed point, and number β (from 0) is <M t="\omega+\beta" />. Sometimes “jumping out” lands you on the next fixed point immediately.</p>,
          }}
        />
        <H3 en="When the sup is not a fixed point" zh="上确界不一定是不动点" />
        <P
          zh={<>机器并不总灵。<M t="\alpha\mapsto\alpha+1" /> 根本没有不动点。<M t="\alpha\mapsto\alpha+\omega" /> 从 0 迭代得 <M t="0,\omega,\omega\cdot2,\ldots" />，极限 <M t="\omega^2" />；可 <M t="\omega^2+\omega\ne\omega^2" />。</>}
          en={<>The machine does not always work. <M t="\alpha\mapsto\alpha+1" /> has no fixed point at all. <M t="\alpha\mapsto\alpha+\omega" /> iterated from 0 gives <M t="0,\omega,\omega\cdot2,\ldots" /> with limit <M t="\omega^2" />, but <M t="\omega^2+\omega\ne\omega^2" />.</>}
        />
        <P
          zh={<>毛病出在极限处：<M t="\alpha+\omega" /> 在 <M t="\omega^2" /> 处的值，并不是它在 <M t="\omega^2" /> 之下取值的上确界。它在极限处“跳”了一下。下一节把这个条件说清楚。</>}
          en={<>The trouble is at the limit: the value of <M t="\alpha+\omega" /> at <M t="\omega^2" /> is not the sup of its values below <M t="\omega^2" />. The map “jumps” at limits. The next section pins this condition down.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="normal" kicker={{ en: 'The engine', zh: '发动机' }} title={{ en: 'Normal functions and Veblen’s theorem', zh: '正规函数与 Veblen 定理' }}>
        <Thm kind="definition" name={{ en: 'normal function', zh: '正规函数' }}>
          <B
            zh={<p>从序数到序数的映射 <M t="f" /> 叫做<Term en="normal function" zh="正规函数" />，如果 (1) 严格递增：<M t="\alpha<\beta\Rightarrow f(\alpha)<f(\beta)" />；(2) 连续：对每个极限序数 <M t="\lambda" />，<M t="f(\lambda)=\sup_{\alpha<\lambda}f(\alpha)" />。</p>}
            en={<p>A map <M t="f" /> from ordinals to ordinals is a <Term en="normal function" zh="正规函数" /> if (1) it is strictly increasing, <M t="\alpha<\beta\Rightarrow f(\alpha)<f(\beta)" />, and (2) it is continuous: <M t="f(\lambda)=\sup_{\alpha<\lambda}f(\alpha)" /> for every limit <M t="\lambda" />.</p>}
          />
        </Thm>
        <P
          zh={<><M t="\omega^\alpha" />、<M t="\omega+\alpha" />、<M t="\omega\cdot\alpha" /> 都是正规的（第 3 章的极限情形就是连续性）。<M t="\alpha+1" /> 和 <M t="\alpha+\omega" /> 不连续：在 <M t="\omega" /> 处，<M t="\omega+1\ne\sup_n(n+1)=\omega" />。</>}
          en={<><M t="\omega^\alpha" />, <M t="\omega+\alpha" /> and <M t="\omega\cdot\alpha" /> are normal (the limit clauses of Chapter 3 are exactly continuity). <M t="\alpha+1" /> and <M t="\alpha+\omega" /> are not continuous: at <M t="\omega" />, <M t="\omega+1\ne\sup_n(n+1)=\omega" />.</>}
        />
        <Thm kind="lemma" name={{ en: 'increasing maps never go down', zh: '递增映射不会往下走' }}>
          <B zh={<p>若 <M t="f" /> 严格递增，则对一切 <M t="\alpha" />，<M t="f(\alpha)\ge\alpha" />。</p>} en={<p>If <M t="f" /> is strictly increasing, then <M t="f(\alpha)\ge\alpha" /> for every <M t="\alpha" />.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>否则取最小的反例 <M t="\alpha" />，即 <M t="\beta=f(\alpha)<\alpha" />。由递增，<M t="f(\beta)<f(\alpha)=\beta" />，于是 <M t="\beta" /> 是更小的反例，矛盾。这里用的正是良序：任何非空的序数集合都有最小元。</>}
            en={<>Otherwise take the least counterexample <M t="\alpha" />, so <M t="\beta=f(\alpha)<\alpha" />. Monotonicity gives <M t="f(\beta)<f(\alpha)=\beta" />, so <M t="\beta" /> is a smaller counterexample. Contradiction. The proof uses well-ordering: every non-empty set of ordinals has a least element.</>}
          />
        </Proof>
        <Thm name={{ en: 'Veblen’s fixed-point theorem (1908)', zh: 'Veblen 不动点定理（1908）' }}>
          <B
            zh={<p>正规函数 <M t="f" /> 有任意大的不动点：对每个 <M t="\beta" />，<M t="\sup\{\beta,f(\beta),f(f(\beta)),\ldots\}" /> 是 <M t="\ge\beta" /> 的最小不动点。而且它的不动点按大小排起来，又构成一个正规函数 <M t="f'" />（叫 <M t="f" /> 的<Term en="derivative" zh="导出函数" />）。</p>}
            en={<p>A normal function <M t="f" /> has arbitrarily large fixed points: for every <M t="\beta" />, <M t="\sup\{\beta,f(\beta),f(f(\beta)),\ldots\}" /> is the least fixed point <M t="\ge\beta" />. Moreover, its fixed points, listed in increasing order, form a normal function <M t="f'" />, the <Term en="derivative" zh="导出函数" /> of <M t="f" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>令 <M t="\beta_0=\beta,\ \beta_{k+1}=f(\beta_k)" />。由引理这列不降。若某处 <M t="\beta_{k+1}=\beta_k" />，那就是不动点。否则它严格递增，极限 <M t="\lambda" /> 是极限序数，由连续性 <M t="f(\lambda)=\sup_{\alpha<\lambda}f(\alpha)=\sup_k f(\beta_k)=\sup_k\beta_{k+1}=\lambda" />（中间一步因为 <M t="\beta_k" /> 在 <M t="\lambda" /> 中共尾）。任何 <M t="\ge\beta" /> 的不动点 <M t="\gamma" /> 都满足 <M t="\beta_k\le\gamma" />（归纳），所以 <M t="\lambda" /> 最小。</>}
            en={<>Let <M t="\beta_0=\beta,\ \beta_{k+1}=f(\beta_k)" />. By the lemma this never decreases. If <M t="\beta_{k+1}=\beta_k" /> somewhere, that is a fixed point. Otherwise it strictly increases to a limit <M t="\lambda" />, and continuity gives <M t="f(\lambda)=\sup_{\alpha<\lambda}f(\alpha)=\sup_k f(\beta_k)=\sup_k\beta_{k+1}=\lambda" /> (the middle step because the <M t="\beta_k" /> are cofinal in <M t="\lambda" />). Every fixed point <M t="\gamma\ge\beta" /> satisfies <M t="\beta_k\le\gamma" /> by induction, so <M t="\lambda" /> is the least.</>}
          />
        </Proof>
        <Expand kind="proof" title={{ en: 'Why the list of fixed points is again normal', zh: '为什么不动点的列表还是正规函数' }}>
          <P
            zh={<>不动点无界（定理前半），所以可以按大小给它们编号：<M t="f'(0)<f'(1)<\cdots" />，对每个序数都有下一个。严格递增是编号方式自带的。</>}
            en={<>The fixed points are unbounded (first half of the theorem), so they can be listed in increasing order, <M t="f'(0)<f'(1)<\cdots" />, with a next one after any ordinal. Strict monotonicity is built into the listing.</>}
          />
          <P
            zh={<>连续性：设 <M t="\lambda" /> 为极限，<M t="\mu=\sup_{\alpha<\lambda}f'(\alpha)" />。这些 <M t="f'(\alpha)" /> 在 <M t="\mu" /> 中共尾，所以 <M t="f(\mu)=\sup_{\alpha<\lambda} f(f'(\alpha))=\sup_{\alpha<\lambda}f'(\alpha)=\mu" />，即 <M t="\mu" /> 是不动点。它又是排在所有 <M t="f'(\alpha)\ (\alpha<\lambda)" /> 之后的第一个，所以 <M t="f'(\lambda)=\mu" />。</>}
            en={<>Continuity: for a limit <M t="\lambda" /> put <M t="\mu=\sup_{\alpha<\lambda}f'(\alpha)" />. The <M t="f'(\alpha)" /> are cofinal in <M t="\mu" />, so <M t="f(\mu)=\sup_{\alpha<\lambda} f(f'(\alpha))=\sup_{\alpha<\lambda}f'(\alpha)=\mu" />: <M t="\mu" /> is a fixed point, and the first one after all <M t="f'(\alpha),\ \alpha<\lambda" />. Hence <M t="f'(\lambda)=\mu" />.</>}
          />
          <P
            zh={<>（没有连续性，这个论证就垮了：不动点的上确界未必还是不动点。这正是连续性不可少的原因。）</>}
            en={<>(Without continuity this argument collapses: the sup of fixed points need not be a fixed point. That is exactly why continuity cannot be dropped.)</>}
          />
        </Expand>
        <KeyIdea>
          <L
            zh={<>这就是永动机：正规函数 <M t="f" /> ⟹ 不动点列表 <M t="f'" /> 也正规 ⟹ <M t="f''" /> 也正规 ⟹ …… 每做一次“求导”，就得到一个强大得多的函数。本章剩下的部分，就是把这台永动机开到尽头。</>}
            en={<>This is a perpetual-motion machine: <M t="f" /> normal ⟹ its list of fixed points <M t="f'" /> is normal ⟹ <M t="f''" /> is normal ⟹ … Each “derivative” is a vastly stronger function. The rest of this chapter runs this machine to exhaustion.</>}
          />
        </KeyIdea>
        <Expand kind="detail" title={{ en: 'Counting fixed points: “(1+β)-th” vs “number β”', zh: '不动点怎么数：“第 1+β 个”与“第 β 号”' }}>
          <P
            zh={<>《大数理论》说 <M t="\varepsilon_\beta" /> 是“第 <M t="1+\beta" /> 个不动点”，因为它从 1 开始数：<M t="\varepsilon_0" /> 是第 1 个。本课程的自然数从 0 开始，于是可以更简单地说：<M t="\varepsilon_\beta" /> 是 <b>第 β 号</b>不动点（从 0 号数起）。两种说法完全一致；对无穷的 <M t="\beta" /> 还有 <M t="1+\beta=\beta" />。</>}
            en={<>《大数理论》 calls <M t="\varepsilon_\beta" /> the “(1+β)-th fixed point”, counting from 1 (so <M t="\varepsilon_0" /> is the 1st). This course counts from 0, so we can simply say <M t="\varepsilon_\beta" /> is fixed point <b>number β</b>. The two phrasings agree; for infinite <M t="\beta" />, <M t="1+\beta=\beta" /> anyway.</>}
          />
        </Expand>
        <Expand kind="deeper" title={{ en: 'Oswald Veblen', zh: 'Oswald Veblen 其人' }}>
          <P
            zh={<>Oswald Veblen（1880–1960）主要是几何学家和拓扑学家，也是经济学家 Thorstein Veblen（“炫耀性消费”一词的提出者）的侄子。1908 年他在论文《有限与超限序数的连续递增函数》中引入了这套不动点层级。后来他成为普林斯顿高等研究院的第一位教授，并为研究院招揽了第一批数学家。</>}
            en={<>Oswald Veblen (1880–1960) was mainly a geometer and topologist, and a nephew of the economist Thorstein Veblen (who coined “conspicuous consumption”). His 1908 paper “Continuous increasing functions of finite and transfinite ordinals” introduced this hierarchy of fixed points. He later became the first professor of the Institute for Advanced Study in Princeton and helped recruit its first mathematicians.</>}
          />
        </Expand>
      </Section>

      {/* ================================================================ */}
      <Section id="epsilon" kicker={{ en: 'Round ζ₀', zh: '第 ζ₀ 回合' }} title={{ en: 'ε, ζ, η: deriving again and again', zh: 'ε、ζ、η：一遍又一遍地求导' }}>
        <P
          zh={<>先对 <M t="\alpha\mapsto\omega^\alpha" /> 求导。它的不动点叫 <Term en="epsilon numbers" zh="ε 数" />，第 β 号记作 <M t="\varepsilon_\beta" />。头一个就是老朋友 <M t="\varepsilon_0" />。</>}
          en={<>First, differentiate <M t="\alpha\mapsto\omega^\alpha" />. Its fixed points are the <Term en="epsilon numbers" zh="ε 数" />; number β is written <M t="\varepsilon_\beta" />. The first is our old friend <M t="\varepsilon_0" />.</>}
        />
        <MB t="\begin{gathered}\varepsilon_1=\sup\{\varepsilon_0+1,\ \omega^{\varepsilon_0+1},\ \omega^{\omega^{\varepsilon_0+1}},\ \ldots\},\\ \varepsilon_\omega=\sup\{\varepsilon_0,\varepsilon_1,\varepsilon_2,\ldots\}.\end{gathered}" />
        <P
          zh={<>注意 <M t="\varepsilon_1" /> 的爬法：跳出 <M t="\varepsilon_0" /> 后再造一座 ω 的塔，只不过塔顶放的是 <M t="\varepsilon_0+1" />。</>}
          en={<>Look at how <M t="\varepsilon_1" /> climbs: after jumping out of <M t="\varepsilon_0" />, build another tower of ω's, this time with <M t="\varepsilon_0+1" /> on top.</>}
        />
        <H3 en="Two roads to ε₁" zh="通往 ε₁ 的两条路" />
        <P
          zh={<>也可以只用 <M t="\varepsilon_0" /> 本身搭塔：<M t="\varepsilon_0,\ \varepsilon_0^{\varepsilon_0},\ \varepsilon_0^{\varepsilon_0^{\varepsilon_0}},\ldots" />。它的极限也是 <M t="\varepsilon_1" /> 吗？看两列数按大小交错排开：</>}
          en={<>One can also build the tower out of <M t="\varepsilon_0" /> alone: <M t="\varepsilon_0,\ \varepsilon_0^{\varepsilon_0},\ \varepsilon_0^{\varepsilon_0^{\varepsilon_0}},\ldots" />. Is its limit also <M t="\varepsilon_1" />? Watch the two sequences interleave by size:</>}
        />
        <Widget title={{ en: 'Two roads to ε₁', zh: '通往 ε₁ 的两条路' }}>
          <TwoRoads />
        </Widget>
        <P
          zh={<>交错意味着同一个极限：每一项都被另一列后面的某项超过。可是作为基本列，两者在快速增长层次 <M t="f_\alpha" /> 里表现不同。书里因此专门提醒：精细比较时，<b>基本列的选择会影响结果</b>，但不影响序数本身。</>}
          en={<>Interleaving means the same limit: each term is beaten by a later term of the other road. Yet as fundamental sequences they behave differently inside the fast-growing hierarchy <M t="f_\alpha" />. Hence the book’s warning: in fine comparisons <b>the choice of fundamental sequence matters</b>, though the ordinal does not change.</>}
        />
        <H3 en="The map α ↦ ε_α, and ζ₀" zh="映射 α ↦ ε_α，与 ζ₀" />
        <P
          zh={<>下标可以是任何序数：<M t="\varepsilon_{\varepsilon_0},\ \varepsilon_{\varepsilon_{\varepsilon_0}},\ldots" />。这串数本身就是在迭代映射 <M t="\alpha\mapsto\varepsilon_\alpha" />——一个新的正规函数。</>}
          en={<>Subscripts can be any ordinal: <M t="\varepsilon_{\varepsilon_0},\ \varepsilon_{\varepsilon_{\varepsilon_0}},\ldots" />. That list is just iteration of the map <M t="\alpha\mapsto\varepsilon_\alpha" />, a new normal function.</>}
        />
        <H3 en="Let ε become its own index" zh="让 ε 的输出成为下标" />
        <Widget title={{ en: "ζ₀: feed the output into the subscript", zh: "ζ₀：把输出放回下标" }}><LimitWorkshop kind="zeta" /></Widget>
        <H3 en="An ε-number equal to its index" zh="下标等于自身的 ε 数" />
        <P
          zh={<><M t="\zeta_0" /> 是一个“下标等于自己”的 ε 数。它的不动点列表记作 <M t="\zeta_\beta" />；再对 <M t="\alpha\mapsto\zeta_\alpha" /> 求导得 <M t="\eta_\beta" />。在不动点机器里选 <M t="\varepsilon_\alpha" /> 或 <M t="\zeta_\alpha" /> 就能看到它们。</>}
          en={<><M t="\zeta_0" /> is an ε-number equal to its own subscript. Its fixed points are listed as <M t="\zeta_\beta" />; differentiating <M t="\alpha\mapsto\zeta_\alpha" /> gives <M t="\eta_\beta" />. Choose <M t="\varepsilon_\alpha" /> or <M t="\zeta_\alpha" /> in the fixed-point machine of Section 1 to watch them appear.</>}
        />
        <H3 en="Repeat the move one level higher" zh="再升一层，重复同一招" />
        <Widget title={{ en: 'η₀: repeat the same construction with ζ', zh: 'η₀：对 ζ 重复同样的构造' }}><LimitWorkshop kind="eta" /></Widget>
        <H3 en="Keep the names distinct" zh="分清这些名字" />
        <Caution>
          <L
            zh={<>名字冲突：本课程（和大数圈）里 <M t="\eta_0" /> 是 ζ 的第一个不动点；一些证明论文献却用 <M t="\eta_0" /> 表示第 8 章的 Bachmann–Howard 序数。读文献时要看清。</>}
            en={<>Name clash: in this course (and in googology) <M t="\eta_0" /> is the first fixed point of ζ; some proof-theory texts use <M t="\eta_0" /> for the Bachmann–Howard ordinal of Chapter 8. Check which one a source means.</>}
          />
        </Caution>
        <P
          zh={<>ε、ζ、η……希腊字母很快就会用完。正确的做法是：<b>把“第几次求导”本身也变成一个变量</b>。</>}
          en={<>ε, ζ, η, … we will run out of Greek letters soon. The right move: <b>make “how many times we differentiated” a variable too</b>.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="veblen" kicker={{ en: 'Labelling the levels', zh: '给层级编号' }} title={{ en: 'The binary Veblen function φ(α, β)', zh: '二元 Veblen 函数 φ(α, β)' }}>
        <Thm kind="definition" name={{ en: 'binary Veblen function', zh: '二元 Veblen 函数' }}>
          <B
            zh={<p><M t="\varphi(0,\beta)=\omega^\beta" />；当 <M t="\alpha>0" />，<M t="\varphi(\alpha,\beta)" /> 是“对一切 <M t="\gamma<\alpha" /> 都是 <M t="\varphi(\gamma,\cdot)" /> 的不动点”的序数中的第 <M t="\beta" /> 号（从 0 数起）。</p>}
            en={<p><M t="\varphi(0,\beta)=\omega^\beta" />. For <M t="\alpha>0" />, <M t="\varphi(\alpha,\beta)" /> is number <M t="\beta" /> (from 0) among the ordinals that are fixed points of <M t="\varphi(\gamma,\cdot)" /> for every <M t="\gamma<\alpha" />.</p>}
          />
        </Thm>
        <P
          zh={<>于是 <M t="\varphi(1,\beta)=\varepsilon_\beta" />，<M t="\varphi(2,\beta)=\zeta_\beta" />，<M t="\varphi(3,\beta)=\eta_\beta" />。后继层 <M t="\alpha+1" /> 就是对第 <M t="\alpha" /> 层求导；极限层（如 <M t="\alpha=\omega" />）则取前面所有层的<b>共同</b>不动点。</>}
          en={<>So <M t="\varphi(1,\beta)=\varepsilon_\beta" />, <M t="\varphi(2,\beta)=\zeta_\beta" />, <M t="\varphi(3,\beta)=\eta_\beta" />. A successor level <M t="\alpha+1" /> is the derivative of level <M t="\alpha" />; a limit level such as <M t="\omega" /> takes fixed points <b>common</b> to all earlier levels.</>}
        />
        <MB t="\begin{aligned}\varphi(\omega,0)&=\sup\{\varphi(0,0),\varphi(1,0),\ldots\}\\&=\sup\{1,\varepsilon_0,\zeta_0,\eta_0,\ldots\}.\end{aligned}" />
        <Thm name={{ en: 'every row is normal', zh: '每一行都是正规函数' }}>
          <B
            zh={<p>对每个 <M t="\alpha" />，<M t="\beta\mapsto\varphi(\alpha,\beta)" /> 是正规函数。所以定义中的“第 β 号”总存在。</p>}
            en={<p>For every <M t="\alpha" />, <M t="\beta\mapsto\varphi(\alpha,\beta)" /> is a normal function. In particular “number β” in the definition always exists.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>对 <M t="\alpha" /> 超限归纳。<M t="\alpha=0" />：<M t="\omega^\beta" /> 正规。后继：<M t="\varphi(\alpha+1,\cdot)" /> 是正规函数 <M t="\varphi(\alpha,\cdot)" /> 的导出函数，由 Veblen 定理正规。极限情形见紧接着的展开面板。</>}
            en={<>Transfinite induction on <M t="\alpha" />. For <M t="\alpha=0" />, <M t="\omega^\beta" /> is normal. Successor: <M t="\varphi(\alpha+1,\cdot)" /> is the derivative of the normal <M t="\varphi(\alpha,\cdot)" />, normal by Veblen’s theorem. The limit case is in the next panel.</>}
          />
        </Proof>
        <Expand kind="proof" title={{ en: 'The limit case: common fixed points exist', zh: '极限情形：共同不动点存在' }}>
          <P
            zh={<>设 <M t="\alpha" /> 为极限，基本列 <M t="\alpha[0]<\alpha[1]<\cdots" />。给定 <M t="\beta" />，令 <M t="\beta_0=\beta+1" />，<M t="\beta_{k+1}=\varphi(\alpha[k],\beta_k)" />，<M t="\lambda=\sup_k\beta_k" />。</>}
            en={<>Let <M t="\alpha" /> be a limit with fundamental sequence <M t="\alpha[0]<\alpha[1]<\cdots" />. Given <M t="\beta" />, set <M t="\beta_0=\beta+1" />, <M t="\beta_{k+1}=\varphi(\alpha[k],\beta_k)" />, and <M t="\lambda=\sup_k\beta_k" />.</>}
          />
          <P
            zh={<>任取 <M t="\gamma<\alpha" />，当 <M t="k" /> 足够大时 <M t="\gamma<\alpha[k]" />，此时 <M t="\beta_{k+1}" /> 是 <M t="\varphi(\alpha[k],\cdot)" /> 的值，按定义是 <M t="\varphi(\gamma,\cdot)" /> 的不动点。由 <M t="\varphi(\gamma,\cdot)" /> 的连续性，<M t="\varphi(\gamma,\lambda)=\sup_k\varphi(\gamma,\beta_{k+1})=\lambda" />。</>}
            en={<>Take any <M t="\gamma<\alpha" />. For large <M t="k" />, <M t="\gamma<\alpha[k]" />, so <M t="\beta_{k+1}" /> is a value of <M t="\varphi(\alpha[k],\cdot)" /> and hence, by definition, a fixed point of <M t="\varphi(\gamma,\cdot)" />. By continuity of <M t="\varphi(\gamma,\cdot)" />, <M t="\varphi(\gamma,\lambda)=\sup_k\varphi(\gamma,\beta_{k+1})=\lambda" />.</>}
          />
          <P
            zh={<>所以 <M t="\lambda>\beta" /> 是共同不动点：共同不动点无界。它们的上确界仍是共同不动点（每个 <M t="\varphi(\gamma,\cdot)" /> 都连续），于是和 Veblen 定理第二部分一样，它们的列表正规。</>}
            en={<>So <M t="\lambda>\beta" /> is a common fixed point: common fixed points are unbounded. Sups of common fixed points are again common fixed points (each <M t="\varphi(\gamma,\cdot)" /> is continuous), so, exactly as in the second half of Veblen’s theorem, their list is normal.</>}
          />
        </Expand>
        <H3 en="The φ table" zh="φ 表" />
        <Widget title={{ en: 'The Veblen table', zh: 'Veblen 表' }} hint={{ en: 'Row α, column β. Each row lists the common fixed points of the rows above. Click a cell; pink = absorbed (β is already a fixed point).', zh: '行是层级 α，列是编号 β，每行列出上面各行的共同不动点。点任一格查看；粉色 = β 已是不动点，被原样吸收。' }}>
          <VeblenGrid />
        </Widget>
        <P
          zh={<>粉色格子很说明问题：<M t="\varphi(1,\zeta_0)=\zeta_0" />，因为 <M t="\zeta_0" /> 早已是 ε 的不动点。可 <M t="\varphi(2,\zeta_0)=\zeta_{\zeta_0}" /> 就是新东西了。</>}
          en={<>The pink cells tell a story: <M t="\varphi(1,\zeta_0)=\zeta_0" />, because <M t="\zeta_0" /> is already a fixed point of ε. But <M t="\varphi(2,\zeta_0)=\zeta_{\zeta_0}" /> is new.</>}
        />
        <Thm kind="fact" name={{ en: 'Veblen normal form', zh: 'Veblen 标准形式' }} status="proved">
          <B
            zh={<p>在 Γ₀（第一个满足 <M t="\varphi(\alpha,0)=\alpha" /> 的 α，见第 5 节）以下，每个非零序数都唯一地写成 <M t="\varphi(\alpha_1,\beta_1)+\cdots+\varphi(\alpha_k,\beta_k)" />，各项从大到小排，且每项满足 <M t="\alpha_i,\beta_i<\varphi(\alpha_i,\beta_i)" />。这推广了第 3 章的 Cantor 范式（书中定义 4.14）。</p>}
            en={<p>Below Γ₀ (the first α with <M t="\varphi(\alpha,0)=\alpha" />; Section 5), every non-zero ordinal is uniquely <M t="\varphi(\alpha_1,\beta_1)+\cdots+\varphi(\alpha_k,\beta_k)" /> with non-increasing terms and <M t="\alpha_i,\beta_i<\varphi(\alpha_i,\beta_i)" /> for each term. This extends Chapter 3’s Cantor normal form (the book’s Def 4.14).</p>}
          />
        </Thm>
        <Expand kind="detail" title={{ en: 'How to compare two φ-terms', zh: '怎样比较两个 φ 项' }}>
          <P
            zh={<>对标准形式的 <M t="\varphi(\alpha,\beta)" /> 与 <M t="\varphi(\gamma,\delta)" />：若 <M t="\alpha=\gamma" />，比 <M t="\beta,\delta" />；若 <M t="\alpha<\gamma" />，前者更小当且仅当 <M t="\beta<\varphi(\gamma,\delta)" />；若 <M t="\alpha>\gamma" />，前者更小当且仅当 <M t="\varphi(\alpha,\beta)\le\delta" />。和式按项逐个比。本章所有挂件都用这条规则精确比较序数。</>}
            en={<>For normal-form terms <M t="\varphi(\alpha,\beta)" /> and <M t="\varphi(\gamma,\delta)" />: if <M t="\alpha=\gamma" />, compare <M t="\beta,\delta" />; if <M t="\alpha<\gamma" />, the first is smaller iff <M t="\beta<\varphi(\gamma,\delta)" />; if <M t="\alpha>\gamma" />, the first is smaller iff <M t="\varphi(\alpha,\beta)\le\delta" />. Sums compare term by term. Every widget in this chapter compares ordinals exactly by this rule.</>}
          />
        </Expand>
        <Quiz
          q={{
            zh: <p>记 <M t="\Phi=\varphi(\omega,0)" />。哪个更大：<M t="\varphi(\omega,\Phi+1)" />，还是 <M t="\sup_n\varphi(n,\Phi+1)" />？</p>,
            en: <p>Write <M t="\Phi=\varphi(\omega,0)" />. Which is bigger: <M t="\varphi(\omega,\Phi+1)" /> or <M t="\sup_n\varphi(n,\Phi+1)" />?</p>,
          }}
          options={[
            { zh: <p>一样大，极限层就是对 n 取上确界</p>, en: <p>Equal — a limit level is just the sup over n</p> },
            { zh: <p><M t="\varphi(\omega,\Phi+1)" /> 大得多</p>, en: <p><M t="\varphi(\omega,\Phi+1)" /> is far bigger</p> },
            { zh: <p><M t="\sup_n\varphi(n,\Phi+1)" /> 更大</p>, en: <p><M t="\sup_n\varphi(n,\Phi+1)" /> is bigger</p> },
          ]}
          answer={1}
          explain={{
            zh: <p><M t="\sup_n\varphi(n,\Phi+1)" /> 是 <M t="\Phi" /> 之后的<b>下一个</b>共同不动点，即 <M t="\varphi(\omega,1)" />。而 <M t="\varphi(\omega,\Phi+1)" /> 是第 <M t="\Phi+1" /> 号共同不动点，远在后面。书中特别标出了这个陷阱（式 4.240）。</p>,
            en: <p><M t="\sup_n\varphi(n,\Phi+1)" /> is the <b>next</b> common fixed point after <M t="\Phi" />, namely <M t="\varphi(\omega,1)" />. But <M t="\varphi(\omega,\Phi+1)" /> is common fixed point number <M t="\Phi+1" />, far beyond. The book flags this exact trap (eq. 4.240).</p>,
          }}
        />
        <H3 en="Fundamental sequences for φ" zh="φ 的基本列" />
        <P
          zh={<>要把 φ 接上快速增长层次 <M t="f_\alpha" />，每个极限都需要一条基本列 <M t="\alpha[n]" />。规则只有一个思路：<b>把“不动点”拆回到“迭代”</b>。</>}
          en={<>To plug φ into the fast-growing hierarchy <M t="f_\alpha" />, every limit needs a fundamental sequence <M t="\alpha[n]" />. One idea drives every rule: <b>unpack “fixed point” back into “iterate”</b>.</>}
        />
        <MB t="\zeta_0[n]:\ \varepsilon_0,\ \varepsilon_{\varepsilon_0},\ \varepsilon_{\varepsilon_{\varepsilon_0}},\ldots" />
        <MB t="\varphi(\omega,1)[n]=\varphi(n,\varphi(\omega,0)+1)." />
        <Expand kind="detail" title={{ en: 'The full rules (《大数理论》 Def 4.15) and our indexing', zh: '完整规则（《大数理论》定义 4.15）与本课程的编号' }}>
          <B
            zh={<p>书中定义 4.15，逐条照录（<M t="\alpha,\beta" /> 均为标准形式）：</p>}
            en={<p>The book’s Def 4.15, rule by rule (with <M t="\alpha,\beta" /> in normal form):</p>}
          />
          <MB t="\begin{aligned}&(1)\ (\varphi(\alpha_1,\beta_1)+\cdots+\varphi(\alpha_k,\beta_k))[n]=\varphi(\alpha_1,\beta_1)+\cdots+\varphi(\alpha_k,\beta_k)[n]\\&(2)\ \varphi(0,\alpha)[n]=\varphi(0,\alpha[n])\ (\alpha\text{ limit}),\quad \varphi(0,\beta+1)[n]=\varphi(0,\beta)\cdot n\\&(3)\ \varphi(\alpha+1,0)[0]=0\\&(4)\ \varphi(\alpha+1,0)[n+1]=\varphi(\alpha,\varphi(\alpha+1,0)[n])\\&(5)\ \varphi(\alpha+1,\beta+1)[0]=\varphi(\alpha+1,\beta)+1\\&(6)\ \varphi(\alpha+1,\beta+1)[n+1]=\varphi(\alpha,\varphi(\alpha+1,\beta+1)[n])\\&(7)\ \varphi(\alpha,0)[n]=\varphi(\alpha[n],0)\ (\alpha\text{ limit})\\&(8)\ \varphi(\alpha,\beta+1)[n]=\varphi(\alpha[n],\varphi(\alpha,\beta)+1)\ (\alpha\text{ limit})\\&(9)\ \varphi(\alpha,\beta)[n]=\varphi(\alpha,\beta[n])\ (\beta\text{ limit})\end{aligned}" />
          <P
            zh={<>本课程的唯一改动：规则 (3)(4) 产生的首项 0 是平凡的，我们去掉它，即 <M t="\varphi(\alpha+1,0)[n]" /> 取书中的第 <M t="n+1" /> 项。这样 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />（<M t="\varepsilon_0[0]=1" />），与第 4 章的约定一致。平移一项不改变任何增长率。</>}
            en={<>The only change in this course: the leading 0 produced by rules (3)–(4) is trivial, so we drop it, taking the book’s term <M t="n+1" /> as our <M t="\varphi(\alpha+1,0)[n]" />. Then <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" /> (<M t="\varepsilon_0[0]=1" />), matching Chapter 4. A shift by one term changes no growth rate.</>}
          />
          <P
            zh={<>代入时如果出现非标准写法，要先化简：例如 <M t="\omega^{\varepsilon_0+1}[1]=\varphi(0,\varepsilon_0)=\varepsilon_0" />。挂件中的引擎每一步都会自动化简。</>}
            en={<>Substitution can produce non-normal expressions, which must be simplified: e.g. <M t="\omega^{\varepsilon_0+1}[1]=\varphi(0,\varepsilon_0)=\varepsilon_0" />. The engine in the widgets simplifies at every step.</>}
          />
        </Expand>
        <H3 en="Under the microscope" zh="放到显微镜下" />
        <Widget
          title={{ en: 'Fundamental-sequence microscope', zh: '基本列显微镜' }}
          hint={{ en: 'Load an ordinal (syntax in the input box) and click a term to zoom in. The countdown replaces α by α[n], or α−1.', zh: '载入一个序数（语法见输入框），点某一项放大。倒数会把 α 换成 α[n]，后继则减一。' }}
        >
          <FSExplorer />
        </Widget>
        <P
          zh={<>试试倒数：用 <M t="n=1" />，连 <M t="\Gamma_0" /> 都几步就归零；换成 <M t="n=2" />，<M t="\zeta_0" /> 走了上万步还在半空。两者都必然到达 0——第 3 章定理保证没有无穷递降——但“必然”和“很快”是两回事。</>}
          en={<>Try the countdown. With <M t="n=1" /> even <M t="\Gamma_0" /> hits zero in a few steps; with <M t="n=2" />, <M t="\zeta_0" /> is still in mid-air after tens of thousands. Both must reach 0 — Chapter 3’s theorem forbids infinite descent — but “must” and “soon” are different things.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="gamma" kicker={{ en: 'Round Γ₀', zh: '第 Γ₀ 回合' }} title={{ en: 'Γ₀: the ordinal that names itself', zh: 'Γ₀：给自己命名的序数' }}>
        <P
          zh={<>φ 的第二个变量我们已经玩透了。现在让<b>第一个</b>变量也迭代起来：</>}
          en={<>We have squeezed the second argument of φ dry. Now iterate the <b>first</b> one:</>}
        />
        <Widget title={{ en: "Γ₀: feed the output into the row number", zh: "Γ₀：把输出放回层级号" }}><LimitWorkshop kind="gamma" /></Widget>
        <H3 en="The boundary of binary Veblen notation" zh="二元 Veblen 记号的边界" />
        <P
          zh={<><M t="\Gamma_0" /> 是映射 <M t="\alpha\mapsto\varphi(\alpha,0)" /> 的第一个不动点：<M t="\varphi(\Gamma_0,0)=\Gamma_0" />。它是“层级号等于自身”的序数。</>}
          en={<><M t="\Gamma_0" /> is the first fixed point of <M t="\alpha\mapsto\varphi(\alpha,0)" />: <M t="\varphi(\Gamma_0,0)=\Gamma_0" />. It is the ordinal whose level number equals itself.</>}
        />
        <P
          zh={<>后果很致命：Γ₀ 以下的每个序数都能用 0、加法和 φ 从更小的零件拼出来（第 4 节的 Veblen 标准形式），而 Γ₀ 本身拼不出来——要拼它，你得先有它。二元 φ 走到了尽头。</>}
          en={<>The consequence is fatal: every ordinal below Γ₀ is assembled from 0, + and φ out of smaller parts (the normal form of Section 4), but Γ₀ itself is not — to build it you would already need it. Binary φ has hit its ceiling.</>}
        />
        <Thm name={{ en: 'Γ₀ is the least ordinal closed under φ', zh: 'Γ₀ 是对 φ 封闭的最小序数' }} status="proved">
          <B
            zh={<p>记 <M t="g_0=0,\ g_{k+1}=\varphi(g_k,0)" />，<M t="\Gamma_0=\sup_k g_k" />。若 <M t="\alpha,\beta<\Gamma_0" />，则 <M t="\varphi(\alpha,\beta)<\Gamma_0" />；而任何含 0 且对 φ 封闭的序数集合都包含所有 <M t="g_k" />。所以 Γ₀ 是第一个对 φ（和 +）封闭的非零序数。</p>}
            en={<p>Let <M t="g_0=0,\ g_{k+1}=\varphi(g_k,0)" /> and <M t="\Gamma_0=\sup_k g_k" />. If <M t="\alpha,\beta<\Gamma_0" /> then <M t="\varphi(\alpha,\beta)<\Gamma_0" />; and any set of ordinals containing 0 and closed under φ contains every <M t="g_k" />. So Γ₀ is the first non-zero ordinal closed under φ (and +).</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>取 <M t="k" /> 使 <M t="\alpha,\beta<g_k" />。用 φ 项的比较规则（第 4 节：若 <M t="\alpha<\gamma" />，则 <M t="\varphi(\alpha,\beta)<\varphi(\gamma,\delta)" /> 当且仅当 <M t="\beta<\varphi(\gamma,\delta)" />），由 <M t="\alpha<g_k" /> 与 <M t="\beta<g_k<g_{k+1}=\varphi(g_k,0)" /> 得 <M t="\varphi(\alpha,\beta)<g_{k+1}<\Gamma_0" />。第二句对 <M t="k" /> 归纳即得。加法封闭是因为 <M t="\Gamma_0=\varphi(\Gamma_0,0)" /> 形如 <M t="\omega^{\Gamma_0}" />。</>}
            en={<>Pick <M t="k" /> with <M t="\alpha,\beta<g_k" />. By the comparison rule for φ-terms (Section 4: if <M t="\alpha<\gamma" />, then <M t="\varphi(\alpha,\beta)<\varphi(\gamma,\delta)" /> iff <M t="\beta<\varphi(\gamma,\delta)" />), <M t="\alpha<g_k" /> and <M t="\beta<g_k<g_{k+1}=\varphi(g_k,0)" /> give <M t="\varphi(\alpha,\beta)<g_{k+1}<\Gamma_0" />. The second claim is induction on <M t="k" />. Closure under + holds since <M t="\Gamma_0=\varphi(\Gamma_0,0)" /> is of the form <M t="\omega^{\Gamma_0}" />.</>}
          />
        </Proof>
        <P
          zh={<>在快速增长层次里，<M t="f_{\Gamma_0}(n)=f_{\Gamma_0[n]}(n)" />，其中 <M t="\Gamma_0[n]" /> 是 1、<M t="\varepsilon_0" />、<M t="\varphi(\varepsilon_0,0)" />……（同样去掉了平凡的首项 0）。</>}
          en={<>In the fast-growing hierarchy, <M t="f_{\Gamma_0}(n)=f_{\Gamma_0[n]}(n)" /> with <M t="\Gamma_0[n]" /> = 1, <M t="\varepsilon_0" />, <M t="\varphi(\varepsilon_0,0)" />, … (again dropping the trivial leading 0).</>}
        />
        <H3 en="Predicativity: a philosophical wall" zh="直谓性：一堵哲学之墙" />
        <P
          zh={<>二十世纪初，Russell 和 Poincaré 担心悖论来自“恶性循环”：用一个包含了某对象自身的整体去定义该对象。只用“已经造好的东西”去定义新东西，叫<Term en="predicative" zh="直谓" />。</>}
          en={<>Early in the 20th century, Russell and Poincaré blamed the paradoxes on a “vicious circle”: defining an object by quantifying over a totality that contains it. Defining new things only from things already built is called <Term en="predicative" zh="直谓" />.</>}
        />
        <P
          zh={<>1918 年 Weyl 在《连续统》里尝试只用直谓方法重建分析。那么直谓数学到底能走多远？</>}
          en={<>In 1918 Weyl’s <i>Das Kontinuum</i> tried to rebuild analysis predicatively. So how far can predicative mathematics reach?</>}
        />
        <Thm name={{ en: 'Feferman (1964), Schütte (1965), independently', zh: 'Feferman（1964）、Schütte（1965）各自独立' }} status="proved">
          <B
            zh={<p>在他们对“直谓可证”的精确形式化（分枝分析的自主递进）中，能证明良序的序数恰好是 Γ₀ 以下的序数。</p>}
            en={<p>Under their precise formalization of “predicatively provable” (autonomous progressions of ramified analysis), the ordinals that can be proved well-ordered are exactly those below Γ₀.</p>}
          />
        </Thm>
        <P
          zh={<>所以 Γ₀ 常被称为第一个“非直谓”序数，也叫 Feferman–Schütte 序数。定理本身是严格的；但“这个形式化是否真正抓住了直谓性”是哲学问题，例如 Nik Weaver（2005）就认为直谓数学能越过 Γ₀。</>}
          en={<>So Γ₀ is often called the first “impredicative” ordinal, or the Feferman–Schütte ordinal. The theorem is rigorous; whether the formalization truly captures predicativity is philosophy — Nik Weaver (2005), for one, argued that predicative mathematics reaches beyond Γ₀.</>}
        />
        <H3 en="A rung on the ladder of theories" zh="理论阶梯上的一级" />
        <P
          zh={<>第 6 章说，一个理论 T 的证明论序数 PTO(T) 是它能证明良序的序数的上确界，例如 PTO(PA) = ε₀。下一个著名的台阶是二阶算术的子系统 <Term en="ATR₀" zh="ATR₀" />（算术超限递归）：允许把“算术定义”沿任何良序迭代下去。</>}
          en={<>Chapter 6 defined the proof-theoretic ordinal PTO(T) of a theory T: the sup of ordinals T proves well-ordered; e.g. PTO(PA) = ε₀. The next famous rung is the subsystem <Term en="ATR₀" zh="ATR₀" /> of second-order arithmetic (arithmetical transfinite recursion): arithmetical definitions may be iterated along any well-order.</>}
        />
        <Thm name={{ en: 'Friedman, McAloon & Simpson (1982)', zh: 'Friedman、McAloon 与 Simpson（1982）' }} status="proved">
          <MB t="\mathrm{PTO}(\mathsf{ATR}_0)=\Gamma_0." />
        </Thm>
        <P
          zh={<>ATR₀ 是“反推数学”五大系统之一，大量经典定理（例如关于可数良序可比较性的定理）恰好等价于它。它在形式上不是直谓的，却与直谓数学证明论强度相同。</>}
          en={<>ATR₀ is one of the “Big Five” systems of reverse mathematics; many classical theorems (e.g. comparability of countable well-orders) are exactly equivalent to it. It is not itself predicative in form, yet it has the same proof-theoretic strength as predicative mathematics.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="svo" kicker={{ en: 'Round SVO', zh: '第 SVO 回合' }} title={{ en: 'More variables: an odometer to the small Veblen ordinal', zh: '更多变量：一路数到小 Veblen 序数的里程表' }}>
        <P
          zh={<>老办法再来一次：给“对第一个变量求不动点”这件事也加一个变量。Γ₀ 的不动点列表记作</>}
          en={<>Same trick once more: give “taking fixed points in the first argument” its own variable. List the fixed points of <M t="\alpha\mapsto\varphi(\alpha,0)" /> as</>}
        />
        <MB t="\varphi(1,0,\gamma)=\Gamma_\gamma,\qquad \Gamma_0=\varphi(1,0,0)." />
        <P
          zh={<>然后 <M t="\varphi(1,1,\gamma)" /> 列出 <M t="\delta\mapsto\varphi(1,0,\delta)" /> 的不动点，<M t="\varphi(2,0,\gamma)" /> 列出 <M t="\delta\mapsto\varphi(1,\delta,0)" /> 的不动点……变量多了，规则却始终一句话：</>}
          en={<>Then <M t="\varphi(1,1,\gamma)" /> lists fixed points of <M t="\delta\mapsto\varphi(1,0,\delta)" />, <M t="\varphi(2,0,\gamma)" /> those of <M t="\delta\mapsto\varphi(1,\delta,0)" />, and so on. More variables, but the rule is still one sentence:</>}
        />
        <KeyIdea>
          <L
            zh={<><b>最后一个变量是计数器</b>，数的是第几号不动点。<b>它左边第一个非零变量 α 是层级</b>：把它减一，并把它右边紧挨着的位置空出来当作自变量 δ，得到要求不动点的映射。更左边的变量全部冻结。</>}
            en={<><b>The last argument is the counter</b>: which fixed point. <b>The first non-zero argument to its left, α, is the level</b>: lower it by one and free the slot just right of it as the variable δ — that is the map whose fixed points we list. Everything further left is frozen.</>}
          />
          <MB t="\begin{gathered}\varphi(\#,\alpha{+}1,\underbrace{0,\ldots,0}_{Z},\beta)=f'(\beta),\\ f(\delta)=\varphi(\#,\alpha,\delta,Z).\end{gathered}" />
        </KeyIdea>
        <Widget
          title={{ en: 'The Veblen odometer', zh: 'Veblen 里程表' }}
          hint={{ en: 'Each dial is an argument; @k marks its slot counted from the right. Cyan = counter, pink = level.', zh: '每个转盘是一个变量，@k 表示从右往左数第 k 个位置。青色是计数位，粉色是层级位。' }}
        >
          <Odometer />
        </Widget>
        <P
          zh={<>里程表上的几个地标：<M t="\varphi(1,0,0,0)" /> 叫 <Term en="Ackermann ordinal" zh="Ackermann 序数" />，得名于 Wilhelm Ackermann 1951 年的序数记号；它是 <M t="\alpha\mapsto\varphi(\alpha,0,0)" /> 的第一个不动点。</>}
          en={<>Landmarks on the odometer: <M t="\varphi(1,0,0,0)" /> is the <Term en="Ackermann ordinal" zh="Ackermann 序数" />, named after Wilhelm Ackermann’s 1951 ordinal notation; it is the first fixed point of <M t="\alpha\mapsto\varphi(\alpha,0,0)" />.</>}
        />
        <P
          zh={<>为了不数零，把“第 k 个位置上是 a”写成 <M t="a@k" />（从右往左、从 0 数起）：<M t="\varphi(1,0,0,0,0)=\varphi(1@4)" />。允许任意有限多个变量，上确界就是</>}
          en={<>To stop counting zeros, write “a in slot k” as <M t="a@k" /> (slots counted from the right, starting at 0): <M t="\varphi(1,0,0,0,0)=\varphi(1@4)" />. Allowing any finite number of arguments, the supremum is</>}
        />
        <H3 en="Outgrow every finite number of slots" zh="超越任意有限个位置" />
        <Widget title={{ en: "SVO: no finite number of slots suffices", zh: "SVO：任意有限个位置都不够" }}><LimitWorkshop kind="svo" /></Widget>
        <H3 en="A new index for the tree game" zh="给树游戏一个新索引" />
        <P
          zh={<>这就是<Term en="small Veblen ordinal" zh="小 Veblen 序数" />（SVO）：有限元 Veblen 函数的极限。它的基本列很自然：<M t="\text{SVO}[n]" /> 是 1 后面跟 <M t="n" /> 个 0。</>}
          en={<>This is the <Term en="small Veblen ordinal" zh="小 Veblen 序数" /> (SVO): the limit of Veblen functions with finitely many arguments. Its fundamental sequence is natural: <M t="\text{SVO}[n]" /> is 1 followed by <M t="n" /> zeros.</>}
        />
        <Expand kind="detail" title={{ en: 'Multi-variable fundamental sequences (Def 4.17) and a book typo', zh: '多元基本列（定义 4.17）与书中一处笔误' }}>
          <P
            zh={<>记号：<M t="\#" /> 是任意（可空）前缀，<M t="Z" /> 是一串（可空的）0，<M t="\alpha" /> 为极限时用它的基本列。核心规则：</>}
            en={<>Notation: <M t="\#" /> is any (possibly empty) prefix, <M t="Z" /> a (possibly empty) string of 0s, and limits use their own fundamental sequences. The core rules:</>}
          />
          <MB t="\begin{aligned}&\varphi(\#,\alpha{+}1,Z,0)[n{+}1]=\varphi(\#,\alpha,\varphi(\#,\alpha{+}1,Z,0)[n],Z)\\&\varphi(\#,\alpha{+}1,Z,\beta{+}1)[0]=\varphi(\#,\alpha{+}1,Z,\beta)+1\\&\varphi(\#,\alpha{+}1,Z,\beta{+}1)[n{+}1]=\varphi(\#,\alpha,\varphi(\#,\alpha{+}1,Z,\beta{+}1)[n],Z)\\&\varphi(\#,\alpha,Z,\beta{+}1)[n]=\varphi(\#,\alpha[n],\varphi(\#,\alpha,Z,\beta){+}1,Z)\quad(\alpha\text{ limit})\\&\varphi(\#,\alpha,Z)[n]=\varphi(\#,\alpha[n],Z)\quad(\alpha\text{ limit})\end{aligned}" />
          <P
            zh={<>和二元情形一样，本课程把 <M t="[0]=0" /> 的平凡首项去掉。里程表挂件显示的 [0]、[1]、[2] 就是按这些规则算的。</>}
            en={<>As in the binary case, this course drops the trivial leading term <M t="[0]=0" />. The odometer shows [0], [1], [2] computed by these rules.</>}
          />
          <Caution>
            <L
              zh={<>书中定义 4.17(4) 与式 4.370 印作 <M t="\varphi(\alpha+1)[n+1]=\varphi(\alpha)[n]+\varphi(\alpha)" />，应为 <M t="\varphi(\alpha+1)[n]+\varphi(\alpha)" />（与定义 4.7 一致）。式 4.327 左边的 <M t="\varphi(\alpha,\beta+1,\gamma)" /> 应为 <M t="\varphi(\alpha,\beta,\gamma)" />（β 为极限）。</>}
              en={<>The book’s Def 4.17(4) and eq. 4.370 print <M t="\varphi(\alpha+1)[n+1]=\varphi(\alpha)[n]+\varphi(\alpha)" />; it should be <M t="\varphi(\alpha+1)[n]+\varphi(\alpha)" />, as in Def 4.7. In eq. 4.327 the left side <M t="\varphi(\alpha,\beta+1,\gamma)" /> should read <M t="\varphi(\alpha,\beta,\gamma)" /> (β a limit).</>}
            />
          </Caution>
        </Expand>
        <H3 en="Ordinal positions and the large Veblen ordinal" zh="序数位置与大 Veblen 序数" />
        <P
          zh={<>既然 SVO = <M t="\varphi(1@\omega)" />，何不让位置本身是任意序数？<M t="\varphi(1@(\omega+1))" />、<M t="\varphi(1@\varepsilon_0)" />……于是 <M t="\alpha\mapsto\varphi(1@\alpha)" /> 又是一个可以迭代的映射，它的第一个不动点叫<Term en="large Veblen ordinal" zh="大 Veblen 序数" />（LVO）：</>}
          en={<>Since SVO = <M t="\varphi(1@\omega)" />, why not let positions be any ordinal? <M t="\varphi(1@(\omega+1))" />, <M t="\varphi(1@\varepsilon_0)" />, … Then <M t="\alpha\mapsto\varphi(1@\alpha)" /> is yet another map to iterate; its first fixed point is the <Term en="large Veblen ordinal" zh="大 Veblen 序数" /> (LVO):</>}
        />
        <Widget title={{ en: "LVO: let the slot index grow too", zh: "LVO：位置参数也参与迭代" }}><LimitWorkshop kind="lvo" /></Widget>
        <H3 en="Why another notation will help" zh="为什么需要另一种记号" />
        <Caution>
          <L
            zh={<>书中提醒：在 <M t="\alpha{}@\beta" /> 里，<M t="\beta" /> 已经不再是真正的“第几个位置”（你永远只能写出有限个非零项），最好只把它看成一个参数。</>}
            en={<>The book warns: in <M t="\alpha{}@\beta" />, <M t="\beta" /> is no longer a real “position” (you can only ever write finitely many non-zero entries). Treat it as just a parameter.</>}
          />
        </Caution>
        <KeyIdea>
          <L
            zh={<>“把自然数变量换成序数变量”（超限推广）看上去威风，实际收获却小。从 SVO 到 LVO 的跨度，换成第 8 章的记号，只是指数里改动了一个符号。要真正前进，需要一个全新的“递归内核”——那正是下一章的折叠。</>}
            en={<>Turning a natural-number variable into an ordinal one (a “transfinite extension”) looks mighty but gains little. In Chapter 8’s notation, the step from SVO to LVO is a change of a single symbol in an exponent. Real progress needs a new recursive core: the collapsing of the next chapter.</>}
          />
        </KeyIdea>
      </Section>

      {/* ================================================================ */}
      <Section id="kruskal" kicker={{ en: 'A new arena', zh: '新的擂台' }} title={{ en: 'Trees inside trees: Kruskal’s theorem', zh: '树中之树：Kruskal 定理' }}>
        <P
          zh={<>现在离开序数的高塔，换到一个纯组合的问题。主角是<Term en="rooted tree" zh="有根树" />：有限个点，一个根，每个非根点有唯一的父亲。点可以涂颜色。</>}
          en={<>Now leave the ordinal skyscrapers for a purely combinatorial question. The players are <Term en="rooted tree" zh="有根树" />s: finitely many vertices, one root, every other vertex with a unique parent. Vertices may be coloured.</>}
        />
        <P
          zh={<>两个点 <M t="u,v" /> 的<b>交汇点</b> <M t="u\wedge v" /> 是它们最近的公共祖先（可以是 <M t="u" /> 或 <M t="v" /> 自己）。</>}
          en={<>The <b>meeting point</b> <M t="u\wedge v" /> of vertices <M t="u,v" /> is their nearest common ancestor (possibly <M t="u" /> or <M t="v" /> itself).</>}
        />
        <Thm kind="definition" name={{ en: 'embedding (Friedman’s standard definition)', zh: '嵌入（Friedman 的标准定义）' }}>
          <B
            zh={<p>称树 <M t="A" /> <Term en="embeds" zh="嵌入" /> 树 <M t="B" />，记作 <M t="A\le B" />，如果有一个单射 <M t="h:A\to B" />，保持颜色，并且保持交汇点：<M t="h(u\wedge v)=h(u)\wedge h(v)" />。</p>}
            en={<p>Tree <M t="A" /> <Term en="embeds" zh="嵌入" /> into tree <M t="B" />, written <M t="A\le B" />, if there is an injective map <M t="h:A\to B" /> that preserves colours and meeting points: <M t="h(u\wedge v)=h(u)\wedge h(v)" />.</p>}
          />
        </Thm>
        <P
          zh={<>直观地说：从 <M t="B" /> 里删掉一些枝，再把一些“只有一个孩子的点”抹平（让它的父亲直接连到它的孩子），就能得到 <M t="A" />。被抹掉的点颜色随意；留下来的点颜色必须对得上。</>}
          en={<>Intuitively: delete some branches of <M t="B" /> and smooth away some vertices with a single child (joining parent straight to child), and you obtain <M t="A" />. Smoothed vertices may have any colour; surviving ones must match.</>}
        />
        <Expand kind="detail" title={{ en: 'How the checker decides', zh: '检查器怎么判断' }}>
          <P
            zh={<>对有限有根树，<M t="A\le B" /> 当且仅当：(a) <M t="A" /> 嵌入 <M t="B" /> 的某个孩子子树；或 (b) 两根同色，且 <M t="A" /> 的各孩子子树能分别嵌入 <M t="B" /> 的<b>互不相同</b>的孩子子树（一个二分图匹配）。“互不相同”正是交汇点条件：<M t="A" /> 中两枝的交汇点是根，它们的像也必须在 <M t="h(\text{根})" /> 处分岔。</>}
            en={<>For finite rooted trees, <M t="A\le B" /> iff (a) <M t="A" /> embeds into some child subtree of <M t="B" />, or (b) the roots have the same colour and the child subtrees of <M t="A" /> embed into <b>pairwise distinct</b> child subtrees of <M t="B" /> (a bipartite matching). “Distinct” is precisely the meeting-point condition: two branches of <M t="A" /> meet at the root, so their images must split at the image of the root.</>}
          />
          <P
            zh={<>《大数理论》定义 21.48 用“删点、合并边”的口语化说法，没有写明有根和交汇点条件；我们采用 Friedman 的标准定义，本章的 TREE(1)、TREE(2) 等值都在这个定义下由程序验证。</>}
            en={<>《大数理论》 Def 21.48 describes embedding informally (delete vertices, merge edges) without stating rootedness or the meeting-point condition. We use Friedman’s standard definition; the values TREE(1), TREE(2), … in this chapter are verified by code under it.</>}
          />
        </Expand>
        <H3 en="Test an embedding" zh="动手检验嵌入" />
        <Widget
          title={{ en: 'Embedding checker', zh: '嵌入检查器' }}
         
        >
          <EmbeddingChecker />
        </Widget>
        <H3 en="Kruskal’s tree theorem" zh="Kruskal 树定理" />
        <Thm name={{ en: 'Kruskal (1960)', zh: 'Kruskal（1960）' }} status="proved">
          <B
            zh={<p>在任何无穷的有限有根树序列 <M t="T_1,T_2,\ldots" />（颜色取自有限集）中，总存在 <M t="i<j" /> 使 <M t="T_i\le T_j" />。</p>}
            en={<p>In every infinite sequence <M t="T_1,T_2,\ldots" /> of finite rooted trees (colours from a finite set), there are <M t="i<j" /> with <M t="T_i\le T_j" />.</p>}
          />
        </Thm>
        <P
          zh={<>换句话说，嵌入是一个<Term en="well-quasi-order" zh="良拟序" />：没有无穷严格下降链，也没有无穷的“两两互不嵌入”的序列。这个结论 1937 年由 Vázsonyi 猜出，Kruskal 在 1960 年证明。</>}
          en={<>In other words, embedding is a <Term en="well-quasi-order" zh="良拟序" />: no infinite strictly descending chain and no infinite set of pairwise incomparable trees. Vázsonyi conjectured it in 1937; Kruskal proved it in 1960.</>}
        />
        <Expand kind="proof" title={{ en: 'Proof idea: Nash-Williams’ minimal bad sequence (1963)', zh: '证明思路：Nash-Williams 的极小坏序列（1963）' }}>
          <P
            zh={<>称没有 <M t="T_i\le T_j\ (i<j)" /> 的无穷序列为“坏的”。假设坏序列存在，就逐项贪心地选：<M t="T_1" /> 取能开头一个坏序列的最小的树，<M t="T_2" /> 取能接着开头的最小的树……得到一个“极小坏序列”。</>}
            en={<>Call an infinite sequence with no <M t="T_i\le T_j\ (i<j)" /> “bad”. If bad sequences exist, choose greedily: <M t="T_1" /> a smallest tree that starts a bad sequence, <M t="T_2" /> a smallest tree continuing it, and so on: a “minimal bad sequence”.</>}
          />
          <P
            zh={<>把每棵 <M t="T_i" /> 的所有孩子子树收集起来。由极小性，这个更小的树的集合里没有坏序列（否则能造出更小的坏序列）。再用 Higman 引理（有限序列在“子序列嵌入”下是良拟序）比较各棵树的孩子子树多重集，就能找到 <M t="T_i\le T_j" />，矛盾。</>}
            en={<>Collect all child subtrees of all <M t="T_i" />. By minimality there is no bad sequence among these smaller trees (otherwise a smaller bad sequence could be built). Then Higman’s lemma (finite sequences are well-quasi-ordered under subsequence embedding) applied to the multisets of child subtrees yields some <M t="T_i\le T_j" />, a contradiction.</>}
          />
          <P
            zh={<>注意这个证明一开始就“选取最小的树使得<b>存在</b>一个坏序列……”——它量化了所有无穷序列，是强烈非直谓的。下一节会看到，这不是证明写得笨，而是无法避免。</>}
            en={<>Note how the proof begins: “choose a smallest tree such that <b>there exists</b> a bad sequence…” — a quantifier over all infinite sequences, strongly impredicative. The next section shows this is no clumsiness: it cannot be avoided.</>}
          />
        </Expand>
      </Section>

      {/* ================================================================ */}
      <Section id="tree" kicker={{ en: 'Round TREE(3)', zh: '第 TREE(3) 回合' }} title={{ en: 'The TREE game', zh: 'TREE 游戏' }}>
        <P
          zh={<>Harvey Friedman 把 Kruskal 定理变成了一个有限的游戏。用 <M t="n" /> 种颜色依次画树，规则只有两条：</>}
          en={<>Harvey Friedman turned Kruskal’s theorem into a finite game. Draw trees one after another with <M t="n" /> colours, under two rules:</>}
        />
        <B
          zh={<ol><li>第 <M t="k" /> 棵树最多 <M t="k" /> 个点；</li><li>前面任何一棵树都不能嵌入后面的树。</li></ol>}
          en={<ol><li>tree number <M t="k" /> has at most <M t="k" /> vertices;</li><li>no earlier tree may embed into a later one.</li></ol>}
        />
        <P
          zh={<>由 Kruskal 定理（加上 König 引理），游戏必然结束，而且最长长度有限。这个最长长度就是 <M t="\mathrm{TREE}(n)" />。</>}
          en={<>By Kruskal’s theorem (plus König’s lemma) the game must end, and the longest possible length is finite. That longest length is <M t="\mathrm{TREE}(n)" />.</>}
        />
        <H3 en="Play a round" zh="来玩一局" />
        <Widget
          title={{ en: 'Play TREE(n)', zh: '玩 TREE(n)' }}
          hint={{ en: 'Build tree T_k in the editor and play it. If an earlier tree embeds, the gold numbers show how.', zh: '在编辑器里搭第 k 棵树 T_k，然后出牌。若前面某棵树能嵌进来，金色数字会告诉你怎么嵌。' }}
        >
          <TreeGame />
        </Widget>
        <H3 en="TREE(1) = 1 and TREE(2) = 3" zh="TREE(1) = 1 与 TREE(2) = 3" />
        <P
          zh={<>一种颜色时，第一棵树只能是单个点，而单个点能嵌入任何树。所以 TREE(1) = 1。</>}
          en={<>With one colour, the first tree is a single vertex, which embeds into every tree. So TREE(1) = 1.</>}
        />
        <P
          zh={<>两种颜色（红、绿）时，不妨设 <M t="T_1" /> 是一个红点。此后不能再出现红色。<M t="T_2" /> 至多 2 个点：选绿–绿两点链。<M t="T_3" /> 不能含两点绿链，只能是单个绿点。<M t="T_4" /> 是至少一个点的全绿树，必然包含 <M t="T_3" />。所以最多 3 棵。</>}
          en={<>With two colours (red, green), say <M t="T_1" /> is one red vertex. From then on, red is banned. <M t="T_2" /> has at most 2 vertices: take a green–green edge. <M t="T_3" /> may not contain a green edge, so it is a single green vertex. <M t="T_4" /> is an all-green tree, which contains <M t="T_3" />. So at most 3 trees.</>}
        />
        <Widget title={{ en: 'Exhaustive search', zh: '穷举搜索' }} hint={{ en: 'Don’t trust the argument? Let the computer try every possible sequence.', zh: '信不过上面的论证？让计算机把所有可能的序列都试一遍。' }}>
          <ExhaustiveSearch />
        </Widget>
        <H3 en="The weak cousin tree(n)" zh="弱化版 tree(n)" />
        <P
          zh={<>Friedman 还定义了单色版本 <M t="\mathrm{tree}(n)" />：只有一种颜色，但第 <M t="k" /> 棵树可以有 <M t="n+k" /> 个点。穷举得 tree(1) = 2，tree(2) = 5（可在“穷举搜索”挂件里验证）。</>}
          en={<>Friedman also defined a one-colour version <M t="\mathrm{tree}(n)" />: a single colour, but tree number <M t="k" /> may have <M t="n+k" /> vertices. Exhaustive search gives tree(1) = 2 and tree(2) = 5 (check them in the search widget).</>}
        />
        <P
          zh={<>然后突然爆炸：tree(3) 已知至少是 <M t="3\cdot2^{48}-8=844\,424\,930\,131\,960" />（书中给出的构造），真值未知。而 tree(4)、tree(5) 早已把 Graham 数远远甩在身后。</>}
          en={<>Then it explodes: tree(3) is known to be at least <M t="3\cdot2^{48}-8=844{,}424{,}930{,}131{,}960" /> (a construction given in the book); the true value is unknown. tree(4) and tree(5) already leave Graham’s number far behind.</>}
        />
        <H3 en="TREE(3)" zh="TREE(3)" />
        <P
          zh={<>三种颜色时，第一棵树用掉一种颜色的“单点”，第二棵用掉另一种颜色的两点链……剩下的局面就像在玩一局只有两三种颜色、点数宽裕得多的 tree 游戏。TREE(3) 的下界由此用 tree 的值层层堆出来。</>}
          en={<>With three colours, the first tree uses up a single vertex of one colour, the second a two-vertex chain of another… What remains is like a tree game with fewer colours and far more room. Lower bounds for TREE(3) are built by stacking tree-values this way.</>}
        />
        <P
          zh={<>书中的下界是 <M t="\mathrm{TREE}(3)>H_{\varphi(1@\omega,3)\cdot\varphi(1@\omega)}(\mathrm{tree}(\mathrm{tree}(3)+1))" />，其中 H 是第 4 章的 Hardy 层次。Graham 数在它面前小得无法比较。</>}
          en={<>The book’s lower bound is <M t="\mathrm{TREE}(3)>H_{\varphi(1@\omega,3)\cdot\varphi(1@\omega)}(\mathrm{tree}(\mathrm{tree}(3)+1))" />, with H the Hardy hierarchy of Chapter 4. Graham’s number is incomparably smaller.</>}
        />
        <Expand kind="deeper" title={{ en: 'A famous misquotation', zh: '一个流传很广的误引' }}>
          <P
            zh={<>网上常说“TREE(3) 大于 <M t="A^{A(187196)}(1)" />”。这个数其实是 Friedman 给另一个函数 <M t="n(4)" />（关于字母串的“块子序列”问题）的下界。说它是 TREE(3) 的下界并没错，可是两者差距太大，书中直言：这和说“TREE(3) 大于 1”没有本质区别，极具误导性。</>}
            en={<>The internet often says “TREE(3) exceeds <M t="A^{A(187196)}(1)" />”. That number is really Friedman’s lower bound for a different function, <M t="n(4)" /> (a block-subsequence problem on strings). As a bound for TREE(3) it is true but so weak that, as the book puts it, it is no better in essence than “TREE(3) &gt; 1” — deeply misleading.</>}
          />
        </Expand>
      </Section>

      {/* ================================================================ */}
      <Section id="strength" kicker={{ en: 'Measuring', zh: '丈量' }} title={{ en: 'How strong is Kruskal’s theorem?', zh: 'Kruskal 定理有多强？' }}>
        <P
          zh={<>第 6 章里，九头蛇定理“为真却在 PA 中不可证”，代价是 ε₀。Kruskal 定理的有限形式同样如此，只是门槛高得多。</>}
          en={<>In Chapter 6 the hydra theorem was true but unprovable in PA, at the price ε₀. The finite form of Kruskal’s theorem is the same story with a much higher bar.</>}
        />
        <Thm name={{ en: 'Friedman (c. 1981; published by Simpson 1985)', zh: 'Friedman（约 1981；Simpson 1985 发表）' }} status="proved">
          <B
            zh={<p>Kruskal 定理（甚至它关于 tree(n) 的有限形式）在 ATR₀ 中不可证。所以它超越了直谓数学，超越了 Γ₀。</p>}
            en={<p>Kruskal’s theorem — even its finite form behind tree(n) — is not provable in ATR₀. So it lies beyond predicative mathematics, beyond Γ₀.</p>}
          />
        </Thm>
        <Thm name={{ en: 'Rathjen & Weiermann (1993)', zh: 'Rathjen 与 Weiermann（1993）' }} status="proved">
          <B
            zh={<p>在 ACA₀ 上，Kruskal 树定理等价于“SVO 是良序”。于是它在 PTO 为 SVO 的系统 ACA₀ + Π¹₂-BI 中不可证。</p>}
            en={<p>Over ACA₀, Kruskal’s tree theorem is equivalent to “SVO is well-ordered”. Hence it is unprovable in ACA₀ + Π¹₂-BI, a system whose PTO is SVO.</p>}
          />
        </Thm>
        <P
          zh={<>直观上：给每棵树配一个小于 SVO 的序数，使得“嵌不进去”对应“序数下降”。坏序列就是一条递降的序数链——它必须停下，而它能走多远由 SVO 决定。书中给出了这样的配法，例如单色树 <M t="(()())\sim\omega" />、<M t="(()()())\sim\varepsilon_0" />。</>}
          en={<>Intuitively: assign each tree an ordinal below SVO so that “cannot embed” matches “ordinal goes down”. A bad sequence becomes a descending chain of ordinals — it must stop, and SVO governs how long it can last. The book gives such an assignment, e.g. for one colour <M t="(()())\sim\omega" />, <M t="(()()())\sim\varepsilon_0" />.</>}
        />
        <div className="scroll-x">
          <table className="grid">
            <thead>
              <tr>
                <th><L en="function" zh="函数" /></th>
                <th><L en="growth (FGH mark)" zh="增长率（FGH 刻度）" /></th>
                <th><L en="status" zh="状态" /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Goodstein, Hydra</td>
                <td><M t="\varepsilon_0" /></td>
                <td><L en="proved (Ch. 6)" zh="已证明（第 6 章）" /></td>
              </tr>
              <tr>
                <td><M t="\mathrm{tree}(n)" /></td>
                <td><M t="\text{SVO}=\varphi(1@\omega)" /></td>
                <td><L en="community estimate (book Thm 15.19)" zh="社区估计（书中定理 15.19）" /></td>
              </tr>
              <tr>
                <td><M t="\mathrm{TREE}(n)" /></td>
                <td><L en={<>just above SVO (book: <M t="\varphi(\omega{}@\omega)" />)</>} zh={<>略高于 SVO（书中：<M t="\varphi(\omega{}@\omega)" />）</>} /></td>
                <td><L en="community estimate" zh="社区估计" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Caution>
          <L
            zh={<>“不可证”不等于“长得快”。从“tree 的完全性在某系统中不可证”推出“tree 超过该系统能证明完全的每个函数”，书中（定理 15.15）自己承认<b>这是整个论证中最冒险的一步，实际上只是猜测</b>；上界一侧也“不够可靠”。所以表中的增长率是有证明论支撑的社区估计，不是定理。</>}
            en={<>“Unprovable” is not “fast”. Passing from “tree’s totality is unprovable in a system” to “tree dominates every function that system proves total” is, in the book’s own words (Thm 15.15), <b>the riskiest step of the whole argument — really only a conjecture</b>; the upper-bound side is “not reliable enough” either. So the growth rates in the table are well-supported community estimates, not theorems.</>}
          />
        </Caution>
        <P
          zh={<>（第 8 章会引入序数折叠记号，在那里 TREE 的位置可以精确写出；这里只需记住：略高于 SVO。）</>}
          en={<>(Chapter 8 introduces the collapsing notation in which TREE’s place can be written exactly; for now just remember: just above SVO.)</>}
        />
        <H3 en="Graphs instead of trees: SCG" zh="把树换成图：SCG" />
        <P
          zh={<>Friedman 继续加码：把树换成<b>最大度不超过 3 的图</b>，把嵌入换成图子式（删点、删边、缩边）。第 <M t="k" /> 个图至多 <M t="n+k" /> 个点，前面的图不能是后面的子式。最长长度记作 SCG(n)；只允许简单图时记作 SSCG(n)。</>}
          en={<>Friedman raised the stakes: replace trees by <b>graphs of maximum degree 3</b> and embedding by graph minors (delete vertices, delete edges, contract edges). Graph number <M t="k" /> has at most <M t="n+k" /> vertices; no earlier graph may be a minor of a later one. The longest length is SCG(n), or SSCG(n) for simple graphs.</>}
        />
        <P
          zh={<>它的有限性来自 Robertson–Seymour 的图子式定理（1983–2004 年间的二十篇论文）。增长率被认为至少达到 <M t="\Pi^1_1" />-CA₀ 的强度（第 8 章的领地），远在 SVO 之上；SSCG(3) 据书中所述已远超 TREE(3)。</>}
          en={<>Finiteness comes from the Robertson–Seymour graph minor theorem (twenty papers, 1983–2004). Its growth is believed to reach at least the strength of <M t="\Pi^1_1" />-CA₀ (the territory of Chapter 8), far beyond SVO; according to the book, SSCG(3) already dwarfs TREE(3).</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="open" kicker={{ en: 'Horizon', zh: '地平线' }} title={{ en: 'Open problems, and why Veblen runs out', zh: '未解之谜，以及 Veblen 为何走到尽头' }}>
        <OpenProblem title={{ en: 'SCG(2) versus TREE(3)', zh: 'SCG(2) 与 TREE(3) 谁大' }}>
          <P
            zh={<>SCG 的增长率远高于 TREE，可在小输入上谁先谁后不清楚：SCG(2) 是否大于 TREE(3)，至今没有答案。</>}
            en={<>SCG grows far faster than TREE, yet at small inputs nobody knows who wins: whether SCG(2) exceeds TREE(3) is open.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Exact growth of SCG/SSCG', zh: 'SCG/SSCG 的确切增长率' }}>
          <P
            zh={<>已知下界约在 <M t="\Pi^1_1" />-CA₀ 的强度，上界来自图子式定理的证明论强度，后者本身也没有精确确定。</>}
            en={<>The lower bound sits around the strength of <M t="\Pi^1_1" />-CA₀; the upper bound comes from the proof-theoretic strength of the graph minor theorem, which is itself not pinned down.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Make “growth = PTO” rigorous for tree(n)', zh: '让 tree(n) 的“增长率 = PTO”严格化' }}>
          <P
            zh={<>PA 有 Wainer 等人的严格定理（第 6 章）。对 tree(n)，“它控制 ACA₀ + Π¹₂-BI 可证完全的一切函数”这一步仍只是有力的猜测。</>}
            en={<>For PA there are rigorous theorems (Wainer and others; Chapter 6). For tree(n), the step “it dominates every function ACA₀ + Π¹₂-BI proves total” remains a strong conjecture.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'The true value of tree(3)', zh: 'tree(3) 的真值' }}>
          <P
            zh={<>tree(1) = 2、tree(2) = 5 可以穷举，而 tree(3) 只知道下界 844 424 930 131 960。它和 TREE(3) 不同，可能并没有大得离谱——但没人知道确切值。</>}
            en={<>tree(1) = 2 and tree(2) = 5 yield to brute force, but for tree(3) we only know the lower bound 844,424,930,131,960. Unlike TREE(3) it may not be outrageously large — yet its exact value is unknown.</>}
          />
        </OpenProblem>
        <KeyIdea>
          <L
            zh={<>回顾这一章的攀登：ε₀ → ζ₀ → η₀ → Γ₀ → SVO → LVO，全靠同一个动作——<b>求不动点，再给“求了几次”编号</b>。可每一次编号都只是在旧机器外面再套一层壳，越套越笨重，增益越来越小。第 8 章换一个思路：借来一个“够不着”的大序数 <M t="\Omega" />，再把它<b>折叠</b>回来。上面这一整章，到时候只占一行。</>}
            en={<>Look back at the climb: ε₀ → ζ₀ → η₀ → Γ₀ → SVO → LVO, all by one move — <b>take fixed points, then index how many times you did it</b>. But each indexing only wraps another shell around the old machine, heavier each time, with shrinking returns. Chapter 8 changes tack: borrow an unreachable ordinal <M t="\Omega" /> and <b>collapse</b> it back down. This entire chapter will then fit in a single line.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
