import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Theme from "@/hooks/Theme";

const Response = () => {
  const { apiResponse } = useLocalSearchParams();

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
      // TODO Create Your Response View
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
