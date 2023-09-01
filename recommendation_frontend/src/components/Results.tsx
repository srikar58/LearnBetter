import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Results(): JSX.Element {
  // console.log(props.searchTerm + "hello");
  const [searchTerm, setSearch] = useState(useParams().term);
  const [results, setResults] = useState([
    { Topic: "", Summary: "", Content: "", Link: "", SubTopic: "" },
  ]);
  // console.log(term);
  // console.log(searchTerm + "hello");
  useEffect(() => {
    const fetchResults = async () => {
      const endpoint = `http://127.0.0.1:8000/filter_results/?search_term=${searchTerm}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const json = await response.json();
      setResults(json);
    };
    console.log("updated");
    fetchResults();
  }, [useParams().term]);

  const navigate = useNavigate();
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm === "") {
    } else {
      navigate("/results/" + searchTerm);
    }
  };

  return (
    <div className="Results">
      <header>
        <h1>Learn Better</h1>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {results.length > 1 ? <p>Search Results: {results.length}</p> : ""}
      </header>
      <div className="results">
        {results.length > 1 &&
          results.map((result, i) => {
            //   const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
            return (
              <div className="result">
                <h3>{results[i].Topic}</h3>
                <p className="subtopic">{results[i].SubTopic}</p>
                <p dangerouslySetInnerHTML={{ __html: result.Content }}></p>
                <a href={results[i].Link} target="_blank" rel="nofollow">
                  Read More
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Results;
