import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { Alert } from "react-native";
import axios from "axios";

const CourseScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { course } = route.params;

  const startTimeRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      startTimeRef.current = Date.now();

      return () => {
        const startTime = startTimeRef.current;
        if (startTime) {
          const endTime = Date.now();
          const timeSpent = (endTime - startTime) / 1000;
          updateTimeSpent(timeSpent);
        }
      };
    }, [])
  );

  const updateTimeSpent = async (timeSpent) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `/api/courses/${course._id}/timespent`,
        { timeSpent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating time spent:", error);
    }
  };

  const formatTimeSpent = (seconds) => {
    if (seconds >= 3600) {
      return `${(seconds / 3600).toFixed(2)} hrs`;
    } else if (seconds >= 60) {
      return `${(seconds / 60).toFixed(2)} mins`;
    }
    return `${seconds.toFixed(2)} secs`;
  };

  const markAsCompleted = async (courseId, topicId, resourceIndex) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `/api/courses/${courseId}/completion`,
        { courseId, topicId, resourceIndex },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Marked resource ${resourceIndex} in topic ${topicId} as completed`);
    } catch (error) {
      console.error("Error marking completion:", error);
    }
  };

  const handleDeleteCourse = async () => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete this course? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(`/api/courses/${course._id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(`Deleted course: ${course.courseName}`);
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting course:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.courseTitle}>{course.courseName}</Text>
      <Text style={styles.detail}>
        Difficulty: <Text style={styles.bold}>{course.difficultyLevel}</Text>
      </Text>
      <Text style={styles.detail}>
        Progress: <Text style={styles.bold}>{course.progress.completionPercentage}%</Text>
      </Text>
      <Text style={styles.detail}>
        Time Spent: <Text style={styles.bold}>{formatTimeSpent(course.progress.timeSpent)}</Text>
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
          {topic.resources.map((resource, resIndex) => (
            <TouchableOpacity
              key={resIndex}
              onPress={() => {
                Linking.openURL(resource.resourceLink);
                markAsCompleted(course._id, topic._id, resIndex);
              }}
            >
              <Text style={styles.resourceLink}>
                {`${resIndex + 1} - ${resource.resourceType} ${resource.completed ? '✅' : ''}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCourse}>
        <Text style={styles.deleteButtonText}>Delete Course</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 15 }}>End of the course</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  detail: { fontSize: 16, marginBottom: 6, color: "#444" },
  bold: { fontWeight: "bold", color: "#222" },
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
  topicTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  topicDetail: { fontSize: 14, color: "#555", marginTop: 4 },
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
  deleteButton: {
    padding: 12,
    borderWidth: 1.5,
    borderColor: "red",
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    width: "40%",
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
  },
});

export default CourseScreen;
