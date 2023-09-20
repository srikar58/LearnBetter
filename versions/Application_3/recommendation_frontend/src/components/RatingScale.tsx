import React, { useState, useEffect } from "react";
import { Typography, Slider, Button, Box } from "@mui/material";
import CircularProgressBar from "./ProgressBar";
interface RecommendationObject {
  _id: {
    $oid: string;
  };
  SearchTerm: string;
  PredictedKnowledge: number;
}

interface RatingScaleProps {
  recommendationObj: RecommendationObject;
  onFeedbackSent: () => void;
}

function RatingScale({ recommendationObj, onFeedbackSent }: RatingScaleProps) {
  const [ratings, setRatings] = useState(recommendationObj.PredictedKnowledge);

  const [updatedRating, setUpdatedRating] = useState<number>(
    recommendationObj.PredictedKnowledge
  );
  const [ratingFeedback, setRatingFeedback] = useState<string>("yes");

  const username = localStorage.getItem("username");

  console.log(recommendationObj);
  console.log(recommendationObj.PredictedKnowledge);

  const [feedbackTabEnable, setFeedbackTabEnable] = useState<boolean>(true);

  const [feedbackSent, setFeedbackSent] = useState(false);

  const [sendFeedbackDisabled, setSendFeedbackdisabled] =
    useState<boolean>(true);

  useEffect(() => {
    setRatings(recommendationObj.PredictedKnowledge);
    setUpdatedRating(recommendationObj.PredictedKnowledge);
    console.log(ratingFeedback);
  }, [recommendationObj]);

  const handleRatingChange = (newValue: number) => {
    if (typeof newValue === "number") {
      setSendFeedbackdisabled(false);
      setUpdatedRating(newValue);
      setRatingFeedback(newValue === ratings ? "yes" : "no");
      // setRatings(newValue);
    }
  };

  const handleUpdate = async () => {
    const headers = { Username: String(username) };
    console.log("rating feedback", ratingFeedback);

    try {
      const formData = new FormData();

      formData.append("recommendation", JSON.stringify(recommendationObj));
      formData.append("rating_feedback", ratingFeedback);
      formData.append("updated_rating", String(updatedRating));
      const response = await fetch("http://127.0.0.1:8003/update_feedback/", {
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
        setFeedbackTabEnable(false);
        setFeedbackSent(true); // Set feedbackSent to true
        onFeedbackSent();
      }
    } catch (e) {
      console.log("Some error");
    }

    console.log("Ratings:", ratings);
  };

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      {feedbackTabEnable ? (
        <div>
          <Typography variant="body2" gutterBottom style={{ fontSize: "1rem" }}>
            <b>Provide Feedback :</b>
            <br />
            The recommendation above was given to you because the system
            determined that your level of understanding of the topic is:
          </Typography>
          <div style={{ position: "relative", textAlign: "center" }}>
            <CircularProgressBar
              selectedValue={ratings}
              maxValue={5}
              radius={50}
            />
          </div>
          <Box mt={1}>
            <Typography style={{ fontSize: "1rem" }}>
              Do you think the level of your understanding is correct?
            </Typography>
          </Box>
          <div>
            <div style={{ position: "relative" }}>
              <Slider
                value={updatedRating}
                onChange={(e, newValue) =>
                  handleRatingChange(newValue as number)
                }
                min={0}
                max={5}
                step={1}
                marks={marks}
              />
            </div>
            <div className="scaleValues">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={sendFeedbackDisabled}
            >
              Send Feedback
            </Button>
          </Box>
        </div>
      ) : (
        <Typography align="center" fontWeight="bold">
          The System will use this information to improve the system in the
          future!
        </Typography>
      )}
    </div>
  );
}

export default RatingScale;
