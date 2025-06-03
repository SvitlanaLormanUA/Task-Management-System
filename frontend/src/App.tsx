import MainPage from './pages/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
function App() {

  return (
    <div className='bg-blue-100'>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainPage />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
       </Route>
    </Routes>
   </BrowserRouter>
   </div>
  );
}
export default App;