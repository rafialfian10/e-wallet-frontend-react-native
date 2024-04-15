import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import ContainerNavigation from "./src/Screens/ContainerNavigation";
import SplashScreenView from "./src/Components/splashScreenView";
import { UserContextProvider } from "./src/Context/UserContext";

export default function App() {
  const Client = new QueryClient();

  const [isShowSplash, setIsShowSplash] = useState(true);
  const [spinner, setSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpinner(false);
      setIsShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer); // clear timer after component unmount
  }, []);

  return (
    <>
      {isShowSplash ? (
        <SplashScreenView spinner={spinner} />
      ) : (
        <QueryClientProvider client={Client}>
          <UserContextProvider>
            <StatusBar style="auto" />
            <NavigationContainer>
              <ContainerNavigation />
            </NavigationContainer>
          </UserContextProvider>
        </QueryClientProvider>
      )}
    </>
  );
}
