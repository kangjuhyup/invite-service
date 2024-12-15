import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home.page';
import LetterPage from './pages/letter.page';
import CreatePage from './pages/create.page';
import LogInPage from './pages/login.page';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  return (
    <MantineProvider>
      <GoogleOAuthProvider clientId="128433882817-f73co38tehgs2tjopi2fqt1jijjkggiv.apps.googleusercontent.com">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/view/:letterId" element={<LetterPage />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </MantineProvider>
  );
}
