import { hash } from "@altv/client";

export const INFINITE_TASK_TIME = -1;

export const PEDMOVEBLENDRATIO_STILL = 0.0;
export const PEDMOVEBLENDRATIO_WALK = 1.0;
export const PEDMOVEBLENDRATIO_RUN = 2.0;
export const PEDMOVEBLENDRATIO_SPRINT = 3.0;

export const PEDMOVE_STILL = PEDMOVEBLENDRATIO_STILL;
export const PEDMOVE_WALK = PEDMOVEBLENDRATIO_WALK;
export const PEDMOVE_RUN = PEDMOVEBLENDRATIO_RUN;
export const PEDMOVE_SPRINT = PEDMOVEBLENDRATIO_SPRINT;

export enum VEHICLEMOUNTEDWEAPONTASKMODE {
  TASK_PLAYER = 0,
  TASK_IDLE,
  TASK_AIM,
  TASK_FIRE,
  TASK_CAMERA,
  TASK_SEARCH,
}

export enum ARRESTTYPE {
  ARREST_FALLBACK = -1,
  ARREST_CUFFING = 0,
  ARREST_UNCUFFING,
  ARREST_COUNT,
}

export enum REPEATMODE {
  REPEAT_NOT = 0,
  REPEAT_FOREVER,
}

export enum FOLLOWPOINTROUTEMODE {
  TICKET_SINGLE = 0, //Stop at the end of the route
  TICKET_RETURN, //Go once then return back once following the route backwards
  TICKET_SEASON, //As above but for forever
  TICKET_LOOP, //Treat the points as a loop, i.e follow it to the end then directly back to the first position, forever.
}

export enum NAVMESH_ROUTE_RESULT {
  NAVMESHROUTE_TASK_NOT_FOUND, // on navmesh task was found on the ped
  NAVMESHROUTE_ROUTE_NOT_YET_TRIED, // the task has not yet looked for a route
  NAVMESHROUTE_ROUTE_NOT_FOUND, // the task has tried & failed to find a route (will keep trying)
  NAVMESHROUTE_ROUTE_FOUND, // the task has successfully found a route
}

export enum SYNCED_SCENE_PLAYBACK_FLAGS {
  SYNCED_SCENE_NONE = 0,
  SYNCED_SCENE_USE_PHYSICS = 1, // When this flag is set, the task will run in kinematic physics mode (other entities will collide, and be pushed out of the way)
  SYNCED_SCENE_TAG_SYNC_OUT = 2, // when this flag is set, the task will do a tag synchronized blend out with the movement behaviour of the ped.
  SYNCED_SCENE_DONT_INTERRUPT = 4, // When this flag is set, the scene will not be interrupted by ai events like falling, entering water / etc. Also blocks all weapon reactions / etc
  SYNCED_SCENE_ON_ABORT_STOP_SCENE = 8, // When this flag is set, the scene will be stopped if this task is aborted
  SYNCED_SCENE_ABORT_ON_WEAPON_DAMAGE = 16, // When this flag is set, the task will end if the ped takes weapon damage
  SYNCED_SCENE_BLOCK_MOVER_UPDATE = 32, // When this flag is set, the task will not update the mover
  SYNCED_SCENE_LOOP_WITHIN_SCENE = 64, // When this flag is set, the tasks with anims shorter than the scene will loop while the scene is playing
  SYNCED_SCENE_PRESERVE_VELOCITY = 128, // When this flag is set, the task will preserve it's velocity on clean up (must be using physics)
  SYNCED_SCENE_EXPAND_PED_CAPSULE_FROM_SKELETON = 256, // When this flag is set, the task will apply the CPED_RESET_FLAG_ExpandPedCapsuleFromSkeleton flag to the ped
  SYNCED_SCENE_ACTIVATE_RAGDOLL_ON_COLLISION = 512, // When this flag is set, the ped will switch to ragdoll and fall down on making contact with a physical object (other than flat ground)
  SYNCED_SCENE_HIDE_WEAPON = 1024, // When this flag is set, the ped's weapon will be hidden while the scene is playing
  SYNCED_SCENE_ABORT_ON_DEATH = 2048, // When this flag is set, task will end if the ped dies, even if the SYNCED_SCENE_DONT_INTERRUPT flag is set.
  SYNCED_SCENE_VEHICLE_ABORT_ON_LARGE_IMPACT = 4096, // When running the scene on a vehicle, allow the scene to abort if the vehicle takes a heavy collision from another vehicle
  SYNCED_SCENE_VEHICLE_ALLOW_PLAYER_ENTRY = 8192, // When running the scene on a vehicle, allow player peds to enter the vehicle
  SYNCED_SCENE_PROCESS_ATTACHMENTS_ON_START = 16384, // When this flag is set, process the attachments at the start of the scene
  SYNCED_SCENE_NET_ON_EARLY_NON_PED_STOP_RETURN_TO_START = 32768, // When this flag is set, a non-ped entity will be returned to their starting position if the scene finishes early
  SYNCED_SCENE_SET_PED_OUT_OF_VEHICLE_AT_START = 65536, // When this flag is set, The ped will be set out of his vehicle when the task starts.
  SYNCED_SCENE_NET_DISREGARD_ATTACHMENT_CHECKS = 131072, // When this flag is set, the attachment checks done in CNetworkSynchronisedScenes::Update when pending start will be disregarded
}

export enum TASK_RAPPEL_DOWN_WALL_STATE {
  RAPPEL_STATE_INVALID = -1, // The ped isn't currently running this task
  RAPPEL_STATE_CLIMBING_WALL = 1, // Playing the initial climb intro animation
  RAPPEL_STATE_IDLE = 3, // Not moving or jumping, just hanging idle
  RAPPEL_STATE_IDLE_AT_DESTINATION_Z = 4, // At the lowest point allowed and waiting to smash the window
  RAPPEL_STATE_DESCENDING = 5, // Moving down
  RAPPEL_STATE_JUMPING = 6, // Jumping outwards (can also be moving down based on player stick input)
  RAPPEL_STATE_SMASHINGWINDOW = 7, // Playing the window smash animation
}

//Note: These should be kept in sync with CTaskVehicleChase::BehaviorFlags in code.
export enum TASK_VEHICLE_CHASE_BEHAVIOR_FLAGS {
  VEHICLE_CHASE_CANT_BLOCK = 1,
  VEHICLE_CHASE_CANT_BLOCK_FROM_PURSUE = 2,
  VEHICLE_CHASE_CANT_PURSUE = 4,
  VEHICLE_CHASE_CANT_RAM = 8,
  VEHICLE_CHASE_CANT_SPIN_OUT = 16,
  VEHICLE_CHASE_CANT_MAKE_AGGRESSIVE_MOVE = 32,
  VEHICLE_CHASE_CANT_CRUISE_IN_FRONT_DURING_BLOCK = 64,
  VEHICLE_CHASE_USE_CONTINUOUS_RAM = 128,
  VEHICLE_CHASE_CANT_PULL_ALONGSIDE = 256,
  VEHICLE_CHASE_CANT_PULL_ALONGSIDE_INFRONT = 512,
}

export enum TASK_GO_TO_COORD_ANY_MEANS_FLAGS {
  TGCAM_DEFAULT = 0,
  // Ignore the health of the vehicle (default behaviour is to not use any vehicle with less than 600 health)
  TGCAM_IGNORE_VEHICLE_HEALTH = 1,
  // Considers all nearby vehicles for suitability (default behaviour is to consider only the vehicle closest to the ped)
  TGCAM_CONSIDER_ALL_NEARBY_VEHICLES = 2,
  // Performs the same tests as is done in IS_VEHICLE_DRIVEABLE (default behaviour is to just check the vehicle's health)
  TGCAM_PROPER_IS_DRIVEABLE_CHECK = 4,
  // Instructs the ped to remain in the vehicle at the end, so that multiple tasks can be chained together (see url:bugstar:1778387)
  TGCAM_REMAIN_IN_VEHICLE_AT_DESTINATION = 8,
  // Ped will never abandon the vehicle it is in (see url:bugstar:2196034)
  TGCAM_NEVER_ABANDON_VEHICLE = 16,
  // Ped will never abandon the vehicle it is in if vehicle is moving (see url:bugstar:2225456)
  TGCAM_NEVER_ABANDON_VEHICLE_IF_MOVING = 32,
  // Peds will use the targeting system for threats and register any threats they can attack (rather than just using the closest targetable ped)
  TGCAM_USE_AI_TARGETING_FOR_THREATS = 64,
}

export enum TASK_HANDS_UP_FLAGS {
  HANDS_UP_NOTHING = 0,
  HANDS_UP_STRAIGHT_TO_LOOP = 1,
}

export enum TASK_COMBAT_PED_FLAGS {
  COMBAT_PED_NONE = 0,
  COMBAT_PED_PREVENT_CHANGING_TARGET = 67108864,
  COMBAT_PED_DISABLE_AIM_INTRO = 134217728,
}

export enum TASK_THREAT_RESPONSE_FLAGS {
  TASK_THREAT_RESPONSE_NONE = 0,
  TASK_THREAT_RESPONSE_CAN_FIGHT_ARMED_PEDS_WHEN_NOT_ARMED = 16,
}

export enum TASK_GO_TO_AIM_FLAGS {
  GO_TO_AIM_NONE = 0,
  GO_TO_AIM_AT_GOTO_COORD_IF_TARGET_LOS_BLOCKED = 1, // If our target is a ped and our LOS is blocked, we'll try aiming at the go to coord
}

// Ped Config flags, used to control ped behaviour/setup
// match these with the enum in PedFlags.h
export enum CODE_TASK {
  CODE_TASK_HANDS_UP = 0, // CTaskTypes::TASK_HANDS_UP
  CODE_TASK_CLIMB_LADDER = 1,
  CODE_TASK_EXIT_VEHICLE = 2,
  CODE_TASK_COMBAT_ROLL = 3,
  CODE_TASK_AIM_GUN_ON_FOOT = 4,
}

// High fall task entry behaviour. Affects how the ped will behave when first starting the nm high fall task.
// Note: this only affects the starting behaviour of the fall. ONgoing behaviour will be determined by height from the ground / collisions / etc.
export enum HIGH_FALL_ENTRY_TYPE {
  HIGHFALL_IN_AIR = 0, // Standard behaviour. Pitches forward in the direction of movement (standard behaviour when a ped is warped into the air and dropped)
  HIGHFALL_VAULT = 1, // not for use by script
  HIGHFALL_FROM_CAR_HIT = 2, // Normally used when then ped has been hit by a car and falls off.
  HIGHFALL_SLOPE_SLIDE = 3, // Used when the ped activates from an animated slide down a slope.
  HIGHFALL_TEETER_EDGE = 4, // Will make the ped teeter in the direction of movement (as if at an edge). Best used for knocking peds off of the edge of buildings from standing / etc.
  HIGHFALL_SPRINT_EXHAUSTED = 5, // Equivalent to fainting from running out of energy
  HIGHFALL_STUNT_JUMP = 6, // Equivalent to the in air stunt jump activation (i.e. pressing circle / B whilst jumping)
}

//******************************************************************************************************************
// ENAV_SCRIPT_FLAGS
// This enumeration defines the set of bitflags which may be passed in to TASK_FOLLOW_NAV_MESH_TO_COORD_ADVANCED.
// If multiple flags are specified they must either be combined using a bitwise OR, or their values summed.
// TASK_FOLLOW_NAV_MESH_TO_COORD_ADVANCED also takes a NAVDATA structure, which in some cases must contain values
// required for the extra functionality - where this is the case it is described below.

export enum ENAV_SCRIPT_FLAGS {
  ENAV_DEFAULT = 0,

  //*******************************************************************
  // ENAV_NO_STOPPING
  // Will ensure the ped continues to move whilst waiting for the path
  // to be found, and will not slow down at the end of their route.

  ENAV_NO_STOPPING = 1,

  //**********************************************************************
  // ENAV_SLIDE_TO_COORD_AND_ACHIEVE_HEADING_AT_END
  // Performs a slide-to-coord at the and of the task. This requires that
  // the accompanying NAVDATA structure has the 'm_fSlideToCoordHeading'
  // member set correctly.

  ENAV_ADV_SLIDE_TO_COORD_AND_ACHIEVE_HEADING_AT_END = 2,

  //***********************************************************************
  // ENAV_GO_FAR_AS_POSSIBLE_IF_TARGET_NAVMESH_NOT_LOADED
  // If the navmesh is not loaded in under the target position, then this
  // will cause the ped to get as close as is possible on whatever navmesh
  // is loaded.  The navmesh must still be loaded at the path start.

  ENAV_GO_FAR_AS_POSSIBLE_IF_TARGET_NAVMESH_NOT_LOADED = 4,

  //********************************************************************
  // ENAV_ALLOW_SWIMMING_UNDERWATER
  // Will allow navigation underwater - by default this is not allowed

  ENAV_ALLOW_SWIMMING_UNDERWATER = 8,

  //************************************************************************
  // ENAV_KEEP_TO_PAVEMENTS
  // Will only allow navigation on pavements.  If the path starts or ends
  // off the pavement, the command will fail.  Likewise if no pavement-only
  // route can be found even although the start and end are on pavement.

  ENAV_KEEP_TO_PAVEMENTS = 16,

  //******************************************************
  // ENAV_NEVER_ENTER_WATER
  // Prevents the path from entering water at all

  ENAV_NEVER_ENTER_WATER = 32,

  //***************************************************************************
  // ENAV_DONT_AVOID_OBJECTS
  // Disables object-avoidance for this path.  The ped may still make minor
  // steering adjustments to avoid objects, but will not pathfind around them.

  ENAV_DONT_AVOID_OBJECTS = 64,

  //***************************************************************************
  // ENAV_ADVANCED_USE_MAX_SLOPE_NAVIGABLE
  // Specifies that the navmesh route will only be able to traverse up slopes
  // which are under the angle specified in the m_fMaxSlopeNavigable member of
  // the accompanying NAVDATA structure.

  ENAV_ADVANCED_USE_MAX_SLOPE_NAVIGABLE = 128,

  //***************************************************************************
  // ENAV_STOP_EXACTLY [ DEPRACATED ]
  // DERPACATED : Peds will always attempt to stop exactly, unless the new
  // flag ENAV_SUPPRESS_EXACT_STOP is specified..
  // ENAV_STOP_EXACTLY will do nothing, and at some point will be removed.

  ENAV_STOP_EXACTLY = 512,

  //***************************************************************************
  // ENAV_ACCURATE_WALKRUN_START
  // The entity will look ahead in its path for a longer distance to make the
  // walk/run start go more in the right direction
  // Especially useful when ped start from inside an object boundaries
  // But has to be used carefully, the ped might be more prone to walk into
  // things during the walk/runstart with this flag set

  ENAV_ACCURATE_WALKRUN_START = 1024,

  //***************************************************************************
  // ENAV_DONT_AVOID_PEDS
  // Disables ped-avoidance for this path while we move.

  ENAV_DONT_AVOID_PEDS = 2048,

  //**********************************************************************************************
  // ENAV_DONT_ADJUST_TARGET_POSITION
  // If target pos is inside the boundingbox of an object it will otherwise be pushed out
  // TO BE USED WITH EXTREME CAUTION!!! Only if asked specificly to use this

  ENAV_DONT_ADJUST_TARGET_POSITION = 4096,

  //**************************************************************************************
  // ENAV_SUPPRESS_EXACT_STOP
  // Turns off the default behaviour, which is to stop exactly at the target position.
  // Occasionally this can cause footsliding/skating problems.

  ENAV_SUPPRESS_EXACT_STOP = 8192,

  //******************************************************************************************
  // ENAV_ADVANCED_USE_CLAMP_MAX_SEARCH_DISTANCE
  // Prevents the path-search from finding paths outside of this search distance.
  // This can be used to prevent peds from finding long undesired routes.
  // The value 'm_fClampMaxSearchDistance' must be set in the accompanying NAVDATA structure,
  // and this value must be between 1 and 255 (corresponds to game units).
  // The seach area is limited to an axis aligned box containing a sphere of the given radius.

  ENAV_ADVANCED_USE_CLAMP_MAX_SEARCH_DISTANCE = 16384,

  //**************************************************************************************
  // ENAV_PULL_FROM_EDGE_EXTRA
  // Pulls out the paths from edges at corners for a longer distance, to prevent peds walking
  // into stuff. This could in rare cases generate bigger quirks in the paths so use only
  // when it is necessary

  ENAV_PULL_FROM_EDGE_EXTRA = 32768,
}

//*********************************************************************************************
//  STRUCT NAVDATA
//  Additional data which is passed into the TASK_FOLLOW_NAV_MESH_TO_COORD_ADVANCED command.

// STRUCT NAVDATA

// 	// Heading in degrees
//     FLOAT m_fSlideToCoordHeading

//     // Max slope which this ped can move over (0 = can only move on flat, 45 means cannot move on anything above 1:1 slope, 90 means can move on any slope)
//     FLOAT m_fMaxSlopeNavigable

//     // Clamp the search distance to this value, path-search will not search further than this distance (value must be between 1 and 255 inclusive)
//     FLOAT m_fClampMaxSearchDistance

// ENDSTRUCT

//**********************************************************************************************
// EWDR_SCRIPT_FLAGS
// This enumeration defines the set of bitflags which may be passed in to TASK_WANDER_STANDARD

export enum EWDR_SCRIPT_FLAGS {
  EWDR_DEFAULT = 0,

  //*******************************************************************
  // EWDR_KEEP_MOVING_WHILST_WAITING_FOR_FIRST_PATH
  // Forces the ped to keep moving whilst waiting for the first path

  EWDR_KEEP_MOVING_WHILST_WAITING_FOR_FIRST_PATH = 1,
}

//******************************************************************************************
// ESEEK_ENTITY_OFFSET_FLAGS
// Bit flags which can be passed into TASK_GOTO_ENTITY_OFFSET & TASK_GOTO_ENTITY_OFFSET_XY

export enum ESEEK_ENTITY_OFFSET_FLAGS {
  ESEEK_DEFAULT = 0,

  //*********************************************************************
  // ESEEK_OFFSET_ORIENTATES_WITH_ENTITY
  // Specifies that the XY offset orientates with the entity.
  // Only valid with TASK_GOTO_ENTITY_OFFSET_XY

  ESEEK_OFFSET_ORIENTATES_WITH_ENTITY = 1,

  //*********************************************************************
  // ESEEK_KEEP_TO_PAVEMENTS
  // The ped will attempt to keep to pavements whilst seeking the targe entity

  ESEEK_KEEP_TO_PAVEMENTS = 2,
}

//******************************************************************************************
// EGOTO_ENTITY_FLAGS
// Bit flags which can be passed into TASK_GOTO_ENTITY

export enum EGOTO_ENTITY_FLAGS {
  EGOTO_ENTITY_DEFAULT = 0,

  //*********************************************************************
  // EGOTO_ENTITY_NEVER_SLOW_FOR_PATH_LENGTH
  // When following an entity, this ped will never slow down because of
  // a short path.
  // Only valid with TASK_GOTO_ENTITY

  EGOTO_ENTITY_NEVER_SLOW_FOR_PATH_LENGTH = 1,
}

//***********************************************************************************
// EWAYPOINT_FOLLOW_FLAGS
// A combination of these flags can be passed into TASK_FOLLOW_WAYPOINT_RECORDING

export enum EWAYPOINT_FOLLOW_FLAGS {
  EWAYPOINT_DEFAULT = 0,

  //****************************************************************************
  // EWAYPOINT_TURN_TO_FACE_WAYPOINT_HEADING_AT_END
  // Turns the ped to face the heading of the final waypoint when the task ends

  EWAYPOINT_TURN_TO_FACE_WAYPOINT_HEADING_AT_END = 1,

  //***************************************************************
  // EWAYPOINT_NAVMESH_TO_INITIAL_WAYPOINT
  // If necessary, uses the navmesh to get to the initial waypoint

  EWAYPOINT_NAVMESH_TO_INITIAL_WAYPOINT = 2,

  //********************************************************************************
  // EWAYPOINT_NAVMESH_BACK_TO_WAYPOINT_IF_LEFT_ROUTE
  // If the ped has left the route, will use the navmesh to return to last position

  EWAYPOINT_NAVMESH_BACK_TO_WAYPOINT_IF_LEFT_ROUTE = 4,

  //*************************************************************************************************
  // EWAYPOINT_START_FROM_CLOSEST_POINT
  // Will start (or resume if interrupted) the waypoint playback from the closest segment to the ped

  EWAYPOINT_START_FROM_CLOSEST_POINT = 8,

  //*********************************************************************************
  // EWAYPOINT_VEHICLES_USE_AI_SLOWDOWN
  // Vehicle AI will calculate speeds for turns instead of using the recorded values

  EWAYPOINT_VEHICLES_USE_AI_SLOWDOWN = 16,

  //*********************************************************************************
  // EWAYPOINT_DO_NOT_RESPOND_TO_COLLISION_EVENTS
  // Ignore all collisions with other peds, players, objects and vehicles

  EWAYPOINT_DO_NOT_RESPOND_TO_COLLISION_EVENTS = 32,

  //*********************************************************************************
  // EWAYPOINT_DO_NOT_SLOW_FOR_CORNERS
  // Ped will not slow for corners

  EWAYPOINT_DO_NOT_SLOW_FOR_CORNERS = 64,

  //*********************************************************************************
  // EWAYPOINT_START_TASK_INITIALLY_AIMING
  // Ped starts the task aiming at a position directly ahead of him
  // (avoids the ped lowering weapon briefly when first given this task)

  EWAYPOINT_START_TASK_INITIALLY_AIMING = 128,

  //*********************************************************************************
  // EWAYPOINT_START_TASK_EXACTSTOP
  // Ped will to an exact stop at the end of the route

  EWAYPOINT_START_TASK_EXACTSTOP = 256,

  //*********************************************************************************
  // EWAYPOINT_USE_TIGHTER_TURN_SETTINGS
  // Ped will be able to turn faster than normal, to help negotiate awkward spaces

  EWAYPOINT_USE_TIGHTER_TURN_SETTINGS = 512,

  //*********************************************************************************
  // EWAYPOINT_ALLOW_STEERING_AROUND_PEDS
  // Ped will perform ped/ped avoidance (unless playback is set as non-interruptible)

  EWAYPOINT_ALLOW_STEERING_AROUND_PEDS = 1024,

  //*********************************************************************************
  // EWAYPOINT_SUPPRESS_EXACTSTOP
  // Suppress exact stops

  EWAYPOINT_SUPPRESS_EXACTSTOP = 2048,

  //*******************************************************************************************************************
  // EWAYPOINT_SLOW_MORE_FOR_CORNERS
  // Dials up the amount which peds can slow to take corners - helps fix issues with peds running into doorframes, etc

  EWAYPOINT_SLOW_MORE_FOR_CORNERS = 4096,
}

//*****************************************************************************************
// EASSISTED_ROUTE_FLAGS
// A combination of these flags can be passed into ASSISTED_MOVEMENT_SET_ROUTE_PROPERTIES

export enum EASSISTED_ROUTE_FLAGS {
  EASSISTED_DEFAULT = 0,

  //****************************************************************
  // EASSISTED_ROUTE_ACTIVE_WHEN_STRAFING
  // Means that this route is active whilst the player is strafing

  EASSISTED_ROUTE_ACTIVE_WHEN_STRAFING = 2,

  //**********************************************************************************************
  // EASSISTED_ROUTE_DISABLE_IN_FORWARDS_DIRECTION
  // This route will not work in the forwards direction (the direction in which it was authored)

  EASSISTED_ROUTE_DISABLE_IN_FORWARDS_DIRECTION = 4,

  //********************************************************************************************************
  // EASSISTED_ROUTE_DISABLE_IN_REVERSE_DIRECTION
  // This route will not work in the reverse direction (opposite to the direction in which it was authored)

  EASSISTED_ROUTE_DISABLE_IN_REVERSE_DIRECTION = 8,
}

// NOTE: These are now mapped (as closely as possible) to firing patterns defined in commands_ped.sch
export enum FIRING_TYPE {
  FIRING_TYPE_DEFAULT = 0, // Some of these don't translate to firing patterns so we'll just not use those ones
  FIRING_TYPE_1_BURST = FIRING_TYPE_DEFAULT, // Uses FIRING_TYPE_DEFAULT as it's no longer a valid type
  FIRING_TYPE_1_THEN_AIM = hash("FIRING_PATTERN_SINGLE_SHOT"), // Fire 1 bullet then aim for the duration
  FIRING_TYPE_RANDOM_BURSTS = hash("FIRING_PATTERN_BURST_FIRE"), // Fire random bursts for the time, can change the frequency using SET_PED_SHOOT_RATE
  FIRING_TYPE_CLIP = FIRING_TYPE_DEFAULT, // Uses FIRING_TYPE_DEFAULT as it's no longer a valid type
  FIRING_TYPE_CONTINUOUS = hash("FIRING_PATTERN_FULL_AUTO"), // Fires at the maximum rate for the duration, reloading if the clips empty
}

// Only Pos/Neg Y will work correctly, since pitch is limited and we cannot control roll directly
// Should be safe to use for perpendicular directions though
export enum MOVEMENT_AXIS {
  MOVE_POSX = 0,
  MOVE_NEGX = 1,
  MOVE_POSY = 2,
  MOVE_NEGY = 3,
  MOVE_POSZ = 4,
  MOVE_NEGZ = 5,
}

// Cover exit types
export enum COVER_EXIT_TYPE {
  IDLE_COVER_EXIT = 1,
  AIMING_COVER_EXIT = 2,
  CORNER_COVER_EXIT = 3,
}

//  This enum has to match the enum in script_tasks.h
export enum SCRIPT_TASK_NAME {
  SCRIPT_TASK_ANY,
  SCRIPT_TASK_INVALID,
  SCRIPT_TASK_PAUSE,
  SCRIPT_TASK_STAND_STILL,
  DEPRECATED_SCRIPT_TASK_FALL_AND_GET_UP,
  SCRIPT_TASK_JUMP,
  SCRIPT_TASK_COWER,
  SCRIPT_TASK_HANDS_UP,
  SCRIPT_TASK_DUCK,
  DEPRECATED_SCRIPT_TASK_SCRATCH_HEAD,
  DEPRECATED_SCRIPT_TASK_LOOK_ABOUT,
  SCRIPT_TASK_ENTER_VEHICLE,
  SCRIPT_TASK_LEAVE_VEHICLE,
  SCRIPT_TASK_VEHICLE_DRIVE_TO_COORD,
  SCRIPT_TASK_VEHICLE_DRIVE_TO_COORD_LONGRANGE,
  SCRIPT_TASK_VEHICLE_DRIVE_WANDER,
  SCRIPT_TASK_GO_STRAIGHT_TO_COORD,
  SCRIPT_TASK_GO_STRAIGHT_TO_COORD_RELATIVE_TO_ENTITY,
  DEPRECATED_SCRIPT_TASK_GO_STRAIGHT_TO_COORD_RELATIVE_TO_VEHICLE,
  SCRIPT_TASK_ACHIEVE_HEADING,
  SCRIPT_TASK_FOLLOW_POINT_ROUTE,
  SCRIPT_TASK_GO_TO_ENTITY,
  DEPRECATED_SCRIPT_TASK_GO_TO_PED,
  DEPRECATED_SCRIPT_TASK_FLEE_POINT,
  DEPRECATED_SCRIPT_TASK_FLEE_PED,
  SCRIPT_TASK_SMART_FLEE_POINT,
  SCRIPT_TASK_SMART_FLEE_PED,
  SCRIPT_TASK_WANDER_STANDARD,
  SCRIPT_TASK_FOLLOW_NAV_MESH_TO_COORD,
  SCRIPT_TASK_GO_TO_COORD_ANY_MEANS,
  SCRIPT_TASK_PERFORM_SEQUENCE,
  SCRIPT_TASK_LEAVE_ANY_VEHICLE,
  SCRIPT_TASK_AIM_GUN_SCRIPTED,
  SCRIPT_TASK_AIM_GUN_AT_ENTITY,
  SCRIPT_TASK_GO_TO_COORD_WHILE_SHOOTING,
  SCRIPT_TASK_TURN_PED_TO_FACE_ENTITY,
  DEPRECATED_SCRIPT_TASK_TURN_PED_TO_FACE_PED,
  SCRIPT_TASK_AIM_GUN_AT_COORD,
  SCRIPT_TASK_SHOOT_AT_COORD,
  DEPRECATED_SCRIPT_TASK_DESTROY_VEHICLE,
  DEPRECATED_SCRIPT_TASK_DIVE_AND_GET_UP,
  SCRIPT_TASK_SHUFFLE_TO_NEXT_VEHICLE_SEAT,
  SCRIPT_TASK_EVERYONE_LEAVE_VEHICLE,
  DEPRECATED_SCRIPT_TASK_DIVE_FROM_ATTACHMENT_AND_GET_UP,
  SCRIPT_TASK_GOTO_ENTITY_OFFSET,
  DEPRECATED_SCRIPT_TASK_GOTO_PED_OFFSET,
  DEPRECATED_SCRIPT_TASK_SIT_DOWN,
  SCRIPT_TASK_TURN_PED_TO_FACE_COORD,
  SCRIPT_TASK_DRIVE_POINT_ROUTE,
  DEPRECATED_SCRIPT_TASK_GO_TO_COORD_WHILE_AIMING,
  SCRIPT_TASK_VEHICLE_TEMP_ACTION,
  SCRIPT_TASK_BRING_VEHICLE_TO_HALT,
  SCRIPT_TASK_VEHICLE_MISSION,
  DEPRECATED_SCRIPT_TASK_GO_TO_OBJECT,
  DEPRECATED_SCRIPT_TASK_WEAPON_ROLL,
  DEPRECATED_SCRIPT_TASK_SIDEWAYS_DIVE,
  SCRIPT_TASK_DRIVE_BY,
  SCRIPT_TASK_USE_MOBILE_PHONE,
  SCRIPT_TASK_WARP_PED_INTO_VEHICLE,
  DEPRECATED_SCRIPT_TASK_USE_ATTRACTOR,
  SCRIPT_TASK_SHOOT_AT_ENTITY,
  DEPRECATED_SCRIPT_TASK_SHOOT_AT_PED,
  DEPRECATED_SCRIPT_TASK_FLEE_PED_ANY_MEANS,
  DEPRECATED_SCRIPT_TASK_DEAD,
  DEPRECATED_SCRIPT_TASK_GOTO_VEHICLE,
  SCRIPT_TASK_CLIMB,
  SCRIPT_TASK_PERFORM_SEQUENCE_FROM_PROGRESS,
  SCRIPT_TASK_GOTO_ENTITY_AIMING,
  DEPRECATED_SCRIPT_TASK_GOTO_PED_AIMING,
  DEPRECATED_SCRIPT_TASK_JETPACK,
  SCRIPT_TASK_SET_PED_DECISION_MAKER,
  SCRIPT_TASK_SET_PED_DEFENSIVE_AREA,
  DEPRECATED_SCRIPT_TASK_HOLD_OBJECT,
  DEPRECATED_SCRIPT_TASK_COMPLEX_PICKUP_OBJECT,
  SCRIPT_TASK_PED_SLIDE_TO_COORD,
  DEPRECATED_SCRIPT_TASK_SWIM_TO_COORD,
  SCRIPT_TASK_DRIVE_POINT_ROUTE_ADVANCED,
  SCRIPT_TASK_PED_SLIDE_TO_COORD_AND_PLAY_ANIM,
  DEPRECATED_SCRIPT_TASK_FOLLOW_PATROL_ROUTE,
  DEPRECATED_SCRIPT_TASK_GREET_PARTNER,
  DEPRECATED_SCRIPT_TASK_DIE_NAMED_ANIM,
  DEPRECATED_SCRIPT_TASK_FOLLOW_FOOTSTEPS,
  DEPRECATED_SCRIPT_TASK_WALK_ALONGSIDE_PED,
  DEPRECATED_SCRIPT_TASK_USE_CLOSEST_MAP_ATTRACTOR,
  DEPRECATED_SCRIPT_TASK_SET_IGNORE_WEAPON_RANGE_FLAG,
  DEPRECATED_SCRIPT_TASK_HAND_GESTURE,
  SCRIPT_TASK_PLAY_ANIM,
  DEPRECATED_SCRIPT_TASK_PLAY_ANIM_ADVANCED, //	CommandTaskPlayAnimAdvanced uses SCRIPT_TASK_PLAY_ANIM rather than SCRIPT_TASK_PLAY_ANIM_ADVANCED
  DEPRECATED_SCRIPT_SET_TASK_PLAY_ANIM_PLAYBACK_COORDS,
  DEPRECATED_SCRIPT_TASK_PED_ARREST_PED, //	gta_ny
  SCRIPT_TASK_ARREST_PED,
  SCRIPT_TASK_COMBAT,
  SCRIPT_TASK_COMBAT_TIMED,
  SCRIPT_TASK_SEEK_COVER_FROM_POS,
  SCRIPT_TASK_SEEK_COVER_FROM_PED,
  SCRIPT_TASK_SEEK_COVER_TO_COVER_POINT,
  DEPRECATED_SCRIPT_TASK_SET_COMBAT_DECISION_MAKER,
  SCRIPT_TASK_TOGGLE_DUCK,
  DEPRECATED_SCRIPT_TASK_USE_SKIS,
  SCRIPT_TASK_GUARD_DEFENSIVE_AREA,
  DEPRECATED_SCRIPT_TASK_PICKUP_AND_CARRY_OBJECT,
  DEPRECATED_SCRIPT_TASK_SEEK_COVER_TO_OBJECT,
  SCRIPT_TASK_SEEK_COVER_TO_COORDS,
  DEPRECATED_SCRIPT_TASK_SIT_DOWN_PLAY_ANIM,
  SCRIPT_TASK_GUARD_ANGLED_DEFENSIVE_AREA,
  SCRIPT_TASK_STAND_GUARD,
  SCRIPT_TASK_CLIMB_LADDER,
  DEPRECATED_SCRIPT_TASK_SIT_DOWN_ON_OBJECT,
  SCRIPT_TASK_GUARD_SPHERE_DEFENSIVE_AREA,
  SCRIPT_TASK_START_SCENARIO_IN_PLACE,
  SCRIPT_TASK_START_SCENARIO_AT_POSITION,
  SCRIPT_TASK_START_VEHICLE_SCENARIO,
  SCRIPT_TASK_PUT_PED_DIRECTLY_INTO_COVER,
  SCRIPT_TASK_PUT_PED_DIRECTLY_INTO_COVER_FROM_TARGET,
  SCRIPT_TASK_PUT_PED_DIRECTLY_INTO_MELEE,
  SCRIPT_TASK_GUARD_CURRENT_POSITION,
  SCRIPT_TASK_USE_NEAREST_SCENARIO_TO_POS,
  SCRIPT_TASK_USE_NEAREST_SCENARIO_CHAIN_TO_POS,
  DEPRECATED_SCRIPT_TASK_LEAVE_GROUP,
  SCRIPT_TASK_PERFORM_SEQUENCE_LOCALLY,
  SCRIPT_TASK_COMBAT_HATED_TARGETS_IN_AREA,
  SCRIPT_TASK_COMBAT_HATED_TARGETS_AROUND_PED,
  DEPRECATED_SCRIPT_TASK_HOLSTERING_WEAPON,
  DEPRECATED_SCRIPT_TASK_COMBAT_ROLL,
  DEPRECATED_SCRIPT_TASK_MOBILE_CONVERSATION,
  SCRIPT_TASK_SWAP_WEAPON,
  SCRIPT_TASK_RELOAD_WEAPON,
  DEPRECATED_SCRIPT_TASK_DROP_OBJECT,
  SCRIPT_TASK_COMBAT_HATED_TARGETS_AROUND_PED_TIMED,
  SCRIPT_TASK_GET_OFF_BOAT,
  SCRIPT_TASK_FOLLOW_NAVMESH_TO_COORD_ADVANCED,
  SCRIPT_TASK_PATROL,
  SCRIPT_TASK_STAY_IN_COVER,
  SCRIPT_TASK_HANG_GLIDER,
  SCRIPT_TASK_FOLLOW_TO_OFFSET_OF_ENTITY,
  SCRIPT_TASK_FOLLOW_TO_OFFSET_OF_PICKUP,
  SCRIPT_TASK_GO_TO_COORD_WHILE_AIMING_AT_COORD,
  SCRIPT_TASK_GO_TO_COORD_WHILE_AIMING_AT_ENTITY,
  DEPRECATED_SCRIPT_TASK_GO_TO_COORD_WHILE_AIMING_AT_PED,
  DEPRECATED_SCRIPT_TASK_GO_TO_COORD_WHILE_AIMING_AT_VEHICLE,
  DEPRECATED_SCRIPT_TASK_GO_TO_COORD_WHILE_AIMING_AT_OBJECT,
  SCRIPT_TASK_GO_TO_ENTITY_WHILE_AIMING_AT_COORD,
  DEPRECATED_SCRIPT_TASK_GO_TO_PED_WHILE_AIMING_AT_COORD,
  SCRIPT_TASK_GO_TO_ENTITY_WHILE_AIMING_AT_ENTITY,
  DEPRECATED_SCRIPT_TASK_GO_TO_PED_WHILE_AIMING_AT_PED,
  DEPRECATED_SCRIPT_TASK_GO_TO_PED_WHILE_AIMING_AT_VEHICLE,
  DEPRECATED_SCRIPT_TASK_GO_TO_PED_WHILE_AIMING_AT_OBJECT,
  SCRIPT_TASK_USE_WALKIE_TALKIE,
  SCRIPT_TASK_CHAT_TO_PED,
  DEPRECATED_SCRIPT_TASK_WARP_PED_ONTO_VEHICLE,
  SCRIPT_TASK_FIRE_FLARE,
  SCRIPT_TASK_BIND_POSE,
  SCRIPT_TASK_NM_ELECTROCUTE,
  SCRIPT_TASK_NM_HIGH_FALL,
  SCRIPT_TASK_NM_DANGLE,
  SCRIPT_TASK_NM_SLUNG_OVER_SHOULDER,
  SCRIPT_TASK_NM_STUMBLE,
  SCRIPT_TASK_SKY_DIVE,
  SCRIPT_TASK_PARACHUTE,
  SCRIPT_TASK_PARACHUTE_TO_TARGET,
  SCRIPT_SET_PARACHUTE_TASK_TARGET,
  SCRIPT_TASK_FOLLOW_WAYPOINT_ROUTE,
  DEPRECATED_SCRIPT_TASK_GET_ON_SKI_LIFT,
  SCRIPT_TASK_NM_ATTACH_TO_VEHICLE,
  SCRIPT_TASK_SET_BLOCKING_OF_NON_TEMPORARY_EVENTS,
  SCRIPT_TASK_MOVE_NETWORK,
  SCRIPT_TASK_SYNCHRONIZED_SCENE,
  SCRIPT_TASK_VEHICLE_SHOOT_AT_COORD,
  SCRIPT_TASK_VEHICLE_SHOOT_AT_ENTITY,
  SCRIPT_TASK_VEHICLE_PARK,
  SCRIPT_TASK_MOUNT_ANIMAL,
  SCRIPT_TASK_DISMOUNT_ANIMAL,
  SCRIPT_TASK_THROW_PROJECTILE,
  SCRIPT_TASK_VEHICLE_AIM_AT_COORD,
  SCRIPT_TASK_VEHICLE_AIM_AT_ENTITY,
  SCRIPT_TASK_VEHICLE_AIM_USING_CAMERA,
  SCRIPT_TASK_ADVANCE_TO_TARGET_IN_LINE,
  SCRIPT_TASK_RAPPEL_FROM_HELI,
  SCRIPT_TASK_GENERAL_SWEEP,
  SCRIPT_TASK_DRAG_PED_TO_COORD,
  SCRIPT_TASK_VEHICLE_FOLLOW_WAYPOINT_RECORDING,
  SCRIPT_TASK_RAPPEL_DOWN_WALL,
  SCRIPT_TASK_GO_TO_COORD_AND_AIM_AT_HATED_ENTITIES_NEAR_COORD,
  SCRIPT_TASK_WANDER_IN_AREA,
  SCRIPT_TASK_VEHICLE_GOTO_NAVMESH,
  SCRIPT_TASK_IN_CUSTODY,
  SCRIPT_TASK_LOOK_AT_ENTITY,
  SCRIPT_TASK_LOOK_AT_COORD,
  SCRIPT_TASK_VEHICLE_CHASE,
  SCRIPT_TASK_STEALTH_KILL,
  SCRIPT_TASK_HELI_CHASE,
  SCRIPT_TASK_PLANE_CHASE,
  SCRIPT_TASK_PLANE_LAND,
  SCRIPT_TASK_SHOCKING_EVENT_BACK_AWAY,
  SCRIPT_TASK_SHOCKING_EVENT_HURRY_AWAY,
  SCRIPT_TASK_SHOCKING_EVENT_REACT,
  SCRIPT_TASK_WRITHE,
  SCRIPT_TASK_EXIT_COVER,
  SCRIPT_TASK_PLANT_BOMB,
  SCRIPT_TASK_INVESTIGATE_COORDS,
  SCRIPT_TASK_WANDER_SPECIFIC,
  SCRIPT_TASK_SHARK_CIRCLE_COORD,
  SCRIPT_TASK_SHARK_CIRCLE_PED,
  SCRIPT_TASK_REACT_AND_FLEE_COORD,
  SCRIPT_TASK_REACT_AND_FLEE_PED,
  SCRIPT_TASK_GO_TO_COORD_ANY_MEANS_EXTRA_PARAMS,
  SCRIPT_TASK_USE_NEAREST_TRAIN_SCENARIO_TO_POS,
  SCRIPT_TASK_JETPACK,
  SCRIPT_TASK_GO_TO_COORD_ANY_MEANS_EXTRA_PARAMS_WITH_CRUISE_SPEED,
  SCRIPT_TASK_AGITATED_ACTION,
}

export enum SCRIPTTASKSTATUS {
  WAITING_TO_START_TASK = 0,
  PERFORMING_TASK,
  DORMANT_TASK,
  VACANT_STAGE,
  GROUP_TASK_STAGE,
  ATTRACTOR_SCRIPT_TASK_STAGE,
  SECONDARY_TASK_STAGE,
  FINISHED_TASK,
}

export enum COVERPOINT_USAGE {
  COVUSE_WALLTOLEFT, // Fires round to the right
  COVUSE_WALLTORIGHT, // Fires round to the left
  COVUSE_WALLTOBOTH, // Must fire over the top, used for low or high cover points
  COVUSE_WALLTONEITHER, // Fires either left or right
}

export enum COVERPOINT_HEIGHT {
  COVHEIGHT_LOW = 0, // < 1.4m Will crouch behind and fire over the top
  COVHEIGHT_HIGH, // <Unused
  COVHEIGHT_TOOHIGH, // >= 2.0m Must spin left or right to fire depending on WALL_TO_LEFT or WALL_TO_RIGHT COVERPOINT_USAGE
}

export enum COVERPOINT_ARC {
  COVARC_180 = 0,
  COVARC_120,
  COVARC_90,
  COVARC_0TO60,
  COVARC_300TO0,
  COVARC_0TO45,
  COVARC_315TO0,
}

export enum COVERPOINT_STATUS {
  COVSTATUS_Invalid = 1, // not been checked yet
  COVSTATUS_Clear = 2, // cover point is clear
  COVSTATUS_PositionBlocked = 4, // cover point is blocked by something
}

export enum DUCK_TOGGLE {
  TOGGLE_DUCK_AUTO = -1,
  TOGGLE_DUCK_OFF,
  TOGGLE_DUCK_ON,
}

export enum MOBILE_PHONE_SUB_TASK {
  MOBILE_SUB_TASK_PHONE_IN,
  MOBILE_SUB_TASK_PHONE_TALK,
  MOBILE_SUB_TASK_PHONE_OUT,
  MOBILE_SUB_TASK_PHONE_OTHER,
}

export enum SEATED_FLAGS {
  SF_NONE = 0,
  SF_DOINSTANTLY = 1,
  SF_LOOPANIM = 2,
}

export enum CLIMB_STATE {
  CS_NOT_CLIMBING = 0,
  CS_CLIMBING, //CS_CLIMBING means the ped is climbing, or valuting
  CS_HANGING, //CS_HANGING means that the ped is hanging from an edge and is ready to use a shimmy task.
  CS_SHIMMYING_LEFT,
  CS_SHIMMYING_RIGHT,
}

export enum ROLL_DIR {
  RD_LEFT = 0,
  RD_RIGHT,
  RD_FWD,
  RD_BWD,
}

export enum FLARE_TYPE {
  FT_WARNING = 0, // Ped will fire a flare high above the target
  FT_LIGHT_TARGET, // Ped will try to shed some light on the target
  FT_ATTACK_TARGET, // Ped will fire directly at the target
}

export enum CHAT_FLAGS {
  CF_IS_INITIATOR = 1,
  CF_DO_QUICK_CHAT = 2,
  CF_GO_TO_SPECIFIC_POS = 4,
  CF_USE_CUSTOM_HEADING = 8,
  CF_AUTO_CHAT = 16,
  CF_PLAY_GREETING_GESTURES = 32, // Will say a generic greeting to the ped they are talking to initially, this will force the other ped into a response
  CF_PLAY_GOODBYE_GESTURES = 64, // Similar to the above but on leaving (Note, you should only set this and the above flag on one of the peds as response is automatically handled)
}

// Keep in sync with eScriptAnimFlags in commands_task.cpp

export enum ANIMATION_FLAGS {
  AF_DEFAULT = 0, //
  AF_LOOPING = 1, // Repeat the animation
  AF_HOLD_LAST_FRAME = 2, // Hold on the last frame of the animation
  AF_REPOSITION_WHEN_FINISHED = 4, // When the animation finishes pop the peds physical reprsentation position to match the visual representations position Note that the animator must not unwind the animation and must have an independent mover node
  AF_NOT_INTERRUPTABLE = 8, // Can the task not be interupted by extenal events
  AF_UPPERBODY = 16, // Only plays the upper body part of the animation. Dampens any motion caused by the lower body animation.Note that the animation should include the root node
  AF_SECONDARY = 32, // The task will run in the secondary task slot. This means it can be used aswell as a movement task (for instance)
  AF_REORIENT_WHEN_FINISHED = 64, // When the animation finishes pop the peds physical reprsentation direction to match the visual representations direction. Note that the animator must not unwind the animation and must have an independent mover node
  AF_ABORT_ON_PED_MOVEMENT = 128, // Ends the animation early if the ped attemps to move e.g. if the player tries to move using the controller. Can also be used to blend out automatically when an ai ped starts moving by combining it with the AF_SECONDARY flag.
  AF_ADDITIVE = 256, // Play back the animation additively. Note, this will only produce sensible results on specifically authored additive animations!
  AF_TURN_OFF_COLLISION = 512, // Do not react to collision detection whilst this anim is playing
  AF_OVERRIDE_PHYSICS = 1024, // Do not apply any physics forces whilst the anim is playing. Automatically turns off collision, extracts any initial offset provided in the clip and uses per frame mover extraction.
  AF_IGNORE_GRAVITY = 2048, // Do not apply gravity while the anim is playing
  AF_EXTRACT_INITIAL_OFFSET = 4096, // Extract an initial offset from the playback position authored by the animator
  // Use this flag when playing back anims on different peds which have been authored
  // to sync with each other
  AF_EXIT_AFTER_INTERRUPTED = 8192, // Exit the animation task if it is interrupted by another task (ie Natural Motion).  Without this flag bing set looped animations will restart ofter the NM task

  // Tag synchronizer flags - sync the anim against ped movement (walking / running / etc)
  AF_TAG_SYNC_IN = 16384, // Sync the anim whilst blending in (use for seamless transitions from walk / run into a full body anim)
  AF_TAG_SYNC_OUT = 32768, // Sync the anim whilst blending out (use for seamless transitions from a full body anim into walking / running behaviour)
  AF_TAG_SYNC_CONTINUOUS = 65536, // Sync all the time (Only usefull to synchronize a partial anim e.g. an upper body)

  AF_FORCE_START = 131072, // Force the anim task to start even if the ped is falling / ragdolling / etc. Can fix issues with peds not playing their anims immediately after a warp / etc
  AF_USE_KINEMATIC_PHYSICS = 262144, // Use the kinematic physics mode on the entity for the duration of the anim (it should push other entities out of the way, and not be pushed around by players / etc
  AF_USE_MOVER_EXTRACTION = 524288, // Updates the peds capsule position every frame based on the animation. Use in conjunction with AF_USE_KINEMATIC_PHYSICS to create characters that cannot be pushed off course by other entities / geometry / etc whilst playing the anim.

  AF_HIDE_WEAPON = 1048576, // Indicates that the ped's weapon should be hidden while this animation is playing.

  AF_ENDS_IN_DEAD_POSE = 2097152, // When the anim ends, kill the ped and use the currently playing anim as the dead pose
  AF_ACTIVATE_RAGDOLL_ON_COLLISION = 4194304, // If the peds ragdoll bounds make contact with something physical (that isn't flat ground) activate the ragdoll and fall over.
  AF_DONT_EXIT_ON_DEATH = 8388608, // Currently used only on secondary anim tasks. Secondary anim tasks will end automatically when the ped dies. Setting this flag stops that from happening."
  AF_ABORT_ON_WEAPON_DAMAGE = 16777216, // Allow aborting from damage events (including non-ragdoll damage events) even when blocking other ai events using AF_NOT_INTERRUPTABLE.
  AF_DISABLE_FORCED_PHYSICS_UPDATE = 33554432, // Prevent adjusting the capsule on the enter state (useful if script is doing a sequence of scripted anims and they are known to more or less stand still)
  AF_PROCESS_ATTACHMENTS_ON_START = 67108864, // Force the attachments to be processed at the start of the clip
  AF_EXPAND_PED_CAPSULE_FROM_SKELETON = 134217728, // Expands the capsule to the extents of the skeleton
  AF_USE_ALTERNATIVE_FP_ANIM = 268435456, // Plays an alternative first person version of the clip on the player when in first person mode (the first person clip must be in the same dictionary, and be named the same as the anim you're playing, but with _FP appended on the end)
  AF_BLENDOUT_WRT_LAST_FRAME = 536870912, // Start blending out the anim early, so that the blend out duration completes at the end of the animation.
  AF_USE_FULL_BLENDING = 1073741824, // Use full blending for this anim and override the heading/position adjustment in CTaskScriptedAnimation::CheckIfClonePlayerNeedsHeadingPositionAdjust(), so that we don't correct errors (special case such as scrip-side implemented AI tasks, i.e. diving)
}

export enum ANIM_PRIORITY_FLAGS {
  AF_PRIORITY_LOW = 0, // Use the lowest TASK_SCRIPTED_ANIMATION slot
  AF_PRIORITY_MEDIUM = 1, // Use the medium TASK_SCRIPTED_ANIMATION slot
  AF_PRIORITY_HIGH = 2, // Use the high TASK_SCRIPTED_ANIMATION slot
}

export enum IK_CONTROL_FLAGS {
  AIK_NONE = 0, // No Ik control during the task
  AIK_DISABLE_LEG_IK = 1, // Disable leg ik during the task
  AIK_DISABLE_ARM_IK = 2, // Disable arm ik during the task
  AIK_DISABLE_HEAD_IK = 4, // Disable head ik during the task
  AIK_DISABLE_TORSO_IK = 8, // Disable torso ik during the task
  AIK_DISABLE_TORSO_REACT_IK = 16, // Disable torso react ik during the task
  AIK_USE_LEG_ALLOW_TAGS = 32, // Use anim leg allow tags to determine when leg ik is enabled
  AIK_USE_LEG_BLOCK_TAGS = 64, // Use anim leg block tags to determine when leg ik is disabled
  AIK_USE_ARM_ALLOW_TAGS = 128, // Use anim arm allow tags to determine when ik is enabled
  AIK_USE_ARM_BLOCK_TAGS = 256, // Use anim arm block tags to determine when ik is disabled
  AIK_PROCESS_WEAPON_HAND_GRIP = 512, // Process the left hand weapon grip ik during the task
  AIK_USE_FP_ARM_LEFT = 1024, // Use first person ik setup for left arm (cannot be used with AIK_DISABLE_ARM_IK)
  AIK_USE_FP_ARM_RIGHT = 2048, // Use first person ik setup for right arm (cannot be used with AIK_DISABLE_ARM_IK)
  AIK_DISABLE_TORSO_VEHICLE_IK = 4096, // Disable torso vehicle ik during the task
  AIK_LINKED_FACIAL = 8192, // Searches the dictionary of the clip being played for another clip with the _facial suffix to be played as a facial animation.
}

export enum MOVE_NETWORK_FLAGS {
  MOVE_DEFAULT = 0,
  MOVE_USE_KINEMATIC_PHYSICS = 4,
  MOVE_SECONDARY = 8,
  MOVE_USE_FIRST_PERSON_ARM_IK_LEFT = 16,
  MOVE_USE_FIRST_PERSON_ARM_IK_RIGHT = 32,
}

// New blend duration defines - for use with TASK_SCRIPTED_ANIMATION
export const SLOW_BLEND_DURATION = 0.25;
export const NORMAL_BLEND_DURATION = 0.125;
export const FAST_BLEND_DURATION = 0.0625;
export const INSTANT_BLEND_DURATION = 0.0;

// Keep in sync with CTaskScriptedAnimation::ePlayBackState (TaskScriptedAnimation.h)
export enum ANIMATION_PLAYBACK_TYPE {
  APT_EMPTY = 0, // No anim will play at this priority
  APT_SINGLE_ANIM = 1, // A single anim will play at this priority
  APT_3_WAY_BLEND = 2, // A blend of three anims will be played at this priority. Weights can be controlled independently.
}

// Keep in sync with CTaskScriptedAnimation::InitSlotData (TaskScriptedAnimation.h)
// STRUCT ANIM_DATA

// 	ANIMATION_PLAYBACK_TYPE type = APT_EMPTY

// 	STRING	dictionary0 = NULL			// The dictionary name containing the first anim (used in single clip and three way blend)
// 	STRING	anim0		= NULL			// The first anim name
// 	FLOAT	phase0		= 0.0			// The starting phase
// 	FLOAT	rate0		= 1.0			// The rate (speed) to play back the anim at. 1.0 is standard rate
// 	FLOAT	weight0		= 1.0			// How blended in the anim will be. When using multiple anims this can be used to affect
// 										// how much of the anim is visible relative to other anims.

// 	STRING	dictionary1 = NULL			// The dictionary name containing the second anim (only used in three way blend)
// 	STRING	anim1		= NULL			// The second anim name
// 	FLOAT	phase1		= 0.0			// The starting phase
// 	FLOAT	rate1		= 1.0			// The rate (speed) to play back the anim at. 1.0 is standard rate
// 	FLOAT	weight1		= 1.0			// How blended in the anim will be. When using multiple anims this can be used to affect
// 										// how much of the anim is visible relative to other anims.

// 	STRING	dictionary2 = NULL			// The dictionary name containing the third anim (only used in 3 way blend)
// 	STRING	anim2		= NULL			// The third anim name
// 	FLOAT	phase2		= 0.0			// The starting phase
// 	FLOAT	rate2		= 1.0			// The rate (speed) to play back the anim at. 1.0 is standard rate
// 	FLOAT	weight2		= 1.0			// How blended in the anim will be. When using multiple anims this can be used to affect
// 										// how much of the anim is visible relative to other anims.

// 	INT 	filter			= 0						// The hash of the name of the filter to apply at this priority level
// 	FLOAT 	blendInDelta 	= NORMAL_BLEND_DURATION // How fast should this priority level be blended in
// 	FLOAT 	blendOutDelta	= NORMAL_BLEND_DURATION	// How fast should this priority level be blended out at the end
// 	INT 	timeToPlay		= -1					// Time (in milliseconds) to play this priority level for
// 	ANIMATION_FLAGS flags	= AF_DEFAULT			// Animation flags for this level
// 	IK_CONTROL_FLAGS ikFlags= AIK_NONE				// Ik control flags for this level

// ENDSTRUCT

// Keep in sync with CTaskMoVEScripted::ScriptInitialParameters (TaskMoveScripted.h)
// STRUCT MOVE_INITIAL_PARAMETERS

// 	INT		clipSetHash0			= 0			// Hash of the first initial clipset
// 	INT		clipSetVariableHash0	= 0			// Hash of the firstinitial variable clipset
// 	INT		clipSetHash1			= 0			// Hash of the second initial clipset
// 	INT		clipSetVariableHash1	= 0			// Hash of the second initial variable clipset

// 	STRING	floatParamName0			= NULL		// Name of the first float MoVE parameter
// 	FLOAT	floatParamValue0		= 0.0		// Value of the first float MoVE parameter
// 	FLOAT	floatParamLerpValue0	= -1.0		// Lerp value of the first float MoVE parameter
// 	STRING	floatParamName1			= NULL		// Name of the second float MoVE parameter
// 	FLOAT	floatParamValue1		= 0.0		// Value of the second float MoVE parameter
// 	FLOAT	floatParamLerpValue1	= -1.0		// Lerp value of the second float MoVE parameter

// 	STRING	boolParamName0			= NULL		// Name of the first bool MoVE parameter
// 	BOOL	boolParamValue0			= false		// Value of the first bool MoVE parameter
// 	STRING	boolParamName1			= NULL		// Name of the secon bool MoVE parameter
// 	BOOL	boolParamValue1			= false		// Value of the second bool MoVE parameter

// ENDSTRUCT

export enum SCRIPT_LOOK_FLAG {
  SLF_DEFAULT = 0,
  SLF_SLOW_TURN_RATE = 1, // turn the head toward the target slowly
  SLF_FAST_TURN_RATE = 2, // turn the head toward the target quickly
  SLF_EXTEND_YAW_LIMIT = 4, // wide yaw head limits
  SLF_EXTEND_PITCH_LIMIT = 8, // wide pitch head limit
  SLF_WIDEST_YAW_LIMIT = 16, // widest yaw head limit
  SLF_WIDEST_PITCH_LIMIT = 32, // widest pitch head limit
  SLF_NARROW_YAW_LIMIT = 64, // narrow yaw head limits
  SLF_NARROW_PITCH_LIMIT = 128, // narrow pitch head limit
  SLF_NARROWEST_YAW_LIMIT = 256, // narrowest yaw head limit
  SLF_NARROWEST_PITCH_LIMIT = 512, // narrowest pitch head limit
  SLF_USE_TORSO = 1024, // use the torso aswell as the neck and head (currently disabled)
  SLF_WHILE_NOT_IN_FOV = 2048, // keep tracking the target even if they are not in the hard coded FOV
  SLF_USE_CAMERA_FOCUS = 4096, // use the camera as the target
  SLF_USE_EYES_ONLY = 8192, // only track the target with the eyes
  SLF_USE_LOOK_DIR = 16384, // use information in look dir DOF
  SLF_FROM_SCRIPT = 32768, // internal use only
  SLF_USE_REF_DIR_ABSOLUTE = 65536, // use absolute reference direction mode for solver
}

// Keep in sync with eLookAtPriority in IKManager.h
export enum SCRIPT_LOOK_PRIORITY {
  SLF_LOOKAT_VERY_LOW = 0,
  SLF_LOOKAT_LOW,
  SLF_LOOKAT_MEDIUM,
  SLF_LOOKAT_HIGH,
  SLF_LOOKAT_VERY_HIGH,
}

export enum SCRIPT_INVESTIGATE_FLAG {
  SIF_DEFAULT = 0,
  SIF_DONT_RETURN_TO_ORIGINAL_POSITION = 1, // Don't return to the position you started in when the investigation is finished
}

export enum PATROL_ALERT_STATE {
  PAS_CASUAL = 0,
  PAS_ALERT,
}

//*********************************************************************************************************
// ENTER_EXIT_VEHICLE_FLAGS
// Set of flags to define the behaviour of the enter and exit vehicle tasks
export enum ENTER_EXIT_VEHICLE_FLAGS {
  // If the task is interupted (bumped, shot), dont resume.
  ECF_RESUME_IF_INTERRUPTED = 1,
  // Warps ped to entry point ready to open the door/enter seat
  ECF_WARP_ENTRY_POINT = 2,
  // Jack the ped occupying the vehicle, regardless of relationship status
  ECF_JACK_ANYONE = 8,
  // Warp the ped onto the vehicle
  ECF_WARP_PED = 16,
  // Dont wait for the vehicle to stop before exiting
  ECF_DONT_WAIT_FOR_VEHICLE_TO_STOP = 64,
  // Dont close the vehicle door
  ECF_DONT_CLOSE_DOOR = 256,
  // Allow ped to warp to the seat if entry is blocked
  ECF_WARP_IF_DOOR_IS_BLOCKED = 512,
  // Jump out of the vehicle
  ECF_JUMP_OUT = 4096,
  // TASK_LEAVE_ANY_VEHICLE auto defaults the ECF_WARP_IF_DOOR_IS_BLOCKED, set this flag to not set that
  ECF_DONT_DEFAULT_WARP_IF_DOOR_BLOCKED = 65536,
  // Use entry/exit point on the left hand side
  ECF_USE_LEFT_ENTRY = 131072,
  // Use entry/exit point on the right hand side
  ECF_USE_RIGHT_ENTRY = 262144,
  // When jacking just pull the ped out, but don't get in
  ECF_JUST_PULL_PED_OUT = 524288,
  // Disable shuffling - forces ped to use direct door only
  ECF_BLOCK_SEAT_SHUFFLING = 1048576,
  //  Allow ped to warp if the shuffle link to that seat is blocked by someone
  ECF_WARP_IF_SHUFFLE_LINK_IS_BLOCKED = 4194304,
  // Never jack anyone when entering/exiting
  ECF_DONT_JACK_ANYONE = 8388608,
  // Wait for our entry point to be clear of peds before exiting
  ECF_WAIT_FOR_ENTRY_POINT_TO_BE_CLEAR = 16777216,
}

//Specifies what components are attached at the end of a playing a attach anim
export enum NM_ATTACH_COMPONENTS {
  NAC_LEFT_HAND = 1,
  NAC_RIGHT_HAND = 2,
  NAC_LEFT_FOOT = 4,
  NAC_RIGHT_FOOT = 8,

  NAC_LEFT_FOREARM = 16,
  NAC_RIGHT_FOREARM = 32,
  NAC_LEFT_SHIN = 64,
  NAC_RIGHT_SHIN = 128,

  NAC_LEFT_THIGH = 256,
  NAC_RIGHT_THIGH = 512,
}

// Specifies the list of available move networks
export enum MOVE_NETWORK {
  MOVE_NETWORK_MINIGAME_BENCHPRESS = 1,
  MOVE_NETWORK_MINIGAME_SQUATS,
}

// Scripted Gun Tasks
export enum SCRIPTED_GUN_TASK {
  SCRIPTED_GUN_TASK_ON_CRATE = hash("SCRIPTED_GUN_TASK_ON_CRATE"),
  SCRIPTED_GUN_TASK_HANGING_UPSIDE_DOWN = hash("SCRIPTED_GUN_TASK_HANGING_UPSIDE_DOWN"),
  SCRIPTED_GUN_TASK_ON_ROPE = hash("SCRIPTED_GUN_TASK_ON_ROPE"),
  SCRIPTED_GUN_TASK_DINGY_RPG = hash("SCRIPTED_GUN_TASK_DINGY_RPG"),
  SCRIPTED_GUN_TASK_CRATE_RPG = hash("SCRIPTED_GUN_TASK_CRATE_RPG"),
  SCRIPTED_GUN_TASK_CRATE_BUDDY = hash("SCRIPTED_GUN_TASK_CRATE_BUDDY"),
  SCRIPTED_GUN_TASK_PLANE_WING = hash("SCRIPTED_GUN_TASK_PLANE_WING"),
  SCRIPTED_GUN_TASK_BIKE = hash("SCRIPTED_GUN_TASK_BIKE"),
}

export enum ADVANCE_TO_TARGET_FLAGS {
  ATTF_DISABLE_AUTO_CROUCHING = 1,
  ATTF_DISABLE_HAND_SIGNALS = 2,
  ATTF_DEFAULT = 0,
}

export enum STARTING_HURT_MODE {
  SHM_ONGROUND = 0,
}

// Mobile Phone modes. Ensure this remains in sync with the "PhoneMode" enum in TaskMobilePhone.h.
export enum PHONE_MODE {
  Mode_None = 0,
  Mode_ToCall,
  Mode_ToText,
  Mode_ToCamera,
  Mode_Max,
}

export const WALK_BLEND_IN = 1.5; // 20frms
export const WALK_BLEND_OUT = -1.5; // 20frms
export const REALLY_SLOW_BLEND_IN = 2.0; // 15frms
export const REALLY_SLOW_BLEND_OUT = -2.0; // 15frms
export const SLOW_BLEND_IN = 4.0; // 8frms
export const SLOW_BLEND_OUT = -4.0; // 8frms
export const NORMAL_BLEND_IN = 8.0; // 4frms
export const NORMAL_BLEND_OUT = -8.0; // 4frms
export const FAST_BLEND_IN = 16.0; // 2frms
export const FAST_BLEND_OUT = -16.0; // 2frms
export const INSTANT_BLEND_IN = 1000.0; // 0frms
export const INSTANT_BLEND_OUT = -1000.0; // 0frms

export const DEFAULT_TIME_BEFORE_WARP = 20000;
export const DEFAULT_TIME_NEVER_WARP = -1;

export const DEFAULT_SEEK_RADIUS = 0.5;
export const DEFAULT_NAVMESH_RADIUS = 0.25;
export const DEFAULT_NAVMESH_FINAL_HEADING = 40000.0;

// Used by TASK_VEHICLE_ESCORT
export const DEFAULT_ESCORT_FORWARD_DIST = 5.0;
export const DEFAULT_ESCORT_SIDE_DIST = 2.0;
export const DEFAULT_ESCORT_SIDE_DIST_BIKE = 1.4;
export const DEFAULT_ESCORT_SIDE_DIST_HELI = 15.0;
