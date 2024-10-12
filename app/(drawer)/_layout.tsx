import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SvgCarBack from "@/assets/images/carImages/carback";
import SvgCarBack2 from "@/assets/images/carImages/carback2";
import SvgCarFront from "@/assets/images/carImages/carfront";
import SvgCarFront2 from "@/assets/images/carImages/carfront2";
import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  useWindowDimensions,
  Linking,
  Dimensions,
  Pressable,
} from "react-native";
import Theme from "@/hooks/Theme";
import { Link, Slot, useNavigation, usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { getAuth, signOut } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AutoGenAI from "@/app/(drawer)/autogenerate"; // Import your AutoGenAI component
import Settings from "@/app/(drawer)/settings"; // Import your Settings component
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useRoute } from "@react-navigation/native";

const carSvgs = [SvgCarFront, SvgCarFront2, SvgCarBack, SvgCarBack2];

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const cardImageScale = useSharedValue(1);
  const cardImageOpacity = useSharedValue(1);
  const modalImageScale = useSharedValue(1);
  const modalImageOpacity = useSharedValue(0);
  const modalImageTranslateX = useSharedValue(0);
  const modalImageTranslateY = useSharedValue(0);
  const imageRef = useRef<Image>(null);
  const [imageLayout, setImageLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const animatedCardImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardImageScale.value }],
    opacity: cardImageOpacity.value,
  }));

  const animatedModalImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalImageScale.value },
      { translateX: modalImageTranslateX.value },
      { translateY: modalImageTranslateY.value },
    ],
    opacity: modalImageOpacity.value,
  }));

  const openModal = () => {
    if (imageRef.current) {
      imageRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          const centerX = windowWidth / 2 - width / 2;
          const centerY = windowHeight / 2 - height / 2;
          const initialTranslateX = pageX - centerX;
          const initialTranslateY = pageY - centerY;

          setImageLayout({ x: pageX, y: pageY, width, height });
          setModalVisible(true);

          cardImageScale.value = withTiming(0.5, { duration: 300 });
          cardImageOpacity.value = withTiming(0, { duration: 300 });
          modalImageScale.value = withTiming(3, { duration: 300 });
          modalImageOpacity.value = withTiming(1, { duration: 300 });
          modalImageTranslateX.value = withTiming(0, { duration: 300 });
          modalImageTranslateY.value = withTiming(0, { duration: 300 });
        }
      );
    }
  };

  const closeModal = () => {
    const finalTranslateX =
      imageLayout.x - (windowWidth / 2 - imageLayout.width / 2);
    const finalTranslateY =
      imageLayout.y - (windowHeight / 2 - imageLayout.height / 2);

    cardImageScale.value = withTiming(1, { duration: 300 });
    cardImageOpacity.value = withTiming(1, { duration: 300 });
    modalImageScale.value = withTiming(1, { duration: 300 });
    modalImageOpacity.value = withTiming(0, { duration: 300 });
    modalImageTranslateX.value = withTiming(finalTranslateX, { duration: 300 });
    modalImageTranslateY.value = withTiming(
      finalTranslateY,
      { duration: 300 },
      () => {
        runOnJS(setModalVisible)(false);
      }
    );
  };

  useEffect(() => {
    // Simulate a loading delay and then update state
    const loadUserData = async () => {
      try {
        // Simulate an async operation (e.g., fetching user data)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmLogout = () => {
    if (Platform.OS === "web") {
      // For web, use a window.confirm dialog
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        signOut();
      }
    } else {
      // For mobile, use the native Alert
      Alert.alert(
        "Confirm Logout", // Title
        "Are you sure you want to log out?", // Message
        [
          {
            text: "Cancel",
            onPress: () => console.log("Logout cancelled"),
            style: "cancel", // This will style the button with bold text
          },
          {
            text: "Log Out",
            onPress: signOut,
            style: "destructive", // This will style the button with a red color on iOS
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
      >
        <View
          style={[
            styles.card,
            {
              margin: theme.spacing.medium,
              backgroundColor: theme.colors.cardBackground,
              borderRadius: theme.spacing.medium,
              shadowColor: theme.colors.shadowColor,
              shadowRadius: theme.spacing.small,
              justifyContent: "center",
              borderColor: theme.colors.borderColor,
            },
          ]}
        >
          {isLoading ? (
            <View style={styles.skeletonContainer}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonText} />
            </View>
          ) : (
            <>
              {/* <TouchableOpacity
                onPress={confirmLogout}
                style={[
                  styles.icon,
                  {
                    padding: theme.spacing.small,
                    backgroundColor: theme.colors.iconButton,
                    borderRadius: theme.spacing.small,
                    shadowColor: theme.colors.shadowColor,
                    shadowRadius: theme.spacing.small,
                    alignSelf: "flex-start",
                  },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={theme.colors.icon}
                />
              </TouchableOpacity> */}
              {user?.photoURL ? (
                <TouchableOpacity onPress={openModal}>
                  <Animated.Image
                    ref={imageRef}
                    source={{ uri: user.photoURL }}
                    style={[
                      styles.image,
                      {
                        borderWidth: 3,
                        borderColor: theme.colors.primary,
                        marginTop: 20,
                      },
                      animatedCardImageStyle,
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <Ionicons // Replace with your actual icon component
                  name="person-circle" // Assumed icon name for a person icon
                  size={50}
                  color={theme.colors.text}
                  style={{ alignSelf: "center", padding: 5 }}
                />
              )}
              <Text
                style={{
                  color: theme.colors.text,
                  alignSelf: "center",
                  margin: theme.spacing.medium,
                  textAlign: "center",
                  fontSize: theme.fonts.header,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                }}
              >
                {user?.displayName || "User"}
              </Text>

              {/* Full-screen image modal */}
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="none"
                statusBarTranslucent={true}
                onRequestClose={closeModal}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.modalBackground}
                    onPress={closeModal}
                  >
                    <Animated.Image
                      source={{ uri: user?.photoURL ?? "" }}
                      style={[
                        {
                          position: "absolute",
                          left: windowWidth / 2 - imageLayout.width / 2,
                          top: windowHeight / 2 - imageLayout.height / 2,
                          width: imageLayout.width,
                          height: imageLayout.height,
                          borderRadius: 150,
                        },
                        animatedModalImageStyle,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          )}
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        style={{
          borderTopColor: theme.colors.text,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 5,
          paddingBottom: Platform.OS === "ios" ? 20 + bottom : bottom,
        }}
      >
        <DrawerItem
          label="Feedback"
          onPress={() => {
            const email = "mfaizhussain7@gmail.com";
            const subject = "Feedback for AIAutoAccelerate";
            const mailto = `mailto:${email}?subject=${encodeURIComponent(
              subject
            )}`;

            Linking.openURL(mailto).catch((error) =>
              console.error("Error opening email client:", error)
            );
          }}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="comment-alert-outline"
              size={size}
              color={color}
            /> // Use an appropriate icon here
          )}
          inactiveTintColor={theme.colors.drawerActiveBackgroundColor}
          inactiveBackgroundColor="#00000000"
          labelStyle={{
            marginLeft: -20,
          }}
          style={{
            borderColor: theme.colors.drawerActiveBackgroundColor,
            borderWidth: 1,
          }}
          pressColor={theme.colors.drawerActiveBackgroundColor}
        />
        <DrawerItem
          label="Logout"
          onPress={confirmLogout}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} /> // Use an appropriate icon here
          )}
          inactiveTintColor="#FF6F6F"
          inactiveBackgroundColor="#00000000"
          labelStyle={{
            marginLeft: -20,
          }}
          style={{
            borderColor: "#FF6F6F",
            borderWidth: 1,
          }}
          pressColor={theme.colors.drawerActiveBackgroundColor}
        />
      </View>
    </View>
  );
}

const WebNavHeader = () => {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const { top } = useSafeAreaInsets();
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Throttle the SVG rotation to avoid potential glitches
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carSvgs.length);
    }, 2000); // Change SVG every 2 seconds to reduce rapid updates

    return () => clearInterval(interval);
  }, []);

  const CurrentCar = carSvgs[currentIndex];

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        signOut();
      }
    }
  };

  const pathname = usePathname();

  const isPage = (path: string) => pathname === path;

  const [modalVisible, setModalVisible] = useState(false);
  const cardImageScale = useSharedValue(1);
  const cardImageOpacity = useSharedValue(1);
  const modalImageScale = useSharedValue(1);
  const modalImageOpacity = useSharedValue(0);
  const modalImageTranslateX = useSharedValue(0);
  const modalImageTranslateY = useSharedValue(0);
  const imageRef = useRef<Image>(null);
  const [imageLayout, setImageLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const animatedCardImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardImageScale.value }],
    opacity: cardImageOpacity.value,
  }));

  const animatedModalImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalImageScale.value },
      { translateX: modalImageTranslateX.value },
      { translateY: modalImageTranslateY.value },
    ],
    opacity: modalImageOpacity.value,
  }));

  const openModal = () => {
    if (imageRef.current) {
      imageRef.current.measure((x, y, width, height, pageX, pageY) => {
        const centerX = windowWidth / 2 - width / 2;
        const centerY = windowHeight / 2 - height / 2;
        const initialTranslateX = pageX - centerX;
        const initialTranslateY = pageY - centerY;

        setImageLayout({ x: pageX, y: pageY, width, height });
        setModalVisible(true);

        // Using `withSpring` for more fluid transitions
        cardImageScale.value = withSpring(0.5);
        cardImageOpacity.value = withSpring(0);
        modalImageScale.value = withSpring(3);
        modalImageOpacity.value = withSpring(1);
        modalImageTranslateX.value = withTiming(0);
        modalImageTranslateY.value = withTiming(0);
      });
    }
  };

  const closeModal = () => {
    const finalTranslateX =
      imageLayout.x - (windowWidth / 2 - imageLayout.width / 2);
    const finalTranslateY =
      imageLayout.y - (windowHeight / 2 - imageLayout.height / 2);

    // Reverse the animations
    cardImageScale.value = withSpring(1);
    cardImageOpacity.value = withSpring(1);
    modalImageScale.value = withTiming(1);
    modalImageOpacity.value = withTiming(0);
    modalImageTranslateX.value = withTiming(finalTranslateX, { duration: 300 });
    modalImageTranslateY.value = withTiming(
      finalTranslateY,
      { duration: 300 },
      () => {
        runOnJS(setModalVisible)(false);
      }
    );
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <View
      style={[
        styles.webNavHeader,
        {
          backgroundColor: theme.colors.background,
          paddingTop: top,
        },
      ]}
    >
      <View style={styles.webNavContent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <CurrentCar width={40} height={40} fill={theme.colors.text} />
          <Text style={[styles.logo, { color: theme.colors.text }]}>
            AIAutoAccelerate
          </Text>
        </View>
        <View style={styles.webNavLinks}>
          <Link
            href="/autogenerate"
            style={[
              styles.webNavLink,
              {
                backgroundColor: isPage("/autogenerate")
                  ? theme.colors.drawerActiveBackgroundColor
                  : theme.colors.drawerActiveTintColor,
              },
            ]}
          >
            <Text
              style={{
                color: isPage("/autogenerate")
                  ? theme.colors.drawerActiveTintColor
                  : theme.colors.drawerActiveBackgroundColor,
              }}
            >
              AutoGenAI
            </Text>
          </Link>
          <Link
            href="/settings"
            style={[
              styles.webNavLink,
              {
                backgroundColor: isPage("/settings")
                  ? theme.colors.drawerActiveBackgroundColor
                  : theme.colors.drawerActiveTintColor,
              },
            ]}
          >
            <Text
              style={{
                color: isPage("/settings")
                  ? theme.colors.drawerActiveTintColor
                  : theme.colors.drawerActiveBackgroundColor,
              }}
            >
              Settings
            </Text>
          </Link>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {user?.photoURL ? (
            <TouchableOpacity onPress={openModal}>
              <Animated.Image
                ref={imageRef}
                source={{ uri: user.photoURL }}
                style={[
                  {
                    borderWidth: 3,
                    borderColor: theme.colors.primary,
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    alignSelf: "center",
                  },
                  animatedCardImageStyle,
                ]}
              />
            </TouchableOpacity>
          ) : (
            <Ionicons // Replace with your actual icon component
              name="person-circle" // Assumed icon name for a person icon
              size={50}
              color={theme.colors.text}
              style={{ alignSelf: "center", padding: 5 }}
            />
          )}
        </View>
        {/* Full-screen image modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="none"
          statusBarTranslucent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={closeModal}
            >
              <View
                style={{
                  elevation: 5,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  alignItems: "flex-start", // Center everything
                  width: "30%", // Adjust card width
                  margin: theme.spacing.medium,
                  flexDirection: "row",
                  backgroundColor: theme.colors.cardBackground,
                  borderRadius: theme.spacing.medium,
                  shadowColor: theme.colors.shadowColor,
                  shadowRadius: theme.spacing.small,
                  justifyContent: "center",
                  borderColor: theme.colors.borderColor,
                }}
              >
                <View>
                  <Animated.Image
                    source={{ uri: user?.photoURL ?? "" }}
                    style={[
                      {
                        marginStart: imageLayout.width / 0.5,
                        width: imageLayout.width,
                        height: imageLayout.height,
                        borderRadius: imageLayout.width / 2,
                      },
                      animatedModalImageStyle,
                    ]}
                  />
                  <Text
                    style={{
                      color: theme.colors.text,
                      marginTop: 50,
                      marginStart: imageLayout.width / 0.8,
                      marginBottom: theme.spacing.medium,
                      textAlign: "center",
                      fontSize: theme.fonts.header,
                      fontWeight: "bold",
                      letterSpacing: 0.5,
                    }}
                  >
                    {user?.displayName ?? "User Name"}
                  </Text>
                </View>
                <View
                  style={{
                    flexGrow: 1,
                    height: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    style={{
                      alignItems: "center",
                      borderRadius: theme.spacing.small,
                      padding: theme.spacing.medium,
                      marginHorizontal: theme.spacing.medium,
                      justifyContent: "center",
                      borderColor: theme.colors.drawerActiveBackgroundColor, // Change color when pressed
                      borderWidth: 1,
                    }}
                    onPress={() => {
                      const email = "mfaizhussain7@gmail.com";
                      const subject = "Feedback for AIAutoAccelerate";
                      const mailto = `mailto:${email}?subject=${encodeURIComponent(
                        subject
                      )}`;

                      Linking.openURL(mailto).catch((error) =>
                        console.error("Error opening email client:", error)
                      );
                    }}
                  >
                    <MaterialCommunityIcons
                      name="comment-alert-outline"
                      size={24}
                      color={theme.colors.drawerActiveBackgroundColor} // Change icon color
                    />
                    <Text
                      style={{
                        color: theme.colors.drawerActiveBackgroundColor, // Change text color
                        fontSize: theme.fonts.regular,
                      }}
                    >
                      Feedback
                    </Text>
                  </Pressable>

                  {/* Logout Pressable */}
                  <Pressable
                    style={{
                      alignItems: "center",
                      borderRadius: theme.spacing.small,
                      padding: theme.spacing.medium,
                      marginHorizontal: theme.spacing.medium,
                      justifyContent: "center",
                      borderColor: "#FF6F6F",
                      borderWidth: 1,
                    }}
                    onPress={confirmLogout}
                  >
                    <MaterialCommunityIcons
                      name="logout-variant"
                      size={24}
                      color={"#FF6F6F"}
                    />
                    <Text
                      style={{
                        color: "#FF6F6F",
                        fontSize: theme.fonts.body,
                      }}
                    >
                      Logout
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const DrawerLayout = () => {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const width = Dimensions.get("window");

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carSvgs.length);
    }, 1000); // Change SVG every second

    return () => clearInterval(interval);
  }, []);

  const CurrentCar = carSvgs[currentIndex];

  interface NavigationBarProps {
    onSelect: (page: "autogenerate" | "settings") => void;
    selectedPage: "autogenerate" | "settings";
  }

  const NavigationBar: React.FC<NavigationBarProps> = ({
    onSelect,
    selectedPage,
  }) => {
    const buttonStyle = (isSelected: boolean) => ({
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: isSelected
        ? theme.colors.drawerActiveBackgroundColor
        : theme.colors.drawerActiveTintColor,
      color: isSelected
        ? theme.colors.drawerActiveTintColor
        : theme.colors.drawerActiveBackgroundColor,
      cursor: "pointer",
      transition: "background-color 0.3s, color 0.3s",
      fontSize: "16px",
      fontWeight: "bold",
      margin: "0 10px",
    });

    const hoverStyle = {
      ":hover": {
        backgroundColor: theme.colors.drawerActiveBackgroundColor,
        color: theme.colors.drawerActiveTintColor,
      },
    };

    return (
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          background: theme.colors.drawerBackground,
        }}
      >
        <button
          onClick={() => onSelect("autogenerate")}
          style={{
            ...buttonStyle(selectedPage === "autogenerate"),
            ...hoverStyle,
          }}
        >
          AutoGenAI
        </button>
        <button
          onClick={() => onSelect("settings")}
          style={{
            ...buttonStyle(selectedPage === "settings"),
            ...hoverStyle,
          }}
        >
          Settings
        </button>
      </nav>
    );
  };

  const window = useWindowDimensions();
  const [selectedPage, setSelectedPage] = useState<"autogenerate" | "settings">(
    "autogenerate"
  );

  const isWebOrLargeScreen = window.width >= 768;

  return isWebOrLargeScreen ? (
    <View style={{ flex: 1 }}>
      <WebNavHeader />
      <View style={styles.contentContainer}>
        <Slot />
      </View>
    </View>
  ) : (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveBackgroundColor: theme.colors.drawerActiveBackgroundColor,
          drawerInactiveBackgroundColor: theme.colors.drawerActiveTintColor,
          drawerInactiveTintColor: theme.colors.drawerActiveBackgroundColor,
          drawerActiveTintColor: theme.colors.drawerActiveTintColor,
          drawerStyle: {
            backgroundColor: theme.colors.drawerBackground,
          },
          drawerLabelStyle: {
            marginLeft: -20,
          },
          drawerItemStyle: {
            elevation: 3, // Adds shadow on Android
            shadowOffset: { width: 0, height: 2 }, // Adds shadow on iOS
            shadowOpacity: 0.3, // Adds shadow on iOS
            borderWidth: 1,
            shadowColor: theme.colors.shadowColor,
            shadowRadius: theme.spacing.small,
            borderColor: theme.colors.borderColor,
          },
        }}
      >
        <Drawer.Screen
          name="autogenerate"
          options={{
            headerShown: false,
            drawerLabel: "AutoGenAI",
            drawerIcon: ({ size, color }) => (
              <CurrentCar width={size} height={size} fill={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            headerShown: false,
            drawerLabel: "Settings",
            drawerIcon: ({ size, color }) => (
              <Ionicons name={"settings-outline"} size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    elevation: 3, // Adds shadow on Android
    shadowOffset: { width: 0, height: 2 }, // Adds shadow on iOS
    shadowOpacity: 0.3, // Adds shadow on iOS
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  icon: {
    margin: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3, // Shadow for Android
  },
  skeletonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  skeletonText: {
    width: 150,
    height: 20,
    backgroundColor: "#e0e0e0",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  webNavHeader: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  webNavContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  webNavLinks: {
    flexDirection: "row",
  },
  webNavLink: {
    marginLeft: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 0, // React Native uses borderWidth instead of 'border'
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    // cursor and transition are not supported in React Native
  },
  contentContainer: {
    flex: 1,
  },
});

export default DrawerLayout;
