import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";

const CityAutocomplete = ({ onCitySelect, isAutocompleteEnabled }) => {
  const [options, setOptions] = useState([]); // Opciones del autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectedOption, setSelectedOption] = useState(null); // Opción seleccionada
  const [inputValue, setInputValue] = useState(""); // Valor del input

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
        value: city.city, // Envia solo la ciudad
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

  // Debounce para limitar llamadas a la API
  const debouncedFetchCities = debounce((input) => {
    if (isAutocompleteEnabled && input) {
      fetchCities(input);
    }
  }, 300);

  // Manejar cambios en el input
  const handleInputChange = (newValue, { action }) => {
    if (action === "input-change") {
      setInputValue(newValue);
      if (isAutocompleteEnabled) {
        debouncedFetchCities(newValue);
      } else {
        onCitySelect(newValue); // Envía el valor al componente padre directamente
      }
    }
  };

  // Manejar la selección de una opción
  const handleChange = (option) => {
    if (option) {
      setSelectedOption(option);
      setInputValue(option.label); // Actualiza el valor del input
      onCitySelect(option.value); // Envía solo la ciudad al componente padre
    }
  };

  // Sincronizar `inputValue` si `isAutocompleteEnabled` se desactiva
  useEffect(() => {
    if (!isAutocompleteEnabled) {
      setOptions([]); // Limpia opciones si el autocompletado está desactivado
      setSelectedOption(null);
    }
  }, [isAutocompleteEnabled]);

  return (
    <Select
      options={isAutocompleteEnabled ? options : []} // Opciones solo si está habilitado
      isLoading={loading} // Estado de carga
      value={selectedOption} // Opción seleccionada
      inputValue={inputValue} // Valor del input
      onInputChange={handleInputChange} // Maneja cambios en el input
      onChange={handleChange} // Maneja selección de una opción
      placeholder="Ingresa una ciudad"
      noOptionsMessage={() =>
        isAutocompleteEnabled && inputValue ? "Sin resultados" : null
      } // Oculta mensaje cuando no es necesario
      styles={customStyles}
      blurInputOnSelect={false} // Evita borrar el input al seleccionar
      backspaceRemovesValue={false} // Evita borrar opción seleccionada con Backspace
    />
  );
};

export default CityAutocomplete;
