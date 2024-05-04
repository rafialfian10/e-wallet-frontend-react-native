import { useState, useEffect } from "react";
import { Animated, Easing } from "react-native";

function ShowHideAnimation() {
  const [showHideAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 1

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    const intervalId = setInterval(() => {
      Animated.sequence([
        Animated.timing(showHideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(showHideAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start();
    }, 1000);

    return () => clearInterval(intervalId);
  };

  return { showHideAnim };
}

export default ShowHideAnimation;
