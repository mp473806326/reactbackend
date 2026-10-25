export const Local = {
  // 写入永久缓存
  set(key: string, value: unknown) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  // 获取永久缓存，非 JSON 格式的旧数据按原字符串返回
  get(key: string) {
    const storageVal = window.localStorage.getItem(key);
    if (storageVal === null) return null;
    try {
      return JSON.parse(storageVal);
    } catch {
      return storageVal;
    }
  },
  // 是否存在永久缓存
  has(key: string) {
    return window.localStorage.getItem(key) !== null;
  },
  // 删除永久缓存
  remove(key: string) {
    window.localStorage.removeItem(key);
  },
  // 清空永久缓存
  clear() {
    window.localStorage.clear();
  },
};
