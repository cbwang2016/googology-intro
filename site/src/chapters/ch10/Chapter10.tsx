import './ch10.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { DICTIONARY, PTO_ROWS } from './data'
import { FormulaLab, QuantifierClasses, UniverseVL } from './widgetsLogic'
import { BmsGrid, ReflectionExpander, ReflectionStaircase } from './widgetsReflect'
import { CardinalTower, LaverBuilder, LaverPeriods } from './widgetsLc'

const LANDMARKS: { name: string; tex: string; meaning: { en: string; zh: string }; bms: string }[] = [
  { name: 'EBO', tex: '\\psi(\\psi_I(0))', meaning: { en: 'fold the first fixed point of α ↦ Ω_α', zh: '折叠 α ↦ Ω_α 的第一个不动点' }, bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)' },
  { name: 'ψ(I)', tex: '\\psi(I)', meaning: { en: 'fold a recursively inaccessible', zh: '折叠一个递归不可达序数' }, bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(2,0,0)' },
  { name: 'JO', tex: '\\psi(\\varepsilon_{I+1})', meaning: { en: 'Jäger’s ordinal = PTO(KPi)', zh: 'Jäger 序数 = PTO(KPi)' }, bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,0)' },
  { name: 'ψ(M_ω)', tex: '\\psi(M_\\omega)', meaning: { en: 'fold ω recursively Mahlo ordinals', zh: '折叠 ω 个递归 Mahlo 序数' }, bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)' },
  { name: 'SRO', tex: '\\psi(\\varepsilon_{M+1})', meaning: { en: 'the book’s name; = PTO(KPM) (Rathjen)', zh: '书中的命名；= PTO(KPM)（Rathjen）' }, bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,0)(4,2,0)' },
  { name: 'SKO', tex: '\\psi(K_\\omega)', meaning: { en: 'fold ω Π₃-reflecting ordinals', zh: '折叠 ω 个 Π₃ 反射序数' }, bms: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)' },
  { name: 'SSO', tex: '\\psi(\\Pi_\\omega)', meaning: { en: 'all finite-order reflection', zh: '一切有限阶反射' }, bms: '(0,0,0)(1,1,1)(2,2,0)' },
  { name: 'SDO', tex: '\\psi(\\lambda\\alpha.\\Omega_{\\alpha+\\omega}{-}\\Pi_0)', meaning: { en: 'stability up to the (α+ω)-th admissible', zh: '稳定到第 α+ω 个容许序数' }, bms: '(0,0,0)(1,1,1)(2,2,1)(3,0,0)' },
  { name: 'LRO', tex: '\\psi(\\omega{-}\\pi{-}\\Pi_0)', meaning: { en: 'stable chains of every finite length', zh: '任意有限长的稳定链' }, bms: '(0,0,0)(1,1,1)(2,2,2)' },
  { name: 'TSSO', tex: '\\psi(\\omega{-}\\mathrm{proj.})', meaning: { en: 'finite-order projection; limit of 3-row BMS', zh: '有限阶投影；三行 BMS 的极限' }, bms: '(0,0,0,0)(1,1,1,1)' },
  { name: 'SHO', tex: '\\lim', meaning: { en: 'limit of all BMS; upward projection', zh: '全体 BMS 的极限；向上投影' }, bms: '(0,0,0,0,…)(1,1,1,1,…)' },
]

export default function Chapter10() {
  return (
    <>
      <Prereq
        items={[
          { en: <>Ordinals, ω₁, countable vs uncountable, Cantor’s diagonal argument (Chapter 3).</>, zh: <>序数、ω₁、可数与不可数、Cantor 对角线论证（第 3 章）。</> },
          { en: <>The bad-root rule of primitive sequences (Chapter 5).</>, zh: <>初等序列的坏根规则（第 5 章）。</> },
          { en: <>Peano arithmetic PA, Gödel’s theorems as slogans, the proof-theoretic ordinal PTO (Chapter 6).</>, zh: <>Peano 算术 PA、作为口号的哥德尔定理、证明论序数 PTO（第 6 章）。</> },
          { en: <><M t="\Omega=\omega_1^{\mathrm{CK}}" />, the collapsing function ψ, <M t="\Omega_\omega" />, BHO and BO (Chapter 8); the Bashicu matrix landmarks (Chapter 9).</>, zh: <><M t="\Omega=\omega_1^{\mathrm{CK}}" />、折叠函数 ψ、<M t="\Omega_\omega" />、BHO 与 BO（第 8 章）；Bashicu 矩阵的里程碑（第 9 章）。</> },
        ]}
      />

      {/* ================================================================ */}
      <Section id="beyond" kicker={{ en: 'The duel resumes', zh: '擂台重开' }} title={{ en: 'Running out of recursive ammunition', zh: '递归弹药告罄' }}>
        <P
          zh={<>第 9 章结束时，擂台上站着 Bashicu 矩阵，它的极限叫 SHO。我们给它起了一长串名字：TFBO、EBO、JO、SRO、SSO、LRO、TSSO……却还没说这些名字<b>是什么意思</b>。</>}
          en={<>Chapter 9 ended with the Bashicu matrix system on the stage, its limit called SHO. We recited a string of names on the way — TFBO, EBO, JO, SRO, SSO, LRO, TSSO — without saying what any of them <b>mean</b>.</>}
        />
        <P
          zh={<>回忆第 8 章的诀窍：借一个任何算法都够不着的序数 <M t="\Omega=\omega_1^{\mathrm{CK}}" />，让它在 ψ 里代表“我下面所有递归的东西”，再折叠回来。够不着的序数越强，折出来的递归序数就越大。</>}
          en={<>Recall the trick of Chapter 8: borrow an ordinal no algorithm can reach, <M t="\Omega=\omega_1^{\mathrm{CK}}" />, let it stand inside ψ for “everything recursive below me”, then fold it back down. The stronger the unreachable ordinal, the bigger the recursive ordinal that comes out.</>}
        />
        <P
          zh={<>那么，“更强的够不着”到底是什么意思？要回答，就得说出这些序数是用什么语言定义的：<b>集合与逻辑</b>。</>}
          en={<>So what does “more strongly unreachable” mean? To answer, we must speak the language these ordinals are defined in: <b>sets and logic</b>.</>}
        />
        <B
          zh={
            <ul>
              <li><b>工具箱</b>：集合、形式语言、满足关系、量词层级、哥德尔定理、宇宙 V 与 L。第 13 章的 Rayo 数直接建在这里。</li>
              <li><b>阶梯</b>：容许、递归不可达、递归 Mahlo、Π₃ 反射……再到稳定与投影，以及 BMS 里程碑的真正含义。</li>
              <li><b>天空</b>：大基数，以及一个只有大基数才能（目前）证明的有限谜题——Laver 表。</li>
            </ul>
          }
          en={
            <ul>
              <li><b>Toolkit</b>: sets, a formal language, satisfaction, the quantifier hierarchy, Gödel’s theorems, the universes V and L. Chapter 13’s Rayo number is built directly on this.</li>
              <li><b>Ladder</b>: admissible, recursively inaccessible, recursively Mahlo, Π₃-reflecting, … then stability and projection, and what the BMS landmarks really mean.</li>
              <li><b>Sky</b>: large cardinals, and a finite puzzle that (so far) only a large cardinal can solve — Laver tables.</li>
            </ul>
          }
        />
      </Section>

      {/* ================================================================ */}
      <Section id="sets" kicker={{ en: 'Toolkit I', zh: '工具箱 · 一' }} title={{ en: 'Everything is a set', zh: '万物皆集合' }}>
        <H3 en="Numbers out of nothing" zh="从空无中造出数" />
        <P
          zh={<>现代数学只用一种东西：<Term en="set" zh="集合" />，以及一种关系：属于 <M t="\in" />。数也要用集合造出来。von Neumann（1923）的办法是：</>}
          en={<>Modern mathematics is built from one kind of object, the <Term en="set" zh="集合" />, and one relation, membership <M t="\in" />. Even numbers must be made of sets. Von Neumann’s recipe (1923):</>}
        />
        <MB t="0=\varnothing,\quad 1=\{0\},\quad 2=\{0,1\},\quad 3=\{0,1,2\},\quad\ldots,\quad n+1=n\cup\{n\}." />
        <P
          zh={<>于是 <M t="n" /> 恰好有 <M t="n" /> 个元素，而且 <M t="m<n" /> 当且仅当 <M t="m\in n" />。“小于”就是“属于”。</>}
          en={<>So <M t="n" /> has exactly <M t="n" /> elements, and <M t="m<n" /> exactly when <M t="m\in n" />. “Less than” <i>is</i> “element of”.</>}
        />
        <P
          zh={<>同样的配方一路用到无穷：<M t="\omega=\{0,1,2,\ldots\}" />，<M t="\omega+1=\omega\cup\{\omega\}" />。每个序数就是比它小的所有序数组成的集合。</>}
          en={<>The same recipe runs into the infinite: <M t="\omega=\{0,1,2,\ldots\}" />, <M t="\omega+1=\omega\cup\{\omega\}" />. Every ordinal is the set of all smaller ordinals.</>}
        />
        <Thm kind="definition" name={{ en: 'ordinal (von Neumann)', zh: '序数（von Neumann）' }}>
          <P
            zh={<>集合 <M t="A" /> 是<b>传递的</b>，如果它的每个元素也是它的子集。<b>序数</b>就是一个被 <M t="\in" /> 良序的传递集合。每个良序都恰好同构于一个序数（第 3 章的“序型”）。</>}
            en={<>A set <M t="A" /> is <b>transitive</b> if every element of <M t="A" /> is also a subset of <M t="A" />. An <b>ordinal</b> is a transitive set well-ordered by <M t="\in" />. Every well-order is isomorphic to exactly one ordinal (Chapter 3’s “order type”).</>}
          />
        </Thm>

        <H3 en="The cumulative hierarchy" zh="累积层级" />
        <P
          zh={<>把所有集合按“出生时间”排队：</>}
          en={<>Line up all sets by their “date of birth”:</>}
        />
        <MB t="V_0=\varnothing,\qquad V_{\alpha+1}=\mathcal P(V_\alpha)\ \ (\text{all subsets}),\qquad V_\lambda=\bigcup_{\alpha<\lambda}V_\alpha\ \ (\lambda\text{ limit})." />
        <P
          zh={<>有限层的大小是 0, 1, 2, 4, 16, 65536, <M t="2^{65536}" />……正是第 1 章的指数塔 <M t="2\uparrow\uparrow(k-1)" />。<M t="V_\omega" /> 由所有<b>遗传有限集合</b>组成，第 13 章的 Rayo 公式游乐场就搭在这里。</>}
          en={<>The finite stages have sizes 0, 1, 2, 4, 16, 65536, <M t="2^{65536}" />, … — Chapter 1’s towers <M t="2\uparrow\uparrow(k-1)" />. <M t="V_\omega" /> consists of all <b>hereditarily finite sets</b>; Chapter 13’s Rayo playground lives there.</>}
        />
        <P
          zh={<>宇宙 <M t="V=\bigcup_\alpha V_\alpha" /> 是所有层的并。它太大了，本身不是集合，而是一个<Term en="proper class" zh="真类" />。</>}
          en={<>The universe <M t="V=\bigcup_\alpha V_\alpha" /> is the union of all stages. It is too big to be a set; it is a <Term en="proper class" zh="真类" />.</>}
        />

        <H3 en="Russell’s paradox" zh="Russell 悖论" />
        <P
          zh={<>早期集合论默认：任何性质都能聚成一个集合。1901 年 Russell 考虑“所有不属于自身的集合”：<M t="R=\{x: x\notin x\}" />。那么 <M t="R\in R" /> 当且仅当 <M t="R\notin R" />。</>}
          en={<>Early set theory assumed any property collects into a set. In 1901 Russell considered “the set of all sets that are not members of themselves”, <M t="R=\{x: x\notin x\}" />. Then <M t="R\in R" /> if and only if <M t="R\notin R" />.</>}
        />
        <Thm name={{ en: 'Russell', zh: 'Russell' }}>
          <P
            zh={<>在任何结构中，都不存在这样一个 <M t="r" />：对每个 <M t="x" />，<M t="x\in r" /> 当且仅当 <M t="x\notin x" />。</>}
            en={<>In any structure whatsoever, there is no <M t="r" /> such that for every <M t="x" />: <M t="x\in r" /> iff <M t="x\notin x" />.</>}
          />
        </Thm>
        <Proof>
          <L zh={<>取 <M t="x=r" />，得到 <M t="r\in r\iff r\notin r" />，矛盾。</>} en={<>Take <M t="x=r" />: then <M t="r\in r\iff r\notin r" />, a contradiction.</>} />
        </Proof>
        <P
          zh={<>注意这是纯逻辑的定理，不依赖任何集合公理。现代集合论 ZFC 的对策是<b>分离公理</b>：只能从一个<b>已有的</b>集合里切出子集，不能凭空聚集“所有满足某性质的东西”。</>}
          en={<>Notice this is a theorem of pure logic, needing no axioms at all. Modern set theory, ZFC, responds with the <b>separation axiom</b>: you may only carve a subset out of an <b>existing</b> set, never collect “everything with a property” from thin air.</>}
        />
        <Expand kind="detail" title={{ en: 'The axioms of ZFC in plain words', zh: 'ZFC 公理（白话版）' }}>
          <B
            zh={
              <ol>
                <li><b>外延</b>：元素相同的两个集合相等。</li>
                <li><b>正则（基础）</b>：每个非空集合都有一个与它不相交的元素；于是没有 <M t="x\in x" />，也没有无穷下降的 <M t="\in" /> 链。</li>
                <li><b>分离</b>（每个公式一条）：对集合 <M t="A" /> 和公式 φ，<M t="\{x\in A:\varphi(x)\}" /> 是集合。</li>
                <li><b>对集</b>：对任意 <M t="a,b" />，<M t="\{a,b\}" /> 是集合。</li>
                <li><b>并集</b>：一族集合的所有元素组成集合。</li>
                <li><b>幂集</b>：<M t="A" /> 的所有子集组成集合 <M t="\mathcal P(A)" />。</li>
                <li><b>无限</b>：存在一个包含 0 且对 <M t="n\mapsto n\cup\{n\}" /> 封闭的集合；于是 ω 存在。</li>
                <li><b>替换</b>（每个公式一条）：集合在一个可定义映射下的像仍是集合。没有它，连 <M t="\omega\cdot2" /> 都造不出来。</li>
                <li><b>选择</b>（C）：每族非空集合都有选择函数。</li>
              </ol>
            }
            en={
              <ol>
                <li><b>Extensionality</b>: sets with the same elements are equal.</li>
                <li><b>Foundation</b>: every non-empty set has an element disjoint from it; so no <M t="x\in x" /> and no infinite descending <M t="\in" />-chains.</li>
                <li><b>Separation</b> (one per formula): for a set <M t="A" /> and formula φ, <M t="\{x\in A:\varphi(x)\}" /> is a set.</li>
                <li><b>Pairing</b>: for any <M t="a,b" />, <M t="\{a,b\}" /> is a set.</li>
                <li><b>Union</b>: the elements of the members of a set form a set.</li>
                <li><b>Power set</b>: all subsets of <M t="A" /> form a set <M t="\mathcal P(A)" />.</li>
                <li><b>Infinity</b>: some set contains 0 and is closed under <M t="n\mapsto n\cup\{n\}" />; hence ω exists.</li>
                <li><b>Replacement</b> (one per formula): the image of a set under a definable map is a set. Without it, not even <M t="\omega\cdot2" /> can be built.</li>
                <li><b>Choice</b> (the C): every family of non-empty sets has a choice function.</li>
              </ol>
            }
          />
        </Expand>
      </Section>

      {/* ================================================================ */}
      <Section id="language" kicker={{ en: 'Toolkit II', zh: '工具箱 · 二' }} title={{ en: 'A language with five symbols', zh: '只有五个符号的语言' }}>
        <P
          zh={<>“性质”这个词太含糊，Russell 悖论就是从含糊里钻出来的。所以我们把“能说的话”精确化成一门形式语言。第 13 章会逐字使用下面这个定义。</>}
          en={<>“Property” is too vague a word — Russell’s paradox crawled out of that vagueness. So we pin down “what can be said” as a formal language. Chapter 13 uses the following definition word for word.</>}
        />
        <Thm kind="definition" name={{ en: 'first-order formulas of set theory', zh: '集合论的一阶公式' }}>
          <B
            zh={
              <>
                <p>变元是 <M t="x_1,x_2,x_3,\ldots" />。公式按以下规则生成，<b>除此之外别无其他</b>：</p>
                <ol>
                  <li>原子公式：<M t="x_i\in x_j" /> 和 <M t="x_i=x_j" />；</li>
                  <li>若 φ 是公式，则 <M t="(\neg\varphi)" /> 是公式；</li>
                  <li>若 φ、ψ 是公式，则 <M t="(\varphi\wedge\psi)" /> 是公式；</li>
                  <li>若 φ 是公式，则 <M t="\exists x_i(\varphi)" /> 是公式。</li>
                </ol>
              </>
            }
            en={
              <>
                <p>The variables are <M t="x_1,x_2,x_3,\ldots" />. Formulas are generated by these rules, <b>and nothing else</b>:</p>
                <ol>
                  <li>atomic formulas: <M t="x_i\in x_j" /> and <M t="x_i=x_j" />;</li>
                  <li>if φ is a formula, so is <M t="(\neg\varphi)" />;</li>
                  <li>if φ and ψ are formulas, so is <M t="(\varphi\wedge\psi)" />;</li>
                  <li>if φ is a formula, so is <M t="\exists x_i(\varphi)" />.</li>
                </ol>
              </>
            }
          />
        </Thm>
        <P
          zh={<>其余符号都是缩写：<M t="\varphi\vee\psi" /> 是 <M t="\neg(\neg\varphi\wedge\neg\psi)" />，<M t="\varphi\to\psi" /> 是 <M t="\neg(\varphi\wedge\neg\psi)" />，<M t="\forall x\,\varphi" /> 是 <M t="\neg\exists x\,\neg\varphi" />，有界量词 <M t="\exists x\in y\,\varphi" /> 是 <M t="\exists x(x\in y\wedge\varphi)" />。</>}
          en={<>Everything else is shorthand: <M t="\varphi\vee\psi" /> means <M t="\neg(\neg\varphi\wedge\neg\psi)" />, <M t="\varphi\to\psi" /> means <M t="\neg(\varphi\wedge\neg\psi)" />, <M t="\forall x\,\varphi" /> means <M t="\neg\exists x\,\neg\varphi" />, and the bounded quantifier <M t="\exists x\in y\,\varphi" /> means <M t="\exists x(x\in y\wedge\varphi)" />.</>}
        />
        <P
          zh={<>变元在 <M t="\exists x_i(\ldots)" /> 的括号里出现是<b>约束</b>的，否则是<b>自由</b>的。没有自由变元的公式叫<Term en="sentence" zh="语句" />。只有一个自由变元 <M t="x_1" /> 的公式记作 <M t="\varphi(x_1)" />，它描述 <M t="x_1" /> 的一种性质。</>}
          en={<>An occurrence of a variable inside the brackets of <M t="\exists x_i(\ldots)" /> is <b>bound</b>; otherwise it is <b>free</b>. A formula with no free variables is a <Term en="sentence" zh="语句" />. A formula whose only free variable is <M t="x_1" /> is written <M t="\varphi(x_1)" />; it expresses a property of <M t="x_1" />.</>}
        />

        <H3 en="When is a formula true?" zh="公式何时为真？" />
        <P
          zh={<>公式本身只是一串符号。要谈“真”，需要一个<Term en="structure" zh="结构" />：一个非空论域 <M t="D" />，加上一个用来解释 <M t="\in" /> 的二元关系 <M t="E" />。再加一个<Term en="variable assignment" zh="变元赋值" /> <M t="s" />，把每个变元指派到 <M t="D" /> 中的元素。</>}
          en={<>A formula is just a string of symbols. To speak of truth we need a <Term en="structure" zh="结构" />: a non-empty domain <M t="D" /> with a binary relation <M t="E" /> that interprets <M t="\in" />. We also need a <Term en="variable assignment" zh="变元赋值" /> <M t="s" /> sending each variable to an element of <M t="D" />.</>}
        />
        <Thm kind="definition" name={{ en: 'satisfaction (Tarski 1933)', zh: '满足关系（Tarski 1933）' }}>
          <MB t="\begin{aligned}(D,E,s)&\models x_i\in x_j &&\iff s(x_i)\mathrel{E}s(x_j)\\(D,E,s)&\models x_i=x_j &&\iff s(x_i)=s(x_j)\\(D,E,s)&\models\neg\varphi &&\iff \text{not }(D,E,s)\models\varphi\\(D,E,s)&\models\varphi\wedge\psi &&\iff \text{both hold}\\(D,E,s)&\models\exists x_i(\varphi) &&\iff (D,E,s[x_i\mapsto d])\models\varphi\ \text{for some } d\in D\end{aligned}" />
          <P
            zh={<>这里 <M t="s[x_i\mapsto d]" /> 表示只把 <M t="x_i" /> 改成 <M t="d" /> 的赋值。</>}
            en={<>Here <M t="s[x_i\mapsto d]" /> is the assignment that changes only <M t="x_i" />, to <M t="d" />.</>}
          />
        </Thm>
        <P
          zh={<>真假只取决于自由变元的值；对语句来说，在一个结构里它要么真要么假。下面这台机器就是这个定义的逐字实现。</>}
          en={<>Truth depends only on the values of the free variables; a sentence is simply true or false in a structure. The machine below implements this definition clause by clause.</>}
        />
        <Widget
          title={{ en: 'Formula lab: truth in small structures', zh: '公式实验室：小结构中的真假' }}
          hint={{
            en: 'Numerals are abbreviated 0–3. Green = the set your formula defines; the trace shows the witnesses found.',
            zh: '数 0–3 用缩写表示。绿色 = 公式定义的集合；推导中显示找到的见证。',
          }}
        >
          <FormulaLab />
        </Widget>
        <P
          zh={<>几个值得一试的发现：<b>对集公理</b>在 V₄ 中为假（取两个最“晚出生”的集合，它们的对集在 V₅ 才出现），所以没有一个有限层是 ZFC 的模型；<b>正则公理</b>在 “a ∈ a” 中为假；而 <b>“Russell 集存在”</b> 在你画的任何结构里都为假。</>}
          en={<>Things worth trying: the <b>pairing axiom</b> is false in V₄ (take two of the youngest sets; their pair is born only in V₅), so no finite stage is a model of ZFC. <b>Foundation</b> fails in “a ∈ a”. And <b>“Russell’s set exists”</b> is false in every structure you can draw.</>}
        />

        <H3 en="Definable sets" zh="可定义集合" />
        <P
          zh={<>一个公式 <M t="\varphi(x_1)" /> 在结构 <M t="A" /> 中<b>定义</b>了子集 <M t="\{a\in A: A\models\varphi[a]\}" />。如果这个子集恰好只有一个元素，就说 φ <b>命名</b>了它：<M t="\neg\exists x_2(x_2\in x_1)" /> 命名了 0。</>}
          en={<>A formula <M t="\varphi(x_1)" /> <b>defines</b> the subset <M t="\{a\in A: A\models\varphi[a]\}" /> of a structure <M t="A" />. If that subset has exactly one element, φ <b>names</b> it: <M t="\neg\exists x_2(x_2\in x_1)" /> names 0.</>}
        />
        <P
          zh={<>“用多少个符号能命名一个数”——这正是第 13 章 Rayo 数的出发点。而“只收集可定义的子集”，正是下一节宇宙 L 的造法。</>}
          en={<>“How many symbols does it take to name a number?” is exactly where Chapter 13’s Rayo number starts. And “collect only the definable subsets” is how the universe L of the next section is built.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="quantifiers" kicker={{ en: 'Toolkit III', zh: '工具箱 · 三' }} title={{ en: 'Counting quantifier alternations', zh: '数一数量词的交替' }}>
        <P
          zh={<>一句话有多“难”，不看长短，看量词的模式。只含有界量词 <M t="\exists x\in y" />、<M t="\forall x\in y" /> 的公式叫 <M t="\Delta_0" />：它只在已知的集合里翻找，像一次有限检查。</>}
          en={<>How “hard” a statement is depends not on its length but on its pattern of quantifiers. A formula with only bounded quantifiers <M t="\exists x\in y" />, <M t="\forall x\in y" /> is <M t="\Delta_0" />: it only searches inside sets already in hand, like a finite check.</>}
        />
        <Thm kind="definition" name={{ en: 'the Lévy hierarchy (book Def 8.16–8.17)', zh: 'Lévy 层级（书定义 8.16–8.17）' }}>
          <MB t="\begin{aligned}&\Sigma_0=\Pi_0=\Delta_0,\\ &\Sigma_{n+1}:\ \exists x_1\cdots\exists x_k\,\varphi\quad(\varphi\in\Pi_n),\\ &\Pi_{n+1}:\ \forall x_1\cdots\forall x_k\,\varphi\quad(\varphi\in\Sigma_n).\end{aligned}" />
          <P
            zh={<>一个公式“是 Σₙ 的”，指它逻辑等价于这种形式。简单说：数<b>交替的量词块</b>个数，看第一块是 ∃ 还是 ∀。</>}
            en={<>A formula “is Σₙ” if it is logically equivalent to one of this shape. In short: count the <b>alternating blocks</b> of unbounded quantifiers, and note whether the first block is ∃ or ∀.</>}
          />
        </Thm>
        <Widget title={{ en: 'Where famous statements live', zh: '名命题住在哪一层' }} hint={{ en: 'Statements of arithmetic work the same way: quantifiers over numbers, with bounded ones (∃p < n) counting as a finite check.', zh: '算术命题也一样：量词跑遍自然数，有界量词（∃p < n）只算一次有限检查。' }}>
          <QuantifierClasses />
        </Widget>
        <P
          zh={<>注意那个反直觉的结论：<b>真的 Σ₁ 命题总能被证明</b>——把见证找出来写下即可，连 PA 都做得到。所以“TREE(3) 有限”在 PA 里有证明，只不过最短的证明长得无法想象。</>}
          en={<>Note the counter-intuitive consequence: <b>a true Σ₁ statement is always provable</b> — exhibit the witness and check it, which even PA can do. So “TREE(3) is finite” has a proof in PA; it is just unimaginably long.</>}
        />
        <P
          zh={<>麻烦从 Π₁ 开始：一个真的 Π₁ 命题可能永远证不出来，Con(ZFC) 就是。而第 6 章里“某函数处处有定义”的那些命题——Goodstein、九头蛇——都住在 Π₂。</>}
          en={<>Trouble begins at Π₁: a true Π₁ statement may be unprovable, Con(ZFC) for one. And Chapter 6’s “this function is total” statements — Goodstein, the hydra — all live at Π₂.</>}
        />
        <Expand kind="detail" title={{ en: 'Why bounded quantifiers are “free”', zh: '为什么有界量词“不算数”' }}>
          <P
            zh={<>在 Δ₀ 公式里，有界量词只搜索给定集合的元素，真假在任何包含这些集合的传递集合中都一样（“绝对”）。在 KP 这样带有收集公理的理论里，Σₙ 公式前面加有界量词仍等价于 Σₙ 公式。实验室里显示的层级用的就是这个约定。</>}
            en={<>In a Δ₀ formula the bounded quantifiers only search elements of given sets, so its truth value is the same in every transitive set containing them (it is “absolute”). In theories with a collection axiom, such as KP, a bounded quantifier in front of a Σₙ formula still yields a Σₙ formula. The class shown in the formula lab uses this convention.</>}
          />
        </Expand>
      </Section>

      {/* ================================================================ */}
      <Section id="godel" kicker={{ en: 'Toolkit IV', zh: '工具箱 · 四' }} title={{ en: 'Truth, proof and Gödel', zh: '真、证明与哥德尔' }}>
        <H3 en="Theories and models" zh="理论与模型" />
        <P
          zh={<><Term en="theory" zh="理论" /> T 就是一组语句（公理）。T 的<Term en="model" zh="模型" />是让所有公理都为真的结构。<M t="T\vdash\varphi" /> 表示 φ 能从 T 出发用有限的形式证明推出；<M t="T\models\varphi" /> 表示 φ 在 T 的每个模型中都为真。</>}
          en={<>A <Term en="theory" zh="理论" /> T is a set of sentences, its axioms. A <Term en="model" zh="模型" /> of T is a structure in which all of them are true. <M t="T\vdash\varphi" /> means φ follows from T by a finite formal proof; <M t="T\models\varphi" /> means φ is true in every model of T.</>}
        />
        <P
          zh={<>如果有一个算法能逐条列出 T 的公理，就说 T 是<b>递归可枚举公理化</b>的。PA 和 ZFC 都是（第 11 章会把“算法”严格化为图灵机）。</>}
          en={<>T is <b>recursively axiomatized</b> if some algorithm lists its axioms. PA and ZFC both are (Chapter 11 makes “algorithm” precise with Turing machines).</>}
        />
        <Thm name={{ en: 'Gödel’s completeness theorem (1929)', zh: '哥德尔完备性定理（1929）' }}>
          <P
            zh={<><M t="T\models\varphi\iff T\vdash\varphi" />。等价地：每个一致（推不出矛盾）的理论都有模型。</>}
            en={<><M t="T\models\varphi\iff T\vdash\varphi" />. Equivalently: every consistent theory (one that proves no contradiction) has a model.</>}
          />
        </Thm>
        <H3 en="The incompleteness theorems" zh="不完备性定理" />
        <Thm name={{ en: 'Gödel’s first incompleteness theorem (1931; Rosser 1936)', zh: '哥德尔第一不完备性定理（1931；Rosser 1936）' }}>
          <P
            zh={<>设 T 一致、递归可枚举公理化，并且包含 PA（其实很弱的算术就够了）。则存在一个算术语句 G，使得 <M t="T\nvdash G" /> 且 <M t="T\nvdash\neg G" />。G 可以取成 Π₁ 语句。</>}
            en={<>Let T be consistent, recursively axiomatized, and contain PA (much weaker arithmetic suffices). Then there is an arithmetic sentence G with <M t="T\nvdash G" /> and <M t="T\nvdash\neg G" />. G can be taken to be Π₁.</>}
          />
        </Thm>
        <Thm name={{ en: 'Gödel’s second incompleteness theorem', zh: '哥德尔第二不完备性定理' }}>
          <P
            zh={<>同样的 T 若一致，则 <M t="T\nvdash\mathrm{Con}(T)" />。其中 Con(T) 是 Π₁ 语句“不存在 T 中 0 = 1 的证明”。</>}
            en={<>For such T, if T is consistent then <M t="T\nvdash\mathrm{Con}(T)" />, where Con(T) is the Π₁ sentence “there is no T-proof of 0 = 1”.</>}
          />
        </Thm>
        <Quiz
          q={{
            zh: <p>PA 证明不了它的哥德尔语句 G（G 说的是“我不能在 PA 中被证明”）。那么 G 在 PA 的<b>每一个</b>模型中都为真吗？</p>,
            en: <p>PA cannot prove its Gödel sentence G (which says “I am not provable in PA”). Is G true in <b>every</b> model of PA?</p>,
          }}
          options={[
            { zh: <p>是：G 说自己不可证，而它确实不可证，所以处处为真。</p>, en: <p>Yes: G says it is unprovable, and it is — so it is true everywhere.</p> },
            { zh: <p>不是：有些 PA 的模型里 G 为假。</p>, en: <p>No: G is false in some models of PA.</p> },
            { zh: <p>问题没有意义：G 既不真也不假。</p>, en: <p>The question is meaningless: G is neither true nor false.</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>如果 G 在每个模型中都真，由完备性定理就有 PA ⊢ G，矛盾。所以存在 PA 的<b>非标准模型</b>，其中 ¬G 成立：模型“相信”存在一个 G 的证明，但它的编码是一个比所有标准自然数都大的非标准数。G 在标准模型 ℕ 中是真的。</p>,
            en: <p>If G were true in every model, completeness would give PA ⊢ G, a contradiction. So some <b>non-standard model</b> of PA satisfies ¬G: it “believes” there is a proof of G, coded by a non-standard number larger than every standard natural number. In the standard model ℕ, G is true.</p>,
          }}
        />
        <H3 en="Löwenheim–Skolem" zh="Löwenheim–Skolem 定理" />
        <Thm name={{ en: 'downward Löwenheim–Skolem (1915/1920)', zh: '向下 Löwenheim–Skolem 定理（1915/1920）' }}>
          <P
            zh={<>可数语言中的理论若有无穷模型，就有<b>可数</b>模型。</>}
            en={<>A theory in a countable language that has an infinite model also has a <b>countable</b> model.</>}
          />
        </Thm>
        <P
          zh={<>这导出“Skolem 悖论”：ZFC 证明存在不可数集合，可它（若一致）却有一个可数模型。化解在于：“不可数”在模型内部的意思是“模型里没有双射”，而外面看得到的双射可能不在模型里。</>}
          en={<>Hence “Skolem’s paradox”: ZFC proves uncountable sets exist, yet (if consistent) it has a countable model. The resolution: inside the model, “uncountable” means “no bijection <i>in the model</i>”; a bijection visible from outside need not belong to it.</>}
        />
        <P
          zh={<>这对我们很要紧：本章所有“看起来巨大”的序数，都是“最小的使 <M t="L_\alpha" /> 满足某理论的 α”这一类东西，而它们全都是<b>可数</b>序数。</>}
          en={<>This matters for us: every “enormous-sounding” ordinal in this chapter is of the form “the least α such that <M t="L_\alpha" /> satisfies some theory” — and all of them are <b>countable</b>.</>}
        />

        <H3 en="Two universes: V and L" zh="两个宇宙：V 与 L" />
        <P
          zh={<>宇宙 V 每一层取<b>全部</b>子集。Gödel（1938）的<Term en="constructible universe" zh="可构造宇宙" /> L 每一层只取<b>可定义</b>的子集：</>}
          en={<>The universe V takes <b>all</b> subsets at each stage. Gödel’s (1938) <Term en="constructible universe" zh="可构造宇宙" /> L takes only the <b>definable</b> ones:</>}
        />
        <MB t="L_0=\varnothing,\qquad L_{\alpha+1}=\mathrm{Def}(L_\alpha),\qquad L_\lambda=\bigcup_{\alpha<\lambda}L_\alpha," />
        <P
          zh={<>其中 <M t="\mathrm{Def}(A)" /> 是能用带参数（参数取自 A）的一阶公式在结构 <M t="(A,\in)" /> 中定义的子集全体。</>}
          en={<>where <M t="\mathrm{Def}(A)" /> is the collection of subsets of A definable over <M t="(A,\in)" /> by a first-order formula with parameters from A.</>}
        />
        <Widget title={{ en: 'Where V and L part ways', zh: 'V 与 L 在哪里分道扬镳' }} hint={{ en: 'Click a stage. The gold spine is the ordinals: both universes contain all of them.', zh: '点击某一层。金色的中轴是序数：两个宇宙都包含全部序数。' }}>
          <UniverseVL />
        </Widget>
        <P
          zh={<>V = L 既不能被 ZFC 证明也不能被否证。本章的反射、稳定序数都是在 L 里按“<M t="L_\alpha" /> 有什么封闭性”来定义的；而到了大基数那一节，我们会看到可测基数直接推出 V ≠ L。</>}
          en={<>V = L is neither provable nor refutable in ZFC. The reflecting and stable ordinals of this chapter are all defined inside L, by asking what closure properties <M t="L_\alpha" /> has; and in the large-cardinal section we will see that a measurable cardinal forces V ≠ L.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="reflection" kicker={{ en: 'The ladder', zh: '阶梯' }} title={{ en: 'Reflection: big ordinals that look small from inside', zh: '反射：从里面看像小序数的大序数' }}>
        <H3 en="Why Ω works" zh="Ω 为什么好用" />
        <P
          zh={<>第 8 章的 <M t="\Omega=\omega_1^{\mathrm{CK}}" /> 是第一个不能写成“自然数上可计算良序的序型”的序数。它在 ψ 里能折叠，是因为从下面出发的任何递归过程都到不了它。</>}
          en={<>Chapter 8’s <M t="\Omega=\omega_1^{\mathrm{CK}}" /> is the first ordinal that is not the order type of a computable well-order of ℕ. It folds inside ψ because no recursive process from below can reach it.</>}
        />
        <P
          zh={<>集合论给出另一种刻画：<M t="L_\Omega" /> 是 <Term en="Kripke–Platek set theory KP" zh="Kripke–Platek 集合论 KP" /> 的模型。KP 是 ZFC 里“足够做递归构造”的那一小部分（对集、并集、Δ₀ 分离、Δ₀ 收集、基础）。满足它的 <M t="L_\alpha" /> 叫<Term en="admissible" zh="容许" />，而 Ω 正是 ω 之上最小的容许序数。</>}
          en={<>Set theory characterizes it differently: <M t="L_\Omega" /> is a model of <Term en="Kripke–Platek set theory KP" zh="Kripke–Platek 集合论 KP" />, the fragment of ZFC that is “just enough to run recursive constructions” (pairing, union, Δ₀-separation, Δ₀-collection, foundation). Such α are called <Term en="admissible" zh="容许" />, and Ω is the least admissible ordinal above ω.</>}
        />
        <H3 en="The reflection definition" zh="反射的定义" />
        <Thm kind="definition" name={{ en: 'Πₙ-reflecting (book Def 9.5–9.6)', zh: 'Πₙ 反射（书定义 9.5–9.6）' }}>
          <P
            zh={<>设 X 是一个序数类。称 α <b>在 X 上 Πₙ 反射</b>，如果：对每个参数取自 <M t="L_\alpha" /> 的 Πₙ 公式 φ，只要 <M t="L_\alpha\models\varphi" />，就存在 <M t="\beta\in X\cap\alpha" />，使参数都在 <M t="L_\beta" /> 中且 <M t="L_\beta\models\varphi" />。X 是全体序数时，简称 α 是 Πₙ 反射的。</>}
            en={<>Let X be a class of ordinals. α is <b>Πₙ-reflecting on X</b> if for every Πₙ formula φ with parameters from <M t="L_\alpha" />: whenever <M t="L_\alpha\models\varphi" />, there is <M t="\beta\in X\cap\alpha" /> with the parameters in <M t="L_\beta" /> and <M t="L_\beta\models\varphi" />. When X is all ordinals we just say α is Πₙ-reflecting.</>}
          />
        </Thm>
        <P
          zh={<>口号：<b>凡是 <M t="L_\alpha" /> 在 Πₙ 复杂度上能说的话，某个更早的阶段早就说过了。</b>从里面用 Πₙ 语句去看，α 和比它小的序数分不出来。n 越大，要求越苛刻，序数越大。</>}
          en={<>Slogan: <b>whatever <M t="L_\alpha" /> can say at complexity Πₙ, some earlier stage already said.</b> Seen from inside with Πₙ sentences, α is indistinguishable from smaller ordinals. Larger n means a stricter demand and a bigger ordinal.</>}
        />
        <Thm name={{ en: 'the first two rungs', zh: '最下面两级' }}>
          <P
            zh={<>(a) α 是 Π₁ 反射的，当且仅当 α 是极限序数。(b) 对 α &gt; ω，α 是 Π₂ 反射的，当且仅当 α 是容许序数（Richter–Aczel 1974）。</>}
            en={<>(a) α is Π₁-reflecting iff α is a limit ordinal. (b) For α &gt; ω, α is Π₂-reflecting iff α is admissible (Richter–Aczel 1974).</>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>只证 (a)。若 <M t="\alpha=\gamma+1" />，取一个属于 <M t="L_\alpha" /> 却不属于 <M t="L_\gamma" /> 的参数 p，语句 <M t="p=p" /> 无法反射到更早的阶段。若 α 是极限，参数都已出现在某个 <M t="L_\beta,\ \beta<\alpha" /> 中；Π₁ 语句只说“对所有 x……”，把论域缩小到传递子集 <M t="L_\beta" /> 不会让它变假（Δ₀ 部分是绝对的）。</>}
            en={<>We prove (a). If <M t="\alpha=\gamma+1" />, take a parameter p in <M t="L_\alpha" /> but not in <M t="L_\gamma" />; the sentence <M t="p=p" /> cannot reflect to any earlier stage. If α is a limit, the parameters already lie in some <M t="L_\beta,\ \beta<\alpha" />; a Π₁ sentence only says “for all x, …”, and shrinking the domain to the transitive <M t="L_\beta" /> cannot make it false (its Δ₀ part is absolute).</>}
          />
        </Proof>
        <P
          zh={<>所以 Π₂ 反射序数就是容许序数 <M t="\Omega,\Omega_2,\Omega_3,\ldots" />。在第 8 章，<M t="\Omega_n" /> 是“下一个非递归序数”；在本章用到的高度以下，两种说法一致。</>}
          en={<>So the Π₂-reflecting ordinals are the admissibles <M t="\Omega,\Omega_2,\Omega_3,\ldots" />. In Chapter 8, <M t="\Omega_n" /> meant “the next non-recursive ordinal”; below the heights used in this chapter the two readings agree.</>}
        />
        <Expand kind="deeper" title={{ en: 'The non-Gandy phenomenon', zh: '非 Gandy 现象' }}>
          <P
            zh={<>“α 之后的下一个容许序数”和“α 之后的下一个非递归序数”并不总是相同。在通常遇到的 α 上二者相同；不相同时，α 叫做<b>非 Gandy</b> 的。最小的非 Gandy 序数非常高（书中把它放在稳定记号 <M t="\lambda\alpha.\Omega_{\alpha+1}{-}\Pi_2" /> 的位置），远在本章的反射阶梯之上。</>}
            en={<>“The next admissible after α” and “the next non-recursive ordinal after α” need not coincide. For the α met in practice they agree; when they differ, α is called <b>non-Gandy</b>. The least non-Gandy ordinal is very high (the book places it at the stability notation <M t="\lambda\alpha.\Omega_{\alpha+1}{-}\Pi_2" />), far above the reflection ladder of this chapter.</>}
          />
        </Expand>

        <H3 en="A limit of admissibles" zh="容许序数的极限" />
        <Quiz
          q={{
            zh: <p><M t="\Omega_\omega=\sup\{\Omega,\Omega_2,\Omega_3,\ldots\}" /> 是无穷多个“任何递归过程都到不了”的序数的极限。它自己是容许序数吗？</p>,
            en: <p><M t="\Omega_\omega=\sup\{\Omega,\Omega_2,\Omega_3,\ldots\}" /> is a limit of infinitely many ordinals that “no recursive process can reach”. Is it itself admissible?</p>,
          }}
          options={[
            { zh: <p>是：够不着的东西的极限，当然更够不着。</p>, en: <p>Yes: a limit of unreachable things is even more unreachable.</p> },
            { zh: <p>不是：它能被一个递归的序列从下面够到。</p>, en: <p>No: a recursive sequence reaches it from below.</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>序列 <M t="n\mapsto\Omega_n" /> 本身是可以在 <M t="L_{\Omega_\omega}" /> 里递归地定义的，它用 ω 步就爬到了 <M t="\Omega_\omega" />。这正是“容许”所禁止的。就像无理数可以用有理数逼近出来——每个 <M t="\Omega_n" /> 都“有理”（容许），极限 <M t="\Omega_\omega" /> 却不是。也正因为如此，BO = ψ(Ω_ω) 并不需要新的折叠能力。</p>,
            en: <p>The sequence <M t="n\mapsto\Omega_n" /> is itself recursively definable over <M t="L_{\Omega_\omega}" />, and climbs to <M t="\Omega_\omega" /> in ω steps — exactly what admissibility forbids. Like an irrational number reached by rationals: each <M t="\Omega_n" /> is “rational” (admissible), the limit <M t="\Omega_\omega" /> is not. That is why BO = ψ(Ω_ω) needs no new folding power.</p>,
          }}
        />

        <H3 en="Climbing: I, M, K, Πₙ" zh="向上爬：I、M、K、Πₙ" />
        <P
          zh={<>书中的记号：<M t="n{-}X" /> 表示“在 X 上 Πₙ 反射的序数”；空格表示交集；单独一个 <M t="n" /> 表示 Πₙ 反射序数中最小的那个。于是 <M t="1{-}2" /> 是容许序数的极限点，<M t="\Omega_\omega" /> 是其中最小的。</>}
          en={<>The book’s notation: <M t="n{-}X" /> means “ordinals that are Πₙ-reflecting on X”; a space means intersection; a bare <M t="n" /> means the least Πₙ-reflecting ordinal. So <M t="1{-}2" /> is the class of limits of admissibles, the least being <M t="\Omega_\omega" />.</>}
        />
        <B
          zh={
            <ul>
              <li><M t="I=2\ 1{-}2" />：既容许，又是容许序数的极限——<b>递归不可达</b>。两个看似矛盾的性质居然能同时成立；<M t="L_I\models\mathsf{KPi}" />。</li>
              <li><M t="M=2{-}2" />：在容许序数上 Π₂ 反射——<b>递归 Mahlo</b>；<M t="L_M\models\mathsf{KPM}" />。</li>
              <li><M t="K=3" />：最小的 Π₃ 反射序数——<b>递归弱紧致</b>；然后是 Π₄、Π₅……直到 Πω。</li>
            </ul>
          }
          en={
            <ul>
              <li><M t="I=2\ 1{-}2" />: admissible AND a limit of admissibles — <b>recursively inaccessible</b>. Two seemingly contradictory properties at once; <M t="L_I\models\mathsf{KPi}" />.</li>
              <li><M t="M=2{-}2" />: Π₂-reflecting on the admissibles — <b>recursively Mahlo</b>; <M t="L_M\models\mathsf{KPM}" />.</li>
              <li><M t="K=3" />: the least Π₃-reflecting ordinal — <b>recursively weakly compact</b>; then Π₄, Π₅, … up to Πω.</li>
            </ul>
          }
        />
        <Widget title={{ en: 'The staircase of unreachability', zh: '不可达性的阶梯' }} hint={{ en: 'Each step: its defining property, what it folds inside ψ, and the recursive landmark it produces. Dashed steps have no rigorous notation.', zh: '每一级：它的定义性质、在 ψ 里折叠什么、产出哪个递归里程碑。虚线台阶没有严格的记号。' }}>
          <ReflectionStaircase />
        </Widget>
        <Caution>
          <L
            zh={<>诚实地说：这些序数的<b>定义</b>是严格的集合论；但社区里把它们放进 ψ 的“反射折叠记号”并不严格。书中直言它“实际上包含错误”，只是一些“看起来像”反射 OCF 的递归记号；Mahlo 之后“几乎没有成文的方法，全靠猜测和估计”。重要节点的值经过反复交叉验证，被认为基本可靠。</>}
            en={<>Honesty first: the <b>definitions</b> of these ordinals are rigorous set theory, but the community’s “reflection collapsing notation” that puts them inside ψ is not. The book says plainly that it “actually contains errors” and is only a recursive notation that “looks like” a reflection OCF; beyond Mahlo there is “no written method at all, almost entirely guesses and estimates”. The values at major nodes have been cross-checked many times and are considered basically reliable.</>}
          />
        </Caution>

        <H3 en="Each level folds every iteration of the one below" zh="每一级都折叠下一级的任意迭代" />
        <P
          zh={<>Ω 折叠了 <M t="\alpha\mapsto\omega^\alpha" /> 的一切迭代；I 折叠了 <M t="\alpha\mapsto\Omega_\alpha" /> 的一切迭代；M 折叠了整个 I 函数；K 折叠了任意深度的 Π₂ 反射。书中把这条规律写成一个展开规则（定理 9.5）。</>}
          en={<>Ω folds every iteration of <M t="\alpha\mapsto\omega^\alpha" />; I folds every iteration of <M t="\alpha\mapsto\Omega_\alpha" />; M folds the whole I-function; K folds Π₂-reflection of any depth. The book condenses the pattern into one expansion rule (Thm 9.5).</>}
        />
        <Thm kind="definition" name={{ en: 'the folding rule (book Thm 9.5)', zh: '折叠规则（书定理 9.5）' }}>
          <P
            zh={<>设反射表达式为 <M t="a_k\ \#_1\ a_i\ \#_2" />，其中 <M t="a_k" /> 是最左项，<M t="a_i" /> 是它右边第一个比它小的项（必要时补上一项 <M t="a_k-1" />）。则</>}
            en={<>Write a reflection expression as <M t="a_k\ \#_1\ a_i\ \#_2" />, where <M t="a_k" /> is the leftmost term and <M t="a_i" /> the first term to its right that is smaller (padding in a term <M t="a_k-1" /> if needed). Then</>}
          />
          <MB t="a_k\ \#_1\ (a_k-1)\ \#_2\ \Rightarrow\ \bigl(\#_1\ (a_k-1){-}\bigr)^{\alpha}\ \#_2 ." />
        </Thm>
        <P
          zh={<>惊喜在这里：把表达式<b>倒过来</b>读，这恰好是第 5 章初等序列的坏根规则——删去末项，找坏根，复制坏部。</>}
          en={<>Here is the surprise: read the expression <b>backwards</b> and this is exactly Chapter 5’s bad-root rule for primitive sequences — delete the last term, find the bad root, copy the bad part.</>}
        />
        <Widget title={{ en: 'Reflection expressions are primitive sequences in disguise', zh: '反射表达式是乔装的初等序列' }} hint={{ en: 'Pick a preset or type digits. [n] is the n-th approximation; names appear where the book gives one.', zh: '选一个预设或输入数字。[n] 是第 n 个近似；书中有名字的会显示出来。' }}>
          <ReflectionExpander />
        </Widget>
        <P
          zh={<>书中的解释是：反射序数本身就带有一个 ε₀ 形状的树结构，所以它们像初等序列一样展开。</>}
          en={<>The book’s explanation: the reflecting ordinals themselves carry an ε₀-shaped tree structure, so they expand just like primitive sequences.</>}
        />
        <Expand kind="detail" title={{ en: 'A misprint caught by the rule', zh: '规则抓到的一处印刷错误' }}>
          <P
            zh={<>书中 (9.313) 写 <M t="4\ 2{-}4\Rightarrow(4\ 2{-}4\ 1{-})^\alpha\,4\ 2{-}4" />，(9.314) 写 <M t="2{-}4\ 2{-}4\Rightarrow(3{-})^\alpha\,2{-}4" />。用定理 9.5 计算：<M t="4\ 2{-}4" /> 的首项 4 右边第一个更小的项是 2 &lt; 3，于是补上 3，得到 <M t="(3{-})^\alpha\,2{-}4" />；而 <M t="2{-}4\ 2{-}4" /> 中找不到比 2 小的项，整段被迭代。两式的右边恰好互换了。在前一幕的展开器里选 “4 2−4” 即可验证。</>}
            en={<>The book prints (9.313) <M t="4\ 2{-}4\Rightarrow(4\ 2{-}4\ 1{-})^\alpha\,4\ 2{-}4" /> and (9.314) <M t="2{-}4\ 2{-}4\Rightarrow(3{-})^\alpha\,2{-}4" />. Thm 9.5 says otherwise: in <M t="4\ 2{-}4" /> the first term smaller than 4 is 2 &lt; 3, so a 3 is padded in, giving <M t="(3{-})^\alpha\,2{-}4" />; in <M t="2{-}4\ 2{-}4" /> nothing is smaller than 2, so the whole rest is iterated. The two right-hand sides are swapped. Choose the preset “4 2−4” in the reflection-expression expander to check.</>}
          />
        </Expand>
      </Section>

      {/* ================================================================ */}
      <Section id="stability" kicker={{ en: 'Beyond reflection', zh: '反射之上' }} title={{ en: 'Stability, projection, and the BMS landmarks', zh: '稳定、投影与 BMS 里程碑' }}>
        <H3 en="Stability: a miniature that cannot be caught lying" zh="稳定：一个抓不到破绽的微缩模型" />
        <Thm kind="definition" name={{ en: 'stability (book Def 10.1–10.2)', zh: '稳定（书定义 10.1–10.2）' }}>
          <P
            zh={<>对 <M t="\alpha<\beta" />，称 α 是 <b>β-稳定</b>的，记作 <M t="L_\alpha\prec_{\Sigma_1}L_\beta" />，如果每个参数取自 <M t="L_\alpha" /> 的 Σ₁ 公式，只要在 <M t="L_\beta" /> 中为真，在 <M t="L_\alpha" /> 中也为真。</>}
            en={<>For <M t="\alpha<\beta" />, α is <b>β-stable</b>, written <M t="L_\alpha\prec_{\Sigma_1}L_\beta" />, if every Σ₁ formula with parameters from <M t="L_\alpha" /> that is true in <M t="L_\beta" /> is already true in <M t="L_\alpha" />.</>}
          />
        </Thm>
        <P
          zh={<>想象 <M t="L_\alpha" /> 是 <M t="L_\beta" /> 的微缩模型：凡是大宇宙里“存在某某”的事实，小模型里都找得到见证。β 离 α 越远，这个要求就越难满足。</>}
          en={<>Picture <M t="L_\alpha" /> as a miniature of <M t="L_\beta" />: every “there exists …” fact of the big universe has a witness in the small one. The farther β is from α, the harder this is.</>}
        />
        <Thm name={{ en: 'one step of stability beats all reflection (book Thm 10.2)', zh: '一步稳定胜过一切反射（书定理 10.2）' }}>
          <P
            zh={<>若 α 是 (α+1)-稳定的，则对每个 n，α 都是 Πₙ 反射的。</>}
            en={<>If α is (α+1)-stable, then α is Πₙ-reflecting for every n.</>}
          />
        </Thm>
        <P
          zh={<>只把稳定目标从 α 抬到 α+1，就越过了整条反射之梯。之后目标可以换成 α·2、α^α、下一个容许序数 <M t="\Omega_{\alpha+1}" />，再到“稳定链”：α 稳定到 β，β 又稳定到 γ……</>}
          en={<>Raising the stability target from α merely to α+1 already clears the whole reflection ladder. Then the target becomes α·2, α^α, the next admissible <M t="\Omega_{\alpha+1}" />, and then “stable chains”: α is stable up to β, which is stable up to γ, …</>}
        />
        <Caution>
          <L
            zh={<>稳定性本身是严格概念；但社区的稳定记号 <M t="\lambda\alpha.f(\alpha){-}\Pi_n" /> “没有严格的数学定义”，而“如何把稳定序数恰当地放进 OCF 仍然未知”。书中说：我们“实际上没有完整可靠的稳定折叠函数，只有对大节点的估计和猜测”。</>}
            en={<>Stability itself is rigorous; but the community’s stability notation <M t="\lambda\alpha.f(\alpha){-}\Pi_n" /> “has no strict mathematical definition”, and “how to put stable ordinals properly into an OCF is still unknown”. In the book’s words, we “do not actually have a complete, reliable stability-collapsing function — only estimates and guesses about big nodes”.</>}
          />
        </Caution>

        <H3 en="Projection: the whole ladder, zoomed out" zh="投影：把整条阶梯缩小来看" />
        <P
          zh={<>再往上是“投影”记号。它同样<b>没有严格定义</b>，只在形式上使用。但它给出一本惊人的词典：一个二阶投影序数 α 的函数 <M t="\psi_\alpha" />，在参数 <M t="\Omega^{+}=\Omega_{\alpha+1}" /> 上取值如下（书 §11.1）。</>}
          en={<>Higher still is “projection” notation. It too has <b>no rigorous definition</b> and is used formally. But it yields a striking dictionary: for a second-order projection ordinal α, the function <M t="\psi_\alpha" /> takes these values at arguments built from <M t="\Omega^{+}=\Omega_{\alpha+1}" /> (book §11.1).</>}
        />
        <div className="scroll-x">
          <table className="grid c10-table">
            <thead>
              <tr>
                <th>
                  <M t="\psi_\alpha(\,\cdot\,)" />
                </th>
                <th>
                  <L en="value" zh="值" />
                </th>
                <th>
                  <L en="meaning" zh="含义" />
                </th>
              </tr>
            </thead>
            <tbody>
              {DICTIONARY.map((d) => (
                <tr key={d.arg}>
                  <td>
                    <M t={d.arg} />
                  </td>
                  <td>
                    <M t={d.val} />
                  </td>
                  <td className="small">
                    <L {...d.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <KeyIdea>
          <L
            zh={<>看左列：<M t="\Omega^{+},\ (\Omega^{+})^2,\ (\Omega^{+})^{\Omega^{+}},\ \ldots,\ \varepsilon_{\Omega^{+}+1}" />——这就是 ε₀ 以下的 Cantor 范式，只是把 ω 换成了 <M t="\Omega^{+}" />。<b>整条反射之梯（直到 Πω）只是高一层的一段 ε₀ 形状的楼梯。</b>投影记号接着把这个把戏一层层重复下去。</>}
            en={<>Read the left column: <M t="\Omega^{+},\ (\Omega^{+})^2,\ (\Omega^{+})^{\Omega^{+}},\ \ldots,\ \varepsilon_{\Omega^{+}+1}" /> — Cantor normal forms below ε₀, with ω replaced by <M t="\Omega^{+}" />. <b>The entire reflection ladder up to Πω is just an ε₀-shaped staircase one level up.</b> Projection notation then repeats the trick level after level.</>}
          />
        </KeyIdea>

        <H3 en="What the BMS landmarks mean" zh="BMS 里程碑的含义" />
        <P
          zh={<>现在可以兑现第 9 章的承诺了。下表是书中社区分析给出的对应（矩阵按第 9 章的约定写成列）。全部属于社区估计。</>}
          en={<>Now we can keep Chapter 9’s promise. The table gives the correspondences from the community analysis in the book (matrices written as columns, Chapter 9’s convention). All are community estimates.</>}
        />
        <div className="scroll-x">
          <table className="grid c10-table">
            <thead>
              <tr>
                <th>
                  <L en="name" zh="名称" />
                </th>
                <th>
                  <L en="collapse" zh="折叠式" />
                </th>
                <th>
                  <L en="meaning" zh="含义" />
                </th>
                <th>BMS</th>
              </tr>
            </thead>
            <tbody>
              {LANDMARKS.map((r) => (
                <tr key={r.name}>
                  <td>
                    <b>{r.name}</b>
                  </td>
                  <td>
                    <M t={r.tex} />
                  </td>
                  <td className="small">
                    <L {...r.meaning} />
                  </td>
                  <td>
                    <BmsGrid m={r.bms} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Expand kind="detail" title={{ en: 'Caveats on these names', zh: '关于这些名字的注意事项' }}>
          <B
            zh={
              <ul>
                <li>ψ(I) 在不同的 ψ 中含义不同：在 Buchholz 风格的 ψ 里 ψ(I) 就等于 EBO；表中用的是第 8 章 Madore 风格，ψ(I) 更大。</li>
                <li>SSO：书第 9 章写成 ψ(Πω)，第四部分的 BMS 表写成 ψ(psd.Πω)，两处不一致。psd（伪）取上确界，real（真）取交集。</li>
                <li>SRO：第三部分把它描述为 I 函数的极限，第四部分写成 <M t="\psi(\varepsilon_{M+1})" />。</li>
                <li>SHO 一行的折叠式在书中排版残缺，我们只写“极限”。</li>
              </ul>
            }
            en={
              <ul>
                <li>ψ(I) depends on the ψ: in a Buchholz-style ψ, ψ(I) equals EBO; the table uses Chapter 8’s Madore style, where ψ(I) is larger.</li>
                <li>SSO: the book’s Chapter 9 writes ψ(Πω), its Part IV BMS table ψ(psd.Πω) — an inconsistency. psd (“pseudo”) takes a supremum, real takes an intersection.</li>
                <li>SRO: Part III describes it as the limit of the I-function, Part IV writes <M t="\psi(\varepsilon_{M+1})" />.</li>
                <li>The collapse in the SHO row is garbled in the book, so we only write “limit”.</li>
              </ul>
            }
          />
        </Expand>

        <H3 en="The skyline of set theory" zh="集合论的天际线" />
        <P
          zh={<>真正的集合论还提供更高的可数序数：间隙序数、不可投影序数、最小稳定序数 σ（<M t="L_\sigma\prec_{\Sigma_1}L" />）、世界序数（<M t="L_\alpha\models\mathsf{ZFC}" />）……它们都在 <M t="\omega_1^L" /> 以下，而目前没有任何大数记号能可靠地触及它们。</>}
          en={<>Genuine set theory supplies still higher countable ordinals: gap ordinals, non-projectibles, the least stable ordinal σ (<M t="L_\sigma\prec_{\Sigma_1}L" />), world ordinals (<M t="L_\alpha\models\mathsf{ZFC}" />), … all below <M t="\omega_1^L" />, and no googological notation reliably reaches them.</>}
        />
        <Thm name={{ en: 'world ordinals sit below the least stable ordinal', zh: '世界序数在最小稳定序数之下' }}>
          <P
            zh={<>若存在 α 使 <M t="L_\alpha\models\mathsf{ZFC}" />，则最小的这种 α 小于最小的 σ（<M t="L_\sigma\prec_{\Sigma_1}L" />）。</>}
            en={<>If some α has <M t="L_\alpha\models\mathsf{ZFC}" />, then the least such α is smaller than the least σ with <M t="L_\sigma\prec_{\Sigma_1}L" />.</>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>“<M t="\exists\alpha\,(L_\alpha\models\mathsf{ZFC})" />”是一个 Σ₁ 语句：它只断言存在某个对象，而“<M t="L_\alpha\models\mathsf{ZFC}" />”可以在任何包含 <M t="L_\alpha" /> 的容许集中核查。它在 L 中为真，由 <M t="L_\sigma\prec_{\Sigma_1}L" />，它在 <M t="L_\sigma" /> 中也为真，于是见证 α 小于 σ。</>}
            en={<>“<M t="\exists\alpha\,(L_\alpha\models\mathsf{ZFC})" />” is a Σ₁ sentence: it only asserts that some object exists, and “<M t="L_\alpha\models\mathsf{ZFC}" />” can be checked inside any admissible set containing <M t="L_\alpha" />. It is true in L, so by <M t="L_\sigma\prec_{\Sigma_1}L" /> it is true in <M t="L_\sigma" />, giving a witness α below σ.</>}
          />
        </Proof>
        <Caution>
          <L
            zh={<>书 §12.5 说最小世界序数“强度将超过上述介绍的序数”。从理论强度看，它确实超过间隙序数和不可投影序数（<M t="L_\alpha\models\mathsf{ZFC}" /> 推出 α 两者都是）；但按序数大小，它并不超过前面介绍的最小稳定序数——见前一幕的定理。</>}
            en={<>The book (§12.5) says the least world ordinal “exceeds the ordinals introduced above”. In theory strength it does exceed the gap and non-projectible ordinals (<M t="L_\alpha\models\mathsf{ZFC}" /> makes α both). But as an ordinal it is not above the least stable ordinal introduced earlier — by the theorem in the previous scene.</>}
          />
        </Caution>
      </Section>

      {/* ================================================================ */}
      <Section id="frontier" kicker={{ en: 'How strong is a theory?', zh: '理论有多强？' }} title={{ en: 'The frontier of ordinal analysis', zh: '序数分析的前沿' }}>
        <P
          zh={<>第 6 章说过：理论 T 的证明论序数 PTO(T)，是 T 能证明超穷归纳 TI(α) 的那些 α 的上确界。PA 停在 ε₀。</>}
          en={<>Recall from Chapter 6: the proof-theoretic ordinal PTO(T) of a theory T is the supremum of the α for which T proves transfinite induction TI(α). PA stops at ε₀.</>}
        />
        <P
          zh={<>证明论学家算出更强理论的 PTO 时，用的正是本章的工具：把 I、M、K 这些“折叠用的大序数”放进 ψ。每一行都是一项艰深的工作。</>}
          en={<>When proof theorists compute the PTO of stronger theories, they use exactly this chapter’s tools: the “collapsing ordinals” I, M, K placed inside ψ. Each row is a major piece of work.</>}
        />
        <div className="scroll-x">
          <table className="grid c10-table">
            <thead>
              <tr>
                <th>
                  <L en="theory" zh="理论" />
                </th>
                <th>
                  <L en="roughly" zh="大致是" />
                </th>
                <th>PTO</th>
                <th>
                  <L en="status" zh="现状" />
                </th>
              </tr>
            </thead>
            <tbody>
              {PTO_ROWS.map((r) => (
                <tr key={r.sys} className={r.state === 'preprint' ? 'frontier' : ''}>
                  <td>
                    <M t={r.sys} />
                  </td>
                  <td className="small">
                    <L {...r.what} />
                  </td>
                  <td>
                    <M t={r.pto} />
                  </td>
                  <td>
                    <span className={`c10-state ${r.state}`}>
                      {r.state === 'done' ? <L en="analysed" zh="已分析" /> : r.state === 'preprint' ? <L en="preprint" zh="预印本" /> : <L en="unknown" zh="未知" />}
                    </span>
                    {r.who && <span className="muted small"> {r.who}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P
          zh={<>表中 ψ 的写法沿用第 8 章；最后几行属于各作者自己的 OCF。注意 <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> 那一行：书中把它的序数也叫 BO，而本课程（与通行文献）把 <M t="\psi(\Omega_\omega)" /> 叫 BO。</>}
          en={<>The ψ-notation follows Chapter 8; the last rows use each author’s own OCF. Note the <M t="\Pi^1_1\text{-}\mathsf{CA}+\mathsf{BI}" /> row: the book calls its ordinal BO as well, whereas this course (and the standard literature) reserves BO for <M t="\psi(\Omega_\omega)" />.</>}
        />
        <P
          zh={<><M t="\mathsf{Z}_2" /> 是完整的二阶算术，几乎容纳全部经典分析。2023 年 Arai 在预印本 arXiv:2311.12459 中给出 <M t="|\mathsf{Z}_2|=\psi_\Omega(I_\omega)" />，其中 <M t="I_N" /> 对应 <M t="\mathsf{KP}+\Pi_N" />-收集。书中称之为“目前序数分析的极限”。它还很新，尚待学界充分检验。</>}
          en={<><M t="\mathsf{Z}_2" /> is full second-order arithmetic, roomy enough for nearly all of classical analysis. In 2023 Arai’s preprint arXiv:2311.12459 gave <M t="|\mathsf{Z}_2|=\psi_\Omega(I_\omega)" />, where <M t="I_N" /> corresponds to <M t="\mathsf{KP}+\Pi_N" />-collection. The book calls it “the current limit of ordinal analysis”. It is recent and still being digested by the community.</>}
        />
        <P
          zh={<>有人猜测 BMS 能达到 PTO(Z₂)，理由是 BMS 良序性的证明用到了所有 Σₙ 稳定序数。书中强调这只是猜测：BMS 也许在弱得多的系统里就能证明良序。</>}
          en={<>Some conjecture that BMS reaches PTO(Z₂), because its well-ordering proof uses all Σₙ-stable ordinals. The book stresses this is only a guess: BMS might be provably well-ordered in a much weaker system.</>}
        />
        <OpenProblem title={{ en: 'PTO(ZFC)', zh: 'PTO(ZFC)' }}>
          <P
            zh={<><M t="\mathsf{Z}_3" />、……、<M t="\mathsf{Z}_\omega" /> 和 ZFC 的证明论序数都是未知的，书中说 ZFC 的“远超我们的认识”。一个基于 ZFC 强度的递归记号，其终止性将连 ZFC 都证明不了。</>}
            en={<>The proof-theoretic ordinals of <M t="\mathsf{Z}_3" />, …, <M t="\mathsf{Z}_\omega" /> and ZFC are unknown; for ZFC the book says it is “far beyond our understanding”. A recursive notation of that strength would have a termination statement unprovable even in ZFC.</>}
          />
        </OpenProblem>
      </Section>

      {/* ================================================================ */}
      <Section id="large-cardinals" kicker={{ en: 'Up into the uncountable', zh: '走进不可数' }} title={{ en: 'Large cardinals', zh: '大基数' }}>
        <H3 en="A new axiom of infinity" zh="新的无限公理" />
        <P
          zh={<>从有限数出发，用有限次运算永远到不了 ω。去掉无限公理的 ZFC 证明不了 ω 存在；是<b>无限公理</b>直接宣布了它。大基数公理把同一个把戏搬到更高的楼层。</>}
          en={<>Starting from the finite numbers, finite operations never reach ω. ZFC minus the <b>axiom of infinity</b> cannot prove ω exists; that axiom simply declares it. Large-cardinal axioms play the same trick on a higher floor.</>}
        />
        <Thm kind="definition" name={{ en: 'inaccessible cardinal', zh: '不可达基数' }}>
          <P
            zh={<>不可数基数 κ 是<b>（强）不可达</b>的，如果：它是<b>正则</b>的（不是少于 κ 个更小序数的上确界），并且是<b>强极限</b>（对每个 <M t="\lambda<\kappa" /> 有 <M t="2^\lambda<\kappa" />）。</>}
            en={<>An uncountable cardinal κ is <b>(strongly) inaccessible</b> if it is <b>regular</b> (not the supremum of fewer than κ smaller ordinals) and a <b>strong limit</b> (<M t="2^\lambda<\kappa" /> for every <M t="\lambda<\kappa" />).</>}
          />
        </Thm>
        <P
          zh={<>ω 本身满足这两条（除了“不可数”）：它既不是有限个有限数的上确界，也不能由有限集合取幂集得到。不可达基数就是“不可数的 ω”。它的递归影子正是递归不可达序数 I。</>}
          en={<>ω itself has both properties (except uncountability): it is not the supremum of finitely many finite numbers, nor reached by power sets of finite sets. An inaccessible is an “uncountable ω”. Its recursive shadow is the recursively inaccessible ordinal I.</>}
        />
        <Thm name={{ en: 'ZFC cannot prove an inaccessible exists', zh: 'ZFC 证明不了不可达基数存在' }}>
          <P
            zh={<>若 κ 不可达，则 <M t="V_\kappa\models\mathsf{ZFC}" />。因此（若 ZFC 一致）ZFC 不能证明不可达基数存在。</>}
            en={<>If κ is inaccessible then <M t="V_\kappa\models\mathsf{ZFC}" />. Hence, if ZFC is consistent, ZFC cannot prove that an inaccessible exists.</>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>第一句逐条检查公理即可（幂集用强极限，替换用正则性）。于是 ZFC +“存在不可达”能证明 ZFC 有模型，从而证明 Con(ZFC)。如果 ZFC 自己就能证明不可达存在，它就证明了 Con(ZFC)，与哥德尔第二定理矛盾。</>}
            en={<>The first claim is checked axiom by axiom (power set uses strong limit, replacement uses regularity). So ZFC + “an inaccessible exists” proves ZFC has a model, hence proves Con(ZFC). If ZFC alone proved an inaccessible exists, it would prove Con(ZFC), contradicting Gödel’s second theorem.</>}
          />
        </Proof>
        <H3 en="Mahlo and weakly compact" zh="Mahlo 与弱紧致" />
        <P
          zh={<><b>Mahlo 基数</b> κ：不可达，而且 κ 以下的不可达基数多到构成一个“稳定集”（与 κ 的每个闭无界子集相交）。递归影子是递归 Mahlo 序数 M——注意两者都是“性质反射到下面”。</>}
          en={<>A <b>Mahlo cardinal</b> κ is inaccessible, with so many inaccessibles below it that they form a stationary set (meeting every closed unbounded subset of κ). Its recursive shadow is the recursively Mahlo M — both are “a property reflects down”.</>}
        />
        <P
          zh={<><b>弱紧致基数</b>：不可数的 κ 满足 <M t="\kappa\to(\kappa)^2" />——把每对元素涂红或蓝，总有大小为 κ 的同色子集。ω 满足这一条（无穷 Ramsey 定理），但 Sierpiński（1933）证明 <M t="\omega_1" /> 不满足！ω 的性质在第一个不可数基数处断了，要重新找回它，就得一路爬到弱紧致。递归影子：Π₃ 反射序数 K。</>}
          en={<>A <b>weakly compact cardinal</b> is an uncountable κ with <M t="\kappa\to(\kappa)^2" />: colour every pair red or blue, and some set of size κ is monochromatic. ω has this property (the infinite Ramsey theorem), but Sierpiński (1933) showed <M t="\omega_1" /> does not! The property of ω breaks at the first uncountable cardinal, and recovering it takes you all the way up to weak compactness. Recursive shadow: the Π₃-reflecting K.</>}
        />
        <H3 en="Measurable: the universe maps into itself" zh="可测：宇宙映入自身" />
        <Thm kind="definition" name={{ en: 'elementary embedding, critical point', zh: '初等嵌入与关键点' }}>
          <P
            zh={<>映射 <M t="j:V\to M" />（M 是传递类）是<b>初等嵌入</b>，如果对每个公式 φ 和集合 a，<M t="V\models\varphi(a)\iff M\models\varphi(j(a))" />。它移动的最小序数 κ 叫<b>关键点</b>，此时 <M t="j(\kappa)>\kappa" />。κ 是<b>可测基数</b>当且仅当它是某个非平凡初等嵌入 <M t="j:V\to M" /> 的关键点。</>}
            en={<>A map <M t="j:V\to M" /> into a transitive class M is an <b>elementary embedding</b> if for every formula φ and set a, <M t="V\models\varphi(a)\iff M\models\varphi(j(a))" />. The least ordinal it moves is its <b>critical point</b> κ, and <M t="j(\kappa)>\kappa" />. κ is <b>measurable</b> iff it is the critical point of some non-trivial elementary embedding <M t="j:V\to M" />.</>}
          />
        </Thm>
        <Thm name={{ en: 'Scott 1961', zh: 'Scott 1961' }}>
          <P zh={<>若存在可测基数，则 V ≠ L。</>} en={<>If a measurable cardinal exists, then V ≠ L.</>} />
        </Thm>
        <Proof>
          <L
            zh={<>设 V = L，κ 是最小的可测基数，<M t="j:V\to M" /> 以 κ 为关键点。M 是包含全部序数的传递 ZFC 模型，所以 M ⊇ L = V，即 M = V。由初等性，M 认为 <M t="j(\kappa)" /> 是最小的可测基数；M 就是 V，所以 <M t="j(\kappa)=\kappa" />，与 <M t="j(\kappa)>\kappa" /> 矛盾。</>}
            en={<>Suppose V = L, let κ be the least measurable, and <M t="j:V\to M" /> have critical point κ. M is a transitive model of ZFC containing all ordinals, so M ⊇ L = V, i.e. M = V. By elementarity, M thinks <M t="j(\kappa)" /> is the least measurable; since M is V, <M t="j(\kappa)=\kappa" />, contradicting <M t="j(\kappa)>\kappa" />.</>}
          />
        </Proof>
        <H3 en="Rank-into-rank and Kunen’s wall" zh="秩到秩与 Kunen 之墙" />
        <P
          zh={<>让目标 M 越来越像 V，基数就越来越强：超紧、巨大……终点会是 <M t="j:V\to V" /> 吗？Kunen（1971）证明：在 ZFC 中不存在非平凡的初等嵌入 <M t="j:V\to V" />。</>}
          en={<>Make the target M more and more like V and the cardinals get stronger: supercompact, huge, … Is the end <M t="j:V\to V" />? Kunen (1971) proved that in ZFC there is no non-trivial elementary embedding <M t="j:V\to V" />.</>}
        />
        <P
          zh={<>就在这堵墙下面，是<b>秩到秩</b>公理。<b>I3</b>：存在非平凡的初等嵌入 <M t="j:V_\lambda\to V_\lambda" />，把宇宙的整整一层映到它自己。</>}
          en={<>Just under the wall sit the <b>rank-into-rank</b> axioms. <b>I3</b>: there is a non-trivial elementary embedding <M t="j:V_\lambda\to V_\lambda" />, mapping a whole level of the universe into itself.</>}
        />
        <Widget title={{ en: 'The large-cardinal tower and its recursive shadows', zh: '大基数之塔与它的递归影子' }} hint={{ en: 'Click a floor. Dashed arrows point to the countable ordinals that imitate it inside L.', zh: '点击某一层。箭头指向在 L 中模仿它的可数序数。' }}>
          <CardinalTower />
        </Widget>
        <P
          zh={<>一个经验现象（不是定理）：人们自然提出的大基数公理，按一致性强度几乎排成一条直线。没有人知道为什么。</>}
          en={<>An empirical phenomenon, not a theorem: the large-cardinal axioms people naturally propose line up almost linearly by consistency strength. Nobody knows why.</>}
        />
      </Section>

      {/* ================================================================ */}
      <Section id="laver" kicker={{ en: 'Finale', zh: '终曲' }} title={{ en: 'Laver tables: a finite puzzle that needs infinity', zh: 'Laver 表：一个需要无穷的有限谜题' }}>
        <P
          zh={<>I3 最出人意料的用处，不在无穷，而在一些小小的有限数表上。</>}
          en={<>The most surprising application of I3 is not about the infinite at all, but about small finite tables of numbers.</>}
        />
        <Thm name={{ en: 'Laver tables (Laver; book Def 22.92)', zh: 'Laver 表（Laver；书定义 22.92）' }}>
          <P
            zh={<>对每个 n，集合 <M t="\{1,2,\ldots,2^n\}" /> 上恰有一个二元运算 ⋆ 满足：<M t="a\star1=a+1" />（其中 <M t="2^n\star1=1" />），以及<b>左自分配律</b> <M t="a\star(b\star c)=(a\star b)\star(a\star c)" />。这个表记作 <M t="A_n" />。</>}
            en={<>For each n there is exactly one binary operation ⋆ on <M t="\{1,2,\ldots,2^n\}" /> with <M t="a\star1=a+1" /> (where <M t="2^n\star1=1" />) and the <b>left self-distributive law</b> <M t="a\star(b\star c)=(a\star b)\star(a\star c)" />. The table is called <M t="A_n" />.</>}
          />
        </Thm>
        <P
          zh={<>怎么算？因为 <M t="b+1=b\star1" />，自分配律给出 <M t="a\star(b+1)=(a\star b)\star(a\star1)=(a\star b)\star(a+1)" />。第 <M t="2^n" /> 行是恒等映射；又因为 <M t="a<2^n" /> 时 <M t="a\star b>a" />，所需的那一行总在更下面，早已填好。</>}
          en={<>How to compute it? Since <M t="b+1=b\star1" />, the law gives <M t="a\star(b+1)=(a\star b)\star(a\star1)=(a\star b)\star(a+1)" />. Row <M t="2^n" /> is the identity, and since <M t="a\star b>a" /> for <M t="a<2^n" />, the row you need is always lower down and already done.</>}
        />
        <Widget title={{ en: 'Build a Laver table', zh: '亲手搭一张 Laver 表' }} hint={{ en: 'Each new cell (gold) is looked up from two cells already filled (outlined).', zh: '每个新格子（金色）都由两个已填好的格子（描边）查出来。' }}>
          <LaverBuilder />
        </Widget>
        <P
          zh={<>每一行都是周期的：先严格上升到 <M t="2^n" />，然后重复。记第 1 行的周期为 <M t="p(n)" />。表的大小每次翻倍，<M t="p(n)" /> 会怎样？</>}
          en={<>Every row is periodic: it rises strictly to <M t="2^n" /> and then repeats. Let <M t="p(n)" /> be the period of row 1. The table doubles in size each time — what does <M t="p(n)" /> do?</>}
        />
        <Widget title={{ en: 'The slowest race in mathematics', zh: '数学里最慢的赛跑' }} hint={{ en: 'Everything is computed live in your browser, up to 2048 × 2048.', zh: '全部在浏览器里实时计算，最大到 2048 × 2048。' }}>
          <LaverPeriods />
        </Widget>
        <P
          zh={<>计算结果：<M t="p(0),\ldots,p(10)=1,1,2,4,4,8,8,8,8,16,16" />。（书中的数列整体错位了一格。）<M t="p" /> 总是 2 的幂，而且从不减小。</>}
          en={<>The computation gives <M t="p(0),\ldots,p(10)=1,1,2,4,4,8,8,8,8,16,16" />. (The book’s list is shifted by one place.) <M t="p" /> is always a power of 2 and never decreases.</>}
        />
        <Thm name={{ en: 'Laver (1995), assuming I3', zh: 'Laver（1995），假设 I3' }} status="proved">
          <P
            zh={<>若存在 I3 嵌入，则 <M t="p(n)\to\infty" />。</>}
            en={<>If an I3 embedding exists, then <M t="p(n)\to\infty" />.</>}
          />
        </Thm>
        <P
          zh={<>为什么嵌入会和数表有关？对两个嵌入 <M t="j,k:V_\lambda\to V_\lambda" />，定义 <M t="j\star k=j(k)" />（把 j 作用在 k 上）。初等性给出 <M t="j(k(l))=j(k)(j(l))" />——这正是左自分配律。一个 I3 嵌入生成的代数，以全部 Laver 表为有限商。</>}
          en={<>Why would embeddings know about tables? For embeddings <M t="j,k:V_\lambda\to V_\lambda" /> define <M t="j\star k=j(k)" /> (apply j to k). Elementarity gives <M t="j(k(l))=j(k)(j(l))" /> — the left self-distributive law. The algebra generated by one I3 embedding has all Laver tables as its finite quotients.</>}
        />
        <P
          zh={<>增长有多慢？令 <M t="q(n)" /> 为使 <M t="p(N)\ge2^n" /> 的最小 N：<M t="q(0),\ldots,q(4)=0,2,3,5,9" />。而 Dougherty 证明 <M t="q(5)" /> 已经超过 <M t="f_9(f_8(f_8(254)))" />（第 4 章的快速增长层次）。在你能算到的任何表里，<M t="p(n)" /> 都不会超过 16。</>}
          en={<>How slow? Let <M t="q(n)" /> be the least N with <M t="p(N)\ge2^n" />: <M t="q(0),\ldots,q(4)=0,2,3,5,9" />. Dougherty showed that <M t="q(5)" /> already exceeds <M t="f_9(f_8(f_8(254)))" /> in Chapter 4’s fast-growing hierarchy. In any table you could ever compute, <M t="p(n)" /> stays at most 16.</>}
        />
        <P
          zh={<>反过来，<M t="q" /> 是一个完全可计算的函数，但它“处处有定义”目前只在 ZFC + I3 中被证明。书中的估计（不严格）：它的增长率不超过 PTO(ZFC + I3)。</>}
          en={<>Turned around, <M t="q" /> is a perfectly computable function whose totality is so far proved only in ZFC + I3. The book’s (non-rigorous) estimate: its growth rate is at most PTO(ZFC + I3).</>}
        />
        <Expand kind="deeper" title={{ en: 'When large cardinals were later removed', zh: '大基数后来被拿掉的先例' }}>
          <P
            zh={<>Laver 最初还借助 I3 证明了自由左自分配代数的字问题可判定。几年后（1990 年代初），Dehornoy 在 ZFC 中、不用任何大基数给出了证明，顺带发现了辫子群上的一种全序。所以“需要大基数”可能只是暂时的。但对 <M t="p(n)\to\infty" />，至今没有人做到。</>}
            en={<>Laver also first used I3 to show that the word problem for the free left-self-distributive algebra is decidable. A few years later, in the early 1990s, Dehornoy proved this in ZFC with no large cardinals at all — discovering an ordering of the braid groups along the way. So “needs a large cardinal” can be temporary. For <M t="p(n)\to\infty" />, nobody has managed it yet.</>}
          />
        </Expand>
        <OpenProblem title={{ en: 'Laver tables without I3', zh: '不用 I3 的 Laver 表' }}>
          <P
            zh={<><M t="p(n)\to\infty" /> 能在 ZFC 中证明吗？在 PA 中呢？这是一个关于有限数表的命题（Π₂ 型：对每个 m，存在 n 使 p(n) ≥ m），目前只有借助一个连一致性都无法证明的公理才能证明它。</>}
            en={<>Can <M t="p(n)\to\infty" /> be proved in ZFC? In PA? It is a statement about finite tables (of Π₂ shape: for every m there is n with p(n) ≥ m), currently provable only with the help of an axiom whose consistency cannot itself be proved.</>}
          />
        </OpenProblem>
        <OpenProblem title={{ en: 'Rigorous reflection and stability OCFs', zh: '严格的反射与稳定折叠函数' }}>
          <P
            zh={<>为社区造一个精确、递归、公认的反射折叠记号，其基本列与真正的 Πₙ 反射行为一致，并与 Stegert、Rathjen、Arai 的严格 OCF 接轨；更进一步，弄清如何把稳定序数放进 OCF、投影记号到底对应集合论中的哪些序数。</>}
            en={<>Build a precise, recursive, agreed-upon reflection collapsing notation whose fundamental sequences match genuine Πₙ-reflection, bridging to the rigorous OCFs of Stegert, Rathjen and Arai; beyond that, learn how to put stable ordinals into an OCF at all, and which set-theoretic ordinals projection notation really describes.</>}
          />
        </OpenProblem>
        <Expand kind="deeper" title={{ en: 'Sources and further reading', zh: '出处与延伸阅读' }}>
          <B
            zh={
              <ul>
                <li>曹知秋《大数理论》第 7–12 章（集合、逻辑、反射、稳定、投影、强非递归序数），第 15、17 章（证明论序数、大基数），§22.22（Laver 表）。</li>
                <li>W. Richter, P. Aczel, Inductive definitions and reflecting properties of admissible ordinals (1974)。</li>
                <li>M. Rathjen, Proof theory of reflection, Ann. Pure Appl. Logic 68 (1994)。</li>
                <li>T. Arai, An ordinal analysis of Π_N-Collection, arXiv:2311.12459 (2023)。</li>
                <li>R. Laver, On the algebra of elementary embeddings of a rank into itself, Adv. Math. 110 (1995)；R. Dougherty, Critical points in an algebra of elementary embeddings, Ann. Pure Appl. Logic 65 (1993)；P. Dehornoy, Braids and Self-Distributivity (2000)。</li>
                <li>A. Kanamori, The Higher Infinite（大基数的标准参考书）。</li>
              </ul>
            }
            en={
              <ul>
                <li>曹知秋, 《大数理论》, Chs. 7–12 (sets, logic, reflection, stability, projection, strongly non-recursive ordinals), Chs. 15 and 17 (proof-theoretic ordinals, large cardinals), §22.22 (Laver tables).</li>
                <li>W. Richter, P. Aczel, Inductive definitions and reflecting properties of admissible ordinals (1974).</li>
                <li>M. Rathjen, Proof theory of reflection, Ann. Pure Appl. Logic 68 (1994).</li>
                <li>T. Arai, An ordinal analysis of Π_N-Collection, arXiv:2311.12459 (2023).</li>
                <li>R. Laver, On the algebra of elementary embeddings of a rank into itself, Adv. Math. 110 (1995); R. Dougherty, Critical points in an algebra of elementary embeddings, Ann. Pure Appl. Logic 65 (1993); P. Dehornoy, Braids and Self-Distributivity (2000).</li>
                <li>A. Kanamori, The Higher Infinite (the standard reference on large cardinals).</li>
              </ul>
            }
          />
        </Expand>
        <KeyIdea>
          <L
            zh={<>本章的序数沿两个方向生长。向下：借来越来越“够不着”的可数序数——容许、不可达、Mahlo、反射、稳定、投影——再把它们折叠成越来越大的递归序数。向上：大基数让理论更强，而更强的理论又能证明更多有限的事实，比如 Laver 表。下一章，我们把“算法”本身严格化，去看看计算机永远判定不了的事。</>}
            en={<>This chapter’s ordinals grow in two directions. Downward: borrow ever more “unreachable” countable ordinals — admissible, inaccessible, Mahlo, reflecting, stable, projecting — and fold them into ever larger recursive ordinals. Upward: large cardinals make theories stronger, and stronger theories prove more finite facts, like those about Laver tables. Next chapter, we make “algorithm” itself precise, and look at what computers can never decide.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
