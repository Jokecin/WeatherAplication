import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import "./CityAutocomplete.css";

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]); // Opciones para el autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectedOption, setSelectedOption] = useState(null); // Ciudad seleccionada

  // Estilos personalizados para React Select
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
      zIndex: 10, // Asegura que el dropdown esté por encima de otros elementos
    }),
    placeholder: (provided) => ({
      ...provided,
      fontStyle: "italic",
      color: "#aaa",
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

  // Función debounced para reducir las llamadas a la API
  const debouncedFetchCities = debounce((inputValue) => {
    fetchCities(inputValue);
  }, 300);

  // Manejar cambios en el input
  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "input-change") {
      debouncedFetchCities(inputValue);
    }
  };

  // Manejar selección de ciudad
  const handleChange = (option) => {
    setSelectedOption(option); // Guarda la opción seleccionada
    onCitySelect(option?.value); // Envía el valor al componente padre
  };

  return (
    <div className="autocomplete-container">
      <Select
        value={selectedOption} // El valor seleccionado persiste aquí
        options={options} // Opciones para el dropdown
        isLoading={loading} // Estado de carga
        onInputChange={handleInputChange} // Actualiza opciones al escribir
        onChange={handleChange} // Guarda la opción seleccionada
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles}
      />
    </div>
  );
};

export default CityAutocomplete;
