import { DrawerMenu } from "@/components/ui/DrawerMenu";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
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

      {/* Botón de menú (hamburguesa) flotante */}
      <TouchableOpacity
        onPress={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          top: insets.top + 6,
          right: 14,
          zIndex: 50,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.92)",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#2a241f",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 4,
        }}
        accessibilityLabel="Abrir menú"
      >
        <Ionicons name="menu" size={24} color="#d63384" />
      </TouchableOpacity>

      <DrawerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}