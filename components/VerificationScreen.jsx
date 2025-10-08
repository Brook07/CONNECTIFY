import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from 'expo-router';
import { useSignUp, useAuth } from '@clerk/clerk-expo';
import { BASE_URL } from "../config/config"; // adjust the path as needed

const VerificationScreen = ({ emailAddress }) => {
    const { signUp, isLoaded, setActive } = useSignUp();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const onVerifyPress = async () => {

        setLoading(true);
        try {
            // attempt for verification with the code provided by the user against the code sent
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
            // returns object with current signUp status, sessionid

            // if the verification process is completed set user to active and redirect to another page
            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId });
                console.log("signup successful");
                router.replace('/set_preferences');
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                try {
                    const token = await getToken();
                    console.log('Token present:', !!token);
                    console.log('Calling API to add user:', `${BASE_URL}/api/add-user`);
                    // Send user email to backend MySQL
                    const response = await fetch(`${BASE_URL}/api/add-user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ email: emailAddress }),
                    });

                    console.log('Response status:', response.status);
                    const data = await response.json();
                    console.log('Response data:', data);

                    if (!response.ok) {
                        console.log("API call failed", response.ok);
                    }
                } catch (error) {
                    console.error("Error adding user:", error);
                }


            }
            else {
                // if the status is not 'complete' then check why
                console.error(JSON.stringify(error, null, 2));
            }
        }
        catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.longMessage);
            setLoading(false);
        };
    };

    if (!isLoaded) return <Text>Loading.......</Text>;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Verify Your Email</Text>

                    {/* error handling when credentials do not match or account not found  */}
                    {
                        error &&
                        <View style={styles.errorContainer}>
                            <View style={{ flexDirection: 'row', padding: 6 }}>
                                <MaterialIcons name='error-outline' size={23} color='red' />
                                <Text style={styles.errorMsg}>{error}</Text>
                            </View>
                        </View>
                    }
                    <Text style={styles.label}>
                        Enter the verification code that was sent to your email
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Verification Code"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus={true}
                        editable={!loading}
                    />

                    <View style={styles.formSection}>
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={onVerifyPress}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#008000" />
                            ) : (
                                <Text style={styles.buttonText}>Verify</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        borderRadius: 8,
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
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        marginHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    formSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#008000',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 30,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    infoText: {
        color: '#007AFF',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
})

export default VerificationScreen;