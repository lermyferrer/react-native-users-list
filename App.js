import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/**Components */
import UsersList from "./pages/UsersList";
import UserProfile from "./pages/UserProfile";

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ title: "Lista de usuarios" }} name="UsersList" component={UsersList} />
      <Stack.Screen options={{ title: "Perfil del usuario" }} name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
