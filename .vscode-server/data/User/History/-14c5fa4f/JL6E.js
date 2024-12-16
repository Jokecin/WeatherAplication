import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]); // Opciones del autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [inputValue, setInputValue] = useState(""); // Valor temporal del input

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      border: "1px solid #ccc",
      padding: "5px",
      fontSize: "16px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
  };

  const fetchCities = async (input) => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
        params: { namePrefix: input },
        headers: {
          "X-RapidAPI-Key": "TU_API_KEY",
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      });
      const cityOptions = response.data.data.map((city) => ({
        value: city.city,
        label: `${city.city}, ${city.country}`,
      }));
      setOptions(cityOptions);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCities = debounce((input) => fetchCities(input), 300);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    debouncedFetchCities(newValue);
  };

  const handleChange = (option) => {
    setInputValue(option.label); // Mostrar el valor seleccionado en el input
    onCitySelect(option.value); // Envía la ciudad seleccionada al padre
  };

  return (
    <Select
      options={options}
      inputValue={inputValue}
      isLoading={loading}
      onInputChange={handleInputChange}
      onChange={handleChange}
      placeholder="Ingresa una ciudad"
      styles={customStyles}
      noOptionsMessage={() => "Sin resultados"}
    />
  );
};

export default CityAutocomplete;
