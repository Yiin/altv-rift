export const wrap = (value: number, to: number, from = 0) => {
  return value < from ? to - 1 : value > to - 1 ? from : value;
};
