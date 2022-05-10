const fetch = require("node-fetch")

export const getNearestFlight = async (lng, lat) => {
    const resp = await fetch(`https://airlabs.co/api/v9/flights?api_key=${process.env.AIRLABS_API_KEY}`)
    const flights = await resp.json()

    const flightsWithDistance = flights.map(flight => {
        return {
            ...flight,
            distance: Math.sqrt((lng - flight.lng) ** 2 + (lat - flight.lat) ** 2) * 111.3
        }
    })

    flightsWithDistance.sort((a, b) => a.distance - b.distance)

    return flightsWithDistance[0]
}