import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{height: "100vh"}}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
