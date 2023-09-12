import React, { useState, useEffect } from "react";
import { Typography, Slider, Button, Box } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

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

  const [updatedRating, setUpdatedRating] = useState<number>(-1);
  const [ratingFeedback, setRatingFeedback] = useState<string>("");
  const [scaleDisabled, setScaleDisable] = useState<boolean>(true);

  const username = localStorage.getItem("username");

  const [feedbackButtonDisabled, setFeedbackButtonDisabled] =
    useState<boolean>(true);
  console.log(recommendationObj);
  console.log(recommendationObj.PredictedKnowledge);

  const [feedbackTabEnable, setFeedbackTabEnable] = useState<boolean>(true);

  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    setRatings(recommendationObj.PredictedKnowledge);

    console.log(ratingFeedback);
    if (ratingFeedback !== "") {
      setFeedbackButtonDisabled(false);
    }
  }, [recommendationObj, ratingFeedback]);

  const handleRatingFeedbackChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScaleDisable(event.target.value === "yes");
    setRatingFeedback(event.target.value);
  };


  const handleRatingChange = (newValue: number) => {
    if (typeof newValue === "number") {
      setUpdatedRating(newValue);
      setRatings(newValue);
    }
  };

  const handleUpdate = async () => {
    const headers = { Username: String(username) };
    try {
      const formData = new FormData();

      formData.append("recommendation", JSON.stringify(recommendationObj));
      formData.append("rating_feedback", ratingFeedback);
      formData.append("updated_rating", String(updatedRating));
      const response = await fetch("http://127.0.0.1:8000/update_feedback/", {
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

  return (
    <div style={{ marginTop: "10px" }}>
      {feedbackTabEnable ? (
        <div>
          <Typography variant="body2" gutterBottom style={{ fontSize: "15px" }}>
            <b>Provide Feedback :</b>
            <br />
            The recommendation above was given to you because the system
            determined that your level of understanding of the topic is:
          </Typography>
          <div style={{ position: "relative" }}>
            <Slider
              value={ratings}
              onChange={(e, newValue) => handleRatingChange(newValue as number)}
              min={0}
              max={5}
              step={1}
              disabled
            />
            <div className="scaleValues">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
          <Box mt={1}>
            <Typography>
              Do you think the level of your understanding is correct?
            </Typography>
          </Box>
          <div>
            <RadioGroup
              name="ratingFeedback"
              value={ratingFeedback}
              onChange={handleRatingFeedbackChange}
              row // Use 'row' to display radio buttons horizontally
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Yes"
                labelPlacement="end" // Adjust label placement as needed
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No"
                labelPlacement="end" // Adjust label placement as needed
              />
              <FormControlLabel
                value="maybe"
                control={<Radio />}
                label="Maybe"
                labelPlacement="end" // Adjust label placement as needed
              />
            </RadioGroup>
            <p>Please Submit the Feedback</p>
          </div>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={feedbackButtonDisabled}
            >
              Send Feedback
            </Button>
          </Box>
        </div>
      ) : (
        <Typography align="center" fontWeight="bold">
          Thank you for providing Feedback for this Item!
        </Typography>
      )}
    </div>
  );
}

export default RatingScale;
