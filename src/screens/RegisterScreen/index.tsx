import React, { useState } from 'react';
import { View, Alert, ToastAndroid, Platform, ScrollView } from 'react-native'; 
import { Input, Button, Text } from 'react-native-elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { styles, Container, Title, ErrorText } from '../LoginScreen/styles';
import { useAuth } from '../../contexts/AuthContext';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};


interface FormErrors {
    nomeUser?: string;
    email?: string;
    cpfUser?: string;
    dataAniversario?: string;
    password?: string;
    geral?: string;
}

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<RegisterScreenProps['navigation']>();

    const [nomeUser, setNomeUser] = useState('');
    const [email, setEmail] = useState('');
    const [cpfUser, setCpfUser] = useState('');
    const [dataAniversario, setDataAniversario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    

    const [errors, setErrors] = useState<FormErrors>({});
    const { register } = useAuth();

    const validateFields = (): boolean => {
        const newErrors: FormErrors = {};
        if (!nomeUser) {
            newErrors.nomeUser = 'O nome é obrigatório';
        }

        if (!email) {
            newErrors.email = 'O email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            newErrors.email = 'O email informado é inválido';
        }
        if (!cpfUser) {
            newErrors.cpfUser = 'O CPF é obrigatório';
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpfUser)) {
            newErrors.cpfUser = 'Formato de CPF inválido (use 000.000.000-00)';
        }

        if (!dataAniversario) {
            newErrors.dataAniversario = 'A data é obrigatória';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataAniversario)) {
            newErrors.dataAniversario = 'Formato de data inválido (use yyyy-MM-dd)';
        }
        if (!password) {
            newErrors.password = 'A senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleRegister = async () => {
        if (!validateFields()) {
            return; 
        }

        try {
            setLoading(true);
            setErrors({});

            await register({ nomeUser, email, cpfUser, dataAniversario, password });

            if (Platform.OS === 'android') {
                ToastAndroid.show('Conta criada com sucesso!', ToastAndroid.SHORT);
            } else {
                Alert.alert('Sucesso', 'Conta criada com sucesso!');
            }

            navigation.navigate('Login');


            setNomeUser('');
            setEmail('');
            setCpfUser('');
            setDataAniversario('');
            setPassword('');

        } catch (err: any) {
            setErrors({ geral: err.message || 'Erro ao criar conta. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (setter: (text: string) => void, fieldName: keyof FormErrors) => {
        return (text: string) => {
            setter(text);
            if (errors[fieldName]) {
                setErrors(prev => ({ ...prev, [fieldName]: undefined }));
            }
            if (errors.geral) {
                setErrors(prev => ({...prev, geral: undefined}));
            }
        }
    };


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Container>
                <Title>Criar Conta</Title>
                <Input 
                    placeholder="Nome completo" 
                    value={nomeUser} 
                    onChangeText={onInputChange(setNomeUser, 'nomeUser')} 
                    containerStyle={styles.input} 
                    inputContainerStyle={styles.inputContainer} 
                    inputStyle={styles.inputText}
                    errorMessage={errors.nomeUser} 
                />
                <Input 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={onInputChange(setEmail, 'email')} 
                    autoCapitalize="none" 
                    keyboardType="email-address" 
                    containerStyle={styles.input} 
                    inputContainerStyle={styles.inputContainer} 
                    inputStyle={styles.inputText}
                    errorMessage={errors.email}
                />
                <Input 
                    placeholder="CPF (000.000.000-00)" 
                    value={cpfUser} 
                    onChangeText={onInputChange(setCpfUser, 'cpfUser')} 
                    keyboardType="numeric"
                    containerStyle={styles.input} 
                    inputContainerStyle={styles.inputContainer} 
                    inputStyle={styles.inputText}
                    errorMessage={errors.cpfUser}
                />
                <Input 
                    placeholder="Data de nascimento (yyyy-MM-dd)" 
                    value={dataAniversario} 
                    onChangeText={onInputChange(setDataAniversario, 'dataAniversario')} 
                    containerStyle={styles.input} 
                    inputContainerStyle={styles.inputContainer} 
                    inputStyle={styles.inputText}
                    errorMessage={errors.dataAniversario}
                />
                <Input 
                    placeholder="Senha (mín. 6 caracteres)" 
                    value={password} 
                    onChangeText={onInputChange(setPassword, 'password')} 
                    secureTextEntry 
                    containerStyle={styles.input} 
                    inputContainerStyle={styles.inputContainer} 
                    inputStyle={styles.inputText}
                    errorMessage={errors.password}
                />
                {errors.geral ? <ErrorText>{errors.geral}</ErrorText> : null}

                <Button
                    title="Cadastrar"
                    onPress={handleRegister}
                    loading={loading}
                    containerStyle={styles.button as any}
                    buttonStyle={styles.buttonStyle}
                    titleStyle={styles.inputTextEnviar}
                />
            </Container>
        </ScrollView>
    );
};

export default RegisterScreen;