import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, Button, Paper } from "@mui/material";
import User from "./User";

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

  // const [searchTerm, setSearchTerm] = useState<String>(props.searchTerm);
  const { pageID } = useParams<{ pageID: string }>();
  const { term } = useParams<{ term: string }>();
  const [resultFound, setResultFound] = useState<boolean>();
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch result details based on resultId
    const fetchResultDetails = async () => {
      const headers = { Username: String(username) };
      try {
        // Replace with your API endpoint to fetch result details by ID
        const endpoint = `http://127.0.0.1:8000/get_page/?pageID=${pageID}`;
        const response = await fetch(endpoint, { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch result details");
        }

        const resultData: SearchResult = await response.json();
        setResult(resultData);
        if (result.Topic === "") {
          alert("Error, Please Try again");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert(error);
        navigate("/");
      }
    };

    fetchResultDetails();
  }, [pageID]);

  return (
    <div>
      <div className="resultsSection">
        <div className="result" key="1">
          <h3>{result.Topic}</h3>
          <p className="subtopic">{result.SubTopic}</p>
          {/* <p>{result.Summary}</p> */}
          <p dangerouslySetInnerHTML={{ __html: result.Content }}></p>
          {/* <a
            href={result.Link}
            target="_blank"
            rel="nofollow"
            // onClick={() => handleReadMore(result.ID)}
          >
            Read More
          </a> */}
        </div>
        <Link to={`/results/${term}`}>
          <Button variant="outlined" style={styles.backButton}>
            Back to Results
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default PageOverview;
