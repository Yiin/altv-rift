// Ped Config flags, used to control ped behaviour/setup
export enum PED_CONFIG_FLAG {
  CreatedByFactory,
  CanBeShotInVehicle, // script can stop peds being shot when driving vehicle (including exposed ones like bikes)
  NoCriticalHits, // ped cannot be killed by a single bullet
  DrownsInWater, // does this ped drown or swim?
  DrownsInSinkingVehicle, // does this ped take damage whilst in a sinking vehicle?
  DiesInstantlyWhenSwimming, // Ped cannot swim and will die as soon as they are required to swim
  HasBulletProofVest, // is this ped wearing a bullet proof vest
  UpperBodyDamageAnimsOnly, // force ped to play only upper body damage anims from weapons
  NeverFallOffSkis, // Ped will never fall over on skis
  NeverEverTargetThisPed, // script control over player targeting
  ThisPedIsATargetPriority, // script control over player targeting
  TargettableWithNoLos, // script control over player targeting
  DoesntListenToPlayerGroupCommands, // script can set this so ped will be in players group but not reacting to commands
  NeverLeavesGroup,
  DoesntDropWeaponsWhenDead, // script command
  SetDelayedWeaponAsCurrent, // when the peds delayed weapon finally loads, set it as the peds current weapon
  KeepTasksAfterCleanUp, // If true ped will carry on with task even after script ped cleanup
  BlockNonTemporaryEvents, // ! Set to block any events that might interrupt the currently running tasks.
  HasAScriptBrain,
  WaitingForScriptBrainToLoad,
  AllowMedicsToReviveMe, // never allow this ped to be revived
  MoneyHasBeenGivenByScript, // script can give specific amount of money to ped (script peds don't drop any money by default)
  NotAllowedToCrouch, // Is this ped allowed to crouch at all?
  DeathPickupsPersist, // script command to control what type of pickups are created when ped dies
  IgnoreSeenMelee, // script command so ped doesn't stop to watch fights
  ForceDieIfInjured, // script command so missions peds die if injured
  DontDragMeOutCar, // force this ped can't be carjacked
  StayInCarOnJack, // script sets this to keep peds in car when the player steals it
  ForceDieInCar, // don't fall out car if killed
  GetOutUndriveableVehicle, // script can stop peds automatically getting out of vehicle when it's upside down or undrivable(for races and stuff)
  WillRemainOnBoatAfterMissionEnds, // script can stop peds automatically leaving boats when they become random chars, after a script quits
  DontStoreAsPersistent, // Some peds (like mission peds) should not be stored as persistent.
  WillFlyThroughWindscreen,
  DieWhenRagdoll,
  HasHelmet, // currently has helmet equipped?
  UseHelmet, // will the ped try to put on their helmet?
  DontTakeOffHelmet, // the ped will not take off their helmet (if equipped) while this is set
  HideInCutscene,
  PedIsEnemyToPlayer,
  DisableEvasiveDives,
  PedGeneratesDeadBodyEvents, // Generates shocking events as if dead
  DontAttackPlayerWithoutWantedLevel,
  DontInfluenceWantedLevel, // Can do any crime against this character and the cops turn a blind eye (no crime reported)
  DisablePlayerLockon,
  DisableLockonToRandomPeds,
  AllowLockonToFriendlyPlayers,
  DisableHornAudioWhenDead, //  " description="Disable the horn when a ped dies in the car and has his head against the wheel
  PedBeingDeleted,
  BlockWeaponSwitching, // Disable weapon switching while this is set
  BlockGroupPedAimedAtResponse, // Disable the behaviour which causes player-group peds to crouch when the player aims at them
  WillFollowLeaderAnyMeans, // Basically defines whether group peds will use cars etc to follow their leader (default=false)
  BlippedByScript, // Set to true if the char has ever been blipped, not 100% correct so don't use it on anything sensitive.
  DrawRadarVisualField, // Draw this peds visual field in the stealth radar
  StopWeaponFiringOnImpact, // Set to true to stop the peds weapon firing on impact when they drop it
  DissableAutoFallOffTests, // Set to true to stop ped scanning for things to fall off when shot by the player
  SteerAroundDeadBodies, // Forces peds to steer around dead bodies, the default is false.
  ConstrainToNavMesh, // Ped is constrained to navmesh's surface
  SyncingAnimatedProps, // Set this to true if the ped should attempt to synchronise the animations of an attached prop to its movement anims
  IsFiring,
  WasFiring,
  IsStanding, // is ped standing on something
  WasStanding, // was the ped standing last frame
  InVehicle, // is in a vehicle
  OnMount,
  AttachedToVehicle, // is attached to a vehicle
  IsSwimming, // is ped swimming in water
  WasSwimming, // was the ped swimming in water last frame
  IsSkiing, // is the ped skiing
  IsSitting, // is the ped sitting
  KilledByStealth, // Determines if this ped was killed by a stealth action
  KilledByTakedown, // Determines if this ped was killed by a takedown action
  Knockedout, // Determines if this ped was finished with a knockout action
  ClearRadarBlipOnDeath, // so peds automatically given blips will clear them again when they die (mainly used for peds recruited into players group)
  JustGotOffTrain, // train code uses this when grabbing random peds to get in trains
  JustGotOnTrain, // train code uses this when grabbing random peds to get in trains
  UsingCoverPoint, // set to true when a ped is in process of using a cover point
  IsInTheAir, // is in the air
  KnockedUpIntoAir, // has ped been knocked up into the air by a car collision
  IsAimingGun, // is ped aiming gun
  HasJustLeftCar, // used by navigation to force scan for cars collisions
  TargetWhenInjuredAllowed,
  CurrLeftFootCollNM, // footprints
  PrevLeftFootCollNM, // footprints
  CurrRightFootCollNM, // footprints
  PrevRightFootCollNM, // footprints
  HasBeenBumpedInCar, // Has this ped been bumped by a car while driving?
  InWaterTaskQuitToClimbLadder, // The in-water task has just quit in response to a ladder-climb request
  NMTwoHandedWeaponBothHandsConstrained, // when using physical 2-handed weapons, both hands have been latched to the gun model (used when sending ConfigureCharacter to NM)
  CreatedBloodPoolTimer,
  DontActivateRagdollFromAnyPedImpact,
  GroupPedFailedToEnterCover,
  AlreadyChattedOnPhone,
  AlreadyReactedToPedOnRoof,
  ForcePedLoadCover, // Set by the script to force a ped to load cover
  BlockCoweringInCover,
  BlockPeekingInCover,
  JustLeftCarNotCheckedForDoors, // Set when a ped exits a car.  The first time he he moves he should check for door obstructions.
  VaultFromCover,
  AutoConversationLookAts,
  UsingCrouchedPedCapsule, // Set to indicate that the ped's bounds are in the crouched configuration
  HasDeadPedBeenReported, // Whether this ped has been investigated (for dead peds)
  ForcedAim, // If set, we will always behave like we have the aim trigger pressed
  SteersAroundPeds, // Enables/disables the low-level steering behaviour around peds and objects
  SteersAroundObjects, // Enables/disables the low-level steering behaviour around peds and objects
  OpenDoorArmIK, // Set if the ped should enable open door arm IK
  ForceReload, // Force a reload of the current weapon" hideFrom="script
  DontActivateRagdollFromVehicleImpact, // Blocks ragdoll activation when hit by a vehicle
  DontActivateRagdollFromBulletImpact, // Blocks ragdoll activation when hit by a bullet
  DontActivateRagdollFromExplosions, // Blocks ragdoll activation when hit by an explosive
  DontActivateRagdollFromFire, // Blocks ragdoll activation when set on fire
  DontActivateRagdollFromElectrocution, // Blocks ragdoll activation when electrocuted
  IsBeingDraggedToSafety, // Whether this ped is being dragged to safety
  HasBeenDraggedToSafety, // Whether this ped has been dragged to safety
  KeepWeaponHolsteredUnlessFired, // Ignores the creation of the weapon object unless the gun is shot.
  ForceScriptControlledKnockout, // Forces a melee knockout state for the victim ped
  FallOutOfVehicleWhenKilled, // Forces a ped to fall out of a vehicle when killed
  GetOutBurningVehicle, // If set, a ped will escape a burning vehicle they are inside
  BumpedByPlayer, // Whether this ped has been bumped by the player.
  RunFromFiresAndExplosions, // If set, a ped will run away from fires or potential explosions
  TreatAsPlayerDuringTargeting, // If set, the ped will be given the same boost a player gets in the targeting scoring system.
  IsHandCuffed, // indicates if the ped is currently hand cuffed
  IsAnkleCuffed, // indicates if the ped is currently ankle cuffed
  DisableMelee, // Disables the melee for a particular ped
  DisableUnarmedDrivebys, // Disables unarmed driveby taunts for ped
  JustGetsPulledOutWhenElectrocuted, // MP only, if ped is electrocuted or rubber bulletted, players jacking the ped will just pull them out
  UNUSED_REPLACE_ME,
  WillNotHotwireLawEnforcementVehicle, // True if the ped will skip hotwiring a law enforcement vehicle if it needs to be hotwired
  WillCommandeerRatherThanJack, // True if the ped will try to commandeer a vehicle rather than jack if possible
  CanBeAgitated, // True if the ped will respond to agitation events
  ForcePedToFaceLeftInCover, // If set ped will turn to face left in cover
  ForcePedToFaceRightInCover, // If set ped will turn to face right in cover
  BlockPedFromTurningInCover, // If set ped will not turn in cover, unless one of the force flags is set
  KeepRelationshipGroupAfterCleanUp, // Will allow the ped to keep their relationship group after mission cleanup as opposed to going back to default
  ForcePedToBeDragged, // Forces Ped To Loop Try Locked Door Anim In Order To Be Dragged Along When Vehicle Moves
  PreventPedFromReactingToBeingJacked, // Ped doesn't react when being jacked
  IsScuba, // indicates if the ped is currently equipped for scuba
  WillArrestRatherThanJack, // For cops arresting peds in vehicles
  RemoveDeadExtraFarAway, // We must be further away before ped polulation remove this ped when it is dead
  RidingTrain, // True if the ped is riding a train
  ArrestResult, // True if the arrest task succeeded
  CanAttackFriendly, // True allows this ped to attack peds theya re friendly with
  WillJackAnyPlayer, // True if this player ped can jack any other player (MP Only)
  BumpedByPlayerVehicle, // Whether this ped has been bumped by a player vehicle.
  DodgedPlayerVehicle, // Whether this ped has just dodged a player vehicle.
  WillJackWantedPlayersRatherThanStealCar, // True if this player will jack wanted passengers rather than try to steal a car (cops arresting crims) (MP Only)
  NoCopWantedAggro, // If this flag is set on a cap, skip some of the code that would normally make them extra aggressive and alert.
  DisableLadderClimbing, // If this flag is set on a ped it will not scan for or climb ladders
  StairsDetected, // If this flag is set on a ped it has detected stairs
  SlopeDetected, // If this flag is set on a ped it has detected a slope
  HelmetHasBeenShot, // If this flag is set on a ped it's helmet has been damaged
  CowerInsteadOfFlee, // If set, the ped will cower in place rather than flee, used. Used for scenarios in confined spaces.
  CanActivateRagdollWhenVehicleUpsideDown, // If set the ped will be allowed to ragdoll when the vehicle they are in gets turned upside down if the seat supports it.
  AlwaysRespondToCriesForHelp, // If set, the ped will respond to CEventInjuredCryForHelp regardless if it is allied with the injured ped.
  DisableBloodPoolCreation,
  ShouldFixIfNoCollision, // If set, the ped will be fixed if there is no collision around.
  CanPerformArrest, // If set, the ped can perform arrests on peds that can be arrested
  CanPerformUncuff, // If set, the ped can uncuff peds that are handcuffed
  CanBeArrested, // If set, the ped may be arrested
  MoverConstrictedByOpposingCollisions, // If set, the ped's mover is getting collisions from opposing sides.
  PlayerPreferFrontSeatMP, // When true, Prefer the front seat when getting in a car with buddies.
  DontActivateRagdollFromImpactObject,
  DontActivateRagdollFromMelee,
  DontActivateRagdollFromWaterJet,
  DontActivateRagdollFromDrowning,
  DontActivateRagdollFromFalling,
  DontActivateRagdollFromRubberBullet,
  IsInjured, // When true, the ped will use injured movement anim sets and getup animations.
  DontEnterVehiclesInPlayersGroup, // When true, will follow the player around if in their group but wont enter vehicles.
  SwimmingTasksRunning, // stronger than IsSwimming, persists so long as the tasks are active
  PreventAllMeleeTaunts, // Disable all melee taunts for this particular ped
  ForceDirectEntry, // Will force this ped to use the direct entry point for any vehicle they try to enter, or warp in
  AlwaysSeeApproachingVehicles, // This ped will always see approaching vehicles (even from behind).
  CanDiveAwayFromApproachingVehicles, // This ped can dive away from approaching vehicles.
  AllowPlayerToInterruptVehicleEntryExit, // Will allow player to interrupt a peds scripted entry/exit task as if they had triggered it themselves
  OnlyAttackLawIfPlayerIsWanted, // This ped won't attack cops unless the player is wanted.
  PlayerInContactWithKinematicPed, // Gets set to true if the player ped is colliding against a ped in kinematic mode.
  PlayerInContactWithSomethingOtherThanKinematicPed, // Gets set to true if the player ped is colliding against something which isn't a ped in kinematic mode.
  PedsJackingMeDontGetIn, // If set any ped jacking this ped will not get in as part of the jack.
  AdditionalRappellingPed,
  PedIgnoresAnimInterruptEvents, // AI peds only, will not early out of anims
  IsInCustody, // Signifies a player is in custody
  ForceStandardBumpReactionThresholds, // By default, armed and friendly peds have increased resistance to being bumped by players and friendly vehicles. Setting this flag will make them use the standard thresholds instead.
  LawWillOnlyAttackIfPlayerIsWanted, // If set, this ped can only be attacked by law if the player is wanted
  IsAgitated, // If set, this ped is agitated.
  PreventAutoShuffleToDriversSeat, // MP only, prevents passenger from auto shuffling over to drivers seat if it becomes free.
  UseKinematicModeWhenStationary, // When enabled, the ped will continually set the kinematic mode reset flag when stationary.
  EnableWeaponBlocking, // When enabled, Non-player peds can use WeaponBlocking behaviors
  HasHurtStarted,
  DisableHurt, // Will prevent the peds go into hurt combat mode
  PlayerIsWeird, // Should this player ped periodically generate shocking events for being weird.
  PedHadPhoneConversation, // Has this ped had a phone conversation before.
  BeganCrossingRoad, // Indicates ped started crossing the road in case of interruption.
  WarpIntoLeadersVehicle, // Warp into leaders vehicle
  DoNothingWhenOnFootByDefault, // Do nothing when on foot by default
  UsingScenario, // Set when the ped is using a scenario. Call CPed::UpdateSpatialArrayTypeFlags() if changing.
  VisibleOnScreen, // Set when the ped is visible on screen, as determined by CPedAILodManager.
  DontCollideWithKinematic, // If true, the ped will not collide with other kinematic peds.
  ActivateOnSwitchFromLowPhysicsLod, // If set, activate physics when switching from low to regular physics LOD.
  DontActivateRagdollOnPedCollisionWhenDead, // Peds with this flag set won't be allowed to reactivate their ragdoll when hit by another ragdoll.
  DontActivateRagdollOnVehicleCollisionWhenDead, // Peds with this flag set won't be allowed to reactivate their ragdoll when hit by a vehicle.
  HasBeenInArmedCombat, // Is set if this ped has ever been in armed combat
  UseDiminishingAmmoRate, // Set for when we want to diminish the ammo at a slower rate. Used specifically in cases where AI do not have infinite ammo.
  Avoidance_Ignore_All, // This ped won't steer around anyone
  Avoidance_Ignored_by_All, // Other peds won't steer around this ped
  Avoidance_Ignore_Group1, // This ped won't steer around peds marked group 1
  Avoidance_Member_of_Group1, // This ped is marked as a member of avoidance group 1
  ForcedToUseSpecificGroupSeatIndex, // Ped is forced to use specific seat index set by SET_PED_GROUP_MEMBER_PASSENGER_INDEX
  LowPhysicsLodMayPlaceOnNavMesh, // If set, peds in low lod physics will be placed so that their feet rest on the navmesh
  DisableExplosionReactions, // If set, peds will disable all explosion reactions
  DodgedPlayer, // Whether this ped has just dodged a player.
  WaitingForPlayerControlInterrupt, // Set when player switches to an ai ped and keeps the scripted task of the ai ped
  ForcedToStayInCover, // Ped won't move out of cover when set (not even to fire).
  GeneratesSoundEvents, // Does this ped generate sound events?
  ListensToSoundEvents, // Does this ped have the ability to respond to sound events?
  AllowToBeTargetedInAVehicle, // Ped can be targeting inside a vehicle
  WaitForDirectEntryPointToBeFreeWhenExiting,
  OnlyRequireOnePressToExitVehicle,
  ForceExitToSkyDive,
  SteersAroundVehicles, // Enables/disables the low-level steering behaviour around vehicles
  AllowPedInVehiclesOverrideTaskFlags, // If set, allow the ped to be set in vehicles even if the ped's TaskData would otherwise disallow it.
  DontEnterLeadersVehicle, // If set, the ped will not enter the leader's vehicle.
  DisableExitToSkyDive,
  ScriptHasDisabledCollision, // Script disabled collision on this ped via SET_ENTITY_COLLISION, this leaves on collision against explosions and weapons
  UseAmbientModelScaling, // This ped is drawn randomly scaled from [0.5,1.0]
  DontWatchFirstOnNextHurryAway, // Hurry away without watching the next time this ped runs CTaskHurryAway.
  DisablePotentialToBeWalkedIntoResponse, // make EVENT_POTENTIAL_BE_WALKED_INTO not affect this ped.
  DisablePedAvoidance, // This ped will not avoid other peds whilst navigating
  ForceRagdollUponDeath, // When the ped dies, it will ragdoll instead of potentially choosing an animated death.
  CanLosePropsOnDamage, // When ped receives damage any prop glasses could be knocked off
  DisablePanicInVehicle,
  AllowedToDetachTrailer, // Allow this ped to detach trailers from vehicles
  HasShotBeenReactedToFromFront,
  HasShotBeenReactedToFromBack,
  HasShotBeenReactedToFromLeft,
  HasShotBeenReactedToFromRight,
  AllowBlockDeadPedRagdollActivation, // If set, the ragdoll activation blocking flags can be used to disable activation of dead peds. Otherwise, by default, dead peds can always activate their ragdolls
  IsHoldingProp, // True if the ped is currently holding a prop.
  BlocksPathingWhenDead, // When this ped dies their body will block all pathfinding modes - not just wandering.
  ForcePlayNormalScenarioExitOnNextScriptCommand, // The next time this ped leaves a scenario to perform some script task they will be forced into their normal scenario exit.
  ForcePlayImmediateScenarioExitOnNextScriptCommand, // The next time this ped leaves a scneario to perform some script task they will be forced into their immediate (blend out) exit.
  ForceSkinCharacterCloth, // Force character cloth to stay skinned immediately after being created. If flag is not set then character cloth is not forced to be skinned when created.
  LeaveEngineOnWhenExitingVehicles, // The player will leave the engine running when leaving vehicles
  PhoneDisableTextingAnimations, // tells taskmobile phone to not texting animations.  Currently don't play these in MP
  PhoneDisableTalkingAnimations, // tells taskmobile phone to not talking animations.  Currently don't play these in MP
  PhoneDisableCameraAnimations, // tells taskmobile phone to not camera animations.  Currently don't play these in SP
  DisableBlindFiringInShotReactions, // Stops the ped from accidentally blind firing it's weapon when doing an nm shot reaction
  AllowNearbyCoverUsage, // This makes it so that OTHER peds are allowed to take cover at points that would otherwise be rejected due to proximity
  InStrafeTransition, // True if in strafe transition.
  CanPlayInCarIdles, // If false, blocks in-car idle animations from playing.
  CanAttackNonWantedPlayerAsLaw, // If this is a law ped then it will ignore the player wanted level clean check in combat and continue attacking
  WillTakeDamageWhenVehicleCrashes, // Ped gets damaged when the vehicle they are in crashes
  AICanDrivePlayerAsRearPassenger, // If this ai ped is driving the vehicle, if the player taps to enter, they will enter as a rear passenger, if they hold, they'll jack the driver
  PlayerCanJackFriendlyPlayers, // If a friendly player is driving the vehicle, if the player taps to enter, they will enter as a passenger, if they hold, they'll jack the driver
  OnStairs, // Are we on stairs?
  SimulatingAiming, // Simulating the aim button for player until on input detection.
  AIDriverAllowFriendlyPassengerSeatEntry, // If this ai ped is driving the vehicle, allow players to get in passenger seats
  ParentCarIsBeingRemoved, // Set on the target ped if the car they are in is being removed to avoid an expensive detach check
  AllowMissionPedToUseInjuredMovement, // Set the target ped to be allowed to use Injured movement clips
  CanLoseHelmetOnDamage, // When ped receives a head shot then a helmet can be knocked off
  NeverDoScenarioExitProbeChecks, // When this ped exits a scenario they ignore probe checks against the environment and just pick an exit clip.
  SuppressLowLODRagdollSwitchWhenCorpseSettles, // This will suppress the automatic switch to a lower ragdoll LOD when switching to the ragdoll frame after dying.
  PreventUsingLowerPrioritySeats, // Don't use certain seats (like hanging on the side of a vehicle)
  JustLeftVehicleNeedsReset, // Set when leaving a vehicle and disabling collision with the vehicle exiting to indicate we need to clear out the disabling
  TeleportIfCantReachPlayer, // If this ped is following the player and stuck in a place where he can't be reached, teleport when possible.
  PedsInVehiclePositionNeedsReset, // Ped was being jacked/killed but isn't anymore, ensure they're in the seat
  PedsFullyInSeat, // Ped is fully in the seat (Set after the position needs reset flag)
  AllowPlayerLockOnIfFriendly, // If this ped is friendly with the player, this will allow the ped to lockon
  UseCameraHeadingForDesiredDirectionLockOnTest, // Force camera direction for heading test if desired direction is also set
  TeleportToLeaderVehicle, // If set, teleport if ped is not in the leader's vehicle before TaskEnterVehicle::m_SecondsBeforeWarpToLeader.
  Avoidance_Ignore_WeirdPedBuffer, // Don't give weird peds extra buffer
  OnStairSlope, // Are we on a stair slope?
  HasPlayedNMGetup, // This ped has gotten up from NM at least once.
  DontBlipCop, // Wanted system shouldnt consider this ped when creating blips.
  SpawnedAtExtendedRangeScenario, // Set if the ped spawned at a scenario with extended range.
  WalkAlongsideLeaderWhenClose, // This ped will walk alongside group leader if they are the first member of the leader's pedgroup, they are close enough to the leader, and the pedgroup's formation is set up to allow this (such as in the default CPedFormationTypes::FORMATION_LOOSE).
  KillWhenTrapped, // This will kill a mission ped that becomes trapped (like under a cow carcass) and cannot getup.
  EdgeDetected, // If this flag is set on a ped it has detected an edge
  AlwaysWakeUpPhysicsOfIntersectedPeds, // This ped will cause physics to activate on any ped this ped's capsule is inside of, even if this ped is being attached.
  EquippedAmbientLoadOutWeapon, // This is set to prevent a ped from holstering a loadout weapon equipped during CPedPopulation::EquipPed as part of the defined CAmbientPedModelVariations' loadout.
  AvoidTearGas, // If set, a ped will avoid tear gas.
  StoppedSpeechUponFreezing, // Marks that we've already dealt with cleaning up speech audio after becoming frozen.
  DisableGoToWritheWhenInjured, // If set, CPed::DAMAGED_GOTOWRITHE will no longer get set.  In particular, tazer hits wil no longer kill this ped in one hit.
  OnlyUseForcedSeatWhenEnteringHeliInGroup, // If set this ped will only use their forced seat index if the vehicle they're entering is a heli as part of a group
  ThrownFromVehicleDueToExhaustion, // Ped got tired and was thrown from bike. Used to scale ragdoll damage for a few seconds after the dismount."
  UpdateEnclosedSearchRegion, // This ped will update their enclosed regions
  DisableWeirdPedEvents,
  ShouldChargeNow, // This ped should charge if in combat right away, for use by scripts, cleared once ped charges"
  RagdollingOnBoat, // We don't want ragdolling peds processing buoyancy when in a boat.
  HasBrandishedWeapon,
  AllowMinorReactionsAsMissionPed, // If true, this ped will react to events such as being hit by a vehicle as a mission ped
  BlockDeadBodyShockingEventsWhenDead, // If true, this ped will not generate dead body shocking events when dead.
  PedHasBeenSeen, // True if the ped has be visible to the player
  PedIsInReusePool, // True if the ped is currently in the ped reuse pool
  PedWasReused, // True if the ped was in the reuse pool and then was reused
  DisableShockingEvents,
  MovedUsingLowLodPhysicsSinceLastActive, // Set for peds that have moved using low LOD physics
  NeverReactToPedOnRoof, // If true, this ped will not react to a ped standing on the roof.
  ForcePlayFleeScenarioExitOnNextScriptCommand, // If set this ped will use a flee exit to leave on the next script command.
  JustBumpedIntoVehicle, // Set for peds that just bumped into a vehicle
  DisableShockingDrivingOnPavementEvents,
  ShouldThrowSmokeNow, // This ped should throw a smoke grenade in combat right away, for use by scripts, cleared once ped throws
  DisablePedConstraints, // Flags the ped to ensure it either does or does not have its control constraints
  ForceInitialPeekInCover, // If set, ped will peek once before firing in cover. Cleared upon peeking.
  CreatedByDispatch, // this ped was created by one of the dispatch systems, usually law enforcement
  PointGunLeftHandSupporting, // NM state config flag. Set to true when the characters support hand has broken from the weapon
  DisableJumpingFromVehiclesAfterLeader, // If true, ped will not bail out of a vehicle after his group leader.
  DontActivateRagdollFromPlayerPedImpact, // Blocks ragdoll activation from animated player ped bumps
  DontActivateRagdollFromAiRagdollImpact, // Blocks ragdoll activation from collisions with ai ragdolls
  DontActivateRagdollFromPlayerRagdollImpact, // Blocks ragdoll activation from collisions with a ragdolling player
  DisableQuadrupedSpring, // Use to disable quadruped spring processing when settling from a ragdoll performance
  IsInCluster, // This ped is currently in a cluster.
  ShoutToGroupOnPlayerMelee, // If set, ped will shout target position when melee attacked by a player
  IgnoredByAutoOpenDoors, // Set this for a ped to be ignored by the auto opened doors when checking to see if the door should be opened.
  PreferInjuredGetup, // Set this during nm tasks to trigger an injured geup when the ped gets up.
  ForceIgnoreMeleeActiveCombatant, // Purposely ignore the melee active combatant role and push them into a support or inactive combatant role
  CheckLoSForSoundEvents, // If set, ped will ignore sound events generated by entites it can't see.
  JackedAbandonedCar, // This ped was spawned to steal an ambient car that was left around
  CanSayFollowedByPlayerAudio, // If set, ped can play FRIEND_FOLLOWED_BY_PLAYER lines.
  ActivateRagdollFromMinorPlayerContact, // If set, the ped will activate the nm ragdoll balance as soon as he's touhed by the player (ignoring velocity thresholds).
  HasPortablePickupAttached, // If set, the ped is carrying a portable pickuup.
  ForcePoseCharacterCloth, // If set, default cloth pose will be applied if is available in the character cloth when the cloth is created.
  HasClothCollisionBounds, // If set, ped will use cloth collision bounds.
  HasHighHeels, // Set when the ped has high heels
  TreatAsAmbientPedForDriverLockOn, // If set, this force player ped to treat this ped as an ambient target rather than a mission ped for driver lock on
  DontBehaveLikeLaw, // Currently used to prevent security peds from behaving like police (they will not report wanted position, can attack without WL, etc)
  SpawnedAtScenario, // If set, the ped was originally spawned at a scenario point.
  DisablePoliceInvestigatingBody, // If set, police will not perform the CTaskShockingPoliceInvestigate Behavior on the ped
  DisableWritheShootFromGround, // If set, the ped will no longer shoot while writhing.
  LowerPriorityOfWarpSeats,
  DisableTalkTo,
  DontBlip, // Stops a ped being blipped by the wanted system
  IsSwitchingWeapon, // ped is running the swap weapon task
  IgnoreLegIkRestrictions, // If set, the ped will ignore leg IK request restrictions for non-player peds.
  ScriptForceNoTimesliceIntelligenceUpdate, // If set, the ped will never have their intelligence update time sliced across frames.
  JackedOutOfMyVehicle, // If set, this ped has been jacked out of its vehicle.
  WentIntoCombatAfterBeingJacked, // If set, this ped went into combat because of being jacked.
  DontActivateRagdollForVehicleGrab, // Blocks ragdoll activation when grabbing vehicle doors
  ForcePackageCharacterCloth, // Set the flag for forcing package on character cloth when cloth is created on the ped
  DontRemoveWithValidOrder,
  AllowTaskDoNothingTimeslicing, // If set, this ped will timeslice it's DoNothing Task when computing default task.
  ForcedToStayInCoverDueToPlayerSwitch,
  ForceProneCharacterCloth, // Set the flag to place character cloth in prone state when cloth is created on the ped
  NotAllowedToJackAnyPlayers,
  InToStrafeTransition,
  KilledByStandardMelee, // Killed by standard melee
  AlwaysLeaveTrainUponArrival, // Does this ped always (not randomly) leave the train when it arrives at a station
  ForcePlayDirectedNormalScenarioExitOnNextScriptCommand, // Set flag to determine that a directed normal exit should be use for new tasks on this scenario ped.
  OnlyWritheFromWeaponDamage, // Only allow ped to writhe from weapon damage, not from other stuff, like small vehicle impacts
  UseSloMoBloodVfx, // Flags the ped to use the slo mo blood vfx instead of the normal ones
  EquipJetpack, // Equip/put on the jetpack if we have one in our inventory
  PreventDraggedOutOfCarThreatResponse, // Don't do threat response when dragged out of a car
  ScriptHasCompletelyDisabledCollision, // Script has completely disabled collision on this ped via SET_ENTITY_COMPLETELY_DISABLE_COLLISION
  NeverDoScenarioNavChecks, // This ped will not check for navmesh when exiting their scenario.
  ForceSynchronousScenarioExitChecking, // This ped will expensively probe for a scenario exit location in one frame.
  ThrowingGrenadeWhileAiming, // Set true in CTaskAimGunOnFoot::Aiming_OnUpdate, false in CTaskAimAndThrowProjectile::CleanUp.
  HeadbobToRadioEnabled, // Set in.
  ForceDeepSurfaceCheck, // Don't do distance from camera culling of the deep surface check, needed for detecting snow, mud, etc."
  DisableDeepSurfaceAnims, // Disable deep surface anims to prevent them slowing ped down"
  DontBlipNotSynced, // Don't blip this ped, this is not synced over the network to allow script to individually control a peds blippedness on different machines
  IsDuckingInVehicle, // Ped is ducking inside a vehicle.
  PreventAutoShuffleToTurretSeat,
  DisableEventInteriorStatusCheck, // Disables the ignore events based on interior status check which normally has peds inside ignore events from outside
  HasReserveParachute, // Does ped have a reserve chute that they can deploy
  UseReserveParachute, // Use reserve parachute settings.
  TreatDislikeAsHateWhenInCombat, // If this ped is in combat then any ped they dislike they will consider the relationship hate instead
  OnlyUpdateTargetWantedIfSeen, // If the target is a player we will only set the WL or update the radar if they are seen
  AllowAutoShuffleToDriversSeat, // Allows this ped to auto shuffle to the driver seat of a vehicle if the driver is dead (law and MP peds would do this normally)
  DontActivateRagdollFromSmokeGrenade, // Blocks ragdoll activation when damaged by smoke grenade
  LinkMBRToOwnerOnChain, // This ped will attempt to match the speed of the owner while following its current scenario chain.
  AmbientFriendBumpedByPlayer, // The player has walked into our ambient friend.
  AmbientFriendBumpedByPlayerVehicle, // The player has driven into our ambient friend.
  InFPSUnholsterTransition, // Player is playing the unholster transition in FPS mode
  PreventReactingToSilencedCloneBullets, // Prevents the ped from reacting to silenced bullets fired from network clone peds
  DisableInjuredCryForHelpEvents, // Blocks ped from creating the injured cry for help events (run over, tazed or melee would usually do this)
  NeverLeaveTrain, // Prevents peds riding trains from getting off them
  DontDropJetpackOnDeath, // When dead, don't drop eqquiped jetpack
  UseFPSUnholsterTransitionDuringCombatRoll, // Player is playing the unholster transition in FPS mode
  ExitingFPSCombatRoll, // Player is exiting combat roll in FPS mode
  ScriptHasControlOfPlayer, // True when script is controlling the movement of the player
  PlayFPSIdleFidgetsForProjectile, // True when we should be playing idle fidgets for projectiles
  DisableAutoEquipHelmetsInBikes, // Set from interaction menu
  DisableAutoEquipHelmetsInAircraft, // Set from interaction menu
  WasPlayingFPSGetup, // Was playing getup animations in FPS mode
  WasPlayingFPSMeleeActionResult, // Was playing action result animations in FPS mode
  PreferNoPriorityRemoval, // Unless scenario conditions apply, make this ped go through normal deletion but not priority deletion.
  FPSFidgetsAbortedOnFire, // True when the FPS idle fidgets are aborted because the player fired the gun
  ForceFPSIKWithUpperBodyAnim, // True when upper body anims are used during various tasks.
  SwitchingCharactersInFirstPerson, // True we switch a character in first person mode (in CGameWorld::ChangePlayerPed)
  IsClimbingLadder, // True when the ped is climbing a ladder
  HasBareFeet, // Set when the ped has no shoes
  UNUSED_REPLACE_ME_2,
  GoOnWithoutVehicleIfItIsUnableToGetBackToRoad, // It will force the ped to abandon its vehicle (when using TaskGoToPointAnyMeans) if it is unable to get back to road
  BlockDroppingHealthSnacksOnDeath, // Set by script to prevent peds from dropping snack health pickups on death (in CPed::CreateDeadPedPickups).
  ResetLastVehicleOnVehicleExit, // Reset the ped's stored MyVehicle pointer when this ped leaves their vehicle.
  ForceThreatResponseToNonFriendToFriendMeleeActions, // Forces threat response to melee actions from non friend to friend peds.
  DontRespondToRandomPedsDamage, // Do not respond to random peds damage
  AllowContinuousThreatResponseWantedLevelUpdates, // Shares logic of OnlyUpdateTargetWantedIfSeen but will continue to check even after the initial WL is set
  KeepTargetLossResponseOnCleanup, // On cleanup the ped will not reset their target loss response
  PlayersDontDragMeOutOfCar, // Similar to DontDragMeOutCar except it only prevents players from dragging the ped out and allows AI to still do so
  BroadcastRepondedToThreatWhenGoingToPointShooting, // Whenever the ped starts shooting while going to a point, it trigger a responded to threat broadcast
  IgnorePedTypeForIsFriendlyWith, // If this is set then IsFriendlyWith will ignore the ped type checks (i.e. two PEDTYPE_COP peds are not automatically friendly)
  TreatNonFriendlyAsHateWhenInCombat, // Any non friendly ped will be considered as hated instead
  DontLeaveVehicleIfLeaderNotInVehicle, // Supresses exit vehicle task being created in CEventLeaderExitedCarAsDriver::CreateResponseTask."
  ChangeFromPermanentToAmbientPopTypeOnMigration, // Change ped to ambient pop type on migration."
  AllowMeleeReactionIfMeleeProofIsOn, // Allow melee reaction to come through even if proof is on"
  UsingLowriderLeans, // Ped is playing lowrider lean animations due to vehicle suspension modification.
  UsingAlternateLowriderLeans, // Ped is playing alternate lowrider lean animations (ie arm on window) due to vehicle suspension modification.
  UseNormalExplosionDamageWhenBlownUpInVehicle, // If this is set, the ped won't be instantly killed if vehicle is blown up (from CAutomobile::BlowUpCar -> KillPedsInVehicle). Instead, they will take normal explosive damage and be forced to exit the vehicle if they're still alive.
  DisableHomingMissileLockForVehiclePedInside, // Blocks locking on of the vehicle that the ped is inside.
  DisableTakeOffScubaGear, // Same as CPED_RESET_FLAG_DisableTakeOffScubaGear but on a config flag.
  IgnoreMeleeFistWeaponDamageMult, // Melee fist weapons (ie knuckle duster) won't apply relative health damage scaler (m_MeleeRightFistTargetHealthDamageScaler in weapon info).
  LawPedsCanFleeFromNonWantedPlayer, // Allows law ped to flee even if ped is not wanted and CWanted::m_AllRandomsFlee is set.
  ForceBlipSecurityPedsIfPlayerIsWanted, // Forces security peds (not cop peds) to be blipped on the minimap if the player is wanted. Set on the local player.
  IsHolsteringWeapon, // Ped is running the swap weapon task and holstering the previous weapon, but has not started drawing the new one.
  UseGoToPointForScenarioNavigation, // Don't use nav mesh for navigating to scenario points. DLC Hack for yachts
  DontClearLocalPassengersWantedLevel, // Don't clear local ped's wanted level when remote ped in the same car has his wanted level cleared by script.
  BlockAutoSwapOnWeaponPickups, // Block auto weapon swaps for weapon pickups.
  ThisPedIsATargetPriorityForAI, // Increase AI targeting score for peds with this flag.
  IsSwitchingHelmetVisor, // Indicates that ped is playing switch visor up/down anim
  ForceHelmetVisorSwitch, // Forces ped to do a visor helmet switch if able to.
  IsPerformingVehicleMelee, // Indicates that ped is performing vehicle melee action.
  UseOverrideFootstepPtFx, // The ped should use any override footstep effects that are set up.
  DisableVehicleCombat, // Disables vehicle combat.
  TreatAsFriendlyForTargetingAndDamage, // Prevents this ped from being locked on and blocks ability to damage / fire at ped.
  AllowBikeAlternateAnimations, // Allows players on motorcycles to use the alternate animation set when available.
  TreatAsFriendlyForTargetingAndDamageNonSynced, // Prevents this ped from being locked on and blocks ability to damage / fire at ped. This flag is not synced, so will only work on machine that set it
  UseLockpickVehicleEntryAnimations, // When set, will attempt to use lockpick animations designed for Franklin in SP mode when breaking into a car.
  IgnoreInteriorCheckForSprinting, // When set, player will be able to sprint inside interriors even if it is tagged to prevent it.
  SwatHeliSpawnWithinLastSpottedLocation, // When set, swat helicopters will spawn within last spotted location instead of actual ped location (and target is a player).
  DisableStartEngine, // prevents ped from playing start engine anims (and turning engine on)
  IgnoreBeingOnFire, // makes ped ignore being on fire (fleeing, reacting to CEventOnFire event)
  DisableTurretOrRearSeatPreference, // Disables turret seat and activity seat preference for vehicle entry for local player
  DisableWantedHelicopterSpawning, // Will not spawn wanted helicopters to chase after this target
  UseTargetPerceptionForCreatingAimedAtEvents, // Will only create aimed at events if player is within normal perception of the target
  DisableHomingMissileLockon, // Will prevent homing lockon on this ped
  ForceIgnoreMaxMeleeActiveSupportCombatants, // Ignore max number of active support combatants and let ped join them as such
  StayInDefensiveAreaWhenInVehicle, // Will try to stay within set defensive area while driving a vehicle
  DontShoutTargetPosition, // Will prevent the ped from communicating target position to all other friendly peds
  DisableHelmetArmor, // Will apply full headshot damage, regardless if ped has a helmet (or armored one)
  CreatedByConcealedPlayer, // Marks a ped that was created by concealed player from marked up scenarios
  PermanentlyDisablePotentialToBeWalkedIntoResponse, // Synced and permanent version of CPED_CONFIG_FLAG_DisablePotentialToBeWalkedIntoResponse
  PreventVehExitDueToInvalidWeapon, // Will prevent ped from automatically being forced out of vehicle due to weapon being invalid (e.g. turret seats after going into water)
  IgnoreNetSessionFriendlyFireCheckForAllowDamage, // Will ignore the friendly fire setting set by NETWORK_SET_FRIENDLY_FIRE_OPTION when checking if ped can be damaged
  DontLeaveCombatIfTargetPlayerIsAttackedByPolice, // Will make ped stay in combat even if the player hes targeting starts being attacked by cops
  CheckLockedBeforeWarp, // Will check when entering a vehicle if it is locked before warping
  DontShuffleInVehicleToMakeRoom, // Will prevent a player from shuffling across to make room if another player is entering from the same side
  GiveWeaponOnGetup, // Will give the ped a weapon to use once their weapon is removed for getups
  DontHitVehicleWithProjectiles, // Ped fired projectiles will ignore the vehicle they are in
  DisableForcedEntryForOpenVehiclesFromTryLockedDoor, // Will prevent ped from forcing entry into cars that are open from TryLockedDoor state
  FiresDummyRockets, // This ped will fire rockets that explode when close to its target, and won't affect it
  PedIsArresting, // Is the ped currently preforming an arrest
  IsDecoyPed, // Will make this ped a decoy ped that will focus targeting
  HasEstablishedDecoy, // This ped has created a decoy
  BlockDispatchedHelicoptersFromLanding, // Will prevent dispatched helicopters from landing and dropping off peds
  DontCryForHelpOnStun, // Will prevent peds from crying for help when shot with the stun gun
  HitByTranqWeapon, // Tranq weapons are handled differently in terms of damage. This triggers that logic
  CanBeIncapacitated, // If set, the ped may be incapacitated
  ForcedAimFromArrest, // If set, we will always behave like we have the aim trigger pressed
  DontChangeTargetFromMelee, // If set, we wont set a new target after a melee attack
  DisableHealthRegenerationWhenStunned, // Used to disable health regeneration when damaged with the stun gun in MP
  RagdollFloatsIndefinitely, // Prevents a dead ped from sinking
  BlockElectricWeaponDamage, // Blocks electric weapon damage
}

// These flags are reset every frame
// match these with the enum in PedFlagsMeta.h
export enum PED_RESET_FLAG {
  FallenDown, // decides whether to ik rotate body to match ground angle
  DontRenderThisFrame, // force ped to stop rendering this frame (for example - drive task can stop peds rendering inside buses)
  IsDrowning,
  PedHitWallLastFrame,
  UsingMobilePhone,
  BlockMovementAnims, // completely disable processing of on-foot movement anim blending for this frame
  ZeroDesiredMoveBlendRatios, // zero out all inputs to movement system this frame, causing ped to stop moving
  DontChangeMbrInSimpleMoveDoNothing, // If this is set, then CTaskSimpleMoveDoNothing will not reset desired moveblendratio to zero this frame.
  FollowingRoute, // whether this ped is following a route of some sort - used to let simplest goto task pull the ped back onto their current route segment
  TakingRouteSplineCorner, // whether the ped is cornering via a spline curve, which will take them off their route linesegment
  Wandering,
  ProcessPhysicsTasks, // do we need to call process physics for (main) tasks this frame
  ProcessPreRender2, // do we need to call ProcessPreRender2 for tasks
  SetLastMatrixDone,
  FiringWeapon, // set when ped fires any weapon, so script can check the flag

  // gets reset at the start of the peds intelligence update
  SearchingForCover, // Set if the ped is likely to be searching for cover, used by the navmesh to load coverpoints around interested peds
  KeepCoverPoint, // Set if the ped wants to keep their current cover point this frame, otherwise it gets released
  IsClimbing, // If the ped is climbing, shimmying or on a ladder.  Stops ProcessProbes() from happening.
  IsJumping, // is the ped jumping.
  IsLanding, // is landing after being in the air
  CullExtraFarAway, // flag Ai can set to make ped get culled further away (used for roadblock cops, crimials...)

  // wants to get reset at start of ResetPostMovement
  DontActivateRagdollFromAnyPedImpactReset,
  ForceScriptControlledRagdoll,

  TaskUseKinematicPhysics, // For use by tasks - puts the ped into Kinematic physics mode. In this mode the ped will push other objects our of the way, but not be physically affected by them
  TemporarilyBlockWeaponSwitching, // Stop weapon switch processing
  DoNotClampFootIk, // Stop clamping the foot IK. Maybe the clamps should be parameters of the IK manager, but apparently that is to be refactored in future

  /**
   * The following bit-flags are set by tasks during their processing, and are picked up
   * by CPed::SelectCurrentAnimGroup() to prevent it from having query the task tree.
   */
  MoveBlend_bFleeTaskRunning, // TASK_SMART_FLEE, or TASK_COMPLEX_LEAVE_CAR_AND_FLEE
  IsAiming, // TASK_GUN or TASK_USE_COVER
  MoveBlend_bTaskComplexGunRunning, // TASK_COMPLEX_GUN (only)
  MoveBlend_bMeleeTaskRunning, // TASK_COMPLEX_MELEE
  MoveBlend_bCopSearchTaskRunning, // TASK_COMPLEX_SEARCH_FOR_PED_ON_FOOT
  PatrollingInVehicle, // ped is patrolling in a vehicle, likely meaning they are swat or police

  RaiseVelocityChangeLimit,

  DimTargetReticule,

  IsWalkingRoundPlayer, // Whether this ped is walking around another ped (one frame latency)

  GestureAnimsAllowed,

  VisemeAnimsBlocked, // Blocks viseme anims from playing
  AmbientAnimsBlocked, // Blocks new ambient idles from starting.

  KnockedToTheFloorByPlayer,
  RandomisePointsDuringNavigation,
  Prevent180SkidTurns,

  IsOnAssistedMovementRoute,

  ApplyVelocityDirectly, // Should we apply the velocity directly to the physics collider or go through the force solver?

  DisablePlayerLockon,

  ResetMoveGroupAfterRagdoll, // If true, will reset the temp anim group when not ragdolling

  DisablePedConstraints, // Allow the ped to rotate around freely

  DisablePlayerJumping, // Disables player jumping if true. Reset in ResetPostPhysics, as it will be set via script
  DisablePlayerVaulting, // Disables player vaulting/climbing if true.

  DisableAsleepImpulse, // Disable the code that pushes peds which fall asleep in the air

  ForcePostCameraAIUpdate,
  ForcePostCameraAnimUpdate,
  ePostCameraAnimUpdateUseZeroTimestep,

  CollideWithGlassRagdoll,
  CollideWithGlassWeapon,

  SyncDesiredHeadingToCurrentHeading,

  AllowUpdateIfNoCollisionLoaded,
  InternalWalkingRndPlayer,

  PlacingCharge, // Setting Bomb (firing weapon is set also)
  ScriptDisableSecondaryAnimationTasks, // Disable upper body animtion tasks such as shove ped and open door anims

  SearchingForClimb,
  SearchingForDoors,

  WanderingStoppedForOtherPed,

  SupressGunfireEvents,
  InfiniteStamina, // Currently just for mounts, but could be expanded to anything with stamina

  BlockWeaponReactionsUnlessDead, //  Stops ragdoll and nm behaviors triggering from weapon damage unless the ped has died.

  ForcePlayerFiring,

  InCoverFacingLeft, // set when exiting the cover state saying if we are facing left

  ForcePeekFromCover, // if set the ped will go into peeking if they are already in cover

  NotAllowedToChangeCrouchState, // if set the ped will not be allowed to change their crouch state

  ForcePedToStrafe, // forces a ped to strafe
  ForceMeleeStrafingAnims, // forces a ped to use the melee strafing anims when strafing

  UseKinematicPhysics, // To be used by scripts - puts the ped into Kinematic physics mode. In this mode the ped will push other objects our of the way, but not be physically affected by them

  ClearLockonTarget, // Clears the player's lockon target next frame
  CanPedSeeHatedPedBeingUsed, // Activates can ped see hated ped generating events even when blocking of non-temp events is on

  InstantBlendToAim, // Makes the ped performa an instant blend to aim if starting a gun task this frame

  ForceImprovedIdleTurns, // Forces the ped to use an improved idle turning system that should help him turn to face more quickly
  HitPedWithWeapon, // set when damage is inflicted by this ped on another ped

  ForcePedToUseScripCamHeading, // forces a ped to the scripted camera heading instead of gameplay

  ProcessProbesWhenExtractingZ, // makes the capsule physics push the ped out of the ground even when extracting z
  KeepDesiredCoverPoint, // should the ped keep their desired cover point this frame

  HasProcessedCornering, // whether the ped has already processed slowing down for this corner

  StandingOnForkliftForks, // Set when the ped standing capsule hits the forklift forks.
  AimWeaponReactionRunning, // ped is running the reaction task this frame

  InContactWithFoliage, // ped is in contact with GTA_FOLIAGE_TYPE bounds

  ForceExplosionCollisions, // ped will always collide with explosions, even when collision is off

  IgnoreTargetsCoverForLOS, // when checking LOS against targets this ped will ignore their cover (if the cover exists)

  BlockAnimatedWeaponReactions, // Ped should not play animated damager reactions while this flag is set

  DisablePedCapsule, // Removes the ped capsule from the physics simulation

  DisableCrouchWhileInCover, // Force the crouch flag to return true while in cover.

  IncreasedAvoidanceRadius, // Adds extra 2m onto the radius other peds use to avoid this ped during local steering.

  UNUSED_REPLACE_ME,
  ForceRunningSpeedForFragSmashing, // Can be set by designers to force the ped to smash more easily through frags.

  EnableMoverAnimationWhileAttached, // While flagged, any mover animation will be applied to the offset of the attachment.
  NoTimeDelayBeforeShot, // While flagged, The time delay before a player can fire after aiming is 0
  SearchingForAutoVaultClimb, // inform climb code we are doing an autovault
  ExtraLongWeaponRange, // Extends the range of a peds weapons to 250m
  ForcePlayerToEnterVehicleThroughDirectDoorOnly, // Forces the player to only use direct access when entering vehicles
  TaskCullExtraFarAway, // Can be set by ai tasks on the main task tree to disable a ped getting cull from a vehicle.
  IsVaulting, // Set the entire time CTaskVault is running.
  IsParachuting, // Set the entire time CTaskParachute is running.
  SuppressSlowingForCorners, // If set this will prevent the ped from slowing down to take corners this frame
  DisableProcessProbes, // Disables processing of probes.
  DisablePlayerAutoVaulting,
  DisableGaitReduction,
  ExitVehicleTaskFinishedThisFrame,
  RequiresLegIk,
  JayWalking, // If set then the ped is jay walking and a vehicle is allowed to run him over.
  UseBulletPenetration, // Ped will use bullet penetration code.
  ForceAimAtHead, // Force all attackers to target the head of this ped
  IsInStationaryScenario, // In a scenario and not moving
  TemporarilyBlockWeaponEquipping, // Stop weapon equipping
  CoverOutroRunning, // TASK_AIM_GUN_FROM_COVER_OUTRO
  DisableSeeThroughChecksWhenTargeting, // Any targeting LoS checks will fail if any materials with 'see through' materials found.
  PuttingOnHelmet, //  putting on helmet
  AllowPullingPedOntoRoute, //  allows goto task to apply heading in order to pull a ped back onto their route
  ApplyAnimatedVelocityWhilstAttached, // Allows attachment offsets to be updated from animated velocities
  AICoverEntryRunning, // TASK_ENTER_COVER : State_PlayAIEntryAnim
  ResponseAfterScenarioPanic, // The ped is entering threat response after panic exiting a scenario.
  IsNearDoor, // Ped is near a non-vehicle door
  DisableTorsoSolver,
  PanicInVehicle,
  DisableDynamicCapsuleRadius, // Turn off dynamic adjustments to ped capsules
  IsRappelling, // Is currently in a rappel task
  SkipReactInReactAndFlee, // When this ped goes to ThreatResponse, play the flee transition but not the reaction clip if fleeing.
  CannotBeTargeted, // Will prevent this ped from being a part of any other peds target list
  IsFalling, // Ped is in pure fall state (i.e. no parachuting, landing etc included)
  ForceInjuryAfterStunned, // Forces this ped to the injured state after being stunned
  HurtThisFrame, // The ped has entered the hurt state this frame
  BlockWeaponFire, // Prevent the ped from shooting a weapon
  ExpandPedCapsuleFromSkeleton, // Set the ped capsule radius based on skeleton
  DisableWeaponLaserSight, // Toggle the weapon laser sight off for this frame
  PedExitedVehicleThisFrame, // Set when ped gets set out of vehicle
  SearchingForDropDown, // Ped is seatching for drop down
  UseTighterTurnSettings, // Ped should use tighter turn settings in human locomotion motion task
  DisableArmSolver, // Disable the arm solver this frame
  DisableHeadSolver,
  DisableLegSolver,
  DisableTorsoReactSolver,
  ForcePreCameraAIUpdate,
  TasksNeedProcessMoveSignalCalls, // Set when peds require calls to ProcessMoveSignals(), for AI timeslicing to work with Move
  ShootFromGround,
  NoCollisionMovementMode, // Set when a ped is moving in an area where collisions with fixed geometry are unlikely.  The ped's physics will not be forced to activate.
  IsNearLaddder, // Ped is near top of a ladder
  SkipAimingIdleIntro,
  IgnoredByAutoOpenDoors, // Set this for a ped to be ignored by the auto opened doors when checking to see if the door should be opened.
  BlockIkWeaponReactions, // Ped should not play Ik damager reactions while this flag is set
  FirstPhysicsUpdate, // Ped was just created this frame
  SpawnedThisFrameByAmbientPopulation, // Ped was spawned this frame
  DisableRootSlopeFixupSolver,
  SuspendInitiatedMeleeActions, // Temporarily suspend any melee actions this frame (does not include hit reactions). Use PCF_DisableMelee to turn it off completely
  SuppressInAirEvent, // Prevents ped from getting the in air event the next frame
  AllowTasksIncompatibleWithMotion, // If set, ped will skip CheckTasksAreCompatibleWithMotion
  IsEnteringOrExitingVehicle, // TASK_ENTER_VEHICLE or TASK_EXIT_VEHICLE
  PlayerOnHorse, // TASK_PLAYER_ON_HORSE
  HasGunTaskWithAimingState, // Ped is running TASK_GUN and task's state is State_Aim
  SuppressLethalMeleeActions, // This will suppress any melee action that is considered lethal (RA_IS_LETHAL, defined in action_table.meta)
  InstantBlendToAimFromScript,
  IsStillOnBicycle,
  IsSittingAndCycling,
  IsStandingAndCycling,
  IsDoingCoverAimOutro,
  ApplyCoverWeaponBlockingOffsets,
  IsInLowCover,
  AmbientIdleAndBaseAnimsBlocked, // Blocks ambient idles and base animations from playing.
  UseAlternativeWhenBlock, // If set, ped will use alternative aiming/firing anims
  ForceLowLodWaterCheck, // If set, the ped will always force probe for being in water when in low LOD mode.
  MakeHeadInvisible, // If set, scale the head of the ped to 0.001
  NoAutoRunWhenFiring, // Don't auto run when NoAutoRunWhenFiring is set.
  PermitEventDuringScenarioExit, // Ignore certain aspects (FOV checks, etc) of AffectsPedCore() on some events while the ped is playing a scenario exit.
  DisableSteeringAroundVehicles, //  Enables/disables the low-level steering behaviour around vehicles
  DisableSteeringAroundPeds, //  Enables/disables the low-level steering behaviour around peds
  DisableSteeringAroundObjects, //  Enables/disables the low-level steering behaviour around objects
  DisableSteeringAroundNavMeshEdges, //  Enables/disables the low-level steering behaviour around nav mesh edges
  WantsToEnterVehicleFromCover,
  WantsToEnterCover,
  WantsToEnterVehicleFromAiming,
  CapsuleBeingPushedByVehicle,
  DisableTakeOffParachutePack,
  IsCallingPolice,
  ForceCombatTaunt, // Forces a combat taunt for peds using the insult special ability.
  IgnoreCombatTaunts,
  SkipAiUpdateProcessControl, // True if we've already run this ped's AI and can skip it from within ProcessControl
  OverridePhysics, // A reset flag that disables collision and gravity on the ped and drives entity positions and rotations directly, rather than going through the physics update.
  WasPhysicsOverridden, // True if physics was overriden during the last update.
  BlockWeaponHoldingAnims, // Block any onfoot weapon holding anims.
  DisableMoveTaskHeadingAdjustments, // True if the ped's movement task should not adjust the heading of the ped.
  DisableBodyLookSolver,
  PreventAllMeleeTakedowns, // Will temporarily prevent any takedown from being performed on this ped
  PreventFailedMeleeTakedowns, // Will temporarily prevent any failed takedowns from being performed on this ped
  IsPedalling,
  UseTighterAvoidanceSettings, // Ped should use tighter avoidance settings in navigation task
  IsHigherPriorityClipControllingPed, // True if the active task on the main task tree is taking responsibility for the mover track
  VehicleCrushingRagdoll, // Set to true if a vehicle is pressing downward on the ragdoll
  OnActivationUpdate, // Ped was just activated this frame
  ForceMotionStateLeaveDesiredMBR, // Set this to disable setting the desired move blendratio when forcing the motion state. Usefull for forcing a flee start, etc
  DisableDropDowns, // Disable drop downs for this ped
  InContactWithBIGFoliage, // ped is in contact with GTA_FOLIAGE_TYPE bounds that are large and the player can be hidden
  DisableTakeOffScubaGear,
  DisableCellphoneAnimations, // tells taskmobile phone to Blends out move network and prevents it from blending in
  IsExitingVehicle, // TASK_EXIT_VEHICLE
  DisableActionMode, // Disables combat anims for ped
  EquippedWeaponChanged, // Equipped weapon changed this frame
  TouchingOverhang, // Some part appears to be contrained downwards
  TooSteepForPlayer, // We're standing on something flagged too steep for the player to stand on
  BlockSecondaryAnim, // Block any secondary scripted task animations playing on this ped
  IsInCombat, // This ped is running the combat task
  UseHeadOrientationForPerception, // Will use the ped's head orientation for perception tests
  IsDoingDriveby, // This ped is running a driveby gun or projectile task
  IsEnteringCover, // This ped is running a cover entry task
  ForceMovementScannerCheck, // Set to make CStaticMovementScanner::Scan() check for collisions as if we were moving
  DisableJumpRagdollOnCollision, // If true, the player will no longer auto-ragdoll when colliding with objects, peds, etc. while jumping
  IsBeingMeleeHomedByPlayer, // Set on the target ped in melee if the player is homing towards them
  ShouldLaunchBicycleThisFrame, // This ped should launch the bicycle this frame
  CanDoBicycleWheelie, // This ped can do a bicycle wheelie
  ForceProcessPhysicsUpdateEachSimStep, // If true, ProcessPhysics() will execute completely for each physics simulation step
  DisablePedCapsuleMapCollision, // Disables collision between the ped capsule and the map (usefull in cases where the entity position is being tightly controlled outside of physics, e.g. by an animation)
  DisableSeatShuffleDueToInjuredDriver, // If true, motion in vehicle task won't shuffle to the driver seat just because the driver is injured
  DisableParachuting,
  ProcessPostMovement, // do we need to call ProcessPostMovement for tasks
  ProcessPostCamera, // do we need to call ProcessPostCamera for tasks
  ProcessPostPreRender, // do we need to call ProcessPostPreRender for tasks
  PreventBicycleFromLeaningOver,
  KeepParachutePackOnAfterTeleport,
  DontRaiseFistsWhenLockedOn,
  PreferMeleeBodyIkHitReaction, // This will prefer all melee hit reactions to use body ik hit reactions if ragdoll is not selected
  ProcessPhysicsTasksMotion, // do we need to call process physics for motion tasks this frame
  ProcessPhysicsTasksMovement, // do we need to call process physics for movement tasks this frame
  DisableFriendlyGunReactAudio, // If set, disables friendly responses to gunshots/being aimed at.
  DisableAgitationTriggers,
  ForceForwardTransitionInReactAndFlee, // If set, force CTaskReactAndFlee to use a forward facing flee transition
  IsEnteringVehicle, // TASK_ENTER_VEHICLE
  DoNotSkipNavMeshTrackerUpdate, // If set we will not allow the NavMeshTracker update to be skipped this frame.
  RagdollOnVehicle, // Set to true when the ragdoll is lying on top of a vehicle (note- hands, feet, forearms and shins are not included in the test)
  BlockRagdollActivationInVehicle,
  DisableNMForRiverRapids, // If set, disable NM reactions to fast moving water
  IsInWrithe, // If set, the ped is on the ground writhing and might start shooting from ground
  PreventGoingIntoStillInVehicleState, // If set, the ped will not go into the still in vehicle pose
  UseFastEnterExitVehicleRates, // If set, the ped will get in and out of vehicles faster
  DisableGroundAttachment, // If set, the ped won't attach to a ground physical when his physics disables (useful for cutscenes, etc)
  DisableAgitation,
  DisableTalk,
  InterruptedToQuickStartEngine,
  PedEnteredFromLeftEntry,
  IsDiving,
  DisableVehicleImpacts,
  DeepVehicleImpacts,
  DisablePedCapsuleControl,
  UseProbeSlopeStairsDetection,
  DisableVehicleDamageReactions,
  DisablePotentialBlastReactions,
  OnlyAllowLeftArmDoorIk,
  OnlyAllowRightArmDoorIk,
  ForceProcessPedStandingUpdateEachSimStep, // When set, ProcessPedStanding will get called for each physics step.
  DisableFlashLight, // When set, the flash light on a Ai weapon will be turned off.
  DoingCombatRoll, // When set, the ped is doing a combat roll
  DisableBodyRecoilSolver,
  CanAbortExitForInAirEvent, // When set, the ped can abort the exit vehicle anim to go into fall
  DisableSprintDamage,
  ForceEnableFlashLightForAI, // When set, the ai ped will enable their flash light
  IsDoingCoverAimIntro,
  IsAimingFromCover,
  WaitingForCompletedPathRequest, // This ped is waiting for a path request which is now complete, so their tasks must be updated this frame
  DisableCombatAudio,
  DisableCoverAudio,
  PreventBikeFromLeaning,
  InCoverTaskActive,
  EnableSteepSlopePrevention, // Pushes the ped through the same steep slope tolerances in TaskMotionBase that the player encounters
  InsideEnclosedSearchRegion,
  JumpingOutOfVehicle,
  IsTuckedOnBicycleThisFrame,
  ProcessPostMovementTimeSliced, // Parallel flag to ProcessPostMovement, except this is reset in PreTask(), meaning it stays consistent across timeslicing.
  EnablePressAndReleaseDives,
  OnlyExitVehicleOnButtonRelease,
  IsGoingToStandOnExitedVehicle,
  BlockRagdollFromVehicleFallOff,
  DisableTorsoVehicleSolver,
  IsExitingUpsideDownVehicle,
  IsExitingOnsideVehicle,
  IsExactStopping,
  IsExactStopSettling,
  IsTrainCrushingRagdoll,
  OverrideHairScale, // Scales the ped's hair down to the specified value
  ConsiderAsPlayerCoverThreatWithoutLOS, // Considered as a threat as part of player cover search even if they can't see the player
  BlockCustomAIEntryAnims,
  IgnoreVehicleEntryCollisionTests,
  StreamActionModeAnimsIfDisabled, // Stream action mode anims even if action mode is disabled
  ForceUpdateRagdollMatrix, // Ped requires ragdoll matrix update next frame.
  PreventGoingIntoShuntInVehicleState, // If set, the ped will not go into the shunt in vehicle pose
  DisableIndependentMoverFrame,
  DoingDrivebyOutro,
  BeingElectrocuted,
  DisableUnarmedDrivebys,
  TalkingToPlayer,
  DontActivateRagdollFromPlayerPedImpactReset, // Block ragdoll activations from animated player bumps
  DontActivateRagdollFromAiRagdollImpactReset, // Block ragdoll activations from collisions with an ai ragdoll
  DontActivateRagdollFromPlayerRagdollImpactReset, // Block ragdoll activations from collisions with a player ragdoll
  DisableVisemeBodyAdditive, // If set, prevents visemes from playing any additive body animations
  CapsuleBeingPushedByPlayerCapsule, // Set when the player capsule is pushing up against this peds capsule
  ForceActionMode,
  ForceUnarmedActionMode,
  UsingMoverExtraction, // Set when the players capsule is getting repositioned each frame relative to an anim and origin
  BeingJacked,
  EnableVoiceDrivenMouthMovement, // If set, turn on the voice driven mouth movement
  IsReloading,
  UseTighterEnterVehicleSettings, // Ped should use tighter (shorter) settings for entering vehicles
  InRaceMode, // Set when the player is in the race mode.
  DisableAmbientMeleeMoves, // Disable ambient (initial) melee moves
  ForceBuoyancyProcessingIfAsleep,
  AllowSpecialAbilityInVehicle, // Allows the player to trigger the special ability while in a vehicle
  DisableInVehicleActions, // Prevents ped from doing in vehicle actions such as starting engine, hotwiring, closing door etc.
  ForceInstantSteeringWheelIkBlendIn, // Forces ped to blend in steering wheel ik instantly rather than over time.
  IgnoreThreatEngagePlayerCoverBonus, // Ignores the bonus score for selecting cover that the player can engage the enemy at
  Block180Turns, // Blocks triggering of 180 turns in human locomotion this frame.
  DontCloseVehicleDoor, // Prevents the ped from closing the vehicle door of the car they're in
  SkipExplosionOcclusion, // Map collision will not block this ped from being hit by explosions
  ProcessPhysicsTasksTimeSliced, // Parallel flag to ProcessPhysicsTasks, except this is reset in PreTask(), meaning it stays consistent across timeslicing.
  MeleeStrikeAgainstNonPed, // Set when the ped has performed a melee strike and hit any non ped material
  IgnoreNavigationForDoorArmIK, // We will not attempt to walk around doors when using arm IK
  DisableAimingWhileParachuting, // Disable aiming while parachuting
  DisablePedCollisionWithPedEvent, // Disable hit reaction due to colliding with a ped
  IgnoreVelocityWhenClosingVehicleDoor, // Will ignore the vehicle speed threshold and close the door anyway
  SkipOnFootIdleIntro,
  DontWalkRoundObjects, // Don't walk round objects that we collide with whilst moving
  DisablePedEnteredMyVehicleEvents,
  CancelLeftHandGripIk, // Call ProcessLeftHandGripIk() to cancel left hand grip IK, at the right time of the frame
  ResetMovementStaticCounter, // Will keep reset the static counter when this is set
  DisableInVehiclePedVariationBlocking, // Will allow ped variations to be rendered in vehicles, even if marked otherwise
  ReduceEffectOfVehicleRamControlLoss, // When on a mission this reset flag will slightly reduce the amount of time the player loses control of their vehicle when hit by an AI ped
  DisablePlayerMeleeFriendlyAttacks, // Another flag to disable friendly attack from the player. Set on the opponent you would like it to be disabled on.
  MotionPedDoPostMovementIndependentMover,
  IsMeleeTargetUnreachable, // Set when the melee target has been deemed unreachable (AI only)
  DisableAutoForceOutWhenBlowingUpCar,
  ThrowingProjectile,
  OverrideHairScaleLarger, // Scales the ped's hair up to the specified value
  DisableDustOffAnims, // Disable amient dust off animations
  DisableMeleeHitReactions, // This ped will refrain from ever performing a melee hit reaction
  VisemeAnimsAudioBlocked, // Blocks viseme anims audio from playing
  AllowHeadPropInVehicle, // This overrides PV_FLAG_NOT_IN_CAR set on any head prop and stops it from being removed when getting into the vehicle
  IsInVehicleChase,
  DontQuitMotionAiming,
  SetLastBoundMatricesDone, // Ensure that the last bound matrices are only updated once per frame
  PreserveAnimatedAngularVelocity, // Don't allow the locomotion task to adjust angular velocity coming from animation
  OpenDoorArmIK, // Set if the ped should enable open door arm IK
  UseTighterTurnSettingsForScript, // Script set flag, to force use of tighter turn settings in locomotion task
  ForcePreCameraProcessExternallyDrivenDOFs, // Set if the ped should process externally driven dofs before the pre-camera ai update
  LadderBlockingMovement, // Ped is waiting for ladder and blocking movement to prevent falling off
  DisableVoiceDrivenMouthMovement, // If set, turn off the voice driven mouth movement (overrides EnableVoiceDrivenMouthMovement)
  SteerIntoSkids, // If set, steer into skids while driving
  AllowOpenDoorIkBeforeFullMovement, // When set, code will ignore the logic that requires the ped to be in CTaskHumanLocomotion::State_Moving
  AllowHomingMissileLockOnInVehicle, // When set, code will bypass rel settings and allow a homing lock on to this ped when they are in a vehicle
  AllowCloneForcePostCameraAIUpdate,
  DisableHighHeels, // Force the high heels DOF to be 0,
  BreakTargetLock, // Force lock on to break for this ped,
  DontUseSprintEnergy, // Player does not get tired when sprinting,
  DontChangeHorseMbr, // Similar to CPED_RESET_FLAG_DontChangeMbrInSimpleMoveDoNothing, but for horses.
  DisableMaterialCollisionDamage, // Don't be damaged by touching dangerous material (e.g. electic generator)
  DisableMPFriendlyLockon, // Don't target friendly players in MP
  DisableMPFriendlyLethalMeleeActions, // Don't melee kill friendly players in MP
  IfLeaderStopsSeekCover, // If our leader stops, try and seek cover if we can
  ProcessPostPreRenderAfterAttachments, // do we need to call CPED_RESET_FLAG_ProcessPostPreRenderAfterAttachments for tasks
  DoDamageCoughFacial,
  IsUsingJetpack, // Is ped currently using jetpack. e.g. in air
  UseInteriorCapsuleSettings, // Use Interior capsule settings
  IsClosingVehicleDoor, // Ped is closing a vehicle door
  DisableIdleExtraHeadingChange, // Disable lerping the ped towards the desired heading in the locomotion idle
  OnlySelectVehicleWeapons, // Only allows vehicle weapons to be selected in CPedWeaponSelector::SelectWeapon
  IsWarpingIntoVehicleMP, // Set in CTaskEnterVehicle::SetPedInSeat_OnEnter if ped is warping into a vehicle in multiplayer
  RemoveHelmet, // Forces a ped to remove its helmet.
  IsRemovingHelmet, // Returns true if ped is removing its helmet.
  GestureAnimsBlockedFromScript,
  NeverRagdoll, // Disable all attempts by this ped to ragdoll.
  DisableWallHitAnimation, // Disable stuck wall hit animation for the ped this frame.
  PlayAgitatedAnimsInVehicle, // Play agitated anims in vehicle - overrides normal sit idle
  IsSeatShuffling, // Returns true if ped is shuffling seat.
  IsThrowingProjectileWhileAiming, // True if we are running TASK_AIM_AND_THROW_PROJECTILE as a subtask of TASK_AIM_GUN_ON_FOOT.
  DisableProjectileThrowsWhileAimingGun, // Set by script command DISABLE_PLAYER_THROW_GRENADE_WHILE_USING_GUN.
  AllowControlRadioInAnySeatInMP, // Allows ped in any seat to control radio in multiplayer.
  DisableSpycarTransformation, // Blocks ped from manually transforming spycar to/from car/sub modes.
  BlockQuadLocomotionIdleTurns, // Prevent CTaskQuadLocomotion from blending in idle turns, regardless of desired/currenting heading differential.
  BlockHeadbobbingToRadio, // Blocks ped from headbobbing to radio music in vehicles.
  PlayFPSIdleFidgets, // Allows us to load and play idle fidgets in TaskMotionAiming
  ForceExtraLongBlendInForPedSkipIdleCoverTransition, // When putting a ped directly into cover, the ped will blend in the new cover anims slowly to prevent a pose pop
  BlendingOutFPSIdleFidgets, // True if FPS idle fidgets are blending out
  DisableMotionBaseVelocityOverride,
  FPSSwimUseSwimMotionTask, // Set to true when we are pressing forward on the left stick in FPS mode so we switch from Aiming to Swimmimg/Diving motion tasks
  FPSSwimUseAimingMotionTask, // Set to true when we are strafing in water in FPS mode so we use the motion aiming task
  FiringWeaponWhenReady, // set when ped has decided to fire weapon when ready, used in FPS mode
  IsBlindFiring, // True if the blind fire task is running
  IsPeekingFromCover, // True if the ped is peeking in cover
  TaskSkipProcessPreComputeImpacts, // True to bail out of ProcessPreComputeImpacts
  DisableAssistedAimLockon, // Don't ever try to lock on to this ped with cinematic aim
  FPSAllowAimIKForThrownProjectile, // To control enabling of FPS aim IK while using a projectile until it is ready
  TriggerRoadRageAnim,
  ForcePreCameraAiAnimUpdateIfFirstPerson, // Force a pre camera ai and animation update if the ped is the first person camera target during the pre camera update
  NoCollisionDamageFromOtherPeds, // Any ped this is set on won't register damage from collisions against other peds.,
  BlockCameraSwitching, // Block camera view mode switching.,
  NeverDieFromCapsuleRagdollSettings, // Negate the capsule's preference for ragdoll triggering death on this ped.
  InContactWithDeepSurface, // ped is in contact with GTA_DEEP_SURFACE_TYPE bounds
  DontSuppressUseNavMeshToNavigateToVehicleDoorWhenVehicleInWater,
  IncludePedReferenceVelocityWhenFiringProjectiles, // Add on the ped's velocity to the projectile's initial velocity.
  IsDoingCoverOutroToPeek, //
  InstantBlendToAimNoSettle,
  ForcePreCameraAnimUpdate, // Force a pre camera animation update if the ped is the first person camera target during the pre camera update
  DisableHelmetCullFPS, // Disables PV_FLAG_HIDE_IN_FIRST_PERSON from culling the prop in CPedPropsMgr::RenderPropsInternal
  ShouldIgnoreCoverAutoHeadingCorrection, //
  DisableReticuleInCoverThisFrame,
  ForceScriptedCameraLowCoverAngleWhenEnteringCover,
  DisableCameraConstraintFallBackThisFrame,
  DisableFPSArmIK, // Disables FPS arm IK in CTaskPlayerOnFoot::IsStateValidForFPSIK
  DisableRightArmIKInCoverOutroFPS, // Turn off right arm IK during cover outros in FPS mode when set
  DoFPSSprintBreakOut,
  DoFPSJumpBreakOut,
  IsExitingCover,
  WeaponBlockedInFPSMode, // True if running CTaskWeaponBlocked in FPS mode
  PoVCameraConstrained,
  ScriptClearingPedTasks, // Set in CommandClearPedTasksImmediately in commands_task.cpp
  WasFPSJumpingWithProjectile, // ped was jumping on foot with projectile in hand
  DisableMeleeWeaponSelection,
  WaypointPlaybackSlowMoreForCorners, // slow for corners more aggressively for waypoint playback
  FPSPlacingProjectile, // True while placing a projectile in FPS mode,
  UseBulletPenetrationForGlass, // Ped will use bullet penetration code when glass material is hit.
  FPSPlantingBombOnFloor, // Doing a floor plant with a bomb in FPS mode,
  ForceSkipFPSAimIntro, // don't do FPS Aim intro
  CanBePinnedByFriendlyBullets, // If set on a ped then they are allowed to be pinned by bullets from friendly peds
  DisableLeftArmIKInCoverOutroFPS, // Turn off left arm IK during cover outros in FPS mode when set
  DisableSpikeStripRoadBlocks, // Blocks road blocks with spike strips from spawning
  SkipFPSUnHolsterTransition, // skip aim unholster transition
  PutDownHelmetFX, // trigger the put down helmet fx
  IsLowerPriorityMeleeTarget, // Peds marked with this flag will only be able to be hit by the player if the player explicitly presses the melee button
  ForceScanForEventsThisFrame, // disable timeslicing of event scanning
  StartProjectileTaskWithPrimingDisabled, // Set this flag to disable priming when the projectile task starts up until the attack trigger is released and pressed again
  CheckFPSSwitchInCameraUpdate, // Set if we want to perform a second AI/anim update when switching between first person/third person
  ForceAutoEquipHelmetsInAicraft, // Force ped to auto-equip a helmet om entering aircraft. Overrides PCF_DisableAutoEquipHelmetsInAicraft (set in the interaction menu)
  BlockRemotePlayerRecording, // Flag used by replay editor to disable recording specified remote players (for url:bugstar:2218297).
  InflictedDamageThisFrame, // Inflicted damage this frame
  UseFirstPersonVehicleAnimsIfFPSCamNotDominant, // allow FPS vehicle anims even if FPS camera isn't dominant
  ForceIntoStandPoseOnJetski, // puts the ped in a standing pose on the jetski
  InAirDefenceSphere, // Ped is located inside an air defence sphere.
  SuppressTakedownMeleeActions, // This will suppress all takedown melee actions (RA_IS_TAKEDOWN or RA_IS_STEALTH_KILL, defined in action_table.meta)
  InvertLookAroundControls, // Inverts lookaround controls (right stick / mouse) for this player, for this frame.
  IgnoreCombatManager, // Allows attacking ped to engage another entity without waiting for its turn (if there's multiple attackers).
  UseBlendedCamerasOnUpdateFpsCameraRelativeMatrix, // Check if there is an active camera blending and use the blended camera frame when compute the FPS camera relative matrix.
  ForceMeleeCounter, // Forces the ped to perform a dodge and a counter move if it's attacked.
  WasHitByVehicleMelee, // Indicates that ped was hit by vehicle melee attack.
  SuppressNavmeshForEnterVehicleTask, // Dont allow ped to use navmesh when navigating in TaskEnterVehicle
  DisableShallowWaterBikeJumpOutThisFrame,
  DisablePlayerCombatRoll, // Disables player combat rolling.
  IgnoreDetachSafePositionCheck, // Will ignore safe position check on detaching the ped
  DisableEasyLadderConditions, // Prevents the more forgiving MP ladder detection settings from being used, and forces SP settings.
  PlayerIgnoresScenarioSpawnRestrictions, // Makes local player ignore certain scenario spawn restrictions on scenarios that respect this flag
  UsingDrone, // Indicates player is using Drone from Battle DLC
  ForceWantedLevelWhenKilled, // Will force the player that killed this ped to get wanted level, even if he wouldnt otherwise
  UseScriptedWeaponFirePosition, // Will use scripted firing position on the clones of this ped on other machines
  EnableCollisionOnNetworkCloneWhenFixed, // Enable collision on player ped network clones when physics is fixed
  UseExtendedRagdollCollisionCalculator, // Use extended logic for determining damage instigator for ragdoll collisions
  PreventLockonToFriendlyPlayers, // Prevent the player locking on to friendly players
  OnlyAbortScriptedAnimOnMovementByInput, // Modifies AF_ABORT_ON_PED_MOVEMENT to only trigger an abort when movement would be caused by player input
  PreventAllStealthKills, // Prevents stealth take downs from being preformed on a ped
  BlockFallTaskFromExplosionDamage, // Prevent peds from entering a fall task if affected by explosion damage
  AllowPedRearEntry, // Mimics the behaviour like with boss peds by holding the button for entering the rear seats
}

export enum FLEE_ATTRIBUTE { //Set a specific flee attribute
  UseCover = 1,
  UseVehicle = 2,
  CanScream = 4,
  PreferPavements = 8,
  WanderAtEnd = 16,
  LookForCrowds = 32,
  ReturnToOrignalPositionAfterFlee = 64,
  DisableHandsUp = 128,
  UpdateToNearestHatedPed = 256,
  NeverFlee = 512,
  DisableCower = 1024,
  DisableExitVehicle = 2048,
  DisableReverseInVehicle = 4096,
  DisableAccelerateInVehicle = 8192,
  DisableFleeFromIndirectThreats = 16384,
  CowerInsteadOfFlee = 32768,
  ForceExitVehicle = 65536,
  DisableHesitateInVehicle = 131072,
  DisableAmbientClips = 262144,
}

export enum COMBAT_ATTRIBUTE { //Set a specific combat attribute
  Invalid = -1,
  UseCover = 0, // AI will only use cover if this is set
  UseVehicle = 1, // AI will only use vehicles if this is set
  DoDrivebys = 2, // AI will only driveby from a vehicle if this is set
  LeaveVehicles = 3, // Will be forced to stay in a ny vehicel if this isn't set
  CanUseDynamicStrafeDecisions = 4, // This ped can make decisions on whether to strafe or not based on distance to destination, recent bullet events, etc.
  AlwaysFight = 5, // Ped will always fight upon getting threat response task
  FleeWhilstInVehicle = 6, // If in combat and in a vehicle, the ped will flee rather than attacking
  JustFollowVehicle = 7, // If in combat and chasing in a vehicle, the ped will keep a distance behind rather than ramming
  PlayReactionAnims = 8, // Deprecated
  WillScanForDeadPeds = 9, // Peds will scan for and react to dead peds found
  IsAGuard = 10, // Deprecated
  JustSeekCover = 11, // The ped will seek cover only
  BlindFireInCover = 12, // Ped will only blind fire when in cover
  Aggressive = 13, // Ped may advance
  CanInvestigate = 14, // Ped can investigate events such as distant gunfire, footsteps, explosions etc
  CanUseRadio = 15, // Ped can use a radio to call for backup (happens after a reaction)
  CanCaptureEnemyPeds = 16, // Deprecated
  AlwaysFlee = 17, // Ped will always flee upon getting threat response task
  ForceInjuredOnGround = 18, // Ped will always be injured on ground
  DisableInjuredOnGround = 19, // Ped will never be injured on ground
  CanTauntInVehicle = 20, // Ped can do unarmed taunts in vehicle
  CanChaseTargetOnFoot = 21, // Ped will be able to chase their targets if both are on foot and the target is running away
  WillDragInjuredPedsToSafety = 22, // Ped can drag injured peds to safety
  RequiresLosToShoot = 23, // Ped will require LOS to the target it is aiming at before shooting
  UseProximityFiringRate = 24, // Ped is allowed to use proximity based fire rate (increasing fire rate at closer distances)
  DisableSecondaryTarget = 25, // Normally peds can switch briefly to a secondary target in combat, setting this will prevent that
  DisableEntryReactions = 26, // This will disable the flinching combat entry reactions for peds, instead only playing the turn and aim anims
  PerfectAccuracy = 27, // Force ped to be 100% accurate in all situations (added by Jay Reinebold)
  CanUseFrustratedAdvance = 28, // If we don't have cover and can't see our target it's possible we will advance, even if the target is in cover
  MoveToLocationBeforeCoverSearch = 29, // This will have the ped move to defensive areas and within attack windows before performing the cover search
  CanShootWithoutLos = 30, // Allow shooting of our weapon even if we don't have LOS (this isn't X-ray vision as it only affects weapon firing)
  MaintainMinDistanceToTarget = 31, // Ped will try to maintain a min distance to the target, even if using defensive areas (currently only for cover finding + usage)
  IgnoreHatedPedsInFastMovingVehicles = 32, // Ped will ignore hated peds in fast moving vehicles
  UseProximityAccuracy = 33, // Ped will use proximity based accuracy (increasing accuracy at closer distances)
  CanUsePeekingVariations = 34, // Allows ped to use steamed variations of peeking anims
  DisablePinnedDown = 35, // Disables pinned down behaviors
  DisablePinDownOthers = 36, // Disables pinning down others
  OpenCombatWhenDefensiveAreaIsReached = 37, // When defensive area is reached the area is cleared and the ped is set to use defensive combat movement
  DisableBulletReactions = 38, // Disables bullet reactions
  CanBust = 39, // Allows ped to bust the player
  IgnoredByOtherPedsWhenWanted = 40, // This ped is ignored by other peds when wanted
  CanCommandeerVehicles = 41, // Ped is allowed to "jack" vehicles when needing to chase a target in combat
  CanFlank = 42, // Ped is allowed to flank
  SwitchToAdvanceIfCantFindCover = 43, // Ped will switch to advance if they can't find cover
  SwitchToDefensiveIfInCover = 44, // Ped will switch to defensive if they are in cover
  ClearPrimaryDefensiveAreaWhenReached = 45, // Ped will clear their primary defensive area when it is reached
  CanFightArmedPedsWhenNotArmed = 46, // Ped is allowed to fight armed peds when not armed
  EnableTacticalPointsWhenDefensive = 47, // Ped is not allowed to use tactical points if set to use defensive movement (will only use cover)
  DisableCoverArcAdjustments = 48, // Ped cannot adjust cover arcs when testing cover safety (atm done on corner cover points when  ped usingdefensive area + no LOS)
  UseEnemyAccuracyScaling = 49, // Ped may use reduced accuracy with large number of enemies attacking the same local player target
  CanCharge = 50, // Ped is allowed to charge the enemy position
  RemoveAreaSetWillAdvanceWhenDefensiveAreaReached = 51, // When defensive area is reached the area is cleared and the ped is set to use will advance movement
  UseVehicleAttack = 52, // Use the vehicle attack mission during combat (only works on driver)
  UseVehicleAttackIfVehicleHasMountedGuns = 53, // Use the vehicle attack mission during combat if the vehicle has mounted guns (only works on driver)
  AlwaysEquipBestWeapon = 54, // Always equip best weapon in combat
  CanSeeUnderwaterPeds = 55, // Ignores in water at depth visibility check
  DisableAimAtAiTargetsInHelis = 56, // Will prevent this ped from aiming at any AI targets that are in helicopters
  DisableSeekDueToLineOfSight = 57, // Disables peds seeking due to no clear line of sight
  DisableFleeFromCombat = 58, // To be used when releasing missions peds if we don't want them fleeing from combat (mission peds already prevent flee)
  DisableTargetChangesDuringVehiclePursuit = 59, // Disables target changes during vehicle pursuit
  CanThrowSmokeGrenade = 60, // Ped may throw a smoke grenade at player loitering in combat
  NonMissionPedsFleeFromThisPedUnlessArmed = 61, // Non mission peds will flee from this ped unless they are armed
  ClearAreaSetDefensiveIfDefensiveCannotBeReached = 62, // Will clear a set defensive area if that area cannot be reached
  FleesFromInvincibleOpponents = 63, // Ped will flee from invincible opponents
  DisableBlockFromPursueDuringVehicleChase = 64, // Disable block from pursue during vehicle chases
  DisableSpinOutDuringVehicleChase = 65, // Disable spin out during vehicle chases
  DisableCruiseInFrontDuringBlockDuringVehicleChase = 66, // Disable cruise in front during block during vehicle chases
  CanIgnoreBlockedLosWeighting = 67, // Makes it more likely that the ped will continue targeting a target with blocked los for a few seconds
  DisableReactToBuddyShot = 68, // Disables the react to buddy shot behaviour.
  PreferNavmeshDuringVehicleChase = 69, // Prefer pathing using navmesh over road nodes
  AllowedToAvoidOffroadDuringVehicleChase = 70, // Ignore road edges when avoiding
  PermitChargeBeyondDefensiveArea = 71, // Permits ped to charge a target outside the assigned defensive area.
  UseRocketsAgainstVehiclesOnly = 72, // This ped will switch to an RPG if target is in a vehicle, otherwise will use alternate weapon.
  DisableTacticalPointsWithoutClearLos = 73, // Disables peds moving to a tactical point without clear los
  DisablePullAlongsideDuringVehicleChase = 74, // Disables pull alongside during vehicle chase
  DisableShoutTargetPosition = 75, // Disables the shout target position
  SetDisableShoutTargetPositionOnCombatStart = 76, // Sets the disable shout target position on combat start
  DisableRespondedToThreatBroadcast = 77, // Disables the responded to threat broadcast
  DisableAllRandomsFlee = 78, // If set on a ped, they will not flee when all random peds flee is set to TRUE (they are still able to flee due to other reasons)
  WillGenerateDeadPedSeenScriptEvents = 79, // This ped will send out a script DeadPedSeenEvent when they see a dead ped
  UseMaxSenseRangeWhenReceivingEvents = 80, // This will use the receiving peds sense range rather than the range supplied to the communicate event
  RestrictInVehicleAimingToCurrentSide = 81, // When aiming from a vehicle the ped will only aim at targets on his side of the vehicle
  UseDefaultBlockedLosPositionAndDirection = 82, // LOS to the target is blocked we return to our default position and direction until we have LOS (no aiming)
  RequiresLosToAim = 83, // LOS to the target is blocked we return to our default position and direction until we have LOS (no aiming)
  CanCruiseAndBlockInVehicle = 84, // Allow vehicles spawned infront of target facing away to enter cruise and wait to block approaching target
  PreferAirCombatWhenInAircraft = 85, // Peds flying aircraft will prefer to target other aircraft over entities on the ground
  AllowDogFighting = 86, //Allow peds flying aircraft to use dog fighting behaviours
  PreferNonAircraftTargets = 87, // This will make the weight of targets who aircraft vehicles be reduced greatly compared to targets on foot or in ground based vehicles
  PreferKnownTargetsWhenCombatClosestTarget = 88, //When peds are tasked to go to combat, they keep searching for a known target for a while before forcing an unknown one
  ForceCheckAttackAngleForMountedGuns = 89, // Only allow mounted weapons to fire if within the correct attack angle (default 25-degree cone). On a flag in order to keep exiting behaviour and only fix in specific cases.
  BlockFireForVehiclePassengerMountedGuns = 90, // Blocks the firing state for passenger-controlled mounted weapons. Existing flags UseVehicleAttack and UseVehicleAttackIfVehicleHasMountedGuns only work for drivers.
}

export enum PedRelationship {
  Companion,
  Respect,
  Like,
  Neutral,
  Dislike,
  Hate,
}

export enum PedRelationshipGroup {
  Friendly = 'Friendly',
  Enemy = 'Enemy',
}
