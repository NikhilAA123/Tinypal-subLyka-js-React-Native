import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import our reusable components and hooks
import { getFlashcardData } from "../api/apiService.js";
import useApi from "../hooks/useApi";
import Header from "../components/header.jsx";

// Component now accepts the { navigation } prop
const FlashcardScreen = ({ navigation }) => {
  const { data, loading, error } = useApi(getFlashcardData);

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

  // Static content from the PDF design
  const staticContent = {
    title: "What Qualifies as Distractions?",
    description: "Toys and screens? Obvious distractions. But so are:",
    examples: [
      '"Open your mouth! Here comes an aeroplane wooooo!!"',
      "\"Look there's a bird!\", as the bite goes in <child name>'s mouth.",
      '"I\'m closing my eyes. Let me see who comes to take a bite: you or the cat!"',
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* The Header now uses onBackPress with the navigation prop */}
      <Header
        title="UNLEARN OLD PATTERNS"
        subtitle={data.title || "No Distractions 101"}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{staticContent.title}</Text>
          <Text style={styles.cardDescription}>
            {staticContent.description}
          </Text>
          {staticContent.examples.map((item, index) => (
            <Text key={index} style={styles.exampleText}>
              - {item}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: { padding: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardDescription: { fontSize: 16, color: "#555", marginBottom: 15 },
  exampleText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 10,
    lineHeight: 20,
  },
});

export default FlashcardScreen;
