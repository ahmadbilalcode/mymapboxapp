import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken("sk.eyJ1IjoibXVoYW1tYWRxYXppIiwiYSI6ImNtZWkya2tzeTAzejQya3F0M212aWkxdmIifQ.y2688HHZhIoNAwRycWoByw");

export default function App() {
  useEffect(() => {
    MapboxGL.requestAndroidLocationPermissions();
  }, []);

  return (
    <View style={styles.page}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={10}
          centerCoordinate={[74.3587, 31.5204]} // Lahore, PK
        />
        <MapboxGL.PointAnnotation
          id="marker1"
          coordinate={[74.3587, 31.5204]}
        >
          <View />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
<<<<<<< HEAD


=======
>>>>>>> 102ad9594e3c0fb76dc800421cfae18fa61af6d5
