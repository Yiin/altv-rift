export const FromClient = {
  BEGIN_CONNECTION: "BEGIN_CONNECTION",
  SCREENSHOT_POPULATE_DATA: "SCREENSHOT_POPULATE_DATA",
  DISCORD_AUTH_DONE: "DISCORD_AUTH_DONE",
  NOTIFY: "NOTIFY",
  WEAPON_SHOOT: "WEAPON_SHOOT",
  CONVERSATION_STARTED: "CONVERSATION_STARTED",
  CLOSE_WINDOW: "CLOSE_WINDOW",
} as const;

declare module "@altv/shared" {
  namespace Events {
    interface CustomPlayerToServerEvent {
      [FromClient.BEGIN_CONNECTION]: () => void;
      [FromClient.SCREENSHOT_POPULATE_DATA]: (payload: {
        data: string;
        i: number;
        totalLength: number;
      }) => void;
      [FromClient.DISCORD_AUTH_DONE]: (token: string) => void;
      [FromClient.NOTIFY]: (notification: string) => void;
      [FromClient.WEAPON_SHOOT]: () => void;
      [FromClient.CONVERSATION_STARTED]: (pedRemoteId: number) => void;
      [FromClient.CLOSE_WINDOW]: () => void;
    }
  }
}
