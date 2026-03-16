import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TutorialPage from './pages/TutorialPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/tutorial/:lessonId" element={<TutorialPage />} />
      </Route>
    </Routes>
  );
}

export default App;
