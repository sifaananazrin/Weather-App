import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric');  // default unit is Fahrenheit (°F)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
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

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=895284fb2d2c50a520ea537456963d9c`)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      setLocation('');
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'imperial' ? 'metric' : 'imperial'));
  };

  const convertTemperature = (temp) => {
    if (unit === 'imperial') {
      return temp; // Return the temperature in Fahrenheit as it is
    } else {
      return ((temp - 32) * 5) / 9; // Convert Fahrenheit to Celsius
    }
  };
  
  

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
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
                <button onClick={toggleUnit}>{unit === 'imperial' ? '°F' : '°C'}</button>
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
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
