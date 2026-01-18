import { atom } from "recoil";

// 검색어 상태
export const searchQueryState = atom<string>({
  key: "searchQueryState",
  default: "",
});

// 정렬 순서 상태
export const sortOrderState = atom<string>({
  key: "sortOrderState",
  default: "", // 초기값은 빈 문자열로, 컴포넌트에서 t("latest")로 설정
});

// 선택된 연도 상태
export const selectedYearState = atom<string>({
  key: "selectedYearState",
  default: "",
});

// 스크롤 위치 상태
export const scrollPositionState = atom<number>({
  key: "scrollPositionState",
  default: 0,
});