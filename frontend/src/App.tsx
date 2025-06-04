import MainPage from './pages/MainPage';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationSettings from "@/pages/NotificationSettings.tsx";
import PrivacySettings from "@/pages/PrivacySettings.tsx";
import LanguageAndRegion from "@/pages/LanguageAndRegion.tsx";

function App() {

    return (
        <div className='bg-blue-100'>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LanguageAndRegion/>}>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                        <Route path="/settings/notification-settings" element={<NotificationSettings/>}/>
                        <Route path="/settings/privacy-settings" element={<PrivacySettings/>}/>
                        <Route path="/settings/language-settings" element={<LanguageAndRegion/>}/>

                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;