import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    // const [secondFactor, setSecondFactor] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    useEffect(() => {
        if (isSignedIn) {
            router.replace('/');
        }
    }, [isSignedIn, router]);

    if (!isLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        )
    }

    // Send the password reset code to the user's email
    const create = async () => {
        if (!email.trim()) {
            setError('Please enter your email address')
            return
        }

        setLoading(true)
        setError('')

        try {
            await signIn?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            setSuccessfulCreation(true)
            setError('')
        } catch (err) {
            console.error('error', err.errors?.[0]?.longMessage)
            setError(err.errors?.[0]?.longMessage || 'An error occurred')
        } finally {
            setLoading(false)
        }
    };

    // Reset the user's password.
    // Upon successful reset, the user will be
    // signed in and redirected to the home page
    const reset = async () => {
        if (!code.trim() || !password.trim()) {
            setError('Please enter both the code and new password.')
            return;
        }

        setLoading(true)
        setError('')

        try {
            const reset = await signIn?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })

            if (reset?.status === 'needs_second_factor') {
                setSecondFactor(true)
            } else if (reset?.status === 'complete') {
                // Set the active session to
                // the newly created session (user is now signed in)
                await setActive({ session: reset.createdSessionId });
                // Navigation will be handled by the useEffect hook
            } else {
                console.log(reset);
            }
        } catch (err) {
            console.error(err.errors?.[0]?.longMessage);
            setError(err.errors?.[0]?.longMessage || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!successfulCreation) {
            create();
        } else {
            reset();
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Forgot Password?</Text>

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

                    {!successfulCreation ? (
                        <View style={styles.formSection}>
                            <Text style={styles.label}>Provide your email address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g john@doe.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Send password reset code</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.formSection}>
                            <Text style={styles.label}>Enter your new password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="New password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />

                            <Text style={styles.label}>
                                Enter the password reset code that was sent to your email
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Reset code"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Reset</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

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
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
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

export default ForgotPasswordScreen;