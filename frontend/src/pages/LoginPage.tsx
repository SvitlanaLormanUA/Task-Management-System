const LoginPage = () => {
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
        Welcome to SynergyFlow
      </h1>

      {/* Лого з хмаринкою */}
      <div className="flex flex-col items-center z-10 mb-4">
        <img src="./images/logo.webp" alt="SynergyFlow Logo" className="w-48 mb-2" />
        <span className="text-[#8699a6] font-medium text-lg">SynergyFlow</span>
      </div>

      {/* Котик праворуч */}
      <img
        src="./images/cute_cat.webp"
        alt="Cute cat"
        className="absolute right-80 top-75 w-60 md:w-20 z-10"
      />

      {/* Форма */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm z-10">
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

          <button
            type="submit"
            className="bg-[#5c3d82] text-white py-2 rounded-full hover:bg-[#472f68] transition"
          >
            login
          </button>

          <div className="text-center text-sm text-gray-600">
            Don’t have an account yet?
          </div>

          <button
            type="button"
            className="bg-[#5c3d82] text-white py-2 rounded-full hover:bg-[#472f68] transition"
          >
            create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;