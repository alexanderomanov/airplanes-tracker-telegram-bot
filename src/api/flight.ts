import { getFlights } from "./airlabs";

export const getNearestFlight = async (lng, lat) => {
  const flights = await getFlights();

  const flightsWithDistance = flights.response.map((flight) => {
    return {
      ...flight,
      distance: Math.sqrt((lng - flight.lng) ** 2 + (lat - flight.lat) ** 2) * 111.3,
    };
  });

  flightsWithDistance.sort((a, b) => a.distance - b.distance);

  return flightsWithDistance[0];
};
