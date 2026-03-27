
import { useWeather } from "../hooks/useWeather";

export default function Weather() {
  const { sarasota, thousandOaks, loading, error } = useWeather();

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading weather...</div>;
  }

  if (error) {
    return <div className="text-center text-lg">{error}</div>;
  }

  return (
    <section className="w-full">
      <div className="mt-2 grid justify-items-center gap-4 sm:grid-cols-2">
        {sarasota && (
          <div className="w-full max-w-xs rounded-xl border border-base-300 bg-base-100 p-4 text-center">
            <h3 className="text-xl font-bold">{sarasota.city}, FL</h3>
            <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${sarasota.icon}@2x.png`}
              alt={sarasota.description}
            />
            <p className="text-3xl font-extrabold">{sarasota.temperature}F</p>
            <p className="text-lg capitalize">{sarasota.description}</p>
            <p className="text-base">Humidity: {sarasota.humidity}%</p>
            <p className="text-base">Wind: {sarasota.windSpeed} mph</p>
          </div>
        )}

        {thousandOaks && (
          <div className="w-full max-w-xs rounded-xl border border-base-300 bg-base-100 p-4 text-center">
            <h3 className="text-xl font-bold">{thousandOaks.city}, CA</h3>
            <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${thousandOaks.icon}@2x.png`}
              alt={thousandOaks.description}
            />
            <p className="text-3xl font-extrabold">{thousandOaks.temperature}F</p>
            <p className="text-lg capitalize">{thousandOaks.description}</p>
            <p className="text-base">Humidity: {thousandOaks.humidity}%</p>
            <p className="text-base">Wind: {thousandOaks.windSpeed} mph</p>
          </div>
        )}
      </div>
    </section>
  );
}
