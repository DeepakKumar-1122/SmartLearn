import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Linking } from "react-native";

const CourseScreen = () => {
  const route = useRoute();
  const { course } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.courseTitle}>{course.courseName}</Text>
      <Text style={styles.detail}>
        Difficulty: <Text style={styles.bold}>{course.difficultyLevel}</Text>
      </Text>

      <Text style={styles.sectionTitle}>Topics:</Text>
      {course.topics.map((topic, topicIndex) => (
        <View key={topicIndex} style={styles.topicCard}>
          <Text style={styles.topicTitle}>
            {topicIndex + 1}. {topic.topicName}
          </Text>
          <Text style={styles.topicDetail}>
            Recommended Time: {topic.timeRecommended} hrs
          </Text>

          <Text style={styles.resourceTitle}>Resources:</Text>
          {topic.resources.map((resource, resIndex) => {
            let resourceLabel = `${resource.resourceType}-${resIndex + 1}`;
            return (
              <TouchableOpacity key={resIndex} onPress={() => Linking.openURL(resource.resourceLink)}>
                <Text style={styles.resourceLink}>{resourceLabel}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <Text style={{marginTop:"15"}}>End of the course</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
    color: "#333",
  },
  topicCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  topicDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  resourceLink: {
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
    marginTop: 4,
  },
});

export default CourseScreen;
