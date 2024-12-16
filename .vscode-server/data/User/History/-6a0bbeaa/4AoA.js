import React, { useState } from "react";
import axios from "axios";
import CityAutocomplete from "./CityAutocomplete";

const Weather = () => {
  const [city, setCity] = useState(""); // Ciudad ingresada por el usuario
  const [weatherData, setWeatherData] = useState(null); // Datos del clima
  const [error, setError] = useState(null); // Mensaje de error

  // Función para realizar la consulta al backend
  const fetchWeather = async () => {
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

  return (
    <div className="weather">
      <h1>Consulta el Clima</h1>
      <CityAutocomplete onCitySelect={(selectedCity) => setCity(selectedCity)} />
      <button onClick={fetchWeather} disabled={!city}>
        Consultar
      </button>

      {error && <p className="error">{error}</p>}
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