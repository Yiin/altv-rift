// import { QuadTree, Box, Point, Circle } from "js-quadtree";
// import { TreeType } from "../interfaces/tree-type.type";
// import treesToIgnore from "./trees-to-ignore.json";
// import * as trees from ".";

// export type TreeData = {
//   type: TreeType;
//   pos: {
//     x: number;
//     y: number;
//     z: number;
//   };
// };

// const minX = -8000;
// const minY = -8000;
// const maxX = 8000;
// const maxY = 8000;

// const width = maxX - minX;
// const height = maxY - minY;
// const boundingArea = new Box(minX, minY, width, height);

// // Instantiate the new quadtree
// export const quadtree = new QuadTree(boundingArea, {
//   capacity: 30,
//   removeEmptyNodes: true,
// });

// const ignoredTrees = treesToIgnore.filter((tree) => tree.type.startsWith("prop_palm_"));

// // Insert trees' coordinates into the quadtree
// Object.entries(trees).forEach(([key, trees]) => {
//   trees
//     .filter(
//       (tree) =>
//         !ignoredTrees.some(
//           ({ pos: { x, y, z } }) =>
//             tree.Position.X === x && tree.Position.Y === y && tree.Position.Z === z
//         )
//     )
//     .map((tree) => ({
//       pos: { x: tree.Position.X, y: tree.Position.Y, z: tree.Position.Z },
//       type: key,
//     }))
//     .forEach((tree) => {
//       quadtree.insert(new Point(tree.pos.x, tree.pos.y, tree));
//     });
// });
