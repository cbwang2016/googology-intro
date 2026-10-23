import './ch01.css'
import { B, L, P, Term } from '../../i18n'
import { M, MB } from '../../math'
import { Caution, Expand, H3, KeyIdea, Proof, Quiz, Section, Thm, Widget } from '../../ui/blocks'
import { Arena, Chessboard, HuayanLadder, NotationCost, PlaceValueChart, Race, TowerBuilder, TowerDuel, ZoomOut } from './widgets'

export default function Chapter01() {
  return (
    <>

      {/* ---------------------------------------------------------------- */}
      <Section id="duel" kicker={{ en: 'Prologue', zh: '序幕' }} title={{ en: 'The only rule: limited ink', zh: '唯一的规则：墨水有限' }}>
        <P
          zh={<>“比谁说的数大”是个注定分不出胜负的游戏：不管对方说什么，你都可以回一句“再加一”。这就是本课程的第一个定理，也是最古老的一个。</>}
          en={<>“Who can name the bigger number?” is a game nobody wins: whatever your opponent says, you reply “that plus one.” This is the first theorem of the course, and the oldest.</>}
        />
        <Thm name={{ en: '(there is no largest number)', zh: '（没有最大的数）' }}>
          <B zh={<p>不存在最大的自然数。</p>} en={<p>There is no largest natural number.</p>} />
        </Thm>
        <Proof>
          <L
            zh={<>若 <M t="N" /> 最大，则自然数 <M t="N+1>N" />，矛盾。</>}
            en={<>If <M t="N" /> were largest, the natural number <M t="N+1>N" /> would contradict it.</>}
          />
        </Proof>
        <P
          zh={<>加一条规则，游戏立刻变得深刻：<b>限制墨水</b>。只许写十个符号，或者一页纸。比的不再是耐心，而是<b>记号</b>：同样多的墨水，谁的记号走得更远？</>}
          en={<>Add one rule and the game turns deep: <b>limit the ink</b> — ten symbols, say, or one page. Now the contest is not about patience but about <b>notation</b>: with the same ink, whose notation reaches further?</>}
        />
        <P
          zh={<>这就是<Term en="googology" zh="大数数学" />的核心问题，名字来自 <Term en="googol" zh="古戈尔" /> <M t="10^{100}" />。人类在这个擂台上已经比了几千年。我们一回合一回合地重放：每位擂主带来一个新招数，而每个新招数都让上一位擂主显得渺小。</>}
          en={<>That is the central question of <Term en="googology" zh="大数数学" />, named after the <Term en="googol" zh="古戈尔" />, <M t="10^{100}" />. Humanity has fought this duel for millennia. We replay it round by round: each champion brings one new trick, and each trick dwarfs the last champion.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round1" kicker={{ en: 'Round 1', zh: '第一回合' }} title={{ en: 'One, two, three, many', zh: '一、二、三、很多' }}>
        <P
          zh={<>老笑话：两个原始人比谁说的数大。第一个憋了半天说“三”，第二个想了很久，叹气道：“你赢了。”不是三最大，而是他的语言里没有更大的词。<b>一个数一个词，词用完了，数也就到头了。</b></>}
          en={<>An old joke: two cave-dwellers compete. The first finally says “three.” The second thinks for a long time and sighs, “You win.” Not because three is largest — his language has no bigger word. <b>One word per number: run out of words, run out of numbers.</b></>}
        />
        <P
          zh={<>划记好一点，但写 <M t="n" /> 要 <M t="n" /> 笔。罗马数字为 5、10、50、100、500、1000 造了专门的符号，可要写得更大，就得不断发明新符号或者重复 M——舒服地大约只能写到一万。</>}
          en={<>Tally marks do better, but writing <M t="n" /> costs <M t="n" /> strokes. Roman numerals add symbols for 5, 10, 50, 100, 500, 1000, yet to go higher you must invent new symbols or repeat M; they comfortably reach about ten thousand.</>}
        />
        <Widget title={{ en: 'How much ink does a number cost?', zh: '写一个数要花多少墨水？' }}>
          <NotationCost />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round2" kicker={{ en: 'Round 2', zh: '第二回合' }} title={{ en: 'The great invention: place value', zh: '伟大的发明：位值制' }}>
        <P
          zh={<>位值制是人类最伟大的发明之一：<b>同一个数字放在不同位置，表示不同的大小</b>，再用 0 占位。十个符号就能写出任何数，而写 <M t="n" /> 只需要大约“<M t="n" /> 的位数”那么多个符号。</>}
          en={<>Place value is one of humanity’s greatest inventions: <b>the same digit means different amounts in different positions</b>, with 0 as a placeholder. Ten symbols write every number, and <M t="n" /> costs only about as many symbols as it has digits.</>}
        />
        <P
          zh={<>有个小插曲：中文<b>四位一级</b>（万、亿，一万个万是一亿），英文<b>三位一组</b>（thousand、million，一千个千是一百万）。在“中/EN”模式下，下面的表同时显示两种分法。</>}
          en={<>A curiosity: Chinese groups digits by <b>four</b> (万 = 10⁴, 亿 = 10⁸), English by <b>three</b> (thousand, million). In “中/EN” mode the chart shows both groupings over the same digits.</>}
        />
        <Widget title={{ en: 'Place-value chart', zh: '数位顺序表' }} hint={{ en: 'Press ×10: every digit slides one place left.', zh: '按 ×10：每个数字都向左移一位。' }}>
          <PlaceValueChart />
        </Widget>
        <P
          zh={<>古人心中“大得没法数”的数有多大？《西游记》第七回，如来说玉帝“自幼修持，苦历过一千七百五十劫，每劫该十二万九千六百年”。乘出来 <M t="1750\times129600=226\,800\,000" /> 年，两亿多年——而地球已经 46 亿岁了。没有好记号，再宏大的想象也会被记号框住。</>}
          en={<>How big was “unimaginably big” for pre-modern minds? In chapter 7 of <i>Journey to the West</i>, the Buddha says the Jade Emperor “has cultivated himself through 1,750 kalpas, each of 129,600 years”: <M t="1750\times129600=226{,}800{,}000" /> years. Earth is 4.6 billion years old. Without good notation, even grand imagination stays inside the notation’s walls.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round3" kicker={{ en: 'Round 3', zh: '第三回合' }} title={{ en: 'Doubling and squaring', zh: '翻倍与平方' }}>
        <P
          zh={<>传说智者只求棋盘第一格放 1 粒米，此后每格翻倍。国王一口答应，然后傻了眼。</>}
          en={<>A sage asks for one grain of rice on the first square of a chessboard, doubling on each square. The king agrees — and regrets it.</>}
        />
        <Widget title={{ en: 'Rice on the chessboard', zh: '棋盘上的米粒' }}>
          <Chessboard />
        </Widget>
        <MB t="1+2+2^2+\cdots+2^{63}=2^{64}-1=18\,446\,744\,073\,709\,551\,615" />
        <P
          zh={<>按每粒 0.025 克、全球稻谷年产 7.8 亿吨算，约等于六百年的产量。新招数是<b>重复乘法</b>，即乘方 <M t="a^b" />。<M t="10^n" /> 是 1 后面跟 <M t="n" /> 个 0，所以科学计数法 <M t="1.8\times10^{19}" /> 的指数直接告诉你：这是个 20 位数。</>}
          en={<>At 0.025 g a grain and a world harvest of 780 million tonnes a year, that is about six centuries of rice. The new trick is <b>repeated multiplication</b>, the power <M t="a^b" />. Since <M t="10^n" /> is 1 followed by <M t="n" /> zeros, the exponent in <M t="1.8\times10^{19}" /> tells you at a glance: 20 digits.</>}
        />
        <Thm name={{ en: '(the exponent counts digits)', zh: '（指数就是位数）' }}>
          <B
            zh={<p>正整数 <M t="N" /> 的位数是 <M t="\lfloor\log_{10}N\rfloor+1" />。</p>}
            en={<p>A positive integer <M t="N" /> has <M t="\lfloor\log_{10}N\rfloor+1" /> digits.</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<><M t="N" /> 有 <M t="d" /> 位 <M t="\iff 10^{d-1}\le N<10^{d}\iff d-1\le\log_{10}N<d" />。</>}
            en={<><M t="N" /> has <M t="d" /> digits <M t="\iff 10^{d-1}\le N<10^{d}\iff d-1\le\log_{10}N<d" />.</>}
          />
        </Proof>
        <KeyIdea>
          <L
            zh={<>对数就是“数位数”。一个数大到写不下，就看它的位数；位数也写不下，就看位数的位数。这个习惯会陪我们走很远。</>}
            en={<>A logarithm counts digits. When a number is too big to write, look at its digit count; when that is too big, at the digits of the digits. This habit will carry us a long way.</>}
          />
        </KeyIdea>
        <H3 en="Squaring: the exponent doubles" zh="平方：指数翻倍" />
        <P
          zh={<>比翻倍更快的是<b>平方</b>：<M t="(10^{a})^2=10^{2a}" />，每平方一次，<b>指数</b>翻一倍。汉代《数术记遗》的“上数”正是如此：“数穷则变”，万万为亿，亿亿为兆，兆兆为京……十个单位从亿 <M t="=10^{8}" /> 一直到载 <M t="=10^{4096}" />。</>}
          en={<>Faster than doubling is <b>squaring</b>: <M t="(10^{a})^2=10^{2a}" />, so each squaring doubles the <b>exponent</b>. The “upper” system of the Han-dynasty <i>Shushu Jiyi</i> does exactly this — “when the numbers run out, change”: 万万 make 亿, 亿亿 make 兆, … ten units from <M t="10^{8}" /> up to <M t="10^{4096}" />.</>}
        />
        <P
          zh={<>佛经把这一招用到了极致。《华严经·阿僧祇品》中，心王菩萨问“不可说”有多大，佛陀一口气报出 123 个单位：“一百洛叉为一俱胝，俱胝俱胝为一阿庾多……”每个单位都是上一个的平方。</>}
          en={<>Buddhist scripture took this to the limit. In the <i>Avatamsaka Sutra</i> a bodhisattva asks how big “the unspeakable” is, and the Buddha recites 123 units: “a hundred lakṣas make a koṭi; a koṭi koṭis make an ayuta…” Each unit is the square of the previous one.</>}
        />
        <Widget title={{ en: 'The 123 units of the Avatamsaka Sutra', zh: '华严经的 123 个大数单位' }}>
          <HuayanLadder />
        </Widget>
        <P
          zh={<>俱胝是 <M t="10^7" />，平方 <M t="n-1" /> 次后，第 <M t="n" /> 个单位是 <M t="A_n=10^{7\cdot2^{n-1}}" />。最后一个“不可说不可说转”是</>}
          en={<>A koṭi is <M t="10^7" />; after <M t="n-1" /> squarings the <M t="n" />-th unit is <M t="A_n=10^{7\cdot2^{n-1}}" />. The last, “the unspeakable unspeakable turn” (不可说不可说转), is</>}
        />
        <MB t="A_{123}=10^{7\cdot2^{122}}=10^{37\,218\,383\,881\,977\,644\,441\,306\,597\,687\,849\,648\,128}." />
        <P
          zh={<>它的位数本身就是一个 38 位数。每个原子写一位数字，整个可观测宇宙（约 <M t="10^{80}" /> 个原子）也远远不够。</>}
          en={<>Its digit count is itself a 38-digit number. With one atom per digit, the observable universe (about <M t="10^{80}" /> atoms) falls hopelessly short.</>}
        />
        <Expand kind="deeper" title={{ en: 'Other versions of the list', zh: '经文的其他版本' }}>
          <P
            zh={<>不同译本和抄本的单位数目、起点略有不同，所以“不可说不可说转”也有 <M t="10^{7\cdot2^{142}}" />、<M t="10^{5\cdot2^{123}}" /> 等取值。这里采用最常见的 123 个单位、洛叉 <M t="=10^5" /> 的版本。招数都一样：反复平方。</>}
            en={<>Translations and manuscripts differ slightly in the number of units and the starting point, so the last unit is also given as <M t="10^{7\cdot2^{142}}" /> or <M t="10^{5\cdot2^{123}}" />. We use the common 123-unit version with a lakṣa <M t="=10^5" />. The trick is always the same: square again and again.</>}
          />
        </Expand>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round4" kicker={{ en: 'Round 4', zh: '第四回合' }} title={{ en: 'Archimedes counts the sand', zh: '阿基米德数沙子' }}>
        <P
          zh={<>公元前 3 世纪，希腊数词只到“万”（myriad），“沙粒之数”就是“数不清”。阿基米德在《数沙者》里反驳：<b>把整个宇宙填满沙子</b>，沙粒也不超过 <M t="10^{63}" /> 粒。</>}
          en={<>In the 3rd century BC Greek number words stopped at the myriad, and “as many as the sand” meant uncountable. In <i>The Sand Reckoner</i> Archimedes showed that the sand <b>filling the whole universe</b> is at most <M t="10^{63}" /> grains.</>}
        />
        <P
          zh={<>为此他造了一套记号：以万万 <M t="10^8" /> 为单位，数满万万个单位进一级；万万级之后到达 <M t="P=(10^8)^{10^8}" />，再以 <M t="P" /> 为新起点把整个过程重复万万次，最后到达</>}
          en={<>To do it he built a system: take a myriad myriads, <M t="10^8" />, as the unit of the next order; after a myriad myriad orders you reach <M t="P=(10^8)^{10^8}" />; then restart from <M t="P" /> and repeat the whole process a myriad myriad times, arriving at</>}
        />
        <MB t="P^{10^8}=10^{8\times10^{16}}." />
        <P
          zh={<><b>指数里还有指数</b>。可它只落在华严第 54 与第 55 个单位之间：反复平方走得更远。</>}
          en={<><b>An exponent inside an exponent.</b> Yet it falls between the 54th and 55th Avatamsaka units: repeated squaring went further.</>}
        />
        <Widget title={{ en: 'The arena so far', zh: '擂台战况' }}>
          <Arena upTo={7} />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round5" kicker={{ en: 'Round 5', zh: '第五回合' }} title={{ en: 'Towers of exponents', zh: '指数塔' }}>
        <P
          zh={<>阿基米德的数提示了下一招：指数可以是大数，指数的指数也可以——一层层摞上去，就是<b>指数塔</b>。</>}
          en={<>Archimedes’ number hints at the next trick: if an exponent can be big, so can the exponent’s exponent. Stack them and you get a <b>tower of exponents</b>.</>}
        />
        <MB t="10^{10^{10}}=10^{(10^{10})}=1\underbrace{000\cdots0}_{10^{10}\ \text{个/zeros}}" />
        <Thm kind="definition" name={{ en: 'evaluation order', zh: '计算顺序' }} status="convention">
          <B
            zh={<p>指数塔<b>从上往下</b>算：<M t="a^{b^{c}}=a^{(b^{c})}" />。另一种读法 <M t="(a^b)^c=a^{bc}" /> 只是把指数乘一下，没意思；比如 <M t="(3^3)^3=19\,683" />，而 <M t="3^{3^3}=3^{27}=7\,625\,597\,484\,987" />。</p>}
            en={<p>Towers are evaluated <b>from the top down</b>: <M t="a^{b^{c}}=a^{(b^{c})}" />. The other reading, <M t="(a^b)^c=a^{bc}" />, merely multiplies exponents; compare <M t="(3^3)^3=19{,}683" /> with <M t="3^{3^3}=3^{27}=7{,}625{,}597{,}484{,}987" />.</p>}
          />
        </Thm>
        <Widget title={{ en: 'Tower builder', zh: '搭一座指数塔' }} hint={{ en: 'Change any layer: the base barely matters, the height is everything.', zh: '改任意一层：底数几乎不重要，层数才重要。' }}>
          <TowerBuilder />
        </Widget>
        <Thm name={{ en: '(the base barely matters)', zh: '（底数几乎不重要）' }}>
          <B zh={<p>对实数 <M t="a,b>1" /> 和 <M t="c>0" />，</p>} en={<p>For reals <M t="a,b>1" /> and <M t="c>0" />,</p>} />
          <MB t="a^{b^{c}}=10^{\,10^{\,c\log_{10}b\;+\;\log_{10}\log_{10}a}}." />
          <B
            zh={<p>换掉底数 <M t="a" />，只是在<b>最顶层</b>加了一个小常数 <M t="\log_{10}\log_{10}a" />（<M t="a=2" /> 时约为 <M t="-0.52" />）。</p>}
            en={<p>Changing the base <M t="a" /> only adds a small constant <M t="\log_{10}\log_{10}a" /> at the <b>very top</b> (about <M t="-0.52" /> for <M t="a=2" />).</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={<><M t="a^{y}=10^{y\log_{10}a}" />，取 <M t="y=b^c=10^{c\log_{10}b}" />，再把因子 <M t="\log_{10}a" /> 写成 <M t="10^{\log_{10}\log_{10}a}" />。</>}
            en={<><M t="a^{y}=10^{y\log_{10}a}" /> with <M t="y=b^c=10^{c\log_{10}b}" />; then write the factor <M t="\log_{10}a" /> as <M t="10^{\log_{10}\log_{10}a}" />.</>}
          />
        </Proof>
        <Widget title={{ en: 'Tower duels', zh: '指数塔对决' }} hint={{ en: 'Taking “log of log” strips two layers and makes the comparison easy.', zh: '“取两次对数”剥掉两层，比较就容易了。' }}>
          <TowerDuel />
        </Widget>
        <H3 en="The ancient champion" zh="古代的冠军" />
        <P
          zh={<>古代真正的冠军是耆那教经典《Anuyogadvāra Sūtra》（约公元前后成书）里的 JPA（“最小的不可数之数”）。用巨大的容器装满芥子，往一圈圈同心圆环里一圈撒一粒；撒完就造一个以最后那圈为直径的更大容器，如此反复。每个新容器让芥子数<b>多一层指数</b>。</>}
          en={<>The true ancient champion is JPA, the “smallest innumerable,” from the Jain <i>Anuyogadvāra Sūtra</i> (around the turn of the era). Fill a giant container with mustard seeds and drop one per concentric ring; when empty, build a bigger container as wide as the last ring reached, and repeat. Each container adds <b>one more layer of exponent</b>.</>}
        />
        <P
          zh={<>按 Gupta 等人的估算（《大数理论》沿用），JPA 大约是一座<b>高约 <M t="1.3\times10^{136}" /> 层</b>的 10 的指数塔。华严大数只是两三层的塔，JPA 的<b>层数</b>就要用指数来写。</>}
          en={<>By R. C. Gupta’s estimate (used in 曹知秋’s <i>Googology</i>), JPA is a tower of tens about <b><M t="1.3\times10^{136}" /> levels high</b>. The Avatamsaka number is a tower of two or three levels; JPA’s <b>height</b> already needs an exponent.</>}
        />
        <P
          zh={<>耆那教数学家还没停手。他们把 <M t="n\mapsto n^n" /> 对 <M t="a" /> 反复做 <M t="a" /> 次得到 <M t="b" />，再对 <M t="b" /> 反复做 <M t="b" /> 次……得到“层数是一座塔、而那座塔的层数又是一座塔”的数，最大的 UAnAn 嵌套了三十多层。这种“塔的塔”超出了指数塔的写法——我们需要全新的记号。那是第 2 章的故事。</>}
          en={<>The Jain mathematicians kept going. Apply <M t="n\mapsto n^n" /> to <M t="a" />, <M t="a" /> times, to get <M t="b" />; then to <M t="b" />, <M t="b" /> times… The result is a tower whose height is a tower whose height is a tower; their largest, UAnAn, nests this over thirty times. Such towers of towers are beyond tower notation — we need a new notation. That is Chapter 2.</>}
        />
        <Widget title={{ en: 'The arena, all ancient champions', zh: '擂台：古代全部擂主' }}>
          <Arena upTo={8} note={false} />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="universe" kicker={{ en: 'Interlude', zh: '幕间' }} title={{ en: 'Does the universe have room?', zh: '宇宙装得下吗？' }}>
        <P
          zh={<>1920 年，九岁的 Milton Sirotta 给 <M t="10^{100}" /> 起名 <b>googol</b>，还提议 <b>googolplex</b> 是“写个 1，再一直写 0 写到累”。他的舅舅、数学家 Edward Kasner 把它定为 <M t="10^{10^{100}}" />——位数比可观测宇宙的原子（约 <M t="10^{80}" /> 个）还多。</>}
          en={<>In 1920 nine-year-old Milton Sirotta named <M t="10^{100}" /> a <b>googol</b> and proposed a <b>googolplex</b>: “one, followed by zeroes until you get tired.” His uncle, the mathematician Edward Kasner, fixed it as <M t="10^{10^{100}}" />: more digits than the observable universe has atoms (about <M t="10^{80}" />).</>}
        />
        <P
          zh={<>物理里最大的数之一：Don Page 估算的宇宙庞加莱回归时间，约 <M t="10^{10^{10^{10^{2.08}}}}" /> 年。</>}
          en={<>One of physics’ largest numbers: Don Page’s estimate of the universe’s Poincaré recurrence time, about <M t="10^{10^{10^{10^{2.08}}}}" /> years.</>}
        />
        <Widget title={{ en: 'Zoom out', zh: '缩小，再缩小' }} hint={{ en: 'Each zoom replaces every number by (roughly) its number of digits.', zh: '每缩小一次，每个数都被换成（大约）它的位数。' }}>
          <ZoomOut />
        </Widget>
        <P
          zh={<>缩小两三次后，物理世界的一切都挤在最左边：物理里出现的数，似乎都不超过五层指数塔。数学却不受宇宙尺寸的限制，数论里的 Skewes 数、存在性证明给出的上界，早已越过这条边界。而我们才刚刚开始。</>}
          en={<>After two or three zooms everything physical is crammed at the left edge: numbers from physics seem to stay below a five-level tower. Mathematics has no such limit — Skewes’ number and many bounds from existence proofs sail past it. And we have barely started.</>}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="far-ahead" kicker={{ en: 'Reflection', zh: '复盘' }} title={{ en: 'How far is “far ahead”?', zh: '什么叫遥遥领先' }}>
        <P
          zh={<>没有一位擂主是靠“加一”或“乘二”获胜的，每一位都带来了<b>新招数</b>。要比较招数，就把每种记号看成一个<b>数列</b>：第 <M t="n" /> 项是花“<M t="n" /> 份力气”能写出的典型的数。</>}
          en={<>No champion won by adding one or doubling; each brought a <b>new trick</b>. To compare tricks, view each notation as a <b>sequence</b>: its <M t="n" />-th term is a typical number written with “<M t="n" /> units of effort.”</>}
        />
        <Widget title={{ en: 'Four notations as sequences', zh: '把四种记号看成数列' }}>
          <Race />
        </Widget>
        <P
          zh={<>在大数的世界里，“大很多”另有含义。把 <M t="10^{10^{10}}" /> 乘以 2，只是把顶上的 10 变成约 <M t="10.000\,000\,000\,013" />；就算平方，顶上也只变成约 <M t="10.301" />。我们要的是<b>新的一层</b>。下面的定理把这一点说准确。</>}
          en={<>Among big numbers, “much bigger” means something unusual. Doubling <M t="10^{10^{10}}" /> only turns the top 10 into about <M t="10.000\,000\,000\,013" />; even squaring only makes it about <M t="10.301" />. What we want is <b>a new layer</b>. The next theorem makes this precise.</>}
        />
        <Thm name={{ en: '(one more layer beats everything old)', zh: '（多一层胜过一切旧招数）' }}>
          <B
            zh={<p>令 <M t="T(0)=1" />，<M t="T(n+1)=10^{T(n)}" />（<M t="n" /> 层 10 的指数塔）。对任意常数 <M t="c\ge1" />，只要 <M t="n\ge1" /> 且 <M t="T(n-1)\ge\log_{10}c" />，就有</p>}
            en={<p>Let <M t="T(0)=1" /> and <M t="T(n+1)=10^{T(n)}" />, a tower of <M t="n" /> tens. For any constant <M t="c\ge1" />, whenever <M t="n\ge1" /> and <M t="T(n-1)\ge\log_{10}c" />,</p>}
          />
          <MB t="c\cdot T(n)\le T(n+1)\qquad\text{and}\qquad T(n)^2\le T(n+1)." />
        </Thm>
        <Proof>
          <L
            zh={<><M t="c\cdot T(n)=10^{\log_{10}c+T(n-1)}\le10^{2T(n-1)}=T(n)^2" />，又因 <M t="x\ge1" /> 时 <M t="2x\le10^{x}" />，有 <M t="10^{2T(n-1)}\le10^{10^{T(n-1)}}=T(n+1)" />。</>}
            en={<><M t="c\cdot T(n)=10^{\log_{10}c+T(n-1)}\le10^{2T(n-1)}=T(n)^2" />, and since <M t="2x\le10^{x}" /> for <M t="x\ge1" />, <M t="10^{2T(n-1)}\le10^{10^{T(n-1)}}=T(n+1)" />.</>}
          />
        </Proof>
        <Quiz
          q={{ zh: <p>哪个更大：<M t="2\times10^{10^{10}}" /> 还是 <M t="10^{10^{10.0001}}" />？</p>, en: <p>Which is bigger: <M t="2\times10^{10^{10}}" /> or <M t="10^{10^{10.0001}}" />?</p> }}
          options={[
            { zh: <p><M t="2\times10^{10^{10}}" /></p>, en: <p><M t="2\times10^{10^{10}}" /></p> },
            { zh: <p><M t="10^{10^{10.0001}}" /></p>, en: <p><M t="10^{10^{10.0001}}" /></p> },
            { zh: <p>一样大</p>, en: <p>They are equal</p> },
          ]}
          answer={1}
          explain={{
            zh: <p>取一次对数：左边约为 <M t="10^{10}+0.3" />，右边是 <M t="10^{10.0001}\approx10^{10}\times1.00023" />，多出约 230 万。乘以 2 在顶层几乎什么都不是。</p>,
            en: <p>Take one log: the left is about <M t="10^{10}+0.3" />, the right is <M t="10^{10.0001}\approx10^{10}\times1.00023" />, larger by about 2.3 million. Multiplying by 2 barely registers at the top.</p>,
          }}
        />
        <KeyIdea>
          <L
            zh={<>招数的阶梯：<b>数数</b>是重复“加一”，<b>乘方</b>是重复乘法，<b>指数塔</b>是重复乘方。每一级都是把上一级<b>重复</b>很多次。那么“重复堆塔”会得到什么？耆那教的数学家已经摸到了门口。下一章，我们把“重复”变成一台可以无限运转的机器。</>}
            en={<>The ladder of tricks: <b>counting</b> repeats “add one,” <b>powers</b> repeat multiplication, <b>towers</b> repeat powers. Each rung <b>repeats</b> the one below. What happens if we repeat “build a tower”? The Jain mathematicians reached the doorway. Next chapter we turn “repeat” into a machine that runs forever.</>}
          />
        </KeyIdea>
        <Caution>
          <L
            zh={<>古代文献的年代和数值采用通行说法与《大数理论》的估算；版本不同，数值会有出入，但每位擂主的“招数”是确定的。</>}
            en={<>Dates and values for ancient texts follow common accounts and the estimates in 曹知秋’s book. Manuscripts differ, so exact values vary, but each champion’s trick is not in doubt.</>}
          />
        </Caution>
      </Section>
    </>
  )
}
