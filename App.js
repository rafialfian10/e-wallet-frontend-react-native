import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import ContainerNavigation from "./src/Screens/ContainerNavigation";
import { UserContextProvider } from "./src/Context/UserContext";

export default function App() {
  const Client = new QueryClient();

  return (
    <QueryClientProvider client={Client}>
      <UserContextProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <ContainerNavigation />
        </NavigationContainer>
      </UserContextProvider>
    </QueryClientProvider>
  );
}
