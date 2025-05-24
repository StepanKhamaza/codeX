import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  padding: 2rem;
  background-color: #111;
  color: #eee;
  min-height: 80vh;
  gap: 20px;
`;

const EditorColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 55%;
  max-width: 55%;
  min-width: 400px;
`;

const ProblemDetailsColumn = styled.div`
  flex: 0 0 45%;
  max-width: 45%;
  padding: 1rem;
  background-color: #333;
  border-radius: 5px;
  overflow-y: auto;
  min-width: 300px;
`;

const HTMLContent = styled.div`
  margin-bottom: 1rem;
  color: #eee;
  & > p {
    margin-bottom: 0.5rem;
  }
  & > pre {
    background-color: #222;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    white-space: pre-wrap;
  }
`;

const LanguageSelector = styled.select`
  background-color: #444;
  color: #eee;
  border: none;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
`;

const ProblemTitle = styled.h2`
  margin-bottom: 1rem;
  color: #007bff;
`;

const InfoItem = styled.p`
  margin-bottom: 0.5rem;
`;

const Difficulty = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-weight: bold;
  color: #eee;
  background-color: ${(props) => {
    switch (props.difficulty) {
      case 'EASY':
        return 'green';
      case 'MEDIUM':
        return 'orange';
      case 'HARD':
        return 'red';
      default:
        return '#555';
    }
  }};
`;

const InputOutputFormat = styled.div`
  padding: 1rem;
  background-color: #333;
  border-radius: 5px;
  margin-top: 1rem;
`;

const FormatTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: #ddd;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  margin-top: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const FileInput = styled.input`
  margin-bottom: 0.5rem;
  color: #eee;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #333;
  color: #eee;
  padding: 2rem;
  border-radius: 5px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: #eee;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #aaa;
  }
`;

const CodeBlock = styled.pre`
  background-color: #222;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  white-space: pre-wrap;
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #5cb85c;
  color: #fff;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #4cae4c;
  }

  svg {
    font-size: 1rem;
  }
`;

const SubmissionIdLink = styled.span`
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

const CopyNotification = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (Node.js 12.14.0)', extension: '.js' },
  { value: 'cpp', label: 'C++ (GCC 9.2.0)', extension: '.cpp' },
  { value: 'java', label: 'Java (OpenJDK 13.0.1)', extension: '.java' },
  { value: 'python', label: 'Python (3.8.1)', extension: '.py' },
];

const compilerIdToLanguage = {
  63: 'JavaScript',
  54: 'C++',
  62: 'Java',
  71: 'Python',
};

function ProblemDetailsPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].value);
  const [submissions, setSubmissions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copySuccessMessage, setCopySuccessMessage] = useState('');
  const [messageModal, setMessageModal] = useState({ show: false, message: '' });

  const showMessage = (message) => {
    setMessageModal({ show: true, message });
  };

  const closeMessageModal = () => {
    setMessageModal({ show: false, message: '' });
  };

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');

    console.log('Токен:', token);
    console.log('Имя пользователя из localStorage:', username);
    console.log('API Base URL:', API_BASE_URL);

    if (username && token && API_BASE_URL) {
      const submissionsUrl = `${API_BASE_URL}/submission/get/${username}/${id}`;
      console.log('URL запроса попыток:', submissionsUrl);
      try {
        const response = await axios.get(submissionsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Данные о попытках от бэкенда:', response.data);
        setSubmissions(response.data.submissions);
        console.log('Состояние submissions после установки:', submissions);
      } catch (error) {
        console.error('Ошибка при загрузке предыдущих попыток:', error);
      }
    } else {
      console.log('API Base URL не определен или отсутствует токен/имя пользователя.');
    }
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      setLoading(true);
      setError('');
      console.log('API Base URL:', API_BASE_URL);

      if (API_BASE_URL) {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await axios.get(`${API_BASE_URL}/problem/get/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProblem(response.data.problem);
          fetchSubmissions();
        } catch (error) {
          console.error('Ошибка при загрузке деталей задачи:', error);
          setError('Не удалось загрузить детали задачи.');
        } finally {
          setLoading(false);
        }
      } else {
        console.error('API Base URL не определен.');
        setError('API Base URL не определен.');
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [id, API_BASE_URL]);

  const handleCodeChange = (value) => {
    setCode(value || '');
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setSelectedFile(null);
    setCode('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setCode('');
  };

  const handleSubmitSolution = async () => {
    let sourceCode = code;
    let submissionType = 'текста из редактора';
    let selectedCompilerId;

    const selectedLangObject = LANGUAGES.find((lang) => lang.value === selectedLanguage);
    const expectedExtension = selectedLangObject ? selectedLangObject.extension : '';

    if (selectedFile) {
      if (selectedFile.name.endsWith(expectedExtension)) {
        submissionType = `файла "${selectedFile.name}"`;
        try {
          const fileContent = await readFileContent(selectedFile);
          sourceCode = fileContent;
        } catch (error) {
          showMessage('Не удалось прочитать содержимое файла.');
          return;
        }
      } else {
        showMessage(
          `Пожалуйста, выберите файл с расширением "${expectedExtension}" для языка "${selectedLangObject?.label}".`
        );
        return;
      }
    } else if (!sourceCode.trim()) {
      showMessage('Пожалуйста, введите код в редакторе или выберите файл.');
      return;
    }

    switch (selectedLanguage) {
      case 'javascript':
        selectedCompilerId = 63;
        break;
      case 'java':
        selectedCompilerId = 62;
        break;
      case 'cpp':
        selectedCompilerId = 54;
        break;
      case 'python':
        selectedCompilerId = 71;
        break;
      default:
        showMessage('Выбранный язык не поддерживается для отправки.');
        return;
    }

    const submissionData = {
      problemId: parseInt(id),
      sourceCode: sourceCode,
      compilerId: selectedCompilerId,
    };

    const token = localStorage.getItem('jwtToken');

    if (API_BASE_URL) {
      try {
        const response = await axios.post(`${API_BASE_URL}/submission/${id}`, submissionData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        showMessage(`Решение успешно отправлено!`);
        console.log(` Решение отправлено (${submissionType})!`);

        fetchSubmissions();
        setSelectedFile(null);
        setCode('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Ошибка при отправке решения:', error);
        showMessage('Произошла ошибка при отправке решения.');
      }
    } else {
      console.error('API Base URL не определен.');
      showMessage('API Base URL не определен.');
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const openCodeModal = (submissionId) => {
    const submission = submissions.find((sub) => sub.submissionId === submissionId);
    setSelectedSubmission(submission);
    setCopySuccessMessage('');
  };

  const closeCodeModal = () => {
    setSelectedSubmission(null);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccessMessage('Скопировано!');
      setTimeout(() => setCopySuccessMessage(''), 2000);
    } catch (err) {
      console.error('Не удалось скопировать текст:', err);
      setCopySuccessMessage('Ошибка');
    }
  };

  if (loading) {
    return (
      <Container>Загрузка деталей задачи...</Container>
    );
  }

  if (error) {
    return (
      <Container>Ошибка: {error}</Container>
    );
  }

  if (!problem) {
    return <Container>Задача не найдена.</Container>;
  }

  return (
    <Container>
      <EditorColumn>
        <LanguageSelector value={selectedLanguage} onChange={handleLanguageChange}>
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </LanguageSelector>
        <FileInput
          type="file"
          onChange={handleFileChange}
          accept={LANGUAGES.find((lang) => lang.value === selectedLanguage)?.extension}
          ref={fileInputRef}
        />
        <div style={{ height: '600px', overflowY: 'auto', marginBottom: '0.5rem' }}>
          <Editor
            key={selectedLanguage}
            height="100%"
            width="100%"
            defaultLanguage={selectedLanguage}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
          />
        </div>
        <SubmitButton onClick={handleSubmitSolution}>Отправить решение</SubmitButton>

        {submissions.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Все попытки</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#eee' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #555', paddingBottom: '0.5rem', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>ID отправки</th>
                  <th style={{ padding: '0.5rem' }}>Язык</th>
                  <th style={{ padding: '0.5rem' }}>Статус</th>
                  <th style={{ padding: '0.5rem' }}>Время</th>
                  <th style={{ padding: '0.5rem' }}>Память</th>
                  <th style={{ padding: '0.5rem' }}>Тест</th>
                  <th style={{ padding: '0.5rem' }}>Время отправки</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.submissionId} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.5rem' }}>
                      <SubmissionIdLink onClick={() => openCodeModal(submission.submissionId)}>
                        {submission.submissionId}
                      </SubmissionIdLink>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {compilerIdToLanguage[submission.compilerId] || `ID: ${submission.compilerId}`}
                    </td>
                    <td style={{ padding: '0.5rem' }}>{submission.status}</td>
                    <td style={{ padding: '0.5rem' }}>{submission.time !== null ? `${submission.time} мс` : '-'}</td>
                    <td style={{ padding: '0.5rem' }}>
                      {submission.memory !== null ? `${submission.memory} КБ` : '-'}
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {submission.numberOfTestcase !== null ? submission.numberOfTestcase : '-'}
                    </td>
                    <td style={{ padding: '0.5rem' }}>{new Date(submission.created).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {submissions.length === 0 && !loading && (
          <p style={{ marginTop: '1rem' }}>Предыдущих попыток не найдено.</p>
        )}
      </EditorColumn>
      <ProblemDetailsColumn>
        <ProblemTitle>{problem.title}</ProblemTitle>
        <InfoItem>
          <Difficulty difficulty={problem.problemDifficulty}>
            {problem.problemDifficulty === 'EASY' && 'Легкая'}
            {problem.problemDifficulty === 'MEDIUM' && 'Средняя'}
            {problem.problemDifficulty === 'HARD' && 'Сложная'}
            {problem.problemDifficulty !== 'EASY' &&
              problem.problemDifficulty !== 'MEDIUM' &&
              problem.problemDifficulty !== 'HARD' &&
              problem.problemDifficulty}
          </Difficulty>
        </InfoItem>
        <InfoItem>Ограничение по времени: {problem.timeLimit} сек.</InfoItem>
        <InfoItem>Ограничение по памяти: {problem.memoryLimit} КБ</InfoItem>
        <div>
          <h3>Описание задачи:</h3>
          <HTMLContent dangerouslySetInnerHTML={{ __html: problem.text }} />
        </div>
        <InputOutputFormat>
          <FormatTitle>Формат ввода</FormatTitle>
          <HTMLContent dangerouslySetInnerHTML={{ __html: problem.inputFormat }} />
          <FormatTitle>Формат вывода</FormatTitle>
          <HTMLContent dangerouslySetInnerHTML={{ __html: problem.outputFormat }} />
        </InputOutputFormat>
        {problem.testcases && problem.testcases.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <FormatTitle>Примеры тестов</FormatTitle>
            {problem.testcases.map((testcase, index) => (
              <div key={testcase.testcaseId} style={{ marginBottom: '1rem', backgroundColor: '#444', padding: '1rem', borderRadius: '5px' }}>
                <p>
                  <strong>Тест {index + 1}:</strong>
                </p>
                <p>
                  <strong>Ввод:</strong>
                  <CodeBlock>
                    {testcase.input}
                    <CopyButton onClick={() => copyToClipboard(testcase.input)} title={copySuccessMessage || 'Копировать'}>
                      <FontAwesomeIcon icon={faClipboard} />
                    </CopyButton>
                  </CodeBlock>
                </p>
                <p>
                  <strong>Вывод:</strong>
                  <CodeBlock>{testcase.output}</CodeBlock>
                </p>
              </div>
            ))}
          </div>
        )}
      </ProblemDetailsColumn>

      {selectedSubmission && (
        <ModalOverlay onClick={closeCodeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Код решения</ModalTitle>
            <CloseButton onClick={closeCodeModal}>&times;</CloseButton>
            <p>
              <strong>ID задачи:</strong> {selectedSubmission.problemId || 'N/A'}
            </p>
            <p>
              <strong>ID отправки:</strong> {selectedSubmission.submissionId}
            </p>
            <p>
              <strong>Пользователь:</strong> {selectedSubmission.username || 'N/A'}
            </p>
            <p>
              <strong>Язык:</strong> {compilerIdToLanguage[selectedSubmission.compilerId] || 'N/A'}
            </p>
            <p>
              <strong>Статус:</strong> {selectedSubmission.status}
            </p>
            <p>
              <strong>Время (сек):</strong> {selectedSubmission.time !== null ? selectedSubmission.time.toFixed(3) : 'N/A'}
            </p>
            <p>
              <strong>Память (КБ):</strong> {selectedSubmission.memory !== null ? selectedSubmission.memory.toFixed(0) : 'N/A'}
            </p>
            {selectedSubmission.numberOfTestcase !== null && (
              <p>
                <strong>Результаты тестирования:</strong>{' '}
                {selectedSubmission.status === 'ACCEPTED'
                  ? 'Все тесты пройдены'
                  : `Тест #${selectedSubmission.numberOfTestcase} завершился с ошибкой`}
              </p>
            )}
            <div>
              <strong>Исходный код:</strong>
              <CodeBlock>
                {selectedSubmission.sourceCode}
                <CopyButton onClick={() => copyToClipboard(selectedSubmission.sourceCode)} title={copySuccessMessage || 'Копировать'}>
                  <FontAwesomeIcon icon={faClipboard} />
                </CopyButton>
              </CodeBlock>
            </div>
          </Modal>
        </ModalOverlay>
      )}

      {messageModal.show && (
        <ModalOverlay onClick={closeMessageModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Уведомление</ModalTitle>
            <CloseButton onClick={closeMessageModal}>&times;</CloseButton>
            <p>{messageModal.message}</p>
          </Modal>
        </ModalOverlay>
      )}

      {copySuccessMessage && (
        <CopyNotification show={!!copySuccessMessage}>
          {copySuccessMessage}
        </CopyNotification>
      )}
    </Container>
  );
}

export default ProblemDetailsPage;
