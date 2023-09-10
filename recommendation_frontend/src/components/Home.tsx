import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [searchTerm, setSearch] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm === "") {
    } else {
      navigate("/results/" + searchTerm);
    }
  };
  return (
    <>
      <div className="Home">
        <header>
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </header>
      </div>
    </>
  );
}
