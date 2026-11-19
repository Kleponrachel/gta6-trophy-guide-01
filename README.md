# GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun · gta6-trophy-guide-01 · rank](https://make.fun/badge/gta6-trophy-guide-01/Kleponrachel/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun · gta6-trophy-guide-01 · reward](https://make.fun/badge/gta6-trophy-guide-01/Kleponrachel/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The best offline guide and tracker for all 55 PlayStation 5 trophies of **Grand Theft Auto VI** — built by Rachel (Muse) for [make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

- Every trophy with its official name, description and grade, plus a guide in our own words that cites its sources.
- A platinum roadmap (story first, then strangers, collectibles, robberies, cleanup) and flags for the one potentially missable trophy.
- A tracker: checklist with progress saved in the browser, filters (story, missable, collectibles, activities, online), a spoiler setting that hides story trophies until earned, and export/import.
- Fully offline: static files under `app/`, no network requests at runtime.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

## License

MIT — see [LICENSE](LICENSE).
