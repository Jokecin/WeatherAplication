import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

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

  const handleInputChange = async (inputValue) => {
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

      const cities = response.data.data.map((city) => ({
        value: city.city,
        label: `${city.city}, ${city.country}`,
      }));

      setOptions(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedOption) => {
    onCitySelect(selectedOption.value);
  };

  return (
    <div>
      <Select
        options={options}
        isLoading={loading}
        onInputChange={handleInputChange}
        onChange={handleChange}
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles} // Aplica los estilos personalizados
      />
    </div>
  );
};

export default CityAutocomplete;
