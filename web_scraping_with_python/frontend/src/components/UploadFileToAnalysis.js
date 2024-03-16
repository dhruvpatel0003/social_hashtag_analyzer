import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadFileToAnalysis = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  console.log("document cookie :::::::::::: ", document.cookie);
  const user_id = document.cookie.split("=")[1];

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const onUpload = async (e) => {
    if (!selectedFile || !user_id) {
      console.log("Missing file or user_id");
      return;
    }

    console.log(
      "selected file >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",
      selectedFile
    );

    console.log(e);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", user_id);
    console.log("form Data :::::::::::::::::::::: ", formData);

    try {
      const response = await fetch("api/analize-text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResults(null);
        setAnalysisResults(result);
      } else {
        console.error("Failed to upload file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const handleOnDownloadCleanText = () => {
    const jsonString = JSON.stringify(analysisResults.cleaned_text, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "SocialAnalyzer_PlainText.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <button onClick={() => navigate("/search")}>Back</button>
      <h2>Upload File to Analysis</h2>
      <p>USER_ID : {user_id}</p>
      <input type="file" accept=".txt" onChange={onFileChange} />
      <br />
      <br />
      <button onClick={onUpload}>Upload</button>

      {analysisResults && (
        <div>
          <button onClick={handleOnDownloadCleanText}>
            Download Clean Text
          </button>
          <h3>Analysis Results:</h3>
          <p>Cleaned Text: {analysisResults.cleaned_text}</p>
          <p>
            Identified Politicians:{" "}
            {analysisResults.identified_politicians.join(", ")}
          </p>
          {/* <p>Keywords: {analysisResults.keywords.join(", ")}</p> */}
          <p>
            Keywords : {analysisResults.keywords
              ? Object.entries(analysisResults.keywords)
                  .map(([keyword, frequency]) => `${keyword}: ${frequency}`)
                  .join(", ")
              : "Keywords not available"}
          </p>
          <p>Sentiment: {analysisResults.sentiment}</p>
        </div>
      )}
    </div>
  );
};

export default UploadFileToAnalysis;
