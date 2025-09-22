import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import our separated logic and reusable components
import { getDidYouKnowData } from "../api/apiService";
import useApi from "../hooks/useApi";
import { API_BASE_URL } from "../utils/constants";
import Header from "../components/header.jsx";

// Component now accepts the { navigation } prop
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
      <ScrollView>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        <View style={styles.card}>
          <View style={styles.didYouKnowLabel}>
            <Text style={styles.didYouKnowIcon}>💡</Text>
            <Text style={styles.didYouKnowText}>DID YOU KNOW?</Text>
          </View>
          <View style={styles.causeEffectContainer}>
            <Text style={styles.causeEffectBox}>
              {data.cause_and_effect.cause}
            </Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.causeEffectBox}>
              {data.cause_and_effect.effect}
            </Text>
          </View>
          <Text style={styles.contentText}>{data.content}</Text>
          <Text style={styles.citationText}>{data.citation.label}</Text>
        </View>

        {/* Navigation button updated to use TouchableOpacity */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Flashcard")}
        >
          <Text style={styles.buttonText}>Go to Flashcard Screen</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: { width: "100%", height: 250, resizeMode: "cover" },
  card: {
    backgroundColor: "rgba(255, 105, 180, 0.8)",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    marginTop: -40,
  },
  didYouKnowLabel: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    position: "absolute",
    top: -20,
  },
  didYouKnowIcon: { fontSize: 16, marginRight: 8 },
  didYouKnowText: { fontWeight: "bold", fontSize: 14 },
  causeEffectContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 30,
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
  },
  arrow: { color: "white", fontSize: 28, fontWeight: "bold" },
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
  },
  button: {
    backgroundColor: "#FF69B4",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default DidYouKnowScreen;
