import React from "react"
import { useState } from "react"
import { StyleSheet, Text, TextInput, Pressable, View } from "react-native"

// import auth object to create the account
import { auth, db } from "../config/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SignInScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInClicked = async () => {
    console.log(`sign in clicked`);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, emailAddress, password);

      const userIDRef = doc(db, "user_profile", userCredentials.user.uid);
      const userDoc = await getDoc(userIDRef);

      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.userType === 'owner') {
          navigation.replace('Owner App', {userID: userCredentials.user.uid, userEmail: userCredentials.user.email, userData: userData});
        } else {
          alert('Access denied. You are not an owner.');
          auth.signOut();
        }
      } else {
        alert('No such user found.');
        auth.signOut();
      }
    } catch (err) {
      alert(`Error while signing in : ${err.code}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Owner App</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter Username"
        textContentType="emailAddress"
        autoCapitalize="none"
        returnKeyType="next"
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.inputStyle}
        placeholder="Enter Password"
        textContentType="password"
        autoCapitalize="none"
        returnKeyType="done"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <Pressable style={styles.buttonStyle} onPress={onSignInClicked}>
        <Text style={styles.buttonTextStyle}>Sign In</Text>
      </Pressable>

    </View>
  )
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 16,
  },
  inputStyle: {
    width: "100%",
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonStyle: {
    width: "100%",
    height: 50,
    marginVertical: 20,
    borderRadius: 8,
    backgroundColor: "#2d9cdb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonTextStyle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18
  }
});