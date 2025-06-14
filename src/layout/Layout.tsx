import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FnbButton from "./FnbButton";
import { useBreakpointValue } from "@chakra-ui/react";
import DownloadPromptPWA from "../components/DownloadProptPWA";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  return (
    <div style={{height: "100vh"}}>
      <Header />
      {isMobileOrTablet && <DownloadPromptPWA />}
      <main>{children}</main>
      <FnbButton isMobileOrTablet={isMobileOrTablet} /> 
      {isMobileOrTablet && <Footer />}
    </div>
  );
};

export default Layout;
