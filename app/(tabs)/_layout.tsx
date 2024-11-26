import React from "react";
import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DataContext, DataProvider } from "@/context/dataContext/DataContext";

export default function _layout() {
  return (
    <DataProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "light-gray",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="home-variant"
                size={24}
                color="black"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="search" size={24} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="newPost"
          options={{
            title: "Nuevo Post",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="circle-plus" size={24} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: "Reels",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="movie" size={24} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle-sharp" size={24} color="black" />
            ),
          }}
        />
      </Tabs>
    </DataProvider>
  );
}
