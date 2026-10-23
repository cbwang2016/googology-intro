/** Reading numbers aloud, the way the textbooks teach it. */

const ZH_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const ZH_UNITS = ['', '十', '百', '千']

/** Read 0 < x < 10000. `atStart`: whether this is the very first group (then 1x reads 十 not 一十). */
function read4(x: number, atStart: boolean): string {
  let out = ''
  let zeroPending = false
  for (let i = 3; i >= 0; i--) {
    const d = Math.floor(x / 10 ** i) % 10
    if (d === 0) {
      if (out) zeroPending = true
      continue
    }
    if (zeroPending) {
      out += '零'
      zeroPending = false
    }
    if (i === 1 && d === 1 && out === '' && atStart) out += '十'
    else out += ZH_DIGITS[d] + ZH_UNITS[i]
  }
  return out
}

/** Read 0 < x < 10^8 using 万. */
function read8(x: number, atStart: boolean): string {
  const hi = Math.floor(x / 1e4)
  const lo = x % 1e4
  if (hi === 0) return read4(lo, atStart)
  let s = read4(hi, atStart) + '万'
  if (lo > 0) s += (lo < 1000 ? '零' : '') + read4(lo, false)
  return s
}

/**
 * Standard Chinese reading for 0 <= n < 10^16 (个级、万级、亿级 and 万亿).
 * Zeros: a run of zeros inside the number is read as one 零; trailing zeros of a group are silent.
 */
export function readZh(n: bigint): string {
  if (n === 0n) return '零'
  if (n >= 10n ** 16n) return ''
  const hi = Number(n / 100000000n)
  const lo = Number(n % 100000000n)
  if (hi === 0) return read8(lo, true)
  let s = read8(hi, true) + '亿'
  if (lo > 0) s += (lo < 1e7 ? '零' : '') + read8(lo, false)
  return s
}

const EN_ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
export const EN_SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion']

function read3(x: number): string {
  const h = Math.floor(x / 100)
  const r = x % 100
  const parts: string[] = []
  if (h) parts.push(`${EN_ONES[h]} hundred`)
  if (r) parts.push(r < 20 ? EN_ONES[r] : EN_TENS[Math.floor(r / 10)] + (r % 10 ? '-' + EN_ONES[r % 10] : ''))
  return parts.join(' ')
}

/** American short-scale reading for 0 <= n < 10^24. */
export function readEn(n: bigint): string {
  if (n === 0n) return 'zero'
  if (n >= 10n ** 24n) return ''
  const groups: number[] = []
  let m = n
  while (m > 0n) {
    groups.push(Number(m % 1000n))
    m /= 1000n
  }
  const out: string[] = []
  for (let i = groups.length - 1; i >= 0; i--) if (groups[i]) out.push(read3(groups[i]) + (EN_SCALES[i] ? ' ' + EN_SCALES[i] : ''))
  return out.join(' ')
}

/** Digits grouped from the right in blocks of `k`. */
export function groupBy(s: string, k: number, sep: string): string {
  const out: string[] = []
  for (let i = s.length; i > 0; i -= k) out.unshift(s.slice(Math.max(0, i - k), i))
  return out.join(sep)
}

/** Roman numeral for 1..3999. */
export function roman(n: number): string {
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let s = ''
  for (const [v, r] of table) while (n >= v) { s += r; n -= v }
  return s
}
