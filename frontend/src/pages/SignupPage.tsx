const SignupPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#d7e9f7] relative overflow-hidden">
            {/* Хмарний фон */}
            <img
                src="./images/cloud.webp"
                alt="Cloud background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Заголовок */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#4b306a] z-10 mt-8 mb-2 text-center">
                Set up your Account
            </h1>

            {/* Аватар */}
            <div className="z-10 -mb-3">
                <div className="relative w-45 h-45 rounded-full overflow border-4 border-white shadow-md">
                    <img
                        src="./images/girl.webp"
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                        <span className="text-sm text-gray-600">+</span>
                    </div>
                </div>
            </div>

            {/* Форма */}
            <div className="bg-white rounded-2xl shadow-lg p-6 pt-12 w-[80%] max-w-sm z-10 mt-6">


                <form className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                            age
                        </label>
                        <input
                            type="number"
                            id="age"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                            placeholder="Your age"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-[#5c3d82] text-white py-2 rounded-full hover:bg-[#472f68] transition"
                    >
                        create account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
