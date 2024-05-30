// function getVectorInFrontOfPlayer(player, distance) {
//   const forwardVector = getForwardVector(game.getGameplayCamRot(2).toRadians());
//   const posFront = {
//     x: player.pos.x + forwardVector.x * distance,
//     y: player.pos.y + forwardVector.y * distance,
//     z: player.pos.z + forwardVector.z * distance,
//   };

//   return new alt.Vector3(posFront.x, posFront.y, posFront.z);
// }

// function fwdX(x, z) {
//   const num = Math.abs(Math.cos(x));
//   return -Math.sin(z) * num;
// }

// function fwdY(x, z) {
//   const num = Math.abs(Math.cos(x));
//   return Math.cos(z) * num;
// }

// function fwdZ(x) {
//   return Math.sin(x);
// }
// function getForwardVector(rot) {
//   return {
//     x: fwdX(rot.x, rot.z),
//     y: fwdY(rot.x, rot.z),
//     z: fwdZ(rot.x),
//   };
// }

// const id = alt.everyTick(() => {
//     const {x,y,z} = alt.Player.local.pos;
//     const {x:fx, y: fy, z:fz} = getVectorInFrontOfPlayer(alt.Player.local, 10000);
//     game.drawSpotLight(x,y,z, fx, fy, fz, 255, 255, 255, 3000, 1, 0, 10, 0.1);
// });
