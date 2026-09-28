"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type Props = { mode: "aging" | "mothers" };

type MeshFeature = {
  type: "Feature";
  properties?: { key_code?: string; problem?: boolean; name?: string };
  geometry: { type: string; coordinates: unknown };
};

type MeshCollection = {
  type: "FeatureCollection";
  features: MeshFeature[];
};

export default function TokyoMeshMap({ mode }: Props) {
  const mapNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | null = null;

    const loadMap = async () => {
      const L = await import("leaflet");
      const baseUrl = import.meta.env.BASE_URL ?? "/";
      const response = await fetch(`${baseUrl}tokyo_mesh1000.geojson`);
      const data = (await response.json()) as MeshCollection;
      if (disposed || !mapNode.current) return;

      map = L.map(mapNode.current, {
        center: [35.69, 139.76],
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const wardFeatures = data.features.filter((feature) => feature.properties?.name);
      const meshFeatures = data.features.filter((feature) => feature.properties?.key_code);
      const problemKeys = mode === "aging" ? new Set(["53394626"]) : new Set<string>();

      const meshLayer = L.geoJSON(
        { type: "FeatureCollection", features: meshFeatures } as never,
        {
          style: (feature) => {
            const key = String(feature?.properties?.key_code ?? "");
            const problem = problemKeys.has(key);
            return {
              color: problem ? "#1f5fc7" : "#697989",
              weight: problem ? 1.5 : 0.45,
              opacity: problem ? 0.95 : 0.46,
              fillColor: problem ? "#2f73dc" : "#77818e",
              fillOpacity: problem ? 0.62 : 0.18,
            };
          },
          onEachFeature: (feature, layer) => {
            const key = String(feature?.properties?.key_code ?? "");
            if (problemKeys.has(key)) {
              layer.bindTooltip("Problem mesh · " + key, { sticky: true, direction: "top" });
            }
          },
        },
      ).addTo(map);

      L.geoJSON(
        { type: "FeatureCollection", features: wardFeatures } as never,
        {
          style: {
            color: "#344c61",
            weight: 1.6,
            opacity: 0.82,
            fillOpacity: 0,
          },
        },
      ).addTo(map);

      if (meshLayer.getBounds().isValid()) {
        map.fitBounds(meshLayer.getBounds(), { padding: [15, 15] });
      }
      window.setTimeout(() => map?.invalidateSize(), 60);
    };

    loadMap().catch(() => undefined);

    return () => {
      disposed = true;
      map?.remove();
      map = null;
    };
  }, [mode]);

  return <div ref={mapNode} className="leaflet-map" aria-label="OpenStreetMap with 1 km mesh overlay" />;
}
