import React, { useEffect, useRef, useState } from 'react';
import type geolonia from '@geolonia/embed';
import type maplibregl from 'maplibre-gl';

const camelCaseToSnakeCase = (input: string) => input.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`);

const EMBED_ATTRIBUTES = [
  'render3d',
  'bearing',
  'cluster',
  'clusterColor',
  'customMarker',
  'customMarkerOffset',
  'fullscreenControl',
  'geojson',
  'geolocateControl',
  'geoloniaControl',
  'gestureHandling',
  'hash',
  'key',
  'lang',
  'lat',
  'lng',
  'loader',
  'marker',
  'markerColor',
  'maxZoom',
  'minZoom',
  'navigationControl',
  'openPopup',
  'pitch',
  'plugin',
  'scaleControl',
  'simpleVector',
  'mapStyle',
  'zoom',
] as const;
type EmbedAttributeName = typeof EMBED_ATTRIBUTES[number];
type EmbedAttributes = { [key in EmbedAttributeName]?: string };

const EMBED_ATTRIBUTE_MAP: { [key: string]: string } = {
  'render3d': '3d',
  'mapStyle': 'style',
};

type GeoloniaMapProps = {
  /** Passed through to the wrapper div */
  className?: string;
  /** Passed through to the wrapper div */
  style?: React.CSSProperties;

  /** The underlying Map object that is in charge of rendering. */
  mapRef?: React.MutableRefObject<geolonia.Map>;
  /**
   * This callback is run after the Map has been instantiated. Use this callback
   * to perform custom initialization.
   */
  onLoad?: (map: geolonia.Map) => void;

  /**
   * If you require a custom embed API, provide the URL to it here.
   * The default is https://cdn.geolonia.com/v1/embed
   */
  embedSrc?: string;

  /**
   * Set your API key here. The default is set to `YOUR-API-KEY`.
   */
  apiKey?: string;

  initOptions?: Omit<maplibregl.MapboxOptions, 'container'>;
} & EmbedAttributes;

const DEFAULT_API_KEY = 'YOUR-API-KEY';
const DEFAULT_EMBED_SRC = (key?: string) => (
  `https://cdn.geolonia.com/v1/embed?geolonia-api-key=${key || DEFAULT_API_KEY}`
);

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

const ensureGeoloniaEmbed: (
  cb: () => void, apiKey?: string, embedSrc?: string
) => (false | (typeof window.geolonia))
  =
(cb, apiKey, embedSrc) => {
  // If geolonia is already loaded, then just return that now.
  if ('geolonia' in window) return window.geolonia;

  // If we can find the embed script tag, run the callback when it's done loading.
  const embedScriptTag = findEmbedScriptTag();
  if (embedScriptTag) {
    embedScriptTag.addEventListener('load', () => { cb(); });
    return false;
  }

  // We couldn't find the script tag, so we'll embed it ourselves.
  const newScript = document.createElement('script');
  newScript.onload = () => { cb(); };
  newScript.async = true;
  newScript.defer = true;
  newScript.id = 'geolonia-embed';
  document.head.appendChild(newScript);
  newScript.src = embedSrc || DEFAULT_EMBED_SRC(apiKey);
  return false;
};

const GeoloniaMap: React.FC<GeoloniaMapProps> = (props) => {
  const [ reloadSwitch, setReloadSwitch ] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [initialProps] = useState(props);

  useEffect(() => {
    const loaded = () => setReloadSwitch((sw) => sw + 1);
    const geolonia = ensureGeoloniaEmbed(loaded, initialProps.apiKey, initialProps.embedSrc);
    if (!geolonia) {
      // Geolonia Embed API is not loaded yet, so we'll wait for it to load.
      return;
    }

    const map = new geolonia.Map({
      container: mapContainer.current,
    });
    initialProps.mapRef && (initialProps.mapRef.current = map);
    initialProps.onLoad && (initialProps.onLoad(map));

    return () => {
      map.remove();
    };
  }, [ reloadSwitch, initialProps ]);

  const dataAttributes = Object.fromEntries(EMBED_ATTRIBUTES.map((v) => {
    if (typeof props[v] === 'undefined') return undefined;
    let dataAttributeName: string = v;
    if (v in EMBED_ATTRIBUTE_MAP) {
      dataAttributeName = EMBED_ATTRIBUTE_MAP[v];
    }
    dataAttributeName = camelCaseToSnakeCase(dataAttributeName);
    return [`data-${dataAttributeName}`, props[v]];
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
