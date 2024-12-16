import React, { useState } from "react";
import axios from "axios";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import debounce from "lodash.debounce";

const CityAutocomplete = ({ onCitySelect, isAutocompleteEnabled }) => {
  const [options, setOptions] = useState([]); // Opciones del autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [inputValue, setInputValue] = useState(""); // Valor del input

  // Función para obtener ciudades desde el backend
  const fetchCities = async (input) => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/geo/cities", {
        params: { query: input },
      });
      const cityOptions = response.data.map((city) => ({
        label: `${city.city}, ${city.country}`,
        value: city.city,
      }));
      setOptions(cityOptions);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para limitar llamadas a la API
  const debouncedFetchCities = debounce((input) => {
    if (isAutocompleteEnabled) fetchCities(input);
  }, 300);

  // Maneja cambios en el input
  const handleInputChange = (_, newValue) => {
    setInputValue(newValue);
    debouncedFetchCities(newValue);
  };

  // Maneja selección de una opción
  const handleChange = (_, option) => {
    if (option) {
      onCitySelect(option.value); // Envía solo la ciudad al componente padre
      setInputValue(option.label);
    }
  };

  return (
    <Autocomplete
      options={isAutocompleteEnabled ? options : []}
      loading={loading}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Ingresa una ciudad"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText="Sin resultados"
    />
  );
};

export default CityAutocomplete;
