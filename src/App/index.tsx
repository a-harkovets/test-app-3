import axios from 'axios';
import React, { Component, ReactElement } from 'react';

import MapView, { LatLng, MapEvent, Marker } from 'react-native-maps';
import { ActivityIndicator, Dimensions, SafeAreaView, Text, View } from 'react-native';

import { AppState } from './types';



// Free key - 1 rps limit!
const API_KEY = 'db829887546545e1b2fbdfb1f6919360';



class App extends Component<{}, AppState> {
  state: AppState = {
    address: '',
    coordinates: null,
    isFetching: false,
  };


  render(): ReactElement {
    const { address, coordinates, isFetching } = this.state;

    const showPlaceholder = !coordinates;
    const showLoader = !!isFetching;
    const showAddress = !!address && !isFetching;

    return <SafeAreaView>
      <View style={{
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontSize: 16,
          textAlign: 'center',
          maxWidth: 320,
        }}>
          Нажмите на любое место карты. Адрес будет отображен ниже.
        </Text>
      </View>

      <View style={{
        height: Dimensions.get('screen').height - 360,
      }}>
        <MapView
          onPress={this._handlePress}
          initialRegion={{
            latitude: 50.000948,
            longitude: 36.234611,
            latitudeDelta: 0.0226,
            longitudeDelta: 0.0105,
          }}
          style={{
            height: '100%',
          }}
        >
          {
            coordinates &&
            <Marker
              coordinate={coordinates}
            />
          }
        </MapView>
      </View>

      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 210,
      }}>
        {
          showPlaceholder &&
          <Text style={{
            fontSize: 16,
          }}>
            Метка не установлена.
          </Text>
        }
        {
          showLoader &&
          <ActivityIndicator />
        }
        {
          showAddress &&
          <Text style={{
            fontSize: 16,
            textAlign: 'center',
            maxWidth: 360,
          }}>
            {address}
          </Text>
        }
      </View>
    </SafeAreaView>;
  }


  private _handlePress = async (event: MapEvent): Promise<void> => {
    this.setState({ coordinates: event.nativeEvent.coordinate });

    try {
      this.setState({ isFetching: true });
      const address = await this._fetchAddress(event.nativeEvent.coordinate);
      this.setState({ address });

    } catch (error) {
      // TODO: show toast.
      console.warn(error);

    } finally {
      this.setState({ isFetching: false });
    }
  }


  private _fetchAddress = async (coordinates: LatLng): Promise<string> => {
    const response = await axios({
      method: 'GET',
      timeout: 4000,
      url: 'https://api.opencagedata.com/geocode/v1/json',
      params: {
        key: API_KEY,
        language: 'ru',
        q: `${coordinates.latitude}+${coordinates.longitude}`,
      },
    });

    if (!response)
      throw new Error('Проблемы с подключением!');

    if (response.status !== 200)
      throw new Error('Не удалось загрузить адрес.');

    if (
      !response.data ||
      !Array.isArray(response.data.results) ||
      !response.data.results[0].components
    ) throw new Error('Ошибка определения адреса.');

    const [{ components }] = response.data.results;
    const addressFirstLine =
      `${components.country} ${components.state || ''} \n`;
    const addressSecondLine = `${components.city ? `${components.city},` : ''}`
      + ` ${components.road || ''} ${components.house_number || ''}`;

    return `${addressFirstLine}${addressSecondLine}`;
  }
}



export default App;
