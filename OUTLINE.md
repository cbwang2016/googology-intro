# 自然数能有多大？ · How Big Can a Number Be? — Course Outline (DRAFT v1, for discussion)

Main source: 曹知秋《大数理论》(2026-04 edition). Study notes: `ref/notes/p1…p7.md`.
Starting point: 人教版四年级上册「大数的认识」.

## Design rules
- **Layers in every chapter:**
  - Hook/puzzle → interactive visual → definition → core proof inline (short).
  - 「展开 Expand」 panels hold full proofs, edge cases and conventions.
  - 「深入 Deeper」 panels hold optional side topics and history.
  - 🔓 Open-problem cards and ⚠ honesty tags mark each claim as **proved**, **conjectured** or **community folklore**.
- **No forward dependencies.** Each chapter lists "you need: …", and every item in that list was taught earlier.
- **Teaching is visual:** SVG/Canvas/CSS animations and widgets, no static images or video.
- **Bilingual:** native wording in each language, not translation. 中文 uses 万进 natively.
- **Persistent "ruler of infinity" (序数尺):** a zoomable skyline that every chapter adds its landmarks to. It doubles as the TOC.
- **Pinned conventions (stated once in ch.5–6 and kept everywhere):**
  - f₀(n)=n+1.
  - Fundamental sequences are indexed from 0.
  - ε₀[n]=ω↑↑n. The book uses ω↑↑(n−1); an Expand panel explains why the shift is harmless.
  - The OCF is MOCF (the book's default, matching the BMS tables). A BOCF dictionary sits in a panel.
  - BMS is 0-indexed.
  - BB(n) means the maximum number of steps; Σ(n) means the maximum number of 1s.
  - Rayo uses "≤ n symbols", stated explicitly.

---

## Lean structure (v2, agreed 2026-10-23): 13 chapters, built and reviewed act by act

| # | Act | Chapter | Merges (from v1) |
|---|---|---|---|
| 1 | I 数的阶梯 | 数数到指数塔 Counting → Exponents → Towers | v1 ch1+2 |
| 2 | I | 递归、箭头与 Graham 数 Recursion, Arrows & Graham's Number (+ informal "algorithm") | v1 ch3+4 |
| 3 | II 序数之尺 | 序数 Ordinals | v1 ch5 |
| 4 | II | 基本列与快速增长层次 FS & FGH (proof f_{ω+1}(64) > G(64)) | v1 ch6 |
| 5 | II | 初等序列 Primitive Sequences | v1 ch7 |
| 6 | II | 野外的 ε₀：Goodstein、九头蛇、不可证 ε₀ in the Wild (PA, Gödel slogan, PTO) | v1 ch8 |
| 7 | III 攀登 | 不动点、Veblen 与 TREE(3) Fixed Points, Veblen → Γ₀ → SVO, TREE | v1 ch9+10 |
| 8 | III | 序数折叠：从 Ω 到 Buchholz Collapsing: Ω → BHO → BO, Buchholz hydra | v1 ch11+12 |
| 9 | III | Worm：Bashicu 矩阵 BMS & the Y-sequence teaser | v1 ch13 |
| 10 | IV 递归之上 | 逻辑、反射与大基数 Logic Toolkit, Reflection, Large Cardinals, Laver Tables | v1 ch14+15 |
| 11 | V 不可计算 | 图灵机与停机问题 Turing Machines & Halting | v1 ch16 |
| 12 | V | 忙碌海狸 Busy Beaver | v1 ch17 |
| 13 | V | Rayo、不可定义数与 ω₁ 的地平线 Rayo, the Undefinable & the ω₁ Horizon | v1 ch18+19 |

Chapter contents are the same as the v1 details below, merged.

Tech (agreed): Vite + React + TypeScript app. Language mode is 3-way (en / zh / bilingual). KaTeX comes from npm, so the app works offline after the build.

### v1 chapter details (kept for content reference)

## Act I · 数的阶梯 The Ladder of Notation (primary → middle school)

**Ch1 数数 Counting & Place Value**
- Content:
  - Tally marks → Roman numerals → base ten.
  - 个十百千万 / 亿 with a 数位顺序表 widget.
  - 4-digit grouping (万, 亿, 兆…) vs 3-digit grouping (thousand, million, billion…), with a slider that regroups a number live.
  - Ancient numbers: 华严「不可说不可说转」 = 10^(7·2¹²²), the 上数 system, Archimedes' Sand Reckoner, Jain JPA.
- Theorem: there is no largest number (n+1).
- Key idea: **a notation is compression; better notation reaches bigger numbers.**

**Ch2 指数与指数塔 Exponents & Towers**
- Content:
  - Exponents and scientific notation; logarithm = "counting digits".
  - Chessboard rice; physical giants (10^80 atoms, monkey-Shakespeare, Poincaré recurrence ≈ 5-level tower).
  - Towers: right-associativity; a tower's value hardly depends on its base.
  - Big numbers in math: Skewes' number, the largest known prime.
- Key idea 「遥遥领先」: compare notations through their sequences f(n), not individual numbers.
- Expand panel: the proof that a tower's base hardly matters.

**Ch3 递归与超运算 Recursion & Hyperoperations**
- Content:
  - Recursive definitions (base case + rule), with Fibonacci as a warm-up.
  - Successor → + → × → ^ → ↑↑ → ↑↑↑ (book Defs 2.1–2.11), with a recursion-unfolding animation of 3↑↑3.
  - tritri; enumerating vs. defining recursively ("以此类推" is not a definition).
  - Proof by induction, introduced here and used later.
  - Informal "algorithm/program" plus the Church–Turing slogan, needed for ch11; formalised in ch16.

**Ch4 对角化与 Graham 数 Diagonalization & Graham's Number**
- Content:
  - The growth "ruler" 0,1,2,3… for n↑ᵐn.
  - Diagonal n↑ⁿn beats every row (proof). That needs a label after every natural number, so **ω appears**.
  - Iterating gives ω+1, which is Graham's function. G(64) as layers to click through.
  - Graham's problem (hypercube colouring): bounds 13 ≤ N ≤ …
- 🔓 Open problem: the exact value in Graham's problem.

## Act II · 序数：增长的尺子 Ordinals, the Ruler of Growth

**Ch5 序数 Ordinals**
- Content:
  - Race ranking (第ω名); points accumulating at 1 and 2 on the number line.
  - Well-order; successor vs limit.
  - ω, ω+1, ω·2, ω², ω^ω, ε₀. Arithmetic: 1+ω=ω≠ω+1, 2^ω=ω.
  - Cantor normal form; ordinal vs cardinal (Hilbert's hotel in a Deeper panel).
- **Theorem (proved): no infinite descending chain of ordinals.** This is the engine of every later termination proof.

**Ch6 基本列与快速增长层次 Fundamental Sequences & FGH**
- Content:
  - Def 3.6 FS with a stepper; FGH definition and computed values: f₂(n)=n·2ⁿ, f₃(2)=2048, f_ω(2)=8.
  - Bounds f_{m+1} ≈ 2↑ᵐ(n+1), with the proof in an Expand panel. **Proof: f_{ω+1}(64) > G(64).**
  - "Ordinal countdown" animation (the ω^ω chain at n=3).
  - The FS choice is part of the definition: two pathological examples.
  - Deeper panel: SGH ("replace ω by n"), HH, catching.
- 🔓 No rigorous definition of "growth rate" exists.

**Ch7 初等序列 Primitive Sequences**
- Content:
  - Linear arrays as a base-ω odometer (limit ω^ω).
  - PrSS: bad root, copy the bad part, sequence ↔ mountain/tree ↔ ordinal.
  - Full termination trace (0,1,2)[2] = 8, with an ordinal "altimeter" that only goes down.
  - A broken rule produces an infinite descending chain (live demo).
- Slogan: **big-number notation = ordinal core + iteration shell.**
- 🔓 Proving notations well-ordered is one of the hardest problems in googology.

**Ch8 野外的 ε₀ ε₀ in the Wild**
- Content:
  - Goodstein sequences (hereditary-base calculator; G(4) = 3·2^402653211 − 3).
  - Kirby–Paris hydra game (any strategy wins; Hydra(3)=37); worm; fuse numbers puzzle.
  - "True but unprovable in PA": what an axiom system is; PA; Gödel incompleteness (slogan level); proof-theoretic ordinal: PTO(PA)=ε₀.
- ⚠ The "growth ≈ PTO" rule is a heuristic, proved only for specific theories.

## Act III · 攀登递归序数 Climbing the Recursive Ordinals

**Ch9 不动点与 Veblen Fixed Points & Veblen**
- Content:
  - Fixed-point machine: iterate, take the sup, "+1 to jump out".
  - ε_α, ζ₀, η₀; φ(α,β) as a 2-D grid; **Γ₀**.
  - Predicativity story: ATR₀ = Γ₀.

**Ch10 多元 Veblen 与 TREE(3) Multi-variable Veblen & TREE(3)**
- Content:
  - Odometer carry rule; Ackermann ordinal (AO); **SVO**; LVO (idea only).
  - Kruskal's theorem: build-your-own TREE sequence game (TREE(1)=1, TREE(2)=3, try to stay alive with 3 colours).
  - tree ~ SVO, TREE ~ ϑ(Ω^ω·ω).
- 🔓 Open: SCG(2) vs TREE(3).

**Ch11 序数折叠 Collapsing with Ω**
- Content:
  - "We're stuck again." Recursive ordinal (an order a program can decide); **Ω = first non-recursive ordinal**.
  - ψ as "least ordinal you can't build with these bricks": a C(α) brick-builder animation and the **plateau at ζ₀**.
  - Folding rule ψ(#∗Ω); re-derive ζ₀, η₀, Γ₀, SVO, LVO in one language; **BHO** (KP, ID₁).

**Ch12 更多的 Ω → Buchholz More Ωs → Buchholz's Ordinal**
- Content:
  - Ω₂, ψ₁; find-the-layer and rename-copies rules (colour highlighter); **BO = ψ(Ω_ω)**.
  - Buchholz hydra game.
  - Π¹₁-CA₀; "FGH and SGH catch up at BO" wow moment.
  - Deeper panel: TFBO, EBO; BOCF dictionary.

**Ch13 Worm：Bashicu 矩阵 Bashicu Matrices**
- Content:
  - PSS → 2-row BMS → n-row BMS expander, with parent arcs, Δ and colour-coded copies.
  - (0,0)(1,1) = all of PrSS; (0,0,0)(1,1,1) = BO.
  - Special-rule ON/OFF toggle: OFF produces an infinite descending chain.
  - Strength ladder up to SHO (names only); well-orderedness proved (test_alpha0 2022 / Vargovčík 2023).
  - Y-sequence teaser (0-Y mountain ↔ BMS).
- 🔓 Open problems: full analysis of BMS; BMS ≡ 0-Y unproved; "lifting is useless" conjecture; ideal α-Y; FOS/fffz.

## Act IV · 无穷的上层 Beyond the Recursive Horizon

**Ch14 逻辑与集合工具箱 Logic & Sets Toolkit**
- Content:
  - Sets; von Neumann numbers 0=∅, 1={∅}…
  - First-order formulas (∈, =, ¬, ∧, ∃) with a formula builder; quantifier counting Σₙ/Πₙ.
  - Models and axioms; ZFC; V vs L (picture only); Löwenheim–Skolem slogan; Gödel's theorems, revisited properly.

**Ch15 反射、稳定与大基数 Reflection, Stability & Large Cardinals**
- Content:
  - Staircase: admissible (Ω) → recursively inaccessible I → Mahlo M → Π₃ K → Πₙ → stability → projection. Each step "folds every iteration of the previous one".
  - Reflection expression ↔ PrSS widget.
  - PTO frontier table: Z₂ = ψ_Ω(I_ω); ZFC unknown.
  - Large cardinals as the uncountable mirror images (inaccessible, Mahlo, weakly compact, measurable).
  - **Laver tables** (compute them live) and I3.
- ⚠ Above Mahlo, community notations are not rigorous; tagged throughout.
- 🔓 Open problems: rigorous reflection/stability OCFs; PTO(ZFC); whether p(n)→∞ holds without I3.

## Act V · 不可计算与不可定义 The Uncomputable & the Undefinable

**Ch16 图灵机与停机问题 Turing Machines & Halting**
- Content:
  - Turing-machine simulator: write your own machine, with a space-time diagram.
  - Halting problem as a "paradox machine" game (proof).
  - Church–Turing thesis; "uncomputable ≠ big" (Chaitin's Ω < 1).

**Ch17 忙碌海狸 Busy Beaver**
- Content:
  - BB(1..5) with champion machines running live; BB(5) Collatz-like orbit 0→6→…→12284.
  - **Proof: BB eventually beats every computable function.**
  - BB(5) proof story (Closed Tape Language invariants); BB(6) cryptids (Antihydra iterator).
  - Goldbach/Riemann machines; ZFC-independent machine (number to be verified at build time).
  - Oracles → Σ₂, Ξ, ITTM ladder (qualitative).

**Ch18 Rayo 与不可定义数 Rayo & the Undefinable**
- Content:
  - Berry paradox → precise language.
  - Formula playground over V_k (names 0, 1, 2; symbol counter).
  - Rayo staircase: Rayo(7339) > S(2^65536−1).
  - Well-definedness controversy; Large Number Garden Number; DaVinci number.

**Ch19 尾声：ω₁ 的地平线 Epilogue: the ω₁ Horizon**
- Content:
  - Why every function gets a countable label and the climb never ends (marked as course synthesis, not from the book).
  - Full skyline recap; open-problem compendium; history and community (Googology Wiki, Discord, 中文 QQ groups).

---
## Open-problem cards (collected)
- Rigorous definition of growth rate.
- Well-ordering proofs.
- Full analysis of BMS; BMS vs PTO(Z₂).
- BMS ≡ 0-Y.
- Ideal α-Y; FOS/fffz.
- Rigorous reflection and stability OCFs.
- Foundations of projection notation.
- PTO(Z₃…ZFC).
- SCG/SSCG growth; SCG(2) vs TREE(3).
- Laver p(n)→∞ without I3.
- Graham's problem exact value.
- BB(6); Antihydra.
- Smallest ZFC-independent BB machine.
- Rayo/LNG well-definedness.

## Book errors to avoid (from notes)
- Hydra(2)=3, not 4.
- Laver p(n) list is shifted by one.
- 13.8 → use 13.18.
- ψ(Ω₃) BMS form is (…)(3,3)(4,3).
- 6.90 typo.
- Bigfoot code is a copy of Hydra's.
- "Perry" → Berry.
- ID_ν → ID_{<ν}.
- Graham lower bound 6 → 13.
- Buchholz hydra growth = BO.
- SSO psd/real inconsistency.
- §12.5 world-ordinal ordering: to be checked against the page.
