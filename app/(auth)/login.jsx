import { router } from 'expo-router';
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { BASE_URL } from "../../config/config"; // adjust the path as needed

import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const onShowPassword = () => {
    if (hidePassword) {
      setHidePassword(false);
    } else {
      setHidePassword(true);
    }
  }

  const handleLogin = async () => {

    setError(undefined);
    console.log("login pressed");

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password
      });

      if (signInAttempt.status === "complete") {
        console.log("signin in successful");


      // ✅ Send user email to backend MySQL
      await fetch(`${BASE_URL}/api/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    }
    catch (err) {
      console.error(JSON.stringify(err, null, 2))
      if (err) {
        setError(err.errors);
      }
    }
  };

  if (!isLoaded) return <Text>Loading.....</Text>;

  return (
    <View style={styles.container}>

      {/* Heading */}
      <Text style={styles.title}>Hey,{"\n"}Welcome Back</Text>

      {/* error handling when credentials do not match or account not found  */}
      {
        error &&
        <View style={styles.errorContainer}>
          <FlatList
            data={error}
            renderItem={(item) => {
              { console.log(item.item.longMessage); }
              return (
                <View key={item.item.code} style={{ flexDirection: 'row', padding: 6 }}>
                  <MaterialIcons name='error-outline' size={23} color='red' />
                  <Text style={styles.errorMsg}>{item.item.longMessage}</Text>
                </View>
              )
            }}
          />
        </View>
      }

      {/* Subtitle */}
      {/* <Text style={styles.subtitle}>Please login to continue</Text> */}

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#008000" style={styles.icon} />
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={[styles.inputContainer, { justifyContent: 'space-between' }]}>
        <Ionicons name="lock-closed-outline" size={20} color="#008000" style={styles.icon} />
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity onPress={onShowPassword} style={styles.icon}>
          <MaterialIcons name="visibility-off" size={19} />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => { }} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}
        onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/signup')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

// export default LoginScreen;

const styles = StyleSheet.create({
  errorContainer: {
    borderRadius: 10,
    backgroundColor: '#ffc8c8ff',
    marginBottom: 7,
    marginHorizontal: 1,
  },
  errorMsg: {
    paddingHorizontal: 5,
    fontSize: 15,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 10,
  },
  forgotText: {
    color: 'gray',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#008000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
  signupLink: {
    color: '#008000',
    fontWeight: '500',
  },
});
