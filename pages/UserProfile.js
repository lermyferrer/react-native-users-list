import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Avatar } from "react-native-elements";

const UserProfile = ({ route }) => {
  const { login, avatarUrl, profileUrl } = route.params;
  return (
    <View style={styles.container}>
      <Avatar source={{ uri: avatarUrl }} rounded size="xlarge" />
      <Text style={styles.label}>Nombre de usuario:</Text>
      <Text style={styles.value}>{login}</Text>
      <Text style={styles.label}>Url Github:</Text>
      <Text style={styles.value}>{profileUrl}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 12
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
});

export default UserProfile;

