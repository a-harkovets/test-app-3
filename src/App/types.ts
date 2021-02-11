import { LatLng } from 'react-native-maps';


export type AppState = {
  address: string;
  isFetching: boolean;
  coordinates: LatLng;
};
