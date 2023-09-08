import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import User from "./User";
import RatingScale from "./RatingScale";
interface SearchResult {
  Topic: string;
  Summary: string;
  Content: string;
  Link: string;
  SubTopic: string;
  ID: number;
}

interface Recommendation {
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
  const [recommendation, setRecommendation] = useState<Recommendation>({
    Topic: "",
    Summary: "",
    Content: "",
    Link: "",
    SubTopic: "",
    ID: 0,
  });
  const [recommendationExist, setRecommendationExist] = useState<Boolean>();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const headers = { Username: "srikar" };
        const endpoint = `http://127.0.0.1:8000/filter_results/?search_term=${searchTerm}`;

        const response = await fetch(endpoint, { headers });

        if (!response.ok) {
          throw Error(response.statusText);
        }

        const json_response = await response.json();
        setResults(json_response.results);
        console.log(json_response.recommendation);
        if (json_response.recommendation.Status) {
          setRecommendation(json_response.recommendation.document);
        } else {
          setRecommendationExist(false);
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
    try {
      const headers = { Username: "srikar" };
      const formData = new FormData();

      formData.append("search_term", String(searchTerm));
      formData.append("accessed_page_Id", String(resultID));
      const response = await fetch("http://127.0.0.1:8000/process_activity/", {
        method: "POST",
        body: formData,
        headers,
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const json_response = await response.json();
      console.log(json_response);
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
                  <a
                    target="_blank"
                    rel="nofollow"
                    onClick={() => handleReadMore(result.ID)}
                  >
                    Read More
                  </a>
                </div>
              ))}
          </Grid>
          <Grid item xs={4} className="results">
            <div className="result">
              <h2>Recommended for you</h2>
              <h3>{recommendation.Topic}</h3>
              <p className="subtopic">{recommendation.SubTopic}</p>
              <p
                dangerouslySetInnerHTML={{ __html: recommendation.Summary }}
              ></p>
              <a
                target="_blank"
                rel="nofollow"
                onClick={() => handleReadMore(recommendation.ID)}
              >
                Read More
              </a>
              <RatingScale />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ResultsPage;
