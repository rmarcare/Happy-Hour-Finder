import React, { useEffect, useState } from 'react';
import { Map, AdvancedMarker, InfoWindow, Pin, useMap } from '@vis.gl/react-google-maps';
import type { HappyHourSpecial } from '../types';
import { GlassIcon, UserLocationIcon } from './icons/Icons';

interface MapViewProps {
    specials: HappyHourSpecial[];
    center: { lat: number, lng: number };
    userLocation: { lat: number, lng: number } | null;
    selectedSpecialId: string | null;
    onSelectSpecial: (id: string | null) => void;
}

const HappyHourMarker = ({ special, onClick }: {
    special: HappyHourSpecial,
    onClick: () => void,
}) => (
    <AdvancedMarker
        position={special.position}
        onClick={onClick}
        title={special.name}
    >
        <div className="w-8 h-8 rounded-full bg-pink-500/80 backdrop-blur-sm border-2 border-pink-300 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
            <GlassIcon className="w-5 h-5 text-white" />
        </div>
    </AdvancedMarker>
);

const UserMarker = ({ position }: {position: {lat: number, lng: number}}) => (
     <AdvancedMarker position={position} title={"Your Location"}>
        <UserLocationIcon className="w-8 h-8 text-blue-500" />
     </AdvancedMarker>
)


const MapViewContent = ({ 
    specials,
    center,
    userLocation,
    selectedSpecialId, 
    onSelectSpecial 
}: MapViewProps) => {
  const map = useMap();
  const selectedSpecial = specials.find(s => s.id === selectedSpecialId);

  useEffect(() => {
    if (map && selectedSpecial) {
      map.panTo(selectedSpecial.position);
      map.setZoom(15);
    } else if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(13);
    }
  }, [selectedSpecialId, map, userLocation]);

  return (
      <>
        {userLocation && <UserMarker position={userLocation} />}

        {specials.map((special) => (
          <HappyHourMarker
            key={special.id}
            special={special}
            onClick={() => onSelectSpecial(special.id)}
          />
        ))}

        {selectedSpecial && (
          <InfoWindow
            position={selectedSpecial.position}
            onCloseClick={() => onSelectSpecial(null)}
            pixelOffset={[0, -40]}
          >
            <div className="bg-gray-800 text-white p-2 rounded-lg max-w-xs shadow-lg">
                <h3 className="font-bold text-pink-400 mb-1">{selectedSpecial.name}</h3>
                <p className="text-sm text-gray-300">{selectedSpecial.address}</p>
                <p className="text-xs text-gray-400 mt-2">{selectedSpecial.details}</p>
            </div>
          </InfoWindow>
        )}
    </>
  )
}


export const MapView = (props: MapViewProps) => {
    // A dark mode map style from Google's style wizard
    const mapId = "b1e8a93a1c6e4e4";
    
    return (
        <div className="h-full w-full">
            <Map
                defaultCenter={props.center}
                defaultZoom={13}
                mapId={mapId}
                disableDefaultUI={true}
                gestureHandling={'greedy'}
            >
                <MapViewContent {...props} />
            </Map>
        </div>
    );
};