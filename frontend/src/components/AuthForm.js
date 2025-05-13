  import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  background-color: #333;
  color: #eee;
  padding: 2rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 3px;
  background-color: #444;
  color: #eee;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #eee;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
`;

function AuthForm({ type, onSubmit, errorMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { username, password };
    if (type === 'signup') {
      data.email = email;
    }
    onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{type === 'signin' ? 'Авторизация' : 'Регистрация'}</h2>
      <Input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {type === 'signup' && (
        <Input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Button type="submit">{type === 'signin' ? 'Войти' : 'Зарегистрироваться'}</Button>
    </Form>
  );
}

export default AuthForm;