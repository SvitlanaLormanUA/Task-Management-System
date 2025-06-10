import MainPage from './pages/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationSettings from '@/pages/NotificationSettings.tsx';
import PrivacySettings from '@/pages/PrivacySettings.tsx';
import LanguageAndRegion from '@/pages/LanguageAndRegion.tsx';
import LoginPage from '@/pages/LoginPage.tsx';
import SignupPage from '@/pages/SignupPage.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import HabitTrackerPage from '@/pages/HabitTrackerPage.tsx';
import CalendarPage from '@/pages/CalendarPage.tsx';
import ToDoListPage from '@/pages/ToDoListPage.tsx';

function App() {

  return (
    <div className="bg-blue-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ToDoListPage />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/notification-settings" element={<NotificationSettings />} />
            <Route path="/settings/privacy-settings" element={<PrivacySettings />} />
            <Route path="/settings/language-settings" element={<LanguageAndRegion />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/habit-tracker" element={<HabitTrackerPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todo-list" element={<ToDoListPage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;