import {
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Theme from "@/hooks/Theme";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const Layout = () => {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const navigation = useNavigation(); // Get navigation object
  const window = useWindowDimensions();
  const isWebOrLargeScreen = window.width >= 768;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          statusBarStyle: colorScheme === "dark" ? "light" : "dark",
          statusBarColor: theme.colors.statusBar,
          title: "Settings",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={[
                {
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  elevation: 3,
                  padding: theme.spacing.small,
                  backgroundColor: theme.colors.iconButton,
                  borderRadius: theme.spacing.medium,
                  shadowColor: theme.colors.shadowColor,
                  shadowRadius: theme.spacing.small,
                },
              ]}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.icon} />
            </TouchableOpacity>
          ),
          headerTitle: "Settings",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.statusBar,
          },
          headerShown: !isWebOrLargeScreen,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
    </Stack>
  );
};

export default Layout;
