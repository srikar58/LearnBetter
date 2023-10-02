import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { Slider, Radio, RadioGroup, FormControlLabel } from "@mui/material";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface RecommendationFeedbackModalProps {
    open: boolean;
    onClose: () => void;
    onRecommendationFeedbackSubmit: (feedback: String) => void;
  }

export default function ViewRecommendationModal({open,onClose,onRecommendationFeedbackSubmit}: RecommendationFeedbackModalProps): JSX.Element {
    const [recommendationViewFeedback, setRecommendationViewFeedback] = useState<String>("");
    const handleSubmit = () => {
        onRecommendationFeedbackSubmit(recommendationViewFeedback);
      };
    
    const handleRatingFeedbackChange = (
    event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRecommendationViewFeedback(event.target.value);
    };
  return (
    <div className="overlay hidden">
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Feedback
              </Typography>
              <Typography component="h2" textAlign={"left"}>  How willing are you to view the recommended item?</Typography>
            <div style={{ position: "relative",width:"100%" }}>
            <RadioGroup
              name="ratingFeedback"
              value={recommendationViewFeedback}
              onChange={handleRatingFeedbackChange}
               // Use 'row' to display radio buttons horizontally
            >
              <FormControlLabel
                value="not willing"
                control={<Radio />}
                label="Not willing"
                labelPlacement="end" // Adjust label placement as needed
              />
              <FormControlLabel
                value="not really willing"
                control={<Radio />}
                label="Not really willing"
                labelPlacement="end" // Adjust label placement as needed
              />
              <FormControlLabel
                value="undecided"
                control={<Radio />}
                label="undecided"
                labelPlacement="end" // Adjust label placement as needed
              />
              <FormControlLabel
                value="somewhat willing"
                control={<Radio />}
                label="Somewhat willing"
                labelPlacement="end" // Adjust label placement as needed
              />
              <FormControlLabel
                value="willing"
                control={<Radio />}
                label="Willing"
                labelPlacement="end" // Adjust label placement as needed
              />
            </RadioGroup>

            </div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                disabled={recommendationViewFeedback===""}
            >
                Submit
            </Button>
            </Box>
          </Container>
        </Box>
      </Modal>
    </div>
  );
}
