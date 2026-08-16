# component

Cloudflare Worker backing https://wanlok.github.io/. See README.md for the live endpoints.

## Direction

This Worker is meant to become the API layer for the static site: all data currently read
straight from Firestore by the React app should eventually be served from here instead, and
the React app (`wanlok-component-react`, sibling repo at
`../wanlok-component-react`) should eventually drop its Firebase dependency entirely once
this Worker covers everything it needs.

## Types.ts

`src/lib/Types.ts` must stay in sync with `wanlok-component-react/src/services/Types.ts` for
any type shared between the two apps (`Folder`, `CollectionDocument`, `CloudinaryFileInfo`,
`SteamInfo`, `YouTubeInfo`, `Region`, `Quiz`, `QuizContent`, `Attributes`, `TypedAttributes`,
`CollectionAttributes`, `ApiResponse`, etc.). When changing one of these shapes here, check
whether the react repo's copy needs the same change, and vice versa.

`Types.ts` also holds Worker-only types with no frontend equivalent (e.g. `Preview`, used only
for building Open Graph preview HTML) — those don't need to be synced with the react repo,
but still live here rather than local to the file that uses them, since this is where all
shared interfaces are kept.

Not everything in the react repo's `Types.ts` belongs here — only sync what this Worker
actually deals with (collections/folders/quiz data). Unrelated features living in that file
(Kanban board, Yakijuju scores, charts, hyperlinks, etc.) should stay out of this repo unless
an endpoint here actually needs them.
