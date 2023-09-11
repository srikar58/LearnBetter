import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

interface SearchResult {
  Topic: string;
  Summary: string;
  Content: string;
  Link: string;
  SubTopic: string;
  ID: number;
}

function ResultsPage(): JSX.Element {
  const { term } = useParams<{ term: string }>();
  const [searchTerm, setSearchTerm] = useState(term);
  const [results, setResults] = useState<SearchResult[]>([]);

  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  useEffect(() => {
    const fetchResults = async () => {
      const headers = { Username: String(username) };
      try {
        const endpoint = `http://127.0.0.1:8000/filter_results/?search_term=${searchTerm}`;

        const response = await fetch(endpoint, { headers });

        if (!response.ok) {
          throw Error(response.statusText);
        }

        const json_response = await response.json();

        if (json_response.Status === "Not Found") {
          console.log("Invalid search term");
          alert("Please enter the Search terms as directed by the researcher.");
          navigate("/");
        } else {
          setResults(json_response.results);
          console.log(json_response.recommendation);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchResults();
  }, [term]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm !== "") {
      navigate(`/results/${searchTerm}`);
    }
  };

  const handleReadMore = async (resultID: number) => {
    const headers = { Username: String(username) };
    try {
      navigate("/search/" + searchTerm + "/page/" + resultID);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="resultsPage">
      <div className="searchBar">
        <header>
          {/* <h1>Learn Better</h1> */}
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          {results.length > 1 && <p>Search Results: {results.length}</p>}
        </header>
      </div>
      <div className="resultsSection">
        <Grid container spacing={2}>
          <Grid item xs={8} className="results">
            {results.length > 1 &&
              results.map((result) => (
                <div className="result" key={result.ID}>
                  <h3>{result.Topic}</h3>
                  <p className="subtopic">{result.SubTopic}</p>
                  <p dangerouslySetInnerHTML={{ __html: result.Summary }}></p>
                  <button
                    rel="nofollow"
                    onClick={() => handleReadMore(result.ID)}
                  >
                    Read More
                  </button>
                </div>
              ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ResultsPage;
