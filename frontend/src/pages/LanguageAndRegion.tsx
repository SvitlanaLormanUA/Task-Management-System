import Sidebar from "@/components/Sidebar.tsx";
import '@/styles/LanguageAndRegion.css';


const LanguageAndRegion = () => {
    return (
        <div className="language-settings flex min-h-screen">
            <aside className="w-64 bg-[#BBD7D9] p-4 flex flex-col justify-between">
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

                    <img src="./images/preferences_tree.webp" alt="Tree" className="w-full mt-4" />
                </div>
            </aside>

            <div className="max-w-md mx-auto mt-10 px-4">
                {/* Language */}
                <div className="mb-6 ">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ">Language</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#7a8fb6]">
                        <option>English UK (Default)</option>
                        <option>English US</option>
                        <option>Ukrainian (Native)</option>
                        <option>Polish</option>
                        <option>German</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>Chinese (Simplified)</option>
                    </select>
                </div>

                {/* Time Zone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#7a8fb6]">
                        <option>(GMT+0) UTC</option>
                        <option>(GMT+1) Central European Time</option>
                        <option>(GMT+2) Eastern European Time (Kyiv)</option>
                        <option>(GMT+3) Kyiv Standard Time</option>
                        <option>(GMT+5:30) India Standard Time</option>
                        <option>(GMT+8) China Standard Time</option>
                        <option>(GMT-5) Eastern Time (US & Canada)</option>
                        <option>(GMT-8) Pacific Time (US & Canada)</option>
                    </select>
                </div>
            </div>

            <img src="./images/map.webp" alt="Map" width="600" height="10"/>

        </div>
    );
}
export default LanguageAndRegion;