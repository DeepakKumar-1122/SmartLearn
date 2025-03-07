import { API_BASE_URL } from "@env";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const getUsername = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedUsername = JSON.parse(storedUser).name;
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error("Error retrieving username:", error);
      }
    };

    getUsername();

    fetchCourses();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>Hi {username || "User"}</Text>
      <Text style={{ fontSize: 24, textAlign: "center" }}>
        Welcome to SmartLearn
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 30, paddingHorizontal:"10" }}>
        What would you like to learn?
      </Text>

      <Text style={{ fontSize: 16, color: "gray", marginBottom: 10, textAlign:"auto", paddingVertical:"10", paddingHorizontal:"10" }}>
        Enter the topic, skill, or course you're interested in, and we'll create
        a tailored learning path for you!
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          padding: 15,
          borderRadius: 15,
          marginBottom: 30,
          width: "80%",
          alignSelf: "center"
        }}
        onPress={() => navigation.navigate("CourseForm")}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Get Started
        </Text>
      </TouchableOpacity>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Courses</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
            <Text style={{ color: "blue", fontSize: 16 }}>See All</Text>
          </TouchableOpacity> */}
        </View>
        <FlatList
          data={courses}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#f0f0f0",
                padding: 15,
                borderRadius: 10,
                marginRight: 15,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }} onPress={() => navigation.navigate("Course", { course: item })}>
                {item.courseName}
              </Text>
              <Text>Difficulty: {item.difficultyLevel}</Text>
              <Text>Progress: {item.progress.completionPercentage}%</Text>
            </View>
          )}
          
        />
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 15,
          borderWidth: 1,
          borderColor: "blue",
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate("FAQs")}
      >
        <Text style={{ textAlign: "center", color: "blue", fontSize: 16 }}>
          FAQs
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
