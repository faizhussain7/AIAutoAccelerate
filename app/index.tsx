import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Theme from "@/hooks/Theme";
import SvgCar from "@/assets/images/carImages/carfront";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "@firebase/auth";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const Login = () => {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const window = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const translateX = useSharedValue(0);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "1039390104988-vopbe1d286ghokldej9fb0o9k3uj0ui3.apps.googleusercontent.com",
    });
  }, []);

  const texts = [
    "○ AI Auto Accelerate", // App name with a big dot
    "○ Smart Buying Suggestions",
    "○ Real-Time Car Insights",
    "○ Price Comparisons",
    "○ Personalized Recommendations",
  ];

  useEffect(() => {
    // Reanimated infinite scrolling animation
    translateX.value = withRepeat(
      withTiming(-width, {
        duration: 15000, // Duration of the animation (speed of scrolling)
        easing: Easing.linear,
      }),
      -1, // Repeat infinitely
      false // No reverse
    );
  }, []);

  // Reanimated animated style for the scrolling effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const signInWithGoogleWeb = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(FIREBASE_AUTH, provider);
      const user = result.user;
      console.log("User signed in:", user);
    } catch (error: any) {
      console.error("Error during sign-in with Google:", error);
    }
  };

  const onGoogleButtonPress = async () => {
    setLoading(true); // Set loading to true
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(FIREBASE_AUTH, googleCredential);
    } catch (error) {
      console.error("Google sign-in error", error);
    } finally {
      setLoading(false);
    }
  };

  if (Platform.OS === "web") {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.background,
            { flexDirection: window.width <= 768 ? "column" : "row" },
          ]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <SvgCar style={styles.carImage} />
          <Text
            style={[
              styles.overlayText,
              {
                color: theme.colors.text,
                left: window.width <= 1180 ? "55%" : "15%",
              },
            ]}
          >
            ✦ AI Auto Accelerate
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.cardBackground },
            ]}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Login
            </Text>
            <TouchableOpacity
              style={[
                styles.googleButton,
                {
                  backgroundColor: theme.colors.buttonBackground,
                  padding: theme.spacing.medium,
                  borderRadius: theme.spacing.medium,
                },
              ]}
              onPress={signInWithGoogleWeb}
            >
              <AntDesign
                name="google"
                size={24}
                color={theme.colors.icon}
                style={styles.icon}
              />
              <Text
                style={[styles.googleText, { color: theme.colors.buttonText }]}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          <SvgCar
            style={[styles.carImage, { maxHeight: "50%" }]}
            stroke={theme.colors.iconButton}
            strokeWidth="1"
            color={theme.colors.iconButton}
          />
          <View style={styles.marqueeContainer}>
            {/* Left fade using LinearGradient */}
            <LinearGradient
              colors={theme.colors.leftGradient}
              style={styles.leftFade}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            />
            {/* Marquee content */}
            <Animated.View style={[styles.marqueeContent, animatedStyle]}>
              {texts.map((text, index) => (
                <Text
                  key={index}
                  style={[
                    styles.marqueeText,
                    {
                      color: theme.colors.text,
                      textShadowColor: theme.colors.shadowColor, // Set shadow color
                      textShadowOffset: { width: 2, height: 2 }, // Set shadow offset
                      textShadowRadius: 4, // Set shadow blur radius
                    },
                  ]}
                >
                  {text}
                </Text>
              ))}
              {texts.map((text, index) => (
                <Text key={`duplicate-${index}`} style={styles.marqueeText}>
                  {text}
                </Text>
              ))}
            </Animated.View>
            {/* Right fade using LinearGradient */}
            <LinearGradient
              colors={theme.colors.rightGradient}
              style={styles.rightFade}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.googleButton,
            {
              padding: theme.spacing.medium,
              backgroundColor: theme.colors.buttonBackground,
              borderRadius: theme.spacing.medium,
              shadowColor: theme.colors.shadowColor,
              shadowRadius: theme.spacing.small,
            },
          ]}
          onPress={onGoogleButtonPress}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityLabel="Continue with Google"
        >
          {loading ? ( // Show loading indicator when loading
            <ActivityIndicator size="small" color={theme.colors.icon} />
          ) : (
            <>
              <AntDesign
                name="google"
                size={24}
                color={theme.colors.icon}
                style={styles.icon}
              />
              <Text
                style={[styles.googleText, { color: theme.colors.buttonText }]}
              >
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
  },
  icon: {
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "900",
  },
  background: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
  },
  carImage: {
    objectFit: "contain",
    zIndex: 0,
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: "center",
    zIndex: 1,
  },
  overlayText: {
    position: "absolute",
    top: "10%",
    transform: [{ translateX: "-50%" }],
    fontSize: 36,
    fontWeight: "bold",
    zIndex: 1,
  },
  marqueeContainer: {
    marginTop: 20, // Adds space between the car and the marquee
    overflow: "hidden",
    width: "100%", // Ensure the marquee spans the full width
  },
  marqueeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  marqueeText: {
    fontSize: 18, // Adjust text size
    fontWeight: "bold",
    paddingRight: 10,
  },
  leftFade: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 50, // Adjust the width of the fade effect
    zIndex: 2,
  },
  rightFade: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 50, // Adjust the width of the fade effect
    zIndex: 2,
  },
});

export default Login;
