import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import "./CityAutocomplete.css"; // Importa tu archivo de estilos personalizado

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define los estilos personalizados para React Select
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
      zIndex: 10, // Asegura que el dropdown tenga un z-index menor que el botón
      position: "relative",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontStyle: "italic",
      color: "#aaa",
    }),
  };

  // Función para obtener las ciudades de la API
  const fetchCities = async (inputValue) => {
    if (!inputValue) return;

    setLoading(true);
    try {
      const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
        params: {
          namePrefix: inputValue,
        },
        headers: {
          "X-RapidAPI-Key": "TU_API_KEY", // Reemplaza con tu API key
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      });

      // Actualiza las opciones con el formato adecuado
      const cityOptions = response.data.data.map((city) => ({
        value: city.city,
        label: `${city.city}, ${city.country}`,
      }));
      setOptions(cityOptions);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para evitar demasiadas llamadas a la API
  const debouncedFetchCities = debounce((inputValue) => {
    fetchCities(inputValue);
  }, 300);

  // Manejar el cambio en el input
  const handleInputChange = (inputValue) => {
    if (inputValue) debouncedFetchCities(inputValue);
  };

  // Manejar la selección de una ciudad
  const handleChange = (selectedOption) => {
    if (selectedOption) {
      onCitySelect(selectedOption.value); // Envía la ciudad seleccionada al padre
    }
  };

  return (
    <div className="autocomplete-container">
      <Select
        options={options}
        isLoading={loading}
        onInputChange={handleInputChange}
        onChange={handleChange}
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles}
      />
      <button className="consult-button" onClick={() => console.log("Consulta ejecutada")}>
        Consultar
      </button>
    </div>
  );
};

export default CityAutocomplete;
