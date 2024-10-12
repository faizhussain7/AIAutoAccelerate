import HeaderWithLoopingSVGs from "@/components/Header";
import Theme from "@/hooks/Theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const router = useRouter(); // Get navigation object
  const window = useWindowDimensions();
  const isWebOrLargeScreen = window.width >= 768;

  return (
    <Stack
      screenOptions={{
        statusBarStyle: colorScheme === "dark" ? "light" : "dark",
        statusBarColor: theme.colors.statusBar,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <HeaderWithLoopingSVGs />,
          headerShown: !isWebOrLargeScreen,
        }}
      />
      <Stack.Screen
        name="response"
        options={{
          title: "AI Insights",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
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
          headerTitle: "AI Insights",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.statusBar,
          },
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerShown: !isWebOrLargeScreen,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
