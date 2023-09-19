export function getDefaultClothing(isMale: boolean, component: number) {
  if (isMale) {
    return {
      2: [0, 0],
      3: [15, 0],
      4: [61, 0],
      5: [0, 0],
      6: [34, 0],
      7: [0, 0],
      8: [15, 0],
      9: [0, 0],
      10: [0, 0],
      11: [15, 0],
    }[component];
  } else {
    return {
      2: [0, 0],
      3: [15, 0],
      4: [19, 0],
      5: [0, 0],
      6: [35, 0],
      7: [0, 0],
      8: [14, 0],
      9: [0, 0],
      10: [0, 0],
      11: [18, 0],
    }[component];
  }
}
