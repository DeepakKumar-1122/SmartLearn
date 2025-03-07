import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const FAQsScreen = () => {
  const faqs = [
    {
      question: "What is SmartLearn?",
      answer: "SmartLearn is an AI-driven platform that creates personalized learning experiences by generating customized courses based on your preferences.",
    },
    {
      question: "How does SmartLearn generate courses?",
      answer: "Courses are generated using the Google Gemini API, considering factors such as difficulty level, time commitment, and learning goals.",
    },
    {
      question: "Can I edit my learning path?",
      answer: "Yes, you can modify the course schedule, reorder topics, and delete topics as needed.",
    },
    {
      question: "What types of resources are included?",
      answer: "SmartLearn provides articles, videos, and interactive tutorials curated from various online platforms.",
    },
    {
      question: "Is there progress tracking?",
      answer: "Yes, SmartLearn tracks your learning progress, including time spent on each lesson and overall course completion percentage.",
    },
    {
      question: "How do notifications work?",
      answer: "You receive reminders based on your selected scheduling frequency, ensuring you stay on track with your learning goals.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  faqItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  answer: {
    fontSize: 16,
    color: "#555",
  },
});

export default FAQsScreen;
