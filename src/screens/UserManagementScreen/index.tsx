  import React, { useState, useCallback } from 'react';
  import { ScrollView, ActivityIndicator, View } from 'react-native';
  import { Button, Text } from 'react-native-elements';
  import { useNavigation } from '@react-navigation/native';
  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { useFocusEffect } from '@react-navigation/native';
  import { MaterialIcons } from '@expo/vector-icons';
  import { RootStackParamList } from '../../types/navigation';
  import Header from '../../components/Header';
  import { authService } from '../../services/auth';
  import { useApi } from '../../hooks/useApi';

  import {
    styles,
    Container,
    Title,
    LogCard, 
    LogHeader, 
    LogDetails, 
    LoadingText,
    EmptyText,
    ButtonContainer,
    RetryText 
  } from "../UserManagementScreen/style"

  type UserManagementScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
  };

  interface Log {
    id: number;
    data: string;
    emocao: string;
    horasSono: number;
    aguaLitros: number;
    fezExercicio: boolean;
    descansouMente: boolean;
    notas: string;
    usuarioId: number;
  }

  const UserManagementScreen: React.FC = () => {
    const navigation = useNavigation<UserManagementScreenProps['navigation']>();
    const { data: logs, loading, error, execute: refreshLogs } = useApi<Log[]>(authService.logService.getLogs);

    const [deletingLogs, setDeletingLogs] = useState<Record<number, boolean>>({});

    const handleDelete = async (id: number) => {
      setDeletingLogs(prev => ({ ...prev, [id]: true }));
      try {
        await authService.deleteLog(id);
        await refreshLogs();
      } catch (err) {
        console.error("Erro ao deletar log:", err);
      } finally {
        setDeletingLogs(prev => ({ ...prev, [id]: false }));
      }
    };

    useFocusEffect(
      useCallback(() => {
        refreshLogs();
      }, [])
    );

    return (
      <Container>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title>Meus Logs</Title>

          {loading ? (

            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <LoadingText>Carregando Logs...</LoadingText>
            </View>
          ) : error ? (

            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={40} color="#ff6b6b" />
              <Text style={styles.errorText}>Erro ao carregar logs</Text>
              <RetryText onPress={refreshLogs}>Tentar novamente</RetryText>
            </View>
          ) : !logs || logs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={40} color="#929292" />
              <EmptyText >Nenhum log cadastrado</EmptyText>
            </View>
          ) : (
            logs.map((log) => (
              <LogCard key={log.id}>
                
                <LogHeader>

                  <Text style={styles.LogIdentificacao}>{log.data}</Text>

                  <Text style={styles.LogEmocao}>{log.emocao}</Text>
                </LogHeader>
                
                <LogDetails>

                  <Text style={styles.LogDetail}>💤 Horas de sono: **{log.horasSono}h**</Text>
                  <Text style={styles.LogDetail}>💧 Água: **{log.aguaLitros}L**</Text>
                  <Text style={styles.LogDetail}>💪 Exercício: **{log.fezExercicio ? 'Sim' : 'Não'}**</Text>
                  <Text style={styles.LogDetail}>🧘 Descanso mental: **{log.descansouMente ? 'Sim' : 'Não'}**</Text>
                  <Text style={styles.LogDetail}>📝 Notas: {log.notas || '*Sem notas*'}</Text>
                </LogDetails>

                <ButtonContainer>
                  <Button
                    title={deletingLogs[log.id] ? "" : "Deletar"}
                    onPress={() => handleDelete(log.id)}
                    containerStyle={styles.actionButton}
                    buttonStyle={styles.deleteButton}
                    titleStyle={styles.deleteButtonText}
                    disabled={deletingLogs[log.id]}
                    icon={deletingLogs[log.id] ?
                      <ActivityIndicator size="small" color="#ffffff" /> :
                      <MaterialIcons name="delete" size={16} color="#ffffff" style={{ marginRight: 5 }} />}
                  />

                  <Button
                    title="Editar"
                    onPress={() => navigation.navigate('EditLog', { logId: log.id })}
                    containerStyle={styles.actionButton}
                    buttonStyle={styles.updateButton}
                    titleStyle={styles.updateButtonText}
                    icon={<MaterialIcons name="edit" size={16} color="#ffffff" style={{ marginRight: 5 }} />}
                  />
                </ButtonContainer>
              </LogCard>

            ))
          )}
        </ScrollView>
      </Container>
    );
  };

  export default UserManagementScreen;