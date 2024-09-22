## Notes

### 2024-03-17
When importing item exports into blueprint files, do not use "@shared/modules/items", provide full path instead, because "@shared/module/items" exports `blueprint.items.ts` causing cyclic imports to break vue app. Only tested in dev mode, on prod it resolves alright, but for sane dev experience it's preferable to use this workaround.

### 2024-09-19
When adding new blueprints, make sure to call `initializeBlueprints` with a function that registers them, otherwise they won't be loaded.
This is the workaround that fixes previous workaround for cyclic imports issue that occurs when registering blueprints in separate files when running vite in watch mode.
