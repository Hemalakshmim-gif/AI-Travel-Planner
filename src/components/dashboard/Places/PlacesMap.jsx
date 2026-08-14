import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// =====================================================
// FIX DEFAULT LEAFLET MARKER
// =====================================================

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});


// =====================================================
// MAP CONTROLLER
// =====================================================

function MapController({ places }) {

  const map = useMap();

  if (!places.length) {
    return null;
  }

  const validPlaces = places.filter(
    (place) =>
      Number.isFinite(
        Number(place.latitude)
      ) &&
      Number.isFinite(
        Number(place.longitude)
      )
  );

  if (!validPlaces.length) {
    return null;
  }

  const bounds = validPlaces.map(
    (place) => [
      Number(place.latitude),
      Number(place.longitude),
    ]
  );

  map.fitBounds(bounds, {
    padding: [40, 40],
    maxZoom: 13,
  });

  return null;
}


// =====================================================
// PLACES MAP
// =====================================================

function PlacesMap({ places = [] }) {

  const validPlaces = Array.isArray(places)
    ? places.filter(
        (place) =>
          Number.isFinite(
            Number(place?.latitude)
          ) &&
          Number.isFinite(
            Number(place?.longitude)
          )
      )
    : [];


  // ===================================================
  // EMPTY STATE
  // ===================================================

  if (!validPlaces.length) {

    return (
      <div className="places-map-empty">

        <div>
          🗺️
        </div>

        <h3>
          Map unavailable
        </h3>

        <p>
          Location coordinates are not available
          for these places.
        </p>

      </div>
    );
  }


  // ===================================================
  // INITIAL CENTER
  // ===================================================

  const firstPlace =
    validPlaces[0];

  const center = [
    Number(firstPlace.latitude),
    Number(firstPlace.longitude),
  ];


  // ===================================================
  // MAP
  // ===================================================

  return (
    <div className="places-map-wrapper">

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="places-map"
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapController
          places={validPlaces}
        />


        {validPlaces.map(
          (place, index) => {

            const latitude =
              Number(place.latitude);

            const longitude =
              Number(place.longitude);

            const mapsUrl =
              `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;


            return (
              <Marker
                key={
                  place.id ||
                  `${place.name}-${index}`
                }
                position={[
                  latitude,
                  longitude,
                ]}
                icon={markerIcon}
              >

                <Popup>

                  <div className="map-popup">

                    <h3>
                      {place.name ||
                        "Unnamed Place"}
                    </h3>

                    <span>
                      {place.category ||
                        "Attraction"}
                    </span>

                    {place.address && (

                      <p>
                        {place.address}
                      </p>

                    )}

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📍 Open in Google Maps
                    </a>

                  </div>

                </Popup>

              </Marker>
            );
          }
        )}

      </MapContainer>


      {/* MAP LABEL */}

      <div className="places-map-label">

        <span className="map-live-dot"></span>

        Real Places

      </div>

    </div>
  );
}

export default PlacesMap;