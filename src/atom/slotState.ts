import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'toDayMusicPersist',
  storage: sessionStorage
});

export const toDayMusicState = atom<string>({
  key: 'toDayMusicState',
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const slotStateState = atom<boolean>({
  key: 'slotStateState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});