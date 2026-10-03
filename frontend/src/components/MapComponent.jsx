import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Restore default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function MapComponent({ mapData }) {
  if (!mapData || !mapData.geometry) return null

  const { waypoints, geometry } = mapData
  const bounds = L.latLngBounds(geometry) // Fit the map to the route geometry

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
      <MapContainer 
        bounds={bounds} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route polyline */}
        <Polyline positions={geometry} color="blue" weight={4} opacity={0.7} />

        {/* Waypoint markers (current location, pickup, dropoff) */}
        {waypoints.current && (
          <Marker position={waypoints.current}>
            <Popup>Current Location</Popup>
          </Marker>
        )}
        {waypoints.pickup && (
          <Marker position={waypoints.pickup}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {waypoints.dropoff && (
          <Marker position={waypoints.dropoff}>
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}