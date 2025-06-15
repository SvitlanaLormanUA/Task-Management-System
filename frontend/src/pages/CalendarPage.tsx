import { useState, useEffect } from 'react';
import Header from '@/components/Header.tsx';
import Square from '@/components/Square';
import Calendar from '@/components/Calendar.tsx';
import { taskStatuses, baseCategories } from '@/lib/common';
import FilterCheckbox from '@/components/FilterCheckbox';
import CategoryManager from '@/components/CategoryManager';

const CalendarPage = () => {
  const statusColors: { [key: string]: string } = {
    Completed: 'bg-green-500',
    'In Progress': 'bg-blue-500',
    Canceled: 'bg-gray-500',
    Pending: 'bg-yellow-500',
  };

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const savedStatuses = localStorage.getItem('selectedStatuses');
    return savedStatuses ? JSON.parse(savedStatuses) : taskStatuses;
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('selectedCategories');
    return savedCategories ? JSON.parse(savedCategories) : baseCategories;
  });

  const [allCategories, setAllCategories] = useState<string[]>(baseCategories);
  const [categoryFilter, setCategoryFilter] = useState('Other');

  useEffect(() => {
    localStorage.setItem('selectedStatuses', JSON.stringify(selectedStatuses));
  }, [selectedStatuses]);

  useEffect(() => {
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const handleAddCategory = (newCategory: string) => {
    setAllCategories((prev) => [...prev, newCategory]);
    setSelectedCategories((prev) => [...prev, newCategory]);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (!baseCategories.includes(categoryToDelete)) {
      setAllCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
      setSelectedCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
      if (categoryFilter === categoryToDelete) setCategoryFilter('Other');
    }
  };

  const generateCategoryColor = (category: string) => {
    const defaultColors: { [key: string]: string } = {
      Work: 'bg-purple-500',
      Home: 'bg-orange-500',
      Study: 'bg-teal-500',
      Other: 'bg-pink-500',
    };
    if (defaultColors[category]) return defaultColors[category];

    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `bg-[hsl(${hue},60%,50%)]`;
  };

  return (
    <div className='bg-blue-100 min-h-screen'>
      <div className='flex'>
        <aside className='w-52 flex-shrink-0 bg-yellow-50 flex flex-col justify-between p-4 shadow-lg border-r border-yellow-200 sticky top-0 h-screen overflow-y-auto'>
          <Header className='absolute top-4 left-4 z-20 md:top-6 md:left-6' />
          <div className='space-y-6 w-full pt-20'>
            <div>
              <h3 className='px-2 mb-2 text-base font-bold text-yellow-900 uppercase tracking-wider'>
                Statuses
              </h3>
              <div className='flex flex-col'>
                {taskStatuses.map((status) => (
                  <FilterCheckbox
                    key={status}
                    label={status}
                    color={statusColors[status]}
                    isChecked={selectedStatuses.includes(status)}
                    onChange={() => handleStatusChange(status)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className='px-2 mb-2 text-base font-bold text-yellow-900 uppercase tracking-wider'>
                Categories
              </h3>
              <div className='flex flex-col'>
                {allCategories.map((category) => (
                  <FilterCheckbox
                    key={category}
                    label={category}
                    color={generateCategoryColor(category)}
                    isChecked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                ))}
              </div>
              <div className='px-2 mt-2'>
                <CategoryManager
                  category={categoryFilter}
                  setCategory={setCategoryFilter}
                  categories={allCategories}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                  showDeleteButton={true}
                  showSelect={false}
                  showLabel={false}
                  showAddPanel={false}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center border-t border-yellow-200 pt-4 mt-4'>
            <div className='w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md'>
              <img
                src='./images/bunny.webp'
                alt='Character'
                className='w-full h-full object-cover'
              />
            </div>
            <button
              onClick={() => window.history.back()}
              className='flex items-center gap-2 text-gray-600 hover:text-black font-semibold text-sm cursor-pointer transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 19l-7-7m0 0l7-7m-7 7h18'
                />
              </svg>
              Back
            </button>
          </div>
        </aside>

        <main className='flex-1 flex flex-col'>
          <div className='flex justify-center gap-4 mb-4 bg-yellow-100 py-4'>
            {[
              { title: 'habit tracker', color: '#FAFAF5', path: '/habit-tracker' },
              { title: 'matrix', color: '#FBD443', path: '/matrix' },
              { title: 'to-do lists', color: '#FFF7D8', path: '/todo-list' },
              { title: 'goals | beta', color: '#F3D9DA', path: '/error' },
            ].map((tab) => (
              <Square
                key={tab.title}
                title={tab.title}
                color={tab.color || 'white'}
                className='w-36 h-24 p-4'
                onClick={() => (window.location.href = tab.path)}
              />
            ))}
          </div>
          <div className='bg-blue-100'>
            <Calendar
              selectedStatuses={selectedStatuses}
              selectedCategories={selectedCategories}
              onCategoriesUpdate={setAllCategories}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;
