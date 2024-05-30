import fs from "fs";

fs.readFile(
  "src/shared/modules/items/registry/weapons/weapons-data.json",
  "utf8",
  (err, fileData) => {
    const data = JSON.parse(fileData);
    const weaponComponents = [];

    for (const weaponHash in data) {
      const weapon = data[weaponHash];

      for (const componentHash in weapon.Components) {
        const component = weapon.Components[componentHash];

        if (component.Description) {
          weaponComponents.push({
            key: `WeaponComponent.${weapon.HashKey.replace("WEAPON_", "")}_${component.NameGXT.replace("WCT_", "")}`,
            hash: +componentHash,
            hashKey: component.HashKey,
            weaponHash: +weaponHash,
            model: component.ModelHashKey,
            name: component.Name,
            description: component.Description,
          });
        }
      }
    }

    fs.writeFile("./weapon-components.json", JSON.stringify(weaponComponents, null, 2), () => { });
  },
);
