import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TracksPage from './pages/Tracks/TracksPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
