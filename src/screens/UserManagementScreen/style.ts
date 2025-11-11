import styled from 'styled-components/native';
import theme from '../../styles/theme';

export const styles = {
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  actionButton: {
    width: '48%',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontFamily: 'KdamThmorPro',
    color: '#fff',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
  },
  updateButtonText: {
    fontFamily: 'KdamThmorPro',
    color: '#fff',
    fontSize: 14,
  },

  LogIdentificacao: { 
    fontSize: 20,
    fontFamily: 'KdamThmorPro',
    fontWeight: 'bold',
    color: theme.colors.verde, 
    marginRight: 10,
  },
  LogEmocao: { 
    fontSize: 18,
    fontFamily: 'KdamThmorPro',
    color: '#e0e0e0',
    textTransform: 'capitalize' as const, 
  },
  LogDetail: { 
    color: '#bdbdbd',
    marginBottom: 4,
    fontSize: 14,
  },

  loadingContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    marginVertical: 10,
    textAlign: 'center' as const,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 40,
  },
};

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.fundoPadrao};
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  font-family: 'KdamThmorPro';
  color: ${theme.colors.verde};
  margin-bottom: 25px;
  text-align: center;
`;

export const LogCard = styled.View`
  background-color: #2a2a2a;
  border-radius: 12px;
  border-width: 1px;
  border-color: #3d3d3d;
  margin-bottom: 15px;
  padding: 15px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  elevation: 6;
`;

export const LogHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom-width: 1px;
  border-bottom-color: #3d3d3d;
`;

export const LogDetails = styled.View`
  margin-bottom: 10px;
`;

export const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  margin-top: 20px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

export const RetryText = styled.Text`
  color: #fff;
  margin-top: 10px;
  font-size: 14px;
  text-decoration-line: underline;
`;