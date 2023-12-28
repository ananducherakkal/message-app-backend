type Sort = Array<[string, "DESC" | "ASC"]>;

const sanitizeSort = (sort: any, supportedSort: string[]): Sort => {
  const sortObj: Sort = [];

  const splitPushSort = (item: any, sortArr: Sort): void => {
    if (typeof item === "string") {
      const itemArr = item.split(",").map((item) => item.trim());
      const key = itemArr.shift();
      const order = itemArr.pop()?.toLowerCase() === "desc" ? "DESC" : "ASC";
      if (key && supportedSort.includes(key)) {
        sortArr.push([key, order]);
      }
    }
  };

  if (Array.isArray(sort)) {
    sort.forEach((item) => {
      splitPushSort(item, sortObj);
    });
  } else {
    splitPushSort(sort, sortObj);
  }
  return sortObj;
};

export default sanitizeSort;
