import React, { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaCalendarCheck,
  FaPlus,
  FaBuilding,
  FaTools,
  FaCog,
  FaUserCircle,   // ikona użytkownika
  FaSignOutAlt    // ikona wylogowania
} from "react-icons/fa";

// 1. ZAIMPORTUJ NOWY KOMPONENT
import DashboardHome from "./DashboardHome";

import "./Dashboard.scss";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Nazwa zalogowanego usera (przykładowo):
  const loggedUserName = "user";
  
  // Przykładowa funkcja wylogowania
  const handleLogout = () => {

    window.location.href = "http://localhost:5173";
  };
  
  // Obsługa kalendarza w sidebarze
  const onDateChange = (date) => setSelectedDate(date);
  
  return (
    <div className="dashboard">
      
      {/* SIDEBAR z hover, ikonami, kalendarzem, footerem */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard">
                <FaCalendarCheck className="icon" />
                <span className="text-label">Sprawdź wizyty</span>
              </Link>
            </li>
            <li>
              <Link to="/zaplanuj-wizyte">
                <FaPlus className="icon" />
                <span className="text-label">Zaplanuj wizytę</span>
              </Link>
            </li>
            <li>
              <Link to="/naprawy">
                <FaTools className="icon" />
                <span className="text-label">Naprawy</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-calendar">
          <Calendar onChange={onDateChange} value={selectedDate} />
          <p className="selected-date">
            Wybrana data: {selectedDate.toLocaleDateString()}
          </p>
        </div>
        
        <div className="sidebar-footer">
          <Link to="/konfiguracja">
            <FaCog className="icon" />
            <span className="text-label">Konfiguracja</span>
          </Link>
        </div>
      </aside>
      
      
      {/* MAIN-AREA: top-bar + main-content */}
      <div className="main-area">
        
        {/* Pasek u góry (informacja o użytkowniku) */}
        <header className="top-bar">
          <div className="user-info">
            <FaUserCircle className="user-icon" />
            <span className="user-name">
              Zalogowany: {loggedUserName}
            </span>
            
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="icon" />
              Wyloguj
            </button>
          </div>
        </header>
        
        {/* Główna treść */}
        <main className="main-content">
          {/* 2. UMIESZCZAMY KOMPONENT DashboardHome */}
          <DashboardHome />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
