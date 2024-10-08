import { FIREBASE_AUTH } from "@/firebaseConfig";
import Theme from "@/hooks/Theme";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { User } from "firebase/auth";

const Layout = () => {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const router = useRouter();
  const segments = useSegments();

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>();

  // State to track if the layout is fully mounted
  const [layoutMounted, setLayoutMounted] = useState(false);

  // Firebase Auth State
  useEffect(() => {
    const handleAuthStateChanged = (user: User | null) => {
      console.log("OnAuthStateChanged", user);
      setUser(user);
      if (initializing) {
        setInitializing(false); // Stop the initialization process
      }
    };

    // Subscribe to Firebase auth state changes
    const subscriber = FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

    // Clean up subscription on unmount
    return () => subscriber();
  }, []);

  // Handle layout mounting logic
  useEffect(() => {
    if (!initializing) {
      setLayoutMounted(true); // Mark layout as mounted after initializing is done
    }
  }, [initializing]);

  // Handle navigation based on Firebase user state
  useEffect(() => {
    if (layoutMounted && !initializing) {
      const inAuthGroup = segments[0] === "(drawer)";

      if (user && !inAuthGroup) {
        router.replace("/autogenerate");
      } else if (!user && inAuthGroup) {
        router.replace("/");
      }
    }
  }, [layoutMounted, user, initializing, segments]);

  // Show a loading screen while Firebase is initializing
  if (initializing || !layoutMounted) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size={"large"} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "Login",
          title: "Login",
          statusBarStyle: colorScheme === "dark" ? "light" : "dark",
          statusBarColor: theme.colors.statusBar,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.statusBar,
          },
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
