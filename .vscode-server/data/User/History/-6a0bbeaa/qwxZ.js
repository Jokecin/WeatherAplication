import React, { useState } from "react";
import axios from "axios";
import CityAutocomplete from "./CityAutocomplete";

const Weather = () => {
  const [city, setCity] = useState(""); // Ciudad ingresada o seleccionada
  const [weatherData, setWeatherData] = useState(null); // Datos del clima
  const [error, setError] = useState(null); // Mensaje de error
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Estado autocompletado

  // Realiza la consulta al backend
  const fetchWeather = async () => {
    if (!city) {
      setError("Por favor ingresa o selecciona una ciudad válida.");
      return;
    }

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

  const handleManualInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleCheckboxChange = () => {
    setIsAutocompleteEnabled((prev) => !prev);
    setCity("");
  };

  return (
    <div className="weather">
      <h1>Consulta el Clima</h1>

      {/* Checkbox para activar/desactivar autocompletado */}
      <label>
        <input
          type="checkbox"
          checked={isAutocompleteEnabled}
          onChange={handleCheckboxChange}
          style={{ marginRight: "10px" }}
        />
        Activar autocompletado
      </label>

      {/* Input manual o autocompletado */}
      {isAutocompleteEnabled ? (
        <CityAutocomplete onCitySelect={(selectedCity) => setCity(selectedCity)} />
      ) : (
        <input
          type="text"
          value={city}
          onChange={handleManualInputChange}
          placeholder="Ingresa una ciudad"
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: "100%",
            marginTop: "10px",
          }}
        />
      )}

      {/* Botón de consulta */}
      <button onClick={fetchWeather} disabled={!city} style={{ marginTop: "10px" }}>
        Consultar
      </button>

      {/* Mostrar error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Mostrar resultados */}
      {weatherData && (
        <div className="weather-info" style={{ marginTop: "20px" }}>
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
