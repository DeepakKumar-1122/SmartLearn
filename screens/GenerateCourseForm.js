import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const GenerateCourseForm = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [courseName, setCourseName] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [schedulingFrequency, setSchedulingFrequency] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [preferredResources, setPreferredResources] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    fetchToken();
  }, []);

  const handleGeneratePath = async () => {
    if (
      !courseName ||
      !difficultyLevel ||
      !schedulingFrequency ||
      !timeCommitment
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    console.log({
      courseName,
      difficultyLevel,
      schedulingFrequency,
      timeCommitment,
      learningGoals,
      preferredResources,
    });

    setLoading(true);

    try {
      const response = await axios.post(
        '/api/courses/generate',
        {
          courseName,
          difficultyLevel,
          schedulingFrequency,
          timeCommitment,
          learningGoals,
          preferredResources,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const result = response.data;

      if (result.message) {
        throw new Error(result.message || "Failed to generate course.");
      }    

      Alert.alert("Success", "Learning path generated successfully!");

      // Navigate to Course Screen with generated data
      navigation.navigate("Course", { course: result });
      // navigation.navigate("Course", { courseId: result._id });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 25, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Enter Your Preferences
      </Text>

      {/* Course Name */}
      <Text style={styles.label}>Course/Topic/Skill Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Python Programming, Data Science"
        value={courseName}
        onChangeText={setCourseName}
      />

      {/* Difficulty Level */}
      <Text style={styles.label}>Difficulty Level</Text>
      <View style={styles.selectionContainer}>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.option,
              difficultyLevel === level && styles.selectedOption,
            ]}
            onPress={() => setDifficultyLevel(level)}
          >
            <Text style={styles.optionText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.infoText}>
        Choose your current knowledge level for the best-suited learning
        materials.
      </Text>

      {/* Scheduling Frequency */}
      <Text style={styles.label}>Scheduling Frequency</Text>
      <View style={styles.selectionContainer}>
        {["Daily", "Weekly"].map((freq) => (
          <TouchableOpacity
            key={freq}
            style={[
              styles.option,
              schedulingFrequency === freq && styles.selectedOption,
            ]}
            onPress={() => setSchedulingFrequency(freq)}
          >
            <Text style={styles.optionText}>{freq}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.infoText}>
        Choose how often you want to study. We will break down your learning
        path accordingly.
      </Text>

      {/* Time Commitment */}
      <Text style={styles.label}>Time Commitment Per Day</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter number of hours (e.g., 1 hour/day)"
        keyboardType="numeric"
        value={timeCommitment}
        onChangeText={setTimeCommitment}
      />
      <Text style={styles.infoText}>
        Specify how much time you can dedicate each day to learning.
      </Text>

      {/* Optional Preferences */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        Optional preferences
      </Text>

      {/* Learning Goals */}
      <Text style={styles.label}>Learning Goals or Interests</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your specific goals (e.g., 'Improve coding skills')"
        value={learningGoals}
        onChangeText={setLearningGoals}
      />

      {/* Preferred Learning Resources */}
      <Text style={styles.label}>Preferred Learning Resources</Text>
      <TextInput
        style={styles.input}
        placeholder="Videos / Articles / Tutorials, etc."
        value={preferredResources}
        onChangeText={setPreferredResources}
      />
      <Text style={styles.infoText}>
        Let us know your preferred learning formats, and we'll prioritize them
        in your path.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGeneratePath}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            Generate Path
          </Text>
        )}
      </TouchableOpacity>

      <Text style={{marginTop:"15"}}>End of the Form</Text>
    </ScrollView>
  );
};

// Styles
const styles = {
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  option: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#0a7b65",
    borderColor: "#0a7b65",
  },
  optionText: {
    color: "#333",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0a7b65",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
};

export default GenerateCourseForm;
