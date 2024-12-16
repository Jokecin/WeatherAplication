import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import "./CityAutocomplete.css";

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]); // Opciones para el autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectedOption, setSelectedOption] = useState(null); // Ciudad seleccionada
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
      borderRadius: "8px",
      marginTop: "5px",
      zIndex: 10,
      position: "relative",
    }),
  };

  // Función para obtener las ciudades desde la API
  const fetchCities = async (inputValue) => {
    if (!inputValue) return;
    setLoading(true);
    try {
      const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
        params: { namePrefix: inputValue },
        headers: {
          "X-RapidAPI-Key": "TU_API_KEY", // Reemplaza con tu API Key
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

  const debouncedFetchCities = debounce((input) => {
    fetchCities(input);
  }, 300);

  const handleInputChange = (value, actionMeta) => {
    setInputValue(value); // Actualiza el estado del input
    if (actionMeta.action === "input-change") {
      debouncedFetchCities(value);
    }
  };

  const handleChange = (option) => {
    setSelectedOption(option); // Guarda la opción seleccionada
    setInputValue(option?.label || ""); // Actualiza el input con la selección
    onCitySelect(option?.value); // Envía el valor al componente padre
  };

  return (
    <div className="autocomplete-container">
      <Select
        value={selectedOption} // Mantiene la selección persistente
        inputValue={inputValue} // Controla el valor temporal del input
        options={options}
        isLoading={loading}
        onInputChange={handleInputChange} // Actualiza el input
        onChange={handleChange} // Actualiza la selección
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles}
      />
    </div>
  );
};

export default CityAutocomplete;