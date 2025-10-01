// import MapboxGL from "@rnmapbox/maps";
// import { useEffect, useRef, useState } from "react";
// import {
//     Alert,
//     FlatList,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const MAPBOX_PUBLIC_TOKEN =
//   "sk.eyJ1IjoibXVoYW1tYWRxYXppIiwiYSI6ImNtZWkya2tzeTAzejQya3F0M212aWkxdmIifQ.y2688HHZhIoNAwRycWoByw"; // ⚠️ use public token, not secret

// MapboxGL.setAccessToken(MAPBOX_PUBLIC_TOKEN);

// export default function App() {
//   const [searchStart, setSearchStart] = useState("");
//   const [searchDest, setSearchDest] = useState("");
//   const [coords, setCoords] = useState([73.0551, 33.6844]); // Default Islamabad
//   const [suggestionsStart, setSuggestionsStart] = useState([]);
//   const [suggestionsDest, setSuggestionsDest] = useState([]);
//   const [route, setRoute] = useState(null);
//   const [travelInfo, setTravelInfo] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     MapboxGL.requestAndroidLocationPermissions();
//   }, []);

//   // 🔎 Fetch autocomplete suggestions
//   const fetchSuggestions = async (text, type) => {
//     if (!text.trim()) {
//       type === "start" ? setSuggestionsStart([]) : setSuggestionsDest([]);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           text
//         )}.json?autocomplete=true&limit=5&access_token=${MAPBOX_PUBLIC_TOKEN}`
//       );
//       const data = await response.json();
//       if (data.features) {
//         type === "start"
//           ? setSuggestionsStart(data.features)
//           : setSuggestionsDest(data.features);
//       }
//     } catch (err) {
//       console.log("Error fetching suggestions:", err);
//     }
//   };

//   // 📍 Select Start or Destination
//   const handleSelectLocation = (place, type) => {
//     const [lng, lat] = place.geometry.coordinates;
//     if (type === "start") {
//       setSearchStart(place.place_name);
//       setSuggestionsStart([]);
//       setCoords([lng, lat]);
//     } else {
//       setSearchDest(place.place_name);
//       setSuggestionsDest([]);
//       setDestination([lng, lat]);
//     }
//     cameraRef.current?.flyTo([lng, lat], 1500);
//   };

//   const handleGo = async () => {
//     try {
//       const loc = await MapboxGL.locationManager.getLastKnownLocation();
//       if (!loc?.coords) {
//         Alert.alert("Location not found", "Please enable GPS.");
//         return;
//       }

//       if (!destination) {
//         Alert.alert("Missing Destination", "Please choose a destination.");
//         return;
//       }

//       const { longitude, latitude } = loc.coords;
//       const [destLng, destLat] = destination;

//       const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destLng},${destLat}?geometries=geojson&access_token=${"sk.eyJ1IjoibXVoYW1tYWRxYXppIiwiYSI6ImNtZWkya2tzeTAzejQya3F0M212aWkxdmIifQ.y2688HHZhIoNAwRycWoByw"}`
//       const res = await fetch(url);
//       const data = await res.json();

//       if (data.routes && data.routes.length > 0) {
//         const r = data.routes[0];
//         setRoute(r.geometry);

//         const km = (r.distance / 1000).toFixed(0);
//         const mins = Math.round(r.duration / 60);
//         setTravelInfo({ distance: km, time: `${mins} min` });

//         // Zoom to show whole route
//         cameraRef.current?.fitBounds(
//           [longitude, latitude],
//           [destLng, destLat],
//           100,
//           1000
//         );
//       }
//        }
//     catch (err) {
//       console.log("Error fetching route:", err);
//     }
//   };


//   const goToMyLocation = async () => {
//     try {
//       const loc = await MapboxGL.locationManager.getLastKnownLocation();
//       if (loc?.coords) {
//         const { longitude, latitude } = loc.coords;
//         setCoords([longitude, latitude]);
//         cameraRef.current?.flyTo([longitude, latitude], 1500);

//         // 🔎 Reverse Geocode to get place name
//         const response = await fetch(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${MAPBOX_PUBLIC_TOKEN}`
//         );
//         const data = await response.json();
//         if (data.features && data.features.length > 0) {
//           setSearchStart(data.features[0].place_name);
//         }
//       } else {
//         Alert.alert("Location not found", "Please enable GPS.");
//       }
//     } catch (err) {
//       console.log("Error getting location:", err);
//     }
//   };

//   return (
//   <View style={styles.page}>
//     {/* 🗺️ Map View sabse neeche */}
//     <MapboxGL.MapView style={styles.map}>
//       <MapboxGL.Camera
//         ref={cameraRef}
//         zoomLevel={(12)}
//         centerCoordinate={coords}
//       />
//       <MapboxGL.UserLocation visible={true} />
//       {destination && (
//         <MapboxGL.PointAnnotation id="dest" coordinate={destination} />
//       )}
//       {route && (
//         <MapboxGL.ShapeSource id="route" shape={route}>
//           <MapboxGL.LineLayer
//             id="routeLine"
//             style={{ lineColor: "blue", lineWidth: 5 }}
//           />
//         </MapboxGL.ShapeSource>
//       )}
//     </MapboxGL.MapView>

//     {/* 🔍 Start Search */}
//     <View style={styles.searchContainer}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="From (Start)..."
//         value={searchStart}
//         onChangeText={(txt) => {
//           setSearchStart(txt);
//           fetchSuggestions(txt, "start");
//         }}
//       />
//     </View>
//     {suggestionsStart.length > 0 && (
//       <FlatList
//         style={styles.suggestionsList}
//         data={suggestionsStart}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.suggestionItem}
//             onPress={() => handleSelectLocation(item, "start")}
//           >
//             <Text>{item.place_name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     )}

//     {/* 🔍 Destination Search */}
//     <View style={[styles.searchContainer, { top: 120 }]}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="To (Destination)..."
//         value={searchDest}
//         onChangeText={(txt) => {
//           setSearchDest(txt);
//           fetchSuggestions(txt, "dest"); // ✅ dest case sahi chal raha
//         }}
//       />
//       <TouchableOpacity style={styles.btn} onPress={handleGo}>
//         <Text style={{ color: "white", fontWeight: "bold" }}>Go</Text>
//       </TouchableOpacity>
//     </View>
//     {suggestionsDest.length > 0 && (
//       <FlatList
//         style={[styles.suggestionsList, { top: 170 }]}
//         data={suggestionsDest}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.suggestionItem}
//             onPress={() => handleSelectLocation(item, "dest")}
//           >
//             <Text>{item.place_name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     )}

//     {/* 🚗 Travel Info */}
//     {travelInfo && (
//       <View style={styles.travelInfo}>
//         <Text>
//           🚗 Distance: {travelInfo.distance} km | Time: {travelInfo.time}
//         </Text>
//       </View>
//     )}

//     {/* 📍 My Location Button */}
//     <TouchableOpacity style={styles.myLocationBtn} onPress={goToMyLocation}>
//       <Text style={{ color: "white", fontSize: 20 }}>📍</Text>
//     </TouchableOpacity>
//   </View>
// );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1 },
//   map: { flex: 1 },
//   searchContainer: {
//     position: "absolute",
//     top: 60,
//     left: 20,
//     right: 20,
//     flexDirection: "row",
//     gap: 10,
//     zIndex: 2,
//   },
//   searchInput: {
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 8,
//     flex: 1,
//     elevation: 5,
//   },
//   btn: {
//     backgroundColor: "#005eff",
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
//   suggestionsList: {
//     position: "absolute",
//     left: 20,
//     right: 20,
//     backgroundColor: "white",
//     borderRadius: 8,
//     elevation: 5,
//     zIndex: 3,
//     maxHeight: 200,
//   },
//   suggestionItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   travelInfo: {
//     position: "absolute",
//     bottom: 100,
//     left: 20,
//     right: 20,
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 8,
//     elevation: 5,
//   },
//   myLocationBtn: {
//     position: "absolute",
//     bottom: 40,
//     right: 20,
//     backgroundColor: "#005eff",
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 50,
//     elevation: 5,
//   },
// });