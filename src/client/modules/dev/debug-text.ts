import alt from "alt-client";
import { Events } from "@shared/constants/events";
import { getWebview } from "@/utility/user-interface";
import { everyTick } from "@/utility/event-helpers";

// getWebview((webview) => {
//   everyTick(async () => {
//     webview.emit(Events.Webview.DEBUG, {
//       pos: JSON.stringify(
//         {
//           x: alt.Player.local.pos.x.toFixed(2),
//           y: alt.Player.local.pos.y.toFixed(2),
//           z: alt.Player.local.pos.z.toFixed(2),
//           r: alt.Player.local.rot.z.toFixed(2),
//         },
//         null,
//         2
//       ),
//     });
//   });
// });
