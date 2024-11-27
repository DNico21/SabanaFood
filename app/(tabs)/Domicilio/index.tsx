import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { DataContext } from "@/context/dataContext/DataContext";

export default function NewPost() {
  const { newPost } = useContext(DataContext);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationText, setLocationText] = useState("");
  const [region, setRegion] = useState<any>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("ubicacion"); // "ubicacion" o "restaurante"
  const [paymentMethod, setPaymentMethod] = useState("efectivo"); // "efectivo" o "tarjeta"

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "We need access to your location to proceed"
        );
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

  const addToCart = (item: any) => {
    setCart((prev) => [...prev, item]);
    Alert.alert("Item añadido", `${item.name} ha sido añadido al carrito`);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrder = () => {
    if (cart.length === 0) {
      Alert.alert(
        "Carrito vacío",
        "Agrega algún ítem al carrito antes de realizar el pedido."
      );
      return;
    }
    setShowModal(true);
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

      {/* Selección de Menú */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Seleccionar Menú</Text>
      <TouchableOpacity onPress={() => addToCart({ name: "Hamburguesa", price: 15000 })}>
        <View style={{ backgroundColor: "#f0f0f0", padding: 15, marginBottom: 10, borderRadius: 5 }}>
          <Text>Hamburguesa</Text>
          <Text>$15000</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => addToCart({ name: "Pizza", price: 20000 })}>
        <View style={{ backgroundColor: "#f0f0f0", padding: 15, marginBottom: 10, borderRadius: 5 }}>
          <Text>Pizza</Text>
          <Text>$20000</Text>
        </View>
      </TouchableOpacity>

      {/* Mostrar el carrito */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Carrito</Text>
      {cart.length > 0 ? (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              <Text>{item.name} - ${item.price}</Text>
              <TouchableOpacity onPress={() => removeFromCart(index)}>
                <Text style={{ color: "red" }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No hay productos en el carrito</Text>
      )}

      {/* Botón para realizar pedido */}
      <Button onPress={handleOrder} style={{ backgroundColor: "#28a745", padding: 15, marginTop: 20 }}>
        <Text style={{ color: "white" }}>Realizar Pedido</Text>
      </Button>

      {/* Modal para opciones de pedido */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: "90%", backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Opciones de Pedido</Text>

            {/* Selección de dirección */}
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>¿Dónde deseas pagar?</Text>
            {selectedOption === "ubicacion" && (
              <TouchableOpacity onPress={() => { getAddress(); setShowModal(true); }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text>Agregar Ubicación</Text>
                </View>
                <Text>{locationText}</Text>
              </TouchableOpacity>
            )}

            {/* Método de pago */}
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 }}>Método de Pago</Text>
            <TouchableOpacity onPress={() => setPaymentMethod("efectivo")}>
              <Text style={{ padding: 10, backgroundColor: paymentMethod === "efectivo" ? "#d1e7dd" : "#f8f9fa" }}>
                Efectivo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaymentMethod("tarjeta")}>
              <Text style={{ padding: 10, backgroundColor: paymentMethod === "tarjeta" ? "#d1e7dd" : "#f8f9fa" }}>
                Tarjeta de crédito/débito
              </Text>
            </TouchableOpacity>

            {/* Botones del modal */}
            <Button onPress={() => setShowModal(false)} style={{ marginTop: 20, backgroundColor: "#28a745" }}>
              Confirmar Pedido
            </Button>
            <Button onPress={() => setShowModal(false)} mode="text" color="red">
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
