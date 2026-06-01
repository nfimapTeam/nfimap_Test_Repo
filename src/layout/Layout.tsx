import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FnbButton from "./FnbButton";
import { useBreakpointValue } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
      overflow: "hidden"
    }}>
      <Header />
      <main style={{
        flex: 1,
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}>{children}</main>
      <FnbButton isMobileOrTablet={isMobileOrTablet} /> 
      {isMobileOrTablet && <Footer />}
    </div>
  );
};

export default Layout;
