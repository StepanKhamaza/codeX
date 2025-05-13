import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  padding: 2rem;
  background-color: #111;
  color: #eee;
  min-height: 80vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #bbb;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #eee;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #eee;
  width: 100%;
  box-sizing: border-box;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #eee;
  width: 100%;
  box-sizing: border-box;
`;

const TestCasesContainer = styled.div`
  margin-top: 1.5rem;
`;

const TestCase = styled.div`
  border: 1px solid #555;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
`;

const TestCaseLabel = styled.h4`
  color: #ddd;
  grid-column: 1 / span 2;
  margin-bottom: 0.5rem;
`;

const RemoveTestCaseButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 1rem;
  grid-column: 3;
`;

const AddTestCaseButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 2rem;

  &:hover {
    background-color: #218838;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AddProblemPage() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [problemDifficulty, setProblemDifficulty] = useState('EASY');
  const [timeLimit, setTimeLimit] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [testcases, setTestcases] = useState([
    { input: '', output: '' },
    { input: '', output: '' },
    { input: '', output: '' },
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddTestCase = () => {
    setTestcases([...testcases, { input: '', output: '' }]);
  };

  const handleRemoveTestCase = (index) => {
    if (testcases.length > 1) {
      const newTestcases = [...testcases];
      newTestcases.splice(index, 1);
      setTestcases(newTestcases);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newTestcases = [...testcases];
    newTestcases[index][field] = value;
    setTestcases(newTestcases);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title.trim()) {
      setErrorMessage('Название задачи не может быть пустым.');
      return;
    }
    if (!text.trim()) {
      setErrorMessage('Описание задачи не может быть пустым.');
      return;
    }
    if (!inputFormat.trim()) {
      setErrorMessage('Формат ввода не может быть пустым.');
      return;
    }
    if (!outputFormat.trim()) {
      setErrorMessage('Формат вывода не может быть пустым.');
      return;
    }
    if (!timeLimit.trim()) {
      setErrorMessage('Время на исполнение не может быть пустым.');
      return;
    }
    if (isNaN(parseFloat(timeLimit)) || parseFloat(timeLimit) <= 0) {
      setErrorMessage('Время на исполнение должно быть положительным числом.');
      return;
    }
    if (!memoryLimit.trim()) {
      setErrorMessage('Ограничение по памяти не может быть пустым.');
      return;
    }
    if (isNaN(parseFloat(memoryLimit)) || parseFloat(memoryLimit) <= 0) {
      setErrorMessage('Ограничение по памяти должно быть положительным числом.');
      return;
    }

    if (testcases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      setErrorMessage('В каждом тест кейсе должны быть заполнены поля ввода и вывода.');
      return;
    }

    const problemData = {
      title,
      text,
      inputFormat,
      outputFormat,
      problemDifficulty,
      timeLimit: parseFloat(timeLimit),
      memoryLimit: parseFloat(memoryLimit),
      testcases,
    };

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setErrorMessage('Пожалуйста, авторизуйтесь как администратор.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/problems/add-problem`, problemData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Задача успешно добавлена:', response.data);
      setSuccessMessage('Задача успешно добавлена!');
      setTitle('');
      setText('');
      setInputFormat('');
      setOutputFormat('');
      setProblemDifficulty('EASY');
      setTimeLimit('');
      setMemoryLimit('');
      setTestcases([{ input: '', output: '' }, { input: '', output: '' }, { input: '', output: '' }]);
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Не удалось добавить задачу.');
    }
  };

  const difficultyOptions = [
    { label: 'Легкая', value: 'EASY' },
    { label: 'Средняя', value: 'MEDIUM' },
    { label: 'Сложная', value: 'HARD' },
  ];

  return (
    <Container>
      <h1>Добавить новую задачу</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Название задачи:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="text">Описание задачи:</Label>
          <TextArea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="inputFormat">Формат ввода:</Label>
          <TextArea
            id="inputFormat"
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="outputFormat">Формат вывода:</Label>
          <TextArea
            id="outputFormat"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="problemDifficulty">Сложность:</Label>
          <Select
            id="problemDifficulty"
            value={problemDifficulty}
            onChange={(e) => setProblemDifficulty(e.target.value)}
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="timeLimit">Время на исполнение (сек.):</Label>
          <Input
            type="number"
            step="0.1"
            id="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="memoryLimit">Ограничение по памяти (КБ):</Label>
          <Input
            type="number"
            step="1"
            id="memoryLimit"
            value={memoryLimit}
            onChange={(e) => setMemoryLimit(e.target.value)}
            required
          />
        </FormGroup>

        <TestCasesContainer>
          <h3>Тест кейсы:</h3>
          {testcases.map((testcase, index) => (
            <TestCase key={index}>
              <TestCaseLabel>Тест кейс #{index + 1}</TestCaseLabel>
              <Label htmlFor={`input-${index}`}>Ввод:</Label>
              <TextArea
                id={`input-${index}`}
                value={testcase.input}
                onChange={(e) => handleInputChange(index, 'input', e.target.value)}
                required
              />
              <Label htmlFor={`output-${index}`}>Вывод:</Label>
              <TextArea
                id={`output-${index}`}
                value={testcase.output}
                onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                required
              />
              {testcases.length > 1 && (
                <RemoveTestCaseButton type="button" onClick={() => handleRemoveTestCase(index)}>
                  <FontAwesomeIcon icon={faTimes} />
                </RemoveTestCaseButton>
              )}
            </TestCase>
          ))}
          <AddTestCaseButton type="button" onClick={handleAddTestCase}>
            <FontAwesomeIcon icon={faPlus} />
            <span style={{ marginLeft: '0.5rem' }}>Добавить тест кейс</span>
          </AddTestCaseButton>
        </TestCasesContainer>

        <SubmitButton type="submit">Добавить задачу</SubmitButton>
      </Form>
    </Container>
  );
}

export default AddProblemPage;