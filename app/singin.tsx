//singin.tsx
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '@/context/authContext/AuthContext';

export default function SignIn() {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signIn} = useContext(AuthContext);

    async function handleLogin() {
        const response = await signIn(email, password);
        if (response) {
            router.replace('/(tabs)/home');
        } else {
            console.log('Hubo un error ingresando');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Iniciar sesión</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail} // Aquí usamos el estado
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword} // Aquí también
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Ingresar" onPress={handleLogin} />
            </View>

            <View style={styles.linkContainer}>
                <Link href="/singup">
                    <Text style={styles.linkText}>¿No tienes una Cuenta? - Crea una cuenta</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    textContainer: {
        marginBottom: 30,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    inputContainer: {
        marginVertical: 10,
        width: '80%',
    },
    input: {
        padding: 10,
        paddingHorizontal: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonContainer: {
        marginTop: 20,
        width: '80%',
    },
    linkContainer: {
        marginTop: 20,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
