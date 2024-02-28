import { Item, ItemKey } from "../../types";
import { registerItem, registerItems } from "../../items-registry";
import { makeKeys } from "../../../../utility/make-keys";

export const WeaponComponent = makeKeys<WeaponComponentItemKey>()({
  COMBATSHOTGUN_FLASH: "combatshotgunflash",
  COMBATSHOTGUN_SUPP: "combatshotgunsupp",
  COMBATSHOTGUN_SHELL: "combatshotgunshell",
  SNIPERRIFLE_SUPP: "sniperriflesupp",
  SNIPERRIFLE_SCOPE_MAX: "sniperriflescopemax",
  SNIPERRIFLE_SCOPE_LRG: "sniperriflescopelrg",
  VINTAGEPISTOL_CLIP2: "vintagepistolclip2",
  VINTAGEPISTOL_CLIP1: "vintagepistolclip1",
  VINTAGEPISTOL_SUPP: "vintagepistolsupp",
  COMBATPDW_GRIP: "combatpdwgrip",
  COMBATPDW_CLIP2: "combatpdwclip2",
  COMBATPDW_CLIP1: "combatpdwclip1",
  COMBATPDW_CLIP_DRM: "combatpdwclipdrm",
  COMBATPDW_FLASH: "combatpdwflash",
  COMBATPDW_SCOPE_SML: "combatpdwscopesml",
  HEAVYSNIPER_MK2_CLIP_INC: "heavysnipermk2clipinc",
  HEAVYSNIPER_MK2_BARR2: "heavysnipermk2barr2",
  HEAVYSNIPER_MK2_CLIP2: "heavysnipermk2clip2",
  HEAVYSNIPER_MK2_SCOPE_TH: "heavysnipermk2scopeth",
  HEAVYSNIPER_MK2_CLIP_FMJ: "heavysnipermk2clipfmj",
  HEAVYSNIPER_MK2_MUZZ8: "heavysnipermk2muzz8",
  HEAVYSNIPER_MK2_MUZZ9: "heavysnipermk2muzz9",
  HEAVYSNIPER_MK2_SCOPE_LRG2: "heavysnipermk2scopelrg2",
  HEAVYSNIPER_MK2_CLIP_EX: "heavysnipermk2clipex",
  HEAVYSNIPER_MK2_BARR: "heavysnipermk2barr",
  HEAVYSNIPER_MK2_SUPP: "heavysnipermk2supp",
  HEAVYSNIPER_MK2_SCOPE_NV: "heavysnipermk2scopenv",
  HEAVYSNIPER_MK2_SCOPE_MAX: "heavysnipermk2scopemax",
  HEAVYSNIPER_MK2_CLIP_AP: "heavysnipermk2clipap",
  HEAVYSNIPER_MK2_CLIP1: "heavysnipermk2clip1",
  HEAVYSNIPER_SCOPE_MAX: "heavysniperscopemax",
  HEAVYSNIPER_SCOPE_LRG: "heavysniperscopelrg",
  MICROSMG_CLIP2: "microsmgclip2",
  MICROSMG_FLASH: "microsmgflash",
  MICROSMG_SCOPE_MAC: "microsmgscopemac",
  MICROSMG_SUPP: "microsmgsupp",
  MICROSMG_CLIP1: "microsmgclip1",
  PISTOL_FLASH: "pistolflash",
  PISTOL_SUPP: "pistolsupp",
  PISTOL_CLIP2: "pistolclip2",
  PISTOL_CLIP1: "pistolclip1",
  PISTOLXM3_CLIP1: "pistolxm3clip1",
  PISTOLXM3_SUPP: "pistolxm3supp",
  PUMPSHOTGUN_FLASH: "pumpshotgunflash",
  PUMPSHOTGUN_SUPP: "pumpshotgunsupp",
  APPISTOL_CLIP2: "appistolclip2",
  APPISTOL_CLIP1: "appistolclip1",
  APPISTOL_FLASH: "appistolflash",
  APPISTOL_SUPP: "appistolsupp",
  CERAMICPISTOL_CLIP1: "ceramicpistolclip1",
  CERAMICPISTOL_CLIP2: "ceramicpistolclip2",
  CERAMICPISTOL_SUPP: "ceramicpistolsupp",
  SMG_CLIP1: "smgclip1",
  SMG_CLIP2: "smgclip2",
  SMG_SCOPE_MAC: "smgscopemac",
  SMG_CLIP_DRM: "smgclipdrm",
  SMG_FLASH: "smgflash",
  SMG_SUPP: "smgsupp",
  ASSAULTRIFLE_MK2_MUZZ5: "assaultriflemk2muzz5",
  ASSAULTRIFLE_MK2_SCOPE_MAC2: "assaultriflemk2scopemac2",
  ASSAULTRIFLE_MK2_MUZZ6: "assaultriflemk2muzz6",
  ASSAULTRIFLE_MK2_HOLO: "assaultriflemk2holo",
  ASSAULTRIFLE_MK2_BARR: "assaultriflemk2barr",
  ASSAULTRIFLE_MK2_MUZZ7: "assaultriflemk2muzz7",
  ASSAULTRIFLE_MK2_BARR2: "assaultriflemk2barr2",
  ASSAULTRIFLE_MK2_CLIP_FMJ: "assaultriflemk2clipfmj",
  ASSAULTRIFLE_MK2_FLASH: "assaultriflemk2flash",
  ASSAULTRIFLE_MK2_CLIP1: "assaultriflemk2clip1",
  ASSAULTRIFLE_MK2_GRIP: "assaultriflemk2grip",
  ASSAULTRIFLE_MK2_SUPP: "assaultriflemk2supp",
  ASSAULTRIFLE_MK2_CLIP_AP: "assaultriflemk2clipap",
  ASSAULTRIFLE_MK2_MUZZ1: "assaultriflemk2muzz1",
  ASSAULTRIFLE_MK2_SCOPE_MED2: "assaultriflemk2scopemed2",
  ASSAULTRIFLE_MK2_MUZZ2: "assaultriflemk2muzz2",
  ASSAULTRIFLE_MK2_CLIP2: "assaultriflemk2clip2",
  ASSAULTRIFLE_MK2_MUZZ3: "assaultriflemk2muzz3",
  ASSAULTRIFLE_MK2_MUZZ4: "assaultriflemk2muzz4",
  ASSAULTRIFLE_MK2_CLIP_TR: "assaultriflemk2cliptr",
  ASSAULTRIFLE_MK2_CLIP_INC: "assaultriflemk2clipinc",
  HEAVYSHOTGUN_GRIP: "heavyshotgungrip",
  HEAVYSHOTGUN_CLIP1: "heavyshotgunclip1",
  HEAVYSHOTGUN_FLASH: "heavyshotgunflash",
  HEAVYSHOTGUN_CLIP_DRM: "heavyshotgunclipdrm",
  HEAVYSHOTGUN_CLIP2: "heavyshotgunclip2",
  HEAVYSHOTGUN_SUPP: "heavyshotgunsupp",
  GRENADELAUNCHER_SMOKE_GRIP: "grenadelaunchersmokegrip",
  GRENADELAUNCHER_SMOKE_FLASH: "grenadelaunchersmokeflash",
  GRENADELAUNCHER_SMOKE_SCOPE_SML: "grenadelaunchersmokescopesml",
  PUMPSHOTGUN_MK2_SCOPE_MAC2: "pumpshotgunmk2scopemac2",
  PUMPSHOTGUN_MK2_SHELL_EX: "pumpshotgunmk2shellex",
  PUMPSHOTGUN_MK2_SCOPE_SML2: "pumpshotgunmk2scopesml2",
  PUMPSHOTGUN_MK2_HOLO: "pumpshotgunmk2holo",
  PUMPSHOTGUN_MK2_SHELL_AP: "pumpshotgunmk2shellap",
  PUMPSHOTGUN_MK2_MUZZ8: "pumpshotgunmk2muzz8",
  PUMPSHOTGUN_MK2_FLASH: "pumpshotgunmk2flash",
  PUMPSHOTGUN_MK2_SHELL_INC: "pumpshotgunmk2shellinc",
  PUMPSHOTGUN_MK2_SUPP: "pumpshotgunmk2supp",
  PUMPSHOTGUN_MK2_SHELL: "pumpshotgunmk2shell",
  PUMPSHOTGUN_MK2_SHELL_HP: "pumpshotgunmk2shellhp",
  COMBATPISTOL_CLIP1: "combatpistolclip1",
  COMBATPISTOL_FLASH: "combatpistolflash",
  COMBATPISTOL_SUPP: "combatpistolsupp",
  COMBATPISTOL_CLIP2: "combatpistolclip2",
  GUSENBERG_CLIP1: "gusenbergclip1",
  GUSENBERG_CLIP2: "gusenbergclip2",
  COMPACTRIFLE_CLIP1: "compactrifleclip1",
  COMPACTRIFLE_CLIP2: "compactrifleclip2",
  COMPACTRIFLE_CLIP_DRM: "compactrifleclipdrm",
  MARKSMANRIFLE_MK2_MUZZ5: "marksmanriflemk2muzz5",
  MARKSMANRIFLE_MK2_MUZZ6: "marksmanriflemk2muzz6",
  MARKSMANRIFLE_MK2_BARR: "marksmanriflemk2barr",
  MARKSMANRIFLE_MK2_HOLO: "marksmanriflemk2holo",
  MARKSMANRIFLE_MK2_MUZZ7: "marksmanriflemk2muzz7",
  MARKSMANRIFLE_MK2_SCOPE_LRG2: "marksmanriflemk2scopelrg2",
  MARKSMANRIFLE_MK2_BARR2: "marksmanriflemk2barr2",
  MARKSMANRIFLE_MK2_CLIP_INC: "marksmanriflemk2clipinc",
  MARKSMANRIFLE_MK2_FLASH: "marksmanriflemk2flash",
  MARKSMANRIFLE_MK2_SUPP: "marksmanriflemk2supp",
  MARKSMANRIFLE_MK2_CLIP1: "marksmanriflemk2clip1",
  MARKSMANRIFLE_MK2_GRIP: "marksmanriflemk2grip",
  MARKSMANRIFLE_MK2_MUZZ1: "marksmanriflemk2muzz1",
  MARKSMANRIFLE_MK2_SCOPE_MED2: "marksmanriflemk2scopemed2",
  MARKSMANRIFLE_MK2_MUZZ2: "marksmanriflemk2muzz2",
  MARKSMANRIFLE_MK2_CLIP_TR: "marksmanriflemk2cliptr",
  MARKSMANRIFLE_MK2_MUZZ3: "marksmanriflemk2muzz3",
  MARKSMANRIFLE_MK2_CLIP_FMJ: "marksmanriflemk2clipfmj",
  MARKSMANRIFLE_MK2_CLIP2: "marksmanriflemk2clip2",
  MARKSMANRIFLE_MK2_MUZZ4: "marksmanriflemk2muzz4",
  MARKSMANRIFLE_MK2_CLIP_AP: "marksmanriflemk2clipap",
  RAILGUN_CLIP1: "railgunclip1",
  PRECISIONRIFLE_CLIP1: "precisionrifleclip1",
  SMG_MK2_MUZZ5: "smgmk2muzz5",
  SMG_MK2_CLIP_FMJ: "smgmk2clipfmj",
  SMG_MK2_MUZZ6: "smgmk2muzz6",
  SMG_MK2_CLIP_HP: "smgmk2cliphp",
  SMG_MK2_SCOPE_SML2: "smgmk2scopesml2",
  SMG_MK2_CLIP1: "smgmk2clip1",
  SMG_MK2_MUZZ7: "smgmk2muzz7",
  SMG_MK2_FLASH: "smgmk2flash",
  SMG_MK2_CLIP_TR: "smgmk2cliptr",
  SMG_MK2_HOLO: "smgmk2holo",
  SMG_MK2_BARR2: "smgmk2barr2",
  SMG_MK2_CLIP2: "smgmk2clip2",
  SMG_MK2_MUZZ1: "smgmk2muzz1",
  SMG_MK2_SUPP: "smgmk2supp",
  SMG_MK2_MUZZ2: "smgmk2muzz2",
  SMG_MK2_BARR: "smgmk2barr",
  SMG_MK2_CLIP_INC: "smgmk2clipinc",
  SMG_MK2_MUZZ3: "smgmk2muzz3",
  SMG_MK2_SCOPE_MAC2: "smgmk2scopemac2",
  SMG_MK2_MUZZ4: "smgmk2muzz4",
  BULLPUPRIFLE_GRIP: "bullpupriflegrip",
  BULLPUPRIFLE_FLASH: "bullpuprifleflash",
  BULLPUPRIFLE_SUPP: "bullpupriflesupp",
  BULLPUPRIFLE_SCOPE_SML: "bullpupriflescopesml",
  BULLPUPRIFLE_CLIP2: "bullpuprifleclip2",
  BULLPUPRIFLE_CLIP1: "bullpuprifleclip1",
  FIREWORK_CLIP1: "fireworkclip1",
  COMBATMG_GRIP: "combatmggrip",
  COMBATMG_SCOPE_LRG: "combatmgscopelrg",
  COMBATMG_CLIP2: "combatmgclip2",
  COMBATMG_CLIP1: "combatmgclip1",
  CARBINERIFLE_GRIP: "carbineriflegrip",
  CARBINERIFLE_FLASH: "carbinerifleflash",
  CARBINERIFLE_SUPP: "carbineriflesupp",
  CARBINERIFLE_CLIP2: "carbinerifleclip2",
  CARBINERIFLE_CLIP1: "carbinerifleclip1",
  CARBINERIFLE_SCOPE_LRG: "carbineriflescopelrg",
  CARBINERIFLE_CLIP_BOX: "carbinerifleclipbox",
  BULLPUPRIFLE_MK2_CLIP1: "bullpupriflemk2clip1",
  BULLPUPRIFLE_MK2_MUZZ5: "bullpupriflemk2muzz5",
  BULLPUPRIFLE_MK2_MUZZ6: "bullpupriflemk2muzz6",
  BULLPUPRIFLE_MK2_BARR2: "bullpupriflemk2barr2",
  BULLPUPRIFLE_MK2_SCOPE_SML2: "bullpupriflemk2scopesml2",
  BULLPUPRIFLE_MK2_HOLO: "bullpupriflemk2holo",
  BULLPUPRIFLE_MK2_CLIP_FMJ: "bullpupriflemk2clipfmj",
  BULLPUPRIFLE_MK2_MUZZ7: "bullpupriflemk2muzz7",
  BULLPUPRIFLE_MK2_BARR: "bullpupriflemk2barr",
  BULLPUPRIFLE_MK2_FLASH: "bullpupriflemk2flash",
  BULLPUPRIFLE_MK2_CLIP_TR: "bullpupriflemk2cliptr",
  BULLPUPRIFLE_MK2_SUPP: "bullpupriflemk2supp",
  BULLPUPRIFLE_MK2_GRIP: "bullpupriflemk2grip",
  BULLPUPRIFLE_MK2_CLIP_INC: "bullpupriflemk2clipinc",
  BULLPUPRIFLE_MK2_MUZZ1: "bullpupriflemk2muzz1",
  BULLPUPRIFLE_MK2_SCOPE_MAC2: "bullpupriflemk2scopemac2",
  BULLPUPRIFLE_MK2_MUZZ2: "bullpupriflemk2muzz2",
  BULLPUPRIFLE_MK2_MUZZ3: "bullpupriflemk2muzz3",
  BULLPUPRIFLE_MK2_MUZZ4: "bullpupriflemk2muzz4",
  BULLPUPRIFLE_MK2_CLIP2: "bullpupriflemk2clip2",
  BULLPUPRIFLE_MK2_CLIP_AP: "bullpupriflemk2clipap",
  SNSPISTOL_MK2_CLIP1: "snspistolmk2clip1",
  SNSPISTOL_MK2_SCOPE_PI: "snspistolmk2scopepi",
  SNSPISTOL_MK2_FLASH: "snspistolmk2flash",
  SNSPISTOL_MK2_SUPP: "snspistolmk2supp",
  SNSPISTOL_MK2_CLIP_HP: "snspistolmk2cliphp",
  SNSPISTOL_MK2_CLIP_TR: "snspistolmk2cliptr",
  SNSPISTOL_MK2_COMP: "snspistolmk2comp",
  SNSPISTOL_MK2_CLIP_FMJ: "snspistolmk2clipfmj",
  SNSPISTOL_MK2_CLIP2: "snspistolmk2clip2",
  SNSPISTOL_MK2_CLIP_INC: "snspistolmk2clipinc",
  FLASHLIGHT_FLASH: "flashlightflash",
  SPECIALCARBINE_MK2_MUZZ5: "specialcarbinemk2muzz5",
  SPECIALCARBINE_MK2_SCOPE_MAC2: "specialcarbinemk2scopemac2",
  SPECIALCARBINE_MK2_CLIP1: "specialcarbinemk2clip1",
  SPECIALCARBINE_MK2_MUZZ6: "specialcarbinemk2muzz6",
  SPECIALCARBINE_MK2_HOLO: "specialcarbinemk2holo",
  SPECIALCARBINE_MK2_MUZZ7: "specialcarbinemk2muzz7",
  SPECIALCARBINE_MK2_CLIP_FMJ: "specialcarbinemk2clipfmj",
  SPECIALCARBINE_MK2_CLIP_AP: "specialcarbinemk2clipap",
  SPECIALCARBINE_MK2_FLASH: "specialcarbinemk2flash",
  SPECIALCARBINE_MK2_CLIP_TR: "specialcarbinemk2cliptr",
  SPECIALCARBINE_MK2_GRIP: "specialcarbinemk2grip",
  SPECIALCARBINE_MK2_SUPP: "specialcarbinemk2supp",
  SPECIALCARBINE_MK2_MUZZ1: "specialcarbinemk2muzz1",
  SPECIALCARBINE_MK2_SCOPE_MED2: "specialcarbinemk2scopemed2",
  SPECIALCARBINE_MK2_MUZZ2: "specialcarbinemk2muzz2",
  SPECIALCARBINE_MK2_CLIP_INC: "specialcarbinemk2clipinc",
  SPECIALCARBINE_MK2_MUZZ3: "specialcarbinemk2muzz3",
  SPECIALCARBINE_MK2_CLIP2: "specialcarbinemk2clip2",
  SPECIALCARBINE_MK2_BARR: "specialcarbinemk2barr",
  SPECIALCARBINE_MK2_MUZZ4: "specialcarbinemk2muzz4",
  SPECIALCARBINE_MK2_BARR2: "specialcarbinemk2barr2",
  DOUBLEACTION_CLIP1: "doubleactionclip1",
  PISTOL50_CLIP1: "pistol50clip1",
  PISTOL50_FLASH: "pistol50flash",
  PISTOL50_SUPP: "pistol50supp",
  PISTOL50_CLIP2: "pistol50clip2",
  MG_SCOPE_SML: "mgscopesml",
  MG_CLIP2: "mgclip2",
  MG_CLIP1: "mgclip1",
  MILITARYRIFLE_CLIP1: "militaryrifleclip1",
  MILITARYRIFLE_CLIP2: "militaryrifleclip2",
  MILITARYRIFLE_MRFL_SIGHT: "militaryriflemrflsight",
  MILITARYRIFLE_FLASH: "militaryrifleflash",
  MILITARYRIFLE_SUPP: "militaryriflesupp",
  MILITARYRIFLE_SCOPE_SML: "militaryriflescopesml",
  BULLPUPSHOTGUN_GRIP: "bullpupshotgungrip",
  BULLPUPSHOTGUN_FLASH: "bullpupshotgunflash",
  BULLPUPSHOTGUN_SUPP: "bullpupshotgunsupp",
  GRENADELAUNCHER_GRIP: "grenadelaunchergrip",
  GRENADELAUNCHER_FLASH: "grenadelauncherflash",
  GRENADELAUNCHER_SCOPE_SML: "grenadelauncherscopesml",
  MUSKET_CLIP1: "musketclip1",
  ADVANCEDRIFLE_FLASH: "advancedrifleflash",
  ADVANCEDRIFLE_SUPP: "advancedriflesupp",
  ADVANCEDRIFLE_CLIP2: "advancedrifleclip2",
  ADVANCEDRIFLE_SCOPE_SML: "advancedriflescopesml",
  ADVANCEDRIFLE_CLIP1: "advancedrifleclip1",
  RAYPISTOL_VAR_RAY18: "raypistolvarray18",
  MINISMG_CLIP1: "minismgclip1",
  MINISMG_CLIP2: "minismgclip2",
  SNSPISTOL_CLIP2: "snspistolclip2",
  SNSPISTOL_CLIP1: "snspistolclip1",
  PISTOL_MK2_COMP: "pistolmk2comp",
  PISTOL_MK2_CLIP_TR: "pistolmk2cliptr",
  PISTOL_MK2_CLIP_INC: "pistolmk2clipinc",
  PISTOL_MK2_FLASH: "pistolmk2flash",
  PISTOL_MK2_CLIP_FMJ: "pistolmk2clipfmj",
  PISTOL_MK2_CLIP2: "pistolmk2clip2",
  PISTOL_MK2_SUPP: "pistolmk2supp",
  PISTOL_MK2_CLIP_HP: "pistolmk2cliphp",
  PISTOL_MK2_SCOPE_PI: "pistolmk2scopepi",
  PISTOL_MK2_CLIP1: "pistolmk2clip1",
  ASSAULTRIFLE_GRIP: "assaultriflegrip",
  ASSAULTRIFLE_FLASH: "assaultrifleflash",
  ASSAULTRIFLE_SCOPE_MAC: "assaultriflescopemac",
  ASSAULTRIFLE_SUPP: "assaultriflesupp",
  ASSAULTRIFLE_CLIP2: "assaultrifleclip2",
  ASSAULTRIFLE_CLIP1: "assaultrifleclip1",
  ASSAULTRIFLE_CLIP_DRM: "assaultrifleclipdrm",
  SPECIALCARBINE_GRIP: "specialcarbinegrip",
  SPECIALCARBINE_CLIP_DRM: "specialcarbineclipdrm",
  SPECIALCARBINE_FLASH: "specialcarbineflash",
  SPECIALCARBINE_CLIP2: "specialcarbineclip2",
  SPECIALCARBINE_SCOPE_LRG: "specialcarbinescopelrg",
  SPECIALCARBINE_SUPP: "specialcarbinesupp",
  SPECIALCARBINE_CLIP1: "specialcarbineclip1",
  MARKSMANRIFLE_GRIP: "marksmanriflegrip",
  MARKSMANRIFLE_SCOPE_LRG: "marksmanriflescopelrg",
  MARKSMANRIFLE_FLASH: "marksmanrifleflash",
  MARKSMANRIFLE_SUPP: "marksmanriflesupp",
  MARKSMANRIFLE_CLIP2: "marksmanrifleclip2",
  MARKSMANRIFLE_CLIP1: "marksmanrifleclip1",
  HEAVYRIFLE_GRIP: "heavyriflegrip",
  HEAVYRIFLE_CLIP1: "heavyrifleclip1",
  HEAVYRIFLE_CLIP2: "heavyrifleclip2",
  HEAVYRIFLE_FLASH: "heavyrifleflash",
  HEAVYRIFLE_SUPP: "heavyriflesupp",
  HEAVYRIFLE_SCOPE_LRG: "heavyriflescopelrg",
  HEAVYRIFLE_HVYRFLE_SIG: "heavyriflehvyrflesig",
  REVOLVER_MK2_CLIP_INC: "revolvermk2clipinc",
  REVOLVER_MK2_SCOPE_MAC2: "revolvermk2scopemac2",
  REVOLVER_MK2_CLIP_FMJ: "revolvermk2clipfmj",
  REVOLVER_MK2_CLIP_HP: "revolvermk2cliphp",
  REVOLVER_MK2_COMP: "revolvermk2comp",
  REVOLVER_MK2_FLASH: "revolvermk2flash",
  REVOLVER_MK2_HOLO: "revolvermk2holo",
  REVOLVER_MK2_CLIP1_RV: "revolvermk2clip1rv",
  REVOLVER_MK2_CLIP_TR: "revolvermk2cliptr",
  TACTICALRIFLE_GRIP: "tacticalriflegrip",
  TACTICALRIFLE_CLIP1: "tacticalrifleclip1",
  TACTICALRIFLE_CLIP2: "tacticalrifleclip2",
  TACTICALRIFLE_FLASH: "tacticalrifleflash",
  TACTICALRIFLE_SUPP: "tacticalriflesupp",
  HEAVYPISTOL_CLIP1: "heavypistolclip1",
  HEAVYPISTOL_FLASH: "heavypistolflash",
  HEAVYPISTOL_CLIP2: "heavypistolclip2",
  HEAVYPISTOL_SUPP: "heavypistolsupp",
  MACHINEPISTOL_CLIP1: "machinepistolclip1",
  MACHINEPISTOL_CLIP_DRM: "machinepistolclipdrm",
  MACHINEPISTOL_CLIP2: "machinepistolclip2",
  MACHINEPISTOL_SUPP: "machinepistolsupp",
  COMBATMG_MK2_MUZZ5: "combatmgmk2muzz5",
  COMBATMG_MK2_CLIP2: "combatmgmk2clip2",
  COMBATMG_MK2_CLIP_AP: "combatmgmk2clipap",
  COMBATMG_MK2_MUZZ6: "combatmgmk2muzz6",
  COMBATMG_MK2_SCOPE_SML2: "combatmgmk2scopesml2",
  COMBATMG_MK2_HOLO: "combatmgmk2holo",
  COMBATMG_MK2_CLIP1: "combatmgmk2clip1",
  COMBATMG_MK2_MUZZ7: "combatmgmk2muzz7",
  COMBATMG_MK2_CLIP_FMJ: "combatmgmk2clipfmj",
  COMBATMG_MK2_GRIP: "combatmgmk2grip",
  COMBATMG_MK2_BARR2: "combatmgmk2barr2",
  COMBATMG_MK2_MUZZ1: "combatmgmk2muzz1",
  COMBATMG_MK2_CLIP_INC: "combatmgmk2clipinc",
  COMBATMG_MK2_BARR: "combatmgmk2barr",
  COMBATMG_MK2_SCOPE_MED2: "combatmgmk2scopemed2",
  COMBATMG_MK2_MUZZ2: "combatmgmk2muzz2",
  COMBATMG_MK2_MUZZ3: "combatmgmk2muzz3",
  COMBATMG_MK2_MUZZ4: "combatmgmk2muzz4",
  COMBATMG_MK2_CLIP_TR: "combatmgmk2cliptr",
  ASSAULTSHOTGUN_GRIP: "assaultshotgungrip",
  ASSAULTSHOTGUN_FLASH: "assaultshotgunflash",
  ASSAULTSHOTGUN_SUPP: "assaultshotgunsupp",
  ASSAULTSHOTGUN_CLIP2: "assaultshotgunclip2",
  ASSAULTSHOTGUN_CLIP1: "assaultshotgunclip1",
  ASSAULTSMG_FLASH: "assaultsmgflash",
  ASSAULTSMG_SCOPE_MAC: "assaultsmgscopemac",
  ASSAULTSMG_SUPP: "assaultsmgsupp",
  CARBINERIFLE_MK2_MUZZ5: "carbineriflemk2muzz5",
  CARBINERIFLE_MK2_SCOPE_MAC2: "carbineriflemk2scopemac2",
  CARBINERIFLE_MK2_CLIP_TR: "carbineriflemk2cliptr",
  CARBINERIFLE_MK2_CLIP_AP: "carbineriflemk2clipap",
  CARBINERIFLE_MK2_MUZZ6: "carbineriflemk2muzz6",
  CARBINERIFLE_MK2_CLIP_INC: "carbineriflemk2clipinc",
  CARBINERIFLE_MK2_HOLO: "carbineriflemk2holo",
  CARBINERIFLE_MK2_CLIP_FMJ: "carbineriflemk2clipfmj",
  CARBINERIFLE_MK2_CLIP1: "carbineriflemk2clip1",
  CARBINERIFLE_MK2_MUZZ7: "carbineriflemk2muzz7",
  CARBINERIFLE_MK2_CLIP2: "carbineriflemk2clip2",
  CARBINERIFLE_MK2_FLASH: "carbineriflemk2flash",
  CARBINERIFLE_MK2_BARR: "carbineriflemk2barr",
  CARBINERIFLE_MK2_SUPP: "carbineriflemk2supp",
  CARBINERIFLE_MK2_BARR2: "carbineriflemk2barr2",
  CARBINERIFLE_MK2_GRIP: "carbineriflemk2grip",
  CARBINERIFLE_MK2_MUZZ1: "carbineriflemk2muzz1",
  CARBINERIFLE_MK2_SCOPE_MED2: "carbineriflemk2scopemed2",
  CARBINERIFLE_MK2_MUZZ2: "carbineriflemk2muzz2",
  CARBINERIFLE_MK2_MUZZ3: "carbineriflemk2muzz3",
  CARBINERIFLE_MK2_MUZZ4: "carbineriflemk2muzz4",
  RAILGUNXM3_CLIP1: "railgunxm3clip1",
});

export type WeaponComponentItemKey = Brand<string, "WeaponComponentItemKey">;

export type WeaponComponentItem = {
  key: WeaponComponentItemKey;
  amount: number;
};

export type WeaponComponentItemInfo = {
  key: WeaponComponentItemKey;
  componentHash: number;
  weaponHash: number;
  name: string;
  description: string;
};

export const weaponComponent = registerItems<WeaponComponentItemInfo>([
  {
    "key": WeaponComponent.COMBATSHOTGUN_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 94989220,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.COMBATSHOTGUN_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 94989220,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.COMBATSHOTGUN_SHELL,
    "componentHash": 3323278933,
    "weaponHash": 94989220,
    "name": "Default Shells",
    "description": "Standard shotgun ammunition."
  },
  {
    "key": WeaponComponent.SNIPERRIFLE_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 100416529,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.SNIPERRIFLE_SCOPE_MAX,
    "componentHash": 3159677559,
    "weaponHash": 100416529,
    "name": "Advanced Scope",
    "description": "Maximum zoom functionality."
  },
  {
    "key": WeaponComponent.SNIPERRIFLE_SCOPE_LRG,
    "componentHash": 3527687644,
    "weaponHash": 100416529,
    "name": "Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.VINTAGEPISTOL_CLIP2,
    "componentHash": 867832552,
    "weaponHash": 137902532,
    "name": "Extended Clip",
    "description": "Extended capacity for Vintage Pistol."
  },
  {
    "key": WeaponComponent.VINTAGEPISTOL_CLIP1,
    "componentHash": 1168357051,
    "weaponHash": 137902532,
    "name": "Default Clip",
    "description": "Standard capacity for Vintage Pistol."
  },
  {
    "key": WeaponComponent.VINTAGEPISTOL_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 137902532,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.COMBATPDW_GRIP,
    "componentHash": 202788691,
    "weaponHash": 171789620,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.COMBATPDW_CLIP2,
    "componentHash": 860508675,
    "weaponHash": 171789620,
    "name": "Extended Clip",
    "description": "Extended capacity for Combat PDW."
  },
  {
    "key": WeaponComponent.COMBATPDW_CLIP1,
    "componentHash": 1125642654,
    "weaponHash": 171789620,
    "name": "Default Clip",
    "description": "Standard capacity for Combat PDW."
  },
  {
    "key": WeaponComponent.COMBATPDW_CLIP_DRM,
    "componentHash": 1857603803,
    "weaponHash": 171789620,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.COMBATPDW_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 171789620,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.COMBATPDW_SCOPE_SML,
    "componentHash": 2855028148,
    "weaponHash": 171789620,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_CLIP_INC,
    "componentHash": 247526935,
    "weaponHash": 177293209,
    "name": "Incendiary Rounds",
    "description": "Bullets which set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_BARR2,
    "componentHash": 277524638,
    "weaponHash": 177293209,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_CLIP2,
    "componentHash": 752418717,
    "weaponHash": 177293209,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_SCOPE_TH,
    "componentHash": 776198721,
    "weaponHash": 177293209,
    "name": "Thermal Scope",
    "description": "Long-range zoom with toggleable thermal vision."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_CLIP_FMJ,
    "componentHash": 1005144310,
    "weaponHash": 177293209,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_MUZZ8,
    "componentHash": 1602080333,
    "weaponHash": 177293209,
    "name": "Squared Muzzle Brake",
    "description": "Reduces recoil when firing."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_MUZZ9,
    "componentHash": 1764221345,
    "weaponHash": 177293209,
    "name": "Bell-End Muzzle Brake",
    "description": "Reduces recoil when firing."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_SCOPE_LRG2,
    "componentHash": 2193687427,
    "weaponHash": 177293209,
    "name": "Zoom Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_CLIP_EX,
    "componentHash": 2313935527,
    "weaponHash": 177293209,
    "name": "Explosive Rounds",
    "description": "Bullets which explode on impact. Reduced capacity."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_BARR,
    "componentHash": 2425761975,
    "weaponHash": 177293209,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_SUPP,
    "componentHash": 2890063729,
    "weaponHash": 177293209,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_SCOPE_NV,
    "componentHash": 3061846192,
    "weaponHash": 177293209,
    "name": "Night Vision Scope",
    "description": "Long-range zoom with toggleable night vision."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_SCOPE_MAX,
    "componentHash": 3159677559,
    "weaponHash": 177293209,
    "name": "Advanced Scope",
    "description": "Maximum zoom functionality."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_CLIP_AP,
    "componentHash": 4164277972,
    "weaponHash": 177293209,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_MK2_CLIP1,
    "componentHash": 4196276776,
    "weaponHash": 177293209,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_SCOPE_MAX,
    "componentHash": 3159677559,
    "weaponHash": 205991906,
    "name": "Advanced Scope",
    "description": "Maximum zoom functionality."
  },
  {
    "key": WeaponComponent.HEAVYSNIPER_SCOPE_LRG,
    "componentHash": 3527687644,
    "weaponHash": 205991906,
    "name": "Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.MICROSMG_CLIP2,
    "componentHash": 283556395,
    "weaponHash": 324215364,
    "name": "Extended Clip",
    "description": "Extended capacity for Micro SMG."
  },
  {
    "key": WeaponComponent.MICROSMG_FLASH,
    "componentHash": 899381934,
    "weaponHash": 324215364,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.MICROSMG_SCOPE_MAC,
    "componentHash": 2637152041,
    "weaponHash": 324215364,
    "name": "Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.MICROSMG_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 324215364,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.MICROSMG_CLIP1,
    "componentHash": 3410538224,
    "weaponHash": 324215364,
    "name": "Default Clip",
    "description": "Standard capacity for Micro SMG."
  },
  {
    "key": WeaponComponent.PISTOL_FLASH,
    "componentHash": 899381934,
    "weaponHash": 453432689,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.PISTOL_SUPP,
    "componentHash": 1709866683,
    "weaponHash": 453432689,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.PISTOL_CLIP2,
    "componentHash": 3978713628,
    "weaponHash": 453432689,
    "name": "Extended Clip",
    "description": "Extended capacity for Pistol."
  },
  {
    "key": WeaponComponent.PISTOL_CLIP1,
    "componentHash": 4275109233,
    "weaponHash": 453432689,
    "name": "Default Clip",
    "description": "Standard capacity for Pistol."
  },
  {
    "key": WeaponComponent.PISTOLXM3_CLIP1,
    "componentHash": 375646046,
    "weaponHash": 465894841,
    "name": "Default Clip",
    "description": "Standard capacity for the WM 29 Pistol."
  },
  {
    "key": WeaponComponent.PISTOLXM3_SUPP,
    "componentHash": 503494624,
    "weaponHash": 465894841,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 487013001,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_SUPP,
    "componentHash": 3859329886,
    "weaponHash": 487013001,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.APPISTOL_CLIP2,
    "componentHash": 614078421,
    "weaponHash": 584646201,
    "name": "Extended Clip",
    "description": "Extended capacity for AP Pistol."
  },
  {
    "key": WeaponComponent.APPISTOL_CLIP1,
    "componentHash": 834974250,
    "weaponHash": 584646201,
    "name": "Default Clip",
    "description": "Standard capacity for AP Pistol."
  },
  {
    "key": WeaponComponent.APPISTOL_FLASH,
    "componentHash": 899381934,
    "weaponHash": 584646201,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.APPISTOL_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 584646201,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.CERAMICPISTOL_CLIP1,
    "componentHash": 1423184737,
    "weaponHash": 727643628,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.CERAMICPISTOL_CLIP2,
    "componentHash": 2172153001,
    "weaponHash": 727643628,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.CERAMICPISTOL_SUPP,
    "componentHash": 2466764538,
    "weaponHash": 727643628,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.SMG_CLIP1,
    "componentHash": 643254679,
    "weaponHash": 736523883,
    "name": "Default Clip",
    "description": "Standard capacity for SMG."
  },
  {
    "key": WeaponComponent.SMG_CLIP2,
    "componentHash": 889808635,
    "weaponHash": 736523883,
    "name": "Extended Clip",
    "description": "Extended capacity for SMG."
  },
  {
    "key": WeaponComponent.SMG_SCOPE_MAC,
    "componentHash": 1019656791,
    "weaponHash": 736523883,
    "name": "Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.SMG_CLIP_DRM,
    "componentHash": 2043113590,
    "weaponHash": 736523883,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.SMG_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 736523883,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.SMG_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 736523883,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 961495388,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_SCOPE_MAC2,
    "componentHash": 77277509,
    "weaponHash": 961495388,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 961495388,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 961495388,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_BARR,
    "componentHash": 1134861606,
    "weaponHash": 961495388,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 961495388,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_BARR2,
    "componentHash": 1447477866,
    "weaponHash": 961495388,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_CLIP_FMJ,
    "componentHash": 1675665560,
    "weaponHash": 961495388,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 961495388,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_CLIP1,
    "componentHash": 2249208895,
    "weaponHash": 961495388,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_GRIP,
    "componentHash": 2640679034,
    "weaponHash": 961495388,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 961495388,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_CLIP_AP,
    "componentHash": 2816286296,
    "weaponHash": 961495388,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 961495388,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_SCOPE_MED2,
    "componentHash": 3328927042,
    "weaponHash": 961495388,
    "name": "Large Scope",
    "description": "Extended-range zoom functionality."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 961495388,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_CLIP2,
    "componentHash": 3509242479,
    "weaponHash": 961495388,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 961495388,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 961495388,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_CLIP_TR,
    "componentHash": 4012669121,
    "weaponHash": 961495388,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_MK2_CLIP_INC,
    "componentHash": 4218476627,
    "weaponHash": 961495388,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.HEAVYSHOTGUN_GRIP,
    "componentHash": 202788691,
    "weaponHash": 984333226,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.HEAVYSHOTGUN_CLIP1,
    "componentHash": 844049759,
    "weaponHash": 984333226,
    "name": "Default Clip",
    "description": "Standard capacity for Heavy Shotgun."
  },
  {
    "key": WeaponComponent.HEAVYSHOTGUN_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 984333226,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.HEAVYSHOTGUN_CLIP_DRM,
    "componentHash": 2294798931,
    "weaponHash": 984333226,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.HEAVYSHOTGUN_CLIP2,
    "componentHash": 2535257853,
    "weaponHash": 984333226,
    "name": "Extended Clip",
    "description": "Extended capacity for Heavy Shotgun."
  },
  {
    "key": WeaponComponent.HEAVYSHOTGUN_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 984333226,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.GRENADELAUNCHER_SMOKE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 1305664598,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.GRENADELAUNCHER_SMOKE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 1305664598,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.GRENADELAUNCHER_SMOKE_SCOPE_SML,
    "componentHash": 2855028148,
    "weaponHash": 1305664598,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SCOPE_MAC2,
    "componentHash": 77277509,
    "weaponHash": 1432025498,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SHELL_EX,
    "componentHash": 1004815965,
    "weaponHash": 1432025498,
    "name": "Explosive Slugs",
    "description": "Projectile which explodes on impact."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SCOPE_SML2,
    "componentHash": 1060929921,
    "weaponHash": 1432025498,
    "name": "Medium Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 1432025498,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SHELL_AP,
    "componentHash": 1315288101,
    "weaponHash": 1432025498,
    "name": "Steel Buckshot Shells",
    "description": "Increased penetration of Body Armor."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_MUZZ8,
    "componentHash": 1602080333,
    "weaponHash": 1432025498,
    "name": "Squared Muzzle Brake",
    "description": "Reduces recoil when firing."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 1432025498,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SHELL_INC,
    "componentHash": 2676628469,
    "weaponHash": 1432025498,
    "name": "Dragon's Breath Shells",
    "description": "Has a chance to set targets on fire when shot."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SUPP,
    "componentHash": 2890063729,
    "weaponHash": 1432025498,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SHELL,
    "componentHash": 3449028929,
    "weaponHash": 1432025498,
    "name": "Default Shells",
    "description": "Standard shotgun ammunition."
  },
  {
    "key": WeaponComponent.PUMPSHOTGUN_MK2_SHELL_HP,
    "componentHash": 3914869031,
    "weaponHash": 1432025498,
    "name": "Flechette Shells",
    "description": "Increased damage to targets without Body Armor."
  },
  {
    "key": WeaponComponent.COMBATPISTOL_CLIP1,
    "componentHash": 119648377,
    "weaponHash": 1593441988,
    "name": "Default Clip",
    "description": "Standard capacity for Combat Pistol."
  },
  {
    "key": WeaponComponent.COMBATPISTOL_FLASH,
    "componentHash": 899381934,
    "weaponHash": 1593441988,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.COMBATPISTOL_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 1593441988,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.COMBATPISTOL_CLIP2,
    "componentHash": 3598405421,
    "weaponHash": 1593441988,
    "name": "Extended Clip",
    "description": "Extended capacity for Combat Pistol."
  },
  {
    "key": WeaponComponent.GUSENBERG_CLIP1,
    "componentHash": 484812453,
    "weaponHash": 1627465347,
    "name": "Default Clip",
    "description": "Standard capacity for Gusenberg Sweeper."
  },
  {
    "key": WeaponComponent.GUSENBERG_CLIP2,
    "componentHash": 3939025520,
    "weaponHash": 1627465347,
    "name": "Extended Clip",
    "description": "Extended capacity for Gusenberg Sweeper."
  },
  {
    "key": WeaponComponent.COMPACTRIFLE_CLIP1,
    "componentHash": 1363085923,
    "weaponHash": 1649403952,
    "name": "Default Clip",
    "description": "Standard capacity for Compact Rifle."
  },
  {
    "key": WeaponComponent.COMPACTRIFLE_CLIP2,
    "componentHash": 1509923832,
    "weaponHash": 1649403952,
    "name": "Extended Clip",
    "description": "Extended capacity for Compact Rifle."
  },
  {
    "key": WeaponComponent.COMPACTRIFLE_CLIP_DRM,
    "componentHash": 3322377230,
    "weaponHash": 1649403952,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 1785463520,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 1785463520,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_BARR,
    "componentHash": 941317513,
    "weaponHash": 1785463520,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 1785463520,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 1785463520,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_SCOPE_LRG2,
    "componentHash": 1528590652,
    "weaponHash": 1785463520,
    "name": "Zoom Scope",
    "description": "Long-range fixed zoom functionality."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_BARR2,
    "componentHash": 1748450780,
    "weaponHash": 1785463520,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_CLIP_INC,
    "componentHash": 1842849902,
    "weaponHash": 1785463520,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 1785463520,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 1785463520,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_CLIP1,
    "componentHash": 2497785294,
    "weaponHash": 1785463520,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_GRIP,
    "componentHash": 2640679034,
    "weaponHash": 1785463520,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 1785463520,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_SCOPE_MED2,
    "componentHash": 3328927042,
    "weaponHash": 1785463520,
    "name": "Large Scope",
    "description": "Extended-range zoom functionality."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 1785463520,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_CLIP_TR,
    "componentHash": 3615105746,
    "weaponHash": 1785463520,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 1785463520,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_CLIP_FMJ,
    "componentHash": 3779763923,
    "weaponHash": 1785463520,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_CLIP2,
    "componentHash": 3872379306,
    "weaponHash": 1785463520,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 1785463520,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_MK2_CLIP_AP,
    "componentHash": 4100968569,
    "weaponHash": 1785463520,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.RAILGUN_CLIP1,
    "componentHash": 59044840,
    "weaponHash": 1834241177,
    "name": "Default Clip",
    "description": "Standard capacity for Railgun."
  },
  {
    "key": WeaponComponent.PRECISIONRIFLE_CLIP1,
    "componentHash": 4075474698,
    "weaponHash": 1853742572,
    "name": "Default Clip",
    "description": "Standard capacity for Carbine Rifle."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 2024373456,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SMG_MK2_CLIP_FMJ,
    "componentHash": 190476639,
    "weaponHash": 2024373456,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 2024373456,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SMG_MK2_CLIP_HP,
    "componentHash": 974903034,
    "weaponHash": 2024373456,
    "name": "Hollow Point Rounds",
    "description": "Increased damage to targets without Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.SMG_MK2_SCOPE_SML2,
    "componentHash": 1038927834,
    "weaponHash": 2024373456,
    "name": "Medium Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.SMG_MK2_CLIP1,
    "componentHash": 1277460590,
    "weaponHash": 2024373456,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 2024373456,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SMG_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2024373456,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.SMG_MK2_CLIP_TR,
    "componentHash": 2146055916,
    "weaponHash": 2024373456,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.SMG_MK2_HOLO,
    "componentHash": 2681951826,
    "weaponHash": 2024373456,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.SMG_MK2_BARR2,
    "componentHash": 2774849419,
    "weaponHash": 2024373456,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.SMG_MK2_CLIP2,
    "componentHash": 3112393518,
    "weaponHash": 2024373456,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 2024373456,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SMG_MK2_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 2024373456,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 2024373456,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SMG_MK2_BARR,
    "componentHash": 3641720545,
    "weaponHash": 2024373456,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.SMG_MK2_CLIP_INC,
    "componentHash": 3650233061,
    "weaponHash": 2024373456,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 2024373456,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SMG_MK2_SCOPE_MAC2,
    "componentHash": 3842157419,
    "weaponHash": 2024373456,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.SMG_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 2024373456,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 2132975508,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2132975508,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 2132975508,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_SCOPE_SML,
    "componentHash": 2855028148,
    "weaponHash": 2132975508,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_CLIP2,
    "componentHash": 3009973007,
    "weaponHash": 2132975508,
    "name": "Extended Clip",
    "description": "Extended capacity for Bullpup Rifle."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_CLIP1,
    "componentHash": 3315675008,
    "weaponHash": 2132975508,
    "name": "Default Clip",
    "description": "Standard capacity for Bullpup Rifle."
  },
  {
    "key": WeaponComponent.FIREWORK_CLIP1,
    "componentHash": 3840197261,
    "weaponHash": 2138347493,
    "name": "Default Clip",
    "description": "Standard capacity for Firework Launcher."
  },
  {
    "key": WeaponComponent.COMBATMG_GRIP,
    "componentHash": 202788691,
    "weaponHash": 2144741730,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.COMBATMG_SCOPE_LRG,
    "componentHash": 2698550338,
    "weaponHash": 2144741730,
    "name": "Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.COMBATMG_CLIP2,
    "componentHash": 3603274966,
    "weaponHash": 2144741730,
    "name": "Extended Clip",
    "description": "Extended capacity for Combat MG."
  },
  {
    "key": WeaponComponent.COMBATMG_CLIP1,
    "componentHash": 3791631178,
    "weaponHash": 2144741730,
    "name": "Default Clip",
    "description": "Standard capacity for Combat MG."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 2210333304,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2210333304,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 2210333304,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_CLIP2,
    "componentHash": 2433783441,
    "weaponHash": 2210333304,
    "name": "Extended Clip",
    "description": "Extended capacity for Carbine Rifle."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_CLIP1,
    "componentHash": 2680042476,
    "weaponHash": 2210333304,
    "name": "Default Clip",
    "description": "Standard capacity for Carbine Rifle."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_SCOPE_LRG,
    "componentHash": 2698550338,
    "weaponHash": 2210333304,
    "name": "Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_CLIP_BOX,
    "componentHash": 3127044405,
    "weaponHash": 2210333304,
    "name": "Box Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_CLIP1,
    "componentHash": 25766362,
    "weaponHash": 2228681469,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 2228681469,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 2228681469,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_BARR2,
    "componentHash": 1005743559,
    "weaponHash": 2228681469,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_SCOPE_SML2,
    "componentHash": 1060929921,
    "weaponHash": 2228681469,
    "name": "Medium Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 2228681469,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_CLIP_FMJ,
    "componentHash": 1130501904,
    "weaponHash": 2228681469,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 2228681469,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_BARR,
    "componentHash": 1704640795,
    "weaponHash": 2228681469,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2228681469,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_CLIP_TR,
    "componentHash": 2183159977,
    "weaponHash": 2228681469,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 2228681469,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_GRIP,
    "componentHash": 2640679034,
    "weaponHash": 2228681469,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_CLIP_INC,
    "componentHash": 2845636954,
    "weaponHash": 2228681469,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 2228681469,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_SCOPE_MAC2,
    "componentHash": 3350057221,
    "weaponHash": 2228681469,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 2228681469,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 2228681469,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 2228681469,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_CLIP2,
    "componentHash": 4021290536,
    "weaponHash": 2228681469,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.BULLPUPRIFLE_MK2_CLIP_AP,
    "componentHash": 4205311469,
    "weaponHash": 2228681469,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_CLIP1,
    "componentHash": 21392614,
    "weaponHash": 2285322324,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_SCOPE_PI,
    "componentHash": 1205768792,
    "weaponHash": 2285322324,
    "name": "Mounted Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_FLASH,
    "componentHash": 1246324211,
    "weaponHash": 2285322324,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_SUPP,
    "componentHash": 1709866683,
    "weaponHash": 2285322324,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_CLIP_HP,
    "componentHash": 2366665730,
    "weaponHash": 2285322324,
    "name": "Hollow Point Rounds",
    "description": "Increased damage to targets without Body Armor."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_CLIP_TR,
    "componentHash": 2418909806,
    "weaponHash": 2285322324,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_COMP,
    "componentHash": 2860680127,
    "weaponHash": 2285322324,
    "name": "Compensator",
    "description": "Reduces recoil for rapid fire."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_CLIP_FMJ,
    "componentHash": 3239176998,
    "weaponHash": 2285322324,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_CLIP2,
    "componentHash": 3465283442,
    "weaponHash": 2285322324,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.SNSPISTOL_MK2_CLIP_INC,
    "componentHash": 3870121849,
    "weaponHash": 2285322324,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot."
  },
  {
    "key": WeaponComponent.FLASHLIGHT_FLASH,
    "componentHash": 3719772431,
    "weaponHash": 2343591895,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 2526821735,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_SCOPE_MAC2,
    "componentHash": 77277509,
    "weaponHash": 2526821735,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_CLIP1,
    "componentHash": 382112385,
    "weaponHash": 2526821735,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 2526821735,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 2526821735,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 2526821735,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_CLIP_FMJ,
    "componentHash": 1346235024,
    "weaponHash": 2526821735,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_CLIP_AP,
    "componentHash": 1362433589,
    "weaponHash": 2526821735,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2526821735,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_CLIP_TR,
    "componentHash": 2271594122,
    "weaponHash": 2526821735,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_GRIP,
    "componentHash": 2640679034,
    "weaponHash": 2526821735,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 2526821735,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 2526821735,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_SCOPE_MED2,
    "componentHash": 3328927042,
    "weaponHash": 2526821735,
    "name": "Large Scope",
    "description": "Extended-range zoom functionality."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 2526821735,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_CLIP_INC,
    "componentHash": 3724612230,
    "weaponHash": 2526821735,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 2526821735,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_CLIP2,
    "componentHash": 3726614828,
    "weaponHash": 2526821735,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_BARR,
    "componentHash": 3879097257,
    "weaponHash": 2526821735,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 2526821735,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_MK2_BARR2,
    "componentHash": 4185880635,
    "weaponHash": 2526821735,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.DOUBLEACTION_CLIP1,
    "componentHash": 1328622785,
    "weaponHash": 2548703416,
    "name": "Default Clip",
    "description": "Standard ammo capacity."
  },
  {
    "key": WeaponComponent.PISTOL50_CLIP1,
    "componentHash": 580369945,
    "weaponHash": 2578377531,
    "name": "Default Clip",
    "description": "Standard capacity for Pistol .50."
  },
  {
    "key": WeaponComponent.PISTOL50_FLASH,
    "componentHash": 899381934,
    "weaponHash": 2578377531,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.PISTOL50_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 2578377531,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.PISTOL50_CLIP2,
    "componentHash": 3654528146,
    "weaponHash": 2578377531,
    "name": "Extended Clip",
    "description": "Extended capacity for Pistol .50."
  },
  {
    "key": WeaponComponent.MG_SCOPE_SML,
    "componentHash": 1006677997,
    "weaponHash": 2634544996,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.MG_CLIP2,
    "componentHash": 2182449991,
    "weaponHash": 2634544996,
    "name": "Extended Clip",
    "description": "Extended capacity for MG."
  },
  {
    "key": WeaponComponent.MG_CLIP1,
    "componentHash": 4097109892,
    "weaponHash": 2634544996,
    "name": "Default Clip",
    "description": "Standard capacity for MG."
  },
  {
    "key": WeaponComponent.MILITARYRIFLE_CLIP1,
    "componentHash": 759617595,
    "weaponHash": 2636060646,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.MILITARYRIFLE_CLIP2,
    "componentHash": 1749732930,
    "weaponHash": 2636060646,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.MILITARYRIFLE_MRFL_SIGHT,
    "componentHash": 1803744149,
    "weaponHash": 2636060646,
    "name": "Iron Sights",
    "description": "Default rail-mounted iron sights."
  },
  {
    "key": WeaponComponent.MILITARYRIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2636060646,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.MILITARYRIFLE_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 2636060646,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.MILITARYRIFLE_SCOPE_SML,
    "componentHash": 2855028148,
    "weaponHash": 2636060646,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.BULLPUPSHOTGUN_GRIP,
    "componentHash": 202788691,
    "weaponHash": 2640438543,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.BULLPUPSHOTGUN_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2640438543,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.BULLPUPSHOTGUN_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 2640438543,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.GRENADELAUNCHER_GRIP,
    "componentHash": 202788691,
    "weaponHash": 2726580491,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.GRENADELAUNCHER_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2726580491,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.GRENADELAUNCHER_SCOPE_SML,
    "componentHash": 2855028148,
    "weaponHash": 2726580491,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.MUSKET_CLIP1,
    "componentHash": 1322387263,
    "weaponHash": 2828843422,
    "name": "Default Clip",
    "description": "Standard capacity for Musket."
  },
  {
    "key": WeaponComponent.ADVANCEDRIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 2937143193,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.ADVANCEDRIFLE_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 2937143193,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.ADVANCEDRIFLE_CLIP2,
    "componentHash": 2395064697,
    "weaponHash": 2937143193,
    "name": "Extended Clip",
    "description": "Extended capacity for Assault Rifle."
  },
  {
    "key": WeaponComponent.ADVANCEDRIFLE_SCOPE_SML,
    "componentHash": 2855028148,
    "weaponHash": 2937143193,
    "name": "Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.ADVANCEDRIFLE_CLIP1,
    "componentHash": 4203716879,
    "weaponHash": 2937143193,
    "name": "Default Clip",
    "description": "Standard capacity for Assault Rifle."
  },
  {
    "key": WeaponComponent.RAYPISTOL_VAR_RAY18,
    "componentHash": 3621517063,
    "weaponHash": 2939590305,
    "name": "Festive tint",
    "description": "The Festive tint for the Up-n-Atomizer."
  },
  {
    "key": WeaponComponent.MINISMG_CLIP1,
    "componentHash": 2227745491,
    "weaponHash": 3173288789,
    "name": "Default Clip",
    "description": "Standard capacity for Mini SMG."
  },
  {
    "key": WeaponComponent.MINISMG_CLIP2,
    "componentHash": 2474561719,
    "weaponHash": 3173288789,
    "name": "Extended Clip",
    "description": "Extended capacity for Mini SMG."
  },
  {
    "key": WeaponComponent.SNSPISTOL_CLIP2,
    "componentHash": 2063610803,
    "weaponHash": 3218215474,
    "name": "Extended Clip",
    "description": "Extended capacity for SNS Pistol."
  },
  {
    "key": WeaponComponent.SNSPISTOL_CLIP1,
    "componentHash": 4169150169,
    "weaponHash": 3218215474,
    "name": "Default Clip",
    "description": "Standard capacity for SNS Pistol."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_COMP,
    "componentHash": 568543123,
    "weaponHash": 3219281620,
    "name": "Compensator",
    "description": "Reduces recoil for rapid fire."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_CLIP_TR,
    "componentHash": 634039983,
    "weaponHash": 3219281620,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_CLIP_INC,
    "componentHash": 733837882,
    "weaponHash": 3219281620,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_FLASH,
    "componentHash": 1140676955,
    "weaponHash": 3219281620,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_CLIP_FMJ,
    "componentHash": 1329061674,
    "weaponHash": 3219281620,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_CLIP2,
    "componentHash": 1591132456,
    "weaponHash": 3219281620,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_SUPP,
    "componentHash": 1709866683,
    "weaponHash": 3219281620,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_CLIP_HP,
    "componentHash": 2248057097,
    "weaponHash": 3219281620,
    "name": "Hollow Point Rounds",
    "description": "Increased damage to targets without Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_SCOPE_PI,
    "componentHash": 2396306288,
    "weaponHash": 3219281620,
    "name": "Mounted Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.PISTOL_MK2_CLIP1,
    "componentHash": 2499030370,
    "weaponHash": 3219281620,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 3220176749,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 3220176749,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_SCOPE_MAC,
    "componentHash": 2637152041,
    "weaponHash": 3220176749,
    "name": "Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 3220176749,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_CLIP2,
    "componentHash": 2971750299,
    "weaponHash": 3220176749,
    "name": "Extended Clip",
    "description": "Extended capacity for Assault Rifle."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_CLIP1,
    "componentHash": 3193891350,
    "weaponHash": 3220176749,
    "name": "Default Clip",
    "description": "Standard capacity for Assault Rifle."
  },
  {
    "key": WeaponComponent.ASSAULTRIFLE_CLIP_DRM,
    "componentHash": 3689981245,
    "weaponHash": 3220176749,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 3231910285,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_CLIP_DRM,
    "componentHash": 1801039530,
    "weaponHash": 3231910285,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 3231910285,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_CLIP2,
    "componentHash": 2089537806,
    "weaponHash": 3231910285,
    "name": "Extended Clip",
    "description": "Extended capacity for Special Carbine."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_SCOPE_LRG,
    "componentHash": 2698550338,
    "weaponHash": 3231910285,
    "name": "Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 3231910285,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.SPECIALCARBINE_CLIP1,
    "componentHash": 3334989185,
    "weaponHash": 3231910285,
    "name": "Default Clip",
    "description": "Standard capacity for Special Carbine."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 3342088282,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_SCOPE_LRG,
    "componentHash": 471997210,
    "weaponHash": 3342088282,
    "name": "Scope",
    "description": "Long-range fixed zoom functionality."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 3342088282,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 3342088282,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_CLIP2,
    "componentHash": 3439143621,
    "weaponHash": 3342088282,
    "name": "Extended Clip",
    "description": "Extended capacity for Marksman Rifle."
  },
  {
    "key": WeaponComponent.MARKSMANRIFLE_CLIP1,
    "componentHash": 3627761985,
    "weaponHash": 3342088282,
    "name": "Default Clip",
    "description": "Standard capacity for Marksman Rifle."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 3347935668,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_CLIP1,
    "componentHash": 1525977990,
    "weaponHash": 3347935668,
    "name": "Default Clip",
    "description": "Standard capacity for Heavy Rifle."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_CLIP2,
    "componentHash": 1824470811,
    "weaponHash": 3347935668,
    "name": "Extended Clip",
    "description": "Extended capacity for Heavy Rifle."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 3347935668,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 3347935668,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_SCOPE_LRG,
    "componentHash": 2698550338,
    "weaponHash": 3347935668,
    "name": "Scope",
    "description": "Long-range zoom functionality."
  },
  {
    "key": WeaponComponent.HEAVYRIFLE_HVYRFLE_SIG,
    "componentHash": 3017917522,
    "weaponHash": 3347935668,
    "name": "Iron Sights",
    "description": "Default rail-mounted iron sights."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_CLIP_INC,
    "componentHash": 15712037,
    "weaponHash": 3415619887,
    "name": "Incendiary Rounds",
    "description": "Bullets which set targets on fire when shot."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_SCOPE_MAC2,
    "componentHash": 77277509,
    "weaponHash": 3415619887,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_CLIP_FMJ,
    "componentHash": 231258687,
    "weaponHash": 3415619887,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_CLIP_HP,
    "componentHash": 284438159,
    "weaponHash": 3415619887,
    "name": "Hollow Point Rounds",
    "description": "Increased damage to targets without Body Armor."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_COMP,
    "componentHash": 654802123,
    "weaponHash": 3415619887,
    "name": "Compensator",
    "description": "Reduces recoil for rapid fire."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_FLASH,
    "componentHash": 899381934,
    "weaponHash": 3415619887,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 3415619887,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_CLIP1_RV,
    "componentHash": 3122911422,
    "weaponHash": 3415619887,
    "name": "Default Rounds",
    "description": "Standard revolver ammunition."
  },
  {
    "key": WeaponComponent.REVOLVER_MK2_CLIP_TR,
    "componentHash": 3336103030,
    "weaponHash": 3415619887,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun."
  },
  {
    "key": WeaponComponent.TACTICALRIFLE_GRIP,
    "componentHash": 202788691,
    "weaponHash": 3520460075,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.TACTICALRIFLE_CLIP1,
    "componentHash": 927578299,
    "weaponHash": 3520460075,
    "name": "Default Clip",
    "description": "Standard capacity for Carbine Rifle."
  },
  {
    "key": WeaponComponent.TACTICALRIFLE_CLIP2,
    "componentHash": 2241090895,
    "weaponHash": 3520460075,
    "name": "Extended Clip",
    "description": "Extended capacity for Carbine Rifle."
  },
  {
    "key": WeaponComponent.TACTICALRIFLE_FLASH,
    "componentHash": 2645680163,
    "weaponHash": 3520460075,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.TACTICALRIFLE_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 3520460075,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.HEAVYPISTOL_CLIP1,
    "componentHash": 222992026,
    "weaponHash": 3523564046,
    "name": "Default Clip",
    "description": "Standard capacity for Heavy Pistol."
  },
  {
    "key": WeaponComponent.HEAVYPISTOL_FLASH,
    "componentHash": 899381934,
    "weaponHash": 3523564046,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.HEAVYPISTOL_CLIP2,
    "componentHash": 1694090795,
    "weaponHash": 3523564046,
    "name": "Extended Clip",
    "description": "Extended capacity for Heavy Pistol."
  },
  {
    "key": WeaponComponent.HEAVYPISTOL_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 3523564046,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.MACHINEPISTOL_CLIP1,
    "componentHash": 1198425599,
    "weaponHash": 3675956304,
    "name": "Default Clip",
    "description": "Standard capacity for Machine Pistol."
  },
  {
    "key": WeaponComponent.MACHINEPISTOL_CLIP_DRM,
    "componentHash": 2850671348,
    "weaponHash": 3675956304,
    "name": "Drum Magazine",
    "description": "Expanded capacity and slower reload."
  },
  {
    "key": WeaponComponent.MACHINEPISTOL_CLIP2,
    "componentHash": 3106695545,
    "weaponHash": 3675956304,
    "name": "Extended Clip",
    "description": "Extended capacity for Machine Pistol."
  },
  {
    "key": WeaponComponent.MACHINEPISTOL_SUPP,
    "componentHash": 3271853210,
    "weaponHash": 3675956304,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 3686625920,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_CLIP2,
    "componentHash": 400507625,
    "weaponHash": 3686625920,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_CLIP_AP,
    "componentHash": 696788003,
    "weaponHash": 3686625920,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 3686625920,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_SCOPE_SML2,
    "componentHash": 1060929921,
    "weaponHash": 3686625920,
    "name": "Medium Scope",
    "description": "Medium-range zoom functionality."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 3686625920,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_CLIP1,
    "componentHash": 1227564412,
    "weaponHash": 3686625920,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 3686625920,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_CLIP_FMJ,
    "componentHash": 1475288264,
    "weaponHash": 3686625920,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_GRIP,
    "componentHash": 2640679034,
    "weaponHash": 3686625920,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_BARR2,
    "componentHash": 3051509595,
    "weaponHash": 3686625920,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 3686625920,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_CLIP_INC,
    "componentHash": 3274096058,
    "weaponHash": 3686625920,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_BARR,
    "componentHash": 3276730932,
    "weaponHash": 3686625920,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_SCOPE_MED2,
    "componentHash": 3328927042,
    "weaponHash": 3686625920,
    "name": "Large Scope",
    "description": "Extended-range zoom functionality."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 3686625920,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 3686625920,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 3686625920,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.COMBATMG_MK2_CLIP_TR,
    "componentHash": 4133787461,
    "weaponHash": 3686625920,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.ASSAULTSHOTGUN_GRIP,
    "componentHash": 202788691,
    "weaponHash": 3800352039,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.ASSAULTSHOTGUN_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 3800352039,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.ASSAULTSHOTGUN_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 3800352039,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.ASSAULTSHOTGUN_CLIP2,
    "componentHash": 2260565874,
    "weaponHash": 3800352039,
    "name": "Extended Clip",
    "description": "Extended capacity for Assault Shotgun."
  },
  {
    "key": WeaponComponent.ASSAULTSHOTGUN_CLIP1,
    "componentHash": 2498239431,
    "weaponHash": 3800352039,
    "name": "Default Clip",
    "description": "Standard capacity for Assault Shotgun."
  },
  {
    "key": WeaponComponent.ASSAULTSMG_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 4024951519,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.ASSAULTSMG_SCOPE_MAC,
    "componentHash": 2637152041,
    "weaponHash": 4024951519,
    "name": "Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.ASSAULTSMG_SUPP,
    "componentHash": 2805810788,
    "weaponHash": 4024951519,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ5,
    "componentHash": 48731514,
    "weaponHash": 4208062921,
    "name": "Heavy Duty Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_SCOPE_MAC2,
    "componentHash": 77277509,
    "weaponHash": 4208062921,
    "name": "Small Scope",
    "description": "Standard-range zoom functionality."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_CLIP_TR,
    "componentHash": 391640422,
    "weaponHash": 4208062921,
    "name": "Tracer Rounds",
    "description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_CLIP_AP,
    "componentHash": 626875735,
    "weaponHash": 4208062921,
    "name": "Armor Piercing Rounds",
    "description": "Increased penetration of Body Armor. Reduced capacity."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ6,
    "componentHash": 880736428,
    "weaponHash": 4208062921,
    "name": "Slanted Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_CLIP_INC,
    "componentHash": 1025884839,
    "weaponHash": 4208062921,
    "name": "Incendiary Rounds",
    "description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_HOLO,
    "componentHash": 1108334355,
    "weaponHash": 4208062921,
    "name": "Holographic Sight",
    "description": "Accurate sight for close quarters combat."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_CLIP_FMJ,
    "componentHash": 1141059345,
    "weaponHash": 4208062921,
    "name": "Full Metal Jacket Rounds",
    "description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_CLIP1,
    "componentHash": 1283078430,
    "weaponHash": 4208062921,
    "name": "Default Clip",
    "description": "Standard capacity for regular ammo."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ7,
    "componentHash": 1303784126,
    "weaponHash": 4208062921,
    "name": "Split-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_CLIP2,
    "componentHash": 1574296533,
    "weaponHash": 4208062921,
    "name": "Extended Clip",
    "description": "Extended capacity for regular ammo."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_FLASH,
    "componentHash": 2076495324,
    "weaponHash": 4208062921,
    "name": "Flashlight",
    "description": "Aids low light target acquisition."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_BARR,
    "componentHash": 2201368575,
    "weaponHash": 4208062921,
    "name": "Default Barrel",
    "description": "Stock barrel attachment."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_SUPP,
    "componentHash": 2205435306,
    "weaponHash": 4208062921,
    "name": "Suppressor",
    "description": "Reduces noise and muzzle flash."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_BARR2,
    "componentHash": 2335983627,
    "weaponHash": 4208062921,
    "name": "Heavy Barrel",
    "description": "Increases damage dealt to long-range targets."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_GRIP,
    "componentHash": 2640679034,
    "weaponHash": 4208062921,
    "name": "Grip",
    "description": "Improves weapon accuracy."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ1,
    "componentHash": 3113485012,
    "weaponHash": 4208062921,
    "name": "Flat Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_SCOPE_MED2,
    "componentHash": 3328927042,
    "weaponHash": 4208062921,
    "name": "Large Scope",
    "description": "Extended-range zoom functionality."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ2,
    "componentHash": 3362234491,
    "weaponHash": 4208062921,
    "name": "Tactical Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ3,
    "componentHash": 3725708239,
    "weaponHash": 4208062921,
    "name": "Fat-End Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.CARBINERIFLE_MK2_MUZZ4,
    "componentHash": 3968886988,
    "weaponHash": 4208062921,
    "name": "Precision Muzzle Brake",
    "description": "Reduces recoil during rapid fire."
  },
  {
    "key": WeaponComponent.RAILGUNXM3_CLIP1,
    "componentHash": 1130760338,
    "weaponHash": 4272043364,
    "name": "Default Clip",
    "description": "Standard capacity for Railgun."
  }
]);

export function isItemKeyWeaponComponent(key: ItemKey): key is WeaponComponentItemKey {
  return weaponComponent.has(key as WeaponComponentItemKey);
}

export function isItemWeaponComponent(item: Item): item is WeaponComponentItem {
  return isItemKeyWeaponComponent(item.key);
}
