import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./CreateEstimationPopup.css";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

const Topbar = () => {
  return (
    <header
      style={{
        backgroundColor: "#FFF",
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "25px",
        fontWeight: "600",
        position: "fixed",
        width: "100%",
        top: 0,
      }}
    >
      Crear nueva estimación
    </header>
  );
};

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const TopBar: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Portal>
        <Topbar />
      </Portal>
      <div style={{ display: "flex", flex: 1, marginTop: "50px" }}>
      </div>
    </div>
  );
};

export default TopBar;
