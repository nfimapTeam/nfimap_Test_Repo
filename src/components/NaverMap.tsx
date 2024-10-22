import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import CustomModal from "./CustomModal";
import { useTranslation } from "react-i18next";

type Concert = {
  name: string;
  location: string;
  type: string;
  durationMinutes: number;
  date: string[];
  startTime: string;
  artists: string[];
  ticketLink: string;
  poster: string;
  lat: string;
  lng: string;
  ticketOpen?: any;
};

type NfiRoad = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
  naverLink: string;
  note: string;
};

interface NaverMapProps {
  concerts: Concert[];
  nfiRoad: NfiRoad[];
  setShowPastConcerts: (show: boolean) => void;
  selectedConcert: Concert | null;
  setSelectedConcert: (concert: Concert) => void;
  selectedNfiRoad: NfiRoad | null;
  setSelectedNfiRoad: (nfiRoad: NfiRoad) => void;
  activeTabIndex: number;
}

const NaverMap = ({
  concerts,
  nfiRoad,
  setShowPastConcerts,
  selectedConcert,
  setSelectedConcert,
  selectedNfiRoad,
  setSelectedNfiRoad,
  activeTabIndex,
}: NaverMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t, i18n } = useTranslation();

  const ZOOM_LEVEL = 3;

  useEffect(() => {
    console.log(currentInfoWindow)
  }, [concerts, nfiRoad]);

  const getCategoryImage = (category: string): string => {
    switch (category) {
      case "카페":
        return "/image/cafe.svg";
      case "장소":
        return "/image/flag.svg";
      case "맛집":
        return "/image/restaurant.svg";
      case "Cafe":
        return "/image/cafe.svg";
      case "Place":
        return "/image/flag.svg";
      case "Food":
        return "/image/restaurant.svg";
      default:
        return "/image/pin/pin_nf01.svg";
    }
  };

  const getCategoryMarkerImage = (category: string): string => {
    switch (category) {
      case "카페":
        return "/image/cafeMarker.svg";
      case "장소":
        return "/image/flagMarker.svg";
      case "맛집":
        return "/image/restaurantMarker.svg";
      case "Cafe":
        return "/image/cafeMarker.svg";
      case "Place":
        return "/image/flagMarker.svg";
      case "Food":
        return "/image/restaurantMarker.svg";
      default:
        return "/image/pin/pin_nf01.svg";
    }
  };

  const getCategoryBackgroundColor = (category: string): string => {
    switch (category) {
      case "카페":
        return "#FFC107";
      case "장소":
        return "#8BC34A";
      case "맛집":
        return "#FF5722";
      case "Cafe":
        return "#FFC107";
      case "Place":
        return "#8BC34A";
      case "Food":
        return "#FF5722";
      default:
        return "#FFFFFF";
    }
  };

  useEffect(() => {
    const mapContainer = mapContainerRef.current;

    if (mapContainer && (window as any).naver && !mapRef.current) {
      const naverMaps = (window as any).naver.maps;
      const map = new naverMaps.Map(mapContainer, {
        center: new naverMaps.LatLng(37.5665, 126.978),
        zoom: ZOOM_LEVEL,
        logoControl: false,
      });

      mapRef.current = map;

      naverMaps.Event.addListener(map, "idle", () => {
        updateMarkersVisibility();
      });
    }
  }, []);

  const updateMarkersVisibility = () => {
    if (!mapRef.current || !(window as any).naver) return;

    const map = mapRef.current;
    const bounds = map.getBounds();

    markersRef.current.forEach((marker) => {
      if (bounds.hasLatLng(marker.getPosition())) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  };

  useEffect(() => {
    if (!mapRef.current || !(window as any).naver) return;

    const naverMaps = (window as any).naver.maps;
    const map = mapRef.current;

    // 모든 InfoWindow 닫기
    if (currentInfoWindow) {
      currentInfoWindow.close();
      setCurrentInfoWindow(null); // 이전 InfoWindow 상태 초기화
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const dataToDisplay = activeTabIndex === 0 ? concerts : nfiRoad;

    dataToDisplay.forEach((item) => {
      const location = new naverMaps.LatLng(item.lat, item.lng);

      let markerImage =
        activeTabIndex === 0
          ? "/image/pin/pin_nf01.svg"
          : getCategoryMarkerImage((item as NfiRoad).category);
      let markerStyle = "";
      let markerClass =
        activeTabIndex === 0 ? "concert-marker" : "nfiRoad-marker";

      // Set the background color for NfiRoad markers
      const backgroundColor =
        activeTabIndex === 1
          ? getCategoryBackgroundColor((item as NfiRoad).category)
          : "";

      if (activeTabIndex === 0) {
        const today = new Date();
        let isToday = false;
        let isPast = false;

        (item as Concert).date.forEach((dateString) => {
          const concertDate = new Date(dateString.split("(")[0]);
          if (concertDate.toDateString() === today.toDateString()) {
            isToday = true;
          } else if (concertDate < today) {
            isPast = true;
          }
        });

        if (isToday) {
          markerImage = "/image/heart.png";
          markerStyle = "animation: heartbeat 0.8s ease-in-out infinite;";
        } else if (isPast) {
          markerStyle = "filter: grayscale(100%) brightness(40%);";
        }
      }

      const marker = new naverMaps.Marker({
        position: location,
        map: map,
        title: item.name,
        icon: {
          content:
            markerClass === "concert-marker"
              ? `
                <div style="position: relative;">
                  <img 
                    src="${markerImage}" 
                    style="width: 30px; height: 30px; ${markerStyle}" 
                    class="${markerClass}">
                </div>
              `
              : `
                <div style="position: relative; border-radius: 4px; padding: 5px;">
                  <img 
                    src="${markerImage}" 
                    style="width: 30px; height: 30px; ${markerStyle}" 
                    class="${markerClass}">
                </div>
              `,
        },
      });

      const getPosterImage = (item: Concert | NfiRoad): string => {
        if ("poster" in item) {
          return item.poster && item.poster.trim() !== ""
            ? item.poster
            : "/image/logo/logo.svg";
        } else {
          return getCategoryImage(item.category);
        }
      };

      naverMaps.Event.addListener(marker, "click", () => {
        // 기존 열려있는 InfoWindow 닫기
        if (currentInfoWindow) {
          currentInfoWindow.close();
          setCurrentInfoWindow(null); // 현재 InfoWindow 상태 초기화
        }

        map.setCenter(location);

        const infoWindowContent = `
          <div style="width: 300px; font-family: Arial, sans-serif; padding: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 4px;">
            <div style="display: flex; align-items: center;">
              <div style="background-color: ${backgroundColor}; width: 70px; height: 70px; min-width: 70px; min-height: 70px; max-width: 70px; max-height: 70px; margin-right: 15px; border-radius: 4px; overflow: hidden;">
                <img src="${getPosterImage(item)}" alt="${item.name}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
              </div>
              <div style="flex-grow: 1;">
              <h3
                style="
                  margin: 0;
                  font-size: 16px;
                  font-weight: bold;
                  color: #333;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                ${item.name}
              </h3>
              <p
                style="
                  margin: 5px 0 0;
                  font-size: 14px;
                  color: #666;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                ${item.location}
              </p>
            </div>
            </div>
            <button class="detailBtn" style="margin-top: 5px; padding: 4px 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background-color: #0597F2; color: white; cursor: pointer; transition: background-color 0.3s, color 0.3s;">
              ${t("View Details")}
            </button>
          </div>
        `;

        const infoWindow = new naverMaps.InfoWindow({
          content: infoWindowContent,
          backgroundColor: "transparent",
          borderWidth: 0,
          disableAnchor: true,
          pixelOffset: new naverMaps.Point(12, -10),
        });

        infoWindow.open(map, marker);
        setCurrentInfoWindow(infoWindow); // 현재 InfoWindow 설정

        if (activeTabIndex === 0) {
          setSelectedConcert(item as Concert);
        } else {
          setSelectedNfiRoad(item as NfiRoad);
        }

        const detailBtn = document.querySelector(".detailBtn");
        detailBtn?.addEventListener("click", () => {
          onOpen();
        });

        // 지도 클릭 시 모든 InfoWindow 닫기
        naverMaps.Event.addListener(map, "click", () => {
          infoWindow.close();
          setCurrentInfoWindow(null); // InfoWindow 상태 초기화
        });
      });

      markersRef.current.push(marker);
    });
  }, [concerts, nfiRoad, activeTabIndex, onOpen]);

  useEffect(() => {
    if ((!selectedConcert && !selectedNfiRoad) || !mapRef.current) return;

    if (currentInfoWindow) {
      currentInfoWindow.close();
      setCurrentInfoWindow(null);
    }

    const selectedItem =
      activeTabIndex === 0 ? selectedConcert : selectedNfiRoad;

    const marker = markersRef.current.find(
      (marker) => marker.getTitle() === selectedItem?.name
    );

    if (marker) {
      let markerImage =
        activeTabIndex === 0
          ? "/image/pin/pin_nf01.svg"
          : getCategoryMarkerImage((selectedItem as NfiRoad).category);
      let markerStyle = "";
      let markerClass =
        activeTabIndex === 0 ? "concert-marker" : "nfiRoad-marker";

      // Set the background color for NfiRoad markers
      const backgroundColor =
        activeTabIndex === 1
          ? getCategoryBackgroundColor((selectedItem as NfiRoad).category)
          : "";

      if (activeTabIndex === 0) {
        const today = new Date();
        let isToday = false;
        let isPast = false;

        (selectedItem as Concert).date.forEach((dateString) => {
          const concertDate = new Date(dateString.split("(")[0]);
          if (concertDate.toDateString() === today.toDateString()) {
            isToday = true;
          } else if (concertDate < today) {
            isPast = true;
          }
        });

        if (isToday) {
          markerImage = "/image/pin/pin_heart01.svg";
          markerStyle = "animation: heartbeat 0.8s ease-in-out infinite;";
        } else if (isPast) {
          markerStyle = "filter: grayscale(100%) brightness(40%);";
        }
      }

      marker.setIcon({
        content:
          activeTabIndex === 0
            ? `
              <div style="position: relative;">
                <img 
                  src="${markerImage}" 
                  style="width: 30px; height: 30px; ${markerStyle}" 
                  class="concert-marker">
              </div>
            `
            : `
              <div style="position: relative; border-radius: 4px; padding: 5px;">
                <img 
                  src="${markerImage}" 
                  style="width: 30px; height: 30px; ${markerStyle}" 
                  class="nfiRoad-marker">
              </div>
            `,
      });

      // Trigger marker click event
      (window as any).naver.maps.Event.trigger(marker, "click");
      marker.setMap(mapRef.current);
      mapRef.current.setCenter(marker.getPosition());
    }
  }, [selectedConcert, selectedNfiRoad, activeTabIndex]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .heartbeat {
          animation: heartbeat 0.8s ease-in-out infinite;
        }

        .control-buttons {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 10;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          border-radius: 50%;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #007BFF;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        item={activeTabIndex === 0 ? selectedConcert : selectedNfiRoad}
      />
    </div>
  );
};

export default NaverMap;
