import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]); // Opciones del autocompletado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectedOption, setSelectedOption] = useState(null); // Opción seleccionada
  const [inputValue, setInputValue] = useState(""); // Valor temporal del input
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Estado del checkbox

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

  // Función para buscar ciudades en el backend
  const fetchCities = async (input) => {
    if (!input) return; // Evita llamadas innecesarias si el input está vacío
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/geo/cities", {
        params: { query: input },
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
  const debouncedFetchCities = debounce((input) => {
    if (isAutocompleteEnabled) {
      fetchCities(input);
    } else {
      setOptions([]); // Limpia opciones si el autocompletado está desactivado
    }
  }, 300);

  // Manejar cambios en el input
  const handleInputChange = (newValue) => {
    setInputValue(newValue); // Guarda el valor temporal del input
    if (isAutocompleteEnabled && newValue) {
      debouncedFetchCities(newValue);
    } else {
      setOptions([]); // Evita mostrar resultados si está deshabilitado
    }
  };

  // Manejar selección de ciudad
  const handleChange = (option) => {
    setSelectedOption(option); // Guarda la opción seleccionada
    setInputValue(option?.label || ""); // Persiste el valor en el input
    onCitySelect(option?.value); // Devuelve la ciudad seleccionada al componente padre
  };

  // Manejar el cambio del checkbox
  const handleCheckboxChange = () => {
    setIsAutocompleteEnabled((prev) => !prev); // Activa/desactiva el autocompletado
    setOptions([]); // Limpia las opciones al cambiar el estado
  };

  return (
    <div>
      {/* Checkbox para activar/desactivar autocompletado */}
      <label style={{ marginBottom: "10px", display: "block" }}>
        <input
          type="checkbox"
          checked={isAutocompleteEnabled}
          onChange={handleCheckboxChange}
          style={{ marginRight: "10px" }}
        />
        Activar autocompletado
      </label>

      {/* Input de selección con autocompletado */}
      <Select
        options={isAutocompleteEnabled ? options : []} // Solo muestra opciones si está habilitado
        isLoading={loading} // Indicador de carga
        value={selectedOption} // Controla la opción seleccionada
        inputValue={inputValue} // Controla el valor del input
        onInputChange={handleInputChange} // Maneja cambios en el input
        onChange={handleChange} // Maneja selección de opción
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() =>
          inputValue && isAutocompleteEnabled ? "Sin resultados" : null
        } // Solo muestra mensaje si hay input
        styles={customStyles}
        blurInputOnSelect={false} // No borra el input al perder foco
        menuIsOpen={isAutocompleteEnabled && inputValue ? undefined : false} // Evita mostrar la bandeja cuando no hay input
      />
    </div>
  );
};

export default CityAutocomplete;
