"use client"

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { mapData } from '@/lib/siteData';

interface MapContainerStyle {
    width: string;
    height: string;
    borderRadius: string;
    transition: string;
}

interface MapCenter {
    lat: number;
    lng: number;
}

const containerStyle: MapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '1em',
    transition: 'ease-out 0.16s',
};

const center: MapCenter = {
    lat: mapData.mainData.lat,
    lng: mapData.mainData.lng
};

const Map: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const [, setMap] = React.useState<google.maps.Map | null>(null);

    const onLoad = React.useCallback(function callback(map: google.maps.Map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

    return isLoaded ? (
        <div className="container max-w-[1320px] mx-auto px-5 md:px-10 xl:px-5 mt-14">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
            </GoogleMap>
        </div>
    ) : null;
};

export default Map;