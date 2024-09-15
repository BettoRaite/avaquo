export const splitInto2DArray = (arr: unknown[], items: number) => {
  const arr2d = [];
  for (let i = 0; i < arr.length; i += items) {
    arr2d.push(arr.slice(i, i + items));
  }
  return arr2d;
};
