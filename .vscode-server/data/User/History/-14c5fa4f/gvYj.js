import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import "./CityAutocomplete.css";

const CityAutocomplete = ({ onCitySelect }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

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
      zIndex: 10,
      position: "relative",
    }),
  };

  const fetchCities = async (inputValue) => {
    if (!inputValue) return;
    setLoading(true);
    try {
      const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
        params: { namePrefix: inputValue },
        headers: {
          "X-RapidAPI-Key": "TU_API_KEY",
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

  const debouncedFetchCities = debounce((inputValue) => {
    fetchCities(inputValue);
  }, 300);

  const handleInputChange = (inputValue) => {
    if (inputValue) debouncedFetchCities(inputValue);
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    onCitySelect(option?.value);
  };

  return (
    <div className="autocomplete-container">
      <Select
        value={selectedOption}
        options={options}
        isLoading={loading}
        onInputChange={handleInputChange}
        onChange={handleChange}
        placeholder="Ingresa una ciudad"
        noOptionsMessage={() => "Sin resultados"}
        styles={customStyles}
      />
    </div>
  );
};

export default CityAutocomplete;
