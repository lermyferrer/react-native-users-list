import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TextInput, Button, SafeAreaView } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const UsersList = () => {
  const [inputValue, setInputValue] = useState({ user: "" });
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("https://api.github.com/users");
      const data = await res.json();
      setSearchResults(data.slice(0, 10));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    const searchTerm = inputValue.user.trim();

    if (!searchTerm) {
      fetchAllUsers()
        return;
    }

    if (searchTerm.length < 4) {
      alert('El texto de búsqueda debe tener al menos 4 caracteres.');
      return;
    }

    if (searchTerm.toLowerCase() === 'doublevpartners') {
      alert('La búsqueda de "doublevpartners" no está permitida.');
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/search/users?q=${inputValue.user}`
      );
      const data = await res.json();
      setSearchResults(data.items.slice(0, 10));
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToUserProfile = (user) => {
    navigation.navigate("UserProfile", {
      login: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
    });
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

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
        <ListItem key={user.id} bottomDivider onPress={() => navigateToUserProfile(user)}>
          <Avatar source={{ uri: user.avatar_url }} rounded size="medium" />
          <ListItem.Content>
            <ListItem.Title>{user.login}</ListItem.Title>
            <ListItem.Subtitle>{user.id}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
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
    borderRadius: 8
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