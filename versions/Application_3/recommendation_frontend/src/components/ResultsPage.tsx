import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import User from "./User";
import RatingScale from "./RatingScale";
import FeedbackModal from "./FeedbackModal";

interface SearchResult {
  Topic: string;
  Summary: string;
  Content: string;
  Link: string;
  SubTopic: string;
  ID: number;
}

interface Recommendation {
  document: {
    Topic: string;
    Summary: string;
    Content: string;
    Link: string;
    SubTopic: string;
    ID: number;
  };
  recommendation_obj: {
    _id: {
      $oid: string;
    };
    SearchTerm: string;
    PredictedKnowledge: number;
  };
  Status: boolean;
}
function ResultsPage(): JSX.Element {
  const { term } = useParams<{ term: string }>();
  const [searchTerm, setSearchTerm] = useState(term);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation>({
    document: {
      Topic: "",
      Summary: "",
      Content: "",
      Link: "",
      SubTopic: "",
      ID: -1,
    },
    recommendation_obj: {
      _id: {
        $oid: "",
      },
      SearchTerm: "",
      PredictedKnowledge: -1,
    },
    Status: false,
  });
  const [recommendationExist, setRecommendationExist] = useState<Boolean>(false);

  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState<number>(-1);

  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  useEffect(() => {
    const fetchResults = async () => {
      const headers = { Username: String(username) };
      try {
        const endpoint = `http://127.0.0.1:8003/filter_results/?search_term=${searchTerm}`;

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
          if (json_response.recommendation.Status) {
            setRecommendation(json_response.recommendation);
            setRecommendationExist(true)
          } else {
            setRecommendationExist(false);
          }
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
      const formData = new FormData();

      formData.append("search_term", String(searchTerm));
      formData.append("accessed_page_Id", String(resultID));
      const response = await fetch("http://127.0.0.1:8003/process_activity/", {
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

  const handleFeedbackSubmit = async (feedback: number) => {

    
    console.log("Feedback submitted:", feedback);

    const headers = { Username: String(username) };
    try {
      const formData = new FormData();

      formData.append("recommendation", JSON.stringify(recommendation.recommendation_obj));
      formData.append("recommendation_feedback", String(feedback));
      const response = await fetch("http://127.0.0.1:8003/update_recommendation_feedback/", {
        method: "POST",
        body: formData,
        headers,
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const json_response = await response.json();

      console.log(json_response);
      if (json_response.Status === "Success") {
        handleReadMore(recommendation.document.ID)
      }
    } catch (e) {
      console.log("Some error");
    }

    // navigate("/your-desired-page"); 
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
          <Grid item xs={4}>
            {recommendationExist ? (
              <div className="recommendation">
                <div
                  style={{
                    maxWidth: "90%",
                    marginLeft: "5%",
                    marginRight: "5%",
                    boxSizing: "border-box",
                    alignItems: "center",
                    padding: "4%", // Add padding for spacing within the border
                  }}
                >
                  <h2 style={{ marginBottom: "16px" }}>Recommended for you</h2>
                  <div className="result">
                    <h3>{recommendation.document.Topic}</h3>
                    <p className="subtopic">
                      {recommendation.document.SubTopic}
                    </p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: recommendation.document.Summary,
                      }}
                    ></p>
                    <button
                      rel="nofollow"
                      onClick={() => {
                        feedbackSent
                          ? setFeedbackModalOpen(true)
                          : alert(
                              "Please provide feedback before Reading this recommended page!"
                            );
                      }}
                    >
                      Read More
                    </button>
                  </div>
                  <RatingScale
                    recommendationObj={recommendation.recommendation_obj}
                    onFeedbackSent={() => {
                      setFeedbackSent(true);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p></p>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      {/* Render the FeedbackModal */}
      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)} // Close the modal
        onRecommendationFeedbackSubmit={(feedback) => {
          setFeedbackValue(feedback); // Update the feedback value
          handleFeedbackSubmit(feedback); // Submit feedback and navigate
        }}
      />
    </div>
  );
}

export default ResultsPage;
