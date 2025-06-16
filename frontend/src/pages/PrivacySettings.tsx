import {useState} from 'react';
import Sidebar from "@/components/Sidebar.tsx";
import '@/styles/PrivacySettings.css';


const PrivacySettings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleReset = () => {
        // логіка для reset
        console.log('Resetting password...');
    };

    const handleRequest = () => {
        // логіка для запиту через email
        console.log('Requesting password reset...');
    };

    return (
        <div className="privacy-settings flex min-h-screen ">
            {/* Sidebar */}
            <aside className="w-64 bg-[#BBD7D9] p-4 flex flex-col justify-between ">
                <div>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
                    >
                        <span role="img" aria-label="back">←</span>
                        Back
                    </button>

                    <h2 className="text-2xl font-semibold mb-6">Preferences</h2>
                    <Sidebar/>
                </div>

                <div className="space-y-2 mt-4">
                    {/*<input*/}
                    {/*  type="text"*/}
                    {/*  placeholder="Search"*/}
                    {/*  className="w-full px-3 py-2 rounded-full text-sm bg-gray-200"*/}
                    {/*/>*/}
                    <a
                      href="https://docs.google.com/document/d/1eOrF913VSX1qPp1aZ1DyNuyT0QKQm3Ib0wCnRA4NCqY/edit?usp=sharing"
                      className="text-sm text-gray-700 flex items-center gap-1">
                        <span role="img" aria-label="help">❓</span> Help
                    </a>
                    <a
                      href="https://docs.google.com/document/d/12EdSq63tLxQTf5c17knVabinvZOW5SqKYZLI-x0s3DQ/edit?usp=sharing"
                      className="text-sm text-gray-700 flex items-center gap-1">
                        <span role="img" aria-label="about">🔗</span> About us
                    </a>

                    <img src="./images/preferences_tree.webp" alt="Tree decoration" className="w-full mt-4" />
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 p-8 dark:bg-[#7a8fb6]">
                <h2 className="text-2xl font-semibold mb-4">Change password:</h2>

                <div className="space-y-4">
                    <label className="block">
                        Old password
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                    </label>

                    <label className="block">
                        New password
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </label>

                    <label className="block">
                        Confirm new password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </label>

                    <button className="reset-button bg-blue-500 text-white px-4 py-2 rounded" onClick={handleReset}>
                        Reset
                    </button>

                    <div className="request-section mt-6">
                        <p className="mb-2">Request password change via email:</p>
                        <button className="request-button bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleRequest}>
                            Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default PrivacySettings;
