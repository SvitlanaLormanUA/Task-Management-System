// src/components/Sidebar.tsx

import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <nav className="space-y-4">
      {[
        { label: 'Notifications', emoji: '🔔', active: false, path: '/settings/notification-settings' },
        { label: 'Appearance', emoji: '👁️', active: false, path: '/settings' },
        { label: 'Region', emoji: '🌐', active: false, path: '/settings/language-settings' },
        { label: 'Privacy', emoji: '🔒', active: false, path: '/settings/privacy-settings' },
        { label: 'Profile settings', emoji: '👤', active: false, path: '/login' },
      ].map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
            ${item.active ? 'font-semibold text-gray-900 bg-[#86B7BA]' : 'text-gray-700'}
            hover:bg-[#86B7BA] hover:font-semibold`}
          onClick={() => window.location.href = item.path}


        >
          <span role="img" aria-label={item.label.toLowerCase()}>
            {item.emoji}
          </span>
          {item.label}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
