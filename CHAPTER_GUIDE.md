# Chapter Author Guide — "From 1 to ω₁ / 从 1 到 ω₁"

This guide is for every agent writing a chapter of the interactive googology course. Read all of it first.

## 0. What we are building
- A Vite + React + TypeScript site in `site/`. It is an immersive, bilingual (EN / 中文 / both) interactive course, starting from primary-school counting and going to uncomputable and undefinable numbers.
- **Audience:** a curious high-school student who wants the big picture, the important ideas, and the open problems. It must be rigorous and correct, but effortless and fun. The reader should lose hours without noticing.
- **Main source:** 曹知秋《大数理论》. Study notes are in `ref/notes/p1.md … p7.md`, the full text is in `ref/book.txt`, and per-part text is in `ref/parts/*.txt`. Use the notes first and grep the book to check details. The notes list known **book errors**; never repeat them.
- **Reference implementations:** chapters 1 and 2 are done. Read `site/src/chapters/ch01/*` and `site/src/chapters/ch02/*` to copy the tone, density, structure and code style. **Match their quality and voice.**

## 1. Hard rules for parallel work
1. **Only create or edit files inside your own chapter folders** (`site/src/chapters/chNN/`). Never edit:
   - shared files: `App.tsx`, `registry.ts`, `i18n.tsx`, `math.tsx`, `ui/*`, `lib/*`, `styles.css`, `package.json`;
   - other chapters.

   If you need a helper library, put it in your folder, e.g. `chNN/lib.ts`. You may import, read-only, from `../../lib/huge`, `../../lib/arrows` and `../../lib/numberWords`.
2. **File layout:**
   - `site/src/chapters/chNN/ChapterNN.tsx` holds the default-export component with the chapter body (NN is two digits). It is auto-discovered. Its sections are rendered inside `ChapterShell`, which already adds the title header, the end-of-chapter ruler and prev/next navigation.
   - Widgets go in `chNN/widgets.tsx` (split into several files if large). Data goes in `chNN/data.ts`.
   - CSS goes in `chNN/chNN.css`, imported at the top of `ChapterNN.tsx` (`import './chNN.css'`). Prefix all your class names with `cNN-` to avoid collisions. You may reuse the existing global classes: `widget`, `readout`, `chip`, `btn`, `btn small`, `btn-row`, `row`, `stat`, `stat-label`, `stat-value`, `grid` (tables), `scroll-x`, `muted`, `small`, `mono`, `caution`.
3. **Write each file completely in one go** with the Write tool. Other agents build the same app, so never leave a syntax-broken file on disk.
4. **No new npm dependencies.** Use plain React, SVG, Canvas and CSS. KaTeX is available through `<M t="…"/>` and `<MB t="…"/>`.
5. **No images, videos or external URLs for content.** Every visual is HTML/SVG/Canvas, drawn by code.

## 2. Engine API (import paths relative to `chNN/`)
```tsx
import { B, L, P, Term, useLang } from '../../i18n'   // bilingual primitives
import { M, MB } from '../../math'                     // KaTeX inline / display
import { Caution, Expand, H3, KeyIdea, OpenProblem, Prereq, Proof, Quiz, Section, Slider, Status, Thm, Widget } from '../../ui/blocks'
```
- `<P zh={<>…</>} en={<>…</>} />` is a bilingual paragraph. **Every paragraph has both languages.**
- `<B zh={…} en={…} />` is any bilingual block (lists, several paragraphs). `<L zh en />` is bilingual inline text, also for widget labels.
- `const { t, mode, pick } = useLang()`:
  - `t(en, zh)` returns a string, for SVG text and attributes.
  - In bilingual mode, `L`/`P` show Chinese first with a muted English gloss.
  - Write **native** wording in each language, never word-for-word translation. Chinese should read like a good Chinese popular-math book (e.g. 万进, 读作, 当且仅当, 不妨设). English should read like a good English one.
- `<Term en="ordinal" zh="序数" />` marks a technical term on first use.
- `<Section id kicker={{en,zh}} title={{en,zh}}>…</Section>` is a top-level section. Use 5–9 sections per chapter. Kickers are short labels such as "Round 8 / 第八回合", "Interlude / 幕间" or "The big move / 关键一步".
- `<Prereq items={[{en,zh},…]} />` comes first in every chapter. It lists exactly what is used from earlier chapters, citing chapter numbers.
- `<Thm kind="theorem|lemma|definition|fact" name={{en,zh}} status="proved|conjecture|folklore|convention|open">…</Thm>`, followed by `<Proof>…</Proof>`.
- `<Expand kind="proof|detail|deeper" title={{en,zh}}>…</Expand>` is a collapsible panel:
  - `proof` holds long or full proofs;
  - `detail` holds conventions and edge cases;
  - `deeper` holds optional side topics and history.
- `<KeyIdea>`, `<Caution>` and `<OpenProblem title={{en,zh}}>` are callouts. Use `<Status kind=…/>` inline where needed.
- `<Quiz q={{en,zh}} options={[{en,zh},…]} answer={i} explain={{en,zh}} />` is a checkpoint. Use 2–4 per chapter.
- `<Widget title={{en,zh}} hint={{en,zh}}>…</Widget>` frames an interactive component. Use **at least 5 substantial widgets per chapter**, and more is better.
- `Slider` is `{value,min,max,step?,onChange,label?}`.
- Number libraries:
  - `lib/huge.ts`: tower-form huge numbers (`fromNum`, `fromLog10`, `powConst`, `tower`, `toTex`, `cmp`, `iterLog`, `digitCount`).
  - `lib/arrows.ts`: `arrowExact` (BigInt) and `arrowSize`.
  - BigInt is available.

## 3. Pedagogy and quality bar
- **The arc of each section:** hook (puzzle, story, surprise) → hands-on widget → precise definition → key proof inline, short → full proof or edge cases in an `Expand` → takeaway.
- **No knowledge gaps.**
  - Use only what earlier chapters taught (see §5 for what each chapter provides). If you need something new, teach it in your chapter.
  - Do not use notation before you define it.
  - When you foreshadow a later chapter, say so explicitly ("Chapter 10 will explain…") and never rely on it.
- **Rigor and honesty:**
  - Definitions must be exact and match the book (or deviate explicitly).
  - Tag every claim as `proved`, `conjecture`, `folklore` (community estimate) or `convention`.
  - Say clearly when the community's analysis is informal, as the book itself does.
  - Proofs must be correct. If a proof is too long, give the idea inline and the full argument in an Expand, or cite it as a theorem from the literature with author and year.
- **Correctness of numbers:**
  - Every number shown in a widget must be computed by code that implements the actual definition, or come from a verified table.
  - **Verify small values by running code** (node or python) before writing them into text.
  - The notes contain many verified values; reuse them.
- **Fun:**
  - Each chapter continues the **duel / climb** story. The course frame is a duel across history, "name a bigger number": ch1 replays ancient champions, ch2 adds arrows and Graham. Later chapters climb the "ruler of growth" (marks 0, 1, 2, …, ω, ω+1, … ε₀, Γ₀, SVO, BHO, BO, SHO, ω₁^CK, Rayo's σ, ω₁).
  - Use games (hydra fights, tree-building duels, Turing-machine puzzles), surprising reveals, and short historical anecdotes with real people and dates.
- **Length and density:**
  - Similar to ch1/ch2, roughly 5–9k words in total across both languages.
  - The main text holds the important concepts and key proofs. Long proofs, tables and side topics go in Expand panels.
  - You may reorder, filter, expand or shrink topics for flow.
- **Open problems:** each chapter that touches research ends with its open problems, using `OpenProblem` cards.
- **Accessibility:** widgets work on mobile (width ≥ 360px); use `scroll-x` for wide tables; keyboard-usable controls.
- **Dark theme:** reuse the CSS variables `--gold --cyan --pink --green --red --violet --orange --muted --line --card --bg2`.

## 4. Global conventions (fixed; state them where first used)
- **Natural numbers start at 0.** Fundamental sequences are indexed from 0: λ = sup{λ[0], λ[1], …}.
- **FGH (Ch.4):** f₀(n) = n+1; f_{α+1}(n) = f_α^n(n) (n-fold iterate, f^0 = id); f_λ(n) = f_{λ[n]}(n).
- **Standard fundamental sequences below ε₀ (book Def 3.6):**
  - ω[n] = n;
  - (α+β)[n] = α + β[n] for α in normal form with β the last term;
  - ω^{α+1}[n] = ω^α·n;
  - ω^λ[n] = ω^{λ[n]}.
- **ε₀[n] = ω↑↑n**, with ω↑↑0 = 1, so ε₀[0] = 1, ε₀[1] = ω, ε₀[2] = ω^ω. The book uses ω↑↑(n−1); mention this in a `detail` Expand and explain that the shift does not change any growth rate.
- **Hardy hierarchy:** H₀(n) = n, H_{α+1}(n) = H_α(n+1), H_λ(n) = H_{λ[n]}(n).
- **Slow-growing hierarchy:** g₀(n) = 0, g_{α+1}(n) = g_α(n)+1, g_λ(n) = g_{λ[n]}(n).
- **Growth-rate notation f ∼ α:** Ch.2 introduced informal marks. Ch.4 makes them precise through FGH, while noting that no fully rigorous general definition exists (open problem).
- **PrSS (Ch.5), the book's FGH-shell version, Def 2.16:**
  - ( )[n] = n+1;
  - (#,0)[n] = (#)^n[n];
  - otherwise delete the last term a_m, find the bad root (the rightmost term < a_m, which equals a_m−1 in standard expressions), and write the block from the bad root up to the deleted term n times in total.
  - As an ordinal notation (Def 2.18): () = 0, (0) = 1, (0,1) = ω, (0,1,2) = ω^ω, and (0,1,…,n) has value ω↑↑n.
- **Veblen (Ch.7):**
  - φ(0,β) = ω^β;
  - φ(α,β) = the (1+β)-th common fixed point of all φ(γ,·), γ < α;
  - Γ₀ = first fixed point of α ↦ φ(α,0).
  - The ε, ζ, η numbers: ε_α = φ(1,α), ζ_α = φ(2,α), η_α = φ(3,α).
  - SVO = φ(1@ω), LVO = φ(1@(1,0)).
- **OCF (Ch.8): Madore's ψ (MOCF) is primary.**
  - Ω = the first non-recursive ordinal ω₁^CK. The book notes that older texts use ω₁; we use ω₁^CK with an explanation.
  - Values: ψ(0) = ε₀, ψ(Ω) = ζ₀, ψ(Ω²) = η₀, ψ(Ω^Ω) = Γ₀, ψ(Ω^{Ω^ω}) = SVO, ψ(Ω^{Ω^Ω}) = LVO, ψ(ε_{Ω+1}) = BHO, ψ(Ω_ω) = BO.
  - Buchholz's ψ goes in a dictionary Expand: ψ_B(Ω) = ε₀, ψ_B(Ω₂) = BHO, ψ_B(Ω_ω) = BO.
  - **Always say which OCF you mean.**
- **BMS (Ch.9):** columns are written (0,0)(1,1); rows and columns are 0-indexed; row 0 is the top row. Use the book's rules with the special "non-descendants of the bad root do not ascend" rule. The reference implementation is in `ref/notes/p4.md` §1.6.
- **Busy Beaver (Ch.12):** BB(n) = S(n) = maximum number of steps; Σ(n) = maximum number of 1s. The book uses "BB" for both; say so.
- **Rayo (Ch.13):** state the symbol-count convention explicitly (the book's "fewer than n" vs "at most n" clash; see `ref/notes/p7.md`).
- **Names:** ε₀, Γ₀ (Feferman–Schütte), SVO (small Veblen ordinal), LVO, BHO (Bachmann–Howard ordinal), BO (Buchholz's ordinal), EBO, SHO (small Hydra ordinal = limit of BMS), ω₁^CK (Church–Kleene ordinal), ω₁ (first uncountable ordinal).

## 5. What each chapter provides (contract for "no gaps")
Already built:
- **Ch1, counting → towers:**
  - no largest number; place value (万进 vs 3-digit groups); exponent = digit count, log₁₀;
  - repeated squaring (华严, 上数); towers evaluated top-down; the base barely matters (proved); zoom-out by logs;
  - notations as sequences; "one more layer beats any constant" (proved).
- **Ch2, recursion and arrows:**
  - recursive definitions; Knuth arrows Def 2.11; mathematical induction (domino); a↑^c 1 = a; 2↑^c 2 = 4; monotonicity lemmas;
  - informal growth-rate marks (iterate n times ⇒ +1; n↑^m n ∼ m+1);
  - diagonalization: d(n) = n↑ⁿn beats every row (proved), forcing a new mark **ω**;
  - Graham's number G(64) at mark ω+1; Graham's problem 13 ≤ N* < 2↑↑↑5 (open);
  - **informal "algorithm/computable"** and the Church–Turing thesis (thesis, not theorem); Ackermann in a Deeper panel.

To build (each spec is in §6).

## 6. Per-chapter specs
Each spec lists **Must teach** (later chapters rely on it), suggested widgets, the sources to use, and pitfalls. You may reorder or enrich within the chapter.

### Ch3 · 序数 Ordinals (`ch03`, slug `ordinals`)
- **Hook:** a race where runners finish at times 1/2, 3/4, 7/8, … plus one more runner at time 1. Who is "第 ω 名"? Continue Ch2's question: "what comes after all the natural numbers?"
- **Must teach:**
  - well-order (every nonempty subset has a least element), with ℕ vs ℤ as examples;
  - ordinals as order types / positions (rigorous enough: an ordinal is the order type of a well-order; the von Neumann construction can go in a deeper Expand);
  - successor vs limit; supremum; fundamental sequence (informally, "a sequence climbing to a limit"; the formal version is in Ch4);
  - ordinal +, ·, ^ via recursive definitions (successor case + limit case = sup), with non-commutativity (1+ω = ω ≠ ω+1; 2·ω = ω ≠ ω·2) and 2^ω = ω;
  - the landmarks ω, ω+1, ω·2, ω², ω^ω, ω^ω^ω, ε₀ = sup{ω, ω^ω, ω^ω^ω, …} with ω^{ε₀} = ε₀ (the first fixed point; the word "fixed point" is introduced here);
  - **Cantor normal form** (existence and uniqueness stated, with the proof idea);
  - **Theorem: no infinite strictly decreasing sequence of ordinals** (proved from well-ordering). This is the engine of every later termination proof.
  - **Cardinality vs order:** Hilbert's hotel; countable sets; ω, ω+1, ω·2, …, ε₀ are all countable. **Cantor's diagonal argument** (proved): ℝ, or the infinite 0/1 sequences, are uncountable.
  - **ω₁ = the first uncountable ordinal**: exists, is a limit, and every countable ordinal is below it. This is needed for the finale in Ch13.
  - Briefly: "recursive / computable ordinal" is coming in Ch8; don't define it here.
- **Widgets (≥5):**
  - accumulating-points number line, where points 1−2^{−n} accumulate; build ω, ω+1, ω·2, ω² by zooming and squeezing (map each ordinal < ω^ω to a point in [0,1));
  - ordinal arithmetic playground showing 1+ω vs ω+1 as pictures of sticks;
  - CNF calculator / comparer;
  - "descend from ω^ω" game, where the user picks any smaller ordinal each move and always loses eventually;
  - Hilbert hotel animation; Cantor diagonal animation.
- **Sources:** `ref/notes/p1.md` §2.7 and Ch.3 summary; book Ch3.1 (`ref/parts/p1_intro_recursion_growth.txt`); Part III Ch7 notes (`ref/notes/p3.md`) for the set-theoretic definitions.
- **Pitfalls:**
  - ordinal vs cardinal arithmetic differs (2^ω = ω as ordinals but 2^ℵ₀ > ℵ₀ as cardinals);
  - Ord is a proper class (Burali-Forti) — Deeper panel.

### Ch4 · 基本列与快速增长层次 FS & FGH (`ch04`, slug `fgh`)
- **Must teach:**
  - fundamental sequences formally (Def 3.6 above), with an FS stepper widget;
  - FGH definition with computed values: f₁(n) = 2n, f₂(n) = n·2ⁿ, f₃(2) = 2048, f_ω(2) = 8; bounds 2↑^m(n+1) < f_{m+1}(n) < 2↑^{m+1}(n+1) for large n (proof idea; full proof in an Expand, using Ch2's lemmas);
  - f_ω ≈ diagonal of arrows (mark ω, made precise);
  - **Theorem: f_{ω+1}(64) > G(64)**, with a full rigorous proof. Write it yourself (standard argument: show f_ω(n) > 3↑ⁿ3 for n ≥ 2 or similar, then iterate) and **verify each inequality carefully**;
  - ordinal countdown animation (ω^ω at n = 3 descending to 0, from the notes);
  - ε₀[n] convention; f_{ε₀};
  - "the fundamental sequence is part of the definition": two pathological examples (f_{ε₀} weakened to n+1; f_ω strengthened);
  - Hardy hierarchy (H_{ω^α} = f_α below ε₀) and the slow-growing hierarchy ("replace ω by n" below ε₀; g_{ε₀}(n) = n↑↑n), as an important Deeper or short section; Ch6 and Ch8 rely on both;
  - growth-rate comparison f ∼ α made precise (the book's Def 3.8), with the open problem that no rigorous general definition exists;
  - the hereditary-base-n shortcut (footnote 5), which bridges to Goodstein in Ch6.
- **Widgets:** FS stepper; FGH evaluator (exact BigInt when small, otherwise symbolic); unfolding tree for f_α(n); countdown; SGH "replace ω by n"; f vs arrows race.
- **Sources:** `ref/notes/p1.md` §2.8–2.11, §3 FGH, §5.

### Ch5 · 初等序列 Primitive Sequences (`ch05`, slug `primitive-sequences`)
- **Must teach:**
  - linear arrays as a base-ω odometer (Def 2.13), limit ω^ω (short);
  - **PrSS** expansion (Def 2.16) and as an ordinal notation (Def 2.18); sequence ↔ mountain/tree ↔ ordinal (conversion algorithm and tree picture from the notes);
  - full termination trace (0,1,2)[2] = 8, with an ordinal altimeter;
  - (0,1,2)[3] reaching (0,1,1)[3×2^27];
  - standard expressions;
  - limit ε₀; slogan "big-number notation = ordinal core + iteration shell";
  - the ill-founded variant (copy the last term too: infinite loop);
  - **well-foundedness** argued through Ch3's no-descending-sequence theorem (the book calls its argument a "说明", not a proof; give the honest status and the rigorous references);
  - the original HH-shell PrSS and "catching" (shell unimportant) in a Deeper panel;
  - terms needed by Ch6 and Ch9: **bad root 坏根, bad part 坏部, good part 好部, parent**.
- **Widgets:** PrSS expander with step trace and ordinal labels; mountain/tree drawer; sequence ↔ CNF converter; linear-array odometer; "break the rule" demo.
- **Sources:** `ref/notes/p1.md` §2.5–2.6, §3 PrSS; `ref/notes/p4.md` §1.4 Example 0 for the bad-root terminology.

### Ch6 · 野外的 ε₀ ε₀ in the Wild (`ch06`, slug `epsilon0-in-the-wild`)
- **Must teach:**
  - **Goodstein sequences**: hereditary base notation; G(3) = 5; G(4) = 3·2^402653211 − 3 (verify); termination proof by replacing the base with ω, using Ch3's theorem;
  - **Kirby–Paris hydra** game (rules; any strategy wins; Hydra(2) = 3 — the book's 4 is a typo; Hydra(3) = 37; trees ↔ ordinals below ε₀, same as Ch5's PrSS trees);
  - Beklemishev's worm (Worm(1) = 3, Worm(2) = 51) as a short extra;
  - fuse/burning-rope numbers as an optional puzzle;
  - **"true but unprovable"**: what an axiom system and a proof are (informal but accurate); Peano arithmetic PA; Gödel's incompleteness theorems as slogans (Ch10 revisits them more precisely); Kirby–Paris (1982): Goodstein's theorem and the hydra theorem are unprovable in PA;
  - **proof-theoretic ordinal** PTO(T) (sup of α with T ⊢ TI(α), informal); PTO(PA) = ε₀ (Gentzen 1936) and PTO(RCA₀) = ω^ω;
  - the "growth ≈ PTO" heuristic with the honest caveat (rigorous for PA via Wainer/Buchholz–Wainer; heuristic in general).
- **Widgets:** Goodstein stepper with ordinal shadow; playable hydra (pick heads; step counter; ordinal label); auto-play strategies; worm simulator; hereditary-base converter.
- **Sources:** `ref/notes/p5_p6.md` §1, §2.1–2.4, §5.

### Ch7 · 不动点、Veblen 与 TREE(3) (`ch07`, slug `veblen-and-tree`)
- **Must teach:**
  - the fixed-point machine (iterate, sup, +1 to jump out), with examples α ↦ 1+α (fixed point ω), α ↦ ω+α (ω²), α ↦ ω^α (ε₀);
  - normal functions (strictly increasing + continuous) and Veblen's fixed-point theorem (with proof idea);
  - ε_α as the (1+α)-th fixed point; ζ₀, η₀; binary Veblen φ(α,β) and its FS (book Def 4.15, in a detail Expand); **Γ₀**; Feferman–Schütte and predicativity (PTO(ATR₀) = Γ₀);
  - multi-variable Veblen as an odometer, the Ackermann ordinal, **SVO**, LVO (idea only); "transfinite extension is a small gain";
  - **Kruskal's tree theorem**: tree(n) and **TREE(n)**, with embedding explained via an interactive checker; TREE(1) = 1, TREE(2) = 3, TREE(3) is huge; tree ∼ SVO, TREE ∼ ϑ(Ω^ω·ω) — **say only "just above SVO"**, since Ω and ϑ are not defined until Ch8; strength of Kruskal (ACA₀ + Π¹₂-BI, PTO = SVO);
  - SCG/SSCG mention; open problem "SCG(2) vs TREE(3)";
  - the book's caveat that the domination step is heuristic.
- **Widgets:** fixed-point machine; ε-tower builder; Veblen φ grid explorer (2D table of φ(α,β) symbols); FS stepper for φ; odometer to SVO; **TREE sequence game** (build coloured rooted trees, auto-check embeddings, try to last; demonstrate TREE(2) = 3); embedding checker.
- **Sources:** `ref/notes/p2.md` §1 Ch4, §2.2, §3.1, §4.4, §7; `ref/notes/p5_p6.md` §2.5.

### Ch8 · 序数折叠：从 Ω 到 Buchholz (`ch08`, slug `collapsing`)
- **Must teach:**
  - **recursive (computable) ordinal**: the order type of a well-order on ℕ decidable by an algorithm (Ch2's informal notion); Ω = ω₁^CK = sup of recursive ordinals = the first non-recursive ordinal (still countable!);
  - MOCF as "the least ordinal you cannot build from bricks": C(α) closure (Def 5.2/5.3) with a brick-builder widget;
  - the **plateau at ζ₀**; folding rule ψ(#∗Ω) = sup{ψ(#), ψ(#∗ψ(#)), …};
  - re-derive ζ₀, η₀, Γ₀, SVO, LVO; BHO = ψ(ε_{Ω+1});
  - Ω₂, ψ₁, the find-layer + rename-copies rule; **BO = ψ(Ω_ω)**; TFBO and EBO named;
  - Buchholz's ψ dictionary;
  - **Buchholz hydra** game (labels 0..ω; growth ≈ TFBO; termination unprovable in Π¹₁-CA+BI);
  - PTO table rows: KP = ID₁ = BHO; Π¹₁-CA₀ = ψ(Ω_ω) = BO; Π¹₁-CA + BI = TFBO = ψ(ε_{Ω_ω+1}) (our notes once mislabelled this BO; the book itself is correct);
  - FGH and SGH catch up at BO (wow moment);
  - **mark ϑ/θ notation as optional only.**
- **Widgets:** brick builder for C^n(α); ψ folding stepper with highlighted bad part; MOCF↔Veblen lookup; Buchholz-hydra game; SGH vs FGH catch-up race.
- **Sources:** `ref/notes/p2.md` §1 Ch5, §2.3–2.4, §3.2–3.4, §4, §5; `ref/notes/p5_p6.md` §1.3, §2.6.

### Ch9 · Worm：Bashicu 矩阵 (`ch09`, slug `bashicu-matrix`)
- **Must teach:**
  - PSS Hydra / 2-row BMS (limit BO), then general BMS (exact rules with parent, ancestor, bad root from the lowermost nonzero entry, Δ, special rule); examples 1–5 from `ref/notes/p4.md`, verified with the reference implementation;
  - (0,0)(1,1) = ε₀; (0,0)(1,1)(2,2) = BHO; (0,0,0)(1,1,1) = BO; the n-row limit pattern; SHO;
  - special-rule on/off: off gives an infinite descending chain;
  - **well-ordered (proved)**: test_alpha0 (2022 proof outline), Vargovčík/Yto (arXiv 2023), using stable ordinals; just describe it;
  - the strength ladder **beyond BO: names only** (TFBO, EBO, JO, SRO, SSO, LRO, TSSO, SHO), saying Ch10 explains the ideas behind them;
  - a "multi-row transfer" intuition; a Y-sequence teaser (LPrSS → 0-Y mountain ↔ BMS translation, with one verified example);
  - open problems:
    - complete analysis of BMS;
    - BMS ≡ 0-Y unproved;
    - "lifting is useless" conjecture;
    - whether BMS reaches PTO(Z₂) (conjecture, no reliable evidence);
    - ideal α-Y and LHO undefined;
    - FOS/fffz.
- **Widgets:** **BMS expander** (grid, parent arcs coloured per row, bad root, Δ vector, copies stamped, step through [n]); PSS↔BMS translator; special-rule toggle with the descending chain shown; landmark ladder; 0-Y mountain drawer.
- **Sources:** `ref/notes/p4.md` (all), `ref/notes/p2.md` §1 Ch6.

### Ch10 · 逻辑、反射与大基数 Logic, Reflection & Large Cardinals (`ch10`, slug `reflection-and-large-cardinals`)
- **Must teach:**
  - **Logic toolkit:**
    - sets, von Neumann numerals 0 = ∅, 1 = {∅}, …;
    - first-order formulas over ∈, = with ¬, ∧, ∃ (and the derived ∀, ∨, →); free vs bound variables; satisfaction in a structure;
    - Σₙ/Πₙ by counting quantifier alternations;
    - axioms, models, ZFC (axioms listed in plain words in an Expand); Russell's paradox;
    - Gödel's completeness, incompleteness I/II (precise statements), Löwenheim–Skolem (slogan);
    - V vs L (picture). Ch13 relies on formulas and satisfaction.
  - **Reflection ladder** (the book's intuitions; honest about informality):
    - admissible ordinals (Ω = least admissible > ω), Ω_ω (not admissible), recursively inaccessible I, Mahlo M, Π₃ (K), Πₙ, Πω;
    - "each level collapses every iteration of the previous one" staircase; the reflection-expression ↔ PrSS widget;
    - stability (L_α ≺_Σ₁ L_β) as an "information-preserving miniature"; projection as a skyline;
    - **BMS landmark meanings** revisited (ψ(I), ψ(M), SSO …).
  - **PTO frontier table:** Z₂ = ψ_Ω(I_ω) is the current frontier; Z₃ … ZFC unknown.
  - **Large cardinals:** inaccessible, Mahlo, weakly compact, measurable (elementary embedding), rank-into-rank I3; the analogy between recursive analogues and cardinals; consistency strength.
  - **Laver tables:** compute them live; p(n) = 1,1,2,4,4,8,8,8,8,16,16 for n = 0..10 (verified; the book's list is shifted); p(n) → ∞ known only assuming I3 (open problem).
  - Open problems: rigorous reflection/stability OCFs; PTO(ZFC); Laver without I3.
- **Widgets:** formula builder/evaluator on small finite structures; quantifier-alternation counter; reflection staircase; projection dictionary zoom-out; **Laver table builder**; large-cardinal tower.
- **Sources:** `ref/notes/p3.md` (all), `ref/notes/p5_p6.md` §1.3, §2.9, §3. Verify the §12.5 world-ordinal ordering issue noted in p3 §3; don't repeat the book's claim if dubious.

### Ch11 · 图灵机与停机问题 Turing Machines & Halting (`ch11`, slug `turing-and-halting`)
- **Must teach:**
  - the Turing machine model (book's conventions: 2-way tape, 2 symbols, states A, B, …, halt H, transitions written like 1RB);
  - a **TM simulator / editor** with a space-time diagram; the 2-state champion trace (6 steps, 4 ones);
  - encoding numbers; Turing-complete; Church–Turing thesis (thesis) formalizing Ch2;
  - **halting problem proof** (self-reference made explicit) as a "paradox machine" game;
  - recursive functions, λ-calculus and Ackermann briefly as equivalent models (Deeper);
  - "uncomputable ≠ big" (Chaitin's Ω < 1; slow inverse of BB);
  - revisit Ch8's Ω = ω₁^CK with Kleene's O intuition (Deeper);
  - oracles and Turing jump (needed in Ch12 for Σ₂).
- **Widgets:** TM editor/simulator; space-time diagram; halting-paradox game; enumerate all 2-state machines (TNF) and classify; simple invariant (closed tape language) prover demo for a non-halting machine.
- **Sources:** `ref/notes/p7.md` §1, §4.

### Ch12 · 忙碌海狸 Busy Beaver (`ch12`, slug `busy-beaver`)
- **Must teach:**
  - BB(n) = S(n) and Σ(n); values (1, 6, 21, 107, 47,176,870; ones 1, 4, 6, 13, 4098); champion machines run live; Σ(3) vs S(3) champions differ;
  - the BB(5) Collatz-like orbit (0 → 6 → … → 12284 → halt);
  - **proofs:** BB is uncomputable (it would solve halting); BB eventually dominates every computable function (Rado argument, full proof in an Expand);
  - the BB(5) proof story (bbchallenge, Coq, 2024) with the decider pipeline; BB(6) > 2↑↑↑5; cryptids (Antihydra);
  - Goldbach/Riemann machines; ZFC-independence: the book says 432 states. **Web-search the latest record** (2025–2026) and present it with sources and dates;
  - proof-theoretic version (n_T);
  - beyond: oracles, Σ₂, Ξ, ITTM, qualitatively; growth label ω₁^CK as a convention.
- **Widgets:** champion runner (BB(2), BB(3), BB(4) fully animated; BB(5) via the macro orbit plus fast raw simulation in JS with a typed array); Collatz-orbit stepper; Antihydra iterator; "beat BB(2) by hand" challenge; values table.
- **Sources:** `ref/notes/p7.md` §2, §4, §5.

### Ch13 · Rayo、不可定义数与 ω₁ 的地平线 (`ch13`, slug `rayo-and-horizon`)
- **Must teach:**
  - the 2007 MIT "Big Number Duel" (Rayo vs Elga), closing the course's duel frame;
  - Berry paradox → object language vs metalanguage; Rayo(n) exact definition (book Def 27.1; state the convention);
  - **formula playground** over hereditarily finite sets V_k (names 0, 1, 2; symbol counter with the book's lengths: atom 3, ¬ +3, ∧ +3, ∃ +4; the formula for 0 has length 10 and for 1 has length 30; verify);
  - the staircase: Rayo(34+20n) > n, Rayo(260+20n) > 2↑↑n, Rayo(7339) > S(2^65536−1);
  - why Rayo beats BB; the well-definedness controversy (book); LNG and DaVinci numbers;
  - **the ω₁ horizon** (course synthesis, labelled as such):
    - every function ℕ → ℕ can be outgrown by diagonalization;
    - any countable family is dominated by one function;
    - growth labels are countable ordinals, so the climb never reaches ω₁.
  - The grand recap of the whole ruler; an open-problem compendium (all chapters); the community (Googology Wiki, Discord, Chinese QQ groups as in the book), and how to keep exploring.
- **Widgets:** formula builder/evaluator over V_k; symbol counter; Rayo staircase; "the whole journey" zoomable ruler (custom in-chapter); open-problem explorer.
- **Sources:** `ref/notes/p7.md` §3, §4, §5; `ref/notes/p3.md` §12.6 for ω₁^L remarks.

## 7. Verification (mandatory before you finish)
Run these from `site/`:
1. **Typecheck your files:** `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep chNN`. It must print nothing. Errors in other in-progress chapters are not yours.
2. **Build to a private dir:** `npx vite build --outDir /tmp/build-chNN`. If it fails because of another chapter's syntax error, wait a minute and retry.
3. **Screenshot and runtime errors:** `PORT=41NN OUTDIR=/tmp/build-chNN node shot.mjs /ch/<slug> /tmp/chNN.png bi 1100`. Use a unique port: 4100+NN. It must print `errors: none`.
   - Split the image (python PIL, 2200px slices) and **look at every slice** with the Read tool. Fix layout problems, overflow, broken KaTeX (red text) and empty widgets.
   - Also check `en` and `zh` modes, and one mobile width of 390.
4. **Re-verify every number** printed in your text with a quick node/python script.
5. **Final report (≤250 words):** files created; widgets list; any deviations from the spec; facts you verified on the web, with URLs; anything the integrator must do; and any doubts about rigor.

## 8. UPDATE (user feedback): immersive "story mode", less content per screen
The engine now has a **story mode**, which is the default. A chapter is split automatically into **beats**, one screen each, and the reader pages through them with ←/→ or Space. Beats are cut at:
- section headings;
- `H3`;
- every heavy block: `Widget`, `Quiz`, `Thm` together with its `Proof`, `KeyIdea`, `OpenProblem`, `Expand`, `Caution`;
- about 500 characters of running text.

Write for this format:
- **Short paragraphs:** 1–3 sentences, roughly ≤ 250 Chinese characters or ≤ 60 English words each. One idea per paragraph.
- **Sections:** prefer more sections and H3 sub-scenes over long ones. Each beat should feel like a scene: a line or two of setup, then something to look at or do.
- **Widgets:** keep each widget's body short enough to fit on one screen (≈ 650px tall at 1100px width). Split big widgets into two.
- **No walls of text:** move tangents into `Expand` panels.
- **Preview:** you can check how your chapter pages with the "Story/Scroll" toggle in the top bar. `shot.mjs` screenshots scroll mode, which is the full page.

## 9. UPDATE (user feedback): no gimmicks, no school drills
- The user rejected two things as "stupid":
  - a "type any number, I'll say +1" game;
  - a quiz asking how to write “三亿零四万零五” in digits.
- **Interactivity must earn its place.** A widget should let the reader *see or discover* something that text cannot show: structure, growth, a surprising behaviour, a process unfolding. Do not build toy inputs that only echo trivial facts.
- **Quizzes are optional, and only for genuine insight.** Use at most 2 per chapter. Each must test a non-obvious point where intuition fails, e.g. "is 1+ω equal to ω+1?" or "which is bigger: 2·10^10^10 or 10^10^10.0001?". Never use rote reading or arithmetic drills.
- **The reader is smart.** Write for a bright student, not a child. Prefer depth and surprise over hand-holding.

## 10. UPDATE: KaTeX pitfalls (a real bug the user hit)
- **Macro followed by a letter.** In TeX built with template strings, a macro immediately followed by a letter breaks: `` `n${'\\uparrow'}n` `` becomes `\uparrown`, which KaTeX shows as red raw text. Always put a space or braces after a macro: `\uparrow n`, `\omega{}x`.
- **Detection.** `shot.mjs` now opens every Expand and reports any `.katex-error` (red TeX) in its `errors:` line. It must say `errors: none`.

## 11. UPDATE: every screen must stand on its own (user feedback)
- In story mode the reader sees one beat at a time. A symbol defined three screens earlier is effectively gone.
- Whenever a beat uses a name or symbol defined in an earlier beat (d(n), T(n), C(α), Hydra(n), …), **re-anchor it in passing**. Example: "the diagonal function d(n) = n↑ⁿn", not just "d(n)".
- Likewise, never write "the table above" or "as shown above". Instead say "the table in the previous scene" or restate the fact.

## 12. UPDATE: audience = smart undergraduates (overrides "high-school" in §0/§3)
- The readers are bright undergraduates. Assume they already know:
  - proof by induction and contradiction, basic set notation, functions;
  - limits and suprema in ℝ, basic logic, and a little programming.
- **Do not over-explain elementary steps.** Be crisp, but still define every googology-specific concept from scratch and keep the no-gaps contract.
- **More real mathematics in the main text** is welcome: full short proofs, precise definitions, standard theorem names and literature references. Keep longer proofs in Expand panels.
- **Tone:** an excellent lecture or popular-math book for STEM students. Be playful about the content, never condescending.
