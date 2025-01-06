import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaCalendarCheck,
  FaPlus,
  FaBuilding,
  FaTools,
  FaCog,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

import "./Dashboard.scss";
import "./PlanVisit.scss";

const RepairPlan = () => {
  const [visits, setVisits] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: null,
    przedmiotNazwa: "",
    kategoria: "",
    firmaZewnetrzna: "",
    dataWydania: "",
    planowanaDataZwrotu: "",
    szacunkowyKoszt: "",
    osobaOdpowiedzialna: "",
    emailFirmyZewnetrznej: ""
  });
  
  // Pobranie z backendu po uruchomieniu
  useEffect(() => {
    fetch("http://localhost:5000/api/repair")
      .then((res) => res.json())
      .then((data) => {
        console.log("Pobrane dane:", data);
        setVisits(data);
      })
      .catch((err) => console.error("Błąd pobierania /api/repair:", err));
  }, []);
  
  // Dodaj (reset formData + otwórz modal)
  const handleAddVisit = () => {
    setFormData({
      _id: null,
      przedmiotNazwa: "",
      kategoria: "",
      firmaZewnetrzna: "",
      dataWydania: "",
      planowanaDataZwrotu: "",
      szacunkowyKoszt: "",
      osobaOdpowiedzialna: "",
      emailFirmyZewnetrznej: ""
    });
    setModalOpen(true);
  };
  
  // Obsługa zmian w input/select
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Zatwierdzenie (POST/PUT)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData._id) {
      // EDYCJA (PUT)
      fetch(`http://localhost:5000/api/repair/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then((updated) => {
          console.log("Zaktualizowano:", updated);
          setVisits((prev) =>
            prev.map((item) => (item._id === updated._id ? updated : item))
          );
          setModalOpen(false);
        })
        .catch((err) => console.error("Błąd edycji:", err));
    } else {
      // NOWY (POST)
      fetch("http://localhost:5000/api/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then((created) => {
          console.log("Utworzono:", created);
          setVisits((prev) => [...prev, created]);
          setModalOpen(false);
        })
        .catch((err) => console.error("Błąd dodawania:", err));
    }
  };
  
  // Edycja (pobierz dane do formData, otwórz modal)
  const handleEdit = (item) => {
    setFormData(item);
    setModalOpen(true);
  };
  
  // Usuwanie (DELETE)
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/repair/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setVisits((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((err) => console.error("Błąd usuwania:", err));
  };
  
  // Kalendarz sidebara
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onDateChange = (date) => setSelectedDate(date);
  
  // Wylogowanie (przykładowa funkcja)
  const handleLogout = () => {
    window.location.href = "http://localhost:5173";
    
  };
  
  const loggedUserName = "user";
  
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
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
      
      {/* main-area => top-bar + main-content */}
      <div className="main-area">
        <header className="top-bar">
          <div className="user-info">
            <FaUserCircle className="user-icon" />
            <span className="user-name">Zalogowany: {loggedUserName}</span>
            
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="icon" />
              Wyloguj
            </button>
          </div>
        </header>
        
        <main className="main-content">
          <h1>Urządzenia wydane do naprawy</h1>
          
          <button className="add-visit-btn" onClick={handleAddVisit}>
            Dodaj urządzenie
          </button>
          
          {/* TABELA */}
          <table className="visits-table">
            <thead>
            <tr>
              <th>Przedmiot</th>
              <th>Kategoria</th>
              <th>Firma zewn.</th>
              <th>Data wydania</th>
              <th>Planowana data zwrotu</th>
              <th>Szacunkowy koszt</th>
              <th>Osoba odpowiedzialna</th>
              <th>Email firmy zewn.</th>
              <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {visits.map((item) => (
              <tr key={item._id}>
                <td>{item.przedmiotNazwa}</td>
                <td>{item.kategoria}</td>
                <td>{item.firmaZewnetrzna}</td>
                <td>{item.dataWydania}</td>
                <td>{item.planowanaDataZwrotu}</td>
                <td>{item.szacunkowyKoszt}</td>
                <td>{item.osobaOdpowiedzialna}</td>
                <td>{item.emailFirmyZewnetrznej}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Modyfikuj
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          
          {/* MODAL */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{formData._id ? "Edytuj urządzenie" : "Dodaj urządzenie"}</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Przedmiot nazwa:
                    <input
                      type="text"
                      name="przedmiotNazwa"
                      value={formData.przedmiotNazwa}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Kategoria:
                    <input
                      type="text"
                      name="kategoria"
                      value={formData.kategoria}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Firma zewnętrzna:
                    <input
                      type="text"
                      name="firmaZewnetrzna"
                      value={formData.firmaZewnetrzna}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Data wydania:
                    <input
                      type="date"
                      name="dataWydania"
                      value={formData.dataWydania}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Planowana data zwrotu:
                    <input
                      type="date"
                      name="planowanaDataZwrotu"
                      value={formData.planowanaDataZwrotu}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Szacunkowy koszt:
                    <input
                      type="text"
                      name="szacunkowyKoszt"
                      value={formData.szacunkowyKoszt}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Osoba odpowiedzialna:
                    <input
                      type="text"
                      name="osobaOdpowiedzialna"
                      value={formData.osobaOdpowiedzialna}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Email firmy zewn.:
                    <input
                      type="email"
                      name="emailFirmyZewnetrznej"
                      value={formData.emailFirmyZewnetrznej}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <div className="modal-buttons">
                    <button type="submit" className="confirm-btn">
                      Zatwierdź
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setModalOpen(false)}
                    >
                      Anuluj
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RepairPlan;
