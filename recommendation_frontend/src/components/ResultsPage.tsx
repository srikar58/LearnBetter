import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Button from "@mui/material/Button";

function ResultsPage(): JSX.Element {
  // console.log(props.searchTerm + "hello");
  const [searchTerm, setSearch] = useState(useParams().term);
  const [results, setResults] = useState([
    { Topic: "", Summary: "", Content: "", Link: "", SubTopic: "" },
  ]);
  const [satisfactory, setSatisfactory] = useState(0);
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
    <div>
      <div className="searchBar">
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
      </div>
      <div className="resultsSection">
        <Grid container spacing={2}>
          <Grid item xs={8} className="results">
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
          </Grid>
          <Grid item xs={4} className="results">
            <div className="result">
              <h2>Recommended for you</h2>
              <h3>{results[0].Topic}</h3>
              <p className="subtopic">{results[0].SubTopic}</p>
              <p dangerouslySetInnerHTML={{ __html: results[0].Content }}></p>
              <a href={results[0].Link} target="_blank" rel="nofollow">
                Read More
              </a>
              <div className="satisfactoryButtons">
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={satisfactory === 1 ? "contained" : "outlined"}
                    startIcon={<SentimentVeryDissatisfiedIcon />}
                    onClick={() => setSatisfactory(1)}
                  >
                    Not Satisfied
                  </Button>
                  <Button
                    variant={satisfactory === 2 ? "contained" : "outlined"}
                    startIcon={<SentimentSatisfiedIcon />}
                    onClick={() => setSatisfactory(2)}
                  >
                    Somewhat Satisfied
                  </Button>
                  <Button
                    variant={satisfactory === 3 ? "contained" : "outlined"}
                    startIcon={<SentimentVerySatisfiedIcon />}
                    onClick={() => setSatisfactory(3)}
                  >
                    Satisfied
                  </Button>
                </Stack>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ResultsPage;
