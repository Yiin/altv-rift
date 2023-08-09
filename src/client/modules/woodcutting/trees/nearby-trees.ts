import alt from "alt-client";
import { QuadTree, Box, Point, Circle } from "js-quadtree";
import * as trees from "./.";

export type TreeData = {
  type: keyof typeof trees;
  pos: {
    x: number;
    y: number;
    z: number;
  };
};

const minX = -8000;
const minY = -8000;
const maxX = 8000;
const maxY = 8000;

const width = maxX - minX;
const height = maxY - minY;
const boundingArea = new Box(minX, minY, width, height);

// Instantiate the new quadtree
const quadtree = new QuadTree(boundingArea, {
  capacity: 20,
  removeEmptyNodes: true,
});

let nearbyTrees: TreeData[] = [];

// Insert trees' coordinates into the quadtree
Object.entries(trees).forEach(([key, trees]) => {
  trees
    .map((tree) => ({ pos: tree, type: key }))
    .forEach((tree) => {
      quadtree.insert(new Point(tree.pos.x, tree.pos.y, tree));
    });
});

// Function to update the list of nearby trees
function updateNearbyTrees() {
  // Query the quadtree for trees within a specific radius
  nearbyTrees = quadtree
    .query(new Circle(alt.Player.local.pos.x, alt.Player.local.pos.y, 30))
    .map<TreeData>((point) => point.data);
}

// Call updateNearbyTrees with appropriate observer position and max distance
alt.setInterval(updateNearbyTrees, 1000);

export function getNearbyTrees() {
  return nearbyTrees;
}
