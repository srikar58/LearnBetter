import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};


interface RecommendationFeedbackModalProps {
    open: boolean;
    onClose: () => void;
    onFeedbackSubmit: (recommendationfeedback: String, willingFeedback: String) => void;
  }

export default function FeedbackModal({open,onClose,onFeedbackSubmit}: RecommendationFeedbackModalProps): JSX.Element {
    const [recommendationFeedback, setRecommendationFeedback] = useState<String>("");
    const [willingFeedback, setWillingFeedback] = useState<String>("");
    const handleSubmit = () => {
        onFeedbackSubmit(recommendationFeedback, willingFeedback);
      };

    const handleWillingFeedbackChange = (
      event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setWillingFeedback(event.target.value);
      };

    const handleRelevanceFeedbackchange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRecommendationFeedback(event.target.value);
    }


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
              <Typography component="h2" textAlign={"left"}> How relevant do you find the information on this page?</Typography>
              <div style={{ position: "relative",width:"100%" }}>
                <RadioGroup
                name="relevanceFeedback"
                value={recommendationFeedback}
                onChange={handleRelevanceFeedbackchange}
                // Use 'row' to display radio buttons horizontally
                >
                  <FormControlLabel
                    value="irrelevant"
                    control={<Radio />}
                    label="Irrelevant"
                    labelPlacement="end" // Adjust label placement as needed
                  />
                  <FormControlLabel
                    value="somewhat  irrelevant"
                    control={<Radio />}
                    label="Somewhat  irrelevant"
                    labelPlacement="end" // Adjust label placement as needed
                  />
                  <FormControlLabel
                    value="neither irrelevant nor relevant"
                    control={<Radio />}
                    label="Neither irrelevant nor relevant"
                    labelPlacement="end" // Adjust label placement as needed
                  />
                  <FormControlLabel
                    value="somewhat relevant"
                    control={<Radio />}
                    label="Somewhat relevant"
                    labelPlacement="end" // Adjust label placement as needed
                  />
                  <FormControlLabel
                    value="relevant"
                    control={<Radio />}
                    label="Relevant"
                    labelPlacement="end" // Adjust label placement as needed
                  />
                </RadioGroup>
              </div>
              <Typography component="h2" textAlign={"left"}> How willing are you to view the next recommendation from the system?</Typography>
            <div style={{ position: "relative",width:"100%" }}>
            <RadioGroup
              name="willingFeedback"
              value={willingFeedback}
              onChange={handleWillingFeedbackChange}
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
                label="Undecided"
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
                disabled={recommendationFeedback==="" || willingFeedback===""}
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
