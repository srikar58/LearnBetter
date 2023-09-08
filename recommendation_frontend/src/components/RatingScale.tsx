import React, { useState } from "react";
import { Typography, Slider, Grid, Button, Box, Checkbox } from "@mui/material";

function RatingScale() {
  const initialRatings = [0, 0, 0, 0, 0];
  const [ratings, setRatings] = useState(initialRatings);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const options = [
    "Basic Understanding",
    "Deeper Exploration",
    "Application and Analysis",
    "Critical Analysis",
    "Synthesis and Evaluation",
  ];

  const handleRatingChange = (newValue: number | number[], index: number) => {
    if (typeof newValue === "number") {
      const newRatings = [...ratings];
      newRatings[index] = newValue;
      setRatings(newRatings);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const selectedIndex = selectedOptions.indexOf(index);
    const newSelectedOptions = [...selectedOptions];

    if (selectedIndex === -1) {
      newSelectedOptions.push(index);
    } else {
      newSelectedOptions.splice(selectedIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
  };

  const handleUpdate = () => {
    // Handle the update action for selected options with their ratings
    const selectedRatings = selectedOptions.map((index) => ({
      optionIndex: index,
      rating: ratings[index],
    }));

    console.log("Selected Options:", selectedOptions);
    console.log("Selected Ratings:", selectedRatings);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Typography variant="body2" gutterBottom style={{ fontSize: "15px" }}>
        <b>Provide Feedback :</b>
        <br></br>
        This recommendation is made to you as you have covered the below
        category of information in the topic you searched. Please check the
        boxes that have been identified incorrectly by the system and adjust the
        level that you think represents your prior knowledge about the topics.
      </Typography>
      <Grid container spacing={2}>
        {ratings.map((rating, index) => (
          <Grid item xs={12} key={index}>
            <Grid container alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  checked={selectedOptions.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="subtitle1" style={{ marginRight: "15px" }}>
                  {options[index]}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <div style={{ position: "relative" }}>
                  <Slider
                    value={rating}
                    onChange={(e, newValue) =>
                      handleRatingChange(newValue as number, index)
                    }
                    min={0}
                    max={5}
                    step={1}
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
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Send Feedback
        </Button>
      </Box>
    </div>
  );
}

export default RatingScale;
