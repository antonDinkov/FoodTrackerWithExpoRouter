import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Food Tracker',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="food-log"
          options={{
            title: 'Food Log',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="add-food-log"
          options={{
            title: 'Add Food Log',
            headerShown: true,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="edit-food-log"
          options={{
            title: 'Edit Food Log',
            headerShown: true,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="reports"
          options={{
            title: 'Reports',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: 'About',
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
