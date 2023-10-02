import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Paper } from "@mui/material";
import User from "./User";
import FeedbackModal from "./FeedbackModal";

const styles = {
  backButton: {
    marginTop: "20px",
  },
};

interface SearchResult {
  Topic: string;
  Summary: string;
  Content: string;
  Link: string;
  SubTopic: string;
  ID: number;
}

interface RecommendationObj {
  _id: {
    $oid: string
  },
  SearchTerm: string,
  PredictedKnowledge: number,
}

function PageOverview(): JSX.Element {
  // const { resultId } = useParams<{ resultId: string }>();
  const [result, setResult] = useState<SearchResult>({
    Topic: "",
    Summary: "",
    Content: "",
    Link: "",
    SubTopic: "",
    ID: 0,
  });

  const location = useLocation();
  // console.log(location.state.recommendation_obj)

  // const [searchTerm, setSearchTerm] = useState<String>(props.searchTerm);
  const { pageID } = useParams<{ pageID: string }>();
  const { term } = useParams<{ term: string }>();
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  // const [feedbackValue, setFeedbackValue] = useState<String>("");
  const [isRecommendation, setIsRecommendation] = useState<boolean>(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [recommendationObj, setRecommendationObj] = useState<RecommendationObj>()
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const navigate= useNavigate();

  useEffect(() => {
    // Fetch result details based on resultId
    setUsername(localStorage.getItem("username"));
    setResult(location.state.document)
    setIsRecommendation(location.state.isRecommendation)
    console.log(location.state.recommendation_obj)
    if(isRecommendation){
      setRecommendationObj(location.state.recommendation_obj)
      console.log("-----------", recommendationObj)
    }
  }, [result]);

  const handleFeedbackSubmit = async (feedback: String, willingFeedback: String) => {

    console.log("Feedback submitted:", willingFeedback);
    setFeedbackSubmitted(false);
    const headers = { Username: String(username) };
    try {
      const formData = new FormData();

      formData.append("recommendation", JSON.stringify(recommendationObj));
      formData.append("recommendation_feedback", String(feedback));
      formData.append("willingness_feedback", String(willingFeedback));
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
        setFeedbackSubmitted(true);
        navigate("/results/"+term);
      }
      else{
        setFeedbackSubmitted(false);
      }
    } catch (e) {
      console.log("Some error");
    }

    // navigate("/your-desired-page"); 
  };

  const handleBackToResults = ()=>{
    console.log("Back to Results clicked")
    if(isRecommendation){
      console.log("Is this even running")
      setFeedbackModalOpen(true);
    }
    else{
      navigate("/results/"+term);
    }
  }


  return (
    <div>
      <div className="resultsSection">
        <div className="result" key="1">
          <h3>{result.Topic}</h3>
          <p className="subtopic">{result.SubTopic}</p>
          {/* <p>{result.Summary}</p> */}
          <p dangerouslySetInnerHTML={{ __html: result.Content }}></p>
        </div>
        <Button variant="outlined" style={styles.backButton} onClick={handleBackToResults}>
          Back to Results
        </Button>
      </div>
      {/* Render the FeedbackModal */}
      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)} // Close the modal
        onFeedbackSubmit={(recommendationFeedback, willingFeedback) => {
          // setFeedbackValue(feedback); // Update the feedback value
          handleFeedbackSubmit(recommendationFeedback, willingFeedback); // Submit feedback and navigate
        }}
      />
    </div>
  );
}

export default PageOverview;
