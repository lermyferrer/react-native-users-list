import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  View,
  Dimensions,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";

/**Components */
import ShowErrors from "./components/ShowErrors";

const UsersList = () => {
  const [inputValue, setInputValue] = useState({ user: "" });
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  const [chartData, setChartData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const urlApiGithubSearch = 'https://api.github.com/search/users';  

  const fetchUser = async () => {
    const searchTerm = inputValue.user.trim();
  
    if (searchTerm.length < 4) {
      setErrors(["El texto de búsqueda debe tener al menos 4 caracteres."]);
      setShowErrors(true);
      return;
    }
  
    if (searchTerm.toLowerCase() === "doublevpartners") {
      setErrors(["La búsqueda de doublevpartners no está permitida."]);
      setShowErrors(true);
      return;
    }
  
    try {
      const res = await fetch(`${urlApiGithubSearch}?q=${inputValue.user}`);
      const data = await res.json();
      if (data.items.length === 0) {
        setErrors(["Usuario no encontrado. Intente con otro nombre de usuario."]);
        setShowErrors(true);
      } else {
        setSearchResults(data.items.slice(0, 10));
        
        const followersUrls = data.items.slice(0, 10).map((user) => user.followers_url);
        
        const followersCounts = await Promise.all(
          followersUrls.map(async (followersUrl) => {
            const followersRes = await fetch(followersUrl);
            const followersData = await followersRes.json();
            return followersData.length;
          })
        );
        
        setChartData(followersCounts);
      }
    } catch (error) {
      console.error(error);
      setErrors(["Hubo un error al buscar usuarios. Por favor, inténtelo de nuevo."]);
      setShowErrors(true);
    }
  };
  

  const navigateToUserProfile = (user) => {
    navigation.navigate("UserProfile", {
      login: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
    });
  };

  const labels = searchResults.map((user) => {
    const truncatedName = user.login.length > 4 ? user.login.slice(0, 4) + "..." : user.login;
    return truncatedName;
  });
  

  return (
    <ScrollView>
      <SafeAreaView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese usuario a buscar..."
          onChangeText={(value) => setInputValue({ user: value })}
        />
        <Button title="Buscar" onPress={fetchUser} />
      </SafeAreaView>

      {searchResults.map((user) => (
        <ListItem
          key={user.id}
          bottomDivider
          onPress={() => navigateToUserProfile(user)}
        >
          <Avatar source={{ uri: user.avatar_url }} rounded size="medium" />
          <ListItem.Content>
            <ListItem.Title>{user.login}</ListItem.Title>
            <ListItem.Subtitle>{user.id}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}

      {searchResults.length > 1 && (
        <View style={{ flex: 1 }}>
          <BarChart
            data={{
              labels,
              datasets: [
                {
                  data: chartData,
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={200}
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.5
            }}
          />
        </View>
      )}

      {showErrors && (
        <ShowErrors
          errors={errors}
          onClose={() => {
            setShowErrors(false);
            setErrors([]);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#808080",
    marginBottom: 15,
    marginHorizontal: 20,
    marginTop: 12,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  buttonContainer: {
    marginHorizontal: 20,
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
    marginHorizontal: 20,
    paddingTop: 6,
  },
});

export default UsersList;
