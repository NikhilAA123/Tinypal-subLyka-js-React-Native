import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Header = ({ title, subtitle, onBackPress }) => {
  return (
    <View style={styles.header}>
      {/* Conditionally render the back button only if onBackPress is provided */}
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  backButtonText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "gray",
    fontSize: 12,
  },
});

export default Header;
