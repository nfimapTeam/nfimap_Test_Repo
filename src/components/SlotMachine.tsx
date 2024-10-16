import { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { RiMusic2Line } from "react-icons/ri";
import { Button, Text, Box, IconButton, Link } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const [finalIndex, setFinalIndex] = useState(0);
  const [todayMusic, setTodayMusic] = useRecoilState(toDayMusicState);
  const [isStarted, setIsStarted] = useRecoilState(slotStateState);

  const today = new Date().getDate() - 1;
  const shuffledTextData = [...textData].sort(() => Math.random() - 0.5);
  const shuffledYoutubeUrl = [...youtubeUrl].sort(() => Math.random() - 0.5);
  const textArr = Array(ARRAY_REPEAT).fill(shuffledTextData).flat();
  const lastIndex = textArr.length - 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSpinning) {
      interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev < lastIndex ? prev + 1 : 0));
        },
        getDuration(10, currentIndex)
      );
    }

    return () => clearInterval(interval);
  }, [currentIndex, lastIndex, isSpinning]);

  const variants: Variants = {
    initial: { scaleY: 0.8, y: "-50%", opacity: 0.5 },
    animate: ({ isLast }) => {
      let props: VariantProps = { scaleY: 1, y: 0, opacity: 1 };
      if (!isLast) props["filter"] = "none";
      return props;
    },
    exit: { scaleY: 0.8, y: "50%", opacity: 0.5 },
  };

  function handleClick() {
    if (isClickable) {
      setIsStarted(true);
      setIsSpinning(true);
      setIsClickable(false);
      setTimeout(() => {
        setIsSpinning(false);
        setFinalIndex(today);
        setTodayMusic(textData[today]);
      }, 2000);
    }
  }

  function getDuration(base: number, index: number) {
    return base * (index + 1) * 0.5;
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
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

      {isStarted && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {!isSpinning && (
            <Text fontSize="sm" fontWeight="bold" flexShrink={0}>
              {t("slot_machine_today_music")}
            </Text>
          )}
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