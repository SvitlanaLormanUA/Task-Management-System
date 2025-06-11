import Sidebar from '@/components/Sidebar';

const SettingsPage = () => (
    <div className="flex h-screen bg-gray-100 text-gray-800">
        {/* Sidebar */}
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
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-3 py-2 rounded-full text-sm bg-gray-200"
                />
                <a href="https://docs.google.com/document/d/1eOrF913VSX1qPp1aZ1DyNuyT0QKQm3Ib0wCnRA4NCqY/edit?usp=sharing" className="text-sm text-gray-700 flex items-center gap-1">
                    <span role="img" aria-label="help">❓</span> Help
                </a>
                <a href="https://docs.google.com/document/d/12EdSq63tLxQTf5c17knVabinvZOW5SqKYZLI-x0s3DQ/edit?usp=sharing" className="text-sm text-gray-700 flex items-center gap-1">
                    <span role="img" aria-label="about">🔗</span> About us
                </a>
            </div>

            {/* Tree image */}
            <img src="./images/preferences_tree.webp" alt="Tree decoration" className="w-full mt-4"/>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-blue-100 p-10">
            <div className="max-w-2xl">
                <label className="block mb-4">
                <span className="text-lg font-medium">Font</span>
                    <select className="mt-1 block w-60 px-3 py-2 border rounded-md">
                        <option>Lato (Default)</option>
                        <option>Ariel (Classic)</option>

                    </select>
                </label>

                <div className="mb-8">
                    <p className="text-lg font-medium mb-2">Color mode</p>
                    <div className="flex gap-4">
                        {["Light", "Dark", "Same as system"].map((mode, index) => (
                            <button
                                key={index}
                                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md w-48 hover:bg-white"
                            >
                  <span>
                    {mode === "Light"
                        ? "☀️"
                        : mode === "Dark"
                            ? "🌙"
                            : "⭐"}
                  </span>
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-lg font-medium mb-2">Themes</p>
                    <div className="grid grid-cols-3 gap-4 max-w-md">
                        {[
                            {name: "Theme 1", color: "bg-yellow-300"},
                            {name: "Theme 2", color: "bg-pink-300"},
                            {name: "Theme 3", color: "bg-green-300"},
                            {name: "Theme 4", color: "bg-purple-300"},
                            {name: "Theme 5", color: "bg-cyan-300"},
                        ].map((theme, index) => (
                            <button
                                key={index}
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border"
                            >
                                <span className={`w-4 h-4 rounded-full ${theme.color}`}/>
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </div>
);
export default SettingsPage;