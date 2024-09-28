<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/7ee5bce7-4d15-4b16-8ef2-97b21880ea5a" alt="Logo"></td>
    <td><h1>AI Auto Accelerate</h1></td>
  </tr>
</table>


**AI Auto Accelerate** is a Generative AI-powered app that provides intelligent suggestions and information related to automobiles and cars. Built as a full-stack solution, it's optimized primarily for mobile platforms, offering a smooth user experience.

## Features

- **Mobile-First Design**: Optimized for Android and iOS (90%), with web optimization at 70%.
- **Seamless Authentication**: Integrated Google Sign-In with Firebase Authentication for a smooth login experience.
- **AI-Driven Backend**: FastAPI and Langchain power the Generative AI capabilities, delivering personalized car-related insights.
- **Interactive UI**: Leverages React Native Reanimated and Gesture Handler for fluid animations and user interactions.

## Tech Stack

- **Frontend**: React Native (TypeScript) with Expo for cross-platform development.
- **Backend**: FastAPI (Python) with Langchain for AI and prompt engineering.
- **Authentication**: Firebase Authentication for secure Google Sign-In.
- **State Management**: AsyncStorage for firebase persistence.

---

### Try the App

You can [**download the APK here**](https://drive.google.com/file/d/1fPGwmALUbdak2m7VzNbveo-acSPww_4j/view?usp=sharing) to test and explore the app on your Android device.

---

## Installation & Setup

To get started, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/AIAutoAccelerate.git
   cd AIAutoAccelerate
   ```

2. **Create a `.env` file** in the root folder with the following variables:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
   EXPO_PUBLIC_FIREBASE_PROJECT_ID
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   EXPO_PUBLIC_FIREBASE_APP_ID
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # Or with another package manager:
   # bun install
   # yarn install
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start
   # Or using Bun:
   # bunx expo start
   ```

## Key Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-svg`
- `@react-native-async-storage/async-storage`
- `@react-native-google-signin/google-signin`
- `firebase`

## Running the App

Once the setup is complete, you can run the app on Android, iOS, or the web using the Expo development server. Expo offers multiple ways to view your app:

- **Development Build**: [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- **Android Emulator**: [Setting up Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)
- **iOS Simulator**: [Running on iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
- **Expo Go**: [Try with Expo Go](https://expo.dev/go) for a quick development experience.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a feature branch, and submit a pull request.

## Learn More

Explore more about Expo and React Native with these resources:

- [Expo Documentation](https://docs.expo.dev/): Find detailed documentation and guides.
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Follow step-by-step instructions to build apps for Android, iOS, and the web.

## Join the Community

Be part of the growing community of developers building universal apps:

- [Expo on GitHub](https://github.com/expo/expo): View and contribute to the Expo platform.
- [Expo Discord Community](https://chat.expo.dev): Join the conversation and ask questions.
