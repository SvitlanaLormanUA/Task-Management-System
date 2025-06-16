import Sidebar from "@/components/Sidebar.tsx";
import '@/styles/NotificationSettings.css';
import {useState} from 'react';


const NotificationSettings = () => {
    const [fromTime, setFromTime] = useState("08:00");
    const [toTime, setToTime] = useState("20:00");
    return (

        <div className="flex flex-row flex-grow bg-[#E1F0F9] text-gray-800 h-screen dark:bg-[#7a8fb6]">
            <aside className="w-64 bg-[#BBD7D9] p-4 flex flex-col justify-between">

                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
                >
                    <span role="img" aria-label="back">←</span>
                    Back
                </button>


                <div>
                    <h2 className="text-2xl font-semibold mb-6">Preferences</h2>
                    <Sidebar/>
                </div>

                <div className="space-y-2">
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
                </div>

                {/* Tree image */}
                <img src="./images/preferences_tree.webp" alt="Tree decoration" className="w-full mt-4" />
            </aside>

            {/* Основна частина */}
            <div className="flex-1 p-8 space-y-6 border-r border-blue-200">
                <h2 className="text-xl font-medium">Recive notifications :</h2>
                <div className="space-y-2">
                    <label className="block">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        On Email
                    </label>
                    <label className="block">
                        <input type="checkbox" defaultChecked className="mr-2"/>
                        In app
                    </label>
                </div>

                <div>
                    <h3 className="font-medium mt-6 mb-2">Silencxe mode:</h3>
                    <div className="flex items-center gap-4 my-4">
                        <div>
                            <label htmlFor="fromTime" className="block text-sm font-medium text-gray-700">From:</label>
                            <input
                                id="fromTime"
                                type="time"
                                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="toTime" className="block text-sm font-medium text-gray-700">To:</label>
                            <input
                                id="toTime"
                                type="time"
                                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {/*<div className="flex gap-4 items-center">*/}
                    {/*    <div className="space-y-1">*/}
                    {/*        <label className="text-sm">From:</label>*/}
                    {/*        <button className="bg-white border border-gray-300 px-3 py-1 rounded shadow">8 am</button>*/}
                    {/*    </div>*/}
                    {/*    <div className="space-y-1">*/}
                    {/*        <label className="text-sm">To:</label>*/}
                    {/*        <button className="bg-white border border-gray-300 px-3 py-1 rounded shadow">8 pm</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <div>
                    <label className="block font-medium mt-4 mb-2">Sound</label>
                    <select className="border border-gray-300 rounded px-3 py-1 bg-white dark:bg-[#7a8fb6]">
                        <option>Din (Default)</option>
                        <option>Gong (Loud)</option>

                    </select>
                </div>

                <div className="space-y-2 mt-6">
                    <div className="flex justify-between items-center">
                        <span>Allow push-notifications</span>
                        <input type="checkbox" className="toggle"/>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Allow notifications on locked screen</span>
                        <input type="checkbox" className="toggle"/>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                        <span>Turn off all notifications</span>
                        <input type="checkbox" className="toggle"/>
                    </div>
                </div>
            </div>

            {/* Права частина */}
            <div className="w-1/3 p-8">
                <h2 className="text-xl font-medium mb-4">Recive notifications from:</h2>
                <div className="space-y-2">
                    <label className="block">
                        <input type="checkbox" defaultChecked className="mr-2"/>
                        Calendar
                    </label>
                    <label className="block">
                        <input type="checkbox" defaultChecked className="mr-2"/>
                        To-do list
                    </label>
                    <label className="block">
                        <input type="checkbox" defaultChecked className="mr-2"/>
                        Habit-tracker
                    </label>
                    <label className="block">
                        <input type="checkbox" defaultChecked className="mr-2"/>
                        Goals
                    </label>
                </div>
            </div>
        </div>
    );
}
export default NotificationSettings;