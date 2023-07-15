
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {getCurrentLocation } from 'current-location-geo'
import Autosuggest from 'react-autosuggest';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric'); // default unit is Celsius (°C)
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getCurrentLocation(function (err, position) {
      if (err) {
        console.error('Error:', err);
      } else {
        fetchLocationName(position.latitude,position.longitude);
        console.log('Latitude:', position.latitude);
        console.log('Longitude:', position.longitude);
      }
    });
  }, []);

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=895284fb2d2c50a520ea537456963d9c`;
      const response = await axios.get(url);
      const { data } = response;
      setData(data);
      setLocation(data.name);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const searchLocation = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=${unit}&appid=895284fb2d2c50a520ea537456963d9c`)
      .then((response) => {
        setData(response.data);
        setLocation(response.data.name);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setInputValue('');
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'imperial' ? 'metric' : 'imperial'));
  };

  const convertTemperature = (temp) => {
    if (unit === 'imperial') {
      return (temp * 9) / 5 + 32; // Convert Celsius to Fahrenheit
    } else {
      return temp; // Return the temperature in Celsius as it is
    }
  };

  const fetchCountrySuggestions = async (value) => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data;
      const countryNames = countries.map((country) => country.name.common);
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      const suggestions = inputLength === 0 ? [] : countryNames.filter((country) => country.toLowerCase().slice(0, inputLength) === inputValue);
      setSuggestions(suggestions);
    } catch (error) {
      console.error(error);
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchCountrySuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setInputValue(newValue);
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div className="suggestion">
        {suggestion}
      </div>
    );
  };

  const inputProps = {
    placeholder: 'Enter Location',
    value: inputValue,
    onChange: onChange,
    onKeyPress: (event) => {
      if (event.key === 'Enter') {
        searchLocation();
      }
    }
  };

  return (
    <div className="app">
   <div className="search">

    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion) => suggestion}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  
</div>

      <div className="container">
        <div className="top">
          <div className="location">
            <p>{location}</p>
          </div>
          <div className="temp">
            {data.main ? (
              <>
                <h1>{convertTemperature(data.main.temp).toFixed()}°{unit === 'imperial' ? 'F' : 'C'}</h1>
                <button onClick={toggleUnit}>{unit === 'imperial' ? '°C' : '°F'}</button>
              </>
            ) : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{convertTemperature(data.main.feels_like).toFixed()}°{unit === 'imperial' ? 'C' : 'F'}</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>

            

            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()}MPH</p> : null}
              <p> Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

