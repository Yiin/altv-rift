export enum PED_TRANSPORT_MODE {
  TM_ANY, // Any mode of transport bike, car plane, on foot etc
  TM_ON_FOOT, //The ped is on foot
  TM_IN_VEHICLE, //The ped is in a vehicle not on foot
}

export enum TRAFFICLIGHT_OVERRIDE_MODE {
  TLO_RED = 0,
  TLO_AMBER = 1,
  TLO_GREEN = 2,
  TLO_NONE = 3,
}

export enum ENTITY_TYPE {
  ET_NONE = 0,
  ET_PED = 1,
  ET_VEHICLE = 2,
  ET_OBJECT = 3,
}

export enum ANIM_TYPE {
  ANIM_SCRIPT = 1, // Include scripted animations (TASK_PLAY_ANIM, TASK_ACRIPTED_ANIMATION and PLAY_ENTITY_ANIM)
  ANIM_SYNCED_SCENE = 2, // Include synced scene animations (TASK_SYNCHRONIZED_SCENE and PLAY_SYNCHRONIZED_ENTITY_ANIM)
  ANIM_CODE = 4, // Include animations being played by code (NOT CURRENTLY SUPPORTED! - see an anim programmer if you need this)
  ANIM_DEFAULT = 3, // Includes scripted and synchronized scene anims by default
}

export enum ENTITY_POPULATION_TYPE {
  PT_UNKNOWN = 0,
  PT_RANDOM_PERMANENT = 1,
  PT_RANDOM_PARKED = 2,
  PT_RANDOM_PATROL = 3,
  PT_RANDOM_SCENARIO = 4,
  PT_RANDOM_AMBIENT = 5,
  PT_PERMANENT = 6,
  PT_MISSION = 7,
  PT_REPLAY = 8,
  PT_CACHE = 9,
  PT_TOOL = 10,
}

export const INVALID_WORLD_Z = -200.0;
