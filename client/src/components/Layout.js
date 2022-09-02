import React from "react";
import { Outlet } from "react-router-dom";

import Nav from "./Nav";

const Layout = () => {
  return (
    <>
      <header>HEADER</header>
      <Nav />
      <main>
        <Outlet />
      </main>
      <footer>FOOTER</footer>
    </>
  );
};

export default Layout;
