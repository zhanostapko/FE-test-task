import React, { useCallback, useRef, useMemo, useEffect } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useAppSelector } from "@/store/hooks";
import { StatsBar } from "../StatBar/StatsBar";
import { secToHM } from "@/lib/utils";

type MapProps = {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  options?: google.maps.MapOptions;
};

const DEFAULT_CENTER = { lat: 56.9496, lng: 24.1052 };

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

export const Map: React.FC<MapProps> = ({ zoom = 10, options }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const route = useAppSelector((state) => state.route.current);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY!,
  });

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      if (route?.polyline.length) {
        const bounds = new google.maps.LatLngBounds();
        route?.polyline.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds);
      } else {
        map.setCenter(DEFAULT_CENTER);
        map.setZoom(10);
      }
    },
    [route?.polyline]
  );

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      ...options,
    }),
    [options]
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (route?.polyline?.length) {
      const bounds = new google.maps.LatLngBounds();
      route.polyline.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds);
    } else {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(10);
    }
  }, [route?.unitId, route?.polyline]);

  if (!isLoaded) return null;

  return (
    <>
      {route && (
        <div className="  flex flex-col justify-between">
          <div className="h-[300px] my-6">
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={zoom}
              options={mapOptions}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {route?.polyline?.length > 1 && (
                <Polyline
                  path={route?.polyline}
                  options={{ strokeWeight: 4, strokeOpacity: 0.8 }}
                />
              )}
            </GoogleMap>
          </div>
          <StatsBar
            items={[
              { value: route.distanceKm, label: "Km driven" },
              { value: secToHM(route.drivingTimeSec), label: "Driving time" },
              { value: secToHM(route.idlingTimeSec), label: "Idling time" },
            ]}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(Map);
