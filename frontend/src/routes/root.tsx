import { DarkThemeToggle } from "flowbite-react";
import { httpsCallable, Functions } from "firebase/functions";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext, FirebaseContextApps } from "@/utils/firebase";
import AddButton from "@/components/Buttons/AddButton";
import FilterButton from "@/components/Buttons/FilterButton";
import NotificationIndicator from "@/components/Notifications/NotificationIndicator";
import NotificationList from "@/components/Notifications/NotificationsList";
import SettingGroup from "@/components/Settings/SettingGroup";
// import MyPostedGigList from "@/components/Gigs/MyPostedGigList";

const notificationsData = [
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    time: '1m ago',
    count: 2,
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    time: '1m ago',
    count: 2,
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    time: '1m ago',
    count: 2,
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    time: '1m ago',
    count: 2,
  },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    time: '1m ago',
    count: 2,
  },
];

const accountSettings = [
  { name: 'Email Address', subtitle: 'gigismyfavorite@gmail.com' },
  { name: 'Change Password', subtitle: 'Enable password change and update security questions' },
  { name: 'Log out' },
  { name: 'Delete Account' },
];

export default function Root() {
  const firebase = useContext(FirebaseContext) as FirebaseContextApps;
  const [hello, setHello] = useState<string | null>();

  useEffect(() => {
    async function test() {
      const res = await httpsCallable(
        firebase.functions as Functions,
        "helloWorld",
      )();

      setHello(res.data as string);
    }
    if (firebase && firebase.functions) {
      test();
    }
  }, [firebase]);
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <h1 className="text-2xl dark:text-white">Flowbite React + Vite </h1>
      <DarkThemeToggle />
      {hello}
      {/* The following codes were added just to preview the components */}
      <AddButton />
      <FilterButton />
      <NotificationIndicator shape="square" count="20" /> 
      {/* <Avatar /> */}
      {/* <MyPostedGigList></MyPostedGigList> */}
      {/* <Label text="Hello World" /> */}
      
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <NotificationList notifications={notificationsData} />
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
        <SettingGroup title="Account Settings" settings={accountSettings} />
      </div>
    </main>
  );
}
