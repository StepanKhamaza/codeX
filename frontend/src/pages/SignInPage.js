import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #111;
`;

const API_BASE_URL = process.env.REACT_APP_API_AUTH_URL;

function SignInPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sign-in`, userData);
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);

      try {
        const decodedToken = jwtDecode(token);
        localStorage.setItem('username', decodedToken.sub);
        localStorage.setItem('role', decodedToken.role);
      } catch (decodeError) {
        console.error('Ошибка декодирования токена:', decodeError);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setErrorMessage('Ошибка при обработке данных пользователя.');
        return;
      }

      if (onAuthSuccess) {
        onAuthSuccess(true);
      }
      navigate('/');
    } catch (error) {
      console.error('Ошибка входа:', error.response?.data?.error || error.message);
      setErrorMessage(error.response?.data?.error || 'Не удалось выполнить вход.');
    }
  };

  return (
    <Container>
      <AuthForm type="signin" onSubmit={handleSignIn} errorMessage={errorMessage} />
    </Container>
  );
}

export default SignInPage;