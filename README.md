# Delete Me

A UI/UX portfolio piece: a landing page (case study) plus a playable desktop mystery game, built with React, TypeScript, CSS, Framer Motion and the Web Audio API.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # single-file build in dist/index.html
```

## Where things live

- `src/landing/Landing.tsx` — portfolio page (hero, features, tech stack, process, puzzle map, tokens)
- `src/game/Game.tsx` — recovery screen, boot, desktop, taskbar, notifications, endings
- `src/game/store.tsx` — game state (windows, fragments, Lumen chat, action log)
- `src/game/story.ts` — all story text, clues and answers (edit writing here)
- `src/game/apps/` — Photos, Documents, Messages, Terminal, folders/Trash, viewers, browser, delete_me.txt
- `src/game/audio.ts` — synthesized sound effects and ambient drone
- `src/styles.css` — design tokens and all styles

## Solutions (spoilers)

1. Photos: order the skies dawn → night. Letters spell LUMEN.
2. Documents: journal.lock password is `lumen`.
3. chat.exe → Kit, 11 Oct: first letters of Juno's messages spell EMBER.
4. System → terminal.exe: `restore memories --key ember`.
5. Memories → memo_04 says anything in Trash dated after 12 Oct isn't Juno's. Restore `session.log` in Trash.
6. Open delete_me.txt and choose.
