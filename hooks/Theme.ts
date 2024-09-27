class Theme {
  private isDarkMode: boolean;
  private theme: any;

  constructor(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.theme = isDarkMode ? this.darkTheme : this.lightTheme;
  }

  get lightTheme() {
    return {
      colors: {
        primary: "#000000",
        background: "#f2f2f2", // Slightly darker for better contrast
        cardBackground: "#ffffff",
        text: "#000000",
        chipBackground: "#e6e6e6", // Slightly lighter for a softer look
        chipSelectedBackground: "#000000",
        chipText: "#333333",
        chipSelectedText: "#ffffff",
        modalBackground: "#ffffff",
        borderColor: "#ccc", // Lighter for subtle borders
        placeholderText: "#555", // Darker for better readability
        buttonBackground: "#000000",
        buttonText: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
        headerBackground: "#ffffff",
        iconButton: "#000000",
        icon: "#ffffff",
        statusBar: "#f2f2f2", // Matches the background
        drawerBackground: "#f2f2f2",
        drawerActiveBackgroundColor: "#000000",
        drawerActiveTintColor: "#ffffff",
        leftGradient: ["rgba(240, 240, 240, 1)", "rgba(240, 240, 240, 0)"],
        rightGradient: ["rgba(240, 240, 240, 0)", "rgba(240, 240, 240, 1)"],
      },
      fonts: {
        header: 24,
        regular: 16,
        small: 14,
        button: 20,
      },
      spacing: {
        small: 5,
        medium: 10,
        large: 20,
      },
      borderRadius: 10,
      shadow: {
        color: "rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
        offset: { width: 0, height: 3 },
        opacity: 0.3,
        radius: 5,
      },
    };
  }

  get darkTheme() {
    return {
      colors: {
        primary: "#ffffff",
        background: "#222222", // Slightly darker for better contrast
        cardBackground: "#111111", // Darker for consistent dark mode feel
        text: "#ffffff",
        chipBackground: "#555555", // Darker gray for contrast
        chipSelectedBackground: "#ffffff",
        chipText: "#FFFFFF",
        chipSelectedText: "#000000",
        modalBackground: "#222222",
        borderColor: "#444444", // Darker for subtle borders
        placeholderText: "#bbbbbb", // Slightly lighter for readability
        buttonBackground: "#ffffff",
        buttonText: "#000000",
        shadowColor: "rgba(255, 255, 255, 0.3)", // Subtle light shadow for depth
        headerBackground: "#111111", // Matches card background
        iconButton: "#ffffff",
        icon: "#000000",
        statusBar: "#222222", // Matches the background
        drawerBackground: "#222222",
        drawerActiveBackgroundColor: "#ffffff",
        drawerActiveTintColor: "#000000",
        leftGradient: ["rgba(34, 34, 34, 1)", "rgba(68, 68, 68, 0)"],
        rightGradient: ["rgba(68, 68, 68, 0)", "rgba(34, 34, 34, 1)"],
      },
      fonts: {
        header: 24,
        regular: 16,
        small: 14,
        button: 20,
      },
      spacing: {
        small: 5,
        medium: 10,
        large: 20,
      },
      borderRadius: 10,
      shadow: {
        color: "rgba(255, 255, 255, 0.3)", // Subtle light shadow for depth
        offset: { width: 0, height: 3 },
        opacity: 0.7,
        radius: 5,
      },
    };
  }

  getTheme() {
    return this.theme;
  }
}

export default Theme;
