// declare module "@altv/server" {
//   namespace Events {
//     export function onEvent<E extends keyof CustomServerEvent>(
//       eventName: E,
//       listener: CustomServerEvent[E]
//     ): void;
//     export function onPlayerEvent<
//       E extends keyof import("@altv/shared").Events.CustomPlayerToServerEvent
//     >(
//       eventName: E,
//       listener: (
//         player: Player,
//         ...args: Parameters<import("@altv/shared").Events.CustomPlayerToServerEvent[E]>
//       ) => void
//     ): void;
//   }
// }

// declare module "@altv/client" {
//   namespace Events {
//     export function onEvent<E extends keyof CustomClientEvent>(
//       eventName: E,
//       listener: CustomClientEvent[E]
//     ): void;
//     export function onServerEvent<
//       E extends keyof import("@altv/shared").Events.CustomServerToPlayerEvent
//     >(eventName: E, listener: import("@altv/shared").Events.CustomServerToPlayerEvent[E]): void;
//   }
// }
