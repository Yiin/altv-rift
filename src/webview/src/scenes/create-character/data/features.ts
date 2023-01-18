export const featureNames = [
  "Nose Width",
  "Nose Bottom Height",
  "Nose Tip Length",
  "Nose Bridge Depth",
  "Nose Tip Height",
  "Nose Broken",
  "Brow Height",
  "Brow Depth",
  "Cheekbone Height",
  "Cheekbone Width",
  "Cheek Depth",
  "Eye Size",
  "Lip Thickness",
  "Jaw Width",
  "Jaw Shape",
  "Chin Height",
  "Chin Depth",
  "Chin Width",
  "Chin Indent",
  "Neck Width",
];

export const features = {
  Eyes: [
    {
      name: "Brow",
      y: [6, "Up", "Down"], // Brow Height
      x: [7, "In", "Out"], // Brow Depth
    },
    {
      name: "Eyes",
      x: [11, "Squint", "Wide"], // Eye Size
    },
  ],
  Nose: [
    {
      name: "Nose",
      x: [0, "Narrow", "Wide"], // Nose Width
      y: [1, "Up", "Down"], // Nose Bottom Height
    },
    {
      name: "Nose profile",
      x: [3, "Short", "Long"], // Nose Bridge Depth
      y: [5, "Crooked", "Curved"], // Nose Broken
    },
    {
      name: "Nose tip",
      x: [2, "Broken left", "Broken right"], // Nose Tip Length
      y: [4, "Tip up", "Tip down"], // Nose Tip Height
    },
  ],
  Cheeks: [
    {
      name: "Cheekbones",
      x: [9, "In", "Out"], // Cheekbone Width
      y: [8, "Up", "Down"], // Cheekbone Height
    },
    {
      name: "Cheeks",
      x: [10, "Gaunt", "Puffed"], // Cheek Depth
    },
  ],
  Lips: [
    {
      name: "Lips",
      x: [12, "Thin", "Fat"], // Lip Thickness
    },
  ],
  Jaw: [
    {
      name: "Jaw",
      x: [13, "Narrow", "Wide"], // Jaw Width
      y: [14, "Round", "Square"], // Jaw Shape
    },
    {
      name: "Chin profile",
      x: [16, "In", "Out"], // Chin Depth
      y: [15, "Up", "Down"], // Chin Height
    },
    {
      name: "Chin shape",
      y: [17, "Rounded", "Bum"], // Chin Width
      x: [18, "Square", "Pointed"], // Chin Indent
    },
  ],
  Neck: [
    {
      name: "Neck",
      x: [19, "Slim", "Wide"], // Neck Width
    },
  ],
} as const;

export const getRandomFeatureValue = () => {
  return +(Math.random() - Math.random()).toFixed(2);
};
