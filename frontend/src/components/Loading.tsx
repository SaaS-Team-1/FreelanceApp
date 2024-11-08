import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <ReactLoading
        className="mb-10"
        type={"spinningBubbles"}
        delay={1}
        height={"20%"}
        width={"20%"}
      />
      <h2 className="mb-6 self-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        Loading
      </h2>
    </div>
  );
}
