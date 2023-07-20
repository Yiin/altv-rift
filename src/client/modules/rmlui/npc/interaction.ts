// import alt from "alt-client";
// import game from "natives";
// import { Bones } from "@shared/enums/bones";
// import { NpcFlags } from "@shared/modules/npc/constants";
// import { document, registerElement } from "./elements";

// const rml = (...args: any) => {
//   // impl
// };

// function icon(name: string) {
//   const iconEl = document.createElement("img");
//   iconEl.addClass("icon");
//   iconEl.setAttribute("src", `icons/icon-${name}.png`);

//   return iconEl;
// }

// registerElement({
//   key: "interaction",
//   renderDistance: 7,
//   render({ ped, scale }: any) {
//     const flags = (ped.getStreamSyncedMeta("Flags") as NpcFlags) ?? 0;

//     const lowerBodyPos = game.getPedBoneCoords(
//       ped.scriptID,
//       Bones.SKEL_Pelvis,
//       0,
//       0,
//       0
//     );
//     const { x: screenX, y: screenY } = alt.worldToScreen(
//       lowerBodyPos.x,
//       lowerBodyPos.y,
//       lowerBodyPos.z
//     );

//     return rml`
//       <div
//         class="interaction-wrapper"
//         style="transform: translate(-50%, -50%) translate(${screenX}px, ${screenY}px)"
//       >
//         <div
//           class="interaction-content"
//           style="transform: scale(${scale})"
//         >
//           ${
//             flags & NpcFlags.Quest &&
//             rml`
//               <div class="interaction">
//                 ${icon("quest")}
//                 <span class="label">Start quest</span>
//               </div>
//             `
//           }
//           ${
//             flags & NpcFlags.Talkable &&
//             rml`
//               <div class="interaction">
//                 ${icon("dialog")}
//                 <span class="label">Talk</span>
//               </div>
//             `
//           }
//           ${
//             flags & NpcFlags.Shop &&
//             rml`
//               <div class="interaction">
//                 ${icon("shop")}
//                 <span class="label">Shop</span>
//               </div>
//             `
//           }
//         </div>
//       </div>
//     `;
//     // const wrapper = document.createElement("div");
//     // wrapper.ped = ped;
//     // wrapper.addClass("interaction-wrapper");

//     // const content = document.createElement("div");
//     // content.addClass("interaction-content");

//     // const flags = (ped.getStreamSyncedMeta("Flags") as NpcFlags) ?? 0;

//     // if (flags & NpcFlags.Quest) {
//     //   content.appendChild(
//     //     div({}, [icon("quest"), span({ class: "label" }, "Talk")])
//     //   );
//     // } else if (flags & NpcFlags.Talkable) {
//     //   content.appendChild(icon("dialog"));
//     // }

//     // if (flags & NpcFlags.Shop) {
//     //   content.appendChild(icon("shop"));
//     // }

//     // const label = document.createElement("span");
//     // label.addClass("label");
//     // label.innerRML = `Talk`;

//     // content.appendChild(label);

//     // wrapper.appendChild(content);

//     // return wrapper;
//   },
//   update(element, { ped, scale }) {
//     const lowerBodyPos = game.getPedBoneCoords(
//       ped.scriptID,
//       Bones.SKEL_Pelvis,
//       0,
//       0,
//       0
//     );
//     const { x: screenX, y: screenY } = alt.worldToScreen(
//       lowerBodyPos.x,
//       lowerBodyPos.y,
//       lowerBodyPos.z
//     );

//     element.style[
//       "transform"
//     ] = `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;

//     const [content] = element.getElementsByClassName("interaction-content")!;
//     content.style["transform"] = `scale(${scale})`;
//   },
// });
