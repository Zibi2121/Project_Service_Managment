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

import "./Dashboard.scss"; // style sidebara, top-bar
import "./PlanVisit.scss"; // style specyficzne do PlanVisit

const PlanVisit = () => {
  // 1) Stan wizyt (pobieranych z backendu)
  const [visits, setVisits] = useState([]);
  
  // 2) Stan do modala
  const [isModalOpen, setModalOpen] = useState(false);
  
  // 3) Stan formularza (dodaj/edytuj)
  const [formData, setFormData] = useState({
    _id: null, // klucz w MongoDB
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "",
    purpose: "",
    bhp: "",
    cost: "",
    responsiblePerson: "",
    visitingPerson: "",
    visitingEmail: "",
  });
  
  // 4) FETCH: Pobranie wizyt z backendu (GET /api/visits)
  useEffect(() => {
    fetch("http://localhost:5000/api/visits")
      .then((res) => res.json())
      .then((data) => {
        console.log("Pobrane wizyty:", data);
        setVisits(data);
      })
      .catch((err) => console.error("Błąd pobierania /api/visits:", err));
  }, []);
  
  // 5) Obsługa kliknięcia "Dodaj wizytę"
  const handleAddVisit = () => {
    setFormData({
      _id: null,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      category: "",
      purpose: "",
      bhp: "",
      cost: "",
      responsiblePerson: "",
      visitingPerson: "",
      visitingEmail: "",
    });
    setModalOpen(true);
  };
  
  // 6) Obsługa zmian w formularzu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  // 7) Zatwierdzenie formularza: POST (nowy) lub PUT (edycja)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData._id) {
      // Mamy _id => EDYCJA (PUT /api/visits/:id)
      fetch(`http://localhost:5000/api/visits/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((updated) => {
          console.log("Zaktualizowana wizyta:", updated);
          // Zaktualizuj local state
          setVisits((prev) =>
            prev.map((v) => (v._id === updated._id ? updated : v))
          );
          setModalOpen(false);
        })
        .catch((err) => console.error("Błąd edycji wizyty:", err));
    } else {
      // Nie ma _id => NOWA (POST /api/visits)
      fetch("http://localhost:5000/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((created) => {
          console.log("Utworzona wizyta:", created);
          // Dodaj do local state
          setVisits((prev) => [...prev, created]);
          setModalOpen(false);
        })
        .catch((err) => console.error("Błąd dodawania wizyty:", err));
    }
  };
  
  // 8) Modyfikacja (pobierz dane do formData)
  const handleEdit = (visit) => {
    setFormData(visit);
    setModalOpen(true);
  };
  
  // 9) Usuwanie (DELETE)
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/visits/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setVisits((prev) => prev.filter((v) => v._id !== id));
      })
      .catch((err) => console.error("Błąd usuwania wizyty:", err));
  };
  
  // Stan sidebara (kalendarz)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onDateChange = (date) => setSelectedDate(date);
  
  // Funkcja wylogowania
  const handleLogout = () => {
    window.location.href = "http://localhost:5173";
    
  };
  
  const loggedUserName = "user"; // testowo
  
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
          <h1>Zaplanuj wizytę</h1>
          
          <button className="add-visit-btn" onClick={handleAddVisit}>
            Dodaj wizytę
          </button>
          
          {/* Tabela visits */}
          <table className="visits-table">
            <thead>
            <tr>
              <th>Data rozpoczęcia</th>
              <th>Godz. rozpoczęcia</th>
              <th>Data zakończenia</th>
              <th>Godz. zakończenia</th>
              <th>Kategoria</th>
              <th>Cel</th>
              <th>BHP</th>
              <th>Koszt</th>
              <th>Osoba odpowiedzialna</th>
              <th>Osoba wizytująca</th>
              <th>Email wizytującego</th>
              <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {visits.map((v) => (
              <tr key={v._id}>
                <td>{v.startDate}</td>
                <td>{v.startTime}</td>
                <td>{v.endDate}</td>
                <td>{v.endTime}</td>
                <td>{v.category}</td>
                <td>{v.purpose}</td>
                <td>{v.bhp}</td>
                <td>{v.cost}</td>
                <td>{v.responsiblePerson}</td>
                <td>{v.visitingPerson}</td>
                <td>{v.visitingEmail}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(v)}>
                    Modyfikuj
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(v._id)}>
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          
          {/* Modal – warunkowo wyświetlany */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{formData._id ? "Edytuj wizytę" : "Dodaj wizytę"}</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Data rozpoczęcia:
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Godzina rozpoczęcia:
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Data zakończenia:
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Godzina zakończenia:
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Kategoria:
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">-- wybierz --</option>
                      <option value="HR">HR</option>
                      <option value="Utrzymanie ruchu">Utrzymanie ruchu</option>
                      <option value="Przedstawiciel handlowy">
                        Przedstawiciel handlowy
                      </option>
                      <option value="Inne">Inne</option>
                    </select>
                  </label>
                  
                  <label>
                    Cel:
                    <input
                      type="text"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    BHP:
                    <select
                      name="bhp"
                      value={formData.bhp}
                      onChange={handleChange}
                    >
                      <option value="">-- wybierz --</option>
                      <option value="Nie">Nie</option>
                      <option value="Wykonane">Wykonane</option>
                      <option value="Do zrobienia">Do zrobienia</option>
                      <option value="Do weryfikacji">Do weryfikacji</option>
                    </select>
                  </label>
                  
                  <label>
                    Koszt:
                    <input
                      type="text"
                      name="cost"
                      placeholder="np. 1500 zł / Nie dotyczy"
                      value={formData.cost}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Osoba odpowiedzialna:
                    <input
                      type="text"
                      name="responsiblePerson"
                      value={formData.responsiblePerson}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Osoba wizytująca:
                    <input
                      type="text"
                      name="visitingPerson"
                      value={formData.visitingPerson}
                      onChange={handleChange}
                    />
                  </label>
                  
                  <label>
                    Email wizytującego:
                    <input
                      type="email"
                      name="visitingEmail"
                      value={formData.visitingEmail}
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

export default PlanVisit;
