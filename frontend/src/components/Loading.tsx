import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute">
          <h2 className="text-2xl mt-56 font-extrabold leading-none tracking-tight text-primary sm:text-5xl">
            Loading
          </h2>
        </div>
        <ReactLoading
          type="spinningBubbles"
          delay={1}
          width="300px"
          color="#415f91"
        />
      </div>
    </div>
  );
}