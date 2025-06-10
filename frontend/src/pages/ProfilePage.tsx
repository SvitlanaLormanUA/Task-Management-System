const ProfilePage = () => {
        return (
<div className="min-h-screen bg-[#31184a] flex items-center justify-center p-4">
    <div className="w-full max-w-2xl mx-auto bg-[#d7e9f7] rounded-lg shadow relative overflow-hidden">
        {/* Фонові хмари */}
        <img
            src="./images/cloud.webp"
          alt="clouds"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

          {/* Котик */}
        <img
          src="./images/cat.webp"
          alt="cat"
          className="absolute left-0 bottom-0 w-1/3 object-contain z-10 pointer-events-none"
        />

        {/* Назад */}
        <div className="relative z-10 p-4">
          <button className="text-gray-600 hover:text-black text-lg font-medium mb-2">
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile settings</h1>
        </div>

        {/* Аватар */}
        <div className="relative z-10 flex flex-col items-center px-4 pb-8">
          <div className="relative w-36 h-36 mb-6">
            <img
              src="./images/girl.webp"
              alt="profile"
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-1 right-1 bg-gray-200 p-1 rounded-full shadow">
              +
            </button>
          </div>

          {/* Форма */}
          <form className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                defaultValue="Alice"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                defaultValue={17}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>
        </div>


      </div>
    </div>
  );
}
export default ProfilePage;