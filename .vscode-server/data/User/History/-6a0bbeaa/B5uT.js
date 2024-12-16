import React, { useState } from "react";
import axios from "axios";
import CityAutocomplete from "./CityAutocomplete";

const Weather = () => {
  const [city, setCity] = useState(""); // Ciudad ingresada o seleccionada
  const [weatherData, setWeatherData] = useState(null); // Datos del clima
  const [error, setError] = useState(null); // Mensaje de error
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Estado para activar/desactivar autocompletado

  // Función para realizar la consulta al backend
  const fetchWeather = async () => {
    if (!city) {
      setError("Por favor ingresa o selecciona una ciudad válida.");
      return;
    }

    try {
      setError(null); // Reinicia el estado de error
      const response = await axios.get("http://localhost:8080/api/weather", {
        params: { city }, // Enviar la ciudad como parámetro
      });
      setWeatherData(response.data); // Almacena los datos en el estado
    } catch (err) {
      setError("No se pudo obtener el clima. Verifica el nombre de la ciudad.");
      setWeatherData(null);
    }
  };

  // Función para manejar cambios en el input manual (cuando no hay autocompletado)
  const handleManualInputChange = (event) => {
    setCity(event.target.value); // Actualiza el estado con la entrada manual
  };

  // Función para manejar el cambio de estado del checkbox
  const handleCheckboxChange = () => {
    setIsAutocompleteEnabled((prev) => !prev); // Activa/desactiva autocompletado
    setCity(""); // Reinicia la ciudad al cambiar el modo
  };

  return (
    <div className="weather">
      <h1>Consulta el Clima</h1>

      {/* Checkbox para activar/desactivar autocompletado */}
      <label style={{ marginBottom: "10px", display: "block" }}>
        <input
          type="checkbox"
          checked={isAutocompleteEnabled}
          onChange={handleCheckboxChange}
          style={{ marginRight: "10px" }}
        />
        Activar autocompletado
      </label>

      {/* Input o Autocompletado dependiendo del estado */}
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
            boxSizing: "border-box",
          }}
        />
      )}

      {/* Botón de consulta */}
      <button onClick={fetchWeather} disabled={!city} style={{ marginTop: "10px" }}>
        Consultar
      </button>

      {/* Mostrar errores */}
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}

      {/* Mostrar resultados del clima */}
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
