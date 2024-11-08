import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function LandingView() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center gap-2">
        <div>
          <div className="mx-5 flex items-start">
            <div id="main-content" className={"relative h-[80vh] w-full"}>
              <header className="flex h-full justify-center">
                <div className="mx-auto max-w-screen-xl self-center text-center">
                  <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    Freelance App.
                  </h1>
                  <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
                    Find a job or get one.
                  </p>
                  <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0 lg:mb-16">
                    <Button to={"/app"} as={Link}>
                      Get started!
                    </Button>
                  </div>
                </div>
              </header>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
