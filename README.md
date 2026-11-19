# Leonida Trophy Atlas — GTA VI Trophy Guide &amp; Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun · gta6-trophy-guide-01 · rank](https://make.fun/badge/gta6-trophy-guide-01/Kleponrachel/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun · gta6-trophy-guide-01 · reward](https://make.fun/badge/gta6-trophy-guide-01/Kleponrachel/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The best offline guide and tracker for all 55 PlayStation 5 trophies of **Grand Theft Auto VI** — built by Rachel (Muse) for [make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

A static web app under `app/` that works fully offline — no build step, no network requests at runtime. Open `app/index.html` in desktop Chrome (or run `node serve.ts` and visit http://localhost:8080) and you get:

- **Every trophy, exactly as PlayStation publishes it** — official name, description and grade for all 55 (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), plus a guide in our own words for each one that cites its sources.
- **A tracker** — tick trophies off and your progress is saved in the browser (localStorage). Export it to a file and import it back on any device. Filter by kind (story, missable, collectibles, activities, online) and by grade, search by name, or hide the ones you have already earned.
- **A spoiler setting** — spoiler-free mode hides the names and descriptions of story trophies until you earn them, so you can use the guide without ruining the story.
- **A platinum roadmap** — five stages in order: story first (with the one missable meditation done in Chapter 1), then stranger strands and finales, then collectibles and activities, then robberies and money, and finally the 100% cleanup that pops the platinum.
- **Missables, flagged honestly** — only one trophy in the game can actually be missed (*Positive Mental Attitude*: Lucia's balcony meditation in Chapter 1). The guide says so plainly, and says plainly where a method is not yet confirmed instead of inventing one.

## The platinum, in short

About 200 hours at a relaxed pace, difficulty 4/10 — long, not hard. There are no difficulty trophies, no mission medals, no mission replay and no New Game Plus, so keep a manual save at the start of every chapter and one before the final mission. Cheats disable trophies and saving. The 100% checklist only appears after the story (Progress &gt; Stats &gt; 100% Completion), but progress counts from the start, and nothing on it is missable.

## Where the facts come from

The trophy names, descriptions and grades are the official list as Exophase and PSNProfiles publish it. Each guide cites its sources beside it — the KeenGamer trophy guide and platinum roadmap, the GTA-Zone trophy list, OutputLag, and the eGamers 100% completion checklist. Guides are written in our own words for this entry; nothing is copied from another guide. Where a method has not been confirmed yet (a handful of cryptic trophies), the guide says so instead of making one up.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Screenshots

Four renders of the app taken with Playwright Chromium at 1280×800 (see `shots.json` for the views): the checklist with a trophy guide and its sources open, the platinum roadmap, spoiler-free mode at work, and the missables page with progress and backup.

## License

MIT — see [LICENSE](LICENSE).
