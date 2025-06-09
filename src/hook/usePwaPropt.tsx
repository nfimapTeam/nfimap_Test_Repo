import { useEffect, useState } from "react";

export const usePwaPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const dismissedTime = new Date(dismissedAt).getTime();
      const now = Date.now();
      const diffInDays = (now - dismissedTime) / (1000 * 60 * 60 * 24);
      if (diffInDays < 14) {
        return; // 14일 안 지났으면 안 보이게
      } else {
        localStorage.removeItem("pwa-install-dismissed"); // 오래됐으면 삭제
      }
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPromptVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsPromptVisible(false);
    }
  };

  return {
    isPromptVisible,
    promptInstall,
  };
};
