import React, { useEffect, useState, useCallback, useLayoutEffect  } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  RefreshControl,
  LogBox
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested' // Suppresses that specific warning
  ]);
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          navigation.replace("Login");
        },
      },
    ]);
  };
    
  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCourses(response.data.courses);
      }

      const { data: recommendedData } = await axios.get("/api/courses/recommend", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (recommendedData.success && recommendedData.recommendations.length > 0) {
        setRecommendedCourses(recommendedData.recommendations);
      }
      
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedUsername = JSON.parse(storedUser)?.name || "User";
        setUsername(storedUsername);
      } catch (error) {
        console.error("Error retrieving username:", error);
      }
    };

    getUsername();
    fetchCourses();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, padding: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 }}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ fontWeight: "bold", color: "darkred" }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>Hi {username}</Text>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Welcome to SmartLearn</Text>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 30 }}>What would you like to learn?</Text>
      <Text style={{ fontSize: 18, color: "gray", marginBottom: 15, marginTop: 3 }}>
        Enter the topic, skill, or course you're interested in, and we'll create a tailored learning path for you!
      </Text>

      <TouchableOpacity
        style={{ padding: 15, borderRadius: 15, marginBottom: 30, width: "80%", alignSelf: "center",borderWidth: 1.5, borderColor: "blue" }}
        onPress={() => navigation.navigate("CourseForm")}
      >
        <Text style={{ color: "blue", textAlign: "center", fontSize: 18 }}>Get Started</Text>
      </TouchableOpacity>

      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Courses</Text>
        </View>
        {courses.length === 0 && <Text style={{ fontSize: 18, color: "gray", marginBottom: 15, marginTop: 3 }}>No courses found</Text>}
        <FlatList
          data={courses}
          vertical
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "#d3d3d3", padding: 15, borderRadius: 15, marginBottom: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }} onPress={() => navigation.navigate("Course", { course: item })}>
                {item.courseName}
              </Text>
              <Text style={{ fontSize: 16 }}>Difficulty: {item.difficultyLevel}</Text>
              <Text style={{ fontSize: 16 }}>Progress: {item.progress.completionPercentage}%</Text>
              <Text style={{ fontSize: 16 }}>
                Time Spent: {item.progress.timeSpent >= 3600 
                  ? (item.progress.timeSpent / 3600).toFixed(2) + " hrs" 
                  : item.progress.timeSpent >= 60 
                  ? (item.progress.timeSpent / 60).toFixed(2) + " mins" 
                  : item.progress.timeSpent.toFixed(2) + " s"}
              </Text>
            </View>
          )}

        />
      </View>

      {recommendedCourses.length > 0 && (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Recommended Courses</Text>
          {recommendedCourses.map((course) => (
            <TouchableOpacity
              key={course._id}
              style={{ backgroundColor: "#d3d3d3", padding: 15, borderRadius: 15, marginBottom: 15, marginTop: 10 }}
              // onPress={() => navigation.navigate("CourseScreen", { course })}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{course.courseName}</Text>
              <Text style={{ fontSize: 16 }}>Difficulty: {course.difficultyLevel}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <TouchableOpacity
        style={{ marginTop: 10, padding: 15, borderWidth: 1.5, borderColor: "blue", borderRadius: 10 }}
        onPress={() => navigation.navigate("FAQs")}
      >
        <Text style={{ textAlign: "center", color: "blue", fontSize: 16 }}>FAQs</Text>
      </TouchableOpacity>

      <Text style={{marginTop: 15, textAlign: 'center'}}>Scroll to the Top.</Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
