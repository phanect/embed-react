import React, { useEffect, useRef, useState } from 'react';
import type geolonia from '@geolonia/embed';

const camelCaseToSnakeCase = (input: string) => input.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase());

const EMBED_ATTRIBUTES = [
  'lat',
  'lng',
  'zoom',
  'bearing',
  'pitch',
  'hash',
  'marker',
  'markerColor',
  'openPopup',
  'customMarker',
  'customMarkerOffset',
  'gestureHandling',
  'navigationControl',
  'geolocateControl',
  'fullscreenControl',
  'scaleControl',
  'geoloniaControl',
  'geojson',
  'cluster',
  'clusterColor',
  'style',
  'lang',
  'plugin',
  'key',
  'apiUrl',
  'loader',
  'minZoom',
  'maxZoom',
  '3d',
] as const;
type EmbedAttributeName = typeof EMBED_ATTRIBUTES[number];
type EmbedAttributes = { [key in EmbedAttributeName]?: string };

type GeoloniaMapProps = {
  className?: string;
  style?: React.CSSProperties;
  
  mapRef?: React.MutableRefObject<geolonia.Map>;
  embedSrc?: string;
  apiKey?: string;
  initOptions?: any; // Omit<geolonia.MapOptions, 'container'>;
} & EmbedAttributes;

const DEFAULT_EMBED_SRC = 'https://cdn.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY';

const findEmbedScriptTag = () => {
  let elem: HTMLScriptElement | undefined = document.querySelector('script#geolonia-embed');
  if (elem) return elem;
  elem = Array.from(document.querySelectorAll('script')).find((el) => {
    if (el.src === '') return false;
    try {
      const url = new URL(el.src);
      return url.searchParams.has('geolonia-api-key');
    } catch (e: any) {
      if ((e as TypeError).message.includes('Invalid URL')) {
        return false;
      }
      throw e;
    }
  });
  return elem;
};

const ensureGeoloniaEmbed: (cb: () => void, embedSrc?: string) => false | (typeof window.geolonia) = (cb, embedSrc) => {
  // If geolonia is already loaded, then just return that now.
  if ('geolonia' in window) return window.geolonia;

  // If we can find the embed script tag, run the callback when it's done loading.
  const embedScriptTag = findEmbedScriptTag();
  if (embedScriptTag) {
    embedScriptTag.addEventListener('load', () => { cb() });
    return false;
  }

  // We couldn't find the script tag, so we'll embed it ourselves.
  const newScript = document.createElement('script');
  newScript.onload = () => { cb(); };
  newScript.async = true;
  newScript.defer = true;
  newScript.id = 'geolonia-embed';
  document.head.appendChild(newScript);
  newScript.src = embedSrc || DEFAULT_EMBED_SRC;
  return false;
};

const GeoloniaMap: React.FC<GeoloniaMapProps> = (props) => {
  const [ reloadSwitch, setReloadSwitch ] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loaded = () => setReloadSwitch((sw) => sw + 1);
    const geolonia = ensureGeoloniaEmbed(loaded, props.embedSrc);
    if (!geolonia) {
      // Geolonia Embed API is not loaded yet, so we'll wait for it to load.
      return;
    }

    // @ts-ignore
    const map = new geolonia.Map({
      container: mapContainer.current,
    });
    props.mapRef && (props.mapRef.current = map);
  }, [ reloadSwitch, props.embedSrc ]);

  const dataAttributes = Object.fromEntries(EMBED_ATTRIBUTES.map((v) => {
    if (typeof props[v] === 'undefined') return;
    return ['data-' + camelCaseToSnakeCase(v), props[v]];
  }).filter((v) => typeof v !== 'undefined'));

  return (
    <div
      className={props.className}
      ref={mapContainer}
      style={props.style}
      {...dataAttributes}
    >
      {props.children}
    </div>
  );
};

export default GeoloniaMap;
