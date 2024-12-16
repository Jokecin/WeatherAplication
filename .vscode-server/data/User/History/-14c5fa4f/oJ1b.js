import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";


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
    }),
    placeholder: (provided) => ({
      ...provided,
      fontStyle: "italic",
      color: "#aaa",
    }),
  };

  const fetchCities = async (inputValue) => {
    if (!inputValue) return [];

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

      // Mapea los resultados al formato que React Select espera
      return response.data.data.map((city) => ({
        value: city.city,
        label: `${city.city}, ${city.country}`,
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const debouncedFetchCities = debounce((inputValue) => {
    fetchCities(inputValue);
  }, 300);
  
  const handleInputChange = (inputValue) => {
    debouncedFetchCities(inputValue);
  };

  const handleChange = (selectedOption) => {
    onCitySelect(selectedOption.value); // Devuelve la ciudad seleccionada al componente padre
  };

  return (
    <div>
      <Select
        options={options}
        isLoading={loading}
        onInputChange={handleInputChange} // Manejar cambios en el campo de entrada
        onChange={handleChange} // Manejar la selección de una ciudad
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles} // Aplica los estilos personalizados
      />
    </div>
  );
};

export default CityAutocomplete;
