import { useEffect, useState } from "react";

type CityWeather = {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
};

type UseWeatherReturn = {
  sarasota: CityWeather | null;
  thousandOaks: CityWeather | null;
  loading: boolean;
  error: string;
};

const API_KEY = "b68017ae7bfa030893a27f1b67966305";

export function useWeather(): UseWeatherReturn {
  const [sarasota, setSarasota] = useState<CityWeather | null>(null);
  const [thousandOaks, setThousandOaks] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const sarasotaResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Sarasota,US&units=imperial&appid=${API_KEY}`
        );

        const thousandOaksResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Thousand Oaks,US&units=imperial&appid=${API_KEY}`
        );

        if (!sarasotaResponse.ok || !thousandOaksResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const sarasotaData = await sarasotaResponse.json();
        const thousandOaksData = await thousandOaksResponse.json();

        const formatWeather = (data: any): CityWeather => ({
          city: data.name,
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          icon: data.weather[0].icon,
        });

        setSarasota(formatWeather(sarasotaData));
        setThousandOaks(formatWeather(thousandOaksData));
      } catch (err) {
        console.error(err);
        setError("Unable to load weather right now.");
      } finally {
        setLoading(false);
      }
    };

    if (!API_KEY) {
      setError("Missing weather API key.");
      setLoading(false);
      return;
    }

    fetchWeather();
  }, []);

  return { sarasota, thousandOaks, loading, error };
}
