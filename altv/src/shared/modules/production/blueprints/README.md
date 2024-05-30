## Notes

### 2024-03-17
When importing item exports into blueprint files, do not use "@shared/modules/items", provide full path instead, because "@shared/module/items" exports `blueprint.items.ts` causing cyclic imports to break vue app. Only tested in dev mode, on prod it might resolve alright, but for sane dev experience it's preferable to use this workaround.
