/**
 * VRM configuration constants.
 *
 * Rig maps, file lists, base URLs, and bone-name matching patterns
 * extracted from the original monolithic index.html.
 */

// ---------------------------------------------------------------------------
// Rig Maps
// ---------------------------------------------------------------------------

/** Mixamo bone names -> VRM humanoid bone names */
export const mixamoVRMRigMap: Record<string, string> = {
  mixamorigHips: 'hips',
  mixamorigSpine: 'spine',
  mixamorigSpine1: 'chest',
  mixamorigSpine2: 'upperChest',
  mixamorigNeck: 'neck',
  mixamorigHead: 'head',
  mixamorigLeftShoulder: 'leftShoulder',
  mixamorigLeftArm: 'leftUpperArm',
  mixamorigLeftForeArm: 'leftLowerArm',
  mixamorigLeftHand: 'leftHand',
  mixamorigLeftHandThumb1: 'leftThumbMetacarpal',
  mixamorigLeftHandThumb2: 'leftThumbProximal',
  mixamorigLeftHandThumb3: 'leftThumbDistal',
  mixamorigLeftHandIndex1: 'leftIndexProximal',
  mixamorigLeftHandIndex2: 'leftIndexIntermediate',
  mixamorigLeftHandIndex3: 'leftIndexDistal',
  mixamorigLeftHandMiddle1: 'leftMiddleProximal',
  mixamorigLeftHandMiddle2: 'leftMiddleIntermediate',
  mixamorigLeftHandMiddle3: 'leftMiddleDistal',
  mixamorigLeftHandRing1: 'leftRingProximal',
  mixamorigLeftHandRing2: 'leftRingIntermediate',
  mixamorigLeftHandRing3: 'leftRingDistal',
  mixamorigLeftHandPinky1: 'leftLittleProximal',
  mixamorigLeftHandPinky2: 'leftLittleIntermediate',
  mixamorigLeftHandPinky3: 'leftLittleDistal',
  mixamorigRightShoulder: 'rightShoulder',
  mixamorigRightArm: 'rightUpperArm',
  mixamorigRightForeArm: 'rightLowerArm',
  mixamorigRightHand: 'rightHand',
  mixamorigRightHandThumb1: 'rightThumbMetacarpal',
  mixamorigRightHandThumb2: 'rightThumbProximal',
  mixamorigRightHandThumb3: 'rightThumbDistal',
  mixamorigRightHandIndex1: 'rightIndexProximal',
  mixamorigRightHandIndex2: 'rightIndexIntermediate',
  mixamorigRightHandIndex3: 'rightIndexDistal',
  mixamorigRightHandMiddle1: 'rightMiddleProximal',
  mixamorigRightHandMiddle2: 'rightMiddleIntermediate',
  mixamorigRightHandMiddle3: 'rightMiddleDistal',
  mixamorigRightHandRing1: 'rightRingProximal',
  mixamorigRightHandRing2: 'rightRingIntermediate',
  mixamorigRightHandRing3: 'rightRingDistal',
  mixamorigRightHandPinky1: 'rightLittleProximal',
  mixamorigRightHandPinky2: 'rightLittleIntermediate',
  mixamorigRightHandPinky3: 'rightLittleDistal',
  mixamorigLeftUpLeg: 'leftUpperLeg',
  mixamorigLeftLeg: 'leftLowerLeg',
  mixamorigLeftFoot: 'leftFoot',
  mixamorigLeftToeBase: 'leftToes',
  mixamorigRightUpLeg: 'rightUpperLeg',
  mixamorigRightLeg: 'rightLowerLeg',
  mixamorigRightFoot: 'rightFoot',
  mixamorigRightToeBase: 'rightToes',
};

/** Generic / Blender bone names -> VRM humanoid bone names */
export const genericVRMRigMap: Record<string, string> = {
  Hips: 'hips',
  Spine: 'spine',
  Chest: 'chest',
  UpperChest: 'upperChest',
  Neck: 'neck',
  Head: 'head',
  LeftShoulder: 'leftShoulder',
  LeftUpperArm: 'leftUpperArm',
  LeftLowerArm: 'leftLowerArm',
  LeftHand: 'leftHand',
  RightShoulder: 'rightShoulder',
  RightUpperArm: 'rightUpperArm',
  RightLowerArm: 'rightLowerArm',
  RightHand: 'rightHand',
  LeftUpperLeg: 'leftUpperLeg',
  LeftLowerLeg: 'leftLowerLeg',
  LeftFoot: 'leftFoot',
  LeftToes: 'leftToes',
  RightUpperLeg: 'rightUpperLeg',
  RightLowerLeg: 'rightLowerLeg',
  RightFoot: 'rightFoot',
  RightToes: 'rightToes',
  hips: 'hips',
  spine: 'spine',
  chest: 'chest',
  upper_chest: 'upperChest',
  neck: 'neck',
  head: 'head',
  'shoulder.L': 'leftShoulder',
  'upper_arm.L': 'leftUpperArm',
  'forearm.L': 'leftLowerArm',
  'hand.L': 'leftHand',
  'shoulder.R': 'rightShoulder',
  'upper_arm.R': 'rightUpperArm',
  'forearm.R': 'rightLowerArm',
  'hand.R': 'rightHand',
  'thigh.L': 'leftUpperLeg',
  'shin.L': 'leftLowerLeg',
  'foot.L': 'leftFoot',
  'toe.L': 'leftToes',
  'thigh.R': 'rightUpperLeg',
  'shin.R': 'rightLowerLeg',
  'foot.R': 'rightFoot',
  'toe.R': 'rightToes',
};

/** Merged rig map (generic first, mixamo overrides) */
export const combinedRigMap: Record<string, string> = {
  ...genericVRMRigMap,
  ...mixamoVRMRigMap,
};

// ---------------------------------------------------------------------------
// File lists
// ---------------------------------------------------------------------------

export const vrmFiles: string[] = [
  '0001_01 2.vrm',
  '0001_01 3.vrm',
  '0001_02 2.vrm',
  '0001_02 3.vrm',
  '0001_02.vrm',
  '0001_03 2.vrm',
  '0001_03.vrm',
  '0001_04 2.vrm',
  '0001_04.vrm',
  '0001_05 2.vrm',
  '0001_05.vrm',
  '0001_06 2.vrm',
  '0001_06.vrm',
  '0001_07 2.vrm',
  '0001_07 3.vrm',
  '0001_07.vrm 2',
  '0001_07.vrm',
  '0001_08 2.vrm',
  '0001_08 3.vrm',
  '0001_08.vrm 2',
  '0001_08.vrm',
  '0001_09 2.vrm',
  '0001_09.vrm',
  '0001_10.vrm',
];

export const fbxFiles: string[] = [
  'Angry.fbx',
  'Bashful.fbx',
  'Blow A Kiss.fbx',
  'Booty Hip Hop Dance.fbx',
  'Cross Jumps.fbx',
  'Hand Raising.fbx',
  'Happy.fbx',
  'Hip Hop Dancing.fbx',
  'Idle Stand.fbx',
  'Jumping Jacks.fbx',
  'Quick Steps.fbx',
  'Rumba Dancing.fbx',
  'Snake Hip Hop Dance.fbx',
  'Standing Arguing.fbx',
  'Standing Greeting.fbx',
  'Step Hip Hop Dance.fbx',
  'Talking.fbx',
  'Taunt.fbx',
  'Thinking.fbx',
  'Threatening.fbx',
];

// ---------------------------------------------------------------------------
// Base URLs (prefer env vars, fall back to defaults)
// ---------------------------------------------------------------------------

export const VRM_BASE_URL: string =
  process.env.NEXT_PUBLIC_VRM_BASE_URL ?? 'https://n6n.top/Model/';

export const FBX_BASE_URL: string =
  process.env.NEXT_PUBLIC_FBX_BASE_URL ?? 'https://n6n.top/Anim/';

// ---------------------------------------------------------------------------
// Name patterns for fuzzy bone matching
// ---------------------------------------------------------------------------

export const namePatterns: Record<string, RegExp> = {
  hips: /hip/i,
  spine: /spine/i,
  chest: /chest|spine1/i,
  upperChest: /upperchest|spine2/i,
  neck: /neck/i,
  head: /head/i,
  leftShoulder: /l(eft)?[-_\s]?shoulder/i,
  leftUpperArm: /l(eft)?[-_\s]?(upper)?[-_\s]?arm/i,
  leftLowerArm: /l(eft)?[-_\s]?(lower|fore)[-_\s]?arm/i,
  leftHand: /l(eft)?[-_\s]?hand/i,
  rightShoulder: /r(ight)?[-_\s]?shoulder/i,
  rightUpperArm: /r(ight)?[-_\s]?(upper)?[-_\s]?arm/i,
  rightLowerArm: /r(ight)?[-_\s]?(lower|fore)[-_\s]?arm/i,
  rightHand: /r(ight)?[-_\s]?hand/i,
  leftUpperLeg: /l(eft)?[-_\s]?(upper|up)[-_\s]?leg|l(eft)?[-_\s]?thigh/i,
  leftLowerLeg: /l(eft)?[-_\s]?(lower)?[-_\s]?leg|l(eft)?[-_\s]?(shin|calf)/i,
  leftFoot: /l(eft)?[-_\s]?foot/i,
  leftToes: /l(eft)?[-_\s]?(toe|toebase)/i,
  rightUpperLeg: /r(ight)?[-_\s]?(upper|up)[-_\s]?leg|r(ight)?[-_\s]?thigh/i,
  rightLowerLeg: /r(ight)?[-_\s]?(lower)?[-_\s]?leg|r(ight)?[-_\s]?(shin|calf)/i,
  rightFoot: /r(ight)?[-_\s]?foot/i,
  rightToes: /r(ight)?[-_\s]?(toe|toebase)/i,
};
