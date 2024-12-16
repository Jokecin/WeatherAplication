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

const Weather = () => {
  const [city, setCity] = useState(""); // Ciudad ingresada
  const [weatherData, setWeatherData] = useState(null); // Datos del clima
  const [error, setError] = useState(null); // Error
  const [loading, setLoading] = useState(false); // Estado de carga
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Checkbox para autocompletado

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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ width: 400, padding: 2, boxShadow: 5 }}>
        <CardHeader
          title="Consulta el Clima"
          titleTypographyProps={{ align: "center", variant: "h5" }}
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

          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={fetchWeather}
              disabled={!city || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Consultar"}
            </Button>
          </Box>

          {error && (
            <Box marginTop={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {weatherData && (
            <Box marginTop={2}>
              <Typography variant="h6" align="center">
                {weatherData.name}
              </Typography>
              <Typography align="center">
                Temperatura: {weatherData.main.temp}°C
              </Typography>
              <Typography align="center">
                Sensación Térmica: {weatherData.main.feels_like}°C
              </Typography>
              <Typography align="center">
                Clima: {weatherData.weather[0].description}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Weather;
