import axios from 'axios';
import Toast from 'react-native-root-toast';
import React, { Component, ReactElement } from 'react';

import MapView, { LatLng, MapEvent, Marker } from 'react-native-maps';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, View } from 'react-native';

import styles from './styles';
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

    return <SafeAreaView>
      <StatusBar backgroundColor='#ffffff' barStyle='dark-content' />

      <View style={styles.header}>
        <Text style={styles.headerMessage}>
          Нажмите на любое место карты. Адрес будет отображен ниже.
        </Text>
      </View>

      <MapView
        style={styles.map}
        onPress={this._handlePress}
        initialRegion={{
          latitude: 50.000948,
          longitude: 36.234611,
          latitudeDelta: 0.0226,
          longitudeDelta: 0.0105,
        }}
      >
        {
          coordinates &&
          <Marker coordinate={coordinates} />
        }
      </MapView>

      <View style={styles.footer}>
        {
          !coordinates &&
          <Text style={styles.footerMesage}>
            Метка не установлена.
          </Text>
        }

        {
          isFetching &&
          <ActivityIndicator />
        }

        {
          !!address && !isFetching &&
          <Text style={styles.footerMesage}>
            {address}
          </Text>
        }
      </View>
    </SafeAreaView>;
  }


  private _handlePress = async (event: MapEvent): Promise<void> => {
    const { isFetching } = this.state;
    if (isFetching)
      return Toast.show('Дождитесь окончания загрузки!');

    try {
      this.setState({ coordinates: event.nativeEvent.coordinate, isFetching: true });
      const address = await this._fetchAddress(event.nativeEvent.coordinate);
      this.setState({ address });

    } catch (error) {
      if (error instanceof Error)
        Toast.show(error.message);
      else
        Toast.show('Произошла неизвестная ошибка!');
      this.setState({ address: '', coordinates: null });

    } finally {
      this.setState({ isFetching: false });
    }
  }


  private _fetchAddress = async (coordinates: LatLng): Promise<string> => {
    const response = await axios({
      method: 'GET',
      timeout: 3000,
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

    const city = components.city || '';
    const road = components.road || '';
    const house = components.house_number || '';
    const globalLocation = `${components.country} ${components.state || ''}`;

    return `${globalLocation}\n${city}${road ? ',' : ''} ${road} ${house}`;
  }
}



export default App;
