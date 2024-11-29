import React, { useState } from "react";
import SettingGroup from "@/components/Settings/SettingGroup";
import DeleteAccount from "@/components/Settings/DeleteAccount"; // Import DeleteAccount
import { SettingItemProps } from "@/components/Settings/SettingItem";

export default function SettingsView() {
  // State for toggle switches
  // const [showPublicProfile, setShowPublicProfile] = useState(true);
  // const [allowSearch, setAllowSearch] = useState(false);
  const [msgNotificationsEnabled, setMsgNotificationsEnabled] = useState(true);
  const [gigNotificationsEnabled, setGigNotificationsEnabled] = useState(true);

  // Define the settings for each group
  const accountSettings: SettingItemProps[] = [
    { name: "Email", subtitle: "aymericbaume@gmail.com", type: "none" },
    { name: "Password", subtitle: "Update your password", type: "custom" },
  ];

  // const privacySettings = [
  //   {
  //     name: "Show Public Profile",
  //     subtitle: "Allow others to see your profile information",
  //     type: "toggle",
  //     isToggled: showPublicProfile,
  //     onToggle: () => setShowPublicProfile(!showPublicProfile),
  //   },
  //   {
  //     name: "Allow Search",
  //     subtitle: "Allow users to search for you",
  //     type: "toggle",
  //     isToggled: allowSearch,
  //     onToggle: () => setAllowSearch(!allowSearch),
  //   },
  // ];

  const appSettings = [
    {
      name: "Message Notifications",
      subtitle: "Get notifications when receiving messages from other users",
      type: "toggle",
      isToggled: msgNotificationsEnabled,
      onToggle: () => setMsgNotificationsEnabled(!msgNotificationsEnabled),
    },
    {
      name: "Gig Notifications",
      subtitle: "Get notifications regarding gig updates",
      type: "toggle",
      isToggled: gigNotificationsEnabled,
      onToggle: () => setGigNotificationsEnabled(!gigNotificationsEnabled),
    },
  ];

  return (
    <div className="mt-5 flex min-h-screen w-full justify-center lg:mt-20">
      <div className="w-full max-w-3xl p-6">
        {/* Setting Groups */}
        <div className="max-w-full space-y-6">
          <SettingGroup title="Account" settings={accountSettings} />
          {/* <SettingGroup title="Privacy" settings={privacySettings} /> */}
          <SettingGroup title="App" settings={appSettings} />
          <div className="flex justify-end">
            <DeleteAccount />
          </div>
        </div>
      </div>
    </div>
  );
}
