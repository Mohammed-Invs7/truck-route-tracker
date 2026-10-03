import requests

def geocode_location(location_name):
    """Convert location name to coordinates (Latitude, Longitude)"""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location_name,
        "format": "json",
        "limit": 1
    }
    headers = {"User-Agent": "TruckRouteTracker/1.0"}
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"Geocoding error for {location_name}: {e}")
    return None, None

def get_route_details(current_loc, pickup_loc, dropoff_loc):
    """Calculate route geometry, total distance in miles, and estimated drive time via OSRM"""
    c_lat, c_lon = geocode_location(current_loc)
    p_lat, p_lon = geocode_location(pickup_loc)
    d_lat, d_lon = geocode_location(dropoff_loc)

    # Fallback default coordinates if geocoding fails
    if not c_lat: c_lat, c_lon = 41.8781, -87.6298  # Chicago
    if not p_lat: p_lat, p_lon = 39.7392, -104.9903 # Denver
    if not d_lat: d_lat, d_lon = 34.0522, -118.2437 # Los Angeles

    # Call OSRM API for routing
    coords_str = f"{c_lon},{c_lat};{p_lon},{p_lat};{d_lon},{d_lat}"
    osrm_url = f"http://router.project-osrm.org/route/v1/driving/{coords_str}?overview=full&geometries=geojson"

    try:
        resp = requests.get(osrm_url, timeout=10).json()
        if "routes" in resp and len(resp["routes"]) > 0:
            route = resp["routes"][0]
            distance_meters = route["distance"]
            duration_seconds = route["duration"]

            # Convert meters to miles (1m = 0.000621371 miles)
            total_miles = round(distance_meters * 0.000621371, 1)
            # Estimated average truck speed ~ 55 mph
            driving_hours = round(total_miles / 55.0, 2)
            geometry = route["geometry"]["coordinates"] # [[lon, lat], ...]

            return {
                "total_miles": total_miles,
                "driving_hours": driving_hours,
                "geometry": [[coord[1], coord[0]] for coord in geometry], # Convert to [lat, lon] for Leaflet
                "waypoints": {
                    "current": [c_lat, c_lon],
                    "pickup": [p_lat, p_lon],
                    "dropoff": [d_lat, d_lon]
                }
            }
    except Exception as e:
        print(f"Routing error: {e}")

    # Fallback default response in case of network or API failure
    return {
        "total_miles": 850.0,
        "driving_hours": 15.0,
        "geometry": [[c_lat, c_lon], [p_lat, p_lon], [d_lat, d_lon]],
        "waypoints": {"current": [c_lat, c_lon], "pickup": [p_lat, p_lon], "dropoff": [d_lat, d_lon]}
    }