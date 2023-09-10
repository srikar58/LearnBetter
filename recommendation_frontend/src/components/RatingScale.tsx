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
}

function RatingScale({ recommendationObj }: RatingScaleProps) {
  const [ratings, setRatings] = useState(recommendationObj.PredictedKnowledge);

  const [radioOption, setRadioOption] = useState("");
  const [scaleDisabled, setScaleDisable] = useState<boolean>(true);
  console.log(recommendationObj);
  console.log(recommendationObj.PredictedKnowledge);

  useEffect(() => {
    setRatings(recommendationObj.PredictedKnowledge);
  }, [recommendationObj]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScaleDisable(event.target.value === "yes");
    if (event.target.value === "yes") {
      setRadioOption("yes");
    } else {
      setRadioOption("no");
    }
  };
  const handleRatingChange = (newValue: number) => {
    if (typeof newValue === "number") {
      const oldRatings = ratings;
      setRatings(newValue);
    }
  };

  const handleUpdate = () => {
    // Handle the update action for selected options with their ratings

    console.log("Ratings:", ratings);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Typography variant="body2" gutterBottom style={{ fontSize: "15px" }}>
        <b>Provide Feedback :</b>
        <br></br>
        This recommendation is made to you as you have covered the below
        category of information in the topic you searcheduseEffect. Please check
        the boxes that have been identified incorrectly by the system and adjust
        the level that you think represents your prior knowledge about the
        topics.
      </Typography>
      <div style={{ position: "relative" }}>
        <Slider
          value={ratings}
          onChange={(e, newValue) => handleRatingChange(newValue as number)}
          min={0}
          max={5}
          step={1}
          disabled={scaleDisabled}
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
        <Typography>Is the scale provided above relevant?</Typography>
      </Box>
      <div>
        <RadioGroup
          name="yesNo"
          value={radioOption}
          onChange={handleRadioChange}
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
        </RadioGroup>
        <p>
          {scaleDisabled
            ? "Please Submit the Feedback"
            : "Please Update the scale to match your knwoledge and submit the feedback"}
        </p>
      </div>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Send Feedback
        </Button>
      </Box>
    </div>
  );
}

export default RatingScale;
