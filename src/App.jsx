import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  thunderstormSvg, drizzleSvg, rainSvg, snowSvg, atmosphereSvg, clearSvg, cloudSvg,
  } from './assets';
import './App.css';

//import thunderstormBg from './assets/imagen/thunderstormBg.jpg';
//import drizzleBg from './assets/imagen/drizzleBg.jpg';
//import rainBg from './assets/imagen/rainBg.jpg';
//import atmosphereBg from './assets/imagen/atmosphereBg.jpg';
//import clearBg from './assets/imagen/clearBg.jpg';
//import cloudBg from './assets/imagen/cloudBg.jpg';

const Key = '4d44aa24f9bf3e8b19319b85978d7ef2';
const url = 'https://api.openweathermap.org/data/2.5/weather';

const initialState = {
  latitude: 0,
  longitude: 0
};

const conditionCodes = {
  thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  clear: [800],
  clouds: [801, 802, 803, 804]
};

const icons = {
  thunderstorm: thunderstormSvg, drizzle: drizzleSvg, rain: rainSvg, snow: snowSvg,
  atmosphere: atmosphereSvg, clear: clearSvg, clouds: cloudSvg
};

//const backgrounds = {
 // thunderstorm: thunderstormBg, drizzle: drizzleBg, rain: rainBg, snow: snowBg,
  //atmosphere: atmosphereBg, clear: clearBg, clouds: cloudBg
//};//

function App() {
  const [coords, setCoords] = useState(initialState);
  const [weather, setWeather] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');  // Estado para almacenar el nombre de la ciudad
  const [searchCity, setSearchCity] = useState('');  // Estado para almacenar la ciudad a buscar

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      () => {
        console.log('No aceptas la ubicación');
      }
    );
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const query = searchCity
          ? `${url}?q=${searchCity}&appid=${Key}`
          : `${url}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${Key}`;
          
        const res = await axios.get(query);
        const keys = Object.keys(conditionCodes);
        const iconName = keys.find((key) => conditionCodes[key].includes(res.data.weather[0].id));

        setWeather({
          city: res.data.name,
          country: res.data.sys.country,
          icon: icons[iconName],
          main: res.data.weather[0].main,
          wind: res.data.wind.speed,
          clouds: res.data.clouds.all,
          pressure: res.data.main.pressure,
          temperature: parseInt(res.data.main.temp - 273.15),
          //background: backgrounds[iconName]  // Asigna el fondo según el clima
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    
    if ((coords.latitude !== 0 && coords.longitude !== 0) || searchCity) {
      fetchWeather();
    }
  }, [coords, searchCity]);

  const handleSearch = () => {
    setSearchCity(city);  // Actualizar la ciudad a buscar
    setLoading(true);
  };

  const temp = !toggle ? parseInt(weather.temperature * 9 / 5 + 32) : weather.temperature;

  return (
    <div 
      className='card' 
      style={{ backgroundImage: `url(${weather.background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {loading ? (
        <div className="loading-screen">Loading...</div>
      ) : (
        <>
          <h1 className='card__title'>Weather App</h1>
          <div>
            <input 
              type="text" 
              placeholder="Enter city name" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <h2 className='card__subtitle'>{weather.city}, {weather.country}</h2>
          <div className='card__body'>
            <img src={weather.icon} alt={weather.main} width={100} />
            <div className="card__info">
              <h3 className="card__main">{weather.main}</h3>
              <p className='card__wind-speed'>Wind speed {weather.wind} m/s</p>
              <p className='card__clouds'>Clouds {weather.clouds}%</p>
              <p className='card__pressure'>Pressure {weather.pressure} hPa</p>
            </div>
          </div>
          <h2 className='card__temperature'>{temp} {toggle ? '°F' : '°C'}</h2>
          <button onClick={() => setToggle(!toggle)}>
            Change to {!toggle ? 'F' : 'C'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
