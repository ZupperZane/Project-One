
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
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", width: "100%", justifyContent: "center" }}>
      {sarasota && (
        <div style={{
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "14px",
          padding: "16px 20px",
          minWidth: "180px",
          flex: 1,
          color: "#fff",
          textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>{sarasota.city}, FL</div>
          <img src={`https://openweathermap.org/img/wn/${sarasota.icon}@2x.png`} alt={sarasota.description} style={{ margin: "0 auto" }} />
          <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{sarasota.temperature}°F</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.85, textTransform: "capitalize" }}>{sarasota.description}</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.75, marginTop: "4px" }}>Humidity: {sarasota.humidity}%</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>Wind: {sarasota.windSpeed} mph</div>
        </div>
      )}
      {thousandOaks && (
        <div style={{
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "14px",
          padding: "16px 20px",
          minWidth: "180px",
          flex: 1,
          color: "#fff",
          textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>{thousandOaks.city}, CA</div>
          <img src={`https://openweathermap.org/img/wn/${thousandOaks.icon}@2x.png`} alt={thousandOaks.description} style={{ margin: "0 auto" }} />
          <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{thousandOaks.temperature}°F</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.85, textTransform: "capitalize" }}>{thousandOaks.description}</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.75, marginTop: "4px" }}>Humidity: {thousandOaks.humidity}%</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>Wind: {thousandOaks.windSpeed} mph</div>
        </div>
      )}
    </div>
  );
}