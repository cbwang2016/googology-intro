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
          zh={<>小时候，大概每个人都玩过“比谁说的数大”：你说一万，我说一亿；你说一亿亿，我说“你的数再加一”。这个游戏永远分不出胜负，原因可以写成本课程的第一个定理——也是最古老的一个。</>}
          en={<>Almost everyone has played “who can say the bigger number” as a kid: you say a million, I say a billion; you say a billion billion, I say “yours plus one.” Nobody ever wins, and the reason is the first theorem of this course — and the oldest.</>}
        />
        <Thm name={{ en: '(there is no largest number)', zh: '（没有最大的数）' }}>
          <B zh={<p>不存在最大的自然数。</p>} en={<p>There is no largest natural number.</p>} />
        </Thm>
        <Proof>
          <L
            zh={
              <>
                假设 <M t="N" /> 是最大的自然数。可是 <M t="N+1" /> 也是自然数，而且 <M t="N+1>N" />，与“<M t="N" /> 最大”矛盾。所以最大的自然数不存在。
              </>
            }
            en={
              <>
                Suppose <M t="N" /> were the largest natural number. But <M t="N+1" /> is also a natural number, and <M t="N+1>N" />,
                contradicting the choice of <M t="N" />. So no largest natural number exists.
              </>
            }
          />
        </Proof>
        <P
          zh={
            <>
              所以“谁说的数大”这个游戏本身毫无意义。但只要加上一条规则，它就立刻变得深刻起来：<b>限制你能用的符号</b>。比如只许写十个字，或者一页纸，或者一张宇宙大小的纸。这时候，比的就不再是耐心，而是<b>记号</b>——用同样多的墨水，谁的记号能表达更大的数？
            </>
          }
          en={
            <>
              So “who can say the bigger number” is pointless as it stands. Add one rule and it instantly becomes deep:{' '}
              <b>limit the symbols you may use</b> — ten characters, one page, or a sheet of paper the size of the universe. Now the
              contest is not about patience but about <b>notation</b>: with the same amount of ink, whose notation reaches further?
            </>
          }
        />
        <P
          zh={
            <>
              这就是大数数学（<Term en="googology" zh="Googology" />）的核心问题。它的名字来自 <Term en="googol" zh="古戈尔" />，即 <M t="10^{100}" />。人类在这个擂台上已经比了几千年。我们就从最早的选手开始，一回合一回合地看下去。每一位擂主都带来了一个新“招数”，而每一个新招数都让上一位擂主显得渺小无比。
            </>
          }
          en={
            <>
              That is the central question of <Term en="googology" zh="大数数学" />, named after the <Term en="googol" zh="古戈尔" />,{' '}
              <M t="10^{100}" />. Humanity has been fighting this duel for thousands of years. Let’s replay it round by round. Each
              champion brings one new trick — and each new trick makes the previous champion look tiny.
            </>
          }
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round1" kicker={{ en: 'Round 1', zh: '第一回合' }} title={{ en: 'One, two, three, many', zh: '一、二、三、很多' }}>
        <P
          zh={
            <>
              有个笑话说，两个原始人比赛谁说的数大。第一个人苦思冥想，终于说出“三”。第二个人想了很久，叹了口气：“你赢了。”他并不是认为三最大，而是他的语言里根本<b>没有</b>比三更大的词。每个数一个词，词用完了，数也就到头了。
            </>
          }
          en={
            <>
              There’s an old joke about two cave-dwellers competing to name the bigger number. The first thinks hard and says “three.” The
              second thinks for a long time and sighs: “You win.” He doesn’t believe three is the largest number; his language simply has{' '}
              <b>no word</b> for anything bigger. One word per number — and when you run out of words, you run out of numbers.
            </>
          }
        />
        <P
          zh={
            <>
              结绳和划记好一点：数多少就打多少个结、划多少道。但代价是，写 <M t="n" /> 需要 <M t="n" /> 个符号。罗马人的改进是给 5、10、50、100、500、1000 造专门的符号（V、X、L、C、D、M）。拖动下面的滑块，看看三种写法各要用多少个符号。
            </>
          }
          en={
            <>
              Tally marks do better: one stroke per thing. The price is that writing <M t="n" /> costs <M t="n" /> symbols. The Romans
              improved on this with special symbols for 5, 10, 50, 100, 500 and 1000 (V, X, L, C, D, M). Drag the slider and compare how
              many symbols each system needs.
            </>
          }
        />
        <Widget title={{ en: 'How much ink does a number cost?', zh: '写一个数要花多少墨水？' }}>
          <NotationCost />
        </Widget>
        <P
          zh={
            <>
              罗马数字比划记强得多，但它也有天花板：要写更大的数，就得不断发明新符号，或者把 M 重复很多遍。粗略地说，它舒服地能写到一万左右。
            </>
          }
          en={
            <>
              Roman numerals beat tallies by far, but they hit a ceiling too: to go higher you must keep inventing symbols or repeat M
              over and over. Roughly, they comfortably reach about ten thousand.
            </>
          }
        />
        <Widget title={{ en: 'The arena so far', zh: '擂台战况' }}>
          <Arena upTo={2} />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round2" kicker={{ en: 'Round 2', zh: '第二回合' }} title={{ en: 'The great invention: place value', zh: '伟大的发明：位值制' }}>
        <P
          zh={
            <>
              四年级数学课本里有一张不起眼的表，叫<b>数位顺序表</b>。它记录的其实是人类最伟大的发明之一：<b>同一个数字，放在不同的位置上，表示不同的大小</b>。“2”在个位是二，在千位是两千。再加上用 0 来占位，十个符号就能写出任何数。
            </>
          }
          en={
            <>
              Every school textbook has a modest little chart of <b>place values</b>. It records one of humanity’s greatest inventions:{' '}
              <b>the same digit means different amounts in different positions</b>. A “2” in the ones place is two; in the thousands
              place it is two thousand. Add 0 as a placeholder, and ten symbols can write any number at all.
            </>
          }
        />
        <Thm kind="definition" name={{ en: 'base ten', zh: '十进制计数法' }}>
          <B
            zh={<p>个、十、百、千、万……都是<b>计数单位</b>。每相邻两个计数单位之间的进率都是十，这种计数方法叫做十进制计数法。</p>}
            en={<p>Ones, tens, hundreds, thousands… are the <b>units</b> of counting. Each unit is exactly ten of the unit before it. This way of writing numbers is called base ten (decimal) notation.</p>}
          />
        </Thm>
        <P
          zh={
            <>
              有趣的是，中文和英文给这些单位<b>分组</b>的方式不一样。中文<b>四位一级</b>：个级、万级、亿级——一万个一万是一亿。英文<b>三位一组</b>：thousand、million、billion——一千个一千是一百万。在下面的表里输入任意整数，切换到“中/EN”模式，可以同时看到两种分法。
            </>
          }
          en={
            <>
              Curiously, Chinese and English <b>group</b> these units differently. Chinese groups by <b>four</b>: 个, 万 (10⁴), 亿 (10⁸)
              — ten thousand ten-thousands make one 亿. English groups by <b>three</b>: thousand, million, billion — a thousand thousands
              make a million. Type any whole number below; switch to “中/EN” mode to see both groupings over the same digits.
            </>
          }
        />
        <Widget
          title={{ en: 'Place-value chart', zh: '数位顺序表' }}
          hint={{ en: 'Try ×10 a few times: every digit slides one place left.', zh: '多按几次 ×10：每个数字都向左移一位。' }}
        >
          <PlaceValueChart />
        </Widget>
        <Expand kind="detail" title={{ en: 'How zeros are read in Chinese', zh: '中文读数时“零”怎么读' }}>
          <B
            zh={
              <>
                <p>
                  按课本的规则：从高位读起，先读亿级，再读万级，最后读个级；亿级、万级的数按个级的读法读，再在后面加“亿”或“万”。<b>每级末尾的 0 都不读；其他数位上连续几个 0 都只读一个“零”。</b>
                </p>
                <p>
                  例如 <span className="mono">3 0004 0005</span> 读作“三亿零四万零五”；<span className="mono">1 0010 0000</span> 读作“一亿零一十万”；
                  而 <span className="mono">10 0000</span> 读作“十万”——开头的“一十”习惯上只读“十”。上面的表就是按这些规则自动读数的。
                </p>
              </>
            }
            en={
              <>
                <p>
                  The textbook rule: read from the highest group down (亿 group, then 万 group, then the ones group), reading each group like
                  a four-digit number and appending 亿 or 万. <b>Zeros at the end of a group are silent; any run of zeros elsewhere is read as
                  a single 零.</b>
                </p>
                <p>
                  So <span className="mono">3 0004 0005</span> is 三亿零四万零五, <span className="mono">1 0010 0000</span> is 一亿零一十万, and{' '}
                  <span className="mono">10 0000</span> is just 十万 (a leading 一十 is shortened to 十). The chart above reads numbers
                  aloud using exactly these rules — the English reading uses the American short scale.
                </p>
              </>
            }
          />
        </Expand>
        <P
          zh={
            <>
              位值制让“写数的代价”发生了质变：写 <M t="n" /> 不再需要 <M t="n" /> 个符号，只需要大约“<M t="n" /> 的位数”那么多个。十个数字就能写到将近一百亿。在不涉及现代科学的情况下，这对古人来说已经完全够用了。
            </>
          }
          en={
            <>
              Place value changed the price of writing a number qualitatively: <M t="n" /> no longer costs <M t="n" /> symbols, only
              about “the number of digits of <M t="n" />.” Ten digits reach nearly ten billion. Short of modern science, that is more than
              any ancient society ever needed.
            </>
          }
        />
        <P
          zh={
            <>
              那么，古人心中“大得无法计数”的数有多大？《西游记》第七回里，如来斥责孙悟空：玉帝“自幼修持，苦历过一千七百五十劫，每劫该十二万九千六百年”。算一算：<M t="1750\times129600=226\,800\,000" />，两亿多年。听起来很久——可地球已经 46 亿岁了。吴承恩是文学家，我们不必苛责他；只是在一个没有好记号的时代，再宏大的想象也会被记号框住。
            </>
          }
          en={
            <>
              So how big was “unimaginably big” for pre-modern minds? In chapter 7 of <i>Journey to the West</i>, the Buddha scolds the
              Monkey King: the Jade Emperor “has cultivated himself through 1,750 kalpas, each kalpa 129,600 years.” Multiply:{' '}
              <M t="1750\times129600=226{,}800{,}000" /> — about 227 million years. Impressive, until you recall that Earth is 4.6 billion
              years old. The novelist is not to blame: without good notation, even the grandest imagination stays inside the notation’s
              walls.
            </>
          }
        />
        <Widget title={{ en: 'The arena so far', zh: '擂台战况' }}>
          <Arena upTo={3} />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round3" kicker={{ en: 'Round 3', zh: '第三回合' }} title={{ en: 'Doubling and squaring', zh: '翻倍与平方' }}>
        <P
          zh={
            <>
              古印度有个传说：智者向国王讨赏，只要在国际象棋盘的第一格放 1 粒米，第二格放 2 粒，第三格放 4 粒，每一格都是前一格的两倍，放满 64 格就行。国王一口答应——然后傻了眼。自己试试：
            </>
          }
          en={
            <>
              An old Indian legend: a sage asks the king for a modest reward — one grain of rice on the first square of a chessboard, two
              on the second, four on the third, each square double the last, all 64 squares. The king agrees at once — and soon regrets
              it. Try it:
            </>
          }
        />
        <Widget title={{ en: 'Rice on the chessboard', zh: '棋盘上的米粒' }} hint={{ en: 'Assumes 0.025 g per grain and today’s world paddy-rice harvest (≈780 million tonnes a year).', zh: '假设每粒米约 0.025 克，全世界稻谷年产量约 7.8 亿吨。' }}>
          <Chessboard />
        </Widget>
        <MB t="1+2+2^2+\cdots+2^{63}=2^{64}-1=18\,446\,744\,073\,709\,551\,615" />
        <P
          zh={
            <>
              大约是全世界六百年的稻谷产量。这里的新招数是<b>重复乘法</b>。我们把 <M t="a" /> 自乘 <M t="b" /> 次记作 <M t="a^b" />（读作 <M t="a" /> 的 <M t="b" /> 次方）。特别地，<M t="10^n" /> 就是 1 后面跟 <M t="n" /> 个 0。于是一个 20 位的数可以写成 <M t="1.8\times10^{19}" />：这叫<b>科学计数法</b>，指数 19 直接告诉你它有 20 位。
            </>
          }
          en={
            <>
              That is roughly six centuries of the entire world’s rice harvest. The new trick here is <b>repeated multiplication</b>. We
              write <M t="a" /> multiplied by itself <M t="b" /> times as <M t="a^b" /> (“<M t="a" /> to the power <M t="b" />”). In
              particular <M t="10^n" /> is a 1 followed by <M t="n" /> zeros, so a 20-digit number can be written{' '}
              <M t="1.8\times10^{19}" /> — <b>scientific notation</b>, where the exponent 19 tells you at a glance that it has 20 digits.
            </>
          }
        />
        <Thm name={{ en: '(the exponent counts digits)', zh: '（指数就是位数）' }}>
          <B
            zh={
              <p>
                正整数 <M t="N" /> 的位数等于 <M t="\lfloor\log_{10}N\rfloor+1" />。这里 <M t="\log_{10}N" /> 是满足 <M t="10^{x}=N" /> 的那个数 <M t="x" />，叫做以 10 为底的<b>对数</b>。
              </p>
            }
            en={
              <p>
                A positive integer <M t="N" /> has <M t="\lfloor\log_{10}N\rfloor+1" /> digits, where <M t="\log_{10}N" />, the base-10{' '}
                <b>logarithm</b>, is the number <M t="x" /> with <M t="10^{x}=N" />.
              </p>
            }
          />
        </Thm>
        <Expand title={{ en: 'Why the formula is right', zh: '为什么这个公式成立' }}>
          <Proof>
            <L
              zh={
                <>
                  <M t="N" /> 有 <M t="d" /> 位，当且仅当 <M t="10^{d-1}\le N<10^{d}" />（最小的 <M t="d" /> 位数是 1 后面 <M t="d-1" /> 个 0，最大的比 <M t="10^d" /> 小 1）。对各项取以 10 为底的对数（对数是递增的，不改变大小关系）：<M t="d-1\le\log_{10}N<d" />。所以 <M t="d-1" /> 正是 <M t="\log_{10}N" /> 的整数部分，即 <M t="d=\lfloor\log_{10}N\rfloor+1" />。
                </>
              }
              en={
                <>
                  <M t="N" /> has <M t="d" /> digits exactly when <M t="10^{d-1}\le N<10^{d}" /> (the smallest <M t="d" />-digit number
                  is 1 followed by <M t="d-1" /> zeros; the largest is one less than <M t="10^d" />). Taking base-10 logarithms, which
                  preserve order: <M t="d-1\le\log_{10}N<d" />. So <M t="d-1" /> is the integer part of <M t="\log_{10}N" />, i.e.{' '}
                  <M t="d=\lfloor\log_{10}N\rfloor+1" />.
                </>
              }
            />
          </Proof>
        </Expand>
        <KeyIdea>
          <L
            zh={<>对数就是“数位数”。从现在起，每当一个数大到写不下，我们就看它的位数；位数也写不下，就看位数的位数。这个习惯会一路陪我们走下去。</>}
            en={<>A logarithm is just “counting digits.” From now on, whenever a number is too big to write, we look at its number of digits; when even that is too big, at the digits of the digits. This habit will carry us a long way.</>}
          />
        </KeyIdea>
        <H3 en="Squaring: the exponent doubles" zh="平方：指数翻倍" />
        <P
          zh={
            <>
              翻倍已经很快了，但还有更快的招数：<b>平方</b>。因为 <M t="(10^{a})^2=10^{2a}" />，每平方一次，<b>指数</b>翻一倍。汉代的《数术记遗》记载了三种进位法，其中“上数”就是这么做的：“数穷则变”——万万为亿，亿亿为兆，兆兆为京……于是亿、兆、京、垓、秭、穰、沟、涧、正、载分别是 <M t="10^{8},10^{16},10^{32},\ldots" />，最后的“载”是 <M t="10^{4096}" />。
            </>
          }
          en={
            <>
              Doubling is fast, but there is a faster trick: <b>squaring</b>. Since <M t="(10^{a})^2=10^{2a}" />, each squaring doubles
              the <b>exponent</b>. A Han-dynasty text, the <i>Shushu Jiyi</i>, describes an “upper” system that does exactly this:
              “when the numbers run out, change” — ten-thousand ten-thousands make 亿, 亿 亿s make 兆, 兆 兆s make 京… Its ten units are{' '}
              <M t="10^{8},10^{16},10^{32},\ldots" />, the last being <M t="10^{4096}" />.
            </>
          }
        />
        <P
          zh={
            <>
              佛经把这一招用到了极致。《华严经·阿僧祇品》里，心王菩萨问佛陀“不可说”到底有多大，佛陀一口气报出 123 个单位：“一百洛叉为一俱胝，俱胝俱胝为一阿庾多，阿庾多阿庾多为一那由他……”每个单位都是上一个的平方。拖动滑块，从俱胝一路走到“不可说不可说转”。
            </>
          }
          en={
            <>
              Buddhist scripture pushed this trick to its limit. In the <i>Avatamsaka Sutra</i>, a bodhisattva asks the Buddha how big
              “the unspeakable” is, and the Buddha recites 123 units in one breath: “a hundred lakṣas make one koṭi; a koṭi koṭis make one
              ayuta; an ayuta ayutas make one nayuta…” Each unit is the square of the one before. Slide from the first unit all the way to
              the last, “the unspeakable unspeakable turn” (不可说不可说转).
            </>
          }
        />
        <Widget title={{ en: 'The 123 units of the Avatamsaka Sutra', zh: '华严经的 123 个大数单位' }}>
          <HuayanLadder />
        </Widget>
        <P
          zh={
            <>
              俱胝是 <M t="10^7" />；每平方一次指数翻倍，平方了 <M t="n-1" /> 次之后，第 <M t="n" /> 个单位就是
            </>
          }
          en={
            <>
              The first unit is <M t="10^7" />; each squaring doubles the exponent, so after <M t="n-1" /> squarings the{' '}
              <M t="n" />-th unit is
            </>
          }
        />
        <MB t="A_n=10^{7\cdot2^{\,n-1}},\qquad A_{123}=10^{7\cdot2^{122}}=10^{37\,218\,383\,881\,977\,644\,441\,306\,597\,687\,849\,648\,128}." />
        <P
          zh={<>它的位数本身就是一个 38 位数。如果把它写出来，每个数字只占一个原子，整个可观测宇宙的原子都不够用——远远不够。</>}
          en={<>Its number of digits is itself a 38-digit number. Written out with one atom per digit, it would need vastly more atoms than the observable universe contains.</>}
        />
        <Expand kind="deeper" title={{ en: 'Other versions of the list', zh: '经文的其他版本' }}>
          <P
            zh={<>不同译本和抄本的单位数目、起点略有不同，因此“不可说不可说转”也有 <M t="10^{7\cdot2^{142}}" />、<M t="10^{5\cdot2^{123}}" /> 等不同的取值。这里采用最常见的 123 个单位、以洛叉为 <M t="10^5" /> 的版本。无论哪个版本，招数都一样：反复平方。</>}
            en={<>Different translations and manuscripts vary slightly in the number of units and the starting point, so “the unspeakable unspeakable turn” is also given as <M t="10^{7\cdot2^{142}}" /> or <M t="10^{5\cdot2^{123}}" />. We use the common 123-unit version with a lakṣa equal to <M t="10^5" />. In every version the trick is the same: square again and again.</>}
          />
        </Expand>
        <Widget title={{ en: 'The arena so far', zh: '擂台战况' }}>
          <Arena upTo={5} />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round4" kicker={{ en: 'Round 4', zh: '第四回合' }} title={{ en: 'Archimedes counts the sand', zh: '阿基米德数沙子' }}>
        <P
          zh={
            <>
              公元前 3 世纪，希腊人的数词最多只到“万”（myriad）。“沙子的数目”被认为是无法计数的同义词。阿基米德写了一本小书《数沙者》，献给叙拉古国王，要证明这是错的：不仅地球上的沙子可以计数，<b>把整个宇宙填满沙子</b>，沙粒数也可以写出来。他的估计是不超过 <M t="10^{63}" /> 粒。
            </>
          }
          en={
            <>
              In the 3rd century BC, Greek number words stopped at the myriad, ten thousand. “As many as the grains of sand” was a synonym
              for uncountable. Archimedes wrote a short book, <i>The Sand Reckoner</i>, addressed to the king of Syracuse, to show this was
              wrong: not only the sand on Earth, but the sand needed to <b>fill the entire universe</b> could be counted. His estimate:
              at most <M t="10^{63}" /> grains.
            </>
          }
        />
        <P
          zh={
            <>
              为了说出这种数，他发明了一套记号：把“万万”（<M t="10^8" />）当作新的单位，数到万万个这种单位，就得到下一级单位，如此反复万万级，得到 <M t="P=(10^8)^{10^8}=10^{8\times10^8}" />；再把 <M t="P" /> 当作新起点重复整个过程万万次，最后到达
            </>
          }
          en={
            <>
              To name such numbers he invented a system: treat a myriad myriads (<M t="10^8" />) as a new unit; count a myriad myriad of
              those to reach the next order; repeat for a myriad myriad orders to reach <M t="P=(10^8)^{10^8}=10^{8\times10^8}" />; then
              treat <M t="P" /> as a fresh start and repeat the whole process a myriad myriad times, arriving at
            </>
          }
        />
        <MB t="P^{10^8}=10^{8\times10^{16}}." />
        <P
          zh={
            <>
              这是一个<b>指数里还有指数</b>的数：它的位数（大约 <M t="8\times10^{16}" />）本身就需要指数才能方便地写出来。不过，比一比就知道，它只排在华严大数的第 54 和第 55 个单位之间——阿基米德的记号比他需要的强得多，但佛经里的“反复平方”走得更远。
            </>
          }
          en={
            <>
              This is a number with <b>an exponent inside its exponent</b>: its digit count, about <M t="8\times10^{16}" />, itself needs
              an exponent to write comfortably. Yet compared with the sutra, it falls between the 54th and 55th units of the Avatamsaka
              list. Archimedes built far more than he needed, but repeated squaring went further.
            </>
          }
        />
        <Widget title={{ en: 'The arena so far', zh: '擂台战况' }}>
          <Arena upTo={7} />
        </Widget>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="round5" kicker={{ en: 'Round 5', zh: '第五回合' }} title={{ en: 'Towers of exponents', zh: '指数塔' }}>
        <P
          zh={
            <>
              阿基米德的数提示了下一招：既然指数可以是大数，那指数的指数也可以是大数——一层层摞上去，就成了<b>指数塔</b>：
            </>
          }
          en={<>Archimedes’ number hints at the next trick: if an exponent can be a big number, so can the exponent’s exponent. Stack them up and you get a <b>tower of exponents</b>:</>}
        />
        <MB t="10^{10^{10}}=10^{(10^{10})}=1\underbrace{000\cdots0}_{10^{10}\ \text{个/zeros}}" />
        <Thm kind="definition" name={{ en: 'evaluation order', zh: '计算顺序' }} status="convention">
          <B
            zh={<p>指数塔<b>从上往下</b>算：<M t="a^{b^{c}}" /> 的意思是 <M t="a^{(b^{c})}" />，而不是 <M t="(a^b)^c" />。</p>}
            en={<p>Towers are evaluated <b>from the top down</b>: <M t="a^{b^{c}}" /> means <M t="a^{(b^{c})}" />, not <M t="(a^b)^c" />.</p>}
          />
        </Thm>
        <P
          zh={
            <>
              这个约定是有道理的：<M t="(a^b)^c=a^{bc}" />，只不过把指数乘了一下，没多大意思；而 <M t="a^{(b^c)}" /> 才真正把增长“叠”了上去。比如 <M t="(3^3)^3=19\,683" />，而 <M t="3^{3^3}=3^{27}=7\,625\,597\,484\,987" />。动手搭一座塔：
            </>
          }
          en={
            <>
              The convention is sensible: <M t="(a^b)^c=a^{bc}" /> merely multiplies the exponent, which is dull, whereas{' '}
              <M t="a^{(b^c)}" /> genuinely stacks growth. For instance <M t="(3^3)^3=19{,}683" /> but{' '}
              <M t="3^{3^3}=3^{27}=7{,}625{,}597{,}484{,}987" />. Build a tower yourself:
            </>
          }
        />
        <Widget title={{ en: 'Tower builder', zh: '搭一座指数塔' }} hint={{ en: 'Change any layer. Watch how little the base matters and how much the height matters.', zh: '改任意一层试试。注意：底数几乎不重要，层数才重要。' }}>
          <TowerBuilder />
        </Widget>
        <P
          zh={
            <>
              你可能已经注意到一件怪事：对于三层以上的塔，<b>底下的数是 2 还是 10 几乎无关紧要</b>，要紧的是塔有多高。这不是错觉，而是一个可以证明的事实。
            </>
          }
          en={
            <>
              You may have noticed something strange: for towers of three or more levels, <b>whether the bottom is 2 or 10 hardly matters</b>
              ; what matters is the height. This is not an illusion but a provable fact.
            </>
          }
        />
        <Thm name={{ en: '(the base barely matters)', zh: '（底数几乎不重要）' }}>
          <B
            zh={<p>对正数 <M t="a,b>1" /> 和 <M t="c" />，有</p>}
            en={<p>For positive <M t="a,b>1" /> and <M t="c" />,</p>}
          />
          <MB t="a^{b^{c}}=10^{\,10^{\,c\log_{10}b\;+\;\log_{10}\log_{10}a}}." />
          <B
            zh={<p>所以把底数 <M t="a" /> 换掉，只是在<b>最顶层</b>的指数上加了一个小常数 <M t="\log_{10}\log_{10}a" />（<M t="a=2" /> 时约为 <M t="-0.52" />，<M t="a=10" /> 时为 0）。</p>}
            en={<p>So changing the base <M t="a" /> only adds a small constant, <M t="\log_{10}\log_{10}a" />, at the <b>very top</b> (about <M t="-0.52" /> for <M t="a=2" />, and 0 for <M t="a=10" />).</p>}
          />
        </Thm>
        <Proof>
          <L
            zh={
              <>
                任何正数 <M t="x" /> 都等于 <M t="10^{\log_{10}x}" />。于是 <M t="a^{y}=10^{y\log_{10}a}" />。取 <M t="y=b^c=10^{c\log_{10}b}" />，得
                <M t="a^{b^c}=10^{10^{c\log_{10}b}\cdot\log_{10}a}" />。再把乘以 <M t="\log_{10}a" /> 写成 <M t="10^{\log_{10}\log_{10}a}" />，指数相乘变成指数相加，即得所证。
              </>
            }
            en={
              <>
                Any positive <M t="x" /> equals <M t="10^{\log_{10}x}" />, so <M t="a^{y}=10^{y\log_{10}a}" />. Put{' '}
                <M t="y=b^c=10^{c\log_{10}b}" /> to get <M t="a^{b^c}=10^{10^{c\log_{10}b}\cdot\log_{10}a}" />. Writing the factor{' '}
                <M t="\log_{10}a" /> as <M t="10^{\log_{10}\log_{10}a}" /> turns the product of powers into a sum of exponents, which
                is the claim.
              </>
            }
          />
        </Proof>
        <Widget title={{ en: 'Tower duels', zh: '指数塔对决' }} hint={{ en: 'Taking “log of log” strips two layers and makes the comparison easy.', zh: '“取两次对数”剥掉两层，比较就容易了。' }}>
          <TowerDuel />
        </Widget>
        <H3 en="The ancient champion" zh="古代的冠军" />
        <P
          zh={
            <>
              古代真正的冠军来自耆那教的宇宙论经典（约公元前 4 世纪）。它定义了一个叫 JPA（“最小的几乎不可计数”）的数，过程极其精巧：想象大地由一圈圈同心圆环组成，每圈直径是上一圈的两倍；用巨大的圆柱容器装满芥子，再一粒一粒撒到圆环里，撒完就造一个直径等于“最后一粒落入的那个圆环”的更大容器……每造一个新容器，芥子数就<b>多一层指数</b>。而容器要造的个数本身又是一个天文数字。
            </>
          }
          en={
            <>
              The true ancient champion comes from Jain cosmology (around the 4th century BC). Its number JPA, the “smallest
              nearly-uncountable,” is defined by an ingenious process: picture the Earth as concentric rings, each twice the diameter of
              the last; fill a giant cylinder with mustard seeds and drop them one per ring; when it is empty, build a bigger cylinder as
              wide as the last ring reached, and repeat… Each new cylinder adds <b>one more layer of exponent</b>, and the number of
              cylinders is itself astronomical.
            </>
          }
        />
        <P
          zh={
            <>
              按《大数理论》的估算，JPA 大约是一座<b>高约 <M t="10^{136}" /> 层</b>的 10 的指数塔。注意这和之前的冠军完全不是一个级别：华严大数是两三层的塔，JPA 的<b>层数</b>就已经大到要用指数来写。
            </>
          }
          en={
            <>
              By the estimate in 曹知秋’s <i>Googology</i> lecture notes, JPA is roughly a tower of tens about <b>
                <M t="10^{136}" /> levels high
              </b>
              . That is a different league from every earlier champion: the Avatamsaka number is a tower of two or three levels, while
              JPA’s <b>height</b> is so large it must itself be written with an exponent.
            </>
          }
        />
        <Widget title={{ en: 'The arena, all ancient champions', zh: '擂台：古代全部擂主' }}>
          <Arena upTo={8} />
        </Widget>
        <P
          zh={
            <>
              耆那教的数学家还没停手。他们又定义了一种操作：把“<M t="n\mapsto n^n" />”对 <M t="a" /> 反复做 <M t="a" /> 次，得到 <M t="b" />；再对 <M t="b" /> 反复做 <M t="b" /> 次，得到 <M t="c" />……于是得到“层数是一座塔、而那座塔的层数又是一座塔”的数。最大的 UAnAn 相当于这样嵌套了三十多层。这种“塔的塔”已经超出了指数塔的写法——要写它，我们需要一个全新的记号。那是第 2 章的故事。
            </>
          }
          en={
            <>
              The Jain mathematicians did not stop there. They defined an operation: apply <M t="n\mapsto n^n" /> to <M t="a" />, <M t="a" /> times over, to get{' '}
              <M t="b" />; then apply it to <M t="b" />, <M t="b" /> times over, to get <M t="c" />… yielding numbers whose tower height is a tower whose
              height is a tower. Their largest, UAnAn, nests this more than thirty times. Such “towers of towers” are beyond what tower
              notation can write — we need a brand-new notation. That is the story of Chapter 2.
            </>
          }
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="universe" kicker={{ en: 'Interlude', zh: '幕间' }} title={{ en: 'Does the universe have room?', zh: '宇宙装得下吗？' }}>
        <P
          zh={
            <>
              现代人用指数塔写下了许多“现实中”的大数：可观测宇宙大约有 <M t="10^{80}" /> 个原子；1920 年，一个九岁的孩子 Milton Sirotta 给 <M t="10^{100}" /> 起名叫 <b>googol</b>（古戈尔），他的舅舅、数学家 Kasner 又定义了 <b>googolplex</b>（古戈尔普勒克斯）<M t="=10^{10^{100}}" />——它的位数比宇宙中的原子还多，所以根本没法完整写出来。物理学家估计，宇宙回到过去某个状态所需的“庞加莱回归时间”大约是 <M t="10^{10^{10^{10^{2.08}}}}" /> 年。
            </>
          }
          en={
            <>
              Modern science writes many “real-world” giants with towers: the observable universe holds about <M t="10^{80}" /> atoms. In
              1920 a nine-year-old, Milton Sirotta, named <M t="10^{100}" /> a <b>googol</b>; his uncle, the mathematician Edward Kasner,
              defined the <b>googolplex</b>, <M t="10^{10^{100}}" /> — it has more digits than the universe has atoms, so it can never be
              written out. Physicists estimate the universe’s Poincaré recurrence time, the time to return arbitrarily close to a past
              state, at around <M t="10^{10^{10^{10^{2.08}}}}" /> years.
            </>
          }
        />
        <P
          zh={
            <>
              这些数怎么画在同一条数轴上？办法就是我们刚学的习惯：把每个数换成它的位数（取对数），数轴就“缩小”一次。一次不够，就再缩一次。
            </>
          }
          en={
            <>
              How can such numbers share one number line? With the habit we just learned: replace every number by its number of digits
              (take a logarithm), zooming the line out once. If that is not enough, zoom out again.
            </>
          }
        />
        <Widget title={{ en: 'Zoom out', zh: '缩小，再缩小' }} hint={{ en: 'Each zoom replaces every number by (roughly) its number of digits.', zh: '每缩小一次，每个数都被换成（大约）它的位数。' }}>
          <ZoomOut />
        </Widget>
        <P
          zh={
            <>
              缩小两三次之后，宇宙中的一切——原子数、宇宙年龄、各种极小概率事件的倒数——都挤在了最左边。物理世界中出现的数，大概都不超过五层的指数塔。但数学可不受宇宙尺寸的限制：数论里的 Skewes 数、各种存在性证明给出的上界，已经轻松越过了物理的边界。而我们才刚刚开始。
            </>
          }
          en={
            <>
              After two or three zooms, everything physical — atom counts, the age of the universe, the odds of absurdly unlikely events —
              is crammed at the left edge. Numbers arising in the physical world seem to stay below a five-level tower. Mathematics is not
              bound by the size of the universe: Skewes’ number in number theory, and many bounds from existence proofs, sail past the
              physical frontier. And we have barely started.
            </>
          }
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section id="far-ahead" kicker={{ en: 'Reflection', zh: '复盘' }} title={{ en: 'What does “far ahead” mean?', zh: '什么才叫“遥遥领先”？' }}>
        <P
          zh={
            <>
              复盘一下这场擂台赛。每一位擂主之所以获胜，不是因为他把上一位的数加了一、乘了二，而是因为他带来了一个<b>新招数</b>。为了说清楚“招数”的强弱，我们把每种记号看成一个<b>数列</b>：第 <M t="n" /> 项是这种记号花“<M t="n" /> 份力气”能写出的典型的数。
            </>
          }
          en={
            <>
              Let’s replay the tournament. No champion won by adding one to the previous record or doubling it; each brought a{' '}
              <b>new trick</b>. To compare tricks, view each notation as a <b>sequence</b>: its <M t="n" />-th term is a typical number the
              notation writes with “<M t="n" /> units of effort.”
            </>
          }
        />
        <Widget title={{ en: 'Four notations as sequences', zh: '把四种记号看成数列' }}>
          <Race />
        </Widget>
        <P
          zh={
            <>
              在大数的世界里，“大很多”的含义和日常不同。对 <M t="10^{10^{10}}" /> 来说，乘以 2 只是把它的对数（约等于位数）从 <M t="10^{10}" /> 变成 <M t="10^{10}+0.3" />——几乎没变；平方也只是把第二层的 <M t="10" /> 变成 <M t="10.0000000000301" /> 左右。我们想要的是<b>新的一层</b>。下面这个定理把这种感觉说准确：
            </>
          }
          en={
            <>
              In the land of big numbers, “much bigger” means something unusual. For <M t="10^{10^{10}}" />, doubling only nudges its logarithm (its digit count, roughly) from{' '}
              <M t="10^{10}" /> to <M t="10^{10}+0.3" /> — practically nothing; even squaring only turns the middle 10 into about{' '}
              <M t="10.0000000000301" />. What we want is <b>a new layer</b>. This theorem makes the feeling precise:
            </>
          }
        />
        <Thm name={{ en: '(one more layer beats everything old)', zh: '（多一层胜过一切旧招数）' }}>
          <B
            zh={<p>记 <M t="T(n)" /> 为 <M t="n" /> 层 10 的指数塔（<M t="T(1)=10" />，<M t="T(n+1)=10^{T(n)}" />）。对任意常数 <M t="c\ge1" />，只要 <M t="T(n-1)\ge\log_{10}c" />，就有</p>}
            en={<p>Let <M t="T(n)" /> be a tower of <M t="n" /> tens (<M t="T(1)=10" />, <M t="T(n+1)=10^{T(n)}" />). For any constant <M t="c\ge1" />, as soon as <M t="T(n-1)\ge\log_{10}c" />,</p>}
          />
          <MB t="c\cdot T(n)\le T(n+1)\qquad\text{and}\qquad T(n)^2\le T(n+1)." />
        </Thm>
        <Proof>
          <L
            zh={
              <>
                <M t="c\cdot T(n)=10^{\log_{10}c+T(n-1)}\le10^{2T(n-1)}" />（用到 <M t="\log_{10}c\le T(n-1)" />），而 <M t="T(n)^2=10^{2T(n-1)}" />。又因为 <M t="2x\le10^{x}" /> 对所有 <M t="x\ge1" /> 成立，所以两者都 <M t="\le10^{10^{T(n-1)}}=10^{T(n)}=T(n+1)" />。
              </>
            }
            en={
              <>
                <M t="c\cdot T(n)=10^{\log_{10}c+T(n-1)}\le10^{2T(n-1)}" /> (using <M t="\log_{10}c\le T(n-1)" />), and{' '}
                <M t="T(n)^2=10^{2T(n-1)}" />. Since <M t="2x\le10^{x}" /> for every <M t="x\ge1" />, both are at most{' '}
                <M t="10^{10^{T(n-1)}}=10^{T(n)}=T(n+1)" />.
              </>
            }
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
            zh: <p>取一次对数：左边约为 <M t="10^{10}+0.3" />，右边是 <M t="10^{10.0001}\approx10^{10}\times1.00023" />，比左边多出约 230 万。乘以 2 在顶层几乎什么都不是。</p>,
            en: <p>Take one log: the left is about <M t="10^{10}+0.3" />, the right is <M t="10^{10.0001}\approx10^{10}\times1.00023" />, larger by about 2.3 million. Multiplying by 2 barely registers at the top.</p>,
          }}
        />
        <KeyIdea>
          <L
            zh={
              <>
                回顾我们的招数阶梯：<b>数数</b>是反复“加一”；<b>位值制和乘方</b>是反复“乘”；<b>指数塔</b>是反复“乘方”。每一级都是把上一级<b>重复</b>很多次。那么，“反复堆塔”会得到什么？耆那教的数学家已经摸到了门口。下一章，我们把这个“重复”变成一台可以无限运转的机器。
              </>
            }
            en={
              <>
                Look at the ladder of tricks: <b>counting</b> repeats “add one”; <b>place value and powers</b> repeat “multiply”;{' '}
                <b>towers</b> repeat “raise to a power.” Each rung <b>repeats</b> the previous one many times. What happens if we repeat
                “build a tower”? The Jain mathematicians reached the doorway. In the next chapter we turn “repeat” into a machine that
                can run forever.
              </>
            }
          />
        </KeyIdea>
        <Caution>
          <L
            zh={<>历史年代与古代数值采用通行说法与《大数理论》的估算；古代文献的版本不同，数值会有出入，但每位擂主的“招数”是确定的。</>}
            en={<>Historical dates and ancient values follow common accounts and the estimates in 曹知秋’s notes. Manuscripts differ, so exact values vary, but each champion’s trick is not in doubt.</>}
          />
        </Caution>
      </Section>
    </>
  )
}
