export const getItemImage = (item: { key: string }) => {
  return `./assets/items/${item.key}.png`;
};

export const getItemIconScale = (item: { key: string }) => {
  return (
    {
      snowball: "40%",
    }[item.key] || "90%"
  );
};
