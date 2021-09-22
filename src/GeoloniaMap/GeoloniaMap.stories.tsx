import { Meta } from '@storybook/react';
import React from "react";
import GeoloniaMap from "./GeoloniaMap";
import './GeoloniaMap.stories.css';

export default {
  title: "GeoloniaMap",
} as Meta;

export const Defaults = () => (
  <GeoloniaMap
    className="geolonia"
  />
);

export const WithMarker = () => (
  <GeoloniaMap
    className="geolonia"
    lat="35.681236"
    lng="139.767125"
    zoom="16"
    markerColor="#555"
  />
)

export const WithPopup = () => (
  <GeoloniaMap
    className="geolonia"
    lat="35.681236"
    lng="139.767125"
    zoom="16"
  >
    <h1>Hello!</h1>
  </GeoloniaMap>
)
