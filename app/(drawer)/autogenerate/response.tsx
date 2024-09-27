import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  BackHandler,
  Alert,
} from "react-native";
import Theme from "@/hooks/Theme";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from "react-native-reanimated";

interface Model {
  model_name: string;
  description: string;
  price_range: string;
}

interface Feature {
  feature_name: string;
  description: string;
}

interface BuyingSuggestions {
  suggestion: string;
  advice: string;
}

interface ResponseData {
  brand: string;
  brand_overview: string;
  models: Model[];
  features: Feature[];
  buying_suggestions: BuyingSuggestions;
  additional_context?: string;
}

const Response = () => {
  const { apiResponse } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();

  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.85);
  const borderColor = useSharedValue(theme.colors.borderColor);

  // Animate when response data is loaded
  const animateCards = () => {
    opacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });
    translateY.value = withTiming(0, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });
    scale.value = withTiming(
      1,
      {
        duration: 1200,
        easing: Easing.out(Easing.exp),
      },
      () => {
        // After the initial animation, start the pulsing effect
        borderColor.value = withDelay(
          1200, // Start glow animation after initial animations
          withRepeat(
            withTiming(theme.colors.text, {
              // Gold glow color
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
            }),
            -1, // Infinite repeat
            true // Alternate colors
          )
        );
      }
    );
  };

  // Combine styles for the animations
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      borderColor: borderColor.value,
    };
  });

  // Handle navigation events (including router.back())
  useFocusEffect(
    useCallback(() => {
      // This will run when the screen comes into focus
      console.log("Component focused");

      return () => {
        // This will run when the screen goes out of focus (e.g., navigating back)
        console.log("Navigation back or screen unfocused. Clearing data...");
        setResponseData(null); // Clear data on navigation back
        setLoading(false);
      };
    }, [])
  );

  useEffect(() => {
    try {
      console.log("🚀 ~ Response ~ apiResponse:", apiResponse);

      // Step 1: Clean the response
      let cleanedResponse = (apiResponse as string)
        .replace("```json\n", "")
        .replace("```", "");

      console.log(" ~ useEffect ~ cleanedResponse:", cleanedResponse);

      // Step 2: If the response has an additional "response" field, extract the JSON string
      const parsedResponseObject = JSON.parse(cleanedResponse);

      if (parsedResponseObject.response) {
        // Extract the nested JSON string and clean it again
        cleanedResponse = parsedResponseObject.response
          .replace("json\n", "")
          .replace("```", "");
      }

      // Step 3: Parse the final cleaned JSON response
      const parsedResponse = JSON.parse(cleanedResponse);

      setResponseData(parsedResponse);
      animateCards();
    } catch (error) {
      console.error("Error parsing API response:", error);
    } finally {
      setLoading(false);
    }
  }, [apiResponse]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.text} />
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!responseData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: theme.colors.text }}>No data available</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        width: "100%",
        height: "100%",
      }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            padding: theme.spacing.medium,
          },
        ]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Card */}
        <Animated.View
          style={[
            styles.brandCard,
            {
              backgroundColor: theme.colors.cardBackground,
              padding: theme.spacing.large,
              marginBottom: theme.spacing.large,
              borderRadius: theme.spacing.medium,
              shadowColor: theme.colors.shadowColor,
              shadowRadius: theme.spacing.small,
              borderColor: theme.colors.borderColor,
            },
            animatedStyle, // Add the animation style
          ]}
        >
          <Text style={[styles.headerText, { color: theme.colors.text }]}>
            {responseData.brand}
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
            {responseData.brand_overview}
          </Text>
        </Animated.View>

        {/* Model Cards Section */}
        {responseData.models && responseData.models.length > 0 && (
          <>
            <Animated.Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.text },
                animatedStyle,
              ]}
            >
              Models
            </Animated.Text>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.horizontalScroll, animatedStyle]}
            >
              {responseData.models.map((model, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.cardBackground,
                      marginRight: 15,
                      marginBottom: 15,
                      padding: theme.spacing.medium,
                      borderRadius: theme.spacing.medium,
                      shadowColor: theme.colors.shadowColor,
                      shadowRadius: theme.spacing.small,
                      borderColor: theme.colors.borderColor,
                    },
                    animatedStyle, // Add the animation style
                  ]}
                >
                  <Text
                    style={[styles.cardTitle, { color: theme.colors.text }]}
                  >
                    {model.model_name}
                  </Text>
                  <Text
                    style={[
                      styles.descriptionText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {model.description}
                  </Text>
                  <Text
                    style={[styles.priceRange, { color: theme.colors.text }]}
                  >
                    Price Range: {model.price_range}
                  </Text>
                </Animated.View>
              ))}
            </Animated.ScrollView>
          </>
        )}

        {/* Feature Cards Section */}
        {responseData.features && responseData.features.length > 0 && (
          <>
            <Animated.Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.text },
                ,
                animatedStyle,
              ]}
            >
              Features
            </Animated.Text>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.horizontalScroll, animatedStyle]}
            >
              {responseData.features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.cardBackground,
                      marginRight: 15,
                      marginBottom: 15,
                      padding: theme.spacing.medium,
                      borderRadius: theme.spacing.medium,
                      shadowColor: theme.colors.shadowColor,
                      shadowRadius: theme.spacing.small,
                      borderColor: theme.colors.borderColor,
                    },
                    animatedStyle, // Add the animation style
                  ]}
                >
                  <Text
                    style={[styles.cardTitle, { color: theme.colors.text }]}
                  >
                    {feature.feature_name}
                  </Text>
                  <Text
                    style={[
                      styles.descriptionText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {feature.description}
                  </Text>
                </Animated.View>
              ))}
            </Animated.ScrollView>
          </>
        )}

        <Animated.Text
          style={[
            styles.sectionHeader,
            { color: theme.colors.text },
            animatedStyle,
          ]}
        >
          Buying Suggestions
        </Animated.Text>
        <Animated.View
          style={[
            styles.brandCard,
            {
              backgroundColor: theme.colors.cardBackground,
              padding: theme.spacing.large,
              marginBottom: theme.spacing.large,
              borderRadius: theme.spacing.medium,
              shadowColor: theme.colors.shadowColor,
              shadowRadius: theme.spacing.small,
              borderColor: theme.colors.borderColor,
            },
            animatedStyle, // Add the animation style
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Suggestion
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
            {responseData.buying_suggestions.suggestion}
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.brandCard,
            {
              backgroundColor: theme.colors.cardBackground,
              padding: theme.spacing.large,
              marginBottom: theme.spacing.large,
              borderRadius: theme.spacing.medium,
              shadowColor: theme.colors.shadowColor,
              shadowRadius: theme.spacing.small,
              borderColor: theme.colors.borderColor,
            },
            animatedStyle, // Add the animation style
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Advice
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
            {responseData.buying_suggestions.advice}
          </Text>
        </Animated.View>

        {/* Additional Context Section */}
        {responseData.additional_context && (
          <Animated.View style={styles.additionalContextContainer}>
            <Animated.Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.text },
                animatedStyle,
              ]}
            >
              Additional Context
            </Animated.Text>
            <Animated.View
              style={[
                styles.brandCard,
                {
                  backgroundColor: theme.colors.cardBackground,
                  padding: theme.spacing.large,
                  marginBottom: theme.spacing.large,
                  borderRadius: theme.spacing.medium,
                  shadowColor: theme.colors.shadowColor,
                  shadowRadius: theme.spacing.small,
                  borderColor: theme.colors.borderColor,
                },
                animatedStyle, // Add the animation style
              ]}
            >
              <Text
                style={[styles.descriptionText, { color: theme.colors.text }]}
              >
                {responseData.additional_context}
              </Text>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandCard: {
    borderWidth: 1,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  horizontalScroll: {
    paddingBottom: 20,
  },
  card: {
    borderWidth: 1,
    width: 280,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  additionalContext: {
    fontSize: 18,
    marginTop: 20,
    lineHeight: 24,
  },
  additionalContextContainer: {
    marginTop: 20,
  },
});

export default Response;
