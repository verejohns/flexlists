export function getDistinctObjects<T, K extends keyof T>(objects: T[], property: K): T[] {
  const distinctValues = new Set(objects.map(object => object[property]));
  const distinctObjects = Array.from(distinctValues).map(value => {
    const matchingObject = objects.find(object => object[property] === value);
    return matchingObject as T;
  });
  return distinctObjects;
};

export function areListsEqual(list1: number[], list2: number[]): boolean {
  // Check if the lengths of the lists are equal
  if (list1.length !== list2.length) {
    return false;
  }

  // Sort the lists
  const sortedList1 = list1.sort((a, b) => a - b);
  const sortedList2 = list2.sort((a, b) => a - b);

  // Compare the sorted lists
  for (let i = 0; i < sortedList1.length; i++) {
    if (sortedList1[i] !== sortedList2[i]) {
      return false;
    }
  }

  return true;
};

export const hasDuplicatedItem = (array: any[], key: string) => {
  const duplicatedArray = array.filter(
    (el: any, index: number) =>
      array.findIndex((item: any) => item[key].toLowerCase() === el[key].toLowerCase()) !== index
  );

  if (duplicatedArray.length) return true;
  
  return false;
};