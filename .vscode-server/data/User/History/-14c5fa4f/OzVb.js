import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]); // Opciones del autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectedOption, setSelectedOption] = useState(null); // Opción seleccionada
  const [inputValue, setInputValue] = useState(""); // Valor temporal del input

  // Estilos personalizados
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
      zIndex: 999,
    }),
  };

  // Función para buscar ciudades en la API
  const fetchCities = async (input) => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
        params: { namePrefix: input },
        headers: {
          "X-RapidAPI-Key": "TU_API_KEY", // Reemplaza con tu API key
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

  // Debounce para evitar llamadas excesivas a la API
  const debouncedFetchCities = debounce((input) => fetchCities(input), 300);

  // Manejar cambios en el input
  const handleInputChange = (newValue) => {
    setInputValue(newValue); // Guarda el valor temporal del input
    debouncedFetchCities(newValue); // Llama a la API con debounce
  };

  // Manejar selección de ciudad
  const handleChange = (option) => {
    setSelectedOption(option); // Guarda la opción seleccionada
    setInputValue(option?.label || ""); // Persistir el valor en el input
    onCitySelect(option?.value); // Devuelve la ciudad seleccionada al componente padre
  };

  return (
    <Select
      options={options} // Opciones disponibles
      isLoading={loading} // Indicador de carga
      value={selectedOption} // Controla la opción seleccionada
      inputValue={inputValue} // Controla el valor del input
      onInputChange={handleInputChange} // Maneja cambios en el input
      onChange={handleChange} // Maneja selección de opción
      placeholder="Ingresa una ciudad"
      noOptionsMessage={() => "Sin resultados"}
      styles={customStyles}
      blurInputOnSelect={false} // No borra el input al perder foco
      backspaceRemovesValue={false} // No borra al presionar Backspace
    />
  );
};

export default CityAutocomplete;
