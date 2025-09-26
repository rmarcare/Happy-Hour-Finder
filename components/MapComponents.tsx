// Mock Map Components to stand in for @vis.gl/react-google-maps
// These are simplified placeholders for rendering in the preview.

// FIX: Changed from global window object to ES modules and added types
import React from 'react';
import type { Position } from '../types';

interface MapPlaceholderProps {
  children: React.ReactNode;
  defaultCenter: Position;
  defaultZoom: number;
}
// The Map component has been renamed to MapPlaceholder to avoid a naming conflict
// with the built-in JavaScript Map object. This was a critical bug fix.
export const MapPlaceholder = ({ children, defaultCenter }: MapPlaceholderProps) => (
  <div style={{ height: '100%', width: '100%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
    <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h3 className="text-xl font-bold">Map Placeholder</h3>
        <p>Center: {defaultCenter.lat.toFixed(2)}, {defaultCenter.lng.toFixed(2)}</p>
    </div>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {children}
    </div>
  </div>
);

export const APIProvider = ({ children }: { children: React.ReactNode; apiKey: string }) => <div>{children}</div>;
export const AdvancedMarker = ({ children, title }: { children: React.ReactNode; title: string; position: Position; }) => <div title={title} style={{ padding: '10px', position: 'absolute' }}>{children}</div>;
export const InfoWindow = ({ children }: { children: React.ReactNode; position: Position; }) => <div className="bg-gray-800 text-white p-2 rounded-lg max-w-xs shadow-lg border border-pink-500 m-2" style={{position: 'absolute' }}>{children}</div>;
