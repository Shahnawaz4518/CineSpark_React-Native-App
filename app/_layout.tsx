import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { SavedMoviesProvider } from "@/context/SavedMoviesContext";

export default function RootLayout() {
  return (
    <SavedMoviesProvider>
      <StatusBar hidden={true} />

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SavedMoviesProvider>
  );
}
