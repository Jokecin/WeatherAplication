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
      zIndex: 999, // Asegura que el menú se renderice sobre otros elementos
    }),
  };

  // Función para buscar ciudades en tu backend
  const fetchCities = async (input) => {
    if (!input) return; // No busca si el input está vacío
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/geo/cities", {
        params: { query: input }, // Envía el parámetro 'query' al backend
      });

      const cityOptions = response.data.map((city) => ({
        value: city.city,
        label: `${city.city}, ${city.country}`,
      }));
      setOptions(cityOptions);
    } catch (error) {
      console.error("Error fetching cities from backend:", error);
      setOptions([]); // Limpia las opciones en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Debounce para evitar llamadas excesivas al backend
  const debouncedFetchCities = debounce((input) => fetchCities(input), 300);

  // Manejar cambios en el input
  const handleInputChange = (newValue) => {
    setInputValue(newValue); // Guarda el valor temporal del input
    debouncedFetchCities(newValue); // Llama a la API con debounce
  };

  // Manejar selección de ciudad
  const handleChange = (option) => {
    setSelectedOption(option); // Guarda la opción seleccionada
    setInputValue(option?.label || ""); // Persiste el valor en el input
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
