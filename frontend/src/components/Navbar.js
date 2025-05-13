import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faServer, faListAlt } from '@fortawesome/free-solid-svg-icons';

const Nav = styled.nav`
  background-color: #222;
  color: #eee;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleAndStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled(Link)`
  color: #eee;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavButton = styled(Link)`
  background-color: #6c757d;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #5a6268;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled(Link)`
  background-color: #444;
  color: #eee;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const ProfileIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const LogoutButton = styled.button`
  background-color: #d9534f;
  color: #eee;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

const RoleDisplay = styled.span`
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
`;

const AddProblemButton = styled(Link)`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-right: 1rem;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Navbar({ onAuthChange }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      setIsLoggedIn(!!token);
      if (onAuthChange) {
        onAuthChange(!!token);
      }
    }, [onAuthChange]);

    const handleLogout = async () => {
      try {
        await axios.post(`${API_BASE_URL}/logout`);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/');
        if (onAuthChange) {
          onAuthChange(false);
        }
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    };

    const role = localStorage.getItem('role');
    return (
      <Nav>
        <TitleAndStatus>
          <Title to="/">CodeX Platform</Title>
            <>
              <NavButton to="/problems">
                <FontAwesomeIcon icon={faListAlt} />
                Задачи
              </NavButton>
            </>
          {isLoggedIn && (
            <>
              <NavButton to="/system-status">
                <FontAwesomeIcon icon={faServer} />
                Состояние системы
              </NavButton>
            </>
          )}
        </TitleAndStatus>
        <AuthButtons>
          {isLoggedIn && role === 'ROLE_ADMIN' && (
            <AddProblemButton to="/add-problem">
              <FontAwesomeIcon icon={faPlusSquare} />
              <span>Добавить</span>
            </AddProblemButton>
          )}
          {isLoggedIn ? (
            <>
              {role && <RoleDisplay>{role === 'ROLE_ADMIN' ? 'Админ' : ''}</RoleDisplay>}
              <ProfileIcon>👤</ProfileIcon>
              <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
            </>
          ) : (
            <>
              <Button to="/auth/sign-in">Войти</Button>
              <Button to="/auth/sign-up">Зарегистрироваться</Button>
            </>
          )}
        </AuthButtons>
      </Nav>
    );
  }

  export default Navbar;