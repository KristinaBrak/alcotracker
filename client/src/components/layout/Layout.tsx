import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplate: "auto 1fr auto / auto 1fr auto",
      }}
    >
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
};

export default Layout;
