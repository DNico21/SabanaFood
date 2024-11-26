import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useContext, useEffect, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { DataContext } from "@/context/dataContext/DataContext";
import MapView, { Marker } from "react-native-maps";

export default function NewPost() {
  const { newPost } = useContext(DataContext);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationText, setLocationText] = useState("");
  const [region, setRegion] = useState<any>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need access to your location to proceed");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const getAddress = async () => {
    if (location == null) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.coords?.latitude}&lon=${location.coords?.longitude}`
      );
      const data = await response.json();
      setLocationText(data.display_name);
    } catch (error) {
      console.error(error);
    }
  };

  // Simulamos el proceso de pago
  const handlePayment = () => {
    if (!selectedMenuItem) {
      Alert.alert("Seleccione un menú", "Debe seleccionar un ítem del menú para pagar.");
      return;
    }

    // Aquí simulamos la pasarela de pagos (en una aplicación real, se integraría con una API)
    Alert.alert("Pago exitoso", `Ha pagado por ${selectedMenuItem.name}. ¡Gracias por su compra!`);
  };

  const handleSavePost = async () => {
    if (!restaurantId || !selectedMenuItem) {
      Alert.alert("Falta información", "Debe seleccionar un restaurante y un menú para continuar.");
      return;
    }

    try {
      await newPost({
        address: locationText,
        description,
        image: "", // No se está utilizando foto por ahora
        date: new Date(),
        restaurantId,
      });

      Alert.alert("Pedido realizado", "¡Su pedido ha sido creado correctamente!");
      setDescription("");
      setLocationText("");
      setRestaurantId(null);
      setSelectedMenuItem(null);
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      Alert.alert("Error", "Hubo un problema al realizar el pedido.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10 }} contentContainerStyle={{ gap: 25 }}>
      {/* Selección de Restaurante */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Seleccionar Restaurante</Text>
      <TouchableOpacity onPress={() => setRestaurantId("1")}>
        <View style={{ backgroundColor: "#f0f0f0", padding: 15, marginBottom: 10, borderRadius: 5 }}>
          <Text>Restaurante Arcos</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setRestaurantId("2")}>
        <View style={{ backgroundColor: "#f0f0f0", padding: 15, marginBottom: 10, borderRadius: 5 }}>
          <Text>Restaurante Embarca</Text>
        </View>
      </TouchableOpacity>
      {/* Aquí puedes añadir más restaurantes */}

      {/* Selección de Menú */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Seleccionar Menú</Text>
      <TouchableOpacity onPress={() => setSelectedMenuItem({ name: "Hamburguesa", price: 15000 })}>
        <View style={{ backgroundColor: "#f0f0f0", padding: 15, marginBottom: 10, borderRadius: 5 }}>
          <Text>Hamburguesa</Text>
          <Text>$15000</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedMenuItem({ name: "Pizza", price: 20000 })}>
        <View style={{ backgroundColor: "#f0f0f0", padding: 15, marginBottom: 10, borderRadius: 5 }}>
          <Text>Pizza</Text>
          <Text>$20000</Text>
        </View>
      </TouchableOpacity>
      {/* Aquí puedes añadir más opciones de menú */}

      {/* Descripción */}
      <TextInput
        mode="outlined"
        multiline
        value={description}
        onChangeText={setDescription}
        numberOfLines={4}
        label="Descripción"
        placeholder="Escribe una descripción..."
        style={{ backgroundColor: "white", minHeight: 100 }}
      />

      {/* Ubicación */}
      <TouchableOpacity onPress={() => { getAddress(); setShowMap(true); }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MaterialIcons name="location-on" size={24} color="black" />
            <Text>Agregar Ubicación</Text>
          </View>
          <View>
            <MaterialIcons name="chevron-right" size={24} color="black" />
          </View>
        </View>
        <Text>{locationText}</Text>
      </TouchableOpacity>

      {/* Mapa */}
      {showMap && region && (
        <View style={{ height: 300, marginVertical: 20 }}>
          <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation={true}>
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Mi ubicación" description="Aquí estoy" draggable />
          </MapView>
        </View>
      )}

      {/* Botón de Pago */}
      <Button onPress={handlePayment} style={{ backgroundColor: "#007BFF", padding: 15 }}>
        <Text style={{ color: "white" }}>Pagar</Text>
      </Button>

      {/* Botón de Guardar Pedido */}
      <Button onPress={handleSavePost} style={{ backgroundColor: "#28a745", padding: 15, marginTop: 10 }}>
        <Text style={{ color: "white" }}>Confirmar Pedido</Text>
      </Button>
    </ScrollView>
  );
}
