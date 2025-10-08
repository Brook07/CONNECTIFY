import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import { Pressable, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BASE_URL } from "../../config/config"; // adjust the path as needed


export default function SignUpScreen() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const onShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }


  // handle submission of sign up form
  const handleSignUp = async () => {

    setError(undefined);

    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // checks whether clerk resources are loaded or not if not return null
    if (!isLoaded) return;

    // start sign up process using email and password provided
    try {
      // create a user based on the inputs
      // signUp.create() returns user/session state
      await signUp.create({
        emailAddress,
        password
      });

      // send code in the email to verify the email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // start the verification process i.e, take user to the verification page, set pendingVerification true
      setPendingVerification(true);
    }
    catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (err) {
        setError(err.errors);
      }
      // if (err.errors[0].code === 'form_identifier_exists') {
      //   setErrorMsg('The provided email address is already taken. Please provide another email address.')
      // }
    };
  };

  // handle submission of verification form
  const onVerifyPress = async () => {

    try {
      // attempt for verification with the code provided by the user against the code sent
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      // returns object with current signUp status, sessionid

      // if the verification process is completed set user to active and redirect to another page
      if (signUpAttempt.status === "complete") {
        // ✅ Send user email to backend MySQL
        // const response = await fetch(`${BASE_URL}/api/add-user`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ email: emailAddress }),
        // });

        // if (!response.ok) {
        //   console.log("API call failed!!");
        // }

        await setActive({ session: signUpAttempt.createdSessionId });

        router.replace('/');
      }
      else {
        // if the status is not 'complete' then check why
        console.error(JSON.stringify(error, null, 2));
      }
    }
    catch (err) {
      console.error(JSON.stringify(err, null, 2));
    };
  };

  if (!isLoaded) return <Text>Loading.....</Text>;

  // when the user starts verification process display the following content
  if (pendingVerification) {
    return (
      <View>
        <Text>Verify Your Email</Text>
        <TextInput
          placeholder='Enter your code!'
          value={code}
          onChangeText={setCode}
        />
        <Pressable onPress={onVerifyPress}>
          <Text>Verify</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Back Button
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity> */}

      {/* Heading */}
      <Text style={styles.title}>Lets{"\n"}Get Started</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Please fill the details to create an account</Text>

      {/* error messages */}
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

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#008000" style={styles.icon} />
        <TextInput
          autoCapitalize='none'
          placeholder="Enter your email"
          style={styles.input}
          value={emailAddress}
          onChangeText={(email) => setEmailAddress(email)}
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
          secureTextEntry={showPassword}
        />
        <TouchableOpacity onPress={onShowPassword} style={styles.icon}>
          <MaterialIcons name="visibility-off" size={19} />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => router.push('/login')}>
          Login
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    borderRadius: 10,
    backgroundColor: '#ffc8c8ff',
    marginBottom: 5,
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
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
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
  signupButton: {
    backgroundColor: '#008000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
  loginLink: {
    color: '#008000',
    fontWeight: '500',
  },
});