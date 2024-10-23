export interface Member {
  name: string;
  position: string[];
  aka: string[];
  birthdate: string;
  imageUrl: string;
  military: string;
  instagram: string;
  mbti: string;
};

export const profileData = {
  name: "N.Flying",
  debut_date: "2015-05-20",
  debut_song: "기가 막혀",
  cover_image_url: "/image/nflying_cover_image.jpg",
  members: [
    {
      name: "이승협",
      position: ["리더", "리드 보컬", "메인 래퍼"],
      aka: ["승짱", "밀루"],
      birthdate: "1992-10-24",
      imageUrl: "/image/seunghyub.jpg",
      military: "2023-01-01",
      instagram: "https://www.instagram.com/sssn9_zzzn9/",
      mbti: "ESTP",
    },
    {
      name: "차훈",
      position: ["기타", "코러스"],
      aka: ["먐미", "사투리 스나이퍼"],
      birthdate: "1994-07-12",
      imageUrl: "/image/chahun.jpg",
      military: "2024-09-19",
      instagram: "https://www.instagram.com/cchh_0712",
      mbti: "ISFJ",
    },
    {
      name: "김재현",
      position: ["드럼"],
      aka: ["옥탑방 드럼 걔", "쭒"],
      birthdate: "1994-07-15",
      imageUrl: "/image/jaehyun.jpg",
      military: "2025-02-24",
      instagram: "https://www.instagram.com/_.kimjaehyun._",
      mbti: "ENFP",
    },
    {
      name: "유회승",
      position: ["메인보컬"],
      aka: ["승구", "말랑이", "하망이"],
      birthdate: "1995-02-28",
      imageUrl: "/image/hewseung.jpg",
      military: "2023-01-01",
      instagram: "https://www.instagram.com/hweng_star",
      mbti: "ENFJ",
    },
    {
      name: "서동성",
      position: ["베이스"],
      aka: ["막멩이", "뚱땅이"],
      birthdate: "1996-04-09",
      imageUrl: "/image/dongsung.jpg",
      military: "2024-11-07",
      instagram: "https://www.instagram.com/9_6_meng22",
      mbti: "ISTJ",
    },
  ],
  fandom_name: "엔피아 (N.Fia)",
  light_stick: "엔피봉",
  official_sites: {
    x: "https://x.com/Nflyingofficial",
    facebook: "https://www.facebook.com/officialnflying",
    instagram: "https://www.instagram.com/letsroll_nf",
    youtube: "https://www.youtube.com/channel/UC8vm0EzlH9mRHwnTLILpQjQ",
    daumcafe: "https://cafe.daum.net/N.Flying"
  }
};
