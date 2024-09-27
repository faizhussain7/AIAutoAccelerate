import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  TextInput,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { carBrands } from "@/assets/car_attributes/carbrands";
import { carModels } from "@/assets/car_attributes/carmodels";
import { carFeatures } from "@/assets/car_attributes/carfeatures";
import { carTypes } from "@/assets/car_attributes/cartypes";
import Theme from "@/hooks/Theme";
import { router } from "expo-router";

export default function Index() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showAllModels, setShowAllModels] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    selectedModels !== null && setSelectedModels([]);
  };

  const MAX_VISIBLE_CHIPS = 5;
  const MAX_SELECTIONS = 5;

  const handleModelSelect = (model: string) => {
    setSelectedModels((prevModels) => {
      if (prevModels.includes(model)) {
        return prevModels.filter((m) => m !== model);
      } else if (prevModels.length < MAX_SELECTIONS) {
        return [...prevModels, model];
      } else {
        Alert.alert(
          "Selection Limit Reached",
          `You can only select up to ${MAX_SELECTIONS} models.`
        );
        return prevModels;
      }
    });
  };

  const handleFeatureSelect = (feature: string) => {
    setSelectedFeatures((prevFeatures) => {
      if (prevFeatures.includes(feature)) {
        return prevFeatures.filter((f) => f !== feature);
      } else if (prevFeatures.length < MAX_SELECTIONS) {
        return [...prevFeatures, feature];
      } else {
        Alert.alert(
          "Selection Limit Reached",
          `You can only select up to ${MAX_SELECTIONS} features.`
        );
        return prevFeatures;
      }
    });
  };

  const models = selectedBrand ? carModels[selectedBrand] || [] : [];

  const [selectedBrandType, setSelectedBrandType] = useState("mainstream");
  const [modalVisible, setModalVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const carBrandTypes = Object.keys(carBrands);
  const colorScheme = useColorScheme(); // Get the system theme
  const theme = new Theme(colorScheme === "dark").getTheme(); // Create a theme instance based on the system theme

  const handleAutoAccelerate = async () => {
    // Dismiss the keyboard
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }

    if (
      !selectedBrand ||
      selectedModels.length === 0 ||
      selectedFeatures.length === 0
    ) {
      Alert.alert(
        "Incomplete Selection",
        "Please select a brand, models, and features before generating."
      );
      return;
    }

    setIsLoading(true);

    const payload = {
      brand: selectedBrand,
      models: selectedModels,
      features: selectedFeatures,
      additional_context: userInput,
    };

    console.log("Payload to be sent:", payload);

    try {
      const response = await fetch(
        "your API url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Check if the API response contains the unrelated message
      if (
        data.response ===
        "The provided information is unrelated to automobiles or vehicles. Please provide relevant car-related details."
      ) {
        Alert.alert(
          "Unrelated Information",
          "The provided information is unrelated to automobiles or vehicles. Please provide relevant car-related details."
        );
        return; // Stop the execution here without navigating to the response page
      } else {
        // Navigate only if the response is related
        router.push({
          pathname: "(drawer)/autogenerate/response",
          params: { apiResponse: JSON.stringify(data) },
        });
      }
    } catch (error) {
      console.error("Error calling Auto Accelerate API:", error);
      Alert.alert(
        "Error",
        "Unable to generate content. Please try again later."
      );
    } finally {
      setIsLoading(false);
      // Clear the payload by resetting the state
      setSelectedBrand(null);
      setSelectedModels([]);
      setSelectedFeatures([]);
      setUserInput("");
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        width: "100%",
        height: "100%",
      }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { padding: theme.spacing.medium },
          ]}
          showsHorizontalScrollIndicator={
            !(Platform.OS === "android" || Platform.OS === "ios")
          }
          showsVerticalScrollIndicator={
            !(Platform.OS === "android" || Platform.OS === "ios")
          }
        >
          <View style={styles.cardContainer}>
            {/* Brands Section */}
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
                },
              ]}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={[
                    styles.headerText,
                    {
                      fontSize: theme.fonts.header,
                      marginBottom: theme.spacing.medium,
                      color: theme.colors.text,
                    },
                  ]}
                >
                  Select Brand
                </Text>
                <TouchableOpacity
                  style={[
                    styles.brandTypeButton,
                    {
                      backgroundColor: theme.colors.chipBackground,
                    },
                  ]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text
                    style={[
                      styles.brandTypeText,
                      {
                        color: theme.colors.chipText,
                      },
                    ]}
                  >
                    {selectedBrandType.charAt(0).toUpperCase() +
                      selectedBrandType.slice(1)}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.chipText}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.chipContainer}>
                {carBrands[selectedBrandType as keyof typeof carBrands].map(
                  (brand, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            selectedBrand === brand
                              ? theme.colors.chipSelectedBackground
                              : theme.colors.chipBackground,
                        },
                      ]}
                      onPress={() => handleBrandSelect(brand)}
                    >
                      <Text
                        style={{
                          color:
                            selectedBrand === brand
                              ? theme.colors.chipSelectedText
                              : theme.colors.chipText,
                          fontSize: theme.fonts.regular,
                        }}
                      >
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Models Section */}
            {selectedBrand && (
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
                  },
                ]}
              >
                <Text
                  style={[
                    styles.headerText,
                    {
                      fontSize: theme.fonts.header,
                      marginBottom: theme.spacing.medium,
                      color: theme.colors.text,
                    },
                  ]}
                >
                  Choose Models ({selectedModels.length}/{MAX_SELECTIONS})
                </Text>
                <View style={styles.chipContainer}>
                  {models.length > 0 ? (
                    <>
                      {models
                        .slice(
                          0,
                          showAllModels ? models.length : MAX_VISIBLE_CHIPS
                        )
                        .map((model, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.chip,
                              {
                                backgroundColor: selectedModels.includes(model)
                                  ? theme.colors.chipSelectedBackground
                                  : theme.colors.chipBackground,
                                opacity:
                                  selectedModels.length >= MAX_SELECTIONS &&
                                  !selectedModels.includes(model)
                                    ? 0.5
                                    : 1,
                              },
                            ]}
                            onPress={() => handleModelSelect(model)}
                            disabled={
                              selectedModels.length >= MAX_SELECTIONS &&
                              !selectedModels.includes(model)
                            }
                          >
                            <Text
                              style={{
                                color: selectedModels.includes(model)
                                  ? theme.colors.chipSelectedText
                                  : theme.colors.chipText,
                                fontSize: theme.fonts.regular,
                              }}
                            >
                              {model}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      {models.length > MAX_VISIBLE_CHIPS && !showAllModels && (
                        <TouchableOpacity
                          style={[
                            styles.chip,
                            {
                              backgroundColor: theme.colors.chipBackground,
                              borderColor: theme.colors.text,
                              borderWidth: 1,
                            },
                          ]}
                          onPress={() => setShowAllModels(true)}
                        >
                          <Text
                            style={{
                              color: theme.colors.chipText,
                              fontSize: theme.fonts.regular,
                            }}
                          >
                            Show More
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.noModelsText,
                        {
                          fontSize: theme.fonts.regular,
                          marginBottom: theme.spacing.medium,
                          color: theme.colors.text,
                        },
                      ]}
                    >
                      No models available for this brand.
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Features Section */}
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
                },
              ]}
            >
              <Text
                style={[
                  styles.headerText,
                  {
                    fontSize: theme.fonts.header,
                    marginBottom: theme.spacing.medium,
                    color: theme.colors.text,
                  },
                ]}
              >
                Personalize Features ({selectedFeatures.length}/{MAX_SELECTIONS}
                )
              </Text>
              <View style={styles.chipContainer}>
                {carFeatures
                  .slice(
                    0,
                    showAllFeatures ? carFeatures.length : MAX_VISIBLE_CHIPS
                  )
                  .map((feature, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: selectedFeatures.includes(feature)
                            ? theme.colors.chipSelectedBackground
                            : theme.colors.chipBackground,
                          opacity:
                            selectedFeatures.length >= MAX_SELECTIONS &&
                            !selectedFeatures.includes(feature)
                              ? 0.5
                              : 1,
                        },
                      ]}
                      onPress={() => handleFeatureSelect(feature)}
                      disabled={
                        selectedFeatures.length >= MAX_SELECTIONS &&
                        !selectedFeatures.includes(feature)
                      }
                    >
                      <Text
                        style={{
                          color: selectedFeatures.includes(feature)
                            ? theme.colors.chipSelectedText
                            : theme.colors.chipText,
                          fontSize: theme.fonts.regular,
                        }}
                      >
                        {feature}
                      </Text>
                    </TouchableOpacity>
                  ))}
                {carFeatures.length > MAX_VISIBLE_CHIPS && !showAllFeatures && (
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      {
                        backgroundColor: theme.colors.chipBackground,
                        borderColor: theme.colors.text,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setShowAllFeatures(true)}
                  >
                    <Text
                      style={{
                        color: theme.colors.chipText,
                        fontSize: theme.fonts.regular,
                      }}
                    >
                      Show More
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* User Input Section */}
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
                },
              ]}
            >
              <Text
                style={[
                  styles.headerText,
                  {
                    fontSize: theme.fonts.header,
                    marginBottom: theme.spacing.medium,
                    color: theme.colors.text,
                  },
                ]}
              >
                Refine Your Automobile Preferences
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.primary,
                  },
                ]}
                placeholder="Have anything specific in mind? Share your thoughts here!"
                placeholderTextColor="#666"
                value={userInput}
                onChangeText={(text) => setUserInput(text)}
                multiline={true}
                numberOfLines={5}
                cursorColor={theme.colors.primary}
                selectionHandleColor={theme.colors.primary}
                selectionColor={theme.colors.chipBackground}
              />
            </View>
          </View>
          <Modal
            visible={modalVisible}
            transparent={true}
            statusBarTranslucent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.modalBackground },
                ]}
              >
                <FlatList
                  data={carBrandTypes}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedBrandType(item);
                        selectedBrand !== null && setSelectedBrand(null);
                        selectedModels !== null && setSelectedModels([]);
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
            </View>
          </Modal>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: theme.colors.buttonBackground },
          isLoading && { opacity: 0.5 },
        ]}
        onPress={handleAutoAccelerate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.buttonText} />
        ) : (
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
            ✦ Auto Accelerate
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headerText: {
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection:
      Platform.OS === "web" ||
      Platform.OS === "windows" ||
      Platform.OS === "macos"
        ? "row"
        : "column", // Row for web, column for mobile
    flexWrap: "wrap",
    gap:
      Platform.OS === "web" ||
      Platform.OS === "windows" ||
      Platform.OS === "macos"
        ? 10
        : 20, // Adjust width for web
  },
  card: {
    flex: 1,
    elevation: 5, // Adds shadow on Android
    shadowOffset: { width: 0, height: 2 }, // Adds shadow on iOS
    shadowOpacity: 0.3, // Adds shadow on iOS
    borderWidth: 1,
    width:
      Platform.OS === "web" ||
      Platform.OS === "windows" ||
      Platform.OS === "macos"
        ? "30%"
        : "100%", // Adjust width for web
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  brandTypeButton: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width:
      Platform.OS === "web" ||
      Platform.OS === "windows" ||
      Platform.OS === "macos"
        ? "20%"
        : "80%", // Adjust width for web
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
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
  brandTypeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  brandContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  brandText: {
    fontSize: 16,
  },
  noModelsText: {
    textAlign: "center", // Center the text
    fontWeight: "bold",
    marginVertical: 10, // Add some vertical margin for spacing
  },
  textInput: {
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
  },
  btn: {
    margin: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center", // Centers the text vertically
    borderRadius: 10,
    elevation: 5, // Increased elevation for a more prominent shadow on Android
    shadowOffset: { width: 0, height: 3 }, // Increased shadow offset for a more pronounced effect on iOS
    shadowOpacity: 0.5, // Increased shadow opacity for a more pronounced effect on iOS
    shadowRadius: 10, // Increased shadow radius for a more pronounced effect on iOS
  },
  btnText: {
    fontSize: 20, // Increased font size for better readability
    fontWeight: "bold",
    letterSpacing: 1, // Added letter spacing for a more modern look
  },
});
