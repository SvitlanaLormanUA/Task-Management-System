import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from '@/pages/LoginPage.tsx';
import SignupPage from '@/pages/SignupPage.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import MainPage from '@/pages/MainPage.tsx';
import ProfilePage from '@/pages/ProfilePage.tsx';
import SettingsPage from '@/pages/SettingsPage.tsx';
import NotificationSettings from '@/pages/NotificationSettings.tsx';
import PrivacySettings from '@/pages/PrivacySettings.tsx';
import LanguageAndRegion from '@/pages/LanguageAndRegion.tsx';
import HabitTrackerPage from '@/pages/HabitTrackerPage.tsx';
import CalendarPage from '@/pages/CalendarPage.tsx';
import ToDoListPage from '@/pages/ToDoListPage.tsx';
import MatrixPage from '@/pages/MatrixPage.tsx';

function App() {
  return (
    <div className="min-h-screen bg-blue-100">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/error" element={<ErrorPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/notification-settings"
              element={
                <ProtectedRoute>
                  <NotificationSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/privacy-settings"
              element={
                <ProtectedRoute>
                  <PrivacySettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/language-settings"
              element={
                <ProtectedRoute>
                  <LanguageAndRegion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habit-tracker"
              element={
                <ProtectedRoute>
                  <HabitTrackerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo-list"
              element={
                <ProtectedRoute>
                  <ToDoListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matrix"
              element={
                <ProtectedRoute>
                  <MatrixPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all for 404 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;