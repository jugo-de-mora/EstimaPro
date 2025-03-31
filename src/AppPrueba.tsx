import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarSecondOption from "./components/SidebarSecondOption";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ManualPage from "./pages/ManualPage";
import SubirPage from "./pages/SubirPage";
import SelectionPage from "./pages/SelectionPage";

function AppPrueba() {
  const [estaColapsado, setEstaColapsado] = useState(false);
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Barra lateral fija */}
        <SidebarSecondOption
          estaColapsado={estaColapsado}
          setEstaColapsado={setEstaColapsado}
        />

        {/* Contenido que se actualiza basado en las rutas */}
        <div
          style={{
            flexGrow: 1,
            marginLeft: estaColapsado ? "110px" : "280px",
            padding: "20px",
            paddingTop: "70px",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/manual" element={<ManualPage />} />
            <Route path="/seleccionar" element={<SelectionPage />} />
            <Route path="/crear" element={<SubirPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppPrueba;
