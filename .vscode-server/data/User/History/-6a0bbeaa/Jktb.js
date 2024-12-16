import React, { useState } from "react";
import axios from "axios";
import CityAutocomplete from "./CityAutocomplete";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { WbSunny, Cloud, AcUnit, Thunderstorm, Grain } from "@mui/icons-material";

const Weather = () => {
  const [city, setCity] = useState(""); // Ciudad ingresada
  const [weatherData, setWeatherData] = useState(null); // Datos del clima
  const [error, setError] = useState(null); // Error
  const [loading, setLoading] = useState(false); // Estado de carga
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Checkbox para autocompletado

  // Función para consultar el clima
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/weather", {
        params: { city },
      });
      setWeatherData(response.data);
    } catch (err) {
      setError("No se pudo obtener el clima. Verifica el nombre de la ciudad.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar ícono basado en la condición climática
  const renderWeatherIcon = (condition) => {
    if (condition.includes("clear")) return <WbSunny color="warning" fontSize="large" />;
    if (condition.includes("cloud")) return <Cloud color="action" fontSize="large" />;
    if (condition.includes("rain")) return <Grain color="primary" fontSize="large" />;
    if (condition.includes("snow")) return <AcUnit color="info" fontSize="large" />;
    if (condition.includes("thunder")) return <Thunderstorm color="error" fontSize="large" />;
    return <WbSunny color="disabled" fontSize="large" />;
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        padding: 2,
      }}
    >
      <Card sx={{ width: 500, borderRadius: 4, boxShadow: 10 }}>
        <CardHeader
          title="Consulta el Clima"
          titleTypographyProps={{ align: "center", variant: "h4", fontWeight: "bold" }}
          sx={{ backgroundColor: "#2196f3", color: "#fff", borderRadius: "4px 4px 0 0" }}
        />
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={isAutocompleteEnabled}
                onChange={() =>
                  setIsAutocompleteEnabled((prev) => !prev)
                }
              />
            }
            label="Activar autocompletado"
          />

          <Box marginY={2}>
            <CityAutocomplete
              onCitySelect={(selectedCity) => setCity(selectedCity)}
              isAutocompleteEnabled={isAutocompleteEnabled}
            />
          </Box>

          <Box textAlign="center" marginY={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchWeather}
              disabled={!city || loading}
              sx={{ borderRadius: 8, paddingX: 4 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Consultar"}
            </Button>
          </Box>

          {error && (
            <Box marginTop={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {weatherData && (
            <Box
              marginTop={2}
              textAlign="center"
              sx={{
                backgroundColor: "#e3f2fd",
                borderRadius: 2,
                padding: 3,
                boxShadow: 3,
              }}
            >
              {renderWeatherIcon(weatherData.weather[0].description.toLowerCase())}
              <Typography variant="h5" fontWeight="bold">
                {weatherData.name}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {weatherData.weather[0].description}
              </Typography>
              <Typography variant="h6">🌡 Temperatura: {weatherData.main.temp}°C</Typography>
              <Typography variant="h6">
                ❄️ Sensación Térmica: {weatherData.main.feels_like}°C
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Weather;
