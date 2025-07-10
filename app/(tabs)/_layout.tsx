import { IconSymbol } from '@/components/ui/IconSymbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="InicioScreen"
        options={{
          title: 'La Aterciopelada',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="api-demo"
        options={{
          title: 'API Demo',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wrench.and.screwdriver" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProductosScreen"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wrench.and.screwdriver" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}