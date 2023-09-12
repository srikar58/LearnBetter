import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { Slider } from "@mui/material";
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
    onRecommendationFeedbackSubmit: (feedback: number) => void;
  }

export default function FeedbackModal({open,onClose,onRecommendationFeedbackSubmit}: RecommendationFeedbackModalProps): JSX.Element {
    const [recommendationFeedback, setRecommendationFeedback] = useState<number>(0);
    const handleSubmit = () => {
        onRecommendationFeedbackSubmit(recommendationFeedback);
      };

const marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
];

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
                Recommendation Quality
              </Typography>
              <Typography component="h2" textAlign={"center"}> The Recommended item was relevant.</Typography>
            <div style={{ position: "relative",width:"80%" }}>
                <Slider
                value={recommendationFeedback}
                onChange={(e, newValue) => setRecommendationFeedback(newValue as number)}
                marks={marks}
                min={1}
                max={5}
                step={1}
                />
                <div className="scaleValues">
                <span>Disagree</span>
                <span>Agree</span>
                </div>

            </div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                disabled={recommendationFeedback===0}
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
