import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { ServerEvents } from "@shared/events/server";
import { onKeyDown } from "@/utility/event-helpers";

onKeyDown(KeyCode.I, () => {
  alt.emitServer(ServerEvents.FromClient.REQUEST_ITEM);
});
