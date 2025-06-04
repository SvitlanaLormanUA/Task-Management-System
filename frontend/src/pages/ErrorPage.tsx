const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#d7e9f7] relative overflow-hidden">
      {/* Хмарний фон */}
      <img
        src="./images/cloud.webp"
        alt="Cloud background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Назад стрілка */}
      <div className="absolute top-4 left-4 z-10 text-2xl cursor-pointer">←</div>

      {/* Заголовок */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#4b306a] z-10 mt-8 mb-2 text-center">
        Ooops! Something happened!
      </h1>

      {/* Лого та підзаголовок */}
      <div className="flex flex-col items-center z-10 mt-2">
        <img src="./images/logo.webp" alt="logo" className="w-48 h-48 mb-1" />
      </div>

      {/* Повідомлення про вибачення */}
      <p className="text-xl font-bold text-[#4b306a] z-10 mt-4">
        We are sorry for the inconvenience!
      </p>

      {/* Блок з кнопкою та котиком */}
      <div className="relative bg-white rounded-2xl shadow-lg p-6 pt-12 w-[90%] max-w-sm z-10 mt-10">
        {/* Котик */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20">
          <img src="./images/cute_cat.webp" alt="cat" className="w-full h-full object-contain" />
        </div>

        <button className="bg-[#5c3d82] text-white px-6 py-3 rounded-full hover:bg-[#472f68] transition w-full">
          reach out to support
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;