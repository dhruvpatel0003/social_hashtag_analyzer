import "chart.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  Tooltip,
  Brush,
} from "recharts";
import ExcelJS from "exceljs";
import html2canvas from "html2canvas";

let workbook;

const ViewReport = () => {
  const [reportData, setReportData] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0); // Added state for selected report index
  let instagram_followers_change = [];
  let youtube_subscribers_change = [];

  const navigate = useNavigate();
  const userId = document.cookie.split(";")[0].split("=")[1]; // Replace with the actual user ID
  useEffect(() => {
    console.log("inside the view report component");
    const getReportData = () => {
      setLoading(true);
      fetch(`/api/get-analysis-reports/${userId}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setReportData(data);
          setLoading(false);
        });
    };
    getReportData();
  }, []);

  if (!loading) {
    console.log("before dict ", reportData);
    const selectedReportData = reportData[0].report_data[selectedReportIndex];
    console.log(
      "selected report ",
      selectedReportIndex,
      "data ",
      selectedReportData
    );

    const dict = {
      user_id: userId,
      hashtag: selectedReportData["hashtag"],
      hashtag_stats: {
        user: reportData[0]["user_id"],
        youtube_stats: {
          name: selectedReportData.hashtag_stats[0]?.youtube_stats?.name || "",
          current_status:
            selectedReportData.hashtag_stats[0]?.youtube_stats
              ?.current_status || [],
        },
        instagram_stats: {
          current_status:
            selectedReportData.hashtag_stats[0]?.instagram_stats
              ?.current_status || [],
        },
        // twitter_stats: {
        //   joining_date:
        //     selectedReportData.hashtag_stats[0]?.twitter_stats?.joining_date ||
        //     "",
        //   comments:
        //     selectedReportData.hashtag_stats[0]?.twitter_stats?.comments || [],
        //   current_status:
        //     selectedReportData.hashtag_stats[0]?.twitter_stats
        //       ?.current_status || [],
        // },
      },
    };
    console.log("dict in the view componenet : ::::::::::::::::::::::: ", dict);

    // const transformedData_graph1 =
    //   dict.hashtag_stats.twitter_stats.comments.map((comment) => ({
    //     name: comment.comment_date,
    //     likes: parseInt(comment.likes, 10),
    //     retweets: parseInt(comment.retweets, 10),
    //     comments: parseInt(comment.comments, 10),
    //   }));
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const parseInstagramFollowers = (followers) => {
      const numericValue = parseFloat(followers);

      if (followers.includes("M")) {
        return numericValue * 1000000;
      } else if (followers.includes("K")) {
        return numericValue * 1000;
      } else {
        return numericValue;
      }
    };

    // Additional graph for Instagram
    const transformedData_graph_instagram =
      dict.hashtag_stats.instagram_stats.current_status.map((status) => ({
        name: status.current_date,
        followers: parseInstagramFollowers(status.followers),
        followings: parseInt(status.followings, 10),
        posts: parseInt(status.posts, 10),
      }));

      transformedData_graph_instagram.forEach((status, index) => {
        // console.log("status : ",status);
        const previousStatus =
          index > 0 ? transformedData_graph_instagram[index - 1] : null;
  
        const followersChange = previousStatus
          ? status.followers - previousStatus.followers
          : 0;
  
        instagram_followers_change.push({
          date: status.name,
          followersChanging: followersChange,
        });
      });

    // Additional graph for YouTube
    const transformedData_graph_youtube =
      dict.hashtag_stats.youtube_stats.current_status.map((status) => ({
        name: status.current_date,
        video_count: parseInt(status.video_count, 10),
        subscriber_count: parseInt(status.subscriber_count, 10),
        views_count: parseInt(status.views_count, 10),
      }));

      transformedData_graph_youtube.forEach((status, index) => {
        // console.log("status : ",status);
        const previousStatus =
          index > 0 ? transformedData_graph_youtube[index - 1] : null;
  
        const subscriberChanges = previousStatus
          ? status.subscriber_count - previousStatus.subscriber_count
          : 0;
  
        youtube_subscribers_change.push({
          date: status.name,
          subscriberChanging: subscriberChanges,
        });
      });

    ////////////////////////////////////////////////////// twitter /////////////////////////////////////////////////////

    // const parseTwitterFollowers = (followers) => {
    //   const numericValue = parseFloat(followers);

    //   if (followers.includes("M")) {
    //     return numericValue * 1000000;
    //   } else if (followers.includes("K")) {
    //     return numericValue * 1000;
    //   } else {
    //     return numericValue;
    //   }
    // };

    // const parseTwitterFollowings = (followings) => {
    //   const numericValue = parseFloat(followings);

    //   if (followings.includes("M")) {
    //     return numericValue * 1000000;
    //   } else if (followings.includes("K")) {
    //     return numericValue * 1000;
    //   } else {
    //     return numericValue;
    //   }
    // };

    // const transformedData_graph_twitter =
    //   dict.hashtag_stats.twitter_stats.current_status.map((status) => ({
    //     name: status.current_date,
    //     followers: parseTwitterFollowers(status.followers),
    //     followings: parseTwitterFollowings(status.followings),
    //   }));

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const formatNumber = (value) => {
      if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)} M`;
      } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)} K`;
      } else {
        return value;
      }
    };

    const captureAndConvertToBase64 = async (selector) => {
      const element = document.querySelector(selector);
      const canvas = await html2canvas(element);
      return canvas.toDataURL("image/png");
    };

    const addImageToWorksheet = (sheet, base64Image, startCol, startRow) => {
      const imageId = workbook.addImage({
        base64: base64Image,
        extension: "png",
      });

      sheet.addImage(imageId, {
        tl: { col: startCol, row: startRow },
        br: { col: startCol + 10, row: startRow + 15 },
        editAs: "oneCell",
      });
    };
    const downloadPageData = async () => {
      if (!workbook) {
        workbook = new ExcelJS.Workbook();
      }

      const sheet = workbook.addWorksheet("Analysis");

      // const graph1Image = await captureAndConvertToBase64("#graph1-container");
      // addImageToWorksheet(sheet, graph1Image, 1, 1);

      // const twitterProfileImage = await captureAndConvertToBase64(
      //   "#twitter-profile-container"
      // );
      // addImageToWorksheet(sheet, twitterProfileImage, 12, 1);

      const instagramProfileImage = await captureAndConvertToBase64(
        "#instagram-profile-container"
      );
      addImageToWorksheet(sheet, instagramProfileImage, 1, 20);

      const youtubeProfileImage = await captureAndConvertToBase64(
        "#youtube-profile-container"
      );
      addImageToWorksheet(sheet, youtubeProfileImage, 12, 20);

      // addTableToWorksheet(sheet, "#twitter-comments-table-container", 1, 40);
      // addTableToWorksheet(sheet, "#twitter-profile-table-container", 1, 60);
      addTableToWorksheet(sheet, "#instagram-profile-table-container", 1, 80);
      addTableToWorksheet(sheet, "#youtube-profile-table-container", 1, 100);

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "SocialAnalyzer_Analysis.xlsx";
        link.click();
      });
    };

    const addTableToWorksheet = (sheet, selector, startCol, startRow) => {
      const tableElement = document.querySelector(selector);

      if (!tableElement) {
        console.error(`Table with selector ${selector} not found.`);
        return;
      }

      const headerRow = tableElement.querySelector("thead tr");

      if (!headerRow) {
        console.error(
          `Header row not found in the table with selector ${selector}.`
        );
        return;
      }

      Array.from(headerRow.cells).forEach((cell, index) => {
        sheet.getCell(startRow, startCol + index).value =
          cell.textContent.trim();
      });

      const rows = tableElement.querySelectorAll("tbody tr");
      rows.forEach((row, rowIndex) => {
        const cells = row.cells;
        Array.from(cells).forEach((cell, cellIndex) => {
          sheet.getCell(startRow + rowIndex + 1, startCol + cellIndex).value =
            cell.textContent.trim();
        });
      });
    };

    const handleReportClick = (index) => {
      // Set the selected report index in the state
      setSelectedReportIndex(index);
    };

    return (
      <div>
        <div>
          <button onClick={() => navigate("/search")}>Back</button>
        </div>

        {/* Display serial numbers and report hashtags */}
        <div style={{ marginBottom: "20px" }}>
          {reportData[0].report_data.map((report, index) => (
            <span
              key={index}
              style={{
                marginRight: "10px",
                cursor: "pointer",
                fontWeight: selectedReportIndex === index ? "bold" : "normal",
              }}
              onClick={() => handleReportClick(index)}
            >
              {index + 1}. {report.hashtag}{" "}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* <div id="graph1-container">
            <h1>Twitter Comments Graph</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart
                width={800}
                height={500}
                data={transformedData_graph1}
                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                <Line type="monotone" dataKey="retweets" stroke="#82ca9d" />
                <Line type="monotone" dataKey="comments" stroke="#ffc658" />
                <Brush dataKey="name" height={30} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div id="twitter-profile-container">
            <h1>Twitter Profile</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart
                width={800}
                height={500}
                data={transformedData_graph_twitter}
                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="followers" stroke="#8884d8" />
                <Line type="monotone" dataKey="followings" stroke="#82ca9d" />
                <Brush dataKey="name" height={30} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div> */}
          <div id="instagram-profile-container">
            <h1>Instagram Profile</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart
                width={800}
                height={500}
                data={instagram_followers_change}
                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="followersChanging" stroke="#8884d8" />
                {/* <Line type="monotone" dataKey="followings" stroke="#82ca9d" /> */}
                {/* <Line type="monotone" dataKey="posts" stroke="#ffc658" /> */}
                {/* <Brush dataKey="name" height={30} stroke="#8884d8" /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div id="youtube-profile-container">
            <h1>YouTube Profile</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart
                width={800}
                height={500}
                data={transformedData_graph_youtube}
                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip />
                <Legend />
                {/* <Line type="monotone" dataKey="video_count" stroke="#8884d8" />
                <Line
                  type="monotone"
                  dataKey="subscriber_count"
                  stroke="#82ca9d"
                />
                <Line type="monotone" dataKey="views_count" stroke="#ffc658" />
                <Brush dataKey="name" height={30} stroke="#8884d8" /> */}
                 <Line
                    type="monotone"
                    dataKey="subscriberChanging"
                    stroke="#8884d8"
                    data={youtube_subscribers_change}
                  />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* <div id="twitter-comments-table-container" style={{ margin: "10px" }}>
            <h1>Twitter Comments Table</h1>
            <table border="1">
              <thead>
                <tr>
                  <th>Comment Date</th>
                  <th>Likes</th>
                  <th>Retweets</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {transformedData_graph1.map((comment, index) => (
                  <tr key={index}>
                    <td>{comment.name}</td>
                    <td>{comment.likes}</td>
                    <td>{comment.retweets}</td>
                    <td>{comment.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          {/* <div id="twitter-profile-table-container" style={{ margin: "10px" }}>
            <h1>Twitter Profile Table</h1>
            <table border="1">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Followers</th>
                  <th>Followings</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {transformedData_graph_twitter.map((status, index) => {
                  const previousStatus =
                    index > 0 ? transformedData_graph_twitter[index - 1] : null;

                  const followersChange = previousStatus
                    ? status.followers - previousStatus.followers
                    : 0;

                  const changeIndicator =
                    followersChange > 0 ? (
                      <span style={{ color: "green" }}>
                        ↑ {formatNumber(followersChange)}
                      </span>
                    ) : followersChange < 0 ? (
                      <span style={{ color: "red" }}>
                        ↓ {formatNumber(Math.abs(followersChange))}
                      </span>
                    ) : (
                      "No Change"
                    );

                  return (
                    <tr key={index}>
                      <td>{status.name}</td>
                      <td>{formatNumber(status.followers)}</td>
                      <td>{formatNumber(status.followings)}</td>
                      <td>{changeIndicator}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div> */}
          <div
            id="instagram-profile-table-container"
            style={{ margin: "10px" }}
          >
            <h1>Instagram Profile Table</h1>
            <table border="1">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Followers</th>
                  <th>Followings</th>
                  <th>Posts</th>
                  <th>Followers Change</th>
                </tr>
              </thead>
              <tbody>
                {transformedData_graph_instagram.map((status, index) => {
                  const previousStatus =
                    index > 0
                      ? transformedData_graph_instagram[index - 1]
                      : null;

                  const followersChange = previousStatus
                    ? status.followers - previousStatus.followers
                    : 0;

                  const changeIndicator =
                    followersChange > 0 ? (
                      <span style={{ color: "green" }}>
                        ↑ {formatNumber(followersChange)}
                      </span>
                    ) : followersChange < 0 ? (
                      <span style={{ color: "red" }}>
                        ↓ {formatNumber(Math.abs(followersChange))}
                      </span>
                    ) : (
                      "No Change"
                    );

                  return (
                    <tr key={index}>
                      <td>{status.name}</td>
                      <td>{formatNumber(status.followers)}</td>
                      <td>{formatNumber(status.followings)}</td>
                      <td>{status.posts}</td>
                      <td>{changeIndicator}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div id="youtube-profile-table-container" style={{ margin: "10px" }}>
            <h1>YouTube Profile Table</h1>
            <table border="1">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Video Count</th>
                  <th>Subscriber Count</th>
                  <th>Views Count</th>
                  <th>Subscriber Change</th>
                </tr>
              </thead>
              <tbody>
                {transformedData_graph_youtube.map((status, index) => {
                  const previousStatus =
                    index > 0 ? transformedData_graph_youtube[index - 1] : null;

                  const subscriberChange = previousStatus
                    ? status.subscriber_count - previousStatus.subscriber_count
                    : 0;

                  const changeIndicator =
                    subscriberChange > 0 ? (
                      <span style={{ color: "green" }}>
                        ↑ {formatNumber(subscriberChange)}
                      </span>
                    ) : subscriberChange < 0 ? (
                      <span style={{ color: "red" }}>
                        ↓ {formatNumber(Math.abs(subscriberChange))}
                      </span>
                    ) : (
                      "No Change"
                    );

                  return (
                    <tr key={index}>
                      <td>{status.name}</td>
                      <td>{status.video_count}</td>
                      <td>{formatNumber(status.subscriber_count)}</td>
                      <td>{formatNumber(status.views_count)}</td>
                      <td>{changeIndicator}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={downloadPageData}>Download Page Data</button>
      </div>
    );
  }
};

export default ViewReport;
