# alt:V proxy-world.gg (name in progress)

## The idea

There are many RP servers in GTA 5 community because the strong points of GTA 5 are real-life inspired world, cars and clothing and roleplay utilized all of them to high degree. My idea for a server came from asking a question what I can take from GTA 5 strong points that would not involve RP.

Initial idea was to create RPG server, but grind w/o action seemed boring, so next area to look into is PvP with RPG elements.

Wtf is that you might ask, and to be honest I'm not even sure myself. In nutshell, a plan for MVP is to test the idea and see if we need to pivot to something else.

For MVP, we need a simple game loop and few deep mechanics. Current progress notes are in ./TODO-MVP.md file.

## MVP

### Game loop

Craft/find gear, level up abilities, conquer & defend territories, stay at the top of leaderboard.

### Gameplay mechanics

* Material gathering
* Crafting
* Gear
* Leveling
* Vehicles
* Combat
* World events
* Territory control

## Setup

### Server

1. `npm run i` (installing npm deps)
2. `npm run update` (altv serverfiles)
3. `npm run dev` (esbuild for building code & tsc for checking types)

### Webview

1. `npm run i` (installing npm deps)
2. `npm run dev` (build & run the project)

## Development

### Data sync

You might notice that vue is installed for server, client & webview. That is not an accident.

Vue & pinia is being used for data-syncing between server, client and webview. The alternative is to create events for passing data back and forth and that slows down the development considerably. I searched for good reactivity library in npm, but they were either inferior to vue composable API or didn't exist.

The sync is always following top -> down direction, meaning that server is source of truth for client & webview, and in some stores client is source of truth for webview.

The sync functionality is using pinia.$subscribe to pass atomic sync events (see: `subscribeToStore` at `src/shared/store/utils.ts`).

## Notes

### Import helper (optional, helps with auto-generating many lines of code inside index.ts files, still testing)

```js
// @index('./*.ts', f => `export * from "${f.path}";`)
// @endindex
```

Requires "Generate Index" VSCode extension: https://marketplace.visualstudio.com/items?itemName=JayFong.generate-index

```
Id: JayFong.generate-index
Description: Generating file indexes easily.
Publisher: Jay Fong
```
