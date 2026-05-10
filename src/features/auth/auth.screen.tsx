import React, { useState, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import SplashCarousel from "@/features/splash/components/SplashCarousel";
import AuthForm from "./components/AuthForm";

export default function AuthScreen() {
  const [showAuth, setShowAuth] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  function transitionToAuth() {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start(() => {
      setShowAuth(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    });
  }

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      {showAuth ? <AuthForm /> : <SplashCarousel onFinish={transitionToAuth} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
