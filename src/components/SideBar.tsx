import React from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ConcertInfo from "./ConcertInfo";
import NfiLoad from "./NfiLoad";
import NoData from "./NoData";
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

type Nfiload = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
  naverLink: string,
  note: string,
};

type SidebarProps = {
  concerts: Concert[];
  globalConcerts: Concert[];
  nfiload: Nfiload[];
  query: string;
  setQuery: (query: string) => void;
  globalQuery: string;
  setGlobalQuery: (query: string) => void;
  showPastConcerts: boolean;
  setShowPastConcerts: (show: boolean) => void;
  setSelectedConcert: (concert: Concert) => void;
  selectedConcert: Concert | null;
  setSelectedNfiLoad: (nfiload: Nfiload) => void;
  selectedNfiLoad: Nfiload | null;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedGlobalType: string;
  setSelectedGlobalType: (type: string) => void;
  showPastConcertsGlobal: boolean;
  setShowPastConcertsGlobal: (show: boolean) => void;
  setSelectedGlobalConcert: (concert: Concert) => void;
  selectedGlobalConcert: Concert | null;
};

const Sidebar = ({
  concerts,
  nfiload,
  globalConcerts,
  query,
  setQuery,
  showPastConcerts,
  setShowPastConcerts,
  setSelectedConcert,
  selectedConcert,
  setSelectedNfiLoad,
  selectedNfiLoad,
  activeTabIndex,
  setActiveTabIndex,
  selectedType, // 추가
  setSelectedType, // 추가
  showPastConcertsGlobal,
  setShowPastConcertsGlobal,
  setSelectedGlobalConcert,
  selectedGlobalConcert,
  globalQuery,
  setGlobalQuery,
  selectedGlobalType,
  setSelectedGlobalType,
}: SidebarProps) => {
  const { t, i18n } = useTranslation();
  return (
    <Box
      w="340px"
      bg="#fff"
      h="calc(100vh - 120px)"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRight="1px solid #ddd"
      display="flex"
      flexDirection="column"
    >
      <Tabs
        index={activeTabIndex}
        onChange={setActiveTabIndex}
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <TabList>
          <Tab
            fontSize="18px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
            p="16px 4px"
          >
            {t("map_domestic")}
          </Tab>
          <Tab
            fontSize="18px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
            p="16px 4px"
          >
            {t("map_nfiload")}
          </Tab>
          <Tab
            fontSize="18px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
            p="16px 4px"
          >
            {t("map_global")}
          </Tab>
        </TabList>

        <TabPanels flex="1" overflowY="hidden">
          <TabPanel height="100%" padding="20px">
            <ConcertInfo
              concerts={concerts}
              query={query}
              setQuery={setQuery}
              showPastConcerts={showPastConcerts}
              setShowPastConcerts={setShowPastConcerts}
              setSelectedConcert={setSelectedConcert}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </TabPanel>
          <TabPanel height="100%" padding="20px">
            <NfiLoad
              nfiload={nfiload}
              setSelectedNfiLoad={setSelectedNfiLoad}
              selectedNfiLoad={selectedNfiLoad}
            />
          </TabPanel>
          <TabPanel height="100%" padding="20px">
            <ConcertInfo
              concerts={globalConcerts}
              query={globalQuery}
              setQuery={setGlobalQuery}
              showPastConcerts={showPastConcertsGlobal}
              setShowPastConcerts={setShowPastConcertsGlobal}
              setSelectedConcert={setSelectedGlobalConcert}
              selectedType={selectedGlobalType}
              setSelectedType={setSelectedGlobalType}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Sidebar;
