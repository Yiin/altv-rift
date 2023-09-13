export const FromClient = {
  BEGIN_CONNECTION: "BEGIN_CONNECTION",
  SCREENSHOT_POPULATE_DATA: "SCREENSHOT_POPULATE_DATA",
  DISCORD_AUTH_DONE: "DISCORD_AUTH_DONE",
  NOTIFY: "NOTIFY",
  WEAPON_SHOOT: "WEAPON_SHOOT",
} as const;

declare module "alt-shared" {
  export interface ICustomClientServerEvent {
    [FromClient.BEGIN_CONNECTION]: () => void;
    [FromClient.SCREENSHOT_POPULATE_DATA]: (payload: {
      data: string;
      i: number;
      totalLength: number;
    }) => void;
    [FromClient.DISCORD_AUTH_DONE]: (token: string) => void;
    [FromClient.NOTIFY]: (notification: string) => void;
    [FromClient.WEAPON_SHOOT]: () => void;
  }
}
