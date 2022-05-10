import axios from "axios";

export interface Flight {
  hex: string;
  reg_number: string;
  flag: string;
  lat: number;
  lng: number;
  alt: number;
  dir: number;
  speed: number;
  v_speed: number;
  flight_number: string;
  flight_icao: string;
  flight_iata: string;
  dep_icao: string;
  dep_iata: string;
  arr_icao: string;
  arr_iata: string;
  airline_icao: string;
  airline_iata: string;
  aircraft_icao: string;
  updated: number;
  status: string;
}

export interface FlightsResponse {
  response: Flight[];
  error?: any
}

export const getFlights = async () => {
  const resp = await axios.get<FlightsResponse>(`https://airlabs.co/api/v9/flights?api_key=${process.env.AIRLABS_API_KEY}`);

  if (resp.status !== 200) {
    throw new Error("Api Error: " + JSON.stringify(resp.data))
  }

  if (resp.data.error) {
    throw new Error("Api Error: " + JSON.stringify(resp.data.error))
  }

  return resp.data
};
