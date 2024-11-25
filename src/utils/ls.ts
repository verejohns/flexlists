import { IWidget } from "src/constants/widget";
export const getFromItemsLS = (keyLS: string) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const savedItem = localStorage.getItem(keyLS);
    if (!savedItem) return [];
    return JSON.parse(savedItem || "");
  } else {
    return [];
  }
};
export const setItemsLS = (keyLS: string, items: IWidget[]) => {
  if (global.localStorage && typeof window !== "undefined") {
    return global.localStorage.setItem(keyLS, JSON.stringify(items));
  }
};

export const setLayoutToLS = (key: string, value: any, keyLC: string) => {
  if (global.localStorage && typeof window !== "undefined") {
    global.localStorage.setItem(
      keyLC,
      JSON.stringify({
        [key]: value,
      })
    );
  }
};

export const getLayoutFromLS = (key: any, keyLS: string) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const savedItem = global.localStorage.getItem(keyLS);
    if (!savedItem) return {};
    const obj = JSON.parse(savedItem || "");
    return obj[key];
  } else {
    return {};
  }
};

export const setAppIdToLS = (key: string, listenerApi: any) => {
  if (global.localStorage) {
    global.localStorage.setItem(key, JSON.stringify(listenerApi));
  }
};

export const getAppIdToLS = (keyLS: string | null) => {
  if (global.localStorage && keyLS) {
    try {
      const savedItem = localStorage.getItem(keyLS);
      if (!savedItem) return null;
      return JSON.parse(savedItem || "");
    } catch (e) {}
  }
  return null;
};
export const removeItemLS = (key: string) => {
  if (global.localStorage) {
    global.localStorage.removeItem(key);
  }
};