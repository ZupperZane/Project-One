import { useWeather } from "../hooks/useWeather";

export default function Weather() {
  const { sarasota, thousandOaks, loading, error } = useWeather();

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section style={{ marginTop: "40px", textAlign: "center" }}>
      <h2 style={{ fontSize: "30px" }}>🌤 Weather</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {sarasota && (
          <div
            style={{
              background: "linear-gradient(to bottom, #e0f2fe, #f8fafc)",
              borderRadius: "15px",
              padding: "20px",
              width: "230px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h3>{sarasota.city}, FL</h3>

            <img
              src={`https://openweathermap.org/img/wn/${sarasota.icon}@2x.png`}
              alt={sarasota.description}
            />

            <p style={{ fontSize: "28px", fontWeight: "bold" }}>
              {sarasota.temperature}°F
            </p>

            <p style={{ textTransform: "capitalize" }}>
              {sarasota.description}
            </p>

            <p>Humidity: {sarasota.humidity}%</p>
            <p>Wind: {sarasota.windSpeed} mph</p>
          </div>
        )}

        {thousandOaks && (
          <div
            style={{
              background: "linear-gradient(to bottom, #9fceea, #f8fafc)",
              borderRadius: "15px",
              padding: "20px",
              width: "230px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h3>{thousandOaks.city}, CA</h3>

            <img
              src={`https://openweathermap.org/img/wn/${thousandOaks.icon}@2x.png`}
              alt={thousandOaks.description}
            />

            <p style={{ fontSize: "28px", fontWeight: "bold" }}>
              {thousandOaks.temperature}°F
            </p>

            <p style={{ textTransform: "capitalize" }}>
              {thousandOaks.description}
            </p>

            <p>Humidity: {thousandOaks.humidity}%</p>
            <p>Wind: {thousandOaks.windSpeed} mph</p>
          </div>
        )}
      </div>
    </section>
  );
}