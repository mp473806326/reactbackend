import { create } from "zustand";

interface UserInfoStore {
  userInfo: UserInfoType | null;
  publicData:string|any;
  updateUserInfo: (userInfo: UserInfoType) => void;
  clearUserInfo: () => void;
  updatePublicData: (publicData:string) => void;
}

export const useUserInfoStore = create<UserInfoStore>(set => ({
  userInfo: null,
  publicData:'公共数据',
  updateUserInfo: userInfo => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
  updatePublicData: (publicData:string) => set({ publicData }),
}));
