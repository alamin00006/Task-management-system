export const getFromLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setToLocalStorage = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export const removeFromLocalStorage = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
};
