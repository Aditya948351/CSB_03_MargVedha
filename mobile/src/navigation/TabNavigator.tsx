import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Shield, LayoutDashboard, Folder, Wrench } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import RemediationScreen from '../screens/RemediationScreen';

import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          letterSpacing: 1,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Projects" 
        component={ProjectsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Folder color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Remediation" 
        component={RemediationScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
