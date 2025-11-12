import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';


import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/DashboardScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import EditLogScreen from '../screens/EditLogScreen';
import AddLogScreen from '../screens/AddLogScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {user.role === 'usuario' && (
              <>
                <Stack.Screen
                  name="AdminDashboard"
                  component={AdminDashboardScreen}
                  options={{ title: 'Painel Administrativo' }}
                />
                <Stack.Screen
                  name="UserManagement"
                  component={UserManagementScreen}
                  options={{ title: 'Gerenciamento de Logs' }}
                />

                <Stack.Screen
                  name="UpdateProfile"
                  component={UpdateProfileScreen}
                  options={{ title: 'Editar Perfil' }}
                />

                <Stack.Screen
                  name="EditLog"
                  component={EditLogScreen}
                  options={{ title: 'Editar Log' }}
                />

                <Stack.Screen
                  name="AddLog"
                  component={AddLogScreen}
                  options={{ title: 'Novo Log' }}
                />


              </>
            )}

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Perfil' }}
            />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 
