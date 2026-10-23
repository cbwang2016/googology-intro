import './ch03.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, Prereq, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { AccumLine, FixedPointMachine, Race, Sticks } from './widgetsA'
import { CantorDiagonal, CNFCalc, DescentGame, HilbertHotel } from './widgetsB'

export default function Chapter03() {
  return (
    <>
      <Prereq
        items={[
          {
            en: <>The new mark <M t="\omega" /> from Chapter 2: the diagonal function <M t="d(n)=n\uparrow^{n}n" /> beats every fixed number of arrows, so its mark must come after all natural numbers.</>,
            zh: <>第 2 章的新刻度 <M t="\omega" />：对角函数 <M t="d(n)=n\uparrow^{n}n" /> 胜过任何固定个数的箭头，所以它的刻度只能排在所有自然数之后。</>,
          },
          {
            en: <>Chapter 2’s two moves: <b>repeat</b> (mark +1) and <b>diagonalize</b> (jump to a limit); recursive definitions and induction.</>,
            zh: <>第 2 章的两个基本动作：<b>重复</b>（刻度 +1）和<b>对角化</b>（跳到极限）；递归定义与数学归纳法。</>,
          },
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      <Section id="race" kicker={{ en: 'Act II opens', zh: '第二幕开场' }} title={{ en: 'Who finishes in place ω?', zh: '谁是第 ω 名？' }}>
        <P
          zh={<>第 2 章留下了一个悬案：对角函数 <M t="d(n)=n\uparrow^{n}n" /> 比刻度 0、1、2、……都快，我们只好给它一个排在“所有自然数之后”的刻度 <M t="\omega" />。可是，“在所有自然数之后”到底是什么意思？</>}
          en={<>Chapter 2 left a loose end. The diagonal function <M t="d(n)=n\uparrow^{n}n" /> outruns marks 0, 1, 2, …, so we gave it a mark <M t="\omega" /> placed “after all natural numbers.” But what does “after all of them” even mean?</>}
        />
        <P
          zh={<>先看一场比赛。无穷多名选手冲线，用时分别是 <M t="\tfrac12,\tfrac34,\tfrac78,\tfrac{15}{16},\ldots" />；另外还有一名选手，用时恰好是 1。按用时排名次，约定第一名记作“第 0 名”。</>}
          en={<>Picture a race. Infinitely many runners finish, at times <M t="\tfrac12,\tfrac34,\tfrac78,\tfrac{15}{16},\ldots" />, and one more runner finishes at time exactly 1. Rank them by time; by convention the winner gets place 0.</>}
        />
        <Widget title={{ en: 'An infinite race', zh: '一场无穷多人的比赛' }} hint={{ en: 'Run the race and watch the first wave pile up just before t = 1.', zh: '开跑，看第一批选手怎样在 t = 1 之前越挤越密。' }}>
          <Race />
        </Widget>
        <P
          zh={<>用时 <M t="\tfrac12" /> 的是第 0 名，<M t="\tfrac34" /> 是第 1 名……第一批选手用光了<b>所有</b>自然数。可那位用时 1 的选手确实有一个明确的名次：紧跟在所有人之后。我们叫它<b>第 <M t="\omega" /> 名</b>。</>}
          en={<>The runner at <M t="\tfrac12" /> is place 0, at <M t="\tfrac34" /> place 1, and so on: the first wave uses up <b>every</b> natural number. Yet the runner at time 1 has a perfectly definite place, right after all of them. We call it <b>place <M t="\omega" /></b>.</>}
        />
        <P
          zh={<>这不是一个模糊的“无穷大”，而是和“第 3 名”一样确定的位置。再加一批选手，就有第 <M t="\omega+1" />、<M t="\omega+2" />……名，最后是第 <M t="\omega\cdot2" /> 名。这些“名次”就是本章的主角：<Term en="ordinals" zh="序数" />。</>}
          en={<>This is no fuzzy “infinity”; it is a position as definite as place 3. Add a second wave and you get places <M t="\omega+1" />, <M t="\omega+2" />, …, and finally <M t="\omega\cdot2" />. These places are the heroes of this chapter: the <Term en="ordinals" zh="序数" />.</>}
        />
        <Expand kind="deeper" title={{ en: 'Where Cantor found them (1880–1883)', zh: 'Cantor 是在哪里发现它们的（1880–1883）' }}>
          <P
            zh={<>Georg Cantor 并不是为了好玩才发明序数。他在研究三角级数可能“出毛病”的点集时，反复删去孤立点：删一次、删两次……删完无穷多次之后还得接着删。于是他需要给“第无穷次之后的那一次”编号。1883 年的《一般集合论基础》把这些编号正式变成了超穷序数，后来他用 <M t="\omega" /> 记第一个。</>}
            en={<>Georg Cantor did not invent ordinals for fun. Studying the sets of points where a trigonometric series can misbehave, he repeatedly deleted isolated points: once, twice, …, and after infinitely many deletions he still had to continue. He needed names for the steps after “step infinity.” His 1883 <i>Grundlagen</i> turned these names into the transfinite ordinal numbers; later he wrote <M t="\omega" /> for the first one.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="well-order" kicker={{ en: 'The rules of the line', zh: '排队的规矩' }} title={{ en: 'Which lines can be ranked?', zh: '什么样的队伍能排名次？' }}>
        <P
          zh={<>排名次之所以行得通，靠的是队伍的四条性质：没有并列；任意两人都能比先后；先后关系可以传递；以及最关键的一条——<b>任何一群人里都有排在最前面的那一个</b>。</>}
          en={<>Ranking works because the line has four properties: no ties; any two members can be compared; the order is transitive; and the crucial one — <b>every nonempty group has a first member</b>.</>}
        />
        <Thm kind="definition" name={{ en: 'well-order', zh: '良序' }}>
          <B
            zh={<p>一个集合上的全序（无并列、任意两元可比、可传递）叫做<Term en="well-order" zh="良序" />，如果它的<b>每个非空子集都有最小元</b>。</p>}
            en={<p>A total order on a set (no ties, any two comparable, transitive) is a <Term en="well-order" zh="良序" /> if <b>every nonempty subset has a least element</b>.</p>}
          />
        </Thm>
        <P
          zh={<>自然数 <M t="\N=\{0,1,2,\ldots\}" /> 是良序的。整数 <M t="\mathbb Z" /> 不是：负整数这一群人里没有排在最前面的，<M t="\cdots<-3<-2<-1" /> 往前永远走不到头。这是一场“没有冠军的比赛”。</>}
          en={<>The naturals <M t="\N=\{0,1,2,\ldots\}" /> are well-ordered. The integers <M t="\mathbb Z" /> are not: the negative integers have no first member, since <M t="\cdots<-3<-2<-1" /> never bottoms out. It is a race with no winner.</>}
        />
        <H3 en="A dictionary with no first page" zh="一本没有第一页的词典" />
        <P
          zh={<>考虑只用字母 a、b 拼成的所有单词，按词典顺序排列。每个单词都只有有限个字母，这总该是良序了吧？</>}
          en={<>Take all words made of the letters a and b, in dictionary order. Every word is finite. Surely that is a well-order?</>}
        />
        <P
          zh={<>不是。看这一串：<M t="\texttt{b}>\texttt{ab}>\texttt{aab}>\texttt{aaab}>\cdots" />。它们构成的子集没有最小元——词典顺序可以无穷地往下走。但如果先按长度、再按字母排（“短词优先”），就得到一个良序，形状和 <M t="\N" /> 一模一样。本章后面会用到这个排法。</>}
          en={<>No. Look at <M t="\texttt{b}>\texttt{ab}>\texttt{aab}>\texttt{aaab}>\cdots" />. That subset has no least element: dictionary order lets you descend forever. Sort by length first and alphabetically second (“shortlex”), however, and you get a well-order shaped exactly like <M t="\N" />. We will use that ordering later in this chapter.</>}
        />
        <P
          zh={<>为什么要在乎“每个子集都有最小元”？因为它恰好保证了<b>过程会停下来</b>。这是本章最重要的定理，“不可能无穷下降”那一幕会证明它。</>}
          en={<>Why care about least elements? Because that property is exactly what guarantees <b>processes terminate</b>. It is the most important theorem of this chapter, proved in the scene “You cannot fall forever.”</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="order-type" kicker={{ en: 'What is an ordinal?', zh: '序数是什么' }} title={{ en: 'Ordinals are shapes of lines', zh: '序数是队伍的形状' }}>
        <P
          zh={<>两条良序的队伍，如果能一对一地配对、并且<b>保持先后顺序</b>，就说它们有相同的<Term en="order type" zh="序型" />。比如 <M t="\{0,1,2,\ldots\}" /> 和 <M t="\{\tfrac12,\tfrac34,\tfrac78,\ldots\}" /> 序型相同：把 <M t="n" /> 配给 <M t="1-2^{-(n+1)}" /> 即可。</>}
          en={<>Two well-ordered lines have the same <Term en="order type" zh="序型" /> if they can be paired off one-to-one <b>while preserving order</b>. For instance <M t="\{0,1,2,\ldots\}" /> and <M t="\{\tfrac12,\tfrac34,\tfrac78,\ldots\}" /> have the same type: pair <M t="n" /> with <M t="1-2^{-(n+1)}" />.</>}
        />
        <Thm kind="definition" name={{ en: 'ordinal', zh: '序数' }}>
          <B
            zh={<p><b>序数</b>就是良序集的序型。空队伍的序型是 0；<M t="n" /> 个人的队伍是 <M t="n" />；<M t="\N" /> 的序型是 <M t="\omega" />；前面那场比赛（第一批选手加上用时 1 的那位）的序型是 <M t="\omega+1" />。</p>}
            en={<p>An <b>ordinal</b> is the order type of a well-ordered set. The empty line has type 0; a line of <M t="n" /> people has type <M t="n" />; <M t="\N" /> has type <M t="\omega" />; the race (first wave plus the runner at time 1) has type <M t="\omega+1" />.</p>}
          />
        </Thm>
        <Thm kind="fact" name={{ en: 'the basic facts (Cantor, 1897)', zh: '基本事实（Cantor，1897）' }}>
          <B
            zh={
              <ol>
                <li>任意两条良序队伍都可以比较：其中一条和另一条的某一段开头序型相同。于是序数可以比大小：<M t="\alpha<\beta" /> 指 <M t="\alpha" /> 型的队伍是 <M t="\beta" /> 型队伍的一段真开头。</li>
                <li>比 <M t="\alpha" /> 小的所有序数，排成的队伍序型恰好是 <M t="\alpha" />。也就是说，<b>第 <M t="\alpha" /> 名前面恰好有 <M t="\alpha" /> 个名次</b>。</li>
                <li>任何一组序数，按大小排都是良序的。</li>
              </ol>
            }
            en={
              <ol>
                <li>Any two well-ordered lines are comparable: one has the same type as an initial segment of the other. So ordinals can be compared: <M t="\alpha<\beta" /> means a line of type <M t="\alpha" /> is a proper initial segment of a line of type <M t="\beta" />.</li>
                <li>The ordinals smaller than <M t="\alpha" />, lined up by size, have order type exactly <M t="\alpha" />. In words: <b>place <M t="\alpha" /> has exactly <M t="\alpha" /> places before it</b>.</li>
                <li>Any set of ordinals, ordered by size, is well-ordered.</li>
              </ol>
            }
          />
        </Thm>
        <P
          zh={<>第 2 条说明“名次”和“长度”是一回事，这正是我们从 0 开始排名的好处：用时 1 的选手是第 <M t="\omega" /> 名，他前面恰好有 <M t="\omega" /> 个人。这些事实的证明可以在任何一本集合论教材里找到（例如 Jech《Set Theory》第 2 章），本课程直接使用。</>}
          en={<>Fact 2 says that “place” and “length” coincide — the payoff of ranking from 0. The runner at time 1 is in place <M t="\omega" /> and has exactly <M t="\omega" /> runners ahead. Proofs are in any set theory text (e.g. Jech, <i>Set Theory</i>, ch. 2); we use the facts freely.</>}
        />
        <Expand kind="deeper" title={{ en: 'What an ordinal “really is”: von Neumann (1923)', zh: '序数“到底是什么”：von Neumann（1923）' }}>
          <P
            zh={<>“序型”是一类队伍的共同形状。集合论里人们希望每个序数都是一个具体的集合。John von Neumann 的办法是：<b>每个序数就是所有比它小的序数组成的集合</b>。</>}
            en={<>An “order type” is the common shape of a whole class of lines. In set theory one wants each ordinal to be one concrete set. John von Neumann’s trick: <b>each ordinal is the set of all smaller ordinals</b>.</>}
          />
          <MB t="0=\varnothing,\ \ 1=\{0\},\ \ 2=\{0,1\},\ \ldots,\ \ \omega=\{0,1,2,\ldots\},\ \ \omega+1=\omega\cup\{\omega\}." />
          <P
            zh={<>于是 <M t="\alpha<\beta" /> 就是 <M t="\alpha\in\beta" />，而“后继”就是 <M t="\alpha+1=\alpha\cup\{\alpha\}" />。严格的定义是：一个集合是序数，当且仅当它的每个元素也是它的子集，并且它在 <M t="\in" /> 下是良序的。第 10 章会再用到这种写法。</>}
            en={<>Then <M t="\alpha<\beta" /> simply means <M t="\alpha\in\beta" />, and the successor is <M t="\alpha+1=\alpha\cup\{\alpha\}" />. Officially: a set is an ordinal iff each of its elements is also a subset of it and it is well-ordered by <M t="\in" />. Chapter 10 uses this form again.</>}
          />
        </Expand>
        <Expand kind="deeper" title={{ en: 'There is no set of all ordinals (Burali-Forti, 1897)', zh: '不存在“所有序数的集合”（Burali-Forti，1897）' }}>
          <P
            zh={<>假设所有序数组成一个集合 Ord。由第 3 条事实它是良序的，于是它有一个序型 <M t="\Omega" />，而 <M t="\Omega" /> 本身也是序数，所以 <M t="\Omega\in\mathrm{Ord}" />。由第 2 条，比 <M t="\Omega" /> 小的序数恰好排成 <M t="\Omega" /> 型——也就是说它们已经是全部序数，<M t="\Omega" /> 自己必须比 <M t="\Omega" /> 小。矛盾。</>}
            en={<>Suppose all ordinals formed a set Ord. By fact 3 it is well-ordered, so it has an order type <M t="\Omega" />, itself an ordinal, so <M t="\Omega\in\mathrm{Ord}" />. By fact 2 the ordinals below <M t="\Omega" /> already have type <M t="\Omega" /> — they are all of Ord — so <M t="\Omega" /> must be below itself. Contradiction.</>}
          />
          <P
            zh={<>结论：所有序数组成的是一个“<Term en="proper class" zh="真类" />”，大到不能算作集合。序数永远数不完。</>}
            en={<>Conclusion: the ordinals form a <Term en="proper class" zh="真类" />, too big to be a set. There is no end to them.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="limits" kicker={{ en: 'Two ways to move', zh: '两种走法' }} title={{ en: 'Successors and limits', zh: '后继与极限' }}>
        <P
          zh={<>位置有两种：紧跟在某个位置之后的（3 跟着 2，<M t="\omega+1" /> 跟着 <M t="\omega" />），和没有“紧挨着的前一个”的（<M t="\omega" />：无论你说哪个 <M t="n" />，中间都隔着 <M t="n+1" />）。</>}
          en={<>Positions come in two kinds: those right after another (3 after 2, <M t="\omega+1" /> after <M t="\omega" />), and those with no immediate predecessor (<M t="\omega" />: whatever <M t="n" /> you name, <M t="n+1" /> sits in between).</>}
        />
        <Thm kind="definition" name={{ en: 'successor, supremum, limit', zh: '后继、上确界、极限' }}>
          <B
            zh={
              <ul>
                <li><M t="\alpha+1" /> 是紧跟在 <M t="\alpha" /> 之后的序数，叫 <M t="\alpha" /> 的<Term en="successor" zh="后继" />。</li>
                <li>一组序数的<Term en="supremum" zh="上确界" /> <M t="\sup" /> 是大于等于它们全体的最小序数（它总是存在）。</li>
                <li>既不是 0、也不是后继的序数叫<Term en="limit ordinal" zh="极限序数" />。</li>
              </ul>
            }
            en={
              <ul>
                <li><M t="\alpha+1" />, the ordinal right after <M t="\alpha" />, is its <Term en="successor" zh="后继" />.</li>
                <li>The <Term en="supremum" zh="上确界" /> of a set of ordinals is the least ordinal <M t="\ge" /> all of them (it always exists).</li>
                <li>An ordinal that is neither 0 nor a successor is a <Term en="limit ordinal" zh="极限序数" />.</li>
              </ul>
            }
          />
        </Thm>
        <P
          zh={<>每个<b>可数的</b>极限序数 <M t="\lambda" /> 都是某个严格递增序列的上确界：<M t="\lambda=\sup\{\lambda[0],\lambda[1],\lambda[2],\ldots\}" />。这样的序列叫 <M t="\lambda" /> 的<Term en="fundamental sequence" zh="基本列" />，例如 <M t="\omega=\sup\{0,1,2,\ldots\}" />。约定自然数和基本列都从 0 开始编号；第 4 章会为每个用到的极限指定标准基本列。</>}
          en={<>Every <b>countable</b> limit <M t="\lambda" /> is the supremum of a strictly increasing sequence, <M t="\lambda=\sup\{\lambda[0],\lambda[1],\lambda[2],\ldots\}" />, called a <Term en="fundamental sequence" zh="基本列" /> for <M t="\lambda" />; e.g. <M t="\omega=\sup\{0,1,2,\ldots\}" />. Natural numbers and fundamental sequences are indexed from 0; Chapter 4 fixes a standard fundamental sequence for each limit we use.</>}
        />
        <KeyIdea>
          <L
            zh={<>序数只有两种生成方式：<b>+1</b> 和<b>取上确界</b>。它们恰好对应第 2 章造快速函数的两个动作：<b>把函数重复 <M t="n" /> 次</b>（刻度 +1）和<b>对角化</b>（越过一整列刻度）。这就是为什么序数能当“增长之尺”。</>}
            en={<>Ordinals are generated by just two moves: <b>+1</b> and <b>take the supremum</b>. They match Chapter 2’s two ways of building fast functions exactly: <b>iterate <M t="n" /> times</b> (mark +1) and <b>diagonalize</b> (leap past a whole sequence of marks). That is why ordinals can serve as the ruler of growth.</>}
          />
        </KeyIdea>
        <H3 en="Zoom and squeeze" zh="放大与压缩" />
        <P
          zh={<>比赛的画法可以层层嵌套，每个极限序数都是一个堆积点。</>}
          en={<>The race picture nests; every limit ordinal is a pile-up point.</>}
        />
        <Widget title={{ en: 'Every ordinal below ω^ω on one line', zh: '把 ω^ω 以下的序数画在一条线上' }} hint={{ en: 'Switch stages; click to zoom into a pile-up.', zh: '切换阶段；点击可放大堆积点。' }}>
          <AccumLine />
        </Widget>
        <P
          zh={<>放大 <M t="\omega^2" /> 附近，你会看到 <M t="\omega\cdot n" /> 们堆积过去；再放大其中任何一个 <M t="\omega\cdot n" /> 附近，又是一整条 <M t="\omega" /> 队伍。<M t="\omega^\omega" /> 是“极限的极限的极限……”，但它在线上仍然只是<b>一个点</b>。</>}
          en={<>Zoom in near <M t="\omega^2" /> and you see the <M t="\omega\cdot n" /> piling up; zoom near any <M t="\omega\cdot n" /> and a whole <M t="\omega" />-line appears. <M t="\omega^\omega" /> is a limit of limits of limits — yet on the line it is still <b>one point</b>.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="arithmetic" kicker={{ en: 'Arithmetic of positions', zh: '位置的算术' }} title={{ en: '1 + ω is not ω + 1', zh: '1 + ω 不等于 ω + 1' }}>
        <P
          zh={<>序数的加法就是<b>排队</b>：<M t="\alpha+\beta" /> 是一条 <M t="\alpha" /> 型的队伍后面接一条 <M t="\beta" /> 型的队伍。乘法 <M t="\alpha\cdot\beta" /> 是把 <M t="\beta" /> 条 <M t="\alpha" /> 型队伍首尾相接。</>}
          en={<>Ordinal addition is <b>queueing</b>: <M t="\alpha+\beta" /> is a line of type <M t="\alpha" /> followed by a line of type <M t="\beta" />. Multiplication <M t="\alpha\cdot\beta" /> is <M t="\beta" /> copies of <M t="\alpha" />, end to end.</>}
        />
        <P
          zh={<><M t="1+\omega" />：一个人插在整条 <M t="\omega" /> 队伍<b>前面</b>。重新编号时他是第 0 名，其余每人往后挪一位——队伍的形状没变，还是 <M t="\omega" />。<M t="\omega+1" />：一个人排在所有人<b>后面</b>，谁也挪不出位置给他，于是多出一个最后的名次。</>}
          en={<><M t="1+\omega" />: one person joins <b>in front of</b> an <M t="\omega" />-line. Renumbering, he is place 0 and everyone else shifts back by one — the shape is unchanged, still <M t="\omega" />. <M t="\omega+1" />: one person joins <b>behind</b> everyone, and no shifting makes room, so a new last place appears.</>}
        />
        <Widget title={{ en: 'Build lines out of sticks', zh: '用小棍拼队伍' }} hint={{ en: 'Top: the line as built. Bottom: the same sticks renumbered in order.', zh: '上排是拼出的队伍，下排是同一批小棍按顺序重新编号。' }}>
          <Sticks />
        </Widget>
        <Thm kind="definition" name={{ en: 'ordinal arithmetic (book Defs 3.1–3.3)', zh: '序数运算（《大数理论》定义 3.1–3.3）' }}>
          <MB t="\begin{aligned}&\alpha+0=\alpha,&&\alpha+(\beta+1)=(\alpha+\beta)+1,&&\alpha+\lambda=\sup_{\beta<\lambda}(\alpha+\beta),\\&\alpha\cdot0=0,&&\alpha\cdot(\beta+1)=\alpha\cdot\beta+\alpha,&&\alpha\cdot\lambda=\sup_{\beta<\lambda}\alpha\cdot\beta,\\&\alpha^{0}=1,&&\alpha^{\beta+1}=\alpha^{\beta}\cdot\alpha,&&\alpha^{\lambda}=\sup_{\beta<\lambda}\alpha^{\beta}\quad(\lambda\text{ limit}).\end{aligned}" />
        </Thm>
        <P
          zh={<>和第 2 章的箭头一样，这是递归定义——只是多了第三列：<b>遇到极限，就取上确界</b>。它和“排队”的直观定义给出相同的结果。</>}
          en={<>Like Chapter 2’s arrows, this is a recursive definition — with one new column: <b>at a limit, take the supremum</b>. It agrees with the queueing picture.</>}
        />
        <Thm name={{ en: '(order matters)', zh: '（顺序很重要）' }}>
          <MB t="1+\omega=\omega<\omega+1,\qquad 2\cdot\omega=\omega<\omega\cdot2,\qquad 2^{\omega}=\omega." />
        </Thm>
        <Proof>
          <L
            zh={<>按极限那一列：<M t="1+\omega=\sup_n(1+n)=\sup\{1,2,3,\ldots\}=\omega" />；<M t="2\cdot\omega=\sup_n 2n=\omega" />；<M t="2^{\omega}=\sup_n 2^n=\omega" />。而 <M t="\omega\cdot2=\omega+\omega" /> 和 <M t="\omega+1" /> 都是在 <M t="\omega" /> 后面又接了东西，所以都比 <M t="\omega" /> 大。</>}
            en={<>Use the limit column: <M t="1+\omega=\sup_n(1+n)=\sup\{1,2,3,\ldots\}=\omega" />; <M t="2\cdot\omega=\sup_n 2n=\omega" />; <M t="2^{\omega}=\sup_n 2^n=\omega" />. Meanwhile <M t="\omega\cdot2=\omega+\omega" /> and <M t="\omega+1" /> both attach something after <M t="\omega" />, so both exceed it.</>}
          />
        </Proof>
        <Expand kind="detail" title={{ en: 'Which laws survive?', zh: '哪些运算律还成立？' }}>
          <B
            zh={
              <ul>
                <li>成立：加法、乘法结合律；左分配律 <M t="\alpha\cdot(\beta+\gamma)=\alpha\cdot\beta+\alpha\cdot\gamma" />；<M t="\alpha^{\beta+\gamma}=\alpha^{\beta}\cdot\alpha^{\gamma}" />；<M t="(\alpha^{\beta})^{\gamma}=\alpha^{\beta\cdot\gamma}" />。</li>
                <li>不成立：交换律（<M t="1+\omega\ne\omega+1" />，<M t="2\cdot\omega\ne\omega\cdot2" />）；右分配律（<M t="(\omega+1)\cdot2\ne\omega\cdot2+2" />）；<M t="(\alpha\cdot\beta)^{\gamma}=\alpha^{\gamma}\cdot\beta^{\gamma}" />（例如 <M t="(\omega\cdot2)^2=\omega\cdot2\cdot\omega\cdot2=\omega^2\cdot2" />，而不是 <M t="\omega^2\cdot4" />）。</li>
                <li>都严格递增于右边的参数：<M t="\beta<\gamma" /> 推出 <M t="\alpha+\beta<\alpha+\gamma" />，以及（<M t="\alpha\ge1" /> 时）<M t="\alpha\cdot\beta<\alpha\cdot\gamma" />、（<M t="\alpha\ge2" /> 时）<M t="\alpha^{\beta}<\alpha^{\gamma}" />。左边的参数只保证“不减”：<M t="1<2" />，但 <M t="1+\omega=2+\omega" />。</li>
              </ul>
            }
            en={
              <ul>
                <li>True: associativity of + and ·; left distributivity <M t="\alpha\cdot(\beta+\gamma)=\alpha\cdot\beta+\alpha\cdot\gamma" />; <M t="\alpha^{\beta+\gamma}=\alpha^{\beta}\cdot\alpha^{\gamma}" />; <M t="(\alpha^{\beta})^{\gamma}=\alpha^{\beta\cdot\gamma}" />.</li>
                <li>False: commutativity (<M t="1+\omega\ne\omega+1" />, <M t="2\cdot\omega\ne\omega\cdot2" />); right distributivity (<M t="(\omega+1)\cdot2\ne\omega\cdot2+2" />); <M t="(\alpha\cdot\beta)^{\gamma}=\alpha^{\gamma}\cdot\beta^{\gamma}" /> (e.g. <M t="(\omega\cdot2)^2=\omega\cdot2\cdot\omega\cdot2=\omega^2\cdot2" />, not <M t="\omega^2\cdot4" />).</li>
                <li>All three operations are strictly increasing in the right argument: <M t="\beta<\gamma" /> gives <M t="\alpha+\beta<\alpha+\gamma" />, and <M t="\alpha\cdot\beta<\alpha\cdot\gamma" /> (for <M t="\alpha\ge1" />), <M t="\alpha^{\beta}<\alpha^{\gamma}" /> (for <M t="\alpha\ge2" />). In the left argument they are only non-decreasing: <M t="1<2" /> but <M t="1+\omega=2+\omega" />.</li>
              </ul>
            }
          />
        </Expand>
        <P
          zh={<>口诀：<b>小的东西放在左边会被“吞掉”</b>。<M t="\omega" /> 个“2 人小组”排成一队还是 <M t="\omega" />；2 条 <M t="\omega" /> 队伍首尾相接却是 <M t="\omega\cdot2" />。</>}
          en={<>Rule of thumb: <b>something small on the left gets swallowed</b>. <M t="\omega" /> pairs in a row is still <M t="\omega" />; two <M t="\omega" />-lines end to end make <M t="\omega\cdot2" />.</>}
        />
        <Quiz
          q={{ zh: <p><M t="(\omega+1)\cdot2" /> 等于多少？</p>, en: <p>What is <M t="(\omega+1)\cdot2" />?</p> }}
          options={[
            { zh: <p><M t="\omega\cdot2+2" />（乘法分配律）</p>, en: <p><M t="\omega\cdot2+2" /> (distribute)</p> },
            { zh: <p><M t="\omega\cdot2+1" /></p>, en: <p><M t="\omega\cdot2+1" /></p> },
            { zh: <p><M t="\omega\cdot2" /></p>, en: <p><M t="\omega\cdot2" /></p> },
          ]}
          answer={1}
          explain={{
            zh: <p><M t="(\omega+1)\cdot2=(\omega+1)+(\omega+1)=\omega+(1+\omega)+1=\omega+\omega+1" />。中间那个 1 后面紧跟一整条 <M t="\omega" />，被吞掉了；最后那个 1 后面没人，留了下来。右分配律对序数不成立。</p>,
            en: <p><M t="(\omega+1)\cdot2=(\omega+1)+(\omega+1)=\omega+(1+\omega)+1=\omega+\omega+1" />. The middle 1 is followed by a whole <M t="\omega" /> and gets swallowed; the last 1 has nobody after it and survives. Right distributivity fails for ordinals.</p>,
          }}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="epsilon" kicker={{ en: 'The climb', zh: '攀登' }} title={{ en: 'Up to ε₀', zh: '一路爬到 ε₀' }}>
        <P
          zh={<>用 +1 和取上确界，我们可以一直往上爬。每个路标都是前一串的极限：</>}
          en={<>With +1 and suprema we can keep climbing. Each landmark is the limit of the previous run:</>}
        />
        <MB t="0,1,2,\ldots,\ \omega,\ \omega+1,\ldots,\ \omega\cdot2,\ldots,\ \omega^2,\ldots,\ \omega^3,\ldots,\ \omega^{\omega},\ldots,\ \omega^{\omega^{\omega}},\ldots" />
        <P
          zh={<>记 <M t="\omega\uparrow\uparrow0=1" />，<M t="\omega\uparrow\uparrow(n+1)=\omega^{\omega\uparrow\uparrow n}" />，也就是 <M t="n" /> 层的 <M t="\omega" /> 指数塔。这一整列指数塔的上确界有一个专门的名字，是 Cantor 在 1897 年起的：</>}
          en={<>Write <M t="\omega\uparrow\uparrow0=1" /> and <M t="\omega\uparrow\uparrow(n+1)=\omega^{\omega\uparrow\uparrow n}" />: a tower of <M t="n" /> omegas. The supremum of all these towers has its own name, given by Cantor in 1897:</>}
        />
        <MB t="\varepsilon_0=\sup\{1,\ \omega,\ \omega^{\omega},\ \omega^{\omega^{\omega}},\ \ldots\}=\sup_n\ \omega\uparrow\uparrow n." />
        <H3 en="The first fixed point" zh="第一个不动点" />
        <Thm name={{ en: '(ε₀ is the first fixed point of α ↦ ω^α)', zh: '（ε₀ 是 α ↦ ω^α 的第一个不动点）' }}>
          <B
            zh={<p><M t="\omega^{\varepsilon_0}=\varepsilon_0" />；并且任何满足 <M t="\omega^{\alpha}=\alpha" /> 的序数都 <M t="\ge\varepsilon_0" />。</p>}
            en={<p><M t="\omega^{\varepsilon_0}=\varepsilon_0" />, and every ordinal with <M t="\omega^{\alpha}=\alpha" /> is <M t="\ge\varepsilon_0" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>由极限规则，<M t="\omega^{\varepsilon_0}=\sup_{\gamma<\varepsilon_0}\omega^{\gamma}" />。每个 <M t="\gamma<\varepsilon_0" /> 都小于某个 <M t="\omega\uparrow\uparrow k" />，于是 <M t="\omega^{\gamma}<\omega\uparrow\uparrow(k+1)<\varepsilon_0" />，所以 <M t="\omega^{\varepsilon_0}\le\varepsilon_0" />。反过来 <M t="\omega^{\varepsilon_0}\ge\omega^{\omega\uparrow\uparrow k}=\omega\uparrow\uparrow(k+1)" /> 对每个 <M t="k" /> 成立，故 <M t="\omega^{\varepsilon_0}\ge\varepsilon_0" />。最小性：若 <M t="\omega^{\alpha}=\alpha" />，则 <M t="\alpha\neq0" />（因为 <M t="\omega^0=1" />），即 <M t="\alpha\ge\omega\uparrow\uparrow0" />；若 <M t="\alpha\ge\omega\uparrow\uparrow k" />，则 <M t="\alpha=\omega^{\alpha}\ge\omega\uparrow\uparrow(k+1)" />。归纳得 <M t="\alpha" /> 不小于每一层塔，所以 <M t="\alpha\ge\varepsilon_0" />。</>}
            en={<>By the limit rule, <M t="\omega^{\varepsilon_0}=\sup_{\gamma<\varepsilon_0}\omega^{\gamma}" />. Each <M t="\gamma<\varepsilon_0" /> lies below some <M t="\omega\uparrow\uparrow k" />, so <M t="\omega^{\gamma}<\omega\uparrow\uparrow(k+1)<\varepsilon_0" />; hence <M t="\omega^{\varepsilon_0}\le\varepsilon_0" />. Conversely <M t="\omega^{\varepsilon_0}\ge\omega^{\omega\uparrow\uparrow k}=\omega\uparrow\uparrow(k+1)" /> for every <M t="k" />, so <M t="\omega^{\varepsilon_0}\ge\varepsilon_0" />. Minimality: if <M t="\omega^{\alpha}=\alpha" /> then <M t="\alpha\neq0" /> (as <M t="\omega^0=1" />), so <M t="\alpha\ge\omega\uparrow\uparrow0" />; and if <M t="\alpha\ge\omega\uparrow\uparrow k" /> then <M t="\alpha=\omega^{\alpha}\ge\omega\uparrow\uparrow(k+1)" />. By induction <M t="\alpha" /> is at least every tower, so <M t="\alpha\ge\varepsilon_0" />.</>}
          />
        </Proof>
        <P
          zh={<>满足 <M t="f(x)=x" /> 的 <M t="x" /> 叫函数 <M t="f" /> 的<Term en="fixed point" zh="不动点" />。<M t="1+\omega=\omega" /> 说的也是这件事：<M t="\omega" /> 是 <M t="\alpha\mapsto1+\alpha" /> 的不动点。下面这台机器展示了统一的配方：<b>从 0 出发不断作用 <M t="f" />，再取上确界</b>。</>}
          en={<>An <M t="x" /> with <M t="f(x)=x" /> is a <Term en="fixed point" zh="不动点" /> of <M t="f" />. The identity <M t="1+\omega=\omega" /> says the same: <M t="\omega" /> is a fixed point of <M t="\alpha\mapsto1+\alpha" />. The machine below runs one universal recipe: <b>start at 0, apply <M t="f" /> again and again, take the supremum</b>.</>}
        />
        <Widget title={{ en: 'The fixed-point machine', zh: '不动点机器' }}>
          <FixedPointMachine />
        </Widget>
        <P
          zh={<>注意 <M t="2^{\alpha}" /> 那一栏：<M t="2,4,16,65536,2^{65536},\ldots" /> 涨得飞快，却只爬到 <M t="\omega" />。<b>有限次的爆炸，抵不过一次“取极限”</b>。第 7 章会把这台机器开足马力，越过 <M t="\varepsilon_0" /> 一路走到 <M t="\Gamma_0" />。</>}
          en={<>Look at the <M t="2^{\alpha}" /> column: <M t="2,4,16,65536,2^{65536},\ldots" /> explodes, yet only reaches <M t="\omega" />. <b>No finite explosion beats a single limit.</b> Chapter 7 runs this machine at full power, past <M t="\varepsilon_0" /> all the way to <M t="\Gamma_0" />.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="descent" kicker={{ en: 'The engine', zh: '发动机' }} title={{ en: 'You cannot fall forever', zh: '不可能无穷下降' }}>
        <P
          zh={<>来玩个游戏。从 <M t="\omega^{\omega}" /> 出发，每一步走到任意一个<b>更小</b>的序数。步子随你迈：可以从 <M t="\omega^{\omega}" /> 跳到 <M t="\omega^{1000000}" />，也可以从 <M t="\omega" /> 跳到十亿。目标：永远走下去。</>}
          en={<>A game. Start at <M t="\omega^{\omega}" />; each move goes to any <b>smaller</b> ordinal. Steps can be as wild as you like: <M t="\omega^{\omega}" /> to <M t="\omega^{1000000}" />, or <M t="\omega" /> to a billion. Your goal: keep going forever.</>}
        />
        <P
          zh={<>游戏想拖多长都行：每到一个极限，比如 <M t="\omega" />，你就报一个天文数字。那么，能不能让它<b>永不结束</b>？</>}
          en={<>You can make the game as long as you like: at a limit such as <M t="\omega" />, just name an astronomical number. So can you make it <b>never end</b>?</>}
        />
        <H3 en="Your move" zh="轮到你了" />
        <Widget title={{ en: 'The descent game', zh: '下降游戏' }} hint={{ en: 'Type your next ordinal’s coefficients, or let the greedy player move.', zh: '输入下一个序数的系数，或让贪心玩家替你走。' }}>
          <DescentGame />
        </Widget>
        <Thm name={{ en: '(no infinite descent)', zh: '（不存在无穷下降）' }}>
          <B
            zh={<p>不存在严格递减的无穷序数列 <M t="\alpha_0>\alpha_1>\alpha_2>\cdots" />。</p>}
            en={<p>There is no infinite strictly decreasing sequence of ordinals <M t="\alpha_0>\alpha_1>\alpha_2>\cdots" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>假设有这样一列。<M t="\alpha_1,\alpha_2,\ldots" /> 都小于 <M t="\alpha_0" />，所以它们都是一条 <M t="\alpha_0" /> 型良序队伍里的位置（基本事实第 2 条）。良序的定义说，非空子集 <M t="\{\alpha_1,\alpha_2,\ldots\}" /> 有最小元，设为 <M t="\alpha_k" />。可是 <M t="\alpha_{k+1}<\alpha_k" /> 也在这个子集里。矛盾。</>}
            en={<>Suppose such a sequence exists. The ordinals <M t="\alpha_1,\alpha_2,\ldots" /> are all below <M t="\alpha_0" />, hence positions in a well-ordered line of type <M t="\alpha_0" /> (basic fact 2). By the definition of well-order, the nonempty subset <M t="\{\alpha_1,\alpha_2,\ldots\}" /> has a least element, say <M t="\alpha_k" />. But <M t="\alpha_{k+1}<\alpha_k" /> is in the subset too. Contradiction.</>}
          />
        </Proof>
        <KeyIdea>
          <L
            zh={<>所以下降游戏<b>有限，却没有上限</b>。这是后面每一个“它一定会停”的证明背后的发动机：给过程的每个状态配一个序数，证明每一步序数都严格变小，于是过程必然终止。第 4 章用它说明 FGH 的值总能算完；第 5 章用它对付初等序列；第 6 章用它驯服 Goodstein 序列和九头蛇——哪怕那些过程长得超乎想象。</>}
            en={<>So the descent game is <b>finite, yet unbounded</b>. This is the engine behind every “it must stop” proof to come. Attach an ordinal to each state of a process, show it strictly decreases at every step, and termination follows. Chapter 4 uses it to show FGH values are well defined; Chapter 5 tames primitive sequences with it; Chapter 6 tames Goodstein sequences and the hydra — however absurdly long those processes run.</>}
          />
        </KeyIdea>
        <Expand kind="detail" title={{ en: 'Transfinite induction, and the converse', zh: '超穷归纳法，以及逆命题' }}>
          <P
            zh={<><b>超穷归纳法（已证明）。</b> 若对每个 <M t="\alpha" />，“<M t="P" /> 对所有 <M t="\beta<\alpha" /> 成立”能推出“<M t="P(\alpha)" /> 成立”，则 <M t="P" /> 对所有序数成立。证明：若有反例，取最小的反例 <M t="\alpha" />（良序！），那么比它小的都满足 <M t="P" />，于是 <M t="P(\alpha)" /> 成立，矛盾。这就是多米诺骨牌在超穷世界里的版本：极限位置的骨牌，被它前面所有骨牌一起推倒。</>}
            en={<><b>Transfinite induction (proved).</b> If, for every <M t="\alpha" />, “<M t="P" /> holds for all <M t="\beta<\alpha" />” implies “<M t="P(\alpha)" />,” then <M t="P" /> holds for all ordinals. Proof: take a least counterexample <M t="\alpha" /> (well-order!); everything below it satisfies <M t="P" />, so <M t="P(\alpha)" /> holds after all. It is the domino principle gone transfinite: a domino at a limit position is knocked over by all the dominoes before it together.</>}
          />
          <P
            zh={<><b>逆命题。</b> 一个全序如果没有无穷下降列，它就是良序：若某个非空子集 <M t="S" /> 没有最小元，就可以从 <M t="S" /> 里一步步挑出越来越小的元素，得到无穷下降列。“一步步挑”在严格的集合论里要用到一个很弱的选择公理（依赖选择公理），通常默认可用。</>}
            en={<><b>The converse.</b> A total order with no infinite descending sequence is a well-order: if a nonempty subset <M t="S" /> had no least element, you could keep picking smaller and smaller elements of <M t="S" />, building an infinite descent. Making “keep picking” rigorous uses a weak form of the axiom of choice (dependent choice), normally taken for granted.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="cnf" kicker={{ en: 'Addresses', zh: '门牌号' }} title={{ en: 'Cantor normal form', zh: 'Cantor 标准型' }}>
        <Thm name={{ en: 'Cantor normal form (Cantor, 1897)', zh: 'Cantor 标准型（Cantor，1897）' }}>
          <B
            zh={<p>每个序数 <M t="\alpha>0" /> 都可以<b>唯一地</b>写成</p>}
            en={<p>Every ordinal <M t="\alpha>0" /> can be written <b>uniquely</b> as</p>}
          />
          <MB t="\alpha=\omega^{\beta_1}\cdot c_1+\omega^{\beta_2}\cdot c_2+\cdots+\omega^{\beta_k}\cdot c_k,\qquad \beta_1>\beta_2>\cdots>\beta_k,\quad c_i\in\{1,2,3,\ldots\}." />
        </Thm>
        <Proof>
          <L
            zh={<>思路：像十进制一样贪心地取最高位；指数严格递减，由上一幕的定理有限步即停；首项被 <M t="\alpha" /> 唯一确定，唯一性由归纳得到。</>}
            en={<>Idea: take the top “digit” greedily, as with decimals; the exponents strictly decrease, so the previous scene’s theorem stops the process; the leading term is forced, so uniqueness follows by induction.</>}
          />
        </Proof>
        <Expand kind="proof" title={{ en: 'The greedy step in detail', zh: '贪心步骤的细节' }}>
          <L
            zh={<>贪心地取最高位：最大的 <M t="\beta_1" /> 使 <M t="\omega^{\beta_1}\le\alpha" />，最大的 <M t="c_1" /> 使 <M t="\omega^{\beta_1}c_1\le\alpha" />（有限，因为 <M t="\omega^{\beta_1+1}>\alpha" />），余下 <M t="\rho<\omega^{\beta_1}" />，对 <M t="\rho" /> 重复。指数严格递减，由上一幕的定理有限步即停。首项被 <M t="\alpha" /> 唯一确定，唯一性由归纳得到。</>}
            en={<>Take the top “digit” greedily: the largest <M t="\beta_1" /> with <M t="\omega^{\beta_1}\le\alpha" />, the largest <M t="c_1" /> with <M t="\omega^{\beta_1}c_1\le\alpha" /> (finite, as <M t="\omega^{\beta_1+1}>\alpha" />), leaving <M t="\rho<\omega^{\beta_1}" />; repeat on <M t="\rho" />. Exponents strictly decrease, so the previous scene’s theorem stops the process. The leading term is forced by <M t="\alpha" />, so uniqueness follows by induction.</>}
          />
        </Expand>
        <Widget title={{ en: 'Normal-form calculator', zh: '标准型计算器' }} hint={{ en: 'Compare like decimals: top exponents first, then coefficients — base-ω place value. Each preset pits two look-alikes; predict first.', zh: '像十进制一样比大小：先比首项指数，再比系数——这就是“ω 进制”。每个预设都是一对“长得像”的式子，先猜再点。' }}>
          <CNFCalc />
        </Widget>
        <P
          zh={<>几个值得停下来想想的结果：<M t="2^{\omega+1}=2^{\omega}\cdot2=\omega\cdot2" />；<M t="2^{\omega^2}=(2^{\omega})^{\omega}=\omega^{\omega}" />；<M t="\omega\cdot(\omega+1)=\omega^2+\omega" />，而 <M t="(\omega+1)\cdot\omega=\omega^2" />。</>}
          en={<>A few results worth a pause: <M t="2^{\omega+1}=2^{\omega}\cdot2=\omega\cdot2" />; <M t="2^{\omega^2}=(2^{\omega})^{\omega}=\omega^{\omega}" />; <M t="\omega\cdot(\omega+1)=\omega^2+\omega" />, whereas <M t="(\omega+1)\cdot\omega=\omega^2" />.</>}
        />
        <H3 en="Where the addresses run out" zh="门牌号用完的地方" />
        <P
          zh={<>当 <M t="\alpha<\varepsilon_0" /> 时，标准型里的指数都比 <M t="\alpha" /> 本身小，可以再写成标准型，层层展开，最后只剩 <M t="\omega" />、自然数、加、乘、乘方。这叫<Term en="hereditary normal form" zh="遗传标准型" />，它是一个有限长的式子。</>}
          en={<>When <M t="\alpha<\varepsilon_0" />, every exponent in its normal form is smaller than <M t="\alpha" /> itself, so we can expand the exponents too, all the way down to <M t="\omega" />, naturals, +, · and powers. This is the <Term en="hereditary normal form" zh="遗传标准型" />: a finite expression.</>}
        />
        <P
          zh={<>可到了 <M t="\varepsilon_0" />，标准型是 <M t="\varepsilon_0=\omega^{\varepsilon_0}" />：指数就是它自己，展开永远在原地打转。<M t="\varepsilon_0" /> 是 Cantor 记号<b>写不到的第一个序数</b>。第 4 章的基本列规则正是因此只覆盖 <M t="\varepsilon_0" /> 以下，第 7 章才会发明新记号越过它。</>}
          en={<>At <M t="\varepsilon_0" />, though, the normal form reads <M t="\varepsilon_0=\omega^{\varepsilon_0}" />: the exponent is the ordinal itself, and expanding goes in circles. <M t="\varepsilon_0" /> is the <b>first ordinal Cantor’s notation cannot reach</b>. That is why Chapter 4’s fundamental-sequence rules stop at <M t="\varepsilon_0" />, and Chapter 7 must invent new notation to pass it.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="hotel" kicker={{ en: 'Interlude: counting vs ranking', zh: '幕间：数数与排名' }} title={{ en: 'Hilbert’s hotel', zh: '希尔伯特旅馆' }}>
        <P
          zh={<>序数关心<b>顺序</b>。如果只关心“有多少”，规矩就松得多：两个集合一样大，当且仅当它们之间有一一对应——怎么配对都行，不必保持顺序。这样的“大小”叫<Term en="cardinality" zh="基数" />。</>}
          en={<>Ordinals care about <b>order</b>. If we only ask “how many,” the rules relax: two sets have the same size iff there is a one-to-one correspondence between them — any pairing at all, order be damned. This notion of size is <Term en="cardinality" zh="基数" />.</>}
        />
        <P
          zh={<>David Hilbert 在 1924 年的讲座里讲过一个故事，后来因 George Gamow 1947 年的科普书《从一到无穷大》而广为人知：一家旅馆有房间 0、1、2、……，每间都住满了。又来了客人，还住得下吗？</>}
          en={<>David Hilbert told a story in a 1924 lecture, later made famous by George Gamow’s 1947 book <i>One Two Three… Infinity</i>: a hotel has rooms 0, 1, 2, …, every one occupied. More guests arrive. Is there room?</>}
        />
        <H3 en="Room for everyone" zh="人人有房" />
        <Widget title={{ en: 'Hilbert’s hotel', zh: '希尔伯特旅馆' }} hint={{ en: 'Pick an arrival, then announce the room change.', zh: '选一种来客情形，然后广播换房。' }}>
          <HilbertHotel />
        </Widget>
        <Thm kind="definition" name={{ en: 'countable', zh: '可数' }}>
          <B
            zh={<p>一个集合叫<Term en="countable" zh="可数的" />，如果它是有限的，或者能和 <M t="\N" /> 一一对应。<M t="\N" /> 的基数记作 <M t="\aleph_0" />（读作“阿列夫零”）。一个序数叫可数的，如果它型的队伍是可数集。</p>}
            en={<p>A set is <Term en="countable" zh="可数的" /> if it is finite or in one-to-one correspondence with <M t="\N" />. The cardinality of <M t="\N" /> is written <M t="\aleph_0" /> (“aleph-null”). An ordinal is countable if lines of that type are countable sets.</p>}
          />
        </Thm>
        <P
          zh={<>旅馆说明 <M t="\omega+1" />、<M t="\omega\cdot2" />、<M t="\omega^2" /> 都是可数的：作为序数它们各不相同，作为“个数”全都是 <M t="\aleph_0" />。</>}
          en={<>The hotel shows that <M t="\omega+1" />, <M t="\omega\cdot2" /> and <M t="\omega^2" /> are all countable: as ordinals they differ, as sizes they are all <M t="\aleph_0" />.</>}
        />
        <Quiz
          q={{
            zh: <p>比 <M t="\varepsilon_0" /> 小的序数包括 <M t="\omega" />、<M t="\omega^{\omega}" />、<M t="\omega^{\omega^{\omega}}" />……它们一层比一层“无穷”。这些序数组成的集合，和 <M t="\N" /> 比谁更多？</p>,
            en: <p>The ordinals below <M t="\varepsilon_0" /> include <M t="\omega" />, <M t="\omega^{\omega}" />, <M t="\omega^{\omega^{\omega}}" />, … each “more infinite” than the last. Is the set of all of them bigger than <M t="\N" />?</p>,
          }}
          options={[
            { zh: <p>更多：它包含无穷多层无穷</p>, en: <p>Bigger: it contains infinitely many layers of infinity</p> },
            { zh: <p>一样多</p>, en: <p>Same size</p> },
            { zh: <p>无法比较</p>, en: <p>They cannot be compared</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>一样多。每个 <M t="\alpha<\varepsilon_0" /> 都有一个有限长的遗传标准型，而有限长的式子只有可数多个。下面的定理把这件事写严格。</p>,
            en: <p>Same size. Each <M t="\alpha<\varepsilon_0" /> has a finite hereditary normal form, and there are only countably many finite expressions. The theorem below makes this precise.</p>,
          }}
        />
        <Thm name={{ en: '(ε₀ is countable)', zh: '（ε₀ 是可数的）' }}>
          <B zh={<p>比 <M t="\varepsilon_0" /> 小的序数只有可数多个；也就是说，<M t="\varepsilon_0" /> 是可数序数。</p>} en={<p>There are only countably many ordinals below <M t="\varepsilon_0" />; that is, <M t="\varepsilon_0" /> is a countable ordinal.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>每个 <M t="\alpha<\varepsilon_0" /> 的遗传标准型是有限字母表 <M t="\{\omega,+,\cdot,\hat{\ },(,),0,\ldots,9\}" /> 上的一个有限字符串，并且不同的序数对应不同的字符串（标准型唯一）。把所有字符串按“短词优先”排好——就是“没有第一页的词典”那一幕里的排法——每个字符串都得到一个自然数编号。于是 <M t="\{\alpha:\alpha<\varepsilon_0\}" /> 可以一一对应到 <M t="\N" /> 的一个无穷子集，因而可数。</>}
            en={<>The hereditary normal form of each <M t="\alpha<\varepsilon_0" /> is a finite string over the finite alphabet <M t="\{\omega,+,\cdot,\hat{\ },(,),0,\ldots,9\}" />, and different ordinals give different strings (uniqueness of normal form). List all strings in shortlex order — the length-first ordering from the scene “a dictionary with no first page” — and each string gets a natural-number index. So <M t="\{\alpha:\alpha<\varepsilon_0\}" /> corresponds one-to-one with an infinite subset of <M t="\N" />, hence is countable.</>}
          />
        </Proof>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="diagonal" kicker={{ en: 'The big move, again', zh: '又是对角化' }} title={{ en: 'Too many to count', zh: '多到数不过来' }}>
        <P
          zh={<>也许所有无穷集合都是可数的？1891 年，Cantor 用一个极短的论证说：不是。</>}
          en={<>Maybe every infinite set is countable? In 1891 Cantor showed, with an argument a few lines long, that the answer is no.</>}
        />
        <Thm name={{ en: 'Cantor’s diagonal argument (1891)', zh: 'Cantor 对角线论证（1891）' }}>
          <B zh={<p>所有无穷 0/1 序列组成的集合是<b>不可数</b>的。</p>} en={<p>The set of all infinite 0/1 sequences is <b>uncountable</b>.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>假设能把它们全部列成一张清单 <M t="s_0,s_1,s_2,\ldots" />。构造序列 <M t="d" />：它的第 <M t="k" /> 位取 <M t="1-s_k(k)" />，即把第 <M t="k" /> 行第 <M t="k" /> 位翻转。对每个 <M t="k" />，<M t="d" /> 和 <M t="s_k" /> 在第 <M t="k" /> 位不同，所以 <M t="d" /> 不在清单上。可 <M t="d" /> 明明是一个无穷 0/1 序列。矛盾。</>}
            en={<>Suppose they could all be listed: <M t="s_0,s_1,s_2,\ldots" />. Build <M t="d" /> whose <M t="k" />-th digit is <M t="1-s_k(k)" /> — flip the <M t="k" />-th digit of row <M t="k" />. For every <M t="k" />, <M t="d" /> differs from <M t="s_k" /> at digit <M t="k" />, so <M t="d" /> is not on the list. Yet <M t="d" /> is an infinite 0/1 sequence. Contradiction.</>}
          />
        </Proof>
        <Widget title={{ en: 'Defeat any list', zh: '打败任何一张清单' }} hint={{ en: 'Edit the list, build d, then try to patch the list by adding d. Repeat.', zh: '改写清单，构造 d，再把 d 加进清单试图补救。重复几次。' }}>
          <CantorDiagonal />
        </Widget>
        <P
          zh={<>补救是徒劳的：把 <M t="d" /> 加进去，对角线又造出一个新的 <M t="d" />。这和第 2 章的对角函数 <M t="d(n)=n\uparrow^{n}n" /> 是同一招——<b>和第 <M t="k" /> 个对手在第 <M t="k" /> 处作对</b>。它会在第 11 章（停机问题）和第 13 章再次登场。</>}
          en={<>Patching is futile: add <M t="d" /> and the diagonal produces a fresh one. It is the same trick as Chapter 2’s diagonal function <M t="d(n)=n\uparrow^{n}n" />: <b>disagree with the <M t="k" />-th opponent at place <M t="k" /></b>. It returns in Chapter 11 (the halting problem) and Chapter 13.</>}
        />
        <P
          zh={<>推论：实数也不可数。把序列 <M t="s" /> 映到只含数字 0、1 的小数 <M t="0.s_0s_1s_2\ldots" />（十进制），不同的序列给出不同的实数，所以实数至少和 0/1 序列一样多。</>}
          en={<>Corollary: the real numbers are uncountable. Send a sequence <M t="s" /> to the decimal <M t="0.s_0s_1s_2\ldots" /> using only the digits 0 and 1; different sequences give different reals, so there are at least as many reals as 0/1 sequences.</>}
        />
        <Caution>
          <L
            zh={<>同一个符号，两种算术。作为<b>序数</b>，<M t="2^{\omega}=\sup_n 2^n=\omega" />，可数。作为<b>基数</b>，<M t="2^{\aleph_0}" /> 指 0/1 序列的个数，严格大于 <M t="\aleph_0" />。前者是排队，后者是数数。</>}
            en={<>Same symbols, two arithmetics. As an <b>ordinal</b>, <M t="2^{\omega}=\sup_n 2^n=\omega" />, countable. As a <b>cardinal</b>, <M t="2^{\aleph_0}" /> is the number of 0/1 sequences, strictly bigger than <M t="\aleph_0" />. The first is about queues, the second about headcounts.</>}
          />
        </Caution>
        <Expand kind="deeper" title={{ en: 'The paradise that Cantor created', zh: 'Cantor 创造的乐园' }}>
          <P
            zh={<>Cantor 1874 年就用另一种方法证明了实数不可数；1891 年的对角线论证更短、更通用。他的超穷理论在当时招来激烈反对，Kronecker 尤其不能接受。但到 1926 年，Hilbert 写道：“没有人能把我们从 Cantor 为我们创造的乐园中驱逐出去。”</>}
            en={<>Cantor had already proved the reals uncountable in 1874 by a different method; the 1891 diagonal argument is shorter and far more general. His transfinite theory met fierce opposition at the time, notably from Kronecker. By 1926 Hilbert could write: “No one shall expel us from the paradise that Cantor has created.”</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="omega1" kicker={{ en: 'The horizon', zh: '地平线' }} title={{ en: 'ω₁: beyond every ladder', zh: 'ω₁：梯子之外' }}>
        <P
          zh={<>我们爬过的每个序数——<M t="\omega" />、<M t="\omega^{\omega}" />、<M t="\varepsilon_0" />——都是可数的。到底有没有不可数的序数？</>}
          en={<>Every ordinal we have climbed past — <M t="\omega" />, <M t="\omega^{\omega}" />, <M t="\varepsilon_0" /> — is countable. Is there any uncountable ordinal at all?</>}
        />
        <Thm name={{ en: '(the first uncountable ordinal; Hartogs, 1915)', zh: '（第一个不可数序数；Hartogs，1915）' }}>
          <B
            zh={<p>存在一个最小的不可数序数，记作 <M t="\omega_1" />。比它小的序数恰好就是全体可数序数。</p>}
            en={<p>There is a least uncountable ordinal, written <M t="\omega_1" />. The ordinals below it are exactly the countable ordinals.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>可数序数都是 <M t="\N" /> 的子集上良序的序型，所以组成一个集合 <M t="W" />，它向下封闭且按大小良序（基本事实第 3 条）。设其序型为 <M t="\omega_1" />，由第 2 条 <M t="W=\{\beta:\beta<\omega_1\}" />。若 <M t="\omega_1" /> 可数，则 <M t="\omega_1\in W" />，即 <M t="\omega_1<\omega_1" />，荒谬。</>}
            en={<>Countable ordinals are order types of well-orders on subsets of <M t="\N" />, so they form a set <M t="W" />, closed downward and well-ordered by size (basic fact 3). Let <M t="\omega_1" /> be its type; by fact 2, <M t="W=\{\beta:\beta<\omega_1\}" />. If <M t="\omega_1" /> were countable, then <M t="\omega_1\in W" />, i.e. <M t="\omega_1<\omega_1" /> — absurd.</>}
          />
        </Proof>
        <Thm name={{ en: '(no countable ladder reaches ω₁)', zh: '（可数的梯子够不着 ω₁）' }}>
          <B
            zh={<p><M t="\omega_1" /> 是极限序数；并且任何可数序数的序列 <M t="\alpha_0<\alpha_1<\alpha_2<\cdots" />，其上确界仍然 <M t="<\omega_1" />。</p>}
            en={<p><M t="\omega_1" /> is a limit ordinal, and for any sequence of countable ordinals <M t="\alpha_0<\alpha_1<\alpha_2<\cdots" />, the supremum is still <M t="<\omega_1" />.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<>若 <M t="\omega_1=\beta+1" />，则 <M t="\beta" /> 可数，而在可数队伍末尾加一个人仍然可数（旅馆的第一招），矛盾。对第二句：比 <M t="\sup_n\alpha_n" /> 小的位置，就是所有“比某个 <M t="\alpha_n" /> 小的位置”合起来，是可数多个可数集的并，仍可数（旅馆的第三招：<M t="\omega" /> 辆大巴）。所以这个上确界是可数序数，<M t="<\omega_1" />。</>}
            en={<>If <M t="\omega_1=\beta+1" />, then <M t="\beta" /> is countable, and a countable line plus one more element is still countable (the hotel’s first trick) — contradiction. For the second claim: the positions below <M t="\sup_n\alpha_n" /> are the union, over <M t="n" />, of the positions below <M t="\alpha_n" />: countably many countable sets, which is countable (the hotel’s third trick, <M t="\omega" /> buses). So the supremum is a countable ordinal, hence <M t="<\omega_1" />.</>}
          />
        </Proof>
        <P
          zh={<>这意味着 <M t="\omega_1" /> <b>没有基本列</b>。无论你搭多高的梯子 <M t="\lambda[0]<\lambda[1]<\cdots" />，它的顶端都是一个可数序数，离 <M t="\omega_1" /> 还差得远。</>}
          en={<>So <M t="\omega_1" /> has <b>no fundamental sequence</b>. However tall a ladder <M t="\lambda[0]<\lambda[1]<\cdots" /> you build, its top is a countable ordinal, nowhere near <M t="\omega_1" />.</>}
        />
        <KeyIdea>
          <L
            zh={<>整门课程都在 <M t="\omega_1" /> 之下展开。<M t="\varepsilon_0" />、<M t="\Gamma_0" />、Bachmann–Howard 序数、Buchholz 序数，乃至第 8 章的 <M t="\omega_1^{\mathrm{CK}}" />（“第一个算法够不着的序数”）——全都可数。<M t="\omega_1" /> 是增长之尺尽头的地平线：看得见，走不到。第 13 章会解释为什么。</>}
            en={<>The whole course takes place below <M t="\omega_1" />. <M t="\varepsilon_0" />, <M t="\Gamma_0" />, the Bachmann–Howard ordinal, Buchholz’s ordinal, even Chapter 8’s <M t="\omega_1^{\mathrm{CK}}" /> (“the first ordinal no algorithm can reach”) — all countable. <M t="\omega_1" /> is the horizon at the end of the ruler of growth: visible, never reached. Chapter 13 explains why.</>}
          />
        </KeyIdea>
        <Expand kind="deeper" title={{ en: 'Fine print, and the continuum hypothesis', zh: '细则，以及连续统假设' }}>
          <P
            zh={<>“可数多个可数集的并仍可数”需要为每个集合挑一种编号方式，严格说要用到（可数）选择公理；没有任何选择公理时，甚至可能连 <M t="\omega_1" /> 都有可数的梯子。数学界通常默认选择公理。而 <M t="\omega_1" /> 的存在本身（Hartogs 1915）不需要选择公理。</>}
            en={<>“A countable union of countable sets is countable” requires choosing an enumeration of each set — the (countable) axiom of choice. Without any choice, even <M t="\omega_1" /> could have a countable ladder. Mathematicians normally assume choice. The existence of <M t="\omega_1" /> itself (Hartogs 1915) needs no choice.</>}
          />
          <P
            zh={<><M t="\omega_1" /> 的基数记作 <M t="\aleph_1" />，它是紧接 <M t="\aleph_0" /> 的下一个无穷大小。实数有 <M t="2^{\aleph_0}" /> 个，那么 <M t="2^{\aleph_0}=\aleph_1" /> 吗？这就是 Cantor 1878 年提出的<b>连续统假设</b>。Gödel（1940）和 Cohen（1963）合起来证明了：它在通常的集合论公理 ZFC 中<b>既不能证明，也不能否定</b>。第 10 章会再谈“不可证明”。</>}
            en={<>The cardinality of <M t="\omega_1" /> is <M t="\aleph_1" />, the next infinite size after <M t="\aleph_0" />. There are <M t="2^{\aleph_0}" /> reals; is <M t="2^{\aleph_0}=\aleph_1" />? That is Cantor’s <b>continuum hypothesis</b> (1878). Gödel (1940) and Cohen (1963) together showed it can be <b>neither proved nor refuted</b> from ZFC, the standard axioms of set theory. Chapter 10 returns to unprovability.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="next" kicker={{ en: 'Where we stand', zh: '复盘' }} title={{ en: 'From positions to speeds', zh: '从位置到速度' }}>
        <P
          zh={<>本章把第 2 章里那个神秘的刻度 <M t="\omega" /> 变成了一整套严格的对象：序数是良序队伍的形状；它们由 +1 和取上确界生成；它们的算术不交换；<M t="\varepsilon_0" /> 是第一个让 <M t="\omega^{\alpha}=\alpha" /> 的序数；而任何下降都必然有尽头。</>}
          en={<>This chapter turned Chapter 2’s mysterious mark <M t="\omega" /> into a rigorous world. Ordinals are shapes of well-ordered lines; they are generated by +1 and suprema; their arithmetic does not commute; <M t="\varepsilon_0" /> is the first ordinal with <M t="\omega^{\alpha}=\alpha" />; and every descent must end.</>}
        />
        <P
          zh={<>我们还看到了尺子的尽头：所有用梯子够得着的序数都可数，而 <M t="\omega_1" /> 永远在梯子之外。</>}
          en={<>We also glimpsed the end of the ruler: everything a ladder can reach is countable, and <M t="\omega_1" /> lies forever beyond every ladder.</>}
        />
        <KeyIdea>
          <L
            zh={<>下一章，我们给每个序数配一个函数：<M t="f_0(n)=n+1" />，后继就“重复 <M t="n" /> 次”，极限就“沿基本列对角化”。这就是<b>快速增长层次</b>。有了它，第 2 章的刻度终于有了精确的含义——我们还会用它严格证明：<M t="f_{\omega+1}(64)" /> 比 Graham 数还大。</>}
            en={<>Next chapter we attach a function to every ordinal: <M t="f_0(n)=n+1" />; at a successor, iterate <M t="n" /> times; at a limit, diagonalize along the fundamental sequence. That is the <b>fast-growing hierarchy</b>. It finally gives Chapter 2’s marks a precise meaning — and we will use it to prove rigorously that <M t="f_{\omega+1}(64)" /> exceeds Graham’s number.</>}
          />
        </KeyIdea>
      </Section>
    </>
  )
}
