import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";

const CityAutocomplete = ({ onCitySelect, isAutocompleteEnabled }) => {
  const [options, setOptions] = useState([]); // Opciones del autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectedOption, setSelectedOption] = useState(null); // Opción seleccionada

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

  // Llamada a la API para obtener ciudades
  const fetchCities = async (input) => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/geo/cities", {
        params: { query: input },
      });
      const cityOptions = response.data.map((city) => ({
        value: city.city, // Solo la ciudad
        label: `${city.city}, ${city.country}`, // Ciudad + País
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
    if (isAutocompleteEnabled && input) {
      fetchCities(input);
    }
  }, 300);

  // Manejar cambios en el input
  const handleInputChange = (newValue) => {
    if (isAutocompleteEnabled) {
      debouncedFetchCities(newValue);
    }
  };

  // Manejar la selección de una opción
  const handleChange = (option) => {
    setSelectedOption(option); // Guarda la opción seleccionada
    onCitySelect(option.value); // Envía solo la ciudad al componente padre
  };

  return (
    <Select
      options={isAutocompleteEnabled ? options : []} // Opciones solo si está habilitado
      isLoading={loading} // Estado de carga
      value={selectedOption} // Opción seleccionada
      onInputChange={handleInputChange} // Maneja cambios en el input
      onChange={handleChange} // Maneja la selección de una opción
      placeholder="Ingresa una ciudad"
      noOptionsMessage={() =>
        isAutocompleteEnabled ? "Sin resultados" : null
      } // Mensaje cuando no hay resultados
      styles={customStyles}
      blurInputOnSelect={true} // Contrae la bandeja automáticamente
      backspaceRemovesValue={false} // Evita borrar la opción seleccionada con Backspace
    />
  );
};

export default CityAutocomplete;
