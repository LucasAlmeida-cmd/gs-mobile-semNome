import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { authService } from '../../services/auth';
import Header from '../../components/Header';
import { styles, Container, Title } from './style';

type EditLogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditLog'>;

interface RouteParams {
  logId: number;
}

const EditLogScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<EditLogScreenNavigationProp>();
  const { logId } = route.params as RouteParams;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [log, setLog] = useState<any>(null);

  const [errors, setErrors] = useState({
    data: '',
    emocao: '',
    horasSono: '',
    aguaLitros: '',
  });

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const data = await authService.logService.getLogById(logId);
        setLog(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o log.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [logId]);

  const validateFields = () => {
    const newErrors = { data: '', emocao: '', horasSono: '', aguaLitros: '' };
    let valid = true;

    if (!log.data) {
      newErrors.data = 'A data é obrigatória.';
      valid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(log.data)) {
      newErrors.data = 'Formato inválido. Use YYYY-MM-DD.';
      valid = false;
    }

    if (!log.emocao) {
      newErrors.emocao = 'A emoção é obrigatória.';
      valid = false;
    }

    if (!log.horasSono && log.horasSono !== 0) {
      newErrors.horasSono = 'Informe as horas de sono.';
      valid = false;
    } else if (isNaN(Number(log.horasSono)) || log.horasSono < 0 || log.horasSono > 24) {
      newErrors.horasSono = 'Valor inválido (0 a 24).';
      valid = false;
    }

    if (!log.aguaLitros && log.aguaLitros !== 0) {
      newErrors.aguaLitros = 'Informe os litros de água.';
      valid = false;
    } else if (isNaN(Number(log.aguaLitros)) || log.aguaLitros < 0 || log.aguaLitros > 10) {
      newErrors.aguaLitros = 'Valor inválido (0 a 10).';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;

    setSaving(true);
    try {
      await authService.logService.updateLog(logId, log);
      Alert.alert('Sucesso', 'Log atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o log. Tente novamente.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando log...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Log</Title>

        <Input
          label="Data"
          value={log.data}
          onChangeText={(text) => {
            setLog({ ...log, data: text });
            if (errors.data) setErrors({ ...errors, data: '' });
          }}
          placeholder="AAAA-MM-DD"
          inputStyle={styles.input}
          labelStyle={styles.label}
          errorMessage={errors.data}
          leftIcon={<MaterialIcons name="date-range" size={20} color="#fff" />}
        />

        <Input
          label="Emoção"
          value={log.emocao}
          onChangeText={(text) => {
            setLog({ ...log, emocao: text });
            if (errors.emocao) setErrors({ ...errors, emocao: '' });
          }}
          placeholder="Como você se sentiu?"
          inputStyle={styles.input}
          labelStyle={styles.label}
          errorMessage={errors.emocao}
          leftIcon={<MaterialIcons name="mood" size={20} color="#fff" />}
        />

        <Input
          label="Horas de Sono"
          keyboardType="numeric"
          value={String(log.horasSono)}
          onChangeText={(text) => {
            setLog({ ...log, horasSono: parseInt(text) || 0 });
            if (errors.horasSono) setErrors({ ...errors, horasSono: '' });
          }}
          inputStyle={styles.input}
          labelStyle={styles.label}
          errorMessage={errors.horasSono}
          leftIcon={<MaterialIcons name="bed" size={20} color="#fff" />}
        />

        <Input
          label="Litros de Água"
          keyboardType="numeric"
          value={String(log.aguaLitros)}
          onChangeText={(text) => {
            setLog({ ...log, aguaLitros: parseFloat(text) || 0 });
            if (errors.aguaLitros) setErrors({ ...errors, aguaLitros: '' });
          }}
          inputStyle={styles.input}
          labelStyle={styles.label}
          errorMessage={errors.aguaLitros}
          leftIcon={<MaterialIcons name="opacity" size={20} color="#fff" />}
        />

        <Input
          label="Notas"
          value={log.notas}
          onChangeText={(text) => setLog({ ...log, notas: text })}
          placeholder="Adicione observações..."
          inputStyle={styles.input}
          labelStyle={styles.label}
          leftIcon={<MaterialIcons name="notes" size={20} color="#fff" />}
        />

        <Button
          title={saving ? 'Salvando...' : 'Salvar Alterações'}
          onPress={handleUpdate}
          loading={saving}
          buttonStyle={styles.saveButton}
          icon={
            <MaterialIcons
              name="save"
              size={20}
              color="#fff"
              style={{ marginRight: 5 }}
            />
          }
        />
      </ScrollView>
    </Container>
  );
};

export default EditLogScreen;
