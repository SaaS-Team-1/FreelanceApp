import { useRouteError } from "react-router";

export default function ErrorView() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <section className="flex h-screen">
        <div className="mx-auto max-w-screen-xl self-center px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl">
              500
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
              Something's went wrong.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we experienced an internal error.
            </p>
            <a
              href="/"
              className="my-4 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
