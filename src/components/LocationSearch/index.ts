export { default as LocationSearchComponent } from './LocationSearchComponent';
export { default as LocationSearchExample } from './LocationSearchExample';

// Export types
export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
  formattedAddress?: string;
}

export interface LocationSearchComponentProps {
  apiKey: string;
  onLocationSelect: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  showMap?: boolean;
  initialLocation?: LocationData | null;
}
