import fs from "fs";
import path from "path";

if (process.env.ALL === "true" || process.env.CLOTHES === "true") {
  processClothes();
}
if (process.env.ALL === "true" || process.env.WEAPONS === "true") {
  processWeapons();
}
if (process.env.ALL === "true" || process.env.TREES === "true") {
  processTrees();
}

async function processClothes() {
  const componentMap: { [key: string]: string } = {
    "1": "mask",
    "3": "gloves",
    "4": "pants",
    "5": "bags",
    "6": "shoes",
    "7": "accessory",
    "9": "armor",
    "11": "top"
  };

  const propsMap: { [key: string]: string } = {
    "0": "headwear",
    "1": "glasses",
    "2": "earrings",
    "6": "lefthand",
    "7": "righthand"
  };
  const rawData = fs.readFileSync(path.resolve("data-dump/pedComponentVariations.json"), "utf8");
  const data: PedVariation[] = JSON.parse(rawData);

  const outputData: { [key: string]: { [key: string]: any } } = {};
  const keyData: { [key: string]: { [key: string]: string } } = {};

  const typeMap: { [key: string]: string } = {
    "mask": "Mask",
    "gloves": "Gloves",
    "pants": "Pants",
    "bags": "Bags",
    "shoes": "Shoes",
    "accessory": "Accessory",
    "armor": "Armor",
    "top": "Top",
    "headwear": "Headwear",
    "glasses": "Glasses",
    "earrings": "Earrings",
    "lefthand": "LeftHand",
    "righthand": "RightHand"
  };

  // Fetch and process torsos data
  const [femaleTopsResponse, maleTopsResponse, femaleTorsosResponse, maleTorsosResponse] = await Promise.all([
    fetch("https://raw.githubusercontent.com/Yiin/gtav-top-organizer/main/tops/female.json"),
    fetch("https://raw.githubusercontent.com/Yiin/gtav-top-organizer/main/tops/male.json"),
    fetch("https://raw.githubusercontent.com/Yiin/gtav-top-organizer/main/torsos/female.json"),
    fetch("https://raw.githubusercontent.com/Yiin/gtav-top-organizer/main/torsos/male.json"),
  ]);

  /**
   * Gloves are also torsos bus with gloves on hands.
   * Torso drawable 0-16 are default torso with bare hands,
   * while drawable other than defaults have some kind of gloves on hands.
   * Each torso with glove is fit to match some torso without gloves.
   * So we need to map all torsos without gloves and assign them matching torsos with gloves.
   */
  const [femaleTops, maleTops] = await Promise.all<({ category: string; dlc: string; drawable: number; torsos: number[] })[]>(
    [
      femaleTopsResponse.json(),
      maleTopsResponse.json(),
    ]
  );

  const [femaleTorsos, maleTorsos] = await Promise.all<{ [torsoDrawable: number]: { dlc: string; drawable: number } }>([
    femaleTorsosResponse.json(),
    maleTorsosResponse.json(),
  ])

  for (const pedVariation of data) {
    for (const component of pedVariation.ComponentVariations) {
      const componentType = componentMap[component.ComponentId.toString()];
      if (componentType) {
        if (!outputData[componentType]) {
          outputData[componentType] = {};
          keyData[componentType] = {};
        }

        // Use processedTorsos data for tops
        const { torsos, gloves } = (() => {
          if (componentType !== 'top') {
            return { torsos: null, gloves: null };
          }

          const isMale = pedVariation.PedName.startsWith("mp_m");

          const genderTops = (isMale ? maleTops : femaleTops);
          const torsos = genderTops
            .find(t => t.dlc === pedVariation.DlcCollectionName && t.drawable === component.DrawableId)?.torsos
            || null;

          const genderGloves = (isMale ? maleTorsos : femaleTorsos);
          const gloves = torsos && torsos.flatMap(torso => genderGloves[torso]);
          return { torsos, gloves };
        })();

        outputData[componentType][component.NameHash] = {
          ped: pedVariation.PedName,
          key: component.NameHash,
          dlc: pedVariation.DlcCollectionName === pedVariation.PedName ? '' : pedVariation.DlcCollectionName,
          dlcDrawableId: component.RelativeCollectionDrawableId,
          componentId: component.ComponentId,
          drawableId: component.DrawableId,
          textureId: component.TextureId,
          name: component.TranslatedLabel?.English,
          price: component.Price,
          restrictionTags: component.RestrictionTags,
          ...(componentType === 'top' ? { torsos, gloves } : {}),
        };

        let keyName = component.TranslatedLabel?.English
          ? toPascalCase(component.TranslatedLabel.English, pedVariation.PedName === "mp_m_freemode_01")
          : null;

        if (keyName) {
          if (keyData[componentType][keyName]) {
            keyName = `${keyName}_${component.DrawableId}_${component.TextureId}`;
          }

          keyData[componentType][keyName] = component.NameHash;
        }
      }
    }

    if (pedVariation.Props) {
      for (const prop of pedVariation.Props) {
        const propType = propsMap[prop.ComponentId.toString()];
        if (propType) {
          if (!outputData[propType]) {
            outputData[propType] = {};
            keyData[propType] = {};
          }
          outputData[propType][prop.NameHash] = {
            ped: pedVariation.PedName,
            key: prop.NameHash,
            anchorPoint: prop.AnchorPoint,
            dlc: pedVariation.DlcCollectionName === pedVariation.PedName ? '' : pedVariation.DlcCollectionName,
            dlcDrawableId: prop.RelativeCollectionDrawableId,
            componentId: prop.ComponentId,
            drawableId: prop.DrawableId,
            textureId: prop.TextureId,
            name: prop.TranslatedLabel?.English,
            price: prop.Price,
            restrictionTags: prop.RestrictionTags
          };

          let keyName = prop.TranslatedLabel?.English
            ? toPascalCase(prop.TranslatedLabel.English, pedVariation.PedName === "mp_m_freemode_01")
            : null;

          if (keyName) {
            if (keyData[propType][keyName]) {
              keyName = `${keyName}_${prop.DrawableId}_${prop.TextureId}`;
            }

            keyData[propType][keyName] = prop.NameHash;
          }
        }
      }
    }
  }

  for (const [fileName, fileData] of Object.entries(outputData)) {
    try {
      fs.writeFileSync(`src/shared/modules/items/registry/clothing/${fileName}/${fileName}.json`, JSON.stringify(fileData, null, 2));
      console.log(`Writing ${fileName}.json...`);
    } catch {
      console.warn(`Skipping ${fileName}.json...`);
    }
  }

  for (const [fileName, fileData] of Object.entries(keyData)) {
    const typeName = typeMap[fileName];
    const content = `import { makeKeys } from "@shared/utility/make-keys";

export type ${typeName}ItemKey = Brand<string, "${typeName}ItemKey">;
export const ${typeName} = makeKeys<${typeName}ItemKey>()({
${Object.entries(fileData).map(([key, value]) => `  ${key}: "${value}",`).join('\n')}
});
`;
    try {
      fs.writeFileSync(`src/shared/modules/items/registry/clothing/${fileName}/${fileName}.keys.ts`, content);
      console.log(`Writing ${fileName}.keys.ts...`);
    } catch {
      console.warn(`Skipping ${fileName}.json...`);
    }
  }
}

async function processWeapons() {
  const response = await fetch("https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/weapons.json");
  const weapons = await response.json();

  const processedWeapons = weapons
    .filter((weapon: any) => {
      const name = weapon.TranslatedLabel?.English;
      return name && name !== "Invalid";
    })
    .map((weapon: any) => {
      const key = weapon.Name.replace("WEAPON_", "");
      const name = weapon.TranslatedLabel?.English;
      const hash = weapon.Hash;
      const ammoGroup = weapon.AmmoType.replace("AMMO_", "");
    });

  // fs.writeFileSync(
  //   path.resolve("data/processed-weapons.json"),
  //   JSON.stringify(processedWeapons, null, 2),
  // );
}

function processTrees() {
  const data = fs.readFileSync(path.resolve("data-dump/trees.txt"), "utf8");
  const lines = data.split("\n").slice(1);
  const treeMap: Record<string, { x: number; y: number; z: number; }[]> = {};

  lines.forEach((line) => {
    const columns = line.split(", ");
    if (columns.length > 1) {
      const tree = columns[0];

      const locationData = {
        x: parseFloat(columns[1]),
        y: parseFloat(columns[2]),
        z: parseFloat(columns[3]),
      };

      if (!treeMap[tree]) {
        treeMap[tree] = [];
      }

      treeMap[tree].push(locationData);
    }
  });

  // Create JSON files for each archetype
  for (const [key, value] of Object.entries(treeMap)) {
    fs.writeFileSync(
      path.resolve(`src/shared/modules/woodcutting/trees/${key}.json`),
      JSON.stringify(value, null, 2),
    );
  }
}

({
  Name: "WEAPON_PISTOL",
  TranslatedLabel: {
    Hash: 3350369088,
    English: "Pistol",
    German: "Pistole",
    French: "Pistolet",
    Italian: "Pistola",
    Russian: "Пистолет",
    Polish: "Pistolet",
    Name: "WT_PIST",
    TraditionalChinese: "手槍",
    SimplifiedChinese: "手枪",
    Spanish: "Pistola",
    Japanese: "ピストル",
    Korean: "피스톨",
    Portuguese: "Pistola",
    Mexican: "Pistola",
  },
  Hash: 453432689,
  IntHash: 453432689,
  DlcName: "TitleUpdate",
  Category: "GROUP_PISTOL",
  ModelName: "W_PI_PISTOL",
  AmmoType: "AMMO_PISTOL",
  AmmoModelName: null,
  DefaultMaxAmmoSp: 250,
  SkillAbove50MaxAmmoSp: 1000,
  MaxSkillMaxAmmoSp: 9999,
  DefaultMaxAmmoMp: 250,
  SkillAbove50MaxAmmoMp: 1000,
  MaxSkillMaxAmmoMp: 9999,
  BonusMaxAmmoMp: 0,
  DamageType: "BULLET",
  TranslatedDescription: null,
  Tints: [
    {
      Index: 0,
      TranslatedLabel: {
        Hash: 3773086928,
        English: "Black tint",
        German: "Schwarzer Farbton",
        French: "Teinte noire",
        Italian: "Colorazione nera",
        Russian: "Черная расцветка",
        Polish: "Czarny kolor",
        Name: "WM_TINT0",
        TraditionalChinese: "黑色調",
        SimplifiedChinese: "黑色调",
        Spanish: "Tinte negro",
        Japanese: "ブラック",
        Korean: "검은색 계열",
        Portuguese: "Pintura preta",
        Mexican: "Entintado negro",
      },
    },
    {
      Index: 1,
      TranslatedLabel: {
        Hash: 3271590152,
        English: "Green tint",
        German: "Grüner Farbton",
        French: "Teinte verte",
        Italian: "Colorazione verde",
        Russian: "Зеленая расцветка",
        Polish: "Zielony kolor",
        Name: "WM_TINT1",
        TraditionalChinese: "綠色調",
        SimplifiedChinese: "绿色调",
        Spanish: "Tinte verde",
        Japanese: "グリーン",
        Korean: "녹색 계열",
        Portuguese: "Pintura verde",
        Mexican: "Entintado verde",
      },
    },
    {
      Index: 2,
      TranslatedLabel: {
        Hash: 2948160122,
        English: "Gold tint",
        German: "Goldfarbton",
        French: "Teinte or",
        Italian: "Colorazione oro",
        Russian: "Золотая расцветка",
        Polish: "Złoty kolor",
        Name: "WM_TINT2",
        TraditionalChinese: "金色調",
        SimplifiedChinese: "金色调",
        Spanish: "Tinte dorado",
        Japanese: "ゴールド",
        Korean: "금색 계열",
        Portuguese: "Pintura dourada",
        Mexican: "Entintado dorado",
      },
    },
    {
      Index: 3,
      TranslatedLabel: {
        Hash: 1643790077,
        English: "Pink tint",
        German: "Pinker Farbton",
        French: "Teinte rose",
        Italian: "Colorazione rosa",
        Russian: "Розовая расцветка",
        Polish: "Różowy kolor",
        Name: "WM_TINT3",
        TraditionalChinese: "粉紅色調",
        SimplifiedChinese: "粉色调",
        Spanish: "Tinte rosa",
        Japanese: "ピンク",
        Korean: "분홍색 계열",
        Portuguese: "Pintura rosa",
        Mexican: "Entintado rosa",
      },
    },
    {
      Index: 4,
      TranslatedLabel: {
        Hash: 2351731553,
        English: "Army tint",
        German: "Armeefarbton",
        French: "Teinte armée",
        Italian: "Colorazione militare",
        Russian: "Армейская расцветка",
        Polish: "Wojskowe barwy",
        Name: "WM_TINT4",
        TraditionalChinese: "軍用色調",
        SimplifiedChinese: "军用色调",
        Spanish: "Tinte militar",
        Japanese: "アーミー",
        Korean: "군대 계열",
        Portuguese: "Pintura militar",
        Mexican: "Entintado militar",
      },
    },
    {
      Index: 5,
      TranslatedLabel: {
        Hash: 2316504878,
        English: "LSPD tint",
        German: "LSPD-Farbton",
        French: "Teinte LSPD",
        Italian: "Colorazione LSPD",
        Russian: "Полицейская расцветка",
        Polish: "Policyjne barwy",
        Name: "WM_TINT5",
        TraditionalChinese: "洛聖都警局色調",
        SimplifiedChinese: "洛圣都警局色调",
        Spanish: "Tinte policial",
        Japanese: "LSPD",
        Korean: "LSPD 계열",
        Portuguese: "Pintura da Polícia de LS",
        Mexican: "Entintado LSPD",
      },
    },
    {
      Index: 6,
      TranslatedLabel: {
        Hash: 1747143503,
        English: "Orange tint",
        German: "Oranger Farbton",
        French: "Teinte orange",
        Italian: "Colorazione arancione",
        Russian: "Оранжевая расцветка",
        Polish: "Pomarańczowy kolor",
        Name: "WM_TINT6",
        TraditionalChinese: "橘色調",
        SimplifiedChinese: "橙色调",
        Spanish: "Tinte naranja",
        Japanese: "オレンジ",
        Korean: "주황색 계열",
        Portuguese: "Pintura laranja",
        Mexican: "Entintado naranja",
      },
    },
    {
      Index: 7,
      TranslatedLabel: {
        Hash: 442970072,
        English: "Platinum tint",
        German: "Platinfarbton",
        French: "Teinte platine",
        Italian: "Colorazione platino",
        Russian: "Платиновая расцветка",
        Polish: "Platynowy kolor",
        Name: "WM_TINT7",
        TraditionalChinese: "白金色調",
        SimplifiedChinese: "铂金色调",
        Spanish: "Tinte platino",
        Japanese: "プラチナ",
        Korean: "백금색 계열",
        Portuguese: "Pintura platinada",
        Mexican: "Entintado platino",
      },
    },
  ],
  IsVehicleWeapon: false,
  Flags: [
    "CarriedInHand",
    "Gun",
    "CanLockonOnFoot",
    "CanLockonInVehicle",
    "CanFreeAim",
    "AnimReload",
    "AnimCrouchFire",
    "UsableOnFoot",
    "UsableClimbing",
    "UsableInCover",
    "AllowCloseQuarterKills",
    "HasLowCoverReloads",
    "HasLowCoverSwaps",
    "QuitTransitionToIdleIntroOnWeaponChange",
    "DisableLeftHandIkWhenOnFoot",
    "TorsoIKForWeaponBlock",
    "UseFPSAimIK",
    "UseFPSSecondaryMotion",
  ],
  Components: [
    {
      Name: "COMPONENT_PISTOL_CLIP_01",
      IsDefault: true,
      TranslatedLabel: {
        Hash: 1458711463,
        English: "Default Clip",
        German: "Standardmagazin",
        French: "Chargeur par défaut",
        Italian: "Caricatore standard",
        Russian: "Стандартный магазин",
        Polish: "Standardowy magazynek",
        Name: "WCT_CLIP1",
        TraditionalChinese: "預設彈匣",
        SimplifiedChinese: "默认弹匣",
        Spanish: "Cargador predeterminado",
        Japanese: "標準マガジン",
        Korean: "기본 탄창",
        Portuguese: "Carregador padrão",
        Mexican: "Cargador predeterminado",
      },
      TranslatedDescription: {
        Hash: 347646630,
        English: "Standard capacity for Pistol.",
        German: "Standardkapazität für Pistole.",
        French: "Capacité standard pour pistolet.",
        Italian: "Capienza standard per la pistola.",
        Russian: "Стандартный боекомплект для пистолета.",
        Polish: "Standardowa pojemność pistoletu.",
        Name: "WCD_P_CLIP1",
        TraditionalChinese: "手槍的標準容量彈匣。",
        SimplifiedChinese: "手枪的标准容量弹匣。",
        Spanish: "Capacidad estándar para la pistola.",
        Japanese: "ピストル用の標準的な装弾数。",
        Korean: "피스톨의 기본 탄창 용량입니다.",
        Portuguese: "Capacidade padrão para a Pistola.",
        Mexican: "Capacidad estándar para la pistola.",
      },
      Hash: 4275109233,
      IntHash: -19858063,
      AttachBone: "WAPClip",
      Type: "CWeaponComponentClipInfo",
      Variants: [],
      DlcName: "TitleUpdate",
    },
    {
      Name: "COMPONENT_PISTOL_CLIP_02",
      IsDefault: false,
      TranslatedLabel: {
        Hash: 615958321,
        English: "Extended Clip",
        German: "Größeres Magazin",
        French: "Chargeur grande capacité",
        Italian: "Caricatore esteso",
        Russian: "Магазин большой емкости",
        Polish: "Powiększony magazynek",
        Name: "WCT_CLIP2",
        TraditionalChinese: "擴充彈匣",
        SimplifiedChinese: "扩充弹匣",
        Spanish: "Cargador ampliado",
        Japanese: "拡張マガジン",
        Korean: "확장탄창",
        Portuguese: "Carregador estendido",
        Mexican: "Cargador ampliado",
      },
      TranslatedDescription: {
        Hash: 645352995,
        English: "Extended capacity for Pistol.",
        German: "Größere Kapazität für Pistole.",
        French: "Grande capacité pour pistolet.",
        Italian: "Capienza aumentata per la pistola.",
        Russian: "Увеличенный боекомплект для пистолета.",
        Polish: "Zwiększona pojemność pistoletu.",
        Name: "WCD_P_CLIP2",
        TraditionalChinese: "手槍的擴充容量彈匣。",
        SimplifiedChinese: "手枪的扩充容量弹匣。",
        Spanish: "Capacidad ampliada para la pistola.",
        Japanese: "ピストル用の拡張された装弾数。",
        Korean: "피스톨의 확장탄창 용량입니다.",
        Portuguese: "Capacidade estendida para a Pistola.",
        Mexican: "Capacidad ampliada para la pistola.",
      },
      Hash: 3978713628,
      IntHash: -316253668,
      AttachBone: "WAPClip",
      Type: "CWeaponComponentClipInfo",
      Variants: [],
      DlcName: "TitleUpdate",
    },
    {
      Name: "COMPONENT_AT_PI_FLSH",
      IsDefault: false,
      TranslatedLabel: {
        Hash: 2633762459,
        English: "Flashlight",
        German: "Taktisches Licht",
        French: "Torche",
        Italian: "Torcia",
        Russian: "Фонарик",
        Polish: "Latarka",
        Name: "WCT_FLASH",
        TraditionalChinese: "手電筒",
        SimplifiedChinese: "手电筒",
        Spanish: "Linterna",
        Japanese: "フラッシュライト",
        Korean: "플래시",
        Portuguese: "Lanterna",
        Mexican: "Linterna",
      },
      TranslatedDescription: {
        Hash: 4187991109,
        English: "Aids low light target acquisition.",
        German: "Hilft bei der Zielerfassung bei schwachem Licht.",
        French: "Favorise l'acquisition des cibles dans l'obscurité.",
        Italian: "Aiuta nell'acquisizione di bersagli con poca luce.",
        Russian: "Облегчает прицеливание при слабой освещенности.",
        Polish: "Wspomaga wyszukiwanie celów w ciemności.",
        Name: "WCD_FLASH",
        TraditionalChinese: "協助使用者在低光源場合找到目標。",
        SimplifiedChinese: "帮助使用者在低光源情况下搜寻目标。",
        Spanish: "Facilita la localización del blanco con poca luz.",
        Japanese: "暗い場所でのターゲット捕捉に役立つ。",
        Korean: "어두운 곳에서의 목표 확인을 돕습니다.",
        Portuguese: "Auxilia na procura por alvos em pouca luminosidade.",
        Mexican: "Facilita la localización del blanco con poca luz.",
      },
      Hash: 899381934,
      IntHash: 899381934,
      AttachBone: "WAPFlshLasr",
      Type: "CWeaponComponentFlashLightInfo",
      Variants: [],
      DlcName: "TitleUpdate",
    },
    {
      Name: "COMPONENT_AT_PI_SUPP_02",
      IsDefault: false,
      TranslatedLabel: {
        Hash: 2231215523,
        English: "Suppressor",
        German: "Schalldämpfer",
        French: "Silencieux",
        Italian: "Silenziatore",
        Russian: "Глушитель",
        Polish: "Tłumik",
        Name: "WCT_SUPP",
        TraditionalChinese: "滅音器",
        SimplifiedChinese: "消音器",
        Spanish: "Silenciador",
        Japanese: "サプレッサー",
        Korean: "소음기",
        Portuguese: "Silenciador",
        Mexican: "Silenciador",
      },
      TranslatedDescription: {
        Hash: 1752268335,
        English: "Reduces noise and muzzle flash.",
        German: "Verringert Geräusch und Mündungsfeuer.",
        French: "Réduit le bruit et le flash lumineux.",
        Italian: "Riduce il rumore e la fiammata dell'arma.",
        Russian: "Гасит звук выстрела и дульную вспышку.",
        Polish: "Redukuje odgłos wystrzału i błysk.",
        Name: "WCD_PI_SUPP",
        TraditionalChinese: "降低槍聲以及槍口的火光。",
        SimplifiedChinese: "减轻枪声和枪口火光。",
        Spanish: "Reduce el ruido y los fogonazos.",
        Japanese: "発射音とマズルフラッシュを低減。",
        Korean: "격발 시의 소음과 총구의 불빛을 줄입니다.",
        Portuguese: "Reduz barulho e expansão de gases.",
        Mexican: "Reduce el ruido y los fogonazos.",
      },
      Hash: 1709866683,
      IntHash: 1709866683,
      AttachBone: "WAPSupp",
      Type: "CWeaponComponentSuppressorInfo",
      Variants: [],
      DlcName: "TitleUpdate",
    },
    {
      Name: "COMPONENT_PISTOL_VARMOD_LUXE",
      IsDefault: false,
      TranslatedLabel: {
        Hash: 75734003,
        English: "Yusuf Amir Luxury Finish",
        German: "Luxusoberfläche Yusuf Amir",
        French: "Finition luxe Yusuf Amir",
        Italian: "Finiture Yusuf Amir",
        Russian: '"Юсуф Амир"',
        Polish: "Luks. zdobienie Yusufa Amira",
        Name: "WCT_VAR_GOLD",
        TraditionalChinese: "尤瑟夫．阿米爾富豪塗裝",
        SimplifiedChinese: "尤素福·阿米尔奢华涂饰",
        Spanish: "Lujo de Yusuf Amir",
        Japanese: "ユスフ・アミール高級仕上げ",
        Korean: "유서프 아미르 럭셔리 피니시",
        Portuguese: "Toque luxo de Yusuf Amir",
        Mexican: "Acabado de lujo de Yusuf Amir",
      },
      TranslatedDescription: {
        Hash: 2943837733,
        English: "Item available to purchase.",
        German: "Gegenstand steht zum Verkauf.",
        French: "Objet disponible à l'achat.",
        Italian: "Oggetto disponibile per l'acquisto.",
        Russian: "Отделка доступна для покупки.",
        Polish: "Przedmiot dostępny do kupienia.",
        Name: "WCD_VAR_P",
        TraditionalChinese: "物品已開放可供購買。",
        SimplifiedChinese: "物品可供购买。",
        Spanish: "Elemento disponible para comprar.",
        Japanese: "購入可能アイテム。",
        Korean: "아이템 구입 가능",
        Portuguese: "Item disponível para compra.",
        Mexican: "Elemento disponible para comprar.",
      },
      Hash: 3610841222,
      IntHash: -684126074,
      AttachBone: "gun_root",
      Type: "CWeaponComponentVariantModelInfo",
      Variants: [
        {
          Index: 0,
          Name: "COMPONENT_PISTOL_CLIP_01",
        },
        {
          Index: 1,
          Name: "COMPONENT_PISTOL_CLIP_02",
        },
        {
          Index: 2,
          Name: "COMPONENT_AT_PI_FLSH",
        },
        {
          Index: 3,
          Name: "COMPONENT_AT_PI_SUPP_02",
        },
      ],
      DlcName: "TitleUpdate",
    },
    {
      Name: "COMPONENT_GUNRUN_MK2_UPGRADE",
      IsDefault: false,
      TranslatedLabel: {
        Hash: 3077727755,
        English: "Mk II",
        German: "Mk II",
        French: "MkµII",
        Italian: "Mk II",
        Russian: "Mk II",
        Polish: "Wersja 2",
        Name: "WCT_VAR_GUN",
        TraditionalChinese: "MkµII",
        SimplifiedChinese: "Mkµ2",
        Spanish: "Mk II",
        Japanese: "Mk2",
        Korean: "Mk II",
        Portuguese: "Mk II",
        Mexican: "Mk II",
      },
      TranslatedDescription: {
        Hash: 0,
        English: null,
        German: null,
        French: null,
        Italian: null,
        Russian: null,
        Polish: null,
        Name: "WCD_VAR_GUN",
        TraditionalChinese: null,
        SimplifiedChinese: null,
        Spanish: null,
        Japanese: null,
        Korean: null,
        Portuguese: null,
        Mexican: null,
      },
      Hash: 1623028892,
      IntHash: 1623028892,
      AttachBone: "gun_gripr",
      Type: "CWeaponComponentInfo",
      Variants: [],
      DlcName: "TitleUpdate",
    },
  ],
  Liveries: [],
});

function toPascalCase(str: string, isMale: boolean): string {
  const result = (isMale ? 'Male' : 'Female') + str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '');

  if (/^\d/.test(result)) {
    return '_' + result;
  }

  return result;
}

interface ComponentVariation {
  NameHash: string;
  ComponentType: string;
  ComponentId: number;
  RelativeCollectionDrawableId: number;
  DrawableId: number;
  TextureId: number;
  TranslatedLabel: {
    English: string;
    Name: string;
  } | null;
  Price: number;
  RestrictionTags: string[] | null;
  FittingTorso: string[] | null;
  FittingGloves: string[] | null;
}

interface Prop {
  NameHash: string;
  AnchorPoint: string;
  ComponentId: number;
  DrawableId: number;
  RelativeCollectionDrawableId: number;
  TextureId: number;
  TranslatedLabel: {
    English: string;
    Name: string;
  } | null;
  Price: number;
  RestrictionTags: string[] | null;
}

interface PedVariation {
  LastUpdateDlcName: string;
  DlcCollectionName: string;
  PedName: string;
  ComponentVariations: ComponentVariation[];
  Props: Prop[] | null;
}
