# Instructions for AI agents working in this repository

## Git
- **Never commit, push, amend, rebase, or create branches or tags.** Leave all changes uncommitted in the working tree. The maintainer reviews and commits everything themselves.
- Do not run commands that rewrite history or discard work (`git reset --hard`, `git checkout -- <file>`, `git clean`, `git rm`, force pushes) unless the maintainer explicitly asks for that exact action.

## Working on the course
- Read `CHAPTER_GUIDE.md` before writing or editing any chapter. It defines:
  - the engine API;
  - the notation conventions;
  - what each chapter may assume from earlier chapters;
  - the quality bar: undergraduate audience, story mode, no gimmicks, self-contained scenes.
- Edit only the files your task concerns. Chapter work stays inside `site/src/chapters/chNN/`. Do not touch shared engine files unless the task is explicitly about the engine.
- Verify before finishing (run from `site/`):
  - `npx tsc --noEmit -p tsconfig.app.json`
  - `npx vite build --outDir /tmp/<private-dir>`
  - `PORT=<unique> OUTDIR=/tmp/<private-dir> node shot.mjs /ch/<slug> /tmp/x.png bi 1100` — it must print `errors: none`
  - `node beatcheck.mjs <slug>` for story-mode scene heights
- Do not add the source book (`ref/book.pdf`, `ref/book.txt`, `ref/parts/`) to the repository. It is copyrighted by its author; see `LICENSE-CONTENT.md`.
