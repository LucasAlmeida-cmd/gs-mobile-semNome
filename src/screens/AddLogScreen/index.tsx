import React, { useState } from 'react';
import { ScrollView, Alert, View, ActivityIndicator } from 'react-native';
import { Input, Button, Text, CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { authService } from '../../services/auth';
import Header from '../../components/Header';
import { styles } from './style';

type AddLogScreenNavigation = NativeStackNavigationProp<RootStackParamList, 'AddLog'>;

const AddLogScreen: React.FC = () => {
  const navigation = useNavigation<AddLogScreenNavigation>();

  const [data, setData] = useState('');
  const [emocao, setEmocao] = useState('');
  const [horasSono, setHorasSono] = useState('');
  const [aguaLitros, setAguaLitros] = useState('');
  const [fezExercicio, setFezExercicio] = useState(false);
  const [descansouMente, setDescansouMente] = useState(false);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    data: '',
    emocao: '',
    horasSono: '',
    aguaLitros: '',
  });

  const validateFields = () => {
    const newErrors = { data: '', emocao: '', horasSono: '', aguaLitros: '' };
    let valid = true;

    if (!data) {
      newErrors.data = 'A data é obrigatória.';
      valid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      newErrors.data = 'Formato de data inválido. Use YYYY-MM-DD.';
      valid = false;
    }

    if (!emocao) {
      newErrors.emocao = 'A emoção é obrigatória.';
      valid = false;
    }

    if (!horasSono) {
      newErrors.horasSono = 'Informe quantas horas dormiu.';
      valid = false;
    } else if (isNaN(Number(horasSono)) || Number(horasSono) < 0 || Number(horasSono) > 24) {
      newErrors.horasSono = 'Informe um valor válido entre 0 e 24.';
      valid = false;
    }

    if (!aguaLitros) {
      newErrors.aguaLitros = 'Informe quantos litros de água bebeu.';
      valid = false;
    } else if (isNaN(Number(aguaLitros)) || Number(aguaLitros) < 0 || Number(aguaLitros) > 10) {
      newErrors.aguaLitros = 'Informe um valor válido entre 0 e 10.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddLog = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      await authService.logService.createLog({
        data,
        emocao,
        horasSono: Number(horasSono),
        aguaLitros: Number(aguaLitros),
        fezExercicio,
        descansouMente,
        notas,
      });
      Alert.alert('Sucesso', 'Log adicionado com sucesso!');
      navigation.goBack();
    } catch (err) {
      console.error('Erro ao adicionar log:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o log. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Text style={styles.title}>Novo Log</Text>

      <Input
        placeholder="Data (YYYY-MM-DD)"
        value={data}
        onChangeText={(text) => {
          setData(text);
          if (errors.data) setErrors({ ...errors, data: '' });
        }}
        inputStyle={styles.input}
        errorMessage={errors.data}
        leftIcon={<MaterialIcons name="date-range" size={20} color="#fff" />}
      />

      <Input
        placeholder="Emoção"
        value={emocao}
        onChangeText={(text) => {
          setEmocao(text);
          if (errors.emocao) setErrors({ ...errors, emocao: '' });
        }}
        inputStyle={styles.input}
        errorMessage={errors.emocao}
        leftIcon={<MaterialIcons name="mood" size={20} color="#fff" />}
      />

      <Input
        placeholder="Horas de sono"
        keyboardType="numeric"
        value={horasSono}
        onChangeText={(text) => {
          setHorasSono(text);
          if (errors.horasSono) setErrors({ ...errors, horasSono: '' });
        }}
        inputStyle={styles.input}
        errorMessage={errors.horasSono}
        leftIcon={<MaterialIcons name="bed" size={20} color="#fff" />}
      />

      <Input
        placeholder="Litros de água"
        keyboardType="numeric"
        value={aguaLitros}
        onChangeText={(text) => {
          setAguaLitros(text);
          if (errors.aguaLitros) setErrors({ ...errors, aguaLitros: '' });
        }}
        inputStyle={styles.input}
        errorMessage={errors.aguaLitros}
        leftIcon={<MaterialIcons name="opacity" size={20} color="#fff" />}
      />

      <CheckBox
        title="Fez exercício físico?"
        checked={fezExercicio}
        onPress={() => setFezExercicio(!fezExercicio)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkBoxText}
      />

      <CheckBox
        title="Descansou a mente?"
        checked={descansouMente}
        onPress={() => setDescansouMente(!descansouMente)}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkBoxText}
      />

      <Input
        placeholder="Notas (opcional)"
        value={notas}
        onChangeText={setNotas}
        inputStyle={styles.input}
        leftIcon={<MaterialIcons name="notes" size={20} color="#fff" />}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title={loading ? 'Salvando...' : 'Salvar Log'}
          onPress={handleAddLog}
          buttonStyle={styles.button}
          disabled={loading}
          icon={
            loading ? (
              <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />
            ) : undefined
          }
        />
      </View>
    </ScrollView>
  );
};

export default AddLogScreen;
