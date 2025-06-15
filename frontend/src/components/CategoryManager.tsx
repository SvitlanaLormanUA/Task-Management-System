import { useState } from 'react';

type CategoryManagerProps = {
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
};

export default function CategoryManager({
  category,
  setCategory,
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const baseCategories = ['Work', 'Home', 'Study', 'Other'];

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName && !categories.includes(trimmedName)) {
      onAddCategory(trimmedName);
      setCategory(trimmedName);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (!baseCategories.includes(categoryToDelete)) {
      onDeleteCategory(categoryToDelete);
      if (category === categoryToDelete) {
        setCategory('Other');
      }
    }
  };

  const sortedCategories = [
    ...baseCategories.filter((cat) => categories.includes(cat)),
    ...categories.filter((cat) => !baseCategories.includes(cat)).sort(),
  ];

  return (
    <div className='mb-3'>
      <div className='flex justify-between items-center mb-1'>
        <label className='block text-xs text-gray-600'>Category *</label>
        <button
          type='button'
          onClick={() => setShowCategoryManager(!showCategoryManager)}
          className='text-xs text-blue-600 hover:text-blue-800 cursor-pointer'
        >
          {showCategoryManager ? 'Hide' : 'Manage Categories'}
        </button>
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
      >
        {sortedCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
            {baseCategories.includes(cat) ? ' (default)' : ''}
          </option>
        ))}
      </select>

      {showCategoryManager && (
        <div className='mt-2 p-3 bg-gray-50 rounded border'>
          <h5 className='text-xs font-medium mb-2'>Manage Categories:</h5>

          {!isAddingCategory ? (
            <button
              type='button'
              onClick={() => setIsAddingCategory(true)}
              className='text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mb-2 cursor-pointer disabled:opacity-50'
            >
              Add New Category
            </button>
          ) : (
            <div className='flex gap-1 mb-2'>
              <input
                type='text'
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder='Category name'
                className='flex-1 text-xs border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                autoFocus
              />
              <button
                type='button'
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || categories.includes(newCategoryName.trim())}
                className='text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
              >
                ✓
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                className='text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                ✕
              </button>
            </div>
          )}

          {newCategoryName.trim() && categories.includes(newCategoryName.trim()) && (
            <div className='text-xs text-red-600 mb-2'>
              Category "{newCategoryName.trim()}" already exists
            </div>
          )}

          <div className='space-y-1'>
            <div className='text-xs font-medium text-gray-700 mb-1'>Default Categories:</div>
            {baseCategories
              .filter((cat) => categories.includes(cat))
              .map((cat) => (
                <div key={cat} className='flex justify-between items-center text-xs pl-2'>
                  <span className='text-gray-600'>{cat}</span>
                  <span className='text-gray-400 text-xs'>protected</span>
                </div>
              ))}

            {categories.filter((cat) => !baseCategories.includes(cat)).length > 0 && (
              <>
                <div className='text-xs font-medium text-gray-700 mb-1 mt-2'>
                  Custom Categories:
                </div>
                {categories
                  .filter((cat) => !baseCategories.includes(cat))
                  .sort()
                  .map((cat) => (
                    <div key={cat} className='flex justify-between items-center text-xs pl-2'>
                      <span className='text-gray-800'>{cat}</span>
                      <button
                        type='button'
                        onClick={() => handleDeleteCategory(cat)}
                        className='text-red-600 hover:text-red-800 cursor-pointer'
                        title={`Delete ${cat} category`}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
