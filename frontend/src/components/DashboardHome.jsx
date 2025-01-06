import React, { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import "./DashboardHome.scss";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const DashboardHome = () => {
  // Stan wizyt (dynamicznie z bazy danych)
  const [tableData, setTableData] = useState([]);
  
  // Fetch danych z API
  useEffect(() => {
    fetch("http://localhost:5000/api/visits")
      .then((res) => res.json())
      .then((data) => {
        setTableData(data); // Ustaw dane w stanie
      })
      .catch((err) => console.error("Błąd pobierania danych: ", err));
  }, []);
  
  // Dane do donut
  const donutData = {
    labels: ["Serwisy", "Przedstawiciele", "Nowi pracownicy", "Inne"],
    datasets: [
      {
        label: "Udział wizyt",
        data: [40, 30, 10, 20], // Możesz zastąpić dynamicznymi danymi, jeśli masz takie dane w API
        backgroundColor: ["#FFB547", "#4285F4", "#FF5252", "#00C49F"],
      },
    ],
  };
  const donutOptions = {
    cutout: "60%",
    plugins: {
      legend: { position: "right" },
    },
  };
  
  // Dane do wykresu liniowego
  const lineData = {
    labels: ["2025-01-01", "2025-01-07", "2025-01-14", "2025-01-21", "2025-01-28"],
    datasets: [
      {
        label: "Koszty wizyt serwisowych (PLN)",
        data: [700, 2000, 1500, 2000, 2500],
        fill: true,
        backgroundColor: "rgba(66, 133, 244, 0.2)",
        borderColor: "rgba(66, 133, 244, 1)",
        tension: 0.3,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Data" } },
      y: { title: { display: true, text: "Koszt (PLN)" } },
    },
  };
  
  return (
    <div className="dashboard-home">
      <h2 className="dashboard-title">Wizyty w firmie</h2>
      
      <div className="card card-wide">
        <h3>Zaplanowane wizyty (miesiąc)</h3>
        <p>Razem: {tableData.length}</p>
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
            <th>Akcje</th>

          </tr>
          </thead>
          <tbody>
          {tableData.map((visit, index) => (
            <tr key={index}>
              <td>{visit.startDate}</td>
              <td>{visit.startTime}</td>
              <td>{visit.endDate}</td>
              <td>{visit.endTime}</td>
              <td>{visit.category}</td>
              <td>{visit.purpose}</td>
              <td>{visit.bhp}</td>
              <td>{visit.cost}</td>
              <td>{visit.responsiblePerson}</td>
            
              <td>
                <button
                  className="add-note-btn"
                  onClick={() => alert(`Dodaj uwagę do wizyty nr ${index + 1}`)}
                >
                  Dodaj uwagę
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      
      <div className="card">
        <h3>Udział wizyt</h3>
        <div className="donut-chart-wrapper">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>
      
      <div className="card">
        <h3>Ostatnie powiadomienia</h3>
        <ul className="notifications-list">
          <li>Użytkownik Jan Kowalski dodał nową wizytę</li>
          <li>Serwis maszyny 1281 został zakończony</li>
          <li>Zaplanowano wizytę BHP na 15.02.2025</li>
        </ul>
      </div>
      
      <div className="card card-wide">
        <h3>Koszty wizyt serwisowych (miesiąc)</h3>
        <div className="chart-box">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
