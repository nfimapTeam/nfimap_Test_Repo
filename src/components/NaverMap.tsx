import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import CustomModal from "./CustomModal";

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

type Nfiload = {
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
  nfiLoad: Nfiload[];
  setShowPastConcerts: (show: boolean) => void;
  selectedConcert: Concert | null;
  setSelectedConcert: (concert: Concert) => void;
  selectedNfiLoad: Nfiload | null;
  setSelectedNfiLoad: (nfiLoad: Nfiload) => void;
  activeTabIndex: number;
}

const NaverMap = ({
  concerts,
  nfiLoad,
  setShowPastConcerts,
  selectedConcert,
  setSelectedConcert,
  selectedNfiLoad,
  setSelectedNfiLoad,
  activeTabIndex,
}: NaverMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ZOOM_LEVEL = 3;

  const getCategoryImage = (category: string): string => {
    switch (category.toLowerCase()) {
      case "카페":
        return "/image/cafe.svg";
      case "장소":
        return "/image/flag.svg";
      case "맛집":
        return "/image/restaurant.svg";
      default:
        return "/image/nfiload.png";
    }
  };

  const getCategoryMarkerImage = (category: string): string => {
    switch (category.toLowerCase()) {
      case "카페":
        return "/image/cafeMarker.svg";
      case "장소":
        return "/image/flagMarker.svg";
      case "맛집":
        return "/image/restaurantMarker.svg";
      default:
        return "/image/nfiload.png";
    }
  };

  const getCategoryBackgroundColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "카페":
        return "#FFC107";
      case "장소":
        return "#8BC34A";
      case "맛집":
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

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const dataToDisplay = activeTabIndex === 0 ? concerts : nfiLoad;

    dataToDisplay.forEach((item) => {
      const location = new naverMaps.LatLng(item.lat, item.lng);

      let markerImage =
        activeTabIndex === 0
          ? "/image/nfimap.png"
          : getCategoryMarkerImage((item as Nfiload).category);
      let markerStyle = "";
      let markerClass =
        activeTabIndex === 0 ? "concert-marker" : "nfiload-marker";

      // Set the background color for Nfiload markers
      const backgroundColor =
        activeTabIndex === 1
          ? getCategoryBackgroundColor((item as Nfiload).category)
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

      const getPosterImage = (item: Concert | Nfiload): string => {
        if ("poster" in item) {
          return item.poster && item.poster.trim() !== '' ? item.poster : '/image/nfimap.png';
        } else {
          return getCategoryImage(item.category);
        }
      };

      naverMaps.Event.addListener(marker, "click", () => {
        map.setCenter(location);
        if (currentInfoWindow === marker) {
          currentInfoWindow?.close();
          setCurrentInfoWindow(null);
          return;
        }

        if (currentInfoWindow) {
          currentInfoWindow.close();
        }

        const infoWindowContent = `
          <div style="width: 300px; font-family: Arial, sans-serif; padding: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 4px;">
            <div style="display: flex; align-items: center;">
              <div style="background-color: ${backgroundColor}; width: 70px; height: 70px; min-width: 70px; min-height: 70px;max-width: 70px; max-height: 70px; margin-right: 15px; border-radius: 4px; overflow: hidden;">
                <img src="${getPosterImage(item)}" alt="${item.name}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
              </div>
              <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${item.name}</h3>
                <p style="margin: 5px 0 0; font-size: 14px; color: #666;">${item.location}</p>
              </div>
            </div>
             <button class="detailBtn" style="margin-top: 5px; padding: 4px 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background-color: #0597F2; color: white; cursor: pointer; transition: background-color 0.3s, color 0.3s;">
              상세보기
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
        setCurrentInfoWindow(infoWindow);

        if (activeTabIndex === 0) {
          setSelectedConcert(item as Concert);
        } else {
          setSelectedNfiLoad(item as Nfiload);
        }

        const detailBtn = document.querySelector(".detailBtn");
        detailBtn?.addEventListener("click", () => {
          onOpen();
        });

        naverMaps.Event.addListener(map, "click", () => {
          infoWindow.close();
          setCurrentInfoWindow(null);
        });
      });

      markersRef.current.push(marker);
    });
  }, [concerts, nfiLoad, activeTabIndex, onOpen]);

  useEffect(() => {
    if ((!selectedConcert && !selectedNfiLoad) || !mapRef.current) return;

    const selectedItem =
      activeTabIndex === 0 ? selectedConcert : selectedNfiLoad;

    const marker = markersRef.current.find(
      (marker) => marker.getTitle() === selectedItem?.name
    );

    if (marker) {
      let markerImage =
        activeTabIndex === 0
          ? "/image/nfimap.png"
          : getCategoryMarkerImage((selectedItem as Nfiload).category);
      let markerStyle = "";
      let markerClass =
        activeTabIndex === 0 ? "concert-marker" : "nfiload-marker";

      // Set the background color for Nfiload markers
      const backgroundColor =
        activeTabIndex === 1
          ? getCategoryBackgroundColor((selectedItem as Nfiload).category)
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
          markerImage = "/image/heart.png";
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
                  class="nfiload-marker">
              </div>
            `,
      });

      // Trigger marker click event
      (window as any).naver.maps.Event.trigger(marker, "click");
      marker.setMap(mapRef.current);
      mapRef.current.setCenter(marker.getPosition());
    }
  }, [selectedConcert, selectedNfiLoad, activeTabIndex]);

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
        .concert-marker:hover {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

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
        item={activeTabIndex === 0 ? selectedConcert : selectedNfiLoad}
      />
    </div>
  );
};

export default NaverMap;
