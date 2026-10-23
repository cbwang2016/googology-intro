import type { Bi } from '../../i18n'
import { fromLog10, fromNum, norm, tower, type Huge } from '../../lib/huge'

/** The 123 units of the Avatamsaka (华严经·阿僧祇品), from 俱胝 = 10^7; each is the square of the previous. */
export const HUAYAN = ['俱胝', '阿庾多', '那由他', '频波罗', '矜羯罗', '阿伽罗', '最胜', '摩婆罗', '阿婆罗', '多婆罗', '界分', '普摩', '禰摩', '阿婆钤', '弥伽婆', '毗攞伽', '毗伽婆', '僧羯逻摩', '毗萨罗', '毗赡婆', '毗盛伽', '毗素陀', '毗婆诃', '毗薄底', '毗佉担', '称量', '一持', '异路', '颠倒', '三末耶', '毗睹罗', '奚婆罗', '伺察', '周广', '高出', '最妙', '泥罗婆', '诃理婆', '一动', '诃理蒲', '诃理三', '奚鲁伽', '达攞步陀', '诃鲁那', '摩鲁陀', '忏慕陀', '瑿攞陀', '摩鲁摩', '调伏', '离憍慢', '不动', '极量', '阿么怛罗', '勃么怛罗', '伽么怛罗', '那么怛罗', '奚么怛罗', '鞞么怛罗', '钵罗么怛罗', '尸婆么怛罗', '翳罗', '薜罗', '谛罗', '偈罗', '窣步罗', '泥罗', '计罗', '细罗', '睥罗', '谜罗', '娑攞荼', '谜鲁陀', '契鲁陀', '摩睹罗', '娑母罗', '阿野娑', '迦么罗', '摩伽婆', '阿怛罗', '醯鲁耶', '薜鲁婆', '羯罗波', '诃婆婆', '毗婆罗', '那婆罗', '摩攞罗', '娑婆罗', '迷攞普', '者么罗', '驮么罗', '钵攞么陀', '毗迦摩', '乌波跋多', '演说', '无尽', '出生', '无我', '阿畔多', '青莲华', '钵头摩', '僧祇', '趣', '至', '阿僧祇', '阿僧祇转', '无量', '无量转', '无边', '无边转', '无等', '无等转', '不可数', '不可数转', '不可称', '不可称转', '不可思', '不可思转', '不可量', '不可量转', '不可说', '不可说转', '不可说不可说', '不可说不可说转']

export type Landmark = { v: Huge; name: Bi<string>; tex: string }

/** Famous numbers for the zoom-out widget. Values are order-of-magnitude where marked “≈”. */
export const LANDMARKS: Landmark[] = [
  { v: fromNum(10), name: { en: 'your fingers', zh: '你的手指' }, tex: '10' },
  { v: fromNum(1e8), name: { en: '亿 (10⁸)', zh: '一亿' }, tex: '10^8' },
  { v: fromNum(1.8446744073709552e19), name: { en: 'chessboard rice', zh: '棋盘上的米' }, tex: '2^{64}-1' },
  { v: fromLog10(80), name: { en: 'atoms in the observable universe', zh: '可观测宇宙的原子数' }, tex: '\\approx10^{80}' },
  { v: fromLog10(100), name: { en: 'googol', zh: '古戈尔 googol' }, tex: '10^{100}' },
  { v: fromLog10(185), name: { en: 'Planck volumes in the universe', zh: '宇宙中的普朗克体积数' }, tex: '\\approx10^{185}' },
  { v: fromLog10(41024319.95), name: { en: 'largest known prime', zh: '已知最大素数' }, tex: '2^{136279841}-1' },
  { v: fromLog10(8e16), name: { en: 'Archimedes’ biggest', zh: '阿基米德的最大数' }, tex: '10^{8\\times10^{16}}' },
  { v: fromLog10(3.01e24), name: { en: 'a monkey typing all human data', zh: '猴子打出人类全部数据' }, tex: '\\approx2^{10^{25}}' },
  { v: fromLog10(3.7218383881977644e37), name: { en: '不可说不可说转 (Avatamsaka)', zh: '不可说不可说转' }, tex: '10^{7\\cdot2^{122}}' },
  { v: norm(2, 100), name: { en: 'googolplex', zh: '古戈尔普勒克斯' }, tex: '10^{10^{100}}' },
  { v: norm(3, 34), name: { en: 'Skewes’ number', zh: 'Skewes 数' }, tex: '\\approx10^{10^{10^{34}}}' },
  { v: norm(4, 2.08), name: { en: 'Poincaré recurrence of the universe', zh: '宇宙的庞加莱回归时间' }, tex: '\\approx10^{10^{10^{10^{2.08}}}}' },
]

/** Champions of the ancient duel. */
export type Champion = { who: Bi<string>; trick: Bi<string>; tex: string; v: Huge | null; slog: number; era: Bi<string> }

/** Continuous super-logarithm base 10: slog(x) = x − 1 on (0,1], slog(x) = 1 + slog(log10 x). */
export function slog(v: Huge): number {
  let n = 0
  let cur = v
  while (cur.h > 0) {
    n += cur.h
    cur = { h: 0, x: cur.x }
  }
  let x = cur.x
  while (x > 1) {
    x = Math.log10(x)
    n++
  }
  return n + (x - 1)
}

const mk = (v: Huge) => ({ v, slog: slog(v) })

export const CHAMPIONS: Champion[] = [
  { who: { en: 'Two cave-dwellers', zh: '两位原始人' }, era: { en: 'prehistory', zh: '史前' }, trick: { en: 'one word per number', zh: '一个数一个词' }, tex: '3', ...mk(fromNum(3)) },
  { who: { en: 'Roman numerals', zh: '罗马数字' }, era: { en: 'antiquity', zh: '古罗马' }, trick: { en: 'symbols for 5, 10, 50, …', zh: '为 5、10、50……造符号' }, tex: '\\approx10^4', ...mk(fromNum(1e4)) },
  { who: { en: 'Journey to the West', zh: '《西游记》如来' }, era: { en: '16th c.', zh: '明代' }, trick: { en: '1750 kalpas × 129600 years', zh: '一千七百五十劫 × 十二万九千六百年' }, tex: '2.268\\times10^{8}', ...mk(fromNum(226800000)) },
  { who: { en: 'The chessboard legend', zh: '国际象棋的传说' }, era: { en: 'India, legend', zh: '古印度传说' }, trick: { en: 'doubling 64 times', zh: '翻倍 64 次' }, tex: '2^{64}-1', ...mk(fromNum(1.8446744073709552e19)) },
  { who: { en: '“Upper” numbers (上数)', zh: '《数术记遗》上数' }, era: { en: 'Han dynasty', zh: '汉代' }, trick: { en: 'each unit = previous squared', zh: '数穷则变：亿亿为兆' }, tex: '10^{4096}', ...mk(fromLog10(4096)) },
  { who: { en: 'Avatamsaka Sutra', zh: '《华严经》' }, era: { en: '1st–4th c.', zh: '约公元 1–4 世纪' }, trick: { en: 'square, 122 times', zh: '连续平方 122 次' }, tex: '10^{7\\cdot2^{122}}', ...mk(fromLog10(3.7218383881977644e37)) },
  { who: { en: 'Archimedes, The Sand Reckoner', zh: '阿基米德《数沙者》' }, era: { en: '3rd c. BC', zh: '公元前 3 世纪' }, trick: { en: 'powers of powers', zh: '幂的幂' }, tex: '10^{8\\times10^{16}}', ...mk(fromLog10(8e16)) },
  { who: { en: 'Jain cosmology (JPA)', zh: '耆那教 JPA' }, era: { en: 'c. 1st c. BC–1st c. AD', zh: '约公元前后' }, trick: { en: 'a tower of exponents', zh: '指数塔' }, tex: '10^{10^{\\cdots^{10}}}\\ (\\approx10^{136}\\text{ levels})', v: null, slog: 1.285e136 },
]

/** Tower values used in the comparison presets. */
export const towerPresets: { a: number[]; b: number[] }[] = [
  { a: [2, 2, 2, 2, 2], b: [10, 10, 10] },
  { a: [3, 3, 3, 3], b: [10, 10, 10] },
  { a: [9, 9, 9], b: [10, 10, 10] },
  { a: [100, 100, 100], b: [10, 10, 10, 10] },
  { a: [2, 2, 2, 2, 2, 2], b: [10, 10, 10, 10] },
]
export const evalTower = tower
