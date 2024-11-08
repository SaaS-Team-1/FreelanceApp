import { HiSearch } from "react-icons/hi";

export function SearchBar() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="relative w-full max-w-xl">
        {/* Search Icon */}
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for specific Gigs"
          className="w-full rounded-md border border-gray-300 py-3 pl-12 pr-4 shadow-sm focus:outline-none"
          style={{
            height: "48px",
            backgroundColor: "white",
            fontFamily: "'Inter', sans-serif", // Apply Inter font
          }}
        />
      </div>
    </div>
  );
}
