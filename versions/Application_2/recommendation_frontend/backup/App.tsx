import React from "react";

import { useState } from "react";
import { async } from "q";
export default function App(): JSX.Element {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([
    { Topic: "", Summary: "", Content: "", Link: "", SubTopic: "" },
  ]);
  //   const [searchInfo, setSearchInfo] = useState({
  //     totalhits: 0,
  //     suggestion: "",
  //     suggestionsnippet: "",
  //   });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (search === "") return;

    // const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;

    const endpoint = `http://127.0.0.1:8000/filter_results/?search_term=${search}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const json = await response.json();
    console.log(json);
    setResults(json);
    console.log(results.length);
    // setSearchInfo(json.query.searchinfo);
    // console.log(results);
  };
  return (
    <div className="App">
      <header>
        <h1>Learn Better</h1>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="What are you looking for?"
            value={search}
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
