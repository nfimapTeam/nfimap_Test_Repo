import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FnbButton from "./FnbButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{height: "100vh"}}>
      <Header />
      <main>{children}</main>
      <FnbButton /> 
      <Footer />
    </div>
  );
};

export default Layout;
