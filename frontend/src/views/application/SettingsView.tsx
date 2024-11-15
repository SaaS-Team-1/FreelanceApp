import React from 'react';
import SettingGroup from '@/components/Settings/SettingGroup';

export default function SettingsView() {
  // Define the settings for each group
  const accountSettings = [
    { name: 'Email', subtitle: 'Change your email address' },
    { name: 'Password', subtitle: 'Update your password' },
    { name: 'Sign Out', subtitle: 'Log out of your account' },
    { name: 'Delete Account', subtitle: 'Permanently delete your account' },
  ];

  const privacySettings = [
    { name: 'Show Public Profile', subtitle: 'Allow others to see your profile information' },
    { name: 'Allow Search', subtitle: 'Allow users to search for you' },
  ];

  const appSettings = [
    { name: 'Notification Settings', subtitle: 'Manage notification preferences' },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-3xl p-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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