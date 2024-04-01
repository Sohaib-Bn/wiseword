import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/UseGealocation";
import { useUrlPosition } from "../hooks/UseUrlPosition";

import Button from "./Button";
import styles from "./Map.module.css";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const { mapLat, mapLng } = useUrlPosition();

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if ((mapLat, mapLng)) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={() => getPosition()}>
          {isLoadingPosition ? "loading..." : "use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter mapPosition={mapPosition} />
        <ClickDetect />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ mapPosition }) {
  const map = useMap();
  map.setView(mapPosition);
  return null;
}

function ClickDetect() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });

  return null;
}

export default Map;
