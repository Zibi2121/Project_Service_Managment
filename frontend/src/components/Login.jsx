import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../AuthProvider"; // Importuj kontekst autoryzacji
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {login} = useAuth(); // Użyj funkcji logowania z kontekstu
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
      });
      
      if (!response.ok) {
        throw new Error("Nieprawidłowy email lub hasło");
      }
      
      login(); // Ustaw użytkownika jako zalogowanego
      navigate("/dashboard"); // Przejdź do strony głównej
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Logowanie</h2>
        <form onSubmit={handleLogin}>
          <label>
            Nazwa użytkownika:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Hasło:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Zaloguj</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
