import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#ede9e6",
          borderTopWidth: 1,
          shadowColor: "#2a241f",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarActiveTintColor: "#d63384",
        tabBarInactiveTintColor: "#8b7d74",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProductosScreen"
        options={{
          title: "Productos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="bag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ServiciosScreen"
        options={{
          title: "Servicios",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="star.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="GaleriaScreen"
        options={{
          title: "Galería",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="photo.on.rectangle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}