import type { Bi } from '../../i18n'

export type Preset = { s: string; label: Bi<string> }

/** Presets for the main expander. Every expansion here was checked against the book (see lib.ts and the chapter's verification). */
export const EXP_PRESETS: Preset[] = [
  { s: '(0)(1)(2)(2)', label: { en: 'PrSS warm-up', zh: 'PrSS 热身' } },
  { s: '(0,0)(1,1)', label: { en: 'ε₀', zh: 'ε₀' } },
  { s: '(0,0)(1,1)(2,2)', label: { en: 'BHO', zh: 'BHO' } },
  { s: '(0,0)(1,1)(2,0)(2,1)(3,1)', label: { en: 'a skipped sibling', zh: '被跳过的兄弟' } },
  { s: '(0,0,0)(1,1,1)', label: { en: 'BO', zh: 'BO' } },
  { s: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,2,0)', label: { en: 'book 13.4', zh: '书中 13.4' } },
  { s: '(0,0,0)(1,1,1)(2,0,0)(1,1,1)', label: { en: 'special rule, small', zh: '额外规则·小例' } },
  { s: '(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)', label: { en: 'book showcase', zh: '书中范例' } },
  { s: '(0,0,0)(1,1,1)(2,2,2)(3,3,1)(4,1,1)(3,2,2)(2,2,2)', label: { en: 'book 13.28', zh: '书中 13.28' } },
  { s: '(0,0,0,0)(1,1,1,1)(2,2,2,1)(3,3,1,1)(4,2,0,0)(5,1,1,1)(6,2,2,1)(7,3,1,1)', label: { en: '4 rows (13.19)', zh: '四行（13.19）' } },
]

export const PSS_PRESETS: string[] = [
  '(0,0)(1,1)',
  '(0,0)(1,1)(1,1)',
  '(0,0)(1,1)(2,1)',
  '(0,0)(1,1)(2,1)(3,1)',
  '(0,0)(1,1)(2,2)',
  '(0,0)(1,1)(2,0)(2,1)(3,1)',
  'p1(p2(p3+p3))',
]

export const WALK_ROOTS: { s: string; label: Bi<string> }[] = [
  { s: '(0,0)(1,1)', label: { en: '(0,0)(1,1) → ε₀', zh: '(0,0)(1,1) → ε₀' } },
  { s: '(0,0)(1,1)(2,2)', label: { en: '(0,0)(1,1)(2,2) → BHO', zh: '(0,0)(1,1)(2,2) → BHO' } },
  { s: '(0,0,0)(1,1,1)', label: { en: '(0,0,0)(1,1,1) → BO', zh: '(0,0,0)(1,1,1) → BO' } },
]

export type Rung = {
  s: string
  name: string
  full: Bi<string>
  ch: number // chapter where the name is explained
}

/** The strength ladder (book §2.1–2.2 of the notes). Names beyond BO are explained in Ch.10. */
export const LADDER: Rung[] = [
  { s: '(0)(1)', name: 'ω', full: { en: 'the first infinite ordinal', zh: '第一个无穷序数' }, ch: 3 },
  { s: '(0)(1)(2)', name: 'ω^ω', full: { en: 'limit of linear arrays', zh: '线性数阵的极限' }, ch: 5 },
  { s: '(0,0)(1,1)', name: 'ε₀', full: { en: 'limit of PrSS = 1-row BMS', zh: 'PrSS（单行 BMS）的极限' }, ch: 5 },
  { s: '(0,0)(1,1)(2,1)', name: 'ζ₀', full: { en: 'first fixed point of ε', zh: 'ε 的第一个不动点' }, ch: 7 },
  { s: '(0,0)(1,1)(2,1)(3,1)', name: 'Γ₀', full: { en: 'Feferman–Schütte ordinal', zh: 'Feferman–Schütte 序数' }, ch: 7 },
  { s: '(0,0)(1,1)(2,1)(3,1)(4,0)', name: 'SVO', full: { en: 'small Veblen ordinal', zh: '小 Veblen 序数' }, ch: 7 },
  { s: '(0,0)(1,1)(2,1)(3,1)(4,1)', name: 'LVO', full: { en: 'large Veblen ordinal', zh: '大 Veblen 序数' }, ch: 7 },
  { s: '(0,0)(1,1)(2,2)', name: 'BHO', full: { en: 'Bachmann–Howard ordinal', zh: 'Bachmann–Howard 序数' }, ch: 8 },
  { s: '(0,0,0)(1,1,1)', name: 'BO', full: { en: 'Buchholz’s ordinal = limit of 2-row BMS', zh: 'Buchholz 序数＝双行 BMS 的极限' }, ch: 8 },
  { s: '(0,0,0)(1,1,1)(2,1,0)(3,2,0)', name: 'TFBO', full: { en: 'Takeuti–Feferman–Buchholz ordinal', zh: 'Takeuti–Feferman–Buchholz 序数' }, ch: 10 },
  { s: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)', name: 'EBO', full: { en: 'extended Buchholz ordinal', zh: '扩展 Buchholz 序数' }, ch: 10 },
  { s: '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,0)', name: 'JO', full: { en: 'Jäger ordinal', zh: 'Jäger 序数' }, ch: 10 },
  { s: '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,0)(4,2,0)', name: 'SRO', full: { en: 'small Rathjen ordinal', zh: '小 Rathjen 序数' }, ch: 10 },
  { s: '(0,0,0)(1,1,1)(2,2,0)', name: 'SSO', full: { en: 'small stable ordinal', zh: '小稳定序数' }, ch: 10 },
  { s: '(0,0,0)(1,1,1)(2,2,2)', name: 'LRO', full: { en: 'start of “projection” territory', zh: '“投影”区域的起点' }, ch: 10 },
  { s: '(0,0,0,0)(1,1,1,1)', name: 'TSSO', full: { en: 'limit of 3-row BMS', zh: '三行 BMS 的极限' }, ch: 10 },
  { s: '(0,0,0,0,0)(1,1,1,1,1)', name: 'QSSO', full: { en: 'limit of 4-row BMS', zh: '四行 BMS 的极限' }, ch: 10 },
]

export const MOUNTAIN_PRESETS: string[] = [
  '(0,0)(1,1)(2,2)',
  '(0,0,0)(1,1,1)(2,2,2)(3,1,1)',
  '(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)',
  '(0,0)(1,1)(2,1)(3,1)',
]
