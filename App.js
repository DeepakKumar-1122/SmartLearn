// import React from "react";
// import AppNavigator from "./AppNavigator";

// export default function App() {
//   return <AppNavigator />;
// }

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import AppNavigator from "./AppNavigator";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not loaded. Check your .env file.");
      return;
    }

    axios.defaults.baseURL = API_BASE_URL;
    console.log("API_BASE_URL Loaded:", API_BASE_URL);
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading environment variables...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}
