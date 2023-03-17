import { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function verifyAvailableAuthentication() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    console.log(compatible);

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log(types.map(type => LocalAuthentication.AuthenticationType[type]));
  }

  async function handleAuthentication() {
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isBiometricEnrolled) {
      return Alert.alert('Login', 'Nenhuma biometria encontrada. Cadastre uma biometria no dispositivo.');
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login com biometria',
      fallbackLabel: 'Biometria não reconhecida'
    });

    setIsAuthenticated(auth.success);
  }

  useEffect(() => {
    verifyAvailableAuthentication();
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        Usuario autenticado: {isAuthenticated ?
          <AntDesign name="like2" size={15} color="black" />  :
          <MaterialIcons name="block" size={24} color="black" />
        }
      </Text>

      <Button
        title='Entrar'
        onPress={handleAuthentication}
      />
    </View>
  );
}
