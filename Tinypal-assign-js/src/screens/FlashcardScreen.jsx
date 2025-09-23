import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import { getFlashcardData } from "../api/apiService.js";
import useApi from "../hooks/apiUse.js";
import { API_BASE_URL } from "../utils/constants.js";
import Header from "../components/Header.jsx";

const FlashcardScreen = ({ navigation }) => {
  const { data, loading, error } = useApi(getFlashcardData);

  // Animation refs
  const cardAnim = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  // Animate on mount
  useEffect(() => {
    Animated.sequence([
      Animated.spring(cardAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.parallel([
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

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
        subtitle={data.title || "Flashcard"}
      />
      <GestureRecognizer
        onSwipeRight={() => navigation.navigate("DidYouKnow")}
        config={{ velocityThreshold: 0.3, directionalOffsetThreshold: 80 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Animated.View
            style={[styles.card, { transform: [{ scale: cardAnim }] }]}
          >
            {imageUrl && (
              <Animated.Image
                source={{ uri: imageUrl }}
                style={[styles.image, { transform: [{ scale: imageScale }] }]}
              />
            )}

            <Animated.Text style={[styles.cardTitle, { opacity: textFade }]}>
              {data.title}
            </Animated.Text>

            <Animated.Text style={[styles.cardContent, { opacity: textFade }]}>
              {data.content}
            </Animated.Text>

            {data.citation?.label && (
              <Animated.Text
                style={[styles.citationText, { opacity: textFade }]}
              >
                {data.citation.label}
              </Animated.Text>
            )}
          </Animated.View>
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
  container: { flex: 1, backgroundColor: "#000000fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "rgba(91, 171, 233, 0.8)",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#98189fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  cardContent: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 15,
  },
  swipeHint: {
    backgroundColor: "rgba(91, 171, 233, 0.8)",
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

export default FlashcardScreen;
