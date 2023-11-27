import React, { useEffect, useState } from "react";
import "./App.css";

interface IData {
  location: {
    country: string;
    region: string;
    name: string;
    localtime: string;
  };
  current: {
    humidity: number;
    precip_mm: number;
    gust_kph: number;
    temp_c: number;
    feelslike_c: number;
  };
}

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [data, setData] = useState<IData>({
    location: { country: "", region: "", name: "", localtime: "" },
    current: {
      humidity: 0,
      precip_mm: 0,
      gust_kph: 0,
      temp_c: 0,
      feelslike_c: 0,
    },
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  useEffect(() => {
    console.log("Sua posição atual é:");
    console.log("Latitude : " + coords.latitude);
    console.log("Longitude: " + coords.longitude);
    if (coords) {
      fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${coords.latitude},${coords.longitude}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setData((prevState) => data);
          console.log("Weather data:", data);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }
  }, [coords]);

  function success(pos: any) {
    setCoords((prevState) => pos.coords);
  }

  function error(err: any) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  }

  return (
    <div className="App">
      <header className="App-header">
        <section className="App-form">
          <input placeholder="Pesquisar por nome da cidade"></input>
          <button type="submit">Buscar</button>
        </section>
      </header>
      <main className="App-body">
        <section>
          {data && (
            <>
              <section>
                <text>{data.location.localtime}</text>
                <br />
                <text>
                  {data.location.name}, {data.location.region},{" "}
                  {data.location.country}
                </text>
                <br />
              </section>
              <section>
                <h5>Clima atual da sua localização</h5>
                <text>{data.current.temp_c}</text>
                <br />
                <text>{data.current.humidity}</text>
                <br />
                <text>{data.current.gust_kph}</text>
                <br />
                <text>{data.current.precip_mm}</text>
                <br />
                <text>{data.current.feelslike_c}</text>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
