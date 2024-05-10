# Data dump

This folder is used for dumping various JSON files for transforming into useful smaller json files throught the repository.
That's because on GTA 5 updates some of data about the game changes and going through each change individually is very time consuming.
Using these files directly is also not optimal, because they can be quite large and we want to keep bundle sizes low for client & webview.

Script that process this folder is located in /scripts/process-data-dump.js

## weapons.json

Used for weapon items. It doesn't contain stats about the weapon (hud stats and actual ones like damage, firerate etc) so we need to generate that data from the game itself.
