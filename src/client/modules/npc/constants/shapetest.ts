export enum SHAPETEST_STATUS {
  SHAPETEST_STATUS_NONEXISTENT = 0, // Shapetest requests are discarded if they are ignored for a frame or as soon as the results are returned
  SHAPETEST_STATUS_RESULTS_NOTREADY, // Not ready yet; try again next frame
  SHAPETEST_STATUS_RESULTS_READY, // The result is ready and the results have been returned to you. The shapetest request has also just been destroyed
}

//A list of the types of shape test available to script
export enum SHAPETEST_TYPE {
  SHAPETEST_INVALID = 0,
  SHAPETEST_LOSPROBE,
  //SHAPETEST_SPHERE, // Since nobody was using async sphere tests we disabled them
  SHAPETEST_BOUND,
  SHAPETEST_BOUNDINGBOX,
  SHAPETEST_BOX,
  SHAPETEST_CAPSULE,
}

// Make sure this is in sync with commands_shapetest.h enum.
export enum LOS_FLAGS {
  INCLUDE_MOVER = 1,
  INCLUDE_VEHICLE = 2,
  INCLUDE_PED = 4,
  INCLUDE_RAGDOLL = 8,
  INCLUDE_OBJECT = 16,
  INCLUDE_PICKUP = 32,
  INCLUDE_GLASS = 64,
  INCLUDE_RIVER = 128,
  INCLUDE_FOLIAGE = 256,
  INCLUDE_ALL = 511,
}

// Make sure this is in sync with commands_shapetest.h enum.
export const SCRIPT_SHAPETEST_OPTION_IGNORE_GLASS = 1;
export const SCRIPT_SHAPETEST_OPTION_IGNORE_SEE_THROUGH = 2;
export const SCRIPT_SHAPETEST_OPTION_IGNORE_NO_COLLISION = 4;
export const SCRIPT_SHAPETEST_OPTION_DEFAULT =
  SCRIPT_SHAPETEST_OPTION_IGNORE_GLASS |
  SCRIPT_SHAPETEST_OPTION_IGNORE_SEE_THROUGH |
  SCRIPT_SHAPETEST_OPTION_IGNORE_NO_COLLISION;
