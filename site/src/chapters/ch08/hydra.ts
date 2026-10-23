/**
 * Buchholz hydra (Buchholz 1987; 《大数理论》 §21.27, rules as in ref/notes/p5_p6.md §2.6).
 * Root label is '+', other labels are natural numbers or ω (encoded as -1).
 * Nodes directly above the root carry label 0.
 */
export const OMEGA_LABEL = -1
export type HNode = { id: number; label: number; ch: HNode[]; tag?: 'found' | 'new' }
let nextId = 1
export const node = (label: number, ch: HNode[] = []): HNode => ({ id: nextId++, label, ch })
export const ROOT = -2

export function clone(t: HNode, keepTag = false): HNode {
  return { id: nextId++, label: t.label, ch: t.ch.map((c) => clone(c, keepTag)), tag: keepTag ? t.tag : undefined }
}
export function clearTags(t: HNode): HNode {
  return { ...t, tag: undefined, ch: t.ch.map(clearTags) }
}
export function count(t: HNode): number {
  let s = 1
  for (const c of t.ch) s += count(c)
  return s
}
export function height(t: HNode): number {
  let h = 0
  for (const c of t.ch) h = Math.max(h, 1 + height(c))
  return h
}

/** Path (child indices) of every leaf, left to right. */
export function leaves(t: HNode, path: number[] = []): number[][] {
  if (t.ch.length === 0) return path.length ? [path] : []
  return t.ch.flatMap((c, i) => leaves(c, [...path, i]))
}

export type CutRule = 1 | 2 | 3 | 4
/**
 * Cut the head at `path` during round n (n ≥ 1). Returns the new hydra (immutable)
 * plus which rule fired. Nodes involved are tagged for display.
 */
export function cut(root: HNode, path: number[], n: number): { t: HNode; rule: CutRule } {
  const t = clone(clearTags(root))
  // walk down, remembering the chain of nodes from root to the head
  const chain: HNode[] = [t]
  for (const i of path) chain.push(chain[chain.length - 1].ch[i])
  const sigma = chain[chain.length - 1]
  const tau = chain[chain.length - 2]
  const u = sigma.label
  if (u === OMEGA_LABEL) {
    sigma.label = n + 1
    sigma.tag = 'new'
    return { t, rule: 4 }
  }
  if (u === 0) {
    tau.ch.splice(path[path.length - 1], 1)
    if (chain.length === 2) return { t, rule: 1 } // τ is the root
    const rho = chain[chain.length - 3]
    tau.tag = 'found'
    for (let j = 0; j < n; j++) {
      const c = clone(tau)
      c.tag = 'new'
      rho.ch.push(c)
    }
    return { t, rule: 2 }
  }
  // label u ≥ 1: ε = first node below σ with label < u
  let ei = chain.length - 2
  while (ei > 0 && !(chain[ei].label < u)) ei--
  const eps = chain[ei]
  // copy A_ε; in the copy, ε gets label u−1 and σ gets label 0
  const B = clone(eps)
  let cur = B
  for (let d = ei; d < chain.length - 1; d++) cur = cur.ch[path[d]]
  cur.label = 0
  B.label = u - 1
  B.tag = 'new'
  eps.tag = 'found'
  // replace σ by B
  tau.ch[path[path.length - 1]] = B
  return { t, rule: 3 }
}

/** Buchholz-ψ term of a hydra: node with label u and children c ↦ ψ_u(o(c₁)+…), root ↦ sum. */
export function toPsi(t: HNode): string {
  const lab = (u: number) => (u === OMEGA_LABEL ? '\\omega' : String(u))
  const sum = (cs: HNode[]) => (cs.length ? cs.map(toPsi).join('+') : '0')
  if (t.label === ROOT) return sum(t.ch)
  return `\\psi_{${lab(t.label)}}(${sum(t.ch)})`
}
/** Bracket notation as in the book: (+(0(1))) */
export function toBrackets(t: HNode): string {
  const lab = t.label === ROOT ? '+' : t.label === OMEGA_LABEL ? 'ω' : String(t.label)
  return `(${lab}${t.ch.map(toBrackets).join('')})`
}

/** Parse "(+(0(1(1))))" style strings. */
export function parse(s: string): HNode {
  let i = 0
  const go = (): HNode => {
    if (s[i] !== '(') throw new Error('expected (')
    i++
    let lab: number
    if (s[i] === '+') {
      lab = ROOT
      i++
    } else if (s[i] === 'ω' || s[i] === 'w') {
      lab = OMEGA_LABEL
      i++
    } else {
      let j = i
      while (/[0-9]/.test(s[j])) j++
      lab = Number(s.slice(i, j))
      i = j
    }
    const ch: HNode[] = []
    while (s[i] === '(') ch.push(go())
    if (s[i] !== ')') throw new Error('expected )')
    i++
    return node(lab, ch)
  }
  return go()
}
