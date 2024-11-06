import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home.page';
import LetterPage from './pages/letter.page';

export default function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:letterId" element={<LetterPage/>} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
