import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";
import CustomModal from "./CustomModal";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    google: any;
  }
}

interface ConcertDate {
  date: string;
  start_time: string;
  duration_minutes: number;
}

interface TicketOpen {
  date: string;
  time: string;
}

interface Concert {
  id: number;
  name: string;
  location: string;
  startTime: string;
  concertDate: ConcertDate[];
  type: string;
  performanceType: string;
  artists: string[];
  poster: string;
  EventState: number;
  ticketOpen: TicketOpen;
  ticketLink: string;
  lat: number;
  lng: number;
  globals: boolean;
  isTicketOpenDate: boolean;
}

interface GoogleMapProps {
  globalConcerts: Concert[];
  setShowPastConcertsGlobal: (show: boolean) => void;
  selectedGlobalConcert: Concert | null;
  setSelectedGlobalConcert: (concert: Concert) => void;
}

const GoogleMap = ({
  globalConcerts,
  setShowPastConcertsGlobal,
  selectedGlobalConcert,
  setSelectedGlobalConcert,
}: GoogleMapProps) => {
  const { t, i18n } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDetailClick = useCallback(() => {
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    if (mapContainerRef.current && !map) {
      if (!window.google || !window.google.maps) {
        return;
      }
      const initializedMap = new window.google.maps.Map(
        mapContainerRef.current,
        {
          center: { lat: 37.5665, lng: 126.978 },
          zoom: 4,
          disableDefaultUI: true,
        }
      );

      setMap(initializedMap);
    }
  }, [mapContainerRef, map]);

  useEffect(() => {
    if (!map || !globalConcerts.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

     globalConcerts.forEach((concert) => {
      const today = new Date();
      const todayString = new Date(today.getTime() + (9 * 60 * 60 * 1000))
        .toISOString()
        .split('T')[0];
      let isPast = false;
      let isToday = false;

      
      concert.concertDate.forEach((concertDateItem: ConcertDate) => {
        const concertDate: Date = new Date(concertDateItem.date);
        concertDate.setHours(0, 0, 0, 0); // 콘서트 날짜의 시간 초기화
  
        if (concertDateItem.date === todayString) {
          isToday = true; // 오늘 날짜와 일치하면 isToday를 true로 설정
        }
        if (concertDate >= today) {
          isPast = false; // 미래 또는 오늘 날짜가 있으면 isPast는 false
        }
      });

      const position = {
        lat: concert.lat,
        lng: concert.lng,
       };
       
        const infoWindowContent = `
          <div style="width: 100%; max-width: 320px; font-family: Arial, sans-serif; padding: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 4px;">
            <div style="display: flex; align-items: center;">
              <div style="width: 70px; height: 70px; min-width: 70px; min-height: 70px;max-width: 70px; max-height: 70px; margin-right: 15px; border-radius: 4px; overflow: hidden;">
                <img src="${concert.poster && concert.poster.trim() !== "" ? concert.poster : "/image/logo/logo.svg"}" alt="${concert.name}" 
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
                ${concert.name}
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
                ${concert.location}
              </p>
            </div>
            </div>
            <button id="detailBtn-${concert.name.replace(/\s+/g, "-")}" style="margin-top: 5px; padding: 4px 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background-color: #0597F2; color: white; cursor: pointer; transition: background-color 0.3s, color 0.3s;">
              ${t("View Details")}
            </button>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent,
        });

      // Only create marker if it's not today's concert
       if (!isToday) {
         const marker = new window.google.maps.Marker({
           position,
           map,
           title: concert.name,
           icon: {
             url: isPast
               ? "/image/pin/pin_nf01_bk.svg"
               : "/image/pin/pin_nf01.svg",
             scaledSize: new window.google.maps.Size(30, 30),
           },
         });

       

         marker.addListener("click", () => {
           if (currentInfoWindow) {
             currentInfoWindow.close();
           }
           infoWindow.open(map, marker);
           setCurrentInfoWindow(infoWindow);
           setSelectedGlobalConcert(concert);
           map.setCenter(position);
           map.setZoom(14);

           setTimeout(() => {
             const button = document.getElementById(
               `detailBtn-${concert.name.replace(/\s+/g, "-")}`
             );
             if (button) {
               button.addEventListener("click", handleDetailClick);
             }
           }, 100);
         });

         markersRef.current.push(marker);
       } else {
         const marker = new window.google.maps.Marker({
           position,
           map,
           title: concert.name,
           icon: {
             url: "/image/pin/pin_heart01.svg",
             scaledSize: new window.google.maps.Size(30, 30),
           },
           animation: window.google.maps.Animation.BOUNCE,
         });

         marker.addListener("click", () => {
           if (currentInfoWindow) {
             currentInfoWindow.close();
           }
           infoWindow.open(map, marker);
           setCurrentInfoWindow(infoWindow);
           setSelectedGlobalConcert(concert);
           map.setCenter(position);
           map.setZoom(14);

           setTimeout(() => {
             const button = document.getElementById(
               `detailBtn-${concert.name.replace(/\s+/g, "-")}`
             );
             if (button) {
               button.addEventListener("click", handleDetailClick);
             }
           }, 100);
         });

         markersRef.current.push(marker);
       }
    });

    const style = document.createElement("style");
     style.textContent = `
      .gm-style-iw-c {
        padding: 0 !important;
      }
      .gm-style-iw-d {
        overflow: hidden !important;
      }
      .gm-style-iw-t::after {
        display: none !important;
      }
      .gm-style-iw-chr {
        display: none !important;
      }
      .gm-style-iw {
        padding: 0 !important;
      }
      .custom-marker {
        position: absolute;
        cursor: pointer;
      }
      .heartbeat {
        animation: heartbeat 0.8s ease-in-out infinite;
      }
      @keyframes heartbeat {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    // Add click listener to map to close InfoWindow
    window.google.maps.event.addListener(map, "click", () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
        setCurrentInfoWindow(null);
      }
    });

    // Clean up function
    return () => {
      markersRef.current.forEach((marker) => {
        window.google.maps.event.clearListeners(marker, "click");
      });
    };
  }, [map, globalConcerts, handleDetailClick]);

  useEffect(() => {
    if (!selectedGlobalConcert || !map) return;
    console.log(selectedGlobalConcert);
    const marker = markersRef.current.find(
      (marker) => marker?.getTitle && marker.getTitle() === selectedGlobalConcert.name // Check if it's a Marker
    );

    if (marker) {
      window.google.maps.event.trigger(marker, "click");
    }
  }, [selectedGlobalConcert, map]);

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
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        item={selectedGlobalConcert}
      />
    </div>
  );
};

export default GoogleMap;
