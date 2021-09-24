import { Meta } from '@storybook/react';
import React from 'react';
import GeoloniaMap from './GeoloniaMap';
import './GeoloniaMap.stories.css';

export default {
  title: 'GeoloniaMap',
} as Meta;

export const Defaults = () => (
  <GeoloniaMap
    className="geolonia"
    apiKey="YOUR-API-KEY"
  />
);

export const Marker = () => (
  <GeoloniaMap
    className="geolonia"
    lat="35.681236"
    lng="139.767125"
    zoom="16"
    markerColor="#555"
  />
);

export const MarkerWithPopup = () => (
  <GeoloniaMap
    className="geolonia"
    lat="35.681236"
    lng="139.767125"
    zoom="12"
  >
    <h3>Hello World!</h3>
  </GeoloniaMap>
);

export const AllControls = () => (
  <GeoloniaMap
    className="geolonia"
    lat="34.704395"
    lng="135.494771"
    zoom="14"
    navigationControl="on"
    geolocateControl="on"
    fullscreenControl="on"
    scaleControl="on"
  >
    グランフロント
  </GeoloniaMap>
);

export const GeoJSONWithSimpleStyle = () => (
  <GeoloniaMap
    className="geolonia"
    lat="33.897"
    lng="135.639"
    zoom="10"
    geojson="https://raw.githubusercontent.com/wakayama-pref-org/list-of-public-facilities/master/JSON/list-of-public-facilities.geojson"
    marker="off"
  />
);

export const VectorTileWithSimpleStyle = () => (
  <GeoloniaMap
    className="geolonia"
    simpleVector="https://tileserver.geolonia.com/embed-simple-vector-sample/tiles.json"
    marker="off"
  />
);

export const Enable3D = () => (
  <GeoloniaMap
    className="geolonia"
    mapStyle="geolonia/basic"
    lat="35.68116"
    lng="139.764992"
    zoom="16"
    render3d="on"
  />
);

export const Disable3D = () => (
  <GeoloniaMap
    className="geolonia"
    mapStyle="geolonia/gsi"
    lat="35.68116"
    lng="139.764992"
    zoom="16"
    render3d="off"
  />
);
