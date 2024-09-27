import SvgCarBack from "@/assets/images/carImages/carback";
import SvgCarBack2 from "@/assets/images/carImages/carback2";
import SvgCarFront from "@/assets/images/carImages/carfront";
import SvgCarFront2 from "@/assets/images/carImages/carfront2";
import Theme from "@/hooks/Theme";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Platform,
  useColorScheme,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const carSvgs = [SvgCarFront, SvgCarFront2, SvgCarBack, SvgCarBack2];

const HeaderWithLoopingSVGs = () => {
  const colorScheme = useColorScheme();
  const theme = new Theme(colorScheme === "dark").getTheme();
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carSvgs.length);
    }, 1000); // Change SVG every second

    return () => clearInterval(interval);
  }, []);

  const handleIconPress = (Message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(`${Message}`, ToastAndroid.SHORT);
    } else if (Platform.OS === "ios") {
      Alert.alert("Message", `${Message}`);
    }
  };

  const navigation = useNavigation();

  const onToggle = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const CurrentCar = carSvgs[currentIndex];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            padding: theme.spacing.small,
            backgroundColor: theme.colors.headerBackground,
            borderRadius: theme.spacing.medium,
            shadowColor: theme.colors.shadowColor,
            shadowRadius: theme.spacing.small,
            borderColor: theme.colors.borderColor,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onToggle}
          style={[
            styles.touch,
            {
              padding: theme.spacing.small,
              backgroundColor: theme.colors.iconButton,
              borderRadius: theme.spacing.medium,
              shadowColor: theme.colors.shadowColor,
              shadowRadius: theme.spacing.small,
            },
          ]}
        >
          <Ionicons
            name="menu-outline"
            size={24}
            color={theme.colors.icon}
          ></Ionicons>
        </TouchableOpacity>
        <CurrentCar width={40} height={40} color={theme.colors.text} />
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          AI Auto Accelerate
        </Text>
        {user ? (
          <Image
            source={{ uri: user.photoURL || "" }}
            style={[
              styles.image,
              {
                borderWidth: 1,
                borderColor: theme.colors.primary,
                marginStart: 5,
                marginEnd: 5,
              },
            ]}
          />
        ) : (
          <TouchableOpacity
            onPress={() => handleIconPress("no profile photo")}
            style={[
              styles.person,
              {
                padding: theme.spacing.small,
                backgroundColor: theme.colors.iconButton,
                borderRadius: theme.spacing.large,
                shadowColor: theme.colors.shadowColor,
                shadowRadius: theme.spacing.small,
              },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={theme.colors.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  person: {
    marginStart: 5,
    marginEnd: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3, // Shadow for Android
  },
  touch: {
    marginStart: 5,
    marginEnd: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3, // Shadow for Android
  },
  container: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    borderWidth: 1,
    elevation: 3, // Shadow for Android
  },
  headerText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "600",
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default HeaderWithLoopingSVGs;
