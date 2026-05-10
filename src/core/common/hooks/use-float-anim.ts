import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface FloatOptions {
  amplitude?: number; // vertical travel in px
  period?: number;    // duration of one up-or-down stroke in ms
  delay?: number;     // startup delay in ms for phase offset
}

export function useFloatAnim({
  amplitude = 8,
  period = 1600,
  delay = 0,
}: FloatOptions = {}): Animated.Value {
  const anim = useRef(new Animated.Value(-amplitude)).current;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    anim.setValue(-amplitude);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: amplitude,
          duration: period,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -amplitude,
          duration: period,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    if (delay > 0) {
      timeout = setTimeout(() => loop.start(), delay);
    } else {
      loop.start();
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      loop.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return anim;
}
