import { useEffect, useState } from "react";
import { AnimatePresence, motion, TargetAndTransition, Variants } from "framer-motion";
import { RiMusic2Line } from "react-icons/ri"; // 음악 아이콘 추가
import { Button, Text, Box, IconButton, Link } from "@chakra-ui/react"; // Chakra UI 버튼과 텍스트 컴포넌트
import { useRecoilState } from "recoil"; // Recoil의 useRecoilState import
import { slotStateState, toDayMusicState } from "../atom/slotState";
import { useTranslation } from "react-i18next";

interface Props {
  textData: string[];
  youtubeUrl: string[];
}

interface VariantProps {
  scaleY: number;
  y: string | number;
  opacity: number;
  filter?: string;
}

const ARRAY_REPEAT = 5;

const SlotMachine = ({ textData, youtubeUrl }: Props) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 슬롯에서 보여주는 곡의 인덱스
  const [isSpinning, setIsSpinning] = useState(false); // 슬롯머신이 도는 상태인지 여부
  const [isClickable, setIsClickable] = useState(true); // 한번 클릭 후 더이상 클릭 못하도록
  const [finalIndex, setFinalIndex] = useState(0); // 슬롯이 멈춘 후 보여줄 곡의 인덱스
  const [todayMusic, setTodayMusic] = useRecoilState(toDayMusicState); // 전역 상태 관리
  const [isStarted, setIsStarted] = useRecoilState(slotStateState);

  // 날짜에 맞게 인덱스를 설정
  const today = new Date().getDate() - 1; // 1일 -> 0번 인덱스로 맞추기 위해 -1
  const shuffledTextData = [...textData].sort(() => Math.random() - 0.5);
  const shuffledYoutubeUrl = [...youtubeUrl].sort(() => Math.random() - 0.5);
  const textArr = Array(ARRAY_REPEAT).fill(shuffledTextData).flat(); // 곡 리스트 반복
  const lastIndex = textArr.length - 1; // 마지막 곡 인덱스

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpinning) {
      interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev < lastIndex ? prev + 1 : 0)); // 슬롯이 끝에 도달하면 처음으로 돌아가기
        },
        getDuration(10, currentIndex)
      );
    }

    return () => clearInterval(interval);
  }, [currentIndex, lastIndex, isSpinning]);

  // 애니메이션 설정
  const variants: Variants = {
    initial: { scaleY: 0.8, y: "-50%", opacity: 0.5 },
    animate: (custom: { isLast: boolean }): TargetAndTransition => ({
      scaleY: 1,
      y: 0,
      opacity: 1,
      filter: !custom.isLast ? "none" : undefined,
    }),
    exit: { scaleY: 0.8, y: "50%", opacity: 0.5 },
  };

  function handleClick() {
    if (isClickable) {
      setIsStarted(true); // 첫 클릭 후 시작
      setIsSpinning(true); // 슬롯 돌리기 시작
      setIsClickable(false); // 클릭 불가로 설정
      setTimeout(() => {
        setIsSpinning(false); // 일정 시간 후 슬롯 멈춤
        setFinalIndex(today); // 멈추면 오늘 날짜에 해당하는 인덱스 설정
        setTodayMusic(textData[today]); // 전역 상태에 추천곡 저장
      }, 2000); // 2초 동안 돌게 설정
    }
  }

  function getDuration(base: number, index: number) {
    return base * (index + 1) * 0.5;
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {/* 첫 번째 상태: 슬롯이 돌기 전 */}
      {!isStarted && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="10px"
        >
          <Text
            fontSize="14px"
            fontWeight="bold"
            color={isClickable ? "black" : "gray"}
          >
            {t("slot_machine_click_button")}
          </Text>
          <IconButton
            onClick={handleClick}
            isDisabled={!isClickable}
            colorScheme="blue"
            aria-label="추천곡 시작"
            height="24px"
            icon={<RiMusic2Line />}
            borderRadius="full"
          />
        </Box>
      )}

      {/* 슬롯머신 동작: 슬롯이 시작되면 보여줌 */}
      {isStarted && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {/* 추천곡 레이블: 슬롯이 멈춘 후에만 보여줌 */}
          {!isSpinning && (
            <>
              <RiMusic2Line color="#3b82f6" size="20px" />
              <Text fontSize="sm" fontWeight="bold" flexShrink={0}>
                {t("slot_machine_today_music")}
              </Text>
            </>
          )}
          {/* 추천곡 텍스트 */}
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "200px",
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                className="slotMachineText"
                key={isSpinning ? textArr[currentIndex] : textData[finalIndex]}
                custom={{ isLast: currentIndex === lastIndex }}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: getDuration(
                    currentIndex === lastIndex ? 0.1 : 0.01,
                    currentIndex
                  ),
                  ease: currentIndex === lastIndex ? "easeInOut" : "linear",
                }}
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#3b82f6",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {isSpinning ? textArr[currentIndex] : todayMusic}
              </motion.span>
            </AnimatePresence>
          </div>
          {!isSpinning && (
            <Link href={youtubeUrl[finalIndex]} isExternal>
              <img src="/image/youtube.png" alt="YouTube" width="30px" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
