import React, { useState } from 'react';
import { View, Alert, ScrollView, Platform, ToastAndroid } from 'react-native'; 
import { Input, Button, Text } from 'react-native-elements'; 
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './style'; 

type UpdateProfileScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UpdateProfile'>;
};


interface FormErrors {
    nomeUser?: string;
    email?: string;
    cpfUser?: string;
    dataAniversario?: string;
    password?: string;
    geral?: string; 
}

const UpdateProfileScreen: React.FC = () => {

    const navigation = useNavigation<UpdateProfileScreenProps['navigation']>();
    const { user, updateUser } = useAuth();

  
    const [nome, setNome] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [cpfUser, setCpf] = useState(user?.cpfUser || '');
    const [dataAniversario, setDataAniversario] = useState(user?.dataAniversario || '');
    const [password, setPassword] = useState(''); 


    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});



    const validateFields = (): boolean => {
        const newErrors: FormErrors = {};
        if (!nome) {
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
        if (password && password.length < 6) { 
            newErrors.password = 'A nova senha deve ter no mínimo 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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


    const handleUpdate = async () => {
        if (!user?.id) {
            setErrors({ geral: 'Usuário não autenticado. Faça login novamente.' });
            return;
        }
        if (!validateFields()) {
            return;
        }

        setLoading(true);
        setErrors({}); 
        const updateData: any = {
            nomeUser: nome,
            email,
            cpfUser,
            dataAniversario,
        };

        if (password) {
            updateData.password = password;
        }

        try {
            await updateUser(user.id, updateData);

            if (Platform.OS === 'android') {
                ToastAndroid.show('Perfil atualizado com sucesso!', ToastAndroid.SHORT);
            } else {
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            }
            navigation.goBack();

        } catch (error: any) {
            console.error(error);
            setErrors({ geral: error.message || 'Não foi possível atualizar o perfil.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Input
                label="Nome"
                value={nome}
                onChangeText={onInputChange(setNome, 'nomeUser')}
                inputStyle={styles.input}
                errorMessage={errors.nomeUser}
            />

            <Input
                label="Email"
                value={email}
                onChangeText={onInputChange(setEmail, 'email')}
                inputStyle={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email}
            />

            <Input
                label="CPF"
                value={cpfUser}
                onChangeText={onInputChange(setCpf, 'cpfUser')}
                inputStyle={styles.input}
                keyboardType="numeric"
                errorMessage={errors.cpfUser}
            />

            <Input
                placeholder="Data de nascimento (yyyy-MM-dd)"
                label="Data de nascimento" 
                value={dataAniversario}
                onChangeText={onInputChange(setDataAniversario, 'dataAniversario')}
                inputStyle={styles.input}
                errorMessage={errors.dataAniversario}
            />

            <Input
                label="Nova senha (opcional, mín. 6 caracteres)"
                value={password}
                onChangeText={onInputChange(setPassword, 'password')}
                secureTextEntry
                inputStyle={styles.input}
                errorMessage={errors.password}
            />

          
            {errors.geral ? <Text style={styles.errorText}>{errors.geral}</Text> : null}


            <Button
                title="Salvar alterações"
                onPress={handleUpdate}
                buttonStyle={styles.saveButton}
                loading={loading}
            />

            <Button
                title="Cancelar"
                type="outline"
                onPress={() => navigation.goBack()}
                buttonStyle={styles.cancelButton}
                disabled={loading} 
            />
        </ScrollView>
    );
};

export default UpdateProfileScreen;