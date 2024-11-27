import { useLoaderData } from "react-router-dom";

export interface UserParams{
    UID?: string;
}

export async function userLoader({params} : {params: UserParams}){
    return params;
}

export default function UserView() {
    const {UID} = useLoaderData() as UserParams;

    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              My Profile
              {UID}
            </h2>
            <div className="flex space-x-4"></div>
          </div>
        </div>
      </div>
    );
  }

