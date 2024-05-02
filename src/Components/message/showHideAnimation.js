import { useState, useEffect } from "react";
import { Animated, Easing } from "react-native";

function ShowHideAnimation() {
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 1

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    const intervalId = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start();
    }, 1000);

    return () => clearInterval(intervalId);
  };

  return { fadeAnim };
}

export default ShowHideAnimation;
