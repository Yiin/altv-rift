import fs from 'fs';

fs.readFile('C:\\Users\\stani\\Projects\\proxy-world\\src\\shared\\modules\\items\\registry\\weapons\\weapons-data.json', 'utf8', (err, fileData) => {
  const data = JSON.parse(fileData);
  const weaponComponents = [];

  for (const weaponHash in data) {
    const weapon = data[weaponHash];

    for (const componentHash in weapon.Components) {
      const component = weapon.Components[componentHash];

      if (component.Description) {
        weaponComponents.push({
          key: `${weapon.HashKey.replace("WEAPON_", "")}_${component.NameGXT.replace("WCT_", "")}`,
          componentHash: +componentHash,
          weaponHash: +weaponHash,
          model: component.ModelHashKey,
          name: component.Name,
          description: component.Description,
        });
      }
    }
  }

  fs.writeFile("./weapon-components.json", JSON.stringify(weaponComponents, null, 2), () => { });
});

// auth, inventory, equipment (clothing/weapons), airdrops, questing system, woodcutting, fishing, xp & leveling
// 