import React, { useState } from "react";
import axios from "axios";
import CityAutocomplete from "./CityAutocomplete";

const Weather = () => {
  const [city, setCity] = useState(""); // Ciudad seleccionada
  const [weatherData, setWeatherData] = useState(null); // Datos del clima
  const [error, setError] = useState(null); // Mensaje de error
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Controla el checkbox

  // Función para consultar el clima
  const fetchWeather = async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:8080/api/weather", {
        params: { city },
      });
      setWeatherData(response.data);
    } catch (err) {
      setError("No se pudo obtener el clima. Verifica el nombre de la ciudad.");
      setWeatherData(null);
    }
  };

  return (
    <div className="weather">
      <h1>Consulta el Clima</h1>

      {/* Checkbox para activar/desactivar autocompletado */}
      <label style={{ marginBottom: "10px", display: "block" }}>
        <input
          type="checkbox"
          checked={isAutocompleteEnabled}
          onChange={() => setIsAutocompleteEnabled((prev) => !prev)}
          style={{ marginRight: "10px" }}
        />
        Activar autocompletado
      </label>

      {/* Componente de autocompletado */}
      <CityAutocomplete
        onCitySelect={(selectedCity) => setCity(selectedCity)}
        isAutocompleteEnabled={isAutocompleteEnabled}
      />

      {/* Botón de consulta */}
      <button onClick={fetchWeather} disabled={!city}>
        Consultar
      </button>

      {/* Mostrar errores */}
      {error && <p className="error">{error}</p>}

      {/* Mostrar datos del clima */}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>Temperatura: {weatherData.main.temp}°C</p>
          <p>Sensación Térmica: {weatherData.main.feels_like}°C</p>
          <p>Clima: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
