import Router from "next/router";
import React from "react";

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5 14H14.71L14.43 13.73C15.4439 12.554 16.0011 11.0527 16 9.5C16 8.21442 15.6188 6.95772 14.9046 5.8888C14.1903 4.81988 13.1752 3.98676 11.9874 3.49479C10.7997 3.00282 9.49279 2.87409 8.23192 3.1249C6.97104 3.3757 5.81285 3.99477 4.90381 4.90381C3.99477 5.81285 3.3757 6.97104 3.1249 8.23192C2.87409 9.49279 3.00282 10.7997 3.49479 11.9874C3.98676 13.1752 4.81988 14.1903 5.8888 14.9046C6.95772 15.6188 8.21442 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
      fill="black"
    />
  </svg>
);

export default function Search({
  defaultValue,
  center = true,
}: {
  defaultValue?: string;
  center?: boolean;
}) {
  const [search, setSearch] = React.useState<string>(defaultValue || "");
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Router.push(`/explore?search=${search}`);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <section
      className={`mt-[45px] ${
        center ? "mx-auto max-w-[873px]" : "max-w-[900px]"
      }`}
    >
      <form
        onSubmit={handleSearch}
        className="rounded-[14px] pl-[35px] bg-app-alt-dark py-3 pr-4 flex items-center"
      >
        <input
          name="search"
          aria-label="We are strong"
          className="border-none w-full bg-transparent text-white outline-none placeholder-[#5B5B69]"
          type="search"
          onChange={handleChange}
          value={search}
          placeholder="Search for images, videos, or audios"
        />
        <button
          type="submit"
          className="bg-app-light text-app-dark py-2 px-3 rounded-[7px]"
        >
          <SearchIcon /> {""}
        </button>
      </form>
    </section>
  );
}
