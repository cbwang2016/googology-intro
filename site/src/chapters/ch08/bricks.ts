import { add, cmp, eps, key, mul, nat, OMEGA, pow, type Ord } from './ordinal'

/**
 * Closure sets of Madore's ψ with recursive arguments only (book Def 5.3):
 *   C⁰(α) = {0, 1, ω}
 *   Cⁿ⁺¹(α) = Cⁿ(α) ∪ { γ+δ, γ·δ, γ^δ, ψ(η) : γ, δ, η ∈ Cⁿ(α), η < α }
 * Below ζ₀ we know ψ(η) = ε_η, which is what we insert as the brick ψ(η).
 * `alpha === null` stands for any α > every element we can ever build (e.g. α = ζ₀+1):
 * then every η qualifies.
 */
export type Level = { items: Ord[]; max: Ord; count: number; listed: boolean; eligible: Ord | null }

const below = (eta: Ord, alpha: Ord | null) => alpha === null || cmp(eta, alpha) < 0

export function closureLevels(alpha: Ord | null, levels: number, fullUpTo = 2, closedAlpha = false): Level[] {
  const elig = (items: Ord[]) => {
    let e: Ord | null = null
    for (const x of items) if (below(x, alpha)) e = x
    return e
  }
  const out: Level[] = []
  let cur: Ord[] = [nat(0), nat(1), OMEGA]
  out.push({ items: cur, max: OMEGA, count: 3, listed: true, eligible: elig(cur) })
  for (let n = 1; n <= levels; n++) {
    if (n <= fullUpTo) {
      const map = new Map<string, Ord>()
      for (const x of cur) map.set(key(x), x)
      for (const g of cur)
        for (const d of cur) {
          for (const r of [add(g, d), mul(g, d), pow(g, d)]) {
            const k = key(r)
            if (!map.has(k)) map.set(k, r)
          }
        }
      for (const e of cur)
        if (below(e, alpha)) {
          const r = eps(e)
          const k = key(r)
          if (!map.has(k)) map.set(k, r)
        }
      cur = [...map.values()].sort(cmp)
      const maxCur = cur[cur.length - 1]
      out.push({ items: cur, max: maxCur, count: cur.length, listed: true, eligible: elig(cur) })
    } else {
      // Only the maximum: max Cⁿ⁺¹ = max( M^M , ψ(E) ), E = largest element of Cⁿ below α.
      const prev = out[out.length - 1]
      const M = prev.max
      const E = prev.eligible
      let best = pow(M, M)
      if (E) {
        const cand = eps(E)
        if (cmp(cand, best) > 0) best = cand
      }
      // next E: below α the set is closed under +,·,^ when α is ω, ε₀ or "huge"; for finite α it is frozen
      let nextE: Ord | null = E
      if (E && closedAlpha) nextE = alpha === null ? best : pow(E, E)
      out.push({ items: [], max: best, count: -1, listed: false, eligible: nextE })
    }
  }
  return out
}
