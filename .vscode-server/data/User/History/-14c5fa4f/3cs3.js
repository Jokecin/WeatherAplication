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
      zIndex: 999,
    }),
  };

  // Función para buscar ciudades en la API
  const fetchCities = async (input) => {
    if (!input) return;
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
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para evitar llamadas excesivas a la API
  const debouncedFetchCities = debounce((input) => {
    if (isAutocompleteEnabled) fetchCities(input);
  }, 300);

  // Manejar cambios en el input
  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (isAutocompleteEnabled) debouncedFetchCities(newValue);
  };

  // Manejar selección de ciudad
  const handleChange = (option) => {
    setSelectedOption(option);
    setInputValue(option?.label || "");
    onCitySelect(option?.value); // Devuelve la ciudad seleccionada al componente padre
  };

  // Manejar el cambio del checkbox
  const handleCheckboxChange = () => {
    setIsAutocompleteEnabled((prev) => !prev);
    setOptions([]); // Limpia las opciones si se desactiva el autocompletado
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isAutocompleteEnabled}
          onChange={handleCheckboxChange}
          style={{ marginRight: "10px" }}
        />
        Autocompletar ciudad
      </label>
      <Select
        options={options}
        isLoading={loading}
        value={selectedOption}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles}
        blurInputOnSelect={false}
        backspaceRemovesValue={false}
        isDisabled={!isAutocompleteEnabled} // Desactiva el input si el autocompletado está desactivado
      />
    </div>
  );
};

export default CityAutocomplete;
