export const getItemImage = (item: { key: string }) => {
  return `./assets/items/${item.key}.png`;
};

// function getFallback(item) {
//   let svg;
//   if (item.type === ItemType.MATERIAL) {
//     if (item.key.endsWith("_logs")) {
//       svg = getLogIcon(item.key);
//     }
//   }
//   return `url('data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}')`
// }

// function getLogIcon(key) {

// }

export const getItemIconScale = (item: { key: string }) => {
  return (
    {
      snowball: "40%",
    }[item.key] || "90%"
  );
};
