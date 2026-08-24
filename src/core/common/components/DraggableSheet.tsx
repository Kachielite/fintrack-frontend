import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  onClose: () => void;
  handleColor: string;
  style?: ViewStyle | ViewStyle[] | any;
  children: React.ReactNode;
}

const DISMISS_THRESHOLD = 80;
const DISMISS_VELOCITY = 0.5;

export default function DraggableSheet({ onClose, handleColor, style, children }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > DISMISS_VELOCITY) {
          Animated.timing(translateY, {
            toValue: 1000,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      <View {...panResponder.panHandlers} style={styles.handleArea}>
        <View style={[styles.handle, { backgroundColor: handleColor }]} />
      </View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  handleArea: {
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});
