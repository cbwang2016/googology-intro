# How Big Can a Number Be? · 数能有多大？

**An interactive, bilingual (中文 / English) journey through googology — the mathematics of very large numbers.**

一场关于大数数学（Googology）的互动之旅：从小学课本里的“数位顺序表”出发，经过指数塔、Knuth 箭头、序数、快速增长层次、序数折叠函数、Bashicu 矩阵，一直走到不可计算的忙碌海狸和不可定义的 Rayo 数，最后停在永远到不了的地平线 ω₁。

The course is written for curious, mathematically minded undergraduates. Every idea is built from scratch, every claim is tagged as **proved**, **conjecture**, or **community estimate**, and the open problems of the field are presented along the way.

## Features

- **Story mode.** Each chapter plays as a sequence of short scenes, one per screen. Navigate with ← / →, Space, swipe, or the bottom bar; a toggle switches to plain scrolling.
- **Three language modes.** English, 中文, or both side by side, written natively in each language rather than translated.
- **Interactive widgets in every chapter.** All of them compute from the actual definitions, for example:
  - a Bashicu-matrix expander;
  - a playable Kirby–Paris hydra and a Buchholz hydra;
  - a TREE-sequence game with a real embedding checker;
  - Laver tables computed live;
  - a Turing-machine workbench, and a full 47,176,870-step BB(5) run in the browser;
  - a first-order-formula evaluator over hereditarily finite sets.
- **Layered rigor.** Key proofs sit in the main text; full proofs, conventions, and side topics sit in expandable panels.
- **Offline-friendly.** The site is fully static, with no external requests. Formulas are rendered with KaTeX bundled into the build.

## Chapters

| Act | Chapter |
|---|---|
| I · 数的阶梯 The Ladder of Notation | 1 From Counting to Towers · 2 Recursion, Arrows & Graham’s Number |
| II · 序数：增长之尺 Ordinals, the Ruler of Growth | 3 Ordinals · 4 Fundamental Sequences & the FGH · 5 Primitive Sequences · 6 ε₀ in the Wild |
| III · 攀登递归序数 Climbing the Recursive Ordinals | 7 Fixed Points, Veblen & TREE(3) · 8 Collapsing: from Ω to Buchholz · 9 Worms: the Bashicu Matrix System |
| IV · 递归之上 Above Recursion | 10 Logic, Reflection & Large Cardinals |
| V · 不可计算与不可定义 The Uncomputable and the Undefinable | 11 Turing Machines & the Halting Problem · 12 Busy Beaver · 13 Rayo, the Undefinable & the ω₁ Horizon |

## Run locally

Requires Node.js 20+ (CI uses Node 24).

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into site/dist
npm run preview    # serve the production build
```

## Publish on GitHub Pages

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds `site/` and deploys it on every push to `main`. It can also be started by hand from the *Actions* tab.

One-time setup:

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`, or run the workflow manually. The site appears at `https://<user>.github.io/<repo>/`.

No path configuration is needed. The build uses a relative base (`base: './'` in `site/vite.config.ts`) and hash-based routing (`#/ch/...`), so it works under any sub-path.

## Project structure

```
site/                    Vite + React + TypeScript app
  src/
    i18n.tsx             language modes (en / zh / bilingual) and bilingual text primitives
    math.tsx             KaTeX components
    ui/                  layout, story mode, blocks (theorems, proofs, panels, quizzes), ruler, cover
    lib/                 shared number libraries (huge numbers in tower form, Knuth arrows, number words)
    chapters/
      registry.ts        chapter list, acts, ruler landmarks
      chNN/ChapterNN.tsx one folder per chapter (auto-discovered), with its own widgets and CSS
  shot.mjs               full-page screenshot + runtime/KaTeX error check (headless Chromium)
  storyshot.mjs          per-scene screenshots in story mode
  beatcheck.mjs          reports story scenes taller than the viewport
CHAPTER_GUIDE.md         authoring guide: engine API, conventions, per-chapter contracts
OUTLINE.md               curriculum design
ref/notes/               study notes on the source book (definitions, verified values, known errata)
```

### Adding or editing a chapter

Read [`CHAPTER_GUIDE.md`](CHAPTER_GUIDE.md) first. It fixes the notation conventions used across the whole course, for example:

- f₀(n) = n+1;
- ε₀[n] = ω↑↑n;
- Madore’s ψ as the primary collapsing function;
- 0-indexed Bashicu matrices;
- BB(n) as the maximum number of steps.

It also lists what each chapter may assume from earlier ones, so the course has no knowledge gaps.

Chapters are discovered automatically from `site/src/chapters/chNN/ChapterNN.tsx`.

The QA scripts (`shot.mjs`, `storyshot.mjs`, `beatcheck.mjs`) need a local Chromium. They are developer tools and are not used by CI.

## Sources and credits

- The main reference is **曹知秋《大数理论》** (Googology lecture notes, 2026 edition), [github.com/ZhiqiuCao/Googology](https://github.com/ZhiqiuCao/Googology). Definitions, conventions, and many worked values follow it; errata found while building the course are noted in `ref/notes/` and in the chapters.
- Further results are cited in the chapters where they are used, for example:
  - the Busy Beaver Challenge (bbchallenge.org);
  - the well-orderedness proof of the Bashicu matrix system (arXiv:2307.04606);
  - Arai’s ordinal analysis of second-order arithmetic (arXiv:2311.12459);
  - Lavrov–Lee–Mackey and Lipka on Graham’s problem.
- The book PDF itself is **not** included in this repository (see `.gitignore`); get it from the author’s repository.

## License

- **Course content** — the text in the chapters, the notes and the guides — is licensed under **CC BY 4.0**; see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).
- **Source code** is licensed under **MIT**; see [`LICENSE`](LICENSE).

The course is based on 曹知秋《大数理论》, which remains © its author and is not covered by these licenses. Please credit both this course and 曹知秋 when you reuse the material.
