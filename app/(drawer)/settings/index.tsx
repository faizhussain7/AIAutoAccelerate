import {
  View,
  Text,
  ScrollView,
  Platform,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import Theme from "@/hooks/Theme";
import { Ionicons } from "@expo/vector-icons";
import { carTypes } from "@/assets/car_attributes/cartypes";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const colorScheme = useColorScheme(); // Get the system theme
  const theme = new Theme(colorScheme === "dark").getTheme(); // Create a theme instance based on the system theme
  const [preferredCarType, setPreferredCarType] = useState("Sedan");
  const [modalVisible, setModalVisible] = useState(false);
  const window = useWindowDimensions();
  const isWebOrLargeScreen = window.width >= 768;

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        width: "100%",
        height: "100%",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.medium,
          flexGrow: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "space-between",
        }}
        showsHorizontalScrollIndicator={
          !(Platform.OS === "android" || Platform.OS === "ios")
        }
        showsVerticalScrollIndicator={
          !(Platform.OS === "android" || Platform.OS === "ios")
        }
      >
        <>
          <View
            style={[
              styles.card,
              {
                padding: theme.spacing.medium,
                backgroundColor: theme.colors.cardBackground,
                borderRadius: theme.spacing.medium,
                shadowColor: theme.colors.shadowColor,
                shadowRadius: theme.spacing.small,
                borderColor: theme.colors.borderColor,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: isWebOrLargeScreen ? "30%" : "100%", // Adjust width for web
              },
            ]}
          >
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: theme.fonts.button,
                  marginBottom: theme.spacing.medium,
                  color: theme.colors.text,
                },
              ]}
            >
              Preferred Car Types
            </Text>
            <TouchableOpacity
              style={[
                styles.preferredCarTypeButton,
                {
                  backgroundColor: theme.colors.chipBackground,
                  flexShrink: 1,
                  flexWrap: "wrap",
                  flexGrow: 0.5,
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={[
                  styles.preferredCarTypeText,
                  {
                    color: theme.colors.chipText,
                    fontSize: theme.fonts.small,
                  },
                ]}
              >
                {preferredCarType.charAt(0).toUpperCase() +
                  preferredCarType.slice(1)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={24}
                color={theme.colors.chipText}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              alignSelf: "center",
              fontSize: theme.fonts.small,
              color: theme.colors.text,
              textAlign: "center",
              fontFamily: "monospace", // Use default monospace font
            }}
          >
            © 2024 MFH Apps. All rights reserved.
          </Text>
        </>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        statusBarTranslucent={true}
        animationType="slide"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View
            style={[
              {
                backgroundColor: theme.colors.modalBackground,
                borderRadius: 10,
                padding: theme.spacing.medium,
                margin: theme.spacing.small,
                maxHeight: Platform.select({
                  web: "80%",
                  macos: "80%",
                  windows: "80%",
                }),
              },
            ]}
          >
            <FlatList
              data={carTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: theme.spacing.medium,
                    paddingHorizontal: theme.spacing.small,
                  }}
                  onPress={() => {
                    setPreferredCarType(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[styles.modalText, { color: theme.colors.text }]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.buttonBackground },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { color: theme.colors.buttonText },
                ]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: "bold",
  },
  card: {
    elevation: 5, // Adds shadow on Android
    shadowOffset: { width: 0, height: 2 }, // Adds shadow on iOS
    shadowOpacity: 0.3, // Adds shadow on iOS
    borderWidth: 1,
  },
  preferredCarTypeButton: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  preferredCarTypeText: {
    fontWeight: "bold",
  },
});

export default Settings;
