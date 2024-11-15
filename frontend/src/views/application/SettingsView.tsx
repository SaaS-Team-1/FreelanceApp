import React, { useState } from 'react';
import SettingGroup from '@/components/Settings/SettingGroup';

export default function SettingsView() {
  // State for toggle switches
  const [showPublicProfile, setShowPublicProfile] = useState(true);
  const [allowSearch, setAllowSearch] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Define the settings for each group
  const accountSettings = [
    { name: 'Email', subtitle: 'Change your email address', type: 'arrow' },
    { name: 'Password', subtitle: 'Update your password', type: 'arrow' },
    { name: 'Delete Account', subtitle: 'Permanently delete your account', type: 'arrow' },
  ];

  const privacySettings = [
    {
      name: 'Show Public Profile',
      subtitle: 'Allow others to see your profile information',
      type: 'toggle',
      isToggled: showPublicProfile,
      onToggle: () => setShowPublicProfile(!showPublicProfile),
    },
    {
      name: 'Allow Search',
      subtitle: 'Allow users to search for you',
      type: 'toggle',
      isToggled: allowSearch,
      onToggle: () => setAllowSearch(!allowSearch),
    },
  ];

  const appSettings = [
    {
      name: 'Notification Settings',
      subtitle: 'Manage notification preferences',
      type: 'toggle',
      isToggled: notificationsEnabled,
      onToggle: () => setNotificationsEnabled(!notificationsEnabled),
    },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-3xl p-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Settings
          </h2>
        </div>

        {/* Setting Groups */}
        <div className="space-y-6 max-w-full">
          <SettingGroup title="Account" settings={accountSettings} />
          <SettingGroup title="Privacy" settings={privacySettings} />
          <SettingGroup title="App" settings={appSettings} />
        </div>
      </div>
    </div>
  );
}