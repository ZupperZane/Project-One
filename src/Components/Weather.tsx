<<<<<<< HEAD
export function Weather(){
    return (
 <div>
    Weather
 </div>
    )
=======

import { useWeather } from "../hooks/useWeather";

export default function Weather() {
  const { sarasota, thousandOaks, loading, error } = useWeather();

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section>
      <h2>Weather</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        {sarasota && (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              minWidth: "220px",
            }}
          >
            <h3>{sarasota.city}, FL</h3>
            <img
              src={`https://openweathermap.org/img/wn/${sarasota.icon}@2x.png`}
              alt={sarasota.description}
            />
            <p>{sarasota.temperature}°F</p>
            <p>{sarasota.description}</p>
            <p>Humidity: {sarasota.humidity}%</p>
            <p>Wind: {sarasota.windSpeed} mph</p>
          </div>
        )}  

        {thousandOaks && (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              minWidth: "220px",
            }}
          >
            <h3>{thousandOaks.city}, CA</h3>
            <img
              src={`https://openweathermap.org/img/wn/${thousandOaks.icon}@2x.png`}
              alt={thousandOaks.description}
            />
            <p>{thousandOaks.temperature}°F</p>
            <p>{thousandOaks.description}</p>
            <p>Humidity: {thousandOaks.humidity}%</p>
            <p>Wind: {thousandOaks.windSpeed} mph</p>
          </div>
        )}
      </div>
    </section>
  );
>>>>>>> origin/weather
}