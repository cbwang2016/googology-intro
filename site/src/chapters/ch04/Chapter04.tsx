import './ch04.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { toTex } from '../../lib/huge'
import * as F from './fgh'
import { Countdown, FGHMachine, FSStepper, Sandwich } from './widgetsA'
import { GrahamDuel, HardyMachine, ReplaceOmega, SmallCases, TamperFS } from './widgetsB'

/** Table of f_α(n), every entry computed from the definition. */
function ValueTable() {
  const rows = ['0', '1', '2', '3', '4', 'w', 'w+1', 'w*2', 'w^2', 'w^w', 'e0']
  const ns = [0, 1, 2, 3]
  return (
    <div className="scroll-x">
      <table className="grid c04-small">
        <thead>
          <tr>
            <th>
              <M t="\alpha" />
            </th>
            {ns.map((n) => (
              <th key={n}>
                <M t={`f_\\alpha(${n})`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const a = F.parseIdx(r)
            return (
              <tr key={r}>
                <th>
                  <M t={F.idxTex(a)} />
                </th>
                {ns.map((n) => {
                  const v = F.fValue(a, n)
                  return (
                    <td key={n}>
                      {v.kind === 'exact' ? <M t={F.commas(v.v)} /> : v.kind === 'approx' ? <M t={'\\approx ' + toTex(v.v)} /> : <span className="muted">—</span>}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Chapter04() {
  return (
    <>
      <Prereq
        items={[
          {
            en: <>Knuth arrows (Chapter 2, Def 2.11) and the facts proved there: <M t="a\uparrow^{c}1=a" />, <M t="2\uparrow^{c}2=4" />; Lemma A <M t="a\uparrow^{c}x\ge x+1" />; Lemma B (strictly increasing in the last argument); Lemma C (one more arrow is bigger, for <M t="a\ge3,\ b\ge2" />). Graham’s number <M t="G(64)" /> with <M t="G(0)=4,\ G(k+1)=3\uparrow^{G(k)}3" />.</>,
            zh: <>Knuth 箭头（第 2 章定义 2.11）及当时证明的事实：<M t="a\uparrow^{c}1=a" />，<M t="2\uparrow^{c}2=4" />；引理 A <M t="a\uparrow^{c}x\ge x+1" />；引理 B（对最后一个参数严格递增）；引理 C（<M t="a\ge3,\ b\ge2" /> 时多一个箭头更大）。Graham 数 <M t="G(64)" />：<M t="G(0)=4,\ G(k+1)=3\uparrow^{G(k)}3" />。</>,
          },
          {
            en: <>Ordinals (Chapter 3): successor and limit, supremum, Cantor normal form, <M t="\varepsilon_0=\sup_n\omega\uparrow\uparrow n" />, the no-infinite-descent theorem and transfinite induction.</>,
            zh: <>序数（第 3 章）：后继与极限、上确界、Cantor 标准型、<M t="\varepsilon_0=\sup_n\omega\uparrow\uparrow n" />、“不存在无穷下降”定理与超穷归纳法。</>,
          },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="ruler" kicker={{ en: 'Round 8', zh: '第八回合' }} title={{ en: 'A function for every ordinal', zh: '每个序数一个函数' }}>
        <P
          zh={<>第 2 章给函数贴的刻度——“重复 <M t="n" /> 次就加一”“对角化就到 <M t="\omega" />”——还只是直觉标签。第 3 章造好了序数。现在把两者焊在一起：给每个序数 <M t="\alpha" /> 指定一个函数 <M t="f_\alpha:\N\to\N" />，作为尺子上的标准刻度。</>}
          en={<>Chapter 2’s marks — “iterate <M t="n" /> times, add one,” “diagonalize, reach <M t="\omega" />” — were intuitive labels. Chapter 3 built the ordinals. Now we weld the two: to each ordinal <M t="\alpha" /> we attach a function <M t="f_\alpha:\N\to\N" />, a calibrated mark on the ruler of growth.</>}
        />
        <P
          zh={<>配方只有三行：<M t="f_0(n)=n+1" />；后继就把前一个函数重复 <M t="n" /> 次；极限就沿着一架通向它的“梯子”对角化。唯一要补的细节是：<b>梯子选哪一架？</b></>}
          en={<>The recipe has three lines: <M t="f_0(n)=n+1" />; at a successor, iterate the previous function <M t="n" /> times; at a limit, diagonalize along a “ladder” climbing to it. The one missing detail: <b>which ladder?</b></>}
        />
        <P
          zh={<>这个体系通常叫<Term en="fast-growing hierarchy" zh="快速增长层次" />（FGH），也叫 Löb–Wainer 层次：Martin Löb 和 Stanley Wainer 1970 年用它给可计算函数分级，后来它成了衡量“可证明终止的程序能长多快”的标准尺子——这是第 6 章的主题。</>}
          en={<>The system is called the <Term en="fast-growing hierarchy" zh="快速增长层次" /> (FGH), or the Löb–Wainer hierarchy, after Martin Löb and Stanley Wainer, who used it in 1970 to classify computable functions. It became the standard yardstick for how fast provably terminating programs can grow — the theme of Chapter 6.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="fs" kicker={{ en: 'Ladders', zh: '梯子' }} title={{ en: 'Fundamental sequences', zh: '基本列' }}>
        <P
          zh={<>一个极限序数有无数架梯子：<M t="\omega=\sup\{0,1,2,\ldots\}=\sup\{1,10,100,\ldots\}=\sup\{10,10^{10},10^{10^{10}},\ldots\}" />。FGH 必须为每个极限 <M t="\lambda" /> 选定一架梯子 <M t="\lambda[0]<\lambda[1]<\cdots" />，即它的<Term en="fundamental sequence" zh="基本列" />。在 <M t="\varepsilon_0" /> 以下有一套公认的标准选择：</>}
          en={<>A limit ordinal has countless ladders: <M t="\omega=\sup\{0,1,2,\ldots\}=\sup\{1,10,100,\ldots\}=\sup\{10,10^{10},10^{10^{10}},\ldots\}" />. The FGH must fix one ladder <M t="\lambda[0]<\lambda[1]<\cdots" /> for every limit <M t="\lambda" />: its <Term en="fundamental sequence" zh="基本列" />. Below <M t="\varepsilon_0" /> there is a standard choice:</>}
        />
        <Thm kind="definition" name={{ en: 'standard fundamental sequences below ε₀ (book Def 3.6)', zh: 'ε₀ 以下的标准基本列（《大数理论》定义 3.6）' }}>
          <B
            zh={<p>把极限序数写成 Cantor 标准型，并把 <M t="\omega^{\beta}\cdot c" /> 看作 <M t="c" /> 个 <M t="\omega^{\beta}" /> 相加。对自然数 <M t="n" />：</p>}
            en={<p>Write the limit in Cantor normal form, reading <M t="\omega^{\beta}\cdot c" /> as <M t="c" /> copies of <M t="\omega^{\beta}" />. For each natural number <M t="n" />:</p>}
          />
          <MB t="\begin{aligned}&(1)\quad \omega[n]=n\\&(2)\quad (\alpha+\beta)[n]=\alpha+\beta[n]\qquad(\beta\text{ the last term, a limit})\\&(3)\quad \omega^{\alpha+1}[n]=\omega^{\alpha}\cdot n\\&(4)\quad \omega^{\lambda}[n]=\omega^{\lambda[n]}\qquad(\lambda\text{ a limit})\end{aligned}" />
          <B
            zh={<p>另外约定 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />（<M t="\omega\uparrow\uparrow0=1" />），即 <M t="\varepsilon_0[0]=1,\ \varepsilon_0[1]=\omega,\ \varepsilon_0[2]=\omega^{\omega}" />。</p>}
            en={<p>Also <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" /> (with <M t="\omega\uparrow\uparrow0=1" />): <M t="\varepsilon_0[0]=1,\ \varepsilon_0[1]=\omega,\ \varepsilon_0[2]=\omega^{\omega}" />.</p>}
          />
        </Thm>
        <P
          zh={<>用《大数理论》的话说：<b>不断从末尾拆出一个 <M t="\omega" />，直到拆不动为止，再把最后那个 <M t="\omega" /> 换成 <M t="n" /></b>。下面的步进器会逐条显示用了哪条规则，包括书中的例子 <M t="\omega^{\omega^{\omega+1}\cdot2}\cdot3" />。</>}
          en={<>In the book’s words: <b>keep splitting an <M t="\omega" /> off the end until you can’t, then replace that last <M t="\omega" /> by <M t="n" /></b>. The stepper shows which rule fires at each stage, including the book’s example <M t="\omega^{\omega^{\omega+1}\cdot2}\cdot3" />.</>}
        />
        <Widget title={{ en: 'Fundamental-sequence stepper', zh: '基本列步进器' }} hint={{ en: 'Pick an ordinal and an n; click a rung below to jump to it.', zh: '选一个序数和 n；点下面的某一级可以直接跳过去。' }}>
          <FSStepper />
        </Widget>
        <Caution>
          <L
            zh={<>规则只对<b>标准型</b>使用。若把 (2) 硬套在 <M t="1+\omega" /> 上，会得到梯子 <M t="1+n" />——而 <M t="1+\omega" /> 就是 <M t="\omega" />，它的梯子应当是 <M t="n" />。同一个序数，两架梯子，FGH 就不再良定义。</>}
            en={<>Apply the rules to <b>normal forms</b> only. Forcing rule (2) onto <M t="1+\omega" /> gives the ladder <M t="1+n" />, yet <M t="1+\omega" /> is just <M t="\omega" />, whose ladder is <M t="n" />. One ordinal with two ladders would make the FGH ill-defined.</>}
          />
        </Caution>
        <Thm kind="fact" name={{ en: '(the ladders really climb)', zh: '（梯子确实通向目标）' }}>
          <B
            zh={<p>对每个极限 <M t="\lambda\le\varepsilon_0" />：<M t="\lambda[0]<\lambda[1]<\cdots<\lambda" />，且 <M t="\sup_n\lambda[n]=\lambda" />。</p>}
            en={<p>For every limit <M t="\lambda\le\varepsilon_0" />: <M t="\lambda[0]<\lambda[1]<\cdots<\lambda" /> and <M t="\sup_n\lambda[n]=\lambda" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>对 <M t="\lambda" /> 作超穷归纳，逐条验证。(1) 显然。(3)：<M t="\omega^{\alpha}\cdot n" /> 严格递增，上确界为 <M t="\omega^{\alpha}\cdot\omega=\omega^{\alpha+1}" />。(4)：由归纳假设 <M t="\lambda[n]\nearrow\lambda" />（这里 <M t="\lambda<\omega^{\lambda}" />，因为在 <M t="\varepsilon_0" /> 之下），而 <M t="\beta\mapsto\omega^{\beta}" /> 严格递增且在极限处连续（这就是乘方的极限规则），故 <M t="\omega^{\lambda[n]}\nearrow\omega^{\lambda}" />。(2)：<M t="\beta\mapsto\alpha+\beta" /> 同样严格递增且连续。<M t="\varepsilon_0" /> 的情形就是它的定义。</>}
            en={<>Transfinite induction on <M t="\lambda" />, rule by rule. (1) is clear. (3): <M t="\omega^{\alpha}\cdot n" /> strictly increases with supremum <M t="\omega^{\alpha}\cdot\omega=\omega^{\alpha+1}" />. (4): by induction <M t="\lambda[n]\nearrow\lambda" /> (here <M t="\lambda<\omega^{\lambda}" /> since we are below <M t="\varepsilon_0" />), and <M t="\beta\mapsto\omega^{\beta}" /> is strictly increasing and continuous at limits (that is exactly the limit rule for powers), so <M t="\omega^{\lambda[n]}\nearrow\omega^{\lambda}" />. (2): <M t="\beta\mapsto\alpha+\beta" /> is strictly increasing and continuous too. The case <M t="\varepsilon_0" /> is its definition.</>}
          />
        </Proof>
        <Expand kind="detail" title={{ en: 'The book’s ε₀[n] is shifted by one', zh: '书中的 ε₀[n] 差了一格' }}>
          <P
            zh={<>《大数理论》取 <M t="\varepsilon_0=\sup\{0,1,\omega,\omega^\omega,\ldots\}" />，即 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow(n-1)" />（<M t="\varepsilon_0[0]=0" />）。本课程沿用更常见的 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />，它也和第 5 章初等序列的极限 <M t="(0,1,\ldots,n)" /> 对得上。</>}
            en={<>《大数理论》 takes <M t="\varepsilon_0=\sup\{0,1,\omega,\omega^\omega,\ldots\}" />, i.e. <M t="\varepsilon_0[n]=\omega\uparrow\uparrow(n-1)" /> with <M t="\varepsilon_0[0]=0" />. We use the more common <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />, which also matches the limit <M t="(0,1,\ldots,n)" /> of Chapter 5’s primitive sequences.</>}
          />
          <P
            zh={<>两种约定沿的是同一架“指数塔梯子”，只是错开一级：书中的 <M t="f_{\varepsilon_0}(n+1)=f_{\omega\uparrow\uparrow n}(n+1)" />，本课程的 <M t="f_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow n}(n)" />。参数差 1 在增长率的尺度上可以忽略，两者都是刻度 <M t="\varepsilon_0" />。具体的小数值会不同，所以引用数值时要说明用的是哪种。</>}
            en={<>Both climb the same ladder of towers, offset by one rung: the book’s <M t="f_{\varepsilon_0}(n+1)=f_{\omega\uparrow\uparrow n}(n+1)" />, ours <M t="f_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow n}(n)" />. An argument shift of 1 is invisible on the scale of growth rates; both sit at mark <M t="\varepsilon_0" />. Small values do differ, so always say which convention you use when quoting numbers.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="fgh" kicker={{ en: 'The definition', zh: '定义' }} title={{ en: 'The fast-growing hierarchy', zh: '快速增长层次' }}>
        <Thm kind="definition" name={{ en: 'FGH (book Def 3.4)', zh: 'FGH（《大数理论》定义 3.4）' }}>
          <MB t="f_0(n)=n+1,\qquad f_{\alpha+1}(n)=f_\alpha^{\,n}(n),\qquad f_\lambda(n)=f_{\lambda[n]}(n)\ \ (\lambda\text{ limit})." />
          <B
            zh={<p>这里 <M t="f^{\,n}" /> 是 <M t="n" /> 重复合，<M t="f^{\,0}=\mathrm{id}" />；<M t="\lambda[n]" /> 是标准基本列（定义 3.6）。</p>}
            en={<p>Here <M t="f^{\,n}" /> is the <M t="n" />-fold composite, <M t="f^{\,0}=\mathrm{id}" />, and <M t="\lambda[n]" /> is the standard fundamental sequence (Def 3.6).</p>}
          />
        </Thm>
        <P
          zh={<>它是良定义的：这是一个沿序数的递归，<M t="f_{\alpha+1}" /> 只用到 <M t="f_\alpha" />，<M t="f_\lambda" /> 只用到 <M t="f_{\lambda[n]}" /> 且 <M t="\lambda[n]<\lambda" />。由第 3 章的超穷归纳法，每个 <M t="f_\alpha" />（<M t="\alpha\le\varepsilon_0" />）都是确定的全函数。</>}
          en={<>It is well defined: this is a recursion along the ordinals, where <M t="f_{\alpha+1}" /> uses only <M t="f_\alpha" /> and <M t="f_\lambda" /> uses only <M t="f_{\lambda[n]}" /> with <M t="\lambda[n]<\lambda" />. By Chapter 3’s transfinite induction, every <M t="f_\alpha" /> (<M t="\alpha\le\varepsilon_0" />) is a definite total function.</>}
        />
        <H3 en="The first floors" zh="最初几层" />
        <P
          zh={<><M t="f_1(n)=f_0^{\,n}(n)=2n" />。由 <M t="f_1^{\,k}(x)=2^kx" /> 得 <M t="f_2(n)=n\cdot2^n" />。于是 <M t="f_3(2)=f_2(f_2(2))=f_2(8)=8\cdot2^8=2048" />，而 <M t="f_\omega(2)=f_2(2)=8" />。</>}
          en={<><M t="f_1(n)=f_0^{\,n}(n)=2n" />. Since <M t="f_1^{\,k}(x)=2^kx" />, <M t="f_2(n)=n\cdot2^n" />. Hence <M t="f_3(2)=f_2(f_2(2))=f_2(8)=8\cdot2^8=2048" />, while <M t="f_\omega(2)=f_2(2)=8" />.</>}
        />
        <P
          zh={<>下表每一格都是程序按定义当场算出来的（“—”表示没有任何计算机能写出它）。注意前两列：<b>对每个 <M t="\alpha\ge1" /> 都有 <M t="f_\alpha(1)=2" /></b>，而 <M t="f_\alpha(0)" /> 只是 0 或 1。小参数会骗人。</>}
          en={<>Every entry below is computed live from the definition (“—” means no computer could ever write it). Look at the first two columns: <b><M t="f_\alpha(1)=2" /> for every <M t="\alpha\ge1" /></b>, and <M t="f_\alpha(0)" /> is just 0 or 1. Small inputs lie.</>}
        />
        <ValueTable />
        <P
          zh={<>（<M t="f_\alpha(1)=2" /> 的证明：后继时 <M t="f_{\beta+1}(1)=f_\beta(1)" />，极限时 <M t="f_\lambda(1)=f_{\lambda[1]}(1)" /> 且 <M t="\lambda[1]\ge1" />；从 <M t="f_1(1)=2" /> 出发作超穷归纳。）</>}
          en={<>(Proof that <M t="f_\alpha(1)=2" />: at successors <M t="f_{\beta+1}(1)=f_\beta(1)" />, at limits <M t="f_\lambda(1)=f_{\lambda[1]}(1)" /> with <M t="\lambda[1]\ge1" />; transfinite induction from <M t="f_1(1)=2" />.)</>}
        />
        <Widget title={{ en: 'The FGH machine', zh: 'FGH 展开机' }} hint={{ en: 'Watch f_α(n) unfold one rule at a time. “Run” stops when the next step is physically impossible.', zh: '看 f_α(n) 一条规则一条规则地展开。“一直算”会在下一步物理上不可能时停下。' }}>
          <FGHMachine />
        </Widget>
        <P
          zh={<>机器里的写法 <M t="f_\beta^{\,k}(\cdots)" /> 就是一个调用栈。<M t="f_{\omega+1}(2)" /> 很快就卡在 <M t="f_2" /> 作用于一个几百位的数上：值完全确定，却永远算不出来。</>}
          en={<>The machine’s nested <M t="f_\beta^{\,k}(\cdots)" /> is a call stack. <M t="f_{\omega+1}(2)" /> soon jams on <M t="f_2" /> of a number with hundreds of digits: the value is perfectly determined, and forever out of reach.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="arrows" kicker={{ en: 'Calibration', zh: '校准' }} title={{ en: 'Finite levels are arrows', zh: '有限层就是箭头' }}>
        <P
          zh={<>第 2 章说 <M t="n\uparrow^{m}n" /> 的刻度是 <M t="m+1" />。现在可以把它变成定理：<M t="f_{m+1}" /> 被夹在 <M t="m" /> 个箭头和 <M t="m+1" /> 个箭头之间，而且紧贴下沿。</>}
          en={<>Chapter 2 put <M t="n\uparrow^{m}n" /> at mark <M t="m+1" />. Now that becomes a theorem: <M t="f_{m+1}" /> is sandwiched between <M t="m" /> and <M t="m+1" /> arrows — and hugs the lower side.</>}
        />
        <Thm name={{ en: '(FGH vs Knuth arrows)', zh: '（FGH 与 Knuth 箭头）' }}>
          <B
            zh={<p>对每个 <M t="m\ge1" />：</p>}
            en={<p>For every <M t="m\ge1" />:</p>}
          />
          <MB t="\begin{aligned}&\text{(a)}\quad f_{m+1}(n)\ \ge\ 2\uparrow^{m}(n+1)\quad(n\ge2;\ \text{strict for } n\ge3),\\&\text{(b)}\quad f_{m+1}(n)\ \le\ 2\uparrow^{m}(3n)\quad(n\ge1),\\&\text{(c)}\quad 2\uparrow^{m}(n+1)\ <\ f_{m+1}(n)\ <\ 2\uparrow^{m+1}(n+1)\quad(n\ge4).\end{aligned}" />
        </Thm>
        <Proof>
          <L
            zh={<>只证 (a)，(b)(c) 见下面的展开。对 <M t="m" /> 归纳。<M t="m=1" />：<M t="n2^n\ge2\cdot2^n" />。归纳步：令 <M t="h(y)=2\uparrow^{m}y" />。由 Def 2.11 的规则 (3)，<M t="2\uparrow^{m+1}(n+1)=h^{n}(2)" />。由归纳假设和 <M t="f_{m+1}(1)=2=h(1)" />，对 <M t="y\ge1" /> 有 <M t="f_{m+1}(y)\ge h(y)" />；<M t="h" /> 递增（引理 B），所以 <M t="f_{m+1}^{\,k}(y)\ge h^{k}(y)" />。于是 <M t="f_{m+2}(n)=f_{m+1}^{\,n}(n)\ge h^{n}(n)\ge h^{n}(2)=2\uparrow^{m+1}(n+1)" />，<M t="n\ge3" /> 时最后一步严格。</>}
            en={<>We prove (a); (b) and (c) are in the panel below. Induct on <M t="m" />. For <M t="m=1" />: <M t="n2^n\ge2\cdot2^n" />. Step: let <M t="h(y)=2\uparrow^{m}y" />. By rule (3) of Def 2.11, <M t="2\uparrow^{m+1}(n+1)=h^{n}(2)" />. By hypothesis and <M t="f_{m+1}(1)=2=h(1)" />, we have <M t="f_{m+1}(y)\ge h(y)" /> for <M t="y\ge1" />; <M t="h" /> is increasing (Lemma B), so <M t="f_{m+1}^{\,k}(y)\ge h^{k}(y)" />. Hence <M t="f_{m+2}(n)=f_{m+1}^{\,n}(n)\ge h^{n}(n)\ge h^{n}(2)=2\uparrow^{m+1}(n+1)" />, strictly for <M t="n\ge3" />.</>}
          />
        </Proof>
        <Expand title={{ en: 'Basic monotonicity, and the upper bounds (b), (c)', zh: '基本单调性，以及上界 (b)(c)' }}>
          <Thm kind="lemma" name={{ en: 'M (monotonicity of finite levels)', zh: 'M（有限层的单调性）' }}>
            <L
              zh={<>对每个 <M t="m" />：(i) <M t="f_m(x)\ge x" />，且 <M t="x\ge1" /> 时 <M t="f_m(x)>x" />；(ii) <M t="f_m" /> 严格递增；(iii) <M t="x\ge1" /> 时 <M t="f_{m+1}(x)\ge f_m(x)" />，<M t="x\ge2" /> 时严格。</>}
              en={<>For every <M t="m" />: (i) <M t="f_m(x)\ge x" />, strictly if <M t="x\ge1" />; (ii) <M t="f_m" /> is strictly increasing; (iii) <M t="f_{m+1}(x)\ge f_m(x)" /> for <M t="x\ge1" />, strictly for <M t="x\ge2" />.</>}
            />
          </Thm>
          <Proof>
            <L
              zh={<>(i) 对 <M t="m" /> 归纳：<M t="f_{m+1}(0)=0" />；<M t="x\ge1" /> 时 <M t="f_m^{\,x}(x)=f_m(f_m^{\,x-1}(x))>f_m^{\,x-1}(x)\ge x" />。(ii) <M t="f_{m+1}(x+1)=f_m^{\,x+1}(x+1)>f_m^{\,x+1}(x)\ge f_m^{\,x}(x)" />（严格递增函数的迭代仍严格递增；最后一步用 (i)）。(iii) <M t="f_m^{\,x}(x)=f_m^{\,x-1}(f_m(x))\ge f_m(x)" />，当 <M t="x-1\ge1" /> 时由 (i) 严格。</>}
              en={<>(i) Induct on <M t="m" />: <M t="f_{m+1}(0)=0" />, and for <M t="x\ge1" />, <M t="f_m^{\,x}(x)=f_m(f_m^{\,x-1}(x))>f_m^{\,x-1}(x)\ge x" />. (ii) <M t="f_{m+1}(x+1)=f_m^{\,x+1}(x+1)>f_m^{\,x+1}(x)\ge f_m^{\,x}(x)" /> (iterates of strictly increasing maps are strictly increasing; last step by (i)). (iii) <M t="f_m^{\,x}(x)=f_m^{\,x-1}(f_m(x))\ge f_m(x)" />, strictly when <M t="x-1\ge1" /> by (i).</>}
            />
          </Proof>
          <P
            zh={<><b>一个辅助不等式：</b> 对 <M t="c\ge1" />，<M t="2\uparrow^{c}y\ge2^{y}" />。对 <M t="c" /> 归纳：<M t="2\uparrow^{c+1}y=2\uparrow^{c}(2\uparrow^{c+1}(y-1))\ge2^{2\uparrow^{c+1}(y-1)}\ge2^{y}" />，最后一步用引理 A。</>}
            en={<><b>A helper:</b> for <M t="c\ge1" />, <M t="2\uparrow^{c}y\ge2^{y}" />. Induct on <M t="c" />: <M t="2\uparrow^{c+1}y=2\uparrow^{c}(2\uparrow^{c+1}(y-1))\ge2^{2\uparrow^{c+1}(y-1)}\ge2^{y}" />, the last step by Lemma A.</>}
          />
          <P
            zh={<><b>(b) 的证明。</b> 对 <M t="m" /> 归纳；<M t="m=1" /> 即 <M t="n2^n\le8^n" />。设 (b) 对 <M t="m" /> 成立，令 <M t="K(x)=2\uparrow^{m}x" />，则 <M t="2\uparrow^{m+1}j=K^{j}(1)" />，且 <M t="x\ge4" /> 时 <M t="3x\le2^x\le K(x)" />。断言：<M t="n\ge2" /> 时 <M t="f_{m+1}^{\,k}(n)\le K^{\,n+2k}(1)" />。<M t="k=0" /> 由引理 A。若 <M t="z=f_{m+1}^{\,k}(n)\le K^{j}(1)" />（<M t="j=n+2k\ge2" />，故 <M t="K^{j}(1)\ge4" />），则 <M t="f_{m+1}(z)\le K(3z)\le K(3K^{j}(1))\le K(K(K^{j}(1)))=K^{j+2}(1)" />。取 <M t="k=n" /> 得 <M t="f_{m+2}(n)\le K^{3n}(1)=2\uparrow^{m+1}(3n)" />；<M t="n=1" /> 时两边是 2 和更大的数。</>}
            en={<><b>Proof of (b).</b> Induct on <M t="m" />; <M t="m=1" /> is <M t="n2^n\le8^n" />. Assume (b) for <M t="m" />, let <M t="K(x)=2\uparrow^{m}x" />, so <M t="2\uparrow^{m+1}j=K^{j}(1)" />, and <M t="3x\le2^x\le K(x)" /> for <M t="x\ge4" />. Claim: for <M t="n\ge2" />, <M t="f_{m+1}^{\,k}(n)\le K^{\,n+2k}(1)" />. The case <M t="k=0" /> is Lemma A. If <M t="z=f_{m+1}^{\,k}(n)\le K^{j}(1)" /> with <M t="j=n+2k\ge2" /> (so <M t="K^{j}(1)\ge4" />), then <M t="f_{m+1}(z)\le K(3z)\le K(3K^{j}(1))\le K(K(K^{j}(1)))=K^{j+2}(1)" />. Taking <M t="k=n" />: <M t="f_{m+2}(n)\le K^{3n}(1)=2\uparrow^{m+1}(3n)" />; for <M t="n=1" /> the left side is 2.</>}
          />
          <P
            zh={<><b>(c) 的证明。</b> 下界即 (a)。上界：<M t="n\ge4" /> 时 <M t="3n<2^n\le2\uparrow^{m+1}n" />，所以 <M t="f_{m+1}(n)\le2\uparrow^{m}(3n)<2\uparrow^{m}(2\uparrow^{m+1}n)=2\uparrow^{m+1}(n+1)" />。</>}
            en={<><b>Proof of (c).</b> The lower bound is (a). Upper: for <M t="n\ge4" />, <M t="3n<2^n\le2\uparrow^{m+1}n" />, so <M t="f_{m+1}(n)\le2\uparrow^{m}(3n)<2\uparrow^{m}(2\uparrow^{m+1}n)=2\uparrow^{m+1}(n+1)" />.</>}
          />
        </Expand>
        <Widget title={{ en: 'The sandwich', zh: '夹心饼干' }} hint={{ en: 'Height = slog₁₀, the number of log₁₀’s needed to get below 1. Compare the three curves.', zh: '高度是 slog₁₀，即要取几次 log₁₀ 才能降到 1 以下。比较三条曲线。' }}>
          <Sandwich />
        </Widget>
        <P
          zh={<>直观地说，<M t="f_{m+1}(n)" /> 就是“<M t="m" /> 个箭头、参数大约 <M t="n" />”。这正是第 2 章的刻度规则“重复 <M t="n" /> 次刻度加一”的精确版本。</>}
          en={<>Informally, <M t="f_{m+1}(n)" /> is “<M t="m" /> arrows applied to about <M t="n" />.” That is the precise form of Chapter 2’s rule “iterating <M t="n" /> times adds one to the mark.”</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="omega" kicker={{ en: 'Crossing ω', zh: '越过 ω' }} title={{ en: 'Level ω: the diagonal, made precise', zh: 'ω 层：把对角线说严格' }}>
        <P
          zh={<>由于 <M t="\omega[n]=n" />，<M t="f_\omega(n)=f_n(n)" />：这正是第 2 章对角化 <M t="d(n)=n\uparrow^{n}n" /> 的同一招，只是行换成了 FGH 的各层。</>}
          en={<>Since <M t="\omega[n]=n" />, <M t="f_\omega(n)=f_n(n)" /> — the very diagonal trick of Chapter 2’s <M t="d(n)=n\uparrow^{n}n" />, with the rows now being FGH levels.</>}
        />
        <Thm name={{ en: '(the ω level)', zh: '（ω 层）' }}>
          <B
            zh={<p>(i) 对 <M t="n\ge2" />：<M t="2\uparrow^{n-1}(n+1)\le f_\omega(n)\le2\uparrow^{n-1}(3n)" />。(ii) 对每个 <M t="m" />，当 <M t="n>m" />、<M t="n\ge2" /> 时 <M t="f_\omega(n)>f_m(n)" />。(iii) <M t="f_\omega" /> 严格递增。</p>}
            en={<p>(i) For <M t="n\ge2" />: <M t="2\uparrow^{n-1}(n+1)\le f_\omega(n)\le2\uparrow^{n-1}(3n)" />. (ii) For each <M t="m" />: <M t="f_\omega(n)>f_m(n)" /> whenever <M t="n>m" /> and <M t="n\ge2" />. (iii) <M t="f_\omega" /> is strictly increasing.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>(i) 是有限层定理 (a)(b) 取 <M t="m=n-1" />。(ii) 由引理 M(iii)，<M t="f_n(n)>f_{n-1}(n)>\cdots>f_m(n)" />。(iii) <M t="n\ge1" /> 时 <M t="f_\omega(n+1)=f_{n+1}(n+1)>f_{n+1}(n)\ge f_n(n)" />；另有 <M t="f_\omega(1)=2>1=f_\omega(0)" />。</>}
            en={<>(i) is the finite-level theorem (a), (b) with <M t="m=n-1" />. (ii) By Lemma M(iii), <M t="f_n(n)>f_{n-1}(n)>\cdots>f_m(n)" />. (iii) For <M t="n\ge1" />, <M t="f_\omega(n+1)=f_{n+1}(n+1)>f_{n+1}(n)\ge f_n(n)" />; and <M t="f_\omega(1)=2>1=f_\omega(0)" />.</>}
          />
        </Proof>
        <P
          zh={<>所以 <M t="f_\omega" /> 的大小就是“<M t="n-1" /> 个箭头”，它最终超过每一个固定的层——这就是第 2 章那个神秘刻度 <M t="\omega" /> 的精确含义。那么第 2 章的对角函数本身落在哪里？</>}
          en={<>So <M t="f_\omega" /> is “<M t="n-1" /> arrows,” and it eventually beats every fixed level — the precise meaning of Chapter 2’s mysterious mark <M t="\omega" />. And where does Chapter 2’s own diagonal function land?</>}
        />
        <Thm name={{ en: '(where the diagonal d(n) = n↑ⁿn sits)', zh: '（对角函数 d(n) = n↑ⁿn 的位置）' }}>
          <B
            zh={<p>对 <M t="n\ge3" />：<M t="f_\omega(n)\ \le\ d(n)=n\uparrow^{n}n\ <\ f_{\omega+1}(n)" />。</p>}
            en={<p>For <M t="n\ge3" />: <M t="f_\omega(n)\ \le\ d(n)=n\uparrow^{n}n\ <\ f_{\omega+1}(n)" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>下界：<M t="d(n)=n\uparrow^{n-1}\bigl(n\uparrow^{n}(n-1)\bigr)\ge n\uparrow^{n-1}(3n)\ge2\uparrow^{n-1}(3n)\ge f_\omega(n)" />。上界：<M t="d(n)\le2\uparrow^{n}(n^2)<2\uparrow^{n^2-1}(n^2+1)\le f_\omega(n^2)\le f_\omega(f_\omega(n))\le f_{\omega+1}(n)" />。每一步的理由见下面的展开。</>}
            en={<>Lower: <M t="d(n)=n\uparrow^{n-1}\bigl(n\uparrow^{n}(n-1)\bigr)\ge n\uparrow^{n-1}(3n)\ge2\uparrow^{n-1}(3n)\ge f_\omega(n)" />. Upper: <M t="d(n)\le2\uparrow^{n}(n^2)<2\uparrow^{n^2-1}(n^2+1)\le f_\omega(n^2)\le f_\omega(f_\omega(n))\le f_{\omega+1}(n)" />. The justification of each step is in the panel below.</>}
          />
        </Proof>
        <Expand title={{ en: 'Every step of the sandwich for d(n)', zh: 'd(n) 夹逼的每一步' }}>
          <P
            zh={<><b>三个箭头小事实</b>（<M t="a\ge2,\ c\ge1" />，都对 <M t="b" /> 或 <M t="c" /> 归纳，只用第 2 章的引理 A、B）：(α) <M t="a\uparrow^{c+1}b\ge a\uparrow^{c}b" />：<M t="b=0" /> 时两边为 1；<M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}(a\uparrow^{c+1}b)\ge a\uparrow^{c}(b+1)" />。(β) 底数单调：<M t="a\le a'" /> 推出 <M t="a\uparrow^{c}b\le a'\uparrow^{c}b" />，对 <M t="(c,b)" /> 归纳即可。(γ) <M t="b\ge1" /> 时 <M t="a\uparrow^{c}b\le2\uparrow^{c}(ab)" />：<M t="c=1" /> 时 <M t="a^b\le2^{ab}" />；归纳步令 <M t="X=a\uparrow^{c+1}b\le Y=2\uparrow^{c+1}(ab)" />，则 <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}X\le2\uparrow^{c}(aY)\le2\uparrow^{c}(2\uparrow^{c}Y)=2\uparrow^{c+1}(ab+2)\le2\uparrow^{c+1}(ab+a)" />，这里用了 <M t="a\le Y" />、<M t="Y\ge4" /> 和 <M t="aY\le Y^2\le2^Y\le2\uparrow^{c}Y" />。</>}
            en={<><b>Three small arrow facts</b> (<M t="a\ge2,\ c\ge1" />; each by induction on <M t="b" /> or <M t="c" />, using only Chapter 2’s Lemmas A and B): (α) <M t="a\uparrow^{c+1}b\ge a\uparrow^{c}b" />: both sides are 1 at <M t="b=0" />, and <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}(a\uparrow^{c+1}b)\ge a\uparrow^{c}(b+1)" />. (β) Monotone in the base: <M t="a\le a'" /> implies <M t="a\uparrow^{c}b\le a'\uparrow^{c}b" />, by induction on <M t="(c,b)" />. (γ) For <M t="b\ge1" />, <M t="a\uparrow^{c}b\le2\uparrow^{c}(ab)" />: for <M t="c=1" />, <M t="a^b\le2^{ab}" />; in the step put <M t="X=a\uparrow^{c+1}b\le Y=2\uparrow^{c+1}(ab)" />, so <M t="a\uparrow^{c+1}(b+1)=a\uparrow^{c}X\le2\uparrow^{c}(aY)\le2\uparrow^{c}(2\uparrow^{c}Y)=2\uparrow^{c+1}(ab+2)\le2\uparrow^{c+1}(ab+a)" />, using <M t="a\le Y" />, <M t="Y\ge4" /> and <M t="aY\le Y^2\le2^Y\le2\uparrow^{c}Y" />.</>}
          />
          <P
            zh={<><b>下界。</b> 规则 (3) 给出第一个等号。<M t="n\ge3" /> 时由引理 B 和 C，<M t="n\uparrow^{n}(n-1)\ge n\uparrow^{n}2=n\uparrow^{n-1}n\ge n^n\ge3n" />，再用引理 B。然后用 (β) 把底数 <M t="n" /> 换成 2，最后用有限层定理 (b)（<M t="m=n-1" />）：<M t="f_\omega(n)=f_n(n)\le2\uparrow^{n-1}(3n)" />。</>}
            en={<><b>Lower bound.</b> The first equality is rule (3). For <M t="n\ge3" />, Lemmas B and C give <M t="n\uparrow^{n}(n-1)\ge n\uparrow^{n}2=n\uparrow^{n-1}n\ge n^n\ge3n" />; apply Lemma B. Then (β) trades base <M t="n" /> for 2, and the finite-level theorem (b) with <M t="m=n-1" /> gives <M t="f_\omega(n)=f_n(n)\le2\uparrow^{n-1}(3n)" />.</>}
          />
          <P
            zh={<><b>上界。</b> (γ) 取 <M t="a=b=c=n" />；然后由 (α)（<M t="n^2-1\ge n" />）和引理 B 得严格不等号；接着是 ω 层定理 (i)（参数 <M t="n^2" />）；再由 <M t="f_\omega(n)\ge2\uparrow^{n-1}(n+1)\ge2^{n+1}\ge n^2" /> 和 <M t="f_\omega" /> 递增；最后 <M t="n\ge2" /> 时 <M t="f_{\omega+1}(n)=f_\omega^{\,n}(n)\ge f_\omega^{\,2}(n)" />，因为 <M t="f_\omega(x)\ge x" />。</>}
            en={<><b>Upper bound.</b> (γ) with <M t="a=b=c=n" />; then (α) (as <M t="n^2-1\ge n" />) plus Lemma B for the strict step; then the ω-level theorem (i) at input <M t="n^2" />; then <M t="f_\omega(n)\ge2\uparrow^{n-1}(n+1)\ge2^{n+1}\ge n^2" /> and monotonicity of <M t="f_\omega" />; finally <M t="f_{\omega+1}(n)=f_\omega^{\,n}(n)\ge f_\omega^{\,2}(n)" /> for <M t="n\ge2" />, since <M t="f_\omega(x)\ge x" />.</>}
          />
        </Expand>
        <P
          zh={<>所以 <M t="d" /> 夹在刻度 <M t="\omega" /> 和 <M t="\omega+1" /> 之间：它不低于 <M t="f_\omega" />，又被 <M t="f_{\omega+1}" /> 压住。第 2 章把它标为 <M t="\omega" />，正是这个意思。</>}
          en={<>So <M t="d" /> is squeezed between marks <M t="\omega" /> and <M t="\omega+1" />: never below <M t="f_\omega" />, always below <M t="f_{\omega+1}" />. That is exactly what Chapter 2’s label <M t="\omega" /> meant.</>}
        />
        <Quiz
          q={{ zh: <p><M t="f_{\omega+1}" /> 是否在<b>每一个</b>输入上都大于 <M t="f_\omega" />？</p>, en: <p>Is <M t="f_{\omega+1}" /> bigger than <M t="f_\omega" /> at <b>every</b> input?</p> }}
          options={[
            { zh: <p>是，层次越高处处越大</p>, en: <p>Yes — higher levels are bigger everywhere</p> },
            { zh: <p>不是：在 0 处更小，在 1 处相等，从 2 起才更大</p>, en: <p>No: smaller at 0, equal at 1, bigger from 2 on</p> },
            { zh: <p>不是：要到 <M t="n=64" /> 之后才更大</p>, en: <p>No: only beyond <M t="n=64" /></p> },
          ]}
          answer={1}
          explain={{
            zh: <p><M t="f_{\omega+1}(0)=f_\omega^{\,0}(0)=0<1=f_\omega(0)" />，<M t="f_{\omega+1}(1)=f_\omega(1)=2" />，而 <M t="f_{\omega+1}(2)=f_\omega(8)\gg8" />。FGH 的比较永远是“<b>最终</b>”的比较。</p>,
            en: <p><M t="f_{\omega+1}(0)=f_\omega^{\,0}(0)=0<1=f_\omega(0)" />, <M t="f_{\omega+1}(1)=f_\omega(1)=2" />, and <M t="f_{\omega+1}(2)=f_\omega(8)\gg8" />. Comparisons in the FGH are always <b>eventual</b>.</p>,
          }}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="graham" kicker={{ en: 'Round 8, the showdown', zh: '第八回合 · 决战' }} title={{ en: 'Level ω+1 beats Graham’s number', zh: 'ω+1 层打败 Graham 数' }}>
        <P
          zh={<>回忆 Graham 数：令 <M t="g(x)=3\uparrow^{x}3" />，则 <M t="G(0)=4" />、<M t="G(k+1)=g(G(k))" />，Graham 数是 <M t="G(64)=g^{64}(4)" />。而 <M t="f_{\omega+1}(64)=f_\omega^{\,64}(64)" />。两边都是把一个“<M t="\omega" /> 级”函数迭代 64 次——问题在于每一层谁更大。</>}
          en={<>Recall Graham’s number: with <M t="g(x)=3\uparrow^{x}3" />, <M t="G(0)=4" />, <M t="G(k+1)=g(G(k))" />, and Graham’s number is <M t="G(64)=g^{64}(4)" />. Meanwhile <M t="f_{\omega+1}(64)=f_\omega^{\,64}(64)" />. Both iterate an “<M t="\omega" />-level” function 64 times; the question is who wins each layer.</>}
        />
        <P
          zh={<>难点：直接比 <M t="f_\omega(x)" /> 和 <M t="3\uparrow^{x}3" /> 是输的——<M t="f_\omega(x)\approx2\uparrow^{x-1}(x+1)" /> 少一个箭头。办法是让 FGH 每层<b>领先一步</b>，再把底数 3 换成 2。</>}
          en={<>The catch: comparing <M t="f_\omega(x)" /> with <M t="3\uparrow^{x}3" /> directly loses — <M t="f_\omega(x)\approx2\uparrow^{x-1}(x+1)" /> has one arrow fewer. The fix: keep the FGH side <b>one step ahead</b> on every layer, and trade base 3 for base 2.</>}
        />
        <Thm kind="lemma" name={{ en: 'E (base change)', zh: 'E（换底）' }}>
          <L zh={<>对所有 <M t="c,b\ge1" />：<M t="3\uparrow^{c}b<2\uparrow^{c}(2b)" />。</>} en={<>For all <M t="c,b\ge1" />: <M t="3\uparrow^{c}b<2\uparrow^{c}(2b)" />.</>} />
        </Thm>
        <Proof>
          <L
            zh={<>对 <M t="c" /> 归纳，内层对 <M t="b" /> 归纳。<M t="c=1" />：<M t="3^b<4^b" />。设对 <M t="c" /> 成立。<M t="b=1" />：<M t="3<4=2\uparrow^{c+1}2" />。从 <M t="b" /> 到 <M t="b+1" />：令 <M t="y=3\uparrow^{c+1}b" />，<M t="Y=2\uparrow^{c+1}(2b)" />，归纳假设给出 <M t="y<Y" />。于是 <M t="3\uparrow^{c+1}(b+1)=3\uparrow^{c}y<2\uparrow^{c}(2y)<2\uparrow^{c}(2Y)\le2\uparrow^{c}(2\uparrow^{c}Y)=2\uparrow^{c+1}(2b+2)" />，其中用了引理 B 和 <M t="2Y\le2^Y\le2\uparrow^{c}Y" />（后一步是上一节展开里的辅助不等式）。</>}
            en={<>Induct on <M t="c" />, and inside on <M t="b" />. For <M t="c=1" />: <M t="3^b<4^b" />. Assume it for <M t="c" />. For <M t="b=1" />: <M t="3<4=2\uparrow^{c+1}2" />. From <M t="b" /> to <M t="b+1" />: put <M t="y=3\uparrow^{c+1}b" />, <M t="Y=2\uparrow^{c+1}(2b)" />; the hypothesis gives <M t="y<Y" />. Then <M t="3\uparrow^{c+1}(b+1)=3\uparrow^{c}y<2\uparrow^{c}(2y)<2\uparrow^{c}(2Y)\le2\uparrow^{c}(2\uparrow^{c}Y)=2\uparrow^{c+1}(2b+2)" />, using Lemma B and <M t="2Y\le2^Y\le2\uparrow^{c}Y" /> (the helper inequality from the previous scene’s panel).</>}
          />
        </Proof>
        <Thm kind="lemma" name={{ en: 'F (one step ahead)', zh: 'F（领先一步）' }}>
          <L zh={<>对 <M t="x\ge4" />：<M t="f_\omega(x+1)>3\uparrow^{x}3" />。</>} en={<>For <M t="x\ge4" />: <M t="f_\omega(x+1)>3\uparrow^{x}3" />.</>} />
        </Thm>
        <Proof>
          <L
            zh={<><M t="f_\omega(x+1)=f_{x+1}(x+1)\ge2\uparrow^{x}(x+2)\ge2\uparrow^{x}6>3\uparrow^{x}3" />：依次用有限层定理 (a)（<M t="m=x" />）、引理 B（<M t="x+2\ge6" />）和引理 E（<M t="b=3" />）。</>}
            en={<><M t="f_\omega(x+1)=f_{x+1}(x+1)\ge2\uparrow^{x}(x+2)\ge2\uparrow^{x}6>3\uparrow^{x}3" />, by the finite-level theorem (a) with <M t="m=x" />, Lemma B (<M t="x+2\ge6" />), and Lemma E with <M t="b=3" />.</>}
          />
        </Proof>
        <Thm name={{ en: '(FGH beats Graham)', zh: '（FGH 打败 Graham）' }}>
          <MB t="f_{\omega+1}(64)\ >\ G(64)." />
        </Thm>
        <Proof>
          <L
            zh={<>令 <M t="a_k=f_\omega^{\,k}(64)" />。断言 <M t="a_k\ge G(k)+1" />。<M t="k=0" />：<M t="64\ge5" />。归纳步：<M t="G" /> 递增（引理 C：箭头越多越大），故 <M t="G(k)\ge4" />；<M t="f_\omega" /> 严格递增（ω 层定理 (iii)）。于是 <M t="a_{k+1}=f_\omega(a_k)\ge f_\omega(G(k)+1)>3\uparrow^{G(k)}3=G(k+1)" />（引理 F，<M t="x=G(k)" />），即 <M t="a_{k+1}\ge G(k+1)+1" />。取 <M t="k=64" />：<M t="f_{\omega+1}(64)=a_{64}>G(64)" />。</>}
            en={<>Let <M t="a_k=f_\omega^{\,k}(64)" />. Claim: <M t="a_k\ge G(k)+1" />. For <M t="k=0" />: <M t="64\ge5" />. Step: <M t="G" /> is increasing (Lemma C: more arrows, bigger), so <M t="G(k)\ge4" />; and <M t="f_\omega" /> is strictly increasing (ω-level theorem (iii)). So <M t="a_{k+1}=f_\omega(a_k)\ge f_\omega(G(k)+1)>3\uparrow^{G(k)}3=G(k+1)" /> by Lemma F with <M t="x=G(k)" />, i.e. <M t="a_{k+1}\ge G(k+1)+1" />. At <M t="k=64" />: <M t="f_{\omega+1}(64)=a_{64}>G(64)" />.</>}
          />
        </Proof>
        <Widget title={{ en: 'Layer by layer', zh: '一层一层比' }} hint={{ en: 'Slide through the 64 layers; each shows the inequality chain used at that step.', zh: '拖动滑块走过 64 层；每一层都列出那一步用到的不等式链。' }}>
          <GrahamDuel />
        </Widget>
        <P
          zh={<>证明其实给出了更多：起点只要 <M t="a_0\ge5" /> 就够，所以 <M t="f_\omega^{\,64}(5)" /> 已经超过 Graham 数。64 这个起点是大大的浪费。</>}
          en={<>The proof gives more: the start only needs <M t="a_0\ge5" />, so <M t="f_\omega^{\,64}(5)" /> already exceeds Graham’s number. Starting at 64 is lavish overkill.</>}
        />
        <Widget title={{ en: 'Where the inequalities kick in', zh: '不等式从哪里开始成立' }} hint={{ en: 'Lemmas E and F checked on small cases by computer.', zh: '用计算机检验引理 E 和 F 的小情形。' }}>
          <SmallCases />
        </Widget>
        <P
          zh={<>注意 <M t="f_\omega(2)=8<27=3\uparrow3" />：引理 F 在 <M t="x=1" /> 时是错的。小情形里的反例提醒我们，“显然更大”的直觉在小参数处靠不住，证明里的门槛（这里是 <M t="x\ge4" />）是必要的严谨。</>}
          en={<>Note <M t="f_\omega(2)=8<27=3\uparrow3" />: Lemma F is false at <M t="x=1" />. Small cases are a reminder that “obviously bigger” fails for small inputs; thresholds like <M t="x\ge4" /> in a proof are not pedantry.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="countdown" kicker={{ en: 'Under the hood', zh: '引擎盖下' }} title={{ en: 'The ordinal countdown', zh: '序数倒计时' }}>
        <P
          zh={<>算 <M t="f_{\omega^\omega}(3)" /> 时，第一件事是一路往下找最里层的调用：极限就取基本列第 3 项，后继 <M t="f_{\beta+1}(3)=f_\beta(f_\beta(f_\beta(3)))" /> 就钻进最里面的 <M t="f_\beta(3)" />。下标序数一路下降：</>}
          en={<>Computing <M t="f_{\omega^\omega}(3)" /> starts by hunting for the innermost call: at a limit take the 3rd rung; at a successor, <M t="f_{\beta+1}(3)=f_\beta(f_\beta(f_\beta(3)))" />, dive into the innermost <M t="f_\beta(3)" />. The index ordinal keeps falling:</>}
        />
        <MB t="\omega^\omega\to\omega^3\to\omega^2\cdot3\to\omega^2\cdot2+\omega\cdot3\to\omega^2\cdot2+\omega\cdot2+3\to\cdots\to1\to0." />
        <Widget title={{ en: 'Countdown from ω^ω at n = 3', zh: '从 ω^ω 出发的倒计时（n = 3）' }} hint={{ en: 'Violet bars: limit steps. Cyan bars: successor steps, each leaving two outer calls waiting.', zh: '紫色：极限步；青色：后继步，每一步在外面留下两层等待的调用。' }}>
          <Countdown />
        </Widget>
        <P
          zh={<>这一趟倒计时有 41 步，然后才第一次真正“算”出一个数：<M t="f_0(3)=4" />。之后外面排队的调用一个个带着更大的参数重新出发，每一次又是一场倒计时。</>}
          en={<>This first countdown takes 41 steps before anything is actually computed: <M t="f_0(3)=4" />. Then the waiting outer calls restart one by one with bigger arguments, each launching a countdown of its own.</>}
        />
        <P
          zh={<>它为什么一定会结束？值的存在性由超穷递归保证；而<b>计算过程</b>的终止，可以这样看：调用栈里的序数从外到内单调不增，栈按“从外到内的字典序”比较时是良序的，每一步都让栈严格变小——再用第 3 章的“不存在无穷下降”。下一节的 Hardy 层次把这一点变得一目了然：那里只有一个序数，每步严格下降。</>}
          en={<>Why must it end? The values exist by transfinite recursion; for the <b>computation</b> itself, note that the stack’s ordinals are non-increasing from outside in, stacks compared lexicographically from the outside form a well-order, and every step makes the stack strictly smaller — then apply Chapter 3’s no-infinite-descent theorem. The Hardy hierarchy in a later scene makes this transparent: a single ordinal that drops at every step.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="epsilon0" kicker={{ en: 'The top of Cantor’s world', zh: 'Cantor 世界的顶端' }} title={{ en: 'Level ε₀', zh: 'ε₀ 层' }}>
        <P
          zh={<>用约定 <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />，<M t="f_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow n}(n)" />：先爬 <M t="n" /> 层指数塔，再在那里对角化。它的前两个值平淡无奇：<M t="f_{\varepsilon_0}(0)=f_1(0)=0" />，<M t="f_{\varepsilon_0}(1)=f_\omega(1)=2" />。第三个值是：</>}
          en={<>With <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />, <M t="f_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow n}(n)" />: climb a tower of <M t="n" /> omegas, then diagonalize there. The first two values are tame: <M t="f_{\varepsilon_0}(0)=f_1(0)=0" />, <M t="f_{\varepsilon_0}(1)=f_\omega(1)=2" />. The third:</>}
        />
        <MB t="f_{\varepsilon_0}(2)=f_{\omega^\omega}(2)=f_{\omega^2}(2)=f_{\omega\cdot2}(2)=f_{\omega+2}(2)=f_{\omega+1}\bigl(f_{\omega+1}(2)\bigr)=f_{\omega+1}\bigl(f_\omega(8)\bigr)." />
        <Quiz
          q={{ zh: <p>哪个更大：<M t="f_{\varepsilon_0}(2)" />，还是 Graham 数 <M t="G(64)" />？</p>, en: <p>Which is bigger: <M t="f_{\varepsilon_0}(2)" /> or Graham’s number <M t="G(64)" />?</p> }}
          options={[
            { zh: <p>Graham 数——参数才 2 而已</p>, en: <p>Graham’s number — the input is only 2</p> },
            { zh: <p><M t="f_{\varepsilon_0}(2)" /></p>, en: <p><M t="f_{\varepsilon_0}(2)" /></p> },
            { zh: <p>无法比较</p>, en: <p>They cannot be compared</p> },
          ]}
          answer={1}
          explain={{
            zh: <p><M t="f_\omega(8)=f_8(8)\ge2\uparrow^{7}9>64" />，而 <M t="f_{\omega+1}" /> 严格递增（与引理 M(ii) 同理，因为 <M t="f_\omega" /> 严格递增且 <M t="f_\omega(x)\ge x" />），所以 <M t="f_{\varepsilon_0}(2)=f_{\omega+1}(f_\omega(8))>f_{\omega+1}(64)>G(64)" />。在 FGH 里，参数 2 已经足够把 Graham 数远远甩开。</p>,
            en: <p><M t="f_\omega(8)=f_8(8)\ge2\uparrow^{7}9>64" /> and <M t="f_{\omega+1}" /> is strictly increasing (as in Lemma M(ii), since <M t="f_\omega" /> is strictly increasing with <M t="f_\omega(x)\ge x" />), so <M t="f_{\varepsilon_0}(2)=f_{\omega+1}(f_\omega(8))>f_{\omega+1}(64)>G(64)" />. In the FGH, input 2 already leaves Graham’s number far behind.</p>,
          }}
        />
        <P
          zh={<><M t="\varepsilon_0" /> 是 Cantor 标准型写不到的第一个序数，也是第 5、6 章的主角：初等序列、Goodstein 序列和九头蛇游戏都恰好活在这个刻度上。</>}
          en={<><M t="\varepsilon_0" /> is the first ordinal Cantor normal form cannot reach, and the protagonist of Chapters 5 and 6: primitive sequences, Goodstein sequences and the hydra game all live exactly at this mark.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="pathology" kicker={{ en: 'Fine print that matters', zh: '要紧的细则' }} title={{ en: 'The ladder is part of the definition', zh: '梯子是定义的一部分' }}>
        <P
          zh={<>说“<M t="f_{\varepsilon_0}" />”而不说用哪套基本列，其实什么也没说。同样的序数，换一套梯子，函数可以面目全非。</>}
          en={<>Saying “<M t="f_{\varepsilon_0}" />” without naming the fundamental sequences says nothing. Same ordinals, different ladders, and the function can become unrecognizable.</>}
        />
        <Widget title={{ en: 'Tamper with the ladders', zh: '篡改梯子' }} hint={{ en: 'Toggle the two sabotage switches from 《大数理论》 §3.3.', zh: '切换《大数理论》§3.3 里的两种“破坏”。' }}>
          <TamperFS />
        </Widget>
        <P
          zh={<>削弱：每级梯子开头垫上足够多的 0，<M t="f_{\varepsilon_0}(n)" /> 就塌成 <M t="n+1" />。增强：令 <M t="\omega[n]=f_{\varepsilon_0}(n)" />——仍是一架通向 <M t="\omega" /> 的合法梯子——<M t="f_\omega" /> 就超过了标准的 <M t="f_{\varepsilon_0}" />。任何强度都能藏进一架梯子里。</>}
          en={<>Weaken: pad each rung’s ladder with enough zeros and <M t="f_{\varepsilon_0}(n)" /> collapses to <M t="n+1" />. Strengthen: set <M t="\omega[n]=f_{\varepsilon_0}(n)" /> — still a legitimate ladder to <M t="\omega" /> — and <M t="f_\omega" /> overtakes the standard <M t="f_{\varepsilon_0}" />. Any strength can be smuggled into a ladder.</>}
        />
        <KeyIdea>
          <L
            zh={<>FGH 的刻度只有在<b>标准、自然</b>的基本列下才有意义。<M t="\varepsilon_0" /> 以下有公认的标准；越过 <M t="\varepsilon_0" /> 之后，每一种序数记号（第 7 章的 Veblen 函数、第 8 章的序数折叠函数）都要自带一套基本列。</>}
            en={<>FGH marks mean something only for <b>standard, natural</b> fundamental sequences. Below <M t="\varepsilon_0" /> the standard is agreed on; beyond <M t="\varepsilon_0" />, every ordinal notation (Chapter 7’s Veblen functions, Chapter 8’s collapsing functions) must bring its own sequences.</>}
          />
        </KeyIdea>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="growth" kicker={{ en: 'Measuring', zh: '丈量' }} title={{ en: 'What does “f has growth rate α” mean?', zh: '“f 的增长率是 α”是什么意思？' }}>
        <Thm name={{ en: '(the hierarchy is increasing; book Thm 3.3)', zh: '（层次是递增的；《大数理论》定理 3.3）' }}>
          <B
            zh={<p>在标准基本列下，若 <M t="\alpha<\beta\le\varepsilon_0" />，则对所有充分大的 <M t="n" />，<M t="f_\alpha(n)<f_\beta(n)" />。</p>}
            en={<p>With standard fundamental sequences, if <M t="\alpha<\beta\le\varepsilon_0" /> then <M t="f_\alpha(n)<f_\beta(n)" /> for all sufficiently large <M t="n" />.</p>}
          />
        </Thm>
        <P
          zh={<>有限层和 <M t="\omega" /> 层的情形我们已经亲手证明了。一般情形的证明要用到标准基本列的一个结构性质（所谓 Bachmann 性质），见 Löb–Wainer（1970）或 Fairtlough–Wainer 在《Handbook of Proof Theory》（1998）中的综述。</>}
          en={<>We proved the finite and <M t="\omega" /> cases by hand. The general proof uses a structural property of the standard sequences (the Bachmann property); see Löb–Wainer (1970), or the survey by Fairtlough and Wainer in the <i>Handbook of Proof Theory</i> (1998).</>}
        />
        <Thm kind="definition" name={{ en: 'growth rate (book Def 3.8)', zh: '增长率（《大数理论》定义 3.8）' }}>
          <B
            zh={<p>称 <M t="f\sim\alpha" />，如果：对每个 <M t="\beta<\alpha" />，最终 <M t="f(n)>f_\beta(n)" />；并且最终 <M t="f(n)\le f_\alpha(n)" />。也就是说，<M t="\alpha" /> 是最终压得住 <M t="f" /> 的最小刻度。</p>}
            en={<p>Write <M t="f\sim\alpha" /> if for every <M t="\beta<\alpha" />, eventually <M t="f(n)>f_\beta(n)" />, and eventually <M t="f(n)\le f_\alpha(n)" />. In words: <M t="\alpha" /> is the least mark that eventually bounds <M t="f" />.</p>}
          />
        </Thm>
        <P
          zh={<>这把尺子很粗。例如 <M t="n\ge3" /> 时 <M t="n^n>n\cdot2^n=f_2(n)" />，所以按定义 3.8，<M t="n^n\sim3" />，而第 2 章的直觉刻度是 2。书里的说法是：它“在 2 和 3 之间”，差一个后继无关紧要。更细的办法（梅天狸的定义 3.9 的思路）是允许有限次复合：<M t="n^n\le f_2(f_2(n))" />，于是它“至多是 2”。</>}
          en={<>This ruler is coarse. For <M t="n\ge3" />, <M t="n^n>n\cdot2^n=f_2(n)" />, so by Def 3.8 <M t="n^n\sim3" />, while Chapter 2’s intuition said 2. The book’s gloss: it lies “between 2 and 3,” and being off by one successor does not matter. A finer approach (the idea of 梅天狸’s Def 3.9) allows finitely many compositions: <M t="n^n\le f_2(f_2(n))" />, so it has rate “at most 2.”</>}
        />
        <Expand kind="detail" title={{ en: 'When “iterating adds one” fails', zh: "“迭代就加一”何时失效" }}>
          <P
            zh={<>直觉规则说：若 <M t="f\sim\alpha" />，则 <M t="f^{\,n}(n)\sim\alpha+1" />。书中给了反例：取 <M t="f(n)=2\uparrow^{g(n)}n" />，其中 <M t="g\to\infty" /> 但增长得极其缓慢（比如某个增长率超过 <M t="\omega+1" /> 的函数的反函数）。那么 <M t="f" /> 最终超过每个 <M t="f_m" />，所以 <M t="f\sim\omega" />；但 <M t="g" /> 慢到在整个迭代过程中几乎不动，使得 <M t="f^{\,n}(n)<2\uparrow^{n-1}n<f_\omega(n)" />，于是 <M t="f^{\,n}(n)" /> 也 <M t="\sim\omega" />——迭代没有加一。</>}
            en={<>The intuitive rule says: if <M t="f\sim\alpha" /> then <M t="f^{\,n}(n)\sim\alpha+1" />. The book gives a counterexample: <M t="f(n)=2\uparrow^{g(n)}n" /> with <M t="g\to\infty" /> extremely slowly (say, the inverse of a function growing faster than <M t="\omega+1" />). Then <M t="f" /> eventually beats every <M t="f_m" />, so <M t="f\sim\omega" />; but <M t="g" /> barely moves during the whole iteration, giving <M t="f^{\,n}(n)<2\uparrow^{n-1}n<f_\omega(n)" />, so <M t="f^{\,n}(n)\sim\omega" /> too. Iterating did not add one.</>}
          />
        </Expand>
        <OpenProblem title={{ en: 'A rigorous notion of growth rate', zh: '增长率的严格定义' }}>
          <P
            zh={<>没有一个公认的严格定义，既能给每个“合理”的函数分配一个序数，又满足所有直觉（迭代加一、对角化取上确界……）。书中提出的几种候选定义（定义 3.7–3.9，包括上面的 3.8）各有缺陷。大数社区对各种记号的“增长率分析”因此在严格意义上都是非正式的——它们是有充分证据的估计，而不是定理。</>}
            en={<>There is no accepted rigorous definition that assigns an ordinal to every “reasonable” function while satisfying all the intuitions (iteration adds one, diagonalization takes the supremum, …). The book’s candidate definitions (Defs 3.7–3.9, including 3.8 above) each have flaws. As a result, the googology community’s growth-rate analyses of notations are, strictly speaking, informal: well-supported estimates, not theorems.</>}
          />
        </OpenProblem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="hardy" kicker={{ en: 'A finer ruler', zh: '更细的尺子' }} title={{ en: 'The Hardy hierarchy', zh: 'Hardy 层次' }}>
        <P
          zh={<>FGH 的后继规则“重复 <M t="n" /> 次”相当粗暴。Hardy 层次只让参数加一：</>}
          en={<>The FGH successor rule, “iterate <M t="n" /> times,” is heavy-handed. The Hardy hierarchy merely bumps the argument:</>}
        />
        <Thm kind="definition" name={{ en: 'Hardy hierarchy (book Def 3.10)', zh: 'Hardy 层次（《大数理论》定义 3.10）' }}>
          <MB t="H_0(n)=n,\qquad H_{\alpha+1}(n)=H_\alpha(n+1),\qquad H_\lambda(n)=H_{\lambda[n]}(n)." />
        </Thm>
        <P
          zh={<>计算 <M t="H_\alpha(n)" /> 就是一台只有一个序数、一个计数器的机器：极限换成第 <M t="n" /> 级，后继减一并让 <M t="n" /> 加一，直到序数为 0。序数每步严格下降——终止性直接来自“不存在无穷下降”。这个名字来自 G. H. Hardy 1904 年一篇用序数索引函数族的论文。</>}
          en={<>Computing <M t="H_\alpha(n)" /> is a machine with one ordinal and one counter: replace a limit by its <M t="n" />-th rung; at a successor subtract one and add one to <M t="n" />; stop at 0. The ordinal drops at every step, so termination is immediate from no-infinite-descent. The name honours G. H. Hardy, whose 1904 paper used an ordinal-indexed family of functions.</>}
        />
        <Widget title={{ en: 'The Hardy machine', zh: 'Hardy 机器' }} hint={{ en: 'The counter only ever moves by +1; the final counter value is the answer.', zh: '计数器每次只加 1；最后计数器的值就是答案。' }}>
          <HardyMachine />
        </Widget>
        <Thm name={{ en: '(Hardy meets FGH)', zh: '（Hardy 与 FGH 的对应）' }}>
          <B
            zh={<p>对 <M t="\alpha<\varepsilon_0" />：<M t="H_{\omega^\alpha}(n)=f_\alpha(n)" />。</p>}
            en={<p>For <M t="\alpha<\varepsilon_0" />: <M t="H_{\omega^\alpha}(n)=f_\alpha(n)" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>关键引理：若 <M t="\beta+\gamma" /> 的标准型就是两者标准型的拼接，则 <M t="H_{\beta+\gamma}=H_\beta\circ H_\gamma" />（对 <M t="\gamma" /> 归纳：后继时 <M t="H_{\beta+\delta+1}(n)=H_{\beta+\delta}(n+1)" />；极限时用规则 (2)）。于是 <M t="H_{\omega^{\alpha+1}}(n)=H_{\omega^\alpha\cdot n}(n)=H_{\omega^\alpha}^{\,n}(n)=f_\alpha^{\,n}(n)=f_{\alpha+1}(n)" />，<M t="H_{\omega^\lambda}(n)=H_{\omega^{\lambda[n]}}(n)=f_{\lambda[n]}(n)=f_\lambda(n)" />，且 <M t="H_{\omega^0}(n)=H_1(n)=n+1=f_0(n)" />。对 <M t="\alpha" /> 作超穷归纳即得。</>}
            en={<>Key lemma: if the normal form of <M t="\beta+\gamma" /> is the concatenation of those of <M t="\beta" /> and <M t="\gamma" />, then <M t="H_{\beta+\gamma}=H_\beta\circ H_\gamma" /> (induct on <M t="\gamma" />: at successors <M t="H_{\beta+\delta+1}(n)=H_{\beta+\delta}(n+1)" />; at limits use rule (2)). Hence <M t="H_{\omega^{\alpha+1}}(n)=H_{\omega^\alpha\cdot n}(n)=H_{\omega^\alpha}^{\,n}(n)=f_\alpha^{\,n}(n)=f_{\alpha+1}(n)" />, <M t="H_{\omega^\lambda}(n)=H_{\omega^{\lambda[n]}}(n)=f_{\lambda[n]}(n)=f_\lambda(n)" />, and <M t="H_{\omega^0}(n)=H_1(n)=n+1=f_0(n)" />. Transfinite induction on <M t="\alpha" /> finishes it.</>}
          />
        </Proof>
        <P
          zh={<>所以 Hardy 层次是“指数级更细”的尺子：FGH 的 <M t="\alpha" /> 对应 Hardy 的 <M t="\omega^\alpha" />。到 <M t="\varepsilon_0=\omega^{\varepsilon_0}" /> 两者追平：<M t="H_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow(n-1)}(n)" />，和 <M t="f_{\varepsilon_0}" /> 只差一级梯子。第 5 章初等序列的原始版本用的正是 Hardy 式外壳。</>}
          en={<>So Hardy is an exponentially finer ruler: FGH’s <M t="\alpha" /> is Hardy’s <M t="\omega^\alpha" />. At <M t="\varepsilon_0=\omega^{\varepsilon_0}" /> the two catch up: <M t="H_{\varepsilon_0}(n)=f_{\omega\uparrow\uparrow(n-1)}(n)" />, one rung behind <M t="f_{\varepsilon_0}" />. The original primitive-sequence system of Chapter 5 uses exactly this Hardy-style shell.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="slow" kicker={{ en: 'The slowest ruler', zh: '最慢的尺子' }} title={{ en: 'Slow growth: replace ω by n', zh: '慢增长：把 ω 换成 n' }}>
        <Thm kind="definition" name={{ en: 'slow-growing hierarchy (book Def 3.12)', zh: '慢增长层次（《大数理论》定义 3.12）' }}>
          <MB t="g_0(n)=0,\qquad g_{\alpha+1}(n)=g_\alpha(n)+1,\qquad g_\lambda(n)=g_{\lambda[n]}(n)." />
        </Thm>
        <Thm name={{ en: '(replace ω by n)', zh: '（把 ω 换成 n）' }}>
          <B
            zh={<p>对 <M t="\alpha<\varepsilon_0" />，<M t="g_\alpha(n)" /> 等于把 <M t="\alpha" /> 遗传标准型中的每个 <M t="\omega" /> 换成 <M t="n" /> 后算出的数。特别地 <M t="g_{\omega^\omega}(n)=n^n" />，<M t="g_{\varepsilon_0}(n)=g_{\omega\uparrow\uparrow n}(n)=n\uparrow\uparrow n" />。</p>}
            en={<p>For <M t="\alpha<\varepsilon_0" />, <M t="g_\alpha(n)" /> is the number obtained by replacing every <M t="\omega" /> in the hereditary normal form of <M t="\alpha" /> by <M t="n" />. In particular <M t="g_{\omega^\omega}(n)=n^n" /> and <M t="g_{\varepsilon_0}(n)=g_{\omega\uparrow\uparrow n}(n)=n\uparrow\uparrow n" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>记替换后的值为 <M t="R(\alpha)" />。先证对极限 <M t="\lambda" /> 有 <M t="R(\lambda[n])=R(\lambda)" />：规则 (3) 把 <M t="\omega^{\beta+1}" /> 换成 <M t="\omega^\beta\cdot n" />，替换后都是 <M t="n^{R(\beta)+1}" />；规则 (4) 归结为指数 <M t="\lambda" /> 上的同一命题；规则 (2) 保持加法。再对 <M t="\alpha" /> 超穷归纳：<M t="R(0)=0" />，<M t="R(\alpha+1)=R(\alpha)+1" />，极限处用刚证的不变性。</>}
            en={<>Write <M t="R(\alpha)" /> for the substituted value. First, <M t="R(\lambda[n])=R(\lambda)" /> for limits: rule (3) turns <M t="\omega^{\beta+1}" /> into <M t="\omega^\beta\cdot n" />, both giving <M t="n^{R(\beta)+1}" />; rule (4) reduces to the same statement for the exponent; rule (2) respects sums. Then transfinite induction on <M t="\alpha" />: <M t="R(0)=0" />, <M t="R(\alpha+1)=R(\alpha)+1" />, and limits by the invariance just shown.</>}
          />
        </Proof>
        <P
          zh={<>它慢得惊人：要到 <M t="\varepsilon_0" /> 才勉强达到 <M t="n\uparrow\uparrow n" />，大约是 FGH 的第 3 层。可它终究会追上来——第 8 章会看到，慢增长层次与 FGH 在 Buchholz 序数处“追平”，那是这门课里最令人震惊的时刻之一。</>}
          en={<>It is astonishingly slow: it needs all of <M t="\varepsilon_0" /> just to reach <M t="n\uparrow\uparrow n" />, roughly FGH level 3. Yet it eventually catches up: Chapter 8 shows the slow-growing hierarchy meets the FGH at Buchholz’s ordinal, one of the most startling moments in this course.</>}
        />
        <H3 en="A shortcut through the ladder" zh="穿过梯子的捷径" />
        <P
          zh={<>“替换”还给出一个计算捷径（《大数理论》第 3 章脚注 5）：从 <M t="\alpha" /> 反复取 <M t="[n]" /> 直到出现后继序数，结果可以直接用 <M t="n" /> 进制读出来。</>}
          en={<>Substitution also yields a shortcut (footnote 5 of the book’s Ch. 3): repeatedly taking <M t="[n]" /> from <M t="\alpha" /> until a successor appears gives a result you can read off in base <M t="n" />.</>}
        />
        <Thm name={{ en: '(the hereditary base-n shortcut)', zh: '（遗传 n 进制捷径）' }}>
          <B
            zh={<p>设 <M t="\alpha<\varepsilon_0" /> 是极限，<M t="n\ge2" />，且 <M t="\alpha" /> 的遗传标准型中出现的每个整数都 <M t="<n" />。令 <M t="N=R(\alpha)" />。把 <M t="N-1" /> 写成遗传 <M t="n" /> 进制，把 <M t="n" /> 换回 <M t="\omega" />，再加 1——这正是从 <M t="\alpha" /> 反复取 <M t="[n]" /> 到达的第一个后继序数。</p>}
            en={<p>Let <M t="\alpha<\varepsilon_0" /> be a limit, <M t="n\ge2" />, with every integer in the hereditary normal form of <M t="\alpha" /> below <M t="n" />. Let <M t="N=R(\alpha)" />. Write <M t="N-1" /> in hereditary base <M t="n" />, turn <M t="n" /> back into <M t="\omega" />, add 1: the result is the first successor reached from <M t="\alpha" /> by repeatedly taking <M t="[n]" />.</p>}
          />
        </Thm>
        <Widget title={{ en: 'Replace ω by n', zh: '把 ω 换成 n' }} hint={{ en: 'Try ω·5 with n = 3 to see why the side condition is needed.', zh: '试试 ω·5、n = 3，看看为什么需要那个附加条件。' }}>
          <ReplaceOmega />
        </Widget>
        <Expand title={{ en: 'Why the shortcut works', zh: '捷径为什么成立' }}>
          <P
            zh={<>记 <M t="D(\alpha)" /> 为反复取 <M t="[n]" /> 得到的第一个后继序数。由上一个定理的不变性，<M t="R(D(\alpha))=R(\alpha)=N" />，故 <M t="R(D(\alpha)-1)=N-1" />。由于遗传 <M t="n" /> 进制表示唯一，只需证明 <M t="D(\alpha)-1" /> 中的整数都 <M t="<n" />。</>}
            en={<>Let <M t="D(\alpha)" /> be the first successor reached by repeatedly taking <M t="[n]" />. By the invariance in the previous theorem, <M t="R(D(\alpha))=R(\alpha)=N" />, so <M t="R(D(\alpha)-1)=N-1" />. Since hereditary base-<M t="n" /> representations are unique, it suffices to show every integer in <M t="D(\alpha)-1" /> is below <M t="n" />.</>}
          />
          <P
            zh={<>对 <M t="\alpha" /> 归纳。写 <M t="\alpha=\gamma+\omega^\beta" />（拆出末项的一份），则 <M t="D(\alpha)=\gamma+D(\omega^\beta)" />。若 <M t="\beta=\delta+1" />：<M t="\omega^\beta[n]=\omega^\delta\cdot(n-1)+\omega^\delta" />，所以 <M t="D(\omega^\beta)=\omega^\delta\cdot(n-1)+D(\omega^\delta)" />（<M t="\delta=0" /> 时为 <M t="n" />）。若 <M t="\beta" /> 是极限：指数先下降到 <M t="D(\beta)" />，由归纳假设 <M t="\delta:=D(\beta)-1" /> 的整数都 <M t="<n" />，又回到前一种情形。新出现的系数只有 <M t="n-1" />，最后一项 <M t="n" /> 减 1 后也是 <M t="n-1" />，不会与相邻项合并。</>}
            en={<>Induct on <M t="\alpha" />. Write <M t="\alpha=\gamma+\omega^\beta" /> (split off one copy of the last term); then <M t="D(\alpha)=\gamma+D(\omega^\beta)" />. If <M t="\beta=\delta+1" />: <M t="\omega^\beta[n]=\omega^\delta\cdot(n-1)+\omega^\delta" />, so <M t="D(\omega^\beta)=\omega^\delta\cdot(n-1)+D(\omega^\delta)" /> (or <M t="n" /> if <M t="\delta=0" />). If <M t="\beta" /> is a limit, the exponent first descends to <M t="D(\beta)" />; by induction <M t="\delta:=D(\beta)-1" /> has all integers below <M t="n" />, and we are back in the first case. The only new coefficients are <M t="n-1" />, the final <M t="n" /> becomes <M t="n-1" /> after subtracting 1, and no terms merge.</>}
          />
          <P
            zh={<>此外我们用程序在约 14000 个随机的 <M t="(\alpha,n)" /> 上检验了它，没有例外；当条件不满足时（如 <M t="\omega\cdot5" />、<M t="n=3" />），捷径确实会失败。</>}
            en={<>We also checked it by program on about 14,000 random pairs <M t="(\alpha,n)" /> with no exception; when the side condition fails (e.g. <M t="\omega\cdot5" />, <M t="n=3" />) the shortcut does break.</>}
          />
        </Expand>
        <P
          zh={<>“写成遗传 <M t="n" /> 进制、把 <M t="n" /> 换成 <M t="\omega" />”这个动作，正是第 6 章 Goodstein 定理证明的核心：一个看上去会永远增长的整数序列，影子里藏着一个必然下降的序数。</>}
          en={<>“Write in hereditary base <M t="n" />, replace <M t="n" /> by <M t="\omega" />” is the heart of Chapter 6’s proof of Goodstein’s theorem: an integer sequence that seems to grow forever casts an ordinal shadow that must descend.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="where" kicker={{ en: 'Where we stand', zh: '复盘' }} title={{ en: 'The ruler, calibrated', zh: '校准好的尺子' }}>
        <P
          zh={<>第 2 章的刻度现在都有了精确含义：<M t="f_{m+1}" /> 是“<M t="m" /> 个箭头”，<M t="f_\omega" /> 是箭头的对角线，<M t="f_{\omega+1}" /> 超过 Graham 数，<M t="f_{\varepsilon_0}" /> 是 Cantor 标准型的尽头。每个刻度都依赖基本列的选择，而“增长率”本身仍没有完全严格的一般定义。</>}
          en={<>Chapter 2’s marks now have precise meanings: <M t="f_{m+1}" /> is “<M t="m" /> arrows,” <M t="f_\omega" /> is the diagonal of arrows, <M t="f_{\omega+1}" /> beats Graham’s number, and <M t="f_{\varepsilon_0}" /> sits at the edge of Cantor normal form. Every mark depends on the choice of fundamental sequences, and “growth rate” itself still lacks a fully rigorous general definition.</>}
        />
        <KeyIdea>
          <L
            zh={<>口号：<b>大数记号 = 序数核心 + 迭代外壳</b>。外壳（FGH、Hardy……）决定刻度怎么读，核心——你能写出多大的序数、配上什么样的基本列——决定能走多远。下一章，一个只会复制粘贴的小游戏“初等序列”，会悄无声息地一路走到 <M t="\varepsilon_0" />。</>}
            en={<>Slogan: <b>big-number notation = ordinal core + iteration shell</b>. The shell (FGH, Hardy, …) fixes how marks are read; the core — how large an ordinal you can write, with what fundamental sequences — decides how far you get. Next chapter, a little copy-and-paste game called primitive sequences quietly walks all the way up to <M t="\varepsilon_0" />.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
