import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";

// Import our separated logic and reusable components
import { getDidYouKnowData } from "../api/apiService.js";
import useApi from "../hooks/apiUse.js";
import { API_BASE_URL } from "../utils/constants.js";
import Header from "../components/Header.jsx";

const DidYouKnowScreen = ({ navigation }) => {
  const { data, loading, error } = useApi(getDidYouKnowData);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching data. Please try again.</Text>
      </View>
    );
  }

  const imageUrl = data.image_url ? `${API_BASE_URL}${data.image_url}` : null;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="UNLEARN OLD PATTERNS"
        subtitle={data.title || "Distractions-No No"}
      />

      <GestureRecognizer
        onSwipeLeft={() => navigation.navigate("Flashcard")}
        config={{ velocityThreshold: 0.3, directionalOffsetThreshold: 80 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}

          <View style={styles.card}>
            <View style={styles.didYouKnowLabel}>
              <Text style={styles.didYouKnowIcon}>💡</Text>
              <Text style={styles.didYouKnowText}>
                DID YOU{"\n"}
                KNOW <Text style={{ color: "red" }}>?</Text>
              </Text>
            </View>

            <View style={styles.causeEffectContainer}>
              <Text style={styles.causeEffectBox}>
                {data.cause_and_effect.cause}
              </Text>
              <Text style={styles.arrow}>➳</Text>
              <Text style={styles.causeEffectBox}>
                {data.cause_and_effect.effect}
              </Text>
            </View>

            <Text style={styles.contentText}>{data.content}</Text>
            <Text style={styles.citationText}>{data.citation.label}</Text>
          </View>

          {/* Modern Swipe Hint with two dots */}
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>
              <Text style={{ fontSize: 18, color: "white" }}>• </Text>
              <Text style={{ fontSize: 18, color: "grey" }}>•</Text>
            </Text>
          </View>
        </ScrollView>
      </GestureRecognizer>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000fa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  card: {
    backgroundColor: "rgba(199, 81, 127, 0.8)",
    Horizontal: 10.5,
    Vertical: 30, // side margins
    marginTop: -38, // space above the card
    padding: 30, // inner spacing
    borderRadius: 70, // rounded top left
    // rounded top right
    borderBottomLeftRadius: 50, // flat bottom
    borderBottomRightRadius: 50,
  },
  /* didYouKnowLabel: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    position: "absolute",
    top: -20,
  },*/
  didYouKnowLabel: {
    // --- The following properties are new or updated ---
    paddingVertical: 4, // A bit more vertical padding
    paddingHorizontal: 10, // A bit more horizontal padding
    shadowColor: "#98189fff", // Shadow color
    shadowOffset: {
      // Shadow position
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Shadow visibility
    shadowRadius: 3.84, // Shadow blur
    elevation: 5, // Elevation for Android shadow

    // --- These properties remain the same ---
    position: "absolute",
    top: -35, // Adjusted slightly for the larger size
    alignSelf: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 45, // flat bottom
    borderBottomRightRadius: 15,
    vertical: -10,
    Horizontal: -10,
    transform: [{ skewX: "-10deg" }], // Increased for a more rounded "pill" shape
    flexDirection: "row",
    alignItems: "center",
  },

  didYouKnowIcon: {
    fontSize: 45,
    marginRight: 8,
    transform: [{ rotate: "-20deg" }],
  },
  didYouKnowText: {
    fontWeight: "bold",
    fontSize: 14,
    borderRightRadius: 10,
  },
  causeEffectContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  causeEffectBox: {
    backgroundColor: "rgba(255,255,255,0.3)",
    color: "white",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    width: "42%",
    fontSize: 14,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "white",
  },
  arrow: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  contentText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 15,
    lineHeight: 24,
  },
  citationText: {
    color: "white",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
    opacity: 0.9,
    textDecorationLine: "underline",
  },
  swipeHint: {
    backgroundColor: "rgba(199, 81, 127, 0.8)",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  swipeHintText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DidYouKnowScreen;
