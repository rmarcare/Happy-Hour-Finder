// FIX: Changed from global window object to ES modules
import React from 'react';
// Destructure mock map components and icons from the global window object
import { MapPlaceholder, AdvancedMarker, InfoWindow } from './MapComponents';
import { UserLocationIcon, GlassIcon } from './icons/Icons';
import type { Special, Position } from '../types';

interface MapViewProps {
  specials: Special[];
  center: Position;
  userLocation: Position | null;
  selectedSpecialId: string | null;
  onSelectSpecial: (id: string | null) => void;
}

export const MapView = ({ specials, center, userLocation, selectedSpecialId, onSelectSpecial }: MapViewProps) => {
  const selectedSpecial = specials.find(s => s.id === selectedSpecialId);

  return (
    <div className="h-full w-full">
      <MapPlaceholder defaultCenter={center} defaultZoom={13}>
        {userLocation && (
          <AdvancedMarker title={"Your Location"} position={userLocation}>
            <UserLocationIcon className="w-8 h-8 text-blue-500" />
          </AdvancedMarker>
        )}
        {specials.map((special) => (
          <AdvancedMarker key={special.id} position={special.position} title={special.name}>
            <div 
              onClick={() => onSelectSpecial(special.id)}
              className="w-8 h-8 rounded-full bg-pink-500/80 border-2 border-pink-300 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <GlassIcon className="w-5 h-5 text-white" />
            </div>
          </AdvancedMarker>
        ))}
        {selectedSpecial && (
          <InfoWindow position={selectedSpecial.position}>
            <div className="bg-gray-800 text-white p-2 rounded-lg max-w-xs shadow-lg">
              <h3 className="font-bold text-pink-400 mb-1">{selectedSpecial.name}</h3>
              <p className="text-sm text-gray-300">{selectedSpecial.address}</p>
              <p className="text-xs text-gray-400 mt-2">{selectedSpecial.details}</p>
            </div>
          </InfoWindow>
        )}
      </MapPlaceholder>
    </div>
  );
};
