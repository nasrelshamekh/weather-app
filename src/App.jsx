import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('Alexandria');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '2be8a50703df42c2aad151157261501';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=5&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
      setForecast(data.forecast.forecastday);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setCity(searchInput);
      fetchWeather(searchInput);
      setSearchInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (condition) => {
    const text = condition?.toLowerCase() || '';
    if (text.includes('rain')) return <CloudRain className="w-16 h-16" />;
    if (text.includes('cloud')) return <Cloud className="w-16 h-16" />;
    return <Sun className="w-16 h-16" />;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Weather</h1>
            </div>
            <nav className="hidden md:flex gap-6 text-white">
              <a href="#" className="hover:text-white/80">Home</a>
              <a href="#" className="hover:text-white/80">News</a>
              <a href="#" className="hover:text-white/80">Live cameras</a>
              <a href="#" className="hover:text-white/80">Photos</a>
              <a href="#" className="hover:text-white/80">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a city..."
                className="flex-1 px-6 py-4 rounded-lg text-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300 rounded-lg text-white text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white text-xl">Loading...</div>
        ) : weather ? (
          <div className="space-y-8">
            {/* Current Weather Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <p className="text-white/80 text-lg">{weather.location.localtime}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4 text-white">
                    {getWeatherIcon(weather.current.condition.text)}
                  </div>
                  <div className="text-7xl font-bold text-white mb-2">
                    {Math.round(weather.current.temp_c)}°C
                  </div>
                  <p className="text-2xl text-white/90">{weather.current.condition.text}</p>
                  <p className="text-white/70 mt-2">
                    Feels like {Math.round(weather.current.feelslike_c)}°C
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-white/70" />
                      <span className="text-white/70">Wind</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                      {weather.current.wind_kph} km/h
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-white/70" />
                      <span className="text-white/70">Humidity</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                      {weather.current.humidity}%
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-white/70" />
                      <span className="text-white/70">Visibility</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                      {weather.current.vis_km} km
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-5 h-5 text-white/70" />
                      <span className="text-white/70">Pressure</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                      {weather.current.pressure_mb} mb
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition"
                  >
                    <p className="text-white font-semibold mb-3">
                      {index === 0 ? 'Today' : getDayName(day.date)}
                    </p>
                    <div className="flex justify-center mb-3 text-white">
                      {getWeatherIcon(day.day.condition.text)}
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                      {Math.round(day.day.maxtemp_c)}°
                    </p>
                    <p className="text-white/70">
                      {Math.round(day.day.mintemp_c)}°
                    </p>
                    <p className="text-sm text-white/80 mt-2">
                      {day.day.condition.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/70">
          <p>© 2025 Weather App. Powered by WeatherAPI.com</p>
        </div>
      </footer>
    </div>
  );
};

export default WeatherApp;