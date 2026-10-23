import './ch13.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { BerryBudget, DiagonalForge, JourneyRuler, OpenProblemExplorer, RayoStaircase, SymbolCounter, TinySearch, VkEvaluator } from './widgets'

export default function Chapter13() {
  return (
    <>
      <Prereq
        items={[
          { en: <>The duel “name a bigger number” and the rule that makes it interesting: limit the ink (Chapter 1).</>, zh: <>“说一个更大的数”的擂台，以及让它变得有意思的规则：限制墨水（第 1 章）。</> },
          { en: <>Diagonalization: <M t="d(n)=n\uparrow^{n}n" /> beats every fixed number of arrows (Chapter 2).</>, zh: <>对角化：<M t="d(n)=n\uparrow^{n}n" /> 胜过任何固定个数的箭头（第 2 章）。</> },
          { en: <>Countable sets, Cantor’s diagonal argument, and <M t="\omega_1" />, the first uncountable ordinal (Chapter 3).</>, zh: <>可数集、Cantor 对角线论证，以及第一个不可数序数 <M t="\omega_1" />（第 3 章）。</> },
          { en: <>Fundamental sequences and FGH growth labels <M t="f\sim\alpha" /> (Chapter 4).</>, zh: <>基本列与 FGH 增长刻度 <M t="f\sim\alpha" />（第 4 章）。</> },
          { en: <>First-order formulas over <M t="\in,=" /> with <M t="\neg,\wedge,\exists" />; free variables; satisfaction; von Neumann numerals; ZFC; Löwenheim–Skolem (Chapter 10).</>, zh: <>只含 <M t="\in,=" /> 与 <M t="\neg,\wedge,\exists" /> 的一阶公式；自由变元；满足关系；von Neumann 自然数；ZFC；Löwenheim–Skolem 定理（第 10 章）。</> },
          { en: <>Turing machines, the halting problem, and Busy Beaver <M t="\mathrm{BB}(n)=S(n)" />, the most steps of a halting <M t="n" />-state machine (Chapters 11–12).</>, zh: <>图灵机、停机问题，以及忙碌海狸 <M t="\mathrm{BB}(n)=S(n)" />：<M t="n" /> 状态停机图灵机的最大步数（第 11–12 章）。</> },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="duel" kicker={{ en: 'The final round', zh: '最后一回合' }} title={{ en: 'A duel at MIT', zh: 'MIT 的一场决斗' }}>
        <P en="The duel began with limited ink. Busy Beaver spent that budget on programs; Rayo will spend it on formulas. The final leap changes what counts as a permitted description. Keep asking two questions: what is the language, and why does the description pick a finite number?" zh="决斗从有限的墨水开始。忙碌海狸把预算花在程序上，Rayo 把它花在公式上。最后一跳改变了允许使用的描述方式。始终追问：用的是什么语言？这段描述为什么能指定一个有限数？" />
        <P
          zh={<>第 1 章开头，我们说过：“说一个更大的数”这个游戏，只要墨水不限，就永远分不出胜负。真正的比赛得限制墨水。</>}
          en={<>Chapter 1 opened with a game: name a bigger number. With unlimited ink nobody ever wins. A real contest has to limit the ink.</>}
        />
        <P
          zh={<>2007 年 1 月 26 日，有人真的这么比了一场。地点是 MIT 的 Stata 中心，屋里挤满了人，有人站上了椅子，门口还有至少二十个学生伸着脖子往里看。</>}
          en={<>On 26 January 2007 someone actually staged it. The venue was MIT’s Stata Center. The room was packed; people stood on chairs, and at least twenty students craned their necks from the doorway.</>}
        />
        <P
          zh={<>一边是普林斯顿的哲学家 Adam Elga，海报上的绰号是“邪恶博士”；另一边是 MIT 的哲学家 Agustín Rayo，绰号“墨西哥乘法王”。比赛像拳击赛一样开场：“红方……蓝方……”</>}
          en={<>In one corner, Princeton philosopher Adam Elga, billed as “Dr. Evil”. In the other, MIT philosopher Agustín Rayo, “the Mexican Multiplier”. It opened like a boxing match: “In the red corner…”</>}
        />

        <H3 en="The rules" zh="规则" />
        <P
          zh={<>两人轮流在黑板上写一个有限的自然数，每次都要比对方的大，不许用无穷。据 Elga 的比赛海报，另有三条规则：</>}
          en={<>The two took turns writing a finite natural number on the board, each larger than the last; infinity was banned. According to Elga’s poster, three further rules applied:</>}
        />
        <B
          zh={
            <ol className="c13-rules">
              <li>不常见的记号必须解释清楚；</li>
              <li>不许使用<b>原始语义词汇</b>——比如不能说“比目前为止任何人说过的数都大的最小数”；</li>
              <li>每一手都必须带来新想法：从第二手起，不许在对方的数上简单地加一。</li>
            </ol>
          }
          en={
            <ol className="c13-rules">
              <li>any unusual notation must be explained;</li>
              <li>no <b>primitive semantic vocabulary</b> — no “the smallest number bigger than any number named so far”;</li>
              <li>each move must bring a new idea: after the second turn, no simply adding 1 to the opponent’s number.</li>
            </ol>
          }
        />
        <P
          zh={<>第二条最耐人寻味。它禁止的是“命名”“说过”这类谈论语言本身的词。记住它——整章都绕着它转。</>}
          en={<>Rule 2 is the intriguing one. It bans words like “named” or “mentioned” that talk about language itself. Remember it — this whole chapter turns on it.</>}
        />

        <H3 en="The match" zh="比赛实况" />
        <P
          zh={<>Elga 开局，写了一个“1”。Rayo“哈”了一声，写下一长串 1，横贯整块黑板——这是第 1 章的位值制。</>}
          en={<>Elga opened with “1”. Rayo said “Ha!” and wrote a string of ones right across the board — Chapter 1’s place value.</>}
        />
        <P
          zh={<>Elga 走到黑板前，把后一半的 1 在靠近底部的地方擦掉一小截，每个“1”都变成了“!”。整串数变成了阶乘的阶乘的阶乘——第 2 章的“把运算迭代起来”。</>}
          en={<>Elga stepped up and erased a small gap near the base of half the ones, turning each “1” into “!”. The board now showed a factorial of a factorial of a factorial — Chapter 2’s trick of iterating an operation.</>}
        />
        <P
          zh={<>中盘的细节来自后人的转述，版本不一：忙碌海狸登场了，自变量是一个古戈尔，双方又不断把它加强。到这里，他们已经走到了第 12 章——越过一切算法。</>}
          en={<>Accounts of the middle game come from later retellings and vary: Busy Beaver appeared, fed a googol, and both sides kept strengthening it. By then they had reached Chapter 12 — beyond every algorithm.</>}
        />

        <H3 en="The winning move" zh="制胜的一手" />
        <P zh={<>最后，Rayo 写下了这样一句话：</>} en={<>Finally Rayo wrote this:</>} />
        <B
          zh={
            <blockquote className="c13-quote">
              “比任何能用一阶集合论语言、以少于一个古戈尔（<M t="10^{100}" />）个符号的表达式命名的数都大的最小的数。”
              <div className="muted">（原文为英文。）</div>
            </blockquote>
          }
          en={
            <blockquote className="c13-quote">
              “The smallest number bigger than any number that can be named by an expression in the language of first order set-theory
              with less than a googol (<M t="10^{100}" />) symbols.”
            </blockquote>
          }
        />
        <P
          zh={<>这个定义后来还需要修补，Rayo 称之为他的“二阶逻辑技巧”。但对手已经无从回应。据 MIT 校报 <i>The Tech</i> 的报道：“Elga 应声倒地，裁判宣布比赛结束。”</>}
          en={<>The definition needed some tweaking, including what Rayo called his “second-order logic trick”. But there was no reply. As the student paper <i>The Tech</i> reported: “As Elga collapsed, slain, the referee closed the ceremony.”</>}
        />
        <P
          zh={<>这场决斗的灵感来自计算机科学家 Scott Aaronson 1999 年的文章《谁能说出更大的数？》。冠军数从此被称为 <Term en="Rayo's number" zh="Rayo 数" />。</>}
          en={<>The duel was inspired by computer scientist Scott Aaronson’s 1999 essay “Who Can Name the Bigger Number?”. The winning number has been called <Term en="Rayo's number" zh="Rayo 数" /> ever since.</>}
        />
        <P
          zh={<>等一下。Rayo 的句子里明明有“命名”二字——这不正是规则二禁止的吗？他为什么不算犯规？弄懂这一点，就弄懂了这一章。</>}
          en={<>Wait. Rayo’s sentence contains the word “named” — exactly what rule 2 forbids. Why wasn’t that a foul? Understand this, and you understand the chapter.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="berry" kicker={{ en: 'The trap', zh: '陷阱' }} title={{ en: 'Berry’s paradox', zh: 'Berry 悖论' }}>
        <P
          zh={<>考虑这句话：“不能用二十个字以内说出的最小自然数”。二十个字以内的说法只有有限多种，所以总有自然数说不出来，其中最小的那个是确定的。</>}
          en={<>Consider “the smallest number that cannot be named in at most sixty letters”. There are only finitely many such phrases, so some numbers escape them, and the smallest of those is perfectly definite.</>}
        />
        <P
          zh={<>可这句话本身只有十几个字。它用不到二十个字说出了一个“不能用二十个字以内说出”的数。矛盾。</>}
          en={<>But that phrase has only about fifty letters. It names, within sixty letters, a number that cannot be named within sixty letters. Contradiction.</>}
        />
        <P
          zh={<>Russell 在 1906 年的《逻辑的悖论》中发表了这个悖论，并把它归功于牛津博德利图书馆的馆员 G. G. Berry。拖动预算 B，看看矛盾究竟在何时出现：</>}
          en={<>Russell published this in 1906 (“Les paradoxes de la logique”), crediting G. G. Berry, a librarian at Oxford’s Bodleian. Drag the budget B and watch exactly when the contradiction switches on:</>}
        />
        <Widget
          title={{ en: 'When does the Berry phrase bite?', zh: 'Berry 短语何时“咬人”？' }}
          hint={{ en: 'The phrase grows only as fast as the name of B does. Past a threshold it fits inside its own budget.', zh: '短语的长度只随 B 的读法缓慢增长。过了某个门槛，它就塞进了自己的预算。' }}
        >
          <BerryBudget />
        </Widget>
        <P
          zh={<>预算小的时候，Berry 短语本身太长，什么事都没有。一旦预算大到装得下这句话，矛盾就出现了——而且此后每一个 B 都有矛盾。所以问题不在“二十”这个具体数字，而在这句话本身的结构。</>}
          en={<>For small budgets the Berry phrase is too long to count, and nothing happens. Once the budget can hold the phrase, the contradiction appears — and it stays for every larger B. So the trouble is not the particular number sixty but the shape of the phrase itself.</>}
        />

        <H3 en="Object language and metalanguage" zh="对象语言与元语言" />
        <P
          zh={<>毛病出在“说出”这个词上。“能用某种语言说出”谈论的是这种语言本身。日常语言既拿来说数，又拿来谈论自己“能说什么”，两件事搅在一起，就打了结。</>}
          en={<>The culprit is the word “named”. “Nameable in a language” talks about that language. Everyday language both names numbers and discusses what it can name, and the two jobs get tangled.</>}
        />
        <P
          zh={<>解法是把两层分开。被谈论的语言叫<Term en="object language" zh="对象语言" />：这里是一阶集合论，只有五个符号。用来谈论它的语言叫<Term en="metalanguage" zh="元语言" />：这里是数学家的日常数学语言。</>}
          en={<>The cure is to separate the levels. The language being discussed is the <Term en="object language" zh="对象语言" />: here, first-order set theory with five symbols. The language doing the discussing is the <Term en="metalanguage" zh="元语言" />: here, ordinary mathematical prose.</>}
        />
        <P
          zh={<>Rayo 的句子是用元语言写的，它谈论的是对象语言里的公式。它自己<b>不是</b>一个集合论公式，所以不算在“少于一个古戈尔个符号的公式”之内。打结的地方被剪开了。</>}
          en={<>Rayo’s sentence is written in the metalanguage and talks about formulas of the object language. It is <b>not</b> itself a set-theory formula, so it is not among “the formulas with fewer than a googol symbols”. The knot is cut.</>}
        />
        <KeyIdea>
          <L
            zh={<>这也回答了“为什么不算犯规”：规则二禁止的是<b>含糊的</b>语义词汇。Rayo 的“命名”有精确的数学定义——在元语言里，对一种固定的、形式化的对象语言下定义。</>}
            en={<>This also answers why it wasn’t a foul. Rule 2 bans <b>vague</b> semantic vocabulary. Rayo’s “named” has a precise mathematical definition — given in the metalanguage, about a fixed, formal object language.</>}
          />
        </KeyIdea>
        <Expand kind="deeper" title={{ en: 'Tarski: truth cannot be defined from inside', zh: 'Tarski：真理无法从内部定义' }}>
          <P
            zh={<>Tarski 的不可定义性定理（1933/1936）说：足够强的形式语言（比如集合论）无法在自身内部定义“一个本语言的句子为真”。若能，就能仿照 Berry 或说谎者悖论造出矛盾。</>}
            en={<>Tarski’s undefinability theorem (1933/1936) says a sufficiently strong formal language, such as set theory, cannot define “this sentence of mine is true” within itself. If it could, a Berry- or liar-style contradiction would follow.</>}
          />
          <P
            zh={<>“公式 φ 在 V 中命名 m”正是这种真理概念。所以它只能在更强的元理论里定义。本章稍后会把这个论证变成一个定理：Rayo 函数本身无法在集合论中定义。</>}
            en={<>“Formula φ names m in V” is exactly such a truth notion, so it can only be defined in a stronger metatheory. Later in this chapter we turn the argument into a theorem: Rayo’s function itself is not definable in set theory.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="language" kicker={{ en: 'Toolkit', zh: '工具箱' }} title={{ en: 'Five symbols for all of mathematics', zh: '五个符号，说尽数学' }}>
        <P
          zh={<>回顾第 10 章：一阶集合论的公式只用 <M t="\in" />、<M t="=" />、<M t="\neg" />、<M t="\wedge" />、<M t="\exists" />，加上变量 <M t="x_1,x_2,\ldots" />。变量的取值范围是整个集合宇宙 <M t="V" />。</>}
          en={<>Recall Chapter 10: formulas of first-order set theory use only <M t="\in" />, <M t="=" />, <M t="\neg" />, <M t="\wedge" />, <M t="\exists" />, plus variables <M t="x_1,x_2,\ldots" />. Variables range over the whole universe of sets <M t="V" />.</>}
        />
        <P
          zh={<>自然数是 von Neumann 数：<M t="0=\varnothing" />，<M t="1=\{0\}" />，<M t="2=\{0,1\}" />，<M t="n+1=n\cup\{n\}" />。于是“说出一个数”就是“说出一个集合”。</>}
          en={<>Numbers are von Neumann numerals: <M t="0=\varnothing" />, <M t="1=\{0\}" />, <M t="2=\{0,1\}" />, <M t="n+1=n\cup\{n\}" />. So naming a number means naming a set.</>}
        />
        <Thm kind="definition" name={{ en: 'naming', zh: '命名' }}>
          <B
            zh={<p>设公式 <M t="\varphi(x_1)" /> 只有 <M t="x_1" /> 一个自由变元。若恰好有一个集合 <M t="m" /> 使 <M t="(V,\in)\models\varphi[m]" />（第 10 章的满足关系，赋值 <M t="x_1\mapsto m" />），就说 <M t="\varphi" /> 在 <M t="V" /> 中<b>命名</b>了 <M t="m" />——与第 10 章“在结构中命名”的定义相同，只是结构换成了整个宇宙。</p>}
            en={<p>Let <M t="\varphi(x_1)" /> be a formula whose only free variable is <M t="x_1" />. If exactly one set <M t="m" /> has <M t="(V,\in)\models\varphi[m]" /> (Chapter 10’s satisfaction, with <M t="x_1\mapsto m" />), we say <M t="\varphi" /> <b>names</b> <M t="m" /> in <M t="V" /> — Chapter 10’s “names in a structure”, with the structure now the whole universe.</p>}
          />
        </Thm>
        <H3 en="A finite window: the sets V_k" zh="有限的窗口：集合 V_k" />
        <P
          zh={<>我们没法在电脑里装下整个 <M t="V" />，但可以装下它的底层：<M t="V_0=\varnothing" />，<M t="V_{k+1}=\mathcal P(V_k)" />（全部子集）。它们的元素叫<Term en="hereditarily finite sets" zh="遗传有限集" />。</>}
          en={<>No computer holds all of <M t="V" />, but it can hold the bottom floors: <M t="V_0=\varnothing" />, <M t="V_{k+1}=\mathcal P(V_k)" /> (all subsets). Their members are the <Term en="hereditarily finite sets" zh="遗传有限集" />.</>}
        />
        <P
          zh={<>大小依次是 0、1、2、4、16、65536：每层是上一层的 2 的幂，所以 <M t="|V_{k+1}|=2\uparrow\uparrow k" />。指数塔又出现了，后面它会帮 Rayo 一个大忙。</>}
          en={<>Their sizes are 0, 1, 2, 4, 16, 65536 — each a power of 2 of the last, so <M t="|V_{k+1}|=2\uparrow\uparrow k" />. Towers again; they will do Rayo a big favour later.</>}
        />
        <Expand kind="detail" title={{ en: 'How the widgets store sets: Ackermann’s coding', zh: '组件如何存储集合：Ackermann 编码' }}>
          <P
            zh={<>把每个遗传有限集编码成一个自然数：编码为 <M t="m" /> 的集合，其元素恰好是 <M t="m" /> 的二进制里为 1 的那些位所对应的集合。于是 <M t="0=\varnothing" />，<M t="1=\{\varnothing\}" />，<M t="2=\{\{\varnothing\}\}" />，<M t="3=\{\varnothing,\{\varnothing\}\}" />。</>}
            en={<>Code each hereditarily finite set by a natural number: the set with code <M t="m" /> has as members the sets whose codes are the 1-bits of <M t="m" />. So <M t="0=\varnothing" />, <M t="1=\{\varnothing\}" />, <M t="2=\{\{\varnothing\}\}" />, <M t="3=\{\varnothing,\{\varnothing\}\}" />.</>}
          />
          <P
            zh={<>“<M t="x\in y" />”就是“<M t="y" /> 的第 <M t="x" /> 位是 1”，<M t="V_k" /> 就是编码 <M t="0,1,\ldots,|V_k|-1" />。von Neumann 数 0、1、2、3 的编码是 0、1、3、11。</>}
            en={<>“<M t="x\in y" />” is just “bit <M t="x" /> of <M t="y" /> is 1”, and <M t="V_k" /> is the codes <M t="0,1,\ldots,|V_k|-1" />. The von Neumann numerals 0, 1, 2, 3 have codes 0, 1, 3, 11.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="definition" kicker={{ en: 'The definition', zh: '定义' }} title={{ en: 'Rayo’s function, precisely', zh: 'Rayo 函数的精确定义' }}>
        <P
          zh={<>要比较“墨水”，先得约定怎么数符号。《大数理论》采用下面的长度 <M t="\ell" />（变量算一个符号）：</>}
          en={<>To compare ink we must agree how to count symbols. The book uses this length <M t="\ell" />, where a variable counts as one symbol:</>}
        />
        <MB t="\begin{gathered}\ell(x_i\in x_j)=\ell(x_i=x_j)=3,\qquad \ell((\neg A))=\ell(A)+3,\\ \ell((A\wedge B))=\ell(A)+\ell(B)+3,\qquad \ell(\exists x_i(A))=\ell(A)+4.\end{gathered}" />
        <P
          zh={<>换句话说：把公式写成括号齐全的标准形，数一数有几个符号。括号、<M t="\neg" />、<M t="\wedge" />、<M t="\exists" /> 和变量各算一个；变量的下标不另计，<M t="x_{1000}" /> 也只算一个符号。缩写 <M t="\forall" />、<M t="\to" /> 必须先展开再数。</>}
          en={<>In words: write the formula fully parenthesized and count every symbol — each bracket, <M t="\neg" />, <M t="\wedge" />, <M t="\exists" /> and variable counts once; a variable’s index is free, so <M t="x_{1000}" /> is one symbol. Abbreviations such as <M t="\forall" /> and <M t="\to" /> must be expanded before counting.</>}
        />
        <H3 en="Spend the ink on definitions" zh="把墨水花在定义上" />
        <figure className="c13-milestone"><figcaption><L en="New milestone" zh="新的里程碑" /><strong><L en="Rayo · A new language for the duel" zh="Rayo · 用新语言继续决斗" /></strong></figcaption>
<Thm kind="definition" name={{ en: 'Rayo’s function (book Def. 27.1, with our convention)', zh: 'Rayo 函数（书中定义 27.1，采用本课程的约定）' }}>
          <B
            zh={<p><M t="\mathrm{Rayo}(n)" /> 是比所有“能用长度<b>不超过</b> <M t="n" /> 的公式命名的自然数”都大的最小自然数。Rayo 数是 <M t="\mathrm{Rayo}(10^{100})" />。</p>}
            en={<p><M t="\mathrm{Rayo}(n)" /> is the smallest natural number greater than every natural number named by a formula of length <b>at most</b> <M t="n" />. Rayo’s number is <M t="\mathrm{Rayo}(10^{100})" />.</p>}
          />
        </Thm>
        </figure>
        <H3 en="Fix the symbol budget precisely" zh="把符号预算说准确" />
        <Expand kind="detail" title={{ en: '“Fewer than n” or “at most n”?', zh: "“少于 n”还是“不超过 n”？" }}>
          <P
            zh={<>书中的形式定义写的是“少于 <M t="n" /> 个符号”，Rayo 在比赛时写的也是“少于一个古戈尔”。但书中给出的小值 <M t="\mathrm{Rayo}(10)=1" /> 要求长度恰为 10 的公式也算数，即“不超过 <M t="n" />”。维基百科的表述也是“一个古戈尔或更少”。</>}
            en={<>The book’s formal definition says “fewer than <M t="n" /> symbols”, and Rayo’s board said “less than a googol”. But the book’s small value <M t="\mathrm{Rayo}(10)=1" /> needs the length-10 formula to count, i.e. “at most <M t="n" />”. Wikipedia’s wording is also “a googol symbols or less”.</>}
          />
          <P
            zh={<>本课程统一采用“不超过”。两种约定只差一个下标：<M t="\mathrm{Rayo}_{<}(n)=\mathrm{Rayo}_{\le}(n-1)" />。在一个古戈尔的尺度上，这点差别毫无意义；但写小值时必须说清楚。</>}
            en={<>This course uses “at most” throughout. The two conventions differ by a shift: <M t="\mathrm{Rayo}_{<}(n)=\mathrm{Rayo}_{\le}(n-1)" />. At googol scale this is meaningless, but for small values it must be stated.</>}
          />
        </Expand>
        <Expand kind="deeper" title={{ en: 'The “second-order trick”: Rayo’s formal definition', zh: "“二阶逻辑技巧”：Rayo 的形式定义" }}>
          <P
            zh={<>“公式 φ 在赋值 s 下成立”记作 <M t="\mathrm{Sat}([\varphi],s)" />。Rayo 这样定义它：对<b>每一个</b>关系 <M t="R" />，只要 <M t="R" /> 对所有公式和赋值都遵守 Tarski 的五条规则，就有 <M t="R([\varphi],s)" />。</>}
            en={<>Write <M t="\mathrm{Sat}([\varphi],s)" /> for “φ holds under assignment s”. Rayo defines it like this: for <b>every</b> relation <M t="R" /> that obeys Tarski’s five clauses for all formulas and assignments, <M t="R([\varphi],s)" /> holds.</>}
          />
          <MB t="\begin{aligned}R([\psi],t)\iff\;&([\psi]=\ulcorner x_i\in x_j\urcorner\wedge t(x_i)\in t(x_j))\\\vee\;&([\psi]=\ulcorner x_i=x_j\urcorner\wedge t(x_i)=t(x_j))\\\vee\;&([\psi]=\ulcorner(\neg\theta)\urcorner\wedge\neg R([\theta],t))\\\vee\;&([\psi]=\ulcorner(\theta\wedge\xi)\urcorner\wedge R([\theta],t)\wedge R([\xi],t))\\\vee\;&([\psi]=\ulcorner\exists x_i(\theta)\urcorner\wedge\exists t'\,R([\theta],t'))\end{aligned}" />
          <P zh={<>（<M t="t'" /> 与 <M t="t" /> 至多在 <M t="x_i" /> 处不同。）</>} en={<>(Here <M t="t'" /> differs from <M t="t" /> at most at <M t="x_i" />.)</>} />
          <P
            zh={<>赋值 <M t="t" /> 把变量映到<b>任意</b>集合，所以这样的 <M t="R" /> 是一个真类，“对每个 <M t="R" />”是二阶量词。这就是“二阶逻辑技巧”：满足关系用二阶集合论定义，命名的却是一阶公式。</>}
            en={<>Assignments send variables to <b>arbitrary</b> sets, so such an <M t="R" /> is a proper class, and “for every <M t="R" />” is a second-order quantifier. That is the “second-order trick”: satisfaction is defined in second-order set theory, while the naming formulas are first-order.</>}
          />
          <P
            zh={<>然后：<M t="m" /> 能被长度 <M t="\le n" /> 的公式命名，当且仅当有这样的 <M t="\varphi(x_1)" />，使得某个 <M t="x_1:=m" /> 的赋值满足它，而且凡满足它的赋值都有 <M t="x_1=m" />。</>}
            en={<>Then <M t="m" /> is nameable with length <M t="\le n" /> iff some such <M t="\varphi(x_1)" /> is satisfied by an assignment with <M t="x_1:=m" />, and every assignment satisfying it has <M t="x_1=m" />.</>}
          />
        </Expand>
        <H3 en="Counting ink" zh="数墨水" />
        <P
          zh={<>在下面的工作台里写公式。<M t="a" /> 就是自由变元 <M t="x_1" />，<M t="b,c,\ldots" /> 是 <M t="x_2,x_3,\ldots" />。每个方块是一个符号，方块的总数就是长度 <M t="\ell" />。先试试预设的“命名 1”，再把它改写成用 <M t="\forall" /> 和 <M t="\to" /> 的版本：看起来更短，展开后却更长。</>}
          en={<>Write formulas in the workbench. <M t="a" /> is the free variable <M t="x_1" />; <M t="b,c,\ldots" /> are <M t="x_2,x_3,\ldots" />. Each tile is one symbol; the number of tiles is the length <M t="\ell" />. Try the preset “names 1”, then its version with <M t="\forall" /> and <M t="\to" />: it looks shorter but expands to more ink.</>}
        />
        <Widget
          title={{ en: 'Formula workbench: counting symbols', zh: '公式工作台：数符号' }}
          hint={{ en: 'Compare “names 1” with “1 with ∀ and →”: the abbreviations look shorter but cost more ink.', zh: '比较“命名 1”和“用 ∀、→ 写的 1”：缩写看着短，墨水反而花得多。' }}
        >
          <SymbolCounter />
        </Widget>
        <P
          zh={<>工作台里的等式是 <M t="\ell=3\cdot\#\text{原子}+3\cdot\#{\neg}+3\cdot\#{\wedge}+4\cdot\#{\exists}" />。<M t="\wedge" /> 的个数总比原子少一个，所以长度 <M t="\ell=6a-3+3n+4e" />（<M t="a" /> 个原子、<M t="n" /> 个 <M t="\neg" />、<M t="e" /> 个 <M t="\exists" />）。由此可得：长度 1、2、4、5、8 的公式根本不存在。</>}
          en={<>The workbench’s equation is <M t="\ell=3\cdot\#\text{atoms}+3\cdot\#{\neg}+3\cdot\#{\wedge}+4\cdot\#{\exists}" />. There is always one <M t="\wedge" /> fewer than atoms, so the length is <M t="\ell=6a-3+3n+4e" /> for <M t="a" /> atoms, <M t="n" /> negations and <M t="e" /> quantifiers. Hence no formula has length 1, 2, 4, 5 or 8.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="playground" kicker={{ en: 'Hands on', zh: '动手' }} title={{ en: 'Naming 0, 1, 2 — and a mirage', zh: '命名 0、1、2——以及海市蜃楼' }}>
        <H3 en="Zero costs 10 symbols" zh="0 要花 10 个符号" />
        <P
          zh={<>“<M t="x_1" /> 没有元素”：<M t="(\neg\exists x_2(x_2\in x_1))" />。由外延公理，没有元素的集合只有一个，就是 <M t="\varnothing=0" />。数一数：原子 3，<M t="\exists" /> 加 4，<M t="\neg" /> 加 3，共 10。</>}
          en={<>“<M t="x_1" /> has no elements”: <M t="(\neg\exists x_2(x_2\in x_1))" />. By extensionality exactly one set has no elements, <M t="\varnothing=0" />. Count: atom 3, <M t="\exists" /> +4, <M t="\neg" /> +3 — total 10.</>}
        />
        <H3 en="One costs 30" zh="1 要花 30 个符号" />
        <P
          zh={<>“<M t="x_1" /> 非空，而且它的元素都没有元素”：</>}
          en={<>“<M t="x_1" /> is nonempty, and none of its elements has an element”:</>}
        />
        <MB t="(\exists x_2(x_2\in x_1)\wedge(\neg\exists x_2((x_2\in x_1\wedge\exists x_3(x_3\in x_2)))))" />
        <P
          zh={<>它的元素只能是 <M t="\varnothing" />，又至少有一个，所以 <M t="x_1=\{\varnothing\}=1" />。长度 <M t="7+20+3=30" />。书中说这已是最短的写法。</>}
          en={<>Its elements can only be <M t="\varnothing" />, and there is at least one, so <M t="x_1=\{\varnothing\}=1" />. Length <M t="7+20+3=30" />. The book states this is optimal.</>}
        />
        <P
          zh={<>在下面的组件里，选一个 <M t="V_k" />，看哪些集合满足公式。最下面一行同时给出公式在 <M t="V_1" /> 到 <M t="V_4" /> 中的结论。</>}
          en={<>In the next widget, pick a <M t="V_k" /> and see which sets satisfy the formula. The bottom row reports the verdict in each of <M t="V_1" /> to <M t="V_4" /> at once.</>}
        />
        <Widget
          title={{ en: 'Evaluate a formula in V₁ … V₄', zh: '在 V₁ … V₄ 中求值' }}
          hint={{ en: 'Try “belongs to nothing”, and watch its verdict change from V₁ to V₄.', zh: '试试“不属于任何集合”，看它的结论如何从 V₁ 变到 V₄。' }}
        >
          <VkEvaluator />
        </Widget>

        <H3 en="The mirage" zh="海市蜃楼" />
        <P
          zh={<>公式 <M t="(\neg\exists x_2(x_1\in x_2))" />（“<M t="x_1" /> 不属于任何集合”）的长度也是 10。在 <M t="V_2=\{0,1\}" /> 里，1 不属于任何集合，于是它“命名了 1”！</>}
          en={<>The formula <M t="(\neg\exists x_2(x_1\in x_2))" />, “<M t="x_1" /> belongs to nothing”, also has length 10. In <M t="V_2=\{0,1\}" />, the set 1 belongs to nothing — so it “names 1”!</>}
        />
        <P
          zh={<>可在真正的 <M t="V" /> 里，任何集合 <M t="x" /> 都属于 <M t="\{x\}" />，这个公式谁也不满足。<M t="V_k" /> 有天花板，向上看的量词会撞到它。</>}
          en={<>In the real <M t="V" />, every set <M t="x" /> belongs to <M t="\{x\}" />, so nothing satisfies it. <M t="V_k" /> has a ceiling, and a quantifier that looks upward bumps into it.</>}
        />
        <Caution>
          <L
            zh={<>所以，在 <M t="V_k" /> 里求值只是对 <M t="V" /> 的<b>近似</b>。对 0、1、2、3 的那几个公式，结论与 <M t="V" /> 一致（可以直接证明）；但一般的公式没有这种保证。</>}
            en={<>So evaluating in <M t="V_k" /> only <b>approximates</b> <M t="V" />. For the formulas for 0, 1, 2 and 3 the verdict agrees with <M t="V" /> (one can check it by hand); for general formulas there is no such guarantee.</>}
          />
        </Caution>

        <H3 en="Brute force" zh="暴力穷举" />
        <P
          zh={<>既然短公式只有有限多个，不妨全部列出来。下面的搜索枚举所有长度不超过 19、只有 <M t="x_1" /> 自由的公式，先在 <M t="V_3" /> 里找“恰好一个解”的，再拿到 <M t="V_4" /> 里复查。</>}
          en={<>Short formulas are finitely many, so list them all. The search enumerates every formula of length up to 19 with <M t="x_1" /> as the only free variable, keeps those with exactly one solution in <M t="V_3" />, and re-checks them in <M t="V_4" />.</>}
        />
        <Widget
          title={{ en: 'Every formula up to length 19', zh: '长度 19 以内的全部公式' }}
          hint={{ en: 'Click a row with hits to see the formulas. Look at length 17.', zh: '点击有命中的行查看公式。留意长度 17。' }}
        >
          <TinySearch />
        </Widget>
        <P
          zh={<>结果与书中一致：长度 9 以内什么都命名不了，所以 <M t="\mathrm{Rayo}(0)=\cdots=\mathrm{Rayo}(9)=0" />；第一个命中出现在长度 10，命名的是 0。</>}
          en={<>The result matches the book: nothing is named below length 10, so <M t="\mathrm{Rayo}(0)=\cdots=\mathrm{Rayo}(9)=0" />; the first hit is at length 10, and it names 0.</>}
        />
        <P
          zh={<>长度 17 出现了 <M t="\exists x_2\exists x_3(x_1\in x_2\wedge x_3\in x_1)" />（“非空且属于某个集合”），在 <M t="V_3" /> 中只有 1 满足——又一个海市蜃楼，到 <M t="V_4" /> 就露了馅。直到 19，稳定的命中仍然只有 0，与书中的 <M t="\mathrm{Rayo}(10)=\cdots=\mathrm{Rayo}(19)=1" /> 相符。</>}
          en={<>At length 17 appears <M t="\exists x_2\exists x_3(x_1\in x_2\wedge x_3\in x_1)" /> — “nonempty and belongs to something” — satisfied only by 1 in <M t="V_3" />. Another mirage, exposed in <M t="V_4" />. Up to 19 the only stable hits still name 0, matching the book’s <M t="\mathrm{Rayo}(10)=\cdots=\mathrm{Rayo}(19)=1" />.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="staircase" kicker={{ en: 'Round 13', zh: '第十三回合' }} title={{ en: 'The staircase', zh: '阶梯' }}>
        <P
          zh={<>按长度算，0 要 10 个符号，1 要 30 个；书中又给出 2 的 56 个符号写法（“含一条长 2 的 <M t="\in" /> 链，却没有长 3 的链”）和 3 的 88 个符号写法。</>}
          en={<>By length, 0 costs 10 symbols and 1 costs 30. The book adds a 56-symbol formula for 2 (“contains an <M t="\in" />-chain of length 2 but none of length 3”) and an 88-symbol one for 3.</>}
        />
        <P
          zh={<>照这个配方，每多一环链条大约多花 20 个符号，得到 <M t="\mathrm{Rayo}(34+20n)>n" />。线性的——慢得可怜。符号的力量藏在别处。</>}
          en={<>Following the recipe, each extra link costs about 20 symbols, giving <M t="\mathrm{Rayo}(34+20n)>n" />. Linear — pitifully slow. The real power of the symbols lies elsewhere.</>}
        />
        <H3 en="Twenty symbols per floor of a tower" zh="二十个符号，塔高一层" />
        <P
          zh={<>不要一个一个地数元素，而是描述一个巨大的集合：书中先刻画出 <M t="V_5" />（有 65536 个元素），再说“<M t="x_1" /> 是与 <M t="V_5" /> 一一对应的序数”。总共 340 个符号，命名了 65536。</>}
          en={<>Instead of counting elements one by one, describe a huge set. The book characterizes <M t="V_5" /> (65536 elements), then says “<M t="x_1" /> is an ordinal in bijection with <M t="V_5" />”. 340 symbols in all, naming 65536.</>}
        />
        <P
          zh={<>把 <M t="V_5" /> 换成 <M t="V_{n+1}" /> 只需每层多约 20 个符号，而 <M t="|V_{n+1}|=2\uparrow\uparrow n" />。于是 <M t="\mathrm{Rayo}(260+20n)>2\uparrow\uparrow n" />：墨水线性增加，命名的数却是指数塔。</>}
          en={<>Replacing <M t="V_5" /> by <M t="V_{n+1}" /> costs about 20 more symbols per floor, and <M t="|V_{n+1}|=2\uparrow\uparrow n" />. Hence <M t="\mathrm{Rayo}(260+20n)>2\uparrow\uparrow n" />: linear ink buys a tower.</>}
        />
        <Widget
          title={{ en: 'The Rayo staircase', zh: 'Rayo 阶梯' }}
          hint={{ en: 'The axis is log₁₀ of the symbol budget N, all the way to a googol. Click a step to jump there.', zh: '横轴是符号预算 N 的 log₁₀，一直到一个古戈尔。点击台阶可以跳过去。' }}
        >
          <RayoStaircase />
        </Widget>
        <P
          zh={<>注意阶梯上的比例。人们能具体说出点什么的，全在 <M t="N\le7339" /> 这一小段里，横轴的 4% 都不到。从那里到 <M t="10^{100}" />，是一片完全无人知晓的荒原：我们只知道 Rayo 函数在那里一直在长，却说不出它长成了什么样。</>}
          en={<>Mind the proportions. Everything anyone can say concretely sits at <M t="N\le7339" />, under 4% of the axis. From there to <M t="10^{100}" /> stretches a wilderness nobody knows anything about: we know Rayo’s function keeps growing there, but not what it grows into.</>}
        />

        <H3 en="Swallowing the Busy Beaver" zh="吞下忙碌海狸" />
        <P
          zh={<>集合论能谈论有序对、自然数、加法，也就能谈论图灵机：纸带、状态、一步一步的格局。书中用约 7339 个符号写出“<M t="2^{65536}-1" /> 个状态的停机图灵机最多走多少步”。</>}
          en={<>Set theory can talk about ordered pairs, natural numbers and addition — and therefore about Turing machines: tapes, states, configurations step by step. The book spends about 7339 symbols to write “the most steps any halting machine with <M t="2^{65536}-1" /> states takes”.</>}
        />
        <MB t="\mathrm{Rayo}(7339)>S(2^{65536}-1)." />
        <P
          zh={<>关键在于：公式不必<b>运行</b>机器。“存在一段停机的运行记录”里的 <M t="\exists" /> 一下子扫过整个宇宙，连永不停机的机器也一并判定了。停机问题挡得住算法，挡不住量词。</>}
          en={<>The point: a formula does not have to <b>run</b> the machine. The <M t="\exists" /> in “there exists a halting run” sweeps the entire universe at once, settling even the machines that never halt. The halting problem stops algorithms, not quantifiers.</>}
        />
        <Thm name={{ en: '(Rayo outgrows everything set theory can define)', zh: '（Rayo 超越集合论能定义的一切）' }}>
          <B
            zh={<p>设 <M t="f:\mathbb N\to\mathbb N" /> 可以在集合论中定义：有公式 <M t="\Phi(y,x_1)" />，使得在 <M t="V" /> 中 <M t="\Phi(n,m)" /> 成立当且仅当 <M t="m=f(n)" />。那么对充分大的 <M t="N" />，<M t="\mathrm{Rayo}(N)>f(N)" />。特别地，Rayo 最终超过忙碌海狸 <M t="S(n)" />。</p>}
            en={<p>Let <M t="f:\mathbb N\to\mathbb N" /> be definable in set theory: some formula <M t="\Phi(y,x_1)" /> holds in <M t="V" /> of <M t="(n,m)" /> exactly when <M t="m=f(n)" />. Then <M t="\mathrm{Rayo}(N)>f(N)" /> for all large <M t="N" />. In particular Rayo eventually beats Busy Beaver <M t="S(n)" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>不妨设 <M t="f" /> 不减（否则换成同样可定义的 <M t="\max_{i\le n}f(i)" />）。用书中的公式 <M t="T_k(y)" />（式 27.118，长约 <M t="260+20k" />；任何长 <M t="O(k)" /> 的族都行）命名 <M t="2\uparrow\uparrow k" />，则 <M t="\exists y(T_k(y)\wedge\Phi(y,x_1))" /> 命名 <M t="f(2\uparrow\uparrow k)" />，长度约 <M t="20k+c" />。取 <M t="k" /> 使这个长度不超过 <M t="N" />，则 <M t="\mathrm{Rayo}(N)>f(2\uparrow\uparrow k)\ge f(N)" />——因为 <M t="k\approx N/20" />，对大 <M t="N" /> 有 <M t="2\uparrow\uparrow k\ge N" />。</>}
            en={<>We may assume <M t="f" /> is nondecreasing (else use the equally definable <M t="\max_{i\le n}f(i)" />). Let <M t="T_k(y)" /> name <M t="2\uparrow\uparrow k" /> with length about <M t="260+20k" /> (the book’s eq. 27.118; any family of length <M t="O(k)" /> would do). Then <M t="\exists y(T_k(y)\wedge\Phi(y,x_1))" /> names <M t="f(2\uparrow\uparrow k)" /> with length about <M t="20k+c" />. Choose <M t="k" /> so this fits in <M t="N" /> symbols: <M t="\mathrm{Rayo}(N)>f(2\uparrow\uparrow k)\ge f(N)" />, since <M t="k\approx N/20" /> makes <M t="2\uparrow\uparrow k\ge N" /> for large <M t="N" />.</>}
          />
        </Proof>
        <Quiz
          q={{
            zh: <p>Rayo 在比赛中途写过 <M t="\mathrm{BB}(10^{100})" />。哪个更大：<M t="\mathrm{Rayo}(7339)" />，还是 <M t="\mathrm{BB}(10^{100})=S(10^{100})" />？</p>,
            en: <p>Mid-duel, Rayo wrote <M t="\mathrm{BB}(10^{100})" />. Which is bigger: <M t="\mathrm{Rayo}(7339)" /> or <M t="\mathrm{BB}(10^{100})=S(10^{100})" />?</p>,
          }}
          options={[
            { zh: <p><M t="\mathrm{Rayo}(7339)" /></p>, en: <p><M t="\mathrm{Rayo}(7339)" /></p> },
            { zh: <p><M t="S(10^{100})" />：一个古戈尔个状态，远多于 7339 个符号</p>, en: <p><M t="S(10^{100})" />: a googol states, far more than 7339 symbols</p> },
            { zh: <p>无法比较：一个不可计算，一个不可定义</p>, en: <p>Incomparable: one is uncomputable, the other undefinable</p> },
          ]}
          answer={0}
          explain={{
            zh: <p><M t="2^{65536}-1" /> 有 19729 位，远大于 <M t="10^{100}" />；而 <M t="S" /> 是严格递增的（多一个状态总能多走一步）。所以 <M t="\mathrm{Rayo}(7339)>S(2^{65536}-1)>S(10^{100})" />。一块黑板上的七千多个符号，赢了一个古戈尔个状态的忙碌海狸。</p>,
            en: <p><M t="2^{65536}-1" /> has 19,729 digits, far more than <M t="10^{100}" />, and <M t="S" /> is strictly increasing (one more state can always run one more step). So <M t="\mathrm{Rayo}(7339)>S(2^{65536}-1)>S(10^{100})" />. Seven thousand symbols on a blackboard beat a Busy Beaver with a googol states.</p>,
          }}
        />
        <H3 en="Berry’s paradox, tamed" zh="驯服的 Berry 悖论" />
        <P
          zh={<>Berry 的论证并没有白费。把它放进精确的语言，它就从悖论变成了定理。</>}
          en={<>Berry’s argument was not wasted. Put into a precise language, the paradox becomes a theorem.</>}
        />
        <Thm name={{ en: '(Rayo is not definable in set theory)', zh: '（Rayo 函数在集合论中不可定义）' }}>
          <B
            zh={<p>没有公式 <M t="\Psi(y,x_1)" /> 能使得：对每个 <M t="n" />，<M t="V" /> 中 <M t="\Psi(n,m)" /> 成立当且仅当 <M t="m=\mathrm{Rayo}(n)" />。</p>}
            en={<p>No formula <M t="\Psi(y,x_1)" /> satisfies, for every <M t="n" />: <M t="\Psi(n,m)" /> holds in <M t="V" /> iff <M t="m=\mathrm{Rayo}(n)" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>若有，用命名 <M t="2\uparrow\uparrow k" /> 的公式 <M t="T_k(y)" />（长约 <M t="260+20k" />），则 <M t="\exists y(T_k(y)\wedge\Psi(y,x_1))" /> 命名 <M t="\mathrm{Rayo}(2\uparrow\uparrow k)" />，长度约 <M t="20k+c" />。<M t="k" /> 够大时，这个长度 <M t="\le N=2\uparrow\uparrow k" />，于是 <M t="\mathrm{Rayo}(N)" /> 能用不超过 <M t="N" /> 个符号命名。可 <M t="\mathrm{Rayo}(N)" /> 按定义比所有这样的数都大。矛盾。</>}
            en={<>If there were, take <M t="T_k(y)" />, of length about <M t="260+20k" />, naming <M t="2\uparrow\uparrow k" />. Then <M t="\exists y(T_k(y)\wedge\Psi(y,x_1))" /> names <M t="\mathrm{Rayo}(2\uparrow\uparrow k)" /> with length about <M t="20k+c" />. For large <M t="k" /> that is <M t="\le N=2\uparrow\uparrow k" />, so <M t="\mathrm{Rayo}(N)" /> is named with at most <M t="N" /> symbols — yet by definition it exceeds every such number. Contradiction.</>}
          />
        </Proof>
        <P
          zh={<>这就是“不可定义数”这个名字的来由。也正因为如此，Rayo 函数的增长刻度——书中记作 <M t="\sigma" />（只是一个名字，与第 10 章的最小稳定序数 σ 无关）——高于每一个能在集合论中定义的函数的刻度。</>}
          en={<>Hence the name “undefinable numbers”. And hence Rayo’s growth label — the book calls it <M t="\sigma" />, just a name, unrelated to Chapter 10’s least stable ordinal σ — lies above the label of every function definable in set theory.</>}
        />
        <OpenProblem title={{ en: 'Where is σ?', zh: 'σ 在哪里？' }}>
          <P
            zh={<>书中说，Rayo 函数的增长刻度 <M t="\sigma" /> 应当是一个<b>可数</b>的非递归序数；但“目前尚没有关于 <M t="\sigma" /> 的可靠估计”。</>}
            en={<>The book says Rayo’s growth label <M t="\sigma" /> should be a <b>countable</b> non-recursive ordinal — but “there is as yet no reliable estimate of <M t="\sigma" />”.</>}
          />
        </OpenProblem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="controversy" kicker={{ en: 'Honesty', zh: '诚实' }} title={{ en: 'Is Rayo’s number even well-defined?', zh: 'Rayo 数真的是良定义的吗？' }}>
        <P
          zh={<>到目前为止，我们一直默认“<M t="V" /> 中成立”是有意义的。这正是争议所在。书中的原话是：</>}
          en={<>So far we have taken “holds in <M t="V" />” for granted. That is exactly where the dispute lies. The book says:</>}
        />
        <B
          zh={<blockquote className="c13-quote">“考虑到使用一阶逻辑公理时必须预先恰当地指定所使用的模型……根据目前的分析来看，Rayo 数可能仍然不是良定义的；即使它是良定义的，其强度可能也难以达到预期。”</blockquote>}
          en={<blockquote className="c13-quote">“Since one must specify in advance the model in which first-order axioms are used… by current analysis Rayo’s number may still not be well-defined; and even if it is, its strength may fall short of expectations.”</blockquote>}
        />
        <H3 en="Which V?" zh="哪一个 V？" />
        <P
          zh={<>ZFC 有许多不同的模型（第 10 章的 Löwenheim–Skolem 定理甚至给出可数模型）。同一个公式在不同模型里可能命名不同的数，甚至在一个里命名、在另一个里不命名。</>}
          en={<>ZFC has many different models (Chapter 10’s Löwenheim–Skolem theorem even gives countable ones). The same formula may name different numbers in different models, or name a number in one and nothing in another.</>}
        />
        <P
          zh={<>所以“命名”要相对于一个指定的宇宙。Rayo 指的是“真正的”<M t="V" />。数学实在论者觉得这没问题；对形式主义者来说，“真正的 <M t="V" />”本身就说不清。</>}
          en={<>So “naming” is relative to a chosen universe. Rayo means the “true” <M t="V" />. A mathematical realist finds this fine; to a formalist, “the true <M t="V" />” is itself unclear.</>}
        />
        <H3 en="Where it does make sense" zh="在哪里它有意义" />
        <P
          zh={<>在足够强的元理论里——比如允许对类量化的 Morse–Kelley 集合论，或在 ZFC 上添加一个真理谓词——“在 <M t="V" /> 中满足”可以定义，<M t="\mathrm{Rayo}(10^{100})" /> 就是一个确定的自然数。</>}
          en={<>In a strong enough metatheory — Morse–Kelley set theory, which quantifies over classes, or ZFC plus a truth predicate — “satisfied in <M t="V" />” is definable, and <M t="\mathrm{Rayo}(10^{100})" /> is a definite natural number.</>}
        />
        <P
          zh={<>但这个数的具体身份依赖于元理论。换一个元理论，答案可能不同；而 ZFC 本身无法写出它——这正是“阶梯”一节中“Rayo 不可定义”定理的内容。</>}
          en={<>But which number it is depends on the metatheory; a different metatheory may give a different answer. And ZFC itself cannot write it down — that is the theorem “Rayo is not definable” from the staircase section.</>}
        />
        <Quiz
          q={{
            zh: <p>Rayo 函数 <M t="n\mapsto\mathrm{Rayo}(n)" /> 在集合论中不可定义。那么对某个具体的 <M t="n" />，单个的数 <M t="\mathrm{Rayo}(n)" /> 能被某个集合论公式命名吗？</p>,
            en: <p>The function <M t="n\mapsto\mathrm{Rayo}(n)" /> is not definable in set theory. Is a single value <M t="\mathrm{Rayo}(n)" />, for a specific <M t="n" />, named by some formula of set theory?</p>,
          }}
          options={[
            { zh: <p>不能：它是不可定义数</p>, en: <p>No: it is an undefinable number</p> },
            { zh: <p>能，但公式长度必须超过 <M t="n" /></p>, en: <p>Yes, but only by a formula longer than <M t="n" /></p> },
            { zh: <p>能，而且长度不超过 <M t="n" /></p>, en: <p>Yes, even with at most <M t="n" /> symbols</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>每个自然数都能被命名，比如用“链条”配方，<M t="m" /> 只需约 <M t="34+20m" /> 个符号。不可定义的是<b>函数</b>：没有一个公式能对所有 <M t="n" /> 同时给出 <M t="\mathrm{Rayo}(n)" />。而按定义，命名 <M t="\mathrm{Rayo}(n)" /> 的公式必然长于 <M t="n" />。</p>,
            en: <p>Every natural number is nameable — the chain recipe names <M t="m" /> in about <M t="34+20m" /> symbols. What is undefinable is the <b>function</b>: no single formula produces <M t="\mathrm{Rayo}(n)" /> for all <M t="n" />. And by definition, any formula naming <M t="\mathrm{Rayo}(n)" /> must be longer than <M t="n" />.</p>,
          }}
        />
        <Expand kind="detail" title={{ en: 'A checklist for defining an “undefinable” number', zh: '定义“不可定义数”的检查清单' }}>
          <P
            zh={<>书中介绍了日本研究者 p進大好きbot 的检查清单，大意是：</>}
            en={<>The book reproduces a checklist by the Japanese googologist p進大好きbot. In outline:</>}
          />
          <B
            zh={
              <ol className="c13-rules">
                <li>指定基础逻辑（默认一阶谓词逻辑）；</li>
                <li>指定语言（默认一阶集合论语言）；</li>
                <li>用公式精确地给出公理体系 <M t="T" />（默认 ZFC）；若用高阶集合论，必须精确公理化；</li>
                <li>只用 <M t="T" /> 中已定义的概念。不要直观地使用“真”或“可定义”。<b>跳过实际定义，什么也解决不了。</b></li>
              </ol>
            }
            en={
              <ol className="c13-rules">
                <li>fix the underlying logic (default: first-order predicate logic);</li>
                <li>fix the language (default: first-order set theory);</li>
                <li>give the axioms <M t="T" /> precisely as formulas (default: ZFC); higher-order set theory must be axiomatized precisely;</li>
                <li>use only notions defined in <M t="T" />. Never use “true” or “definable” intuitively. <b>Skipping the actual definition solves nothing.</b></li>
              </ol>
            }
          />
        </Expand>
        <OpenProblem title={{ en: 'Is Rayo’s number well-defined — and how strong is it?', zh: 'Rayo 数是否良定义？强度如何？' }}>
          <P
            zh={<>需要一个公认的元理论，在其中把“在 <M t="V" /> 中命名”严格化，并弄清结果的强度。书中认为这“还需要进行许多相当艰深的严格化工作”。</>}
            en={<>We need an agreed metatheory in which “named in <M t="V" />” is made rigorous, and an understanding of the resulting strength. The book says this “still requires a great deal of rather deep rigorization”.</>}
          />
        </OpenProblem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="beyond" kicker={{ en: 'After Rayo', zh: 'Rayo 之后' }} title={{ en: 'A graveyard and a garden', zh: '墓园与花园' }}>
        <P
          zh={<>Rayo 之后，挑战者络绎不绝：Fish Number 7、BIG FOOT、Little Bigeddon、Sasquatch、Oblivion、Utter Oblivion……</>}
          en={<>After Rayo, challengers kept coming: Fish Number 7, BIG FOOT, Little Bigeddon, Sasquatch, Oblivion, Utter Oblivion…</>}
        />
        <P
          zh={<>书中的结论很冷静：它们“最终都被证明是非良定义的，或者相对于此前的大数并没有实际的扩展”。在这个层次，含糊一句话就足以让整个定义崩塌。</>}
          en={<>The book’s verdict is sober: all “were eventually shown to be ill-defined, or not genuine extensions of earlier numbers”. At this altitude, one vague phrase is enough to bring a whole definition down.</>}
        />
        <H3 en="The Large Number Garden Number" zh="大数花园数" />
        <P
          zh={<>唯一的幸存者是 p進大好きbot 的<Term en="Large Number Garden Number" zh="大数花园数" />（LNG）。思路是：在集合论语言里加一个函数符号 <M t="U" />，用公理要求每个 <M t="U(\alpha)" /> 都是 ZFC 的一个模型，且彼此协调。</>}
          en={<>The only survivor is p進大好きbot’s <Term en="Large Number Garden Number" zh="大数花园数" /> (LNG). The idea: add a function symbol <M t="U" /> to the language of set theory, with axioms making every <M t="U(\alpha)" /> a model of ZFC, coherently.</>}
        />
        <P
          zh={<>然后定义 <M t="f(n)" /> 为所有“在某个 <M t="U(\alpha)" /> 中被短公式定义的数”之和（编码都小于 <M t="n" />），而 LNG <M t="=f^{10}(10\uparrow^{10}10)" />。这个理论包含了二阶 ZFC 与 MK⁺，所以人们预期它远超 Rayo。</>}
          en={<>Then <M t="f(n)" /> sums all numbers defined in some <M t="U(\alpha)" /> by formulas with codes below <M t="n" />, and LNG <M t="=f^{10}(10\uparrow^{10}10)" />. The theory contains second-order ZFC and MK⁺, so it is expected to leave Rayo far behind.</>}
        />
        <P
          zh={<>但书中也坦言：“我们对它仍然知之甚少，它是否是良定义的目前也还不清楚。”</>}
          en={<>But the book admits: “we still know very little about it, and whether it is well-defined is still unclear.”</>}
        />
        <H3 en="The DaVinci number" zh="DaVinci 数" />
        <P
          zh={<>2024 年，DaVinci103 指出：Rayo 与 LNG 都定义在<b>递归</b>的理论里。若在元理论中造出一个非递归的理论，让它包含所有递归理论的模型，再在其中定义大数，就能远远越过两者。</>}
          en={<>In 2024 DaVinci103 observed that Rayo and LNG are both defined in <b>recursive</b> theories. Build, in a metatheory, a non-recursive theory containing models of every recursive theory, define a number there, and you should leave both far behind.</>}
        />
        <P
          zh={<>这就是 DaVinci 数。它的理想强度远超 Rayo 数与大数花园数，但“我们尚不知道 DaVinci 数是否是良定义的”。擂台的最前沿，就停在这个问号上。</>}
          en={<>That is the DaVinci number. Its ideal strength far exceeds Rayo’s number and LNG, but “we do not yet know whether the DaVinci number is well-defined”. The front line of the duel stops at that question mark.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="horizon" kicker={{ en: 'Course synthesis', zh: '课程综述' }} title={{ en: 'The ω₁ horizon', zh: 'ω₁ 的地平线' }}>
        <Caution>
          <L
            zh={<>本节是本课程自己的综述，不是《大数理论》中的论断。书中只说 Rayo 的刻度 <M t="\sigma" /> 是可数序数；下面的两个定理是标准数学，最后的结论是对它们的解读。</>}
            en={<>This section is the course’s own synthesis, not a claim of the book. The book says only that Rayo’s label <M t="\sigma" /> is countable. The two theorems below are standard mathematics; the conclusion is our reading of them.</>}
          />
        </Caution>
        <P
          zh={<>整个擂台只靠两个动作：<b>重复</b>（刻度 +1）和<b>对角化</b>（越过一整列，到达新的极限）。第 2 章用 <M t="d(n)=n\uparrow^{n}n" /> 越过了所有固定箭头数；第 4 章的 <M t="f_\lambda(n)=f_{\lambda[n]}(n)" /> 把同一招做成了规则；忙碌海狸与 Rayo 则对“全部算法”“全部定义”做了一次对角化。这一招有没有失灵的时候？</>}
          en={<>The whole duel ran on two moves: <b>repeat</b> (label +1) and <b>diagonalize</b> (leap past a whole sequence to a new limit). Chapter 2’s <M t="d(n)=n\uparrow^{n}n" /> leapt past every fixed number of arrows; Chapter 4’s <M t="f_\lambda(n)=f_{\lambda[n]}(n)" /> made the same move a rule; Busy Beaver and Rayo diagonalized over all algorithms and all definitions. Does the trick ever fail?</>}
        />
        <Thm name={{ en: '(one function beats any countable family)', zh: '（一个函数胜过任何可数族）' }}>
          <B
            zh={<p>设 <M t="f_0,f_1,f_2,\ldots" /> 是任意可数多个函数 <M t="\mathbb N\to\mathbb N" />（可计算与否均可）。令 <M t="g(n)=1+\max_{i<n}f_i(n)" />。则对每个 <M t="i" />，当 <M t="n>i" /> 时 <M t="g(n)>f_i(n)" />。</p>}
            en={<p>Let <M t="f_0,f_1,f_2,\ldots" /> be any countably many functions <M t="\mathbb N\to\mathbb N" />, computable or not. Put <M t="g(n)=1+\max_{i<n}f_i(n)" />. Then for every <M t="i" />, <M t="g(n)>f_i(n)" /> whenever <M t="n>i" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>若 <M t="n>i" />，则 <M t="f_i(n)" /> 是取最大值的那些项之一，所以 <M t="g(n)\ge1+f_i(n)>f_i(n)" />。</>}
            en={<>If <M t="n>i" />, then <M t="f_i(n)" /> is among the terms in the maximum, so <M t="g(n)\ge1+f_i(n)>f_i(n)" />.</>}
          />
        </Proof>
        <Widget
          title={{ en: 'The diagonal forge', zh: '对角线锻炉' }}
          hint={{ en: 'Pick up to six functions, in any order. The gold row g(n) = 1 + max of the shaded cells.', zh: '任选至多六个函数，顺序随意。金色那一行 g(n) = 1 + 有底色格子中的最大值。' }}
        >
          <DiagonalForge />
        </Widget>
        <P
          zh={<>所以，没有哪个可数的函数族能“到顶”：对角函数 <M t="g(n)=1+\max_{i<n}f_i(n)" /> 最终胜过族中每一个。可计算函数只有可数多个，BB 胜过它们全体，正是这个定理的影子。</>}
          en={<>So no countable family of functions reaches the top: the diagonal function <M t="g(n)=1+\max_{i<n}f_i(n)" /> eventually beats each member. That BB beats all computable functions — there are only countably many — is a shadow of this theorem.</>}
        />
        <H3 en="Why the labels never reach ω₁" zh="为什么刻度永远到不了 ω₁" />
        <P
          zh={<>FGH 的极限步 <M t="f_\lambda(n)=f_{\lambda[n]}(n)" /> 需要一条长度为 <M t="\omega" /> 的基本列 <M t="\lambda[0],\lambda[1],\ldots\to\lambda" />。下面的定理说明，<M t="\omega_1" /> 没有这样的基本列。</>}
          en={<>FGH’s limit step <M t="f_\lambda(n)=f_{\lambda[n]}(n)" /> needs a fundamental sequence of length <M t="\omega" />, <M t="\lambda[0],\lambda[1],\ldots\to\lambda" />. The next theorem shows <M t="\omega_1" /> has none.</>}
        />
        <Thm name={{ en: '(countable sequences stop short of ω₁)', zh: '（可数序列到不了 ω₁）' }}>
          <B
            zh={<p>任何可数多个可数序数 <M t="\alpha_0,\alpha_1,\ldots" /> 的上确界仍是可数序数，因而小于第一个不可数序数 <M t="\omega_1" />。</p>}
            en={<p>The supremum of any countably many countable ordinals <M t="\alpha_0,\alpha_1,\ldots" /> is again countable, hence below <M t="\omega_1" />, the first uncountable ordinal.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>小于上确界的序数，必小于某个 <M t="\alpha_i" />。所以它们组成的集合是可数多个可数集 <M t="\{\beta:\beta<\alpha_i\}" /> 之并。给每个集合选一种排法，把第 <M t="i" /> 个集合的第 <M t="j" /> 项放在位置 <M t="2^i3^j" />，并集就被排成了一列，是可数的。</>}
            en={<>Any ordinal below the supremum lies below some <M t="\alpha_i" />. So the ordinals below it form a union of countably many countable sets <M t="\{\beta:\beta<\alpha_i\}" />. Choose an enumeration of each and send the <M t="j" />-th element of the <M t="i" />-th set to position <M t="2^i3^j" />: the union is listed, hence countable.</>}
          />
        </Proof>
        <P
          zh={<>（“给每个集合选一种排法”用到了可数选择公理，它包含在 ZFC 中。）</>}
          en={<>(“Choose an enumeration of each” uses the countable axiom of choice, which ZFC includes.)</>}
        />
        <KeyIdea>
          <B
            zh={
              <ul>
                <li>每一个具体的、良定义的大数函数——从 <M t="n+1" /> 到 BB、Rayo——若有增长刻度，那刻度都是可数序数，因为它由一条长度为 <M t="\omega" /> 的基本列逼近而来。</li>
                <li>拿到它，对角化一次，就得到更快的函数、更高的刻度。</li>
                <li>可数步的攀登，其上确界仍然可数。所以这场攀登永无止境，却永远到不了 <M t="\omega_1" />。<M t="\omega_1" /> 是地平线：你走多远，它就退多远。</li>
              </ul>
            }
            en={
              <ul>
                <li>Every particular well-defined big-number function — from <M t="n+1" /> to BB and Rayo — gets, if it has a growth label at all, a countable ordinal, approached by a fundamental sequence of length <M t="\omega" />.</li>
                <li>Take it, diagonalize once, and you get a faster function with a higher label.</li>
                <li>A climb in countably many steps still has a countable supremum. So the climb never ends and never reaches <M t="\omega_1" />. <M t="\omega_1" /> is a horizon: however far you walk, it recedes.</li>
              </ul>
            }
          />
        </KeyIdea>
        <P
          zh={<>诚实地说，“增长刻度”本身至今没有严格的一般定义（第 4 章的未解问题），刻度也依赖于基本列的选择。上面的结论应当当作一幅图景，而非定理。</>}
          en={<>To be honest: “growth label” still has no rigorous general definition (Chapter 4’s open problem), and labels depend on the choice of fundamental sequences. Read the conclusion as a picture, not a theorem.</>}
        />
        <Expand kind="deeper" title={{ en: 'Is the climb exactly ω₁ long? It depends on the axioms', zh: '这场攀登恰好有 ω₁ 那么长吗？取决于公理' }}>
          <P
            zh={<>集合论里有一个基数叫<Term en="bounding number" zh="界定数" /> <M t="\mathfrak b" />：最小的、不能被单个函数最终超过的函数族的大小。对角线定理说的正是 <M t="\mathfrak b>\aleph_0" />，即 <M t="\aleph_1\le\mathfrak b\le2^{\aleph_0}" />。</>}
            en={<>Set theory has a cardinal called the <Term en="bounding number" zh="界定数" /> <M t="\mathfrak b" />: the smallest size of a family of functions not eventually beaten by a single function. The diagonal theorem says exactly <M t="\mathfrak b>\aleph_0" />, i.e. <M t="\aleph_1\le\mathfrak b\le2^{\aleph_0}" />.</>}
          />
          <P
            zh={<>在连续统假设下 <M t="\mathfrak b=\aleph_1" />；但也可以一致地有 <M t="\mathfrak b>\aleph_1" />（例如在 Martin 公理加 ¬CH 下）。所以“函数的增长恰好排成 <M t="\omega_1" /> 那么长”在 ZFC 中既不能证明也不能否定。可数序数作为刻度的图景则不受影响。</>}
            en={<>Under the continuum hypothesis <M t="\mathfrak b=\aleph_1" />, but <M t="\mathfrak b>\aleph_1" /> is also consistent (e.g. under Martin’s axiom plus ¬CH). So “the growth of functions lines up in exactly <M t="\omega_1" /> steps” is neither provable nor refutable in ZFC. The picture of countable labels is unaffected.</>}
          />
        </Expand>
        <Expand kind="deeper" title={{ en: 'Ordinals that only look uncountable: ω₁^L', zh: '看起来不可数的序数：ω₁^L' }}>
          <P
            zh={<>第 10 章的可构造宇宙 <M t="L" /> 里也有一个“第一个不可数序数” <M t="\omega_1^L" />。书中（第 12.6 节）指出：若 <M t="0^\sharp" /> 存在，<M t="\omega_1^L" /> 在真正的 <M t="V" /> 中其实是<b>可数</b>的。</>}
            en={<>Chapter 10’s constructible universe <M t="L" /> has its own “first uncountable ordinal” <M t="\omega_1^L" />. The book (§12.6) notes that if <M t="0^\sharp" /> exists, <M t="\omega_1^L" /> is in fact <b>countable</b> in the real <M t="V" />.</>}
          />
          <P
            zh={<>而第 10 章那些反射、稳定、容许序数，都是 <M t="L" /> 中可定义的可数序数，全部位于 <M t="\omega_1^L" /> 之下。地平线在哪里，取决于你站在哪个宇宙里看。</>}
            en={<>All the reflecting, stable and admissible ordinals of Chapter 10 are countable ordinals definable in <M t="L" />, lying below <M t="\omega_1^L" />. Where the horizon sits depends on which universe you stand in.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="journey" kicker={{ en: 'Look back', zh: '回望' }} title={{ en: 'The whole journey', zh: '全程回顾' }}>
        <P
          zh={<>回头看，这十三章只用了寥寥几个招数：重复；对角化；给极限起名并把它当作新的起点（<M t="\omega" />、<M t="\varepsilon_0" />、<M t="\Gamma_0" />、<M t="\Omega" />）；借来够不着的东西再折回来；越过算法；最后越过定义本身。下一幕的尺子把这些招数留下的刻度排成一列。</>}
          en={<>Looking back, thirteen chapters used only a handful of tricks: repeat; diagonalize; name the limit and start again from it (<M t="\omega" />, <M t="\varepsilon_0" />, <M t="\Gamma_0" />, <M t="\Omega" />); borrow something unreachable and fold it back down; go beyond algorithms; and finally go beyond definition itself. The ruler in the next scene lines up the marks these tricks left behind.</>}
        />
        <Widget
          title={{ en: 'The ruler of growth, from 0 to the horizon', zh: '增长之尺：从 0 到地平线' }}
          hint={{ en: 'Click a segment to zoom in; click a mark to see where we met it.', zh: '点击一段可以放大；点击刻度看看我们在哪里遇见它。' }}
        >
          <JourneyRuler />
        </Widget>
        <P
          zh={<>在尺子上，每一段都比前一段“长”得无法想象，可画出来却一样宽。这就是序数刻度的诚实之处：它只记录先后，不记录距离。从 ω 到 ε₀ 的一小段，和从 BO 到 SHO 的一小段，在图上一样长，在“威力”上却毫无可比性。</>}
          en={<>On the ruler, each segment is unimaginably “longer” than the last, yet they are drawn the same width. That is the honesty of ordinal labels: they record order, not distance. The step from ω to ε₀ and the step from BO to SHO look equally long, yet their power is beyond comparison.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="open" kicker={{ en: 'Unfinished', zh: '未完成' }} title={{ en: 'What nobody knows yet', zh: '至今无人知晓' }}>
        <P
          zh={<>大数数学最迷人的地方在于：问题小学生就能听懂，答案却在数学的最前沿。下面收集了本课程各章遇到的未解问题与猜想：有的关于具体的数，有的关于序数与记号，有的关于逻辑与计算的边界。每一条都注明出自哪一章，回到那一章就能读到完整的讨论；问号标出的是猜想，其余是公认的未解问题。</>}
          en={<>The charm of googology is that a child understands the questions while the answers sit at the frontier of mathematics. Here are the open problems and conjectures met across the course — about specific numbers, about ordinals and notations, and about the limits of logic and computation. Each entry names the chapter it comes from, where the full discussion lives; a question mark flags a conjecture, the rest are recognised open problems.</>}
        />
        <Widget title={{ en: 'Open-problem explorer', zh: '未解问题浏览器' }} hint={{ en: 'Filter by act or by area. “?” marks a conjecture.', zh: '按幕或领域筛选。“?”表示猜想。' }}>
          <OpenProblemExplorer />
        </Widget>
        <P
          zh={<>有些问题（例如 BB(6)）也许要靠成百上千人的合作加上计算机证明，就像 2024 年的 BB(5)；有些（例如良定义性）需要的是新的想法。两类都有业余爱好者做出过真正的贡献：BB(5) 证明的作者名单里，就有许多人只署了网名。</>}
          en={<>Some problems, like BB(6), may yield to hundreds of collaborators plus computer-checked proof, as BB(5) did in 2024. Others, like well-definedness, need new ideas. Amateurs have made real contributions to both kinds: many authors of the BB(5) proof signed only with their online handles.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="next" kicker={{ en: 'Epilogue', zh: '尾声' }} title={{ en: 'Where to go from here', zh: '接下来去哪里' }}>
        <P
          zh={<>大数数学有一个活跃的国际社区。据《大数理论》的介绍：</>}
          en={<>Googology has a lively international community. According to 曹知秋’s book:</>}
        />
        <B
          zh={
            <div className="c13-community">
              <div><b>Googology Wiki</b><br />2008 年在 Fandom 上线，长期是最重要的平台；2025 年由 Phyrion 发起、数十位编辑共同维护的新 Wiki 站以现代的眼光重新整理了近年进展。</div>
              <div><b>Discord</b><br />“Googology and Apeirology”频道建于 2019 年底，至今是国际社区的讨论中心。</div>
            </div>
          }
          en={
            <div className="c13-community">
              <div><b>Googology Wiki</b><br />Launched on Fandom in 2008 and long the central hub. In 2025 a new wiki, started by Phyrion and maintained by dozens of editors, reorganized recent progress with a modern eye.</div>
              <div><b>Discord</b><br />The “Googology and Apeirology” server, founded at the end of 2019, is the discussion centre of the international community.</div>
            </div>
          }
        />
        <B
          zh={
            <div className="c13-community">
              <div><b>QQ 群</b><br />test_alpha0 于 2021 年创建“googology/数学爱好者讨论群”（930971194）；夏夜星空的“大数数学爱好者聚集地”（592891596）在 2025 年成为第一大群。</div>
              <div><b>日文社区</b><br />巨大数研究 Wiki（2013），以及 Fish 的《巨大数論》。Bashicu 矩阵等 Worm 型记号就诞生于此。</div>
            </div>
          }
          en={
            <div className="c13-community">
              <div><b>QQ groups (Chinese)</b><br />test_alpha0’s “googology/数学爱好者讨论群” (930971194, 2021); 夏夜星空’s “大数数学爱好者聚集地” (592891596) became the largest in 2025.</div>
              <div><b>Japanese community</b><br />The 巨大数研究 Wiki (2013) and Fish’s book 《巨大数論》. Worm-type notations such as Bashicu matrices were born here.</div>
            </div>
          }
        />
        <H3 en="The book behind this course" zh="本课程背后的书" />
        <P
          zh={<>本课程的主要来源是曹知秋的讲义《大数理论》。它系统地整理了大数数学的理论体系，作者仍在不断修订。最新版在 <span className="mono">github.com/ZhiqiuCao/Googology</span>，英译本与日译本在 <span className="mono">Googology-EN</span> 与 <span className="mono">Googology-JA</span>。</>}
          en={<>This course is built mainly on 曹知秋 (Cao Zhiqiu)’s lecture notes 《大数理论》 (<i>Googology</i>), which organize the theory systematically and are still being revised. The latest version is at <span className="mono">github.com/ZhiqiuCao/Googology</span>; AI translations live at <span className="mono">Googology-EN</span> and <span className="mono">Googology-JA</span>.</>}
        />
        <P
          zh={<>想从另一个角度重温这场决斗，可以读 Scott Aaronson 的《谁能说出更大的数？》（1999）。</>}
          en={<>For another view of the duel, read Scott Aaronson’s “Who Can Name the Bigger Number?” (1999).</>}
        />
        <H3 en="How to keep climbing" zh="如何继续攀登" />
        <P
          zh={<>设计你自己的记号，并给它一个精确的递归定义。写一个展开器，让电脑替你展开。去找它的无穷下降链——找不到，再试着证明它是良序的。</>}
          en={<>Design your own notation and give it an exact recursive definition. Write an expander and let the computer unfold it. Hunt for an infinite descending chain — and if you cannot find one, try to prove it well-ordered.</>}
        />
        <P
          zh={<>然后，拿它和 BMS 比一比。书中说得好：如今，分析已经和发明一样重要。</>}
          en={<>Then compare it with BMS. As the book says, analysis has become as important as invention.</>}
        />
        <B
          zh={<div className="c13-finale">第 1 章里，原始人说出“三”，就赢了一场比赛。<br />如今你知道了：每个数都可以被超越，每种记号都可以被对角化，<br />而那条地平线 <M t="\omega_1" />，永远在前方。</div>}
          en={<div className="c13-finale">In Chapter 1, a caveman said “three” and won a duel.<br />Now you know: every number can be surpassed, every notation diagonalized,<br />and the horizon <M t="\omega_1" /> is always still ahead.</div>}
        />
      </Section>
    </>
  )
}
