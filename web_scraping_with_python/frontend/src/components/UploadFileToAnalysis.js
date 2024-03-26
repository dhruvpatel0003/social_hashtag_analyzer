import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

const UploadFileToAnalysis = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [chart, setChart] = useState(null);

  console.log("document cookie :::::::::::: ", document.cookie);
  const user_id = document.cookie.split("=")[1];

  useEffect(() => {
    if (!analysisResults) return;

    // Initialize and render the chart based on sentiment
    const renderChart = () => {
      const ctx = document.getElementById("pieChart");
      const data = {
        labels: analysisResults.sentiment === "Positive" ? ["Positive Sentiment"] : ["Negative Sentiment"],
        datasets: [{
          label: "Sentiment Analysis",
          data: [1],
          backgroundColor: analysisResults.sentiment === "Positive" ? ["#36A2EB"] : ["#FF6384"],
          borderWidth: 1,
        }],
      };
      const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Sentiment Analysis",
          },
        },
      };
      const newChart = new Chart(ctx, {
        type: "pie",
        data: data,
        options: options,
      });
      setChart(newChart);
    };

    renderChart();
  }, [analysisResults]);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const onUpload = async () => {
    if (!selectedFile || !user_id) {
      console.log("Missing file or user_id");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", user_id);

    try {
      const response = await fetch("api/analize-text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResults(result);
      } else {
        console.error("Failed to upload file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
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
          <h3>Analysis Results:</h3>
          <p>Cleaned Text: {analysisResults.cleaned_text}</p>
          <p>
            Identified Politicians:{" "}
            {analysisResults.identified_politicians.join(", ")}
          </p>
          <p>
            Keywords : {analysisResults.keywords
              ? Object.entries(analysisResults.keywords)
                  .map(([keyword, frequency]) => `${keyword}: ${frequency}`)
                  .join(", ")
              : "Keywords not available"}
          </p>
          <p>Sentiment: {analysisResults.sentiment}</p>

          {/* Render pie chart based on sentiment */}
          <canvas id="pieChart" width="400" height="400"></canvas>
        </div>
      )}
    </div>
  );
};

export default UploadFileToAnalysis;
