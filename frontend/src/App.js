import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProblemsPage from './pages/ProblemsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProblemDetailsPage from './pages/ProblemDetailsPage';
import AddProblemPage from './pages/AddProblemPage';
import SystemStatusPage from './pages/SystemStatusPage';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background-color: #111;
    color: #eee;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  flex-grow: 1;
`;

const NotFoundPage = () => (
  <div style={{ color: "#eee" }}>
    <h2>Ошибка 404</h2>
    <p>Страница не найдена</p>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();

  const handleAuthChange = (loggedIn) => {
    setIsAuthenticated(loggedIn);
    setUserRole(localStorage.getItem('role'));
  };

  useEffect(() => {
    const setupAxiosInterceptors = () => {
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          console.log(error);
          if (error.response) {
            if (error.response.status === 401) {
              localStorage.removeItem('jwtToken');
              localStorage.removeItem('username');
              localStorage.removeItem('role');
              setIsAuthenticated(false);
              navigate('/auth/sign-in');
              return Promise.reject(error);
            } else if (error.response.status === 403) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                setIsAuthenticated(false);
                navigate('/auth/sign-in');
                return Promise.reject(error);
            }
          }
          
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptors();
  }, [navigate, setIsAuthenticated, setUserRole]);

  return (
    <AppContainer>
      <GlobalStyle />
      <Navbar onAuthChange={handleAuthChange} />
      <Content>
        <Routes>
        <Route path="/" element={<Navigate to="/problems" />} />
          <Route path="/problems" element={<ProblemsPage isAuthenticated={isAuthenticated} />} />
          <Route path="/problem/:id" element={<ProblemDetailsPage isAuthenticated={isAuthenticated} />} />
          <Route path="/auth/sign-in" element={<SignInPage onAuthSuccess={handleAuthChange} />} />
          <Route path="/auth/sign-up" element={<SignUpPage onAuthSuccess={handleAuthChange} />} />
          <Route path="/system-status" element={<SystemStatusPage isAuthenticated={isAuthenticated} />} /> {/* Добавляем новый маршрут */}
          <Route
            path="/add-problem"
            element={
              isAuthenticated && userRole === 'ROLE_ADMIN' ? (
                <AddProblemPage />
              ) : (
                <NotFoundPage/>
              )
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
    </AppContainer>
  );
}

export default App;