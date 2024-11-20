import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;

const iconUrl = '/images/marker-icon.png';
const iconRetinaUrl = '/images/marker-icon-2x.png';
const shadowUrl = '/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export const defaultIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const selectedIcon = new L.Icon({
  iconUrl: '/images/marker-icon-red.png',
  iconRetinaUrl: '/images/marker-icon-red-2x.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
