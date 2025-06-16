// ThemeSelector.tsx
import { useTheme } from '@/components/useTheme';

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme();

  const modes: { label: string; value: 'light' | 'dark' | 'system' }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Same as system', value: 'system' },
  ];

  return (
    <div className="mb-8">
      <p className="text-lg font-medium mb-2">Color mode</p>
      <div className="flex gap-4">
        {modes.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => changeTheme(value)}
            className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-md w-48 transition
              ${theme === value ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : 'hover:bg-white dark:hover:bg-gray-800'}
            `}
          >
            <span>
              {value === 'light' ? '☀️' : value === 'dark' ? '🌙' : '⭐'}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
