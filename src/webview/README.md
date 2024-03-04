# Running in browser

Running the command

```bash
npm run dev
```

will start dev server. You will see an url (likely [http://127.0.0.1:5173/client/webview/](http://127.0.0.1:5173/client/webview/)).

Base url by itself won't display anything, thats where the routing comes in.
There are two levels of routing, first one that's utilizing `vue-router` w/ WebHashHistory is rendering scenes.

Currently the project has 3 scenes (defined in `src/webview/src/scenes` folder):

* **discord-auth**: Used to render "login with discord" button in case automatic discord auth didn't work.
* **create-character**: For new players, this scene is displayed so they can create the character before being spawned in the game.
* **in-game**: The main scene containing all the windows & ui elements used in the game.

To access the **in-game** scene in the browser, simply add #/in-game to the base url:

[http://127.0.0.1:5173/client/webview/#/in-game](http://127.0.0.1:5173/client/webview/#/in-game)

The second level of routing happens inside `src/webview/src/scenes/in-game/InGameScene.vue` file.

You can see that there is `useClient()` composable in use to render windows/elements based on internal state. There is a bit of magic involved how that state works in the game, but for ui development in the browser, only `src/shared/` (**@shared/**) and `src/webview/` (**@/**) folders are relevant. If you want to render some component in the browser, you will need to open a files where the state is set:

You can find that file by going to `@/store/synced/client.store.ts`. In this file you can follow the location of `getDefaultClientStoreState` function and end up in `@shared/store/client.store.ts`. `'altMock' in globalThis` checks if we're currently in browser context, and we can use this to mock the data inside our client state.

`window` property is for full-screen windows (e.g. inventory, loot-box, crafting, etc)  
`elements` are for smaller UI elements (e.g. chat, weapon-hud, notifications).

### Notes

The typescript is slow if you load full project `/`, so for browser development I recommend opening `src/webview` and `src/shared/` directly in the IDE.

There is some annoying bug where you can't autoamtically import stuff inside `<template>`, I'm not sure what's the problem or how to fix it, but tbh I haven't given it much attention yet, although I probably should.

For data feel free to define mocked data inside the component itself, I'll handle the syncing of that data as it depends on data structures in the server & client.

# UI considerations

As the UI is running in the game, there is no mobile version, but the responsiveness is still important for handling smaller resolutions. E.g. inventory supports resolutions as low as 800x600. To make it easier to deal with, the way responsiveness works is by utilizing dynamic base font-size:

**src/webview/src/main.css**:
```css
:root {
  font-size: max(10px, 1.2vh);
}
```

and using rem/em values throught the project. If you need to hard-code px value (e.g. for programmatic calculations), use `px(value: number)` function that can be imported from `@/composables/use-pixel.ts`. 

The result of that is by using only tailwind & `px()` helper the responsiveness is achieved out of the box.
