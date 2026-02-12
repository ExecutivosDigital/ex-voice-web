"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  fullData: GeolocationData | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    fullData: null,
    error: null,
    isLoading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocalização não é suportada pelo seu navegador";
      setGeolocation({
        latitude: null,
        longitude: null,
        fullData: null,
        error: errorMsg,
        isLoading: false,
      });
      toast.error(errorMsg);
      return;
    }

    setGeolocation((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { 
          latitude, 
          longitude, 
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed
        } = position.coords;

        const fullData: GeolocationData = {
          latitude,
          longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          speed,
          timestamp: position.timestamp,
        };

        setGeolocation({
          latitude,
          longitude,
          fullData,
          error: null,
          isLoading: false,
        });

        // Console completo com todos os dados disponíveis
        console.log("=== DADOS COMPLETOS DE GEOLOCALIZAÇÃO ===");
        console.log("📍 Coordenadas:", {
          latitude,
          longitude,
        });
        console.log("🎯 Precisão:", {
          accuracy: `${accuracy} metros`,
          altitudeAccuracy: altitudeAccuracy ? `${altitudeAccuracy} metros` : "Não disponível",
        });
        console.log("📊 Informações adicionais:", {
          altitude: altitude ? `${altitude} metros` : "Não disponível",
          heading: heading !== null ? `${heading}° (direção)` : "Não disponível",
          speed: speed !== null ? `${speed} m/s` : "Não disponível",
        });
        console.log("⏰ Timestamp:", {
          timestamp: position.timestamp,
          dataHora: new Date(position.timestamp).toLocaleString("pt-BR"),
        });
        console.log("📦 Objeto completo position.coords:", position.coords);
        console.log("📦 Objeto completo position:", position);
        console.log("==========================================");
      },
      (error) => {
        let errorMsg = "Erro ao obter localização";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Permissão de localização negada pelo usuário";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Informações de localização indisponíveis";
            break;
          case error.TIMEOUT:
            errorMsg = "Tempo de espera para obter localização expirado";
            break;
          default:
            errorMsg = "Erro desconhecido ao obter localização";
            break;
        }

        setGeolocation({
          latitude: null,
          longitude: null,
          fullData: null,
          error: errorMsg,
          isLoading: false,
        });
        toast.error(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    ...geolocation,
    requestLocation,
  };
}

export type { GeolocationData };
