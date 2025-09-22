import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Correctly import from your new screens folder
import DidYouKnowScreen from "./src/screens/DidYouKnowScreen.jsx";
import FlashcardScreen from "./src/screens/FlashcardScreenTEMP.jsx";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DidYouKnow"
        screenOptions={{
          headerShown: false, // We will use our custom header inside each screen
        }}
      >
        <Stack.Screen name="DidYouKnow" component={DidYouKnowScreen} />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
