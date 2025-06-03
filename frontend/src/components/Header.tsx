import { Settings, CircleUserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  className?: string;
};

const Header = ({ className = '' }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={`${className}`}>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSettingsClick}
          className="rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Settings className="size-8 text-gray-700 hover:text-gray-500" />
        </button>
        <button
          onClick={handleProfileClick}
          className="rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <CircleUserRound className="size-8 text-gray-700 hover:text-gray-500" />
        </button>
      </div>
    </header>
  );
};

export default Header;