import React, { useEffect, useState, useContext } from "react";
// import { Bar } from "react-chartjs-2";
import "chart.js";
import { useNavigate, useParams } from "react-router-dom";
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
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import CompareData from "./CompareData";
import { DataContext } from "./DataContext";

let workbook;

const Analysis = () => {
  const { data } = useContext(DataContext);
  const navigate = useNavigate();
  const { hashtag } = useParams();
  const userId = document.cookie.split(";")[0].split("=")[1]; // Replace with the actual user ID
  // console.log("hashtag passed from searchPage ", hashtag);
  const [dataDict, setDataDict] = useState();
  const [showGraphData, setShowGraphData] = useState(false);
  const [showInputField, setShowInputField] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [dataToCompare, setDataToCompare] = useState([]);
  const [showCompareData, setShowCompareData] = useState([]);
  const [disableToShowCompareHashtag, setDisableToShowCompareHashtag] =
    useState(false);
  let instagram_followers_change = [];
  let youtube_subscribers_change = [];

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/get-stored-apify-hashtag/${hashtag}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          // console.log(
          //   "After fetching from database using apify : ",
          //   data,
          //   data.hashtag_stats
          // );
          setDataDict(data);
        });
    };
    fetchData();
  }, []);

  const dict = {
    hashtag: "carryminati",
    hashtag_stats: [
      {
        youtube_stats: {
          current_status: [
            {
              current_date: "2022-01-22",
              views_count: 1042,
              subscriber_count: 197,
              video_count: 50,
            },
            {
              current_date: "2022-01-21",
              views_count: 999,
              subscriber_count: 200,
              video_count: 51,
            },
            {
              current_date: "2022-01-20",
              views_count: 1000,
              subscriber_count: 345,
              video_count: 49,
            },
            {
              current_date: "2022-01-19",
              views_count: 1000,
              subscriber_count: 299,
              video_count: 47,
            },
            {
              current_date: "2022-01-18",
              views_count: 1000,
              subscriber_count: 293,
              video_count: 45,
            },
            {
              current_date: "2022-01-17",
              views_count: 1000,
              subscriber_count: 400,
              video_count: 60,
            },
          ],
        },
        instagram_stats: {
          current_status: [
            {
              current_date: "2022-01-22",
              followers: "139 M",
              followings: "231 K",
              posts: 193,
            },
            {
              current_date: "2022-01-21",
              followers: "911 M",
              followings: "201 K",
              posts: 183,
            },
            {
              current_date: "2022-01-20",
              followers: "191 M",
              followings: "201 K",
              posts: 143,
            },
            {
              current_date: "2022-01-19",
              followers: "113 M",
              followings: "999 K",
              posts: 123,
            },
            {
              current_date: "2022-01-18",
              followers: "111 M",
              followings: "221 K",
              posts: 123,
            },
          ],
        },
        twitter_stats: {
          current_status: [
            {
              current_date: "2022-01-19",
              followers: "200 M",
              followings: "100 K",
            },
            {
              current_date: "2022-01-18",
              followers: "333 M",
              followings: "222 K",
            },
            {
              current_date: "2022-01-17",
              followers: "345 M",
              followings: "111 K",
            },
            {
              current_date: "2022-01-16",
              followers: "222 M",
              followings: "999 K",
            },
            {
              current_date: "2022-01-15",
              followers: "203 M",
              followings: "134 K",
            },
            {
              current_date: "2022-01-14",
              followers: "220 M",
              followings: "104 K",
            },
          ],
          joining_date: "2020-01-1",
          comments: [
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "120",
              likes: 2350,
              retweets: 101,
              comment_date: "2023-12-16",
            },
            {
              text: "Random number se what's app pe part job ke liye message aah rahe hai, bhenchod inhe kaise pata paise khatam ho rahe hai",
              url: "https://twitter.com/CarryMinati/status/1754787110949679380#m",
              comments: "195",
              likes: 3464,
              retweets: 103,
              comment_date: "2024-02-17",
            },
            {
              text: "Itne bade hogye ho abhi bhee there aur their mein confuse ho jate ho",
              url: "https://twitter.com/CarryMinati/status/1754485778913071614#m",
              comments: "202",
              likes: 4097,
              retweets: 212,
              comment_date: "2024-02-18",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "120",
              likes: 2351,
              retweets: 901,
              comment_date: "2024-02-19",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "111",
              likes: 2334,
              retweets: 701,
              comment_date: "2024-02-20",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "269",
              likes: 2321,
              retweets: 901,
              comment_date: "2024-02-21",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "568",
              likes: 2311,
              retweets: 401,
              comment_date: "2024-02-22",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "110",
              likes: 1223,
              retweets: 801,
              comment_date: "2024-02-23",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "100",
              likes: 1232,
              retweets: 701,
              comment_date: "2024-02-24",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "124",
              likes: 2322,
              retweets: 601,
              comment_date: "2024-02-25",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "900",
              likes: 2222,
              retweets: 301,
              comment_date: "2024-02-26",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "123",
              likes: 3490,
              retweets: 131,
              comment_date: "2024-02-27",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "232",
              likes: 2310,
              retweets: 201,
              comment_date: "2024-02-28",
            },
            {
              text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
              url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
              comments: "234",
              likes: 2300,
              retweets: 102,
              comment_date: "2024-02-29",
            },
          ],
        },
      },
    ],
  };

  // console.log("Dict data : ", dict);
  // console.log("inside the if condition, and getting the dict :");
  let savingData = {};
  // if(dataDict){
  // console.log("data dict inside if statement: ", dataDict);
  // savingData = {
  //   user_id: userId,
  //   report_data: dataDict.hashtag_stats.map((hashtagStat) => ({
  //     hashtag: dataDict.hashtag,
  //     hashtag_stats: [
  //       {
  //         youtube_stats: hashtagStat.youtube_stats.current_status
  //           ? {
  //               current_status: hashtagStat.youtube_stats.current_status.map(
  //                 (status) => ({
  //                   current_date: status.current_date,
  //                   views_count: status.views_count,
  //                   subscriber_count: status.subscriber_count,
  //                   video_count: status.video_count,
  //                 })
  //               ),
  //             }
  //           : {},
  //         instagram_stats: hashtagStat.instagram_stats.current_status
  //           ? {
  //               current_status: hashtagStat.instagram_stats.current_status.map(
  //                 (status) => ({
  //                   current_date: status.current_date,
  //                   followers: status.followers,
  //                   followings: status.followings,
  //                   posts: status.posts,
  //                 })
  //               ),
  //             }
  //           : {},
  //         twitter_stats: hashtagStat.twitter_stats.current_status
  //           ? {
  //               current_status: hashtagStat.twitter_stats.current_status.map(
  //                 (status) => ({
  //                   current_date: status.current_date,
  //                   followers: status.followers,
  //                   followings: status.followings,
  //                 })
  //               ),
  //               joining_date: hashtagStat.twitter_stats.joining_date,
  //               comments: hashtagStat.twitter_stats.comments.map((comment) => ({
  //                 text: comment.text,
  //                 url: comment.url,
  //                 comments: comment.comments,
  //                 likes: comment.likes,
  //                 retweets: comment.retweets,
  //                 comment_date: comment.comment_date,
  //               })),
  //             }
  //           : {},
  //       },
  //     ],
  //   })),
  // };
  // }

  const handleOnViewReport = () => {
    navigate("/view-reports");
  };

  ////////////////////////////////////  ////////////////////////////////////////////////////////////////////////////
  console.log(
    "before the transformed data of graph1 ::::::::::::::::::::::::::::::  ",
    data["data"],
    data["data"].hashtag_stats[0].twitter_stats.comments[0].comment_data
  );
  const transformedData_graph1 = data[
    "data"
  ].hashtag_stats[0].twitter_stats.comments.map((comment) => ({
    name: comment.comment_data,
    likes: parseInt(comment.likes, 10),
    retweets: parseInt(comment.retweets, 10),
    // comments: parseInt(comment.comments, 10),
  }));
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
  var transformedData_graph_instagram = {};
  var transformedData_graph_youtube = {};
  // var followersChangeData = [];
  // var instagram_

  if (dataDict) {
    console.log("inside the if statement : ", dataDict);
    transformedData_graph_instagram =
      dataDict.hashtag_stats[0].instagram_stats.map((status) => ({
        name: status.current_date,
        followers: parseFloat(status.followers), // Normalize to millions
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
    console.log("Youtube stats : ", dataDict.hashtag_stats[0].youtube_stats);

    transformedData_graph_youtube = dataDict.hashtag_stats[0].youtube_stats.map(
      (status) => ({
        name: status.current_date,
        video_count: parseInt(status.video_count, 10),
        subscriber_count: parseInt(status.subscription_count, 10),
        views_count: parseInt(status.views_count, 10),
      })
    );

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
  }

  ////////////////////////////////////////////////////// twitter /////////////////////////////////////////////////////

  const parseTwitterFollowers = (followers) => {
    const numericValue = parseFloat(followers);

    if (followers.includes("M")) {
      return numericValue * 1000000;
    } else if (followers.includes("K")) {
      return numericValue * 1000;
    } else {
      return numericValue;
    }
  };

  const parseTwitterFollowings = (followings) => {
    const numericValue = parseFloat(followings);

    if (followings.includes("M")) {
      return numericValue * 1000000;
    } else if (followings.includes("K")) {
      return numericValue * 1000;
    } else {
      return numericValue;
    }
  };

  const transformedData_graph_twitter =
    dict.hashtag_stats[0].twitter_stats.current_status.map((status) => ({
      name: status.current_date,
      followers: parseTwitterFollowers(status.followers),
      followings: parseTwitterFollowings(status.followings),
    }));

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

  const handleOnBack = () => {
    navigate("/search");
  };

  /////////////////////////////////////////////// Download Analysis Page ///////////////////////////////////////////////////////////////////////

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
      sheet.getCell(startRow, startCol + index).value = cell.textContent.trim();
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleOnSaveReport = () => {
    console.log("dict ", dict);
    console.log("data dict ", dataDict);
    saveReport();
  };

  const saveReport = () => {
    console.log("data dict inside if statement: >>>>>>>>> ", dataDict.hashtag_stats);
    savingData = {
      user_id: userId,
      report_data: [{
        hashtag: dataDict.hashtag,
        hashtag_stats: [
          {
            youtube_stats: dataDict.hashtag_stats[0].youtube_stats.length > 0
              ? {
                  current_status: dataDict.hashtag_stats[0].youtube_stats.map(
                    (status) => ({
                      current_date: status.current_date,
                      views_count: status.views_count,
                      subscriber_count: status.subscriber_count,
                      video_count: status.video_count,
                    })
                  ),
                }
              : {},
            instagram_stats: dataDict.hashtag_stats[0].instagram_stats.length > 0
              ? {
                  current_status: dataDict.hashtag_stats[0].instagram_stats.map(
                    (status) => ({
                      current_date: status.current_date,
                      followers: status.followers,
                      followings: status.followings,
                      posts: status.posts,
                    })
                  ),
                }
              : {},
            // twitter_stats: dataDict.hashtag_stats.twitter_stats.length > 0
            //   ? {
            //       current_status: dataDict.hashtag_stats.twitter_stats.current_status.map(
            //         (status) => ({
            //           current_date: status.current_date,
            //           followers: status.followers,
            //           followings: status.followings,
            //         })
            //       ),
            //       joining_date: dataDict.hashtag_stats.joining_date,
            //       comments: hashtagStat.twitter_stats.comments.map((comment) => ({
            //         text: comment.text,
            //         url: comment.url,
            //         comments: comment.comments,
            //         likes: comment.likes,
            //         retweets: comment.retweets,
            //         comment_date: comment.comment_date,
            //       })),
            //     }
            //   : {},
            twitter_stats : {}
          },
        ],
      }],
    };
    console.log("The saving data : ",JSON.stringify(savingData));
    fetch("/api/save-analysis-reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(savingData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Report saved successfully");
        } else {
          console.error("Error saving report:", response.statusText);
        }
      })
      .catch((error) => console.error("Error saving report:", error.message));
  };

  const handleOnShowGraph = () => {
    console.log("after the show was clicked ::::::::::::::: ", dataDict);
    setShowGraphData(true);
  };

  const handleAddHashtag = () => {
    if (newHashtag.trim() !== "") {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag("");
    }
  };

  const handleCompare = () => {
    console.log("inside handle to compare : ", hashtags);
    if (hashtags.length == 1) {
      fetch(`/api/get-stored-apify-hashtag/${hashtags[0]}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          // console.log(
          //   "Data to compare : ",
          //   data
          // );
          setDataToCompare(data);
        });
    } else {
      fetch("/api/get-all-stored-apify-hashtag")
        .then((response) => response.json())
        .then((data) => {
          console.log("data to compare : ???????????????????? ", data);
          setDataToCompare(
            data.filter((item) => hashtags.includes(item.hashtag))
          );
        });
      // hashtags.map(hashtag => {
      //   // console.log("more then one hashtag to compare ",hashtag);
      //   fetch(`/api/get-stored-apify-hashtag/${hashtag}`, { method: "GET" })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log(
      //       "Data to compare >>>>>>>>>>>>>>>>>>>>>>> : ",
      //       data
      //     );
      //     setDataToCompare([...dataToCompare,data]);
      //   });
      // });
    }
  };

  const handleOnClickToShowCompareData = () => {
    // console.log("inside handle to compare : ",hashtags);
    if (hashtags.length == 1) {
      console.log("Only one hashtag to compare", hashtags[0]);
      const temp = [];
      fetch(`/api/get-stored-apify-hashtag/${hashtags[0]}`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          // console.log(
          //   "Data to compare : ",
          //   data
          // );
          temp.push(data);
          setDataToCompare(temp);
        });
    } else {
      fetch("/api/get-all-stored-apify-hashtag")
        .then((response) => response.json())
        .then((data) => {
          setDataToCompare(
            data.filter((item) => hashtags.includes(item.hashtag))
          );
        });
    }
    console.log("data to compare : ???????????????????? ", dataToCompare);
    setShowCompareData(true);
  };

  return (
    <div>
      {!showGraphData && <p>Show Graphs</p>}
      {!showGraphData && <button onClick={handleOnShowGraph}>Show</button>}
      {showGraphData && (
        <div>
          <div>
            <button onClick={handleOnBack}>Back</button>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div id="graph1-container">
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
                  {/* <Line type="monotone" dataKey="comments" stroke="#ffc658" /> */}
                  <Brush dataKey="name" height={30} stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div id="instagram-profile-container">
              <h1>Instagram Profile</h1>
              <ResponsiveContainer width={800} height={500}>
                <LineChart
                  margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="followersChanging"
                    stroke="#8884d8"
                    name={hashtag}
                    data={instagram_followers_change}
                  />
                  {/* <Brush data={instagram_status_date} height={30} stroke="#8884d8" /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div id="youtube-profile-container">
              <h1>YouTube Profile</h1>
              <ResponsiveContainer width={800} height={500}>
                <LineChart
                  margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="subscriberChanging"
                    stroke="#8884d8"
                    name={hashtag}
                    data={youtube_subscribers_change}
                  />
                  {/* <Brush data={instagram_status_date} height={30} stroke="#8884d8" /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              id="twitter-comments-table-container"
              style={{ margin: "10px" }}
            >
              <h1>Twitter Comments Table</h1>
              <table border="1">
                <thead>
                  <tr>
                    <th>Comment Date</th>
                    <th>Likes</th>
                    <th>Retweets</th>
                    {/* <th>Comments</th> */}
                  </tr>
                </thead>
                <tbody>
                  {transformedData_graph1.map((comment, index) => (
                    <tr key={index}>
                      <td>{comment.name}</td>
                      <td>{comment.likes}</td>
                      <td>{comment.retweets}</td>
                      {/* <td>{comment.comments}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              id="twitter-profile-table-container"
              style={{ margin: "10px" }}
            >
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
                      index > 0
                        ? transformedData_graph_twitter[index - 1]
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
                        <td>{changeIndicator}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

                    // console.log("followers changing : ", followersChanging);
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

            <div
              id="youtube-profile-table-container"
              style={{ margin: "10px" }}
            >
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
                      index > 0
                        ? transformedData_graph_youtube[index - 1]
                        : null;

                    const subscriberChange = previousStatus
                      ? status.subscriber_count -
                        previousStatus.subscriber_count
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
          <div>
            <h1>Hashtag Comparison</h1>
            <div>
              Compare with
              <button onClick={() => setShowInputField(true)}>+</button>
              {showInputField && (
                <input
                  type="text"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                />
              )}
              {newHashtag !== "" && (
                <button onClick={handleAddHashtag}>Add</button>
              )}
            </div>
            <ul>
              <div>
                {hashtags.map((hashtag, index) => (
                  <li key={index}>{hashtag}</li>
                ))}
              </div>
            </ul>
            <div>
              {hashtags.length > 0 && (
                <div>
                  <button onClick={handleOnClickToShowCompareData}>
                    Show Compare Data
                  </button>
                </div>
              )}
            </div>
          </div>
          {showCompareData && (
            <CompareData
              dataToCompareWith={dataToCompare}
              compareWithInstagramData={transformedData_graph_instagram}
              compareWithYouTubeData={transformedData_graph_youtube}
              enteredHashtagName={hashtag}
            />
          )}
          <button onClick={downloadPageData}>Download Page Data</button>
          <button onClick={handleOnSaveReport}>Save Report</button>
          <button onClick={handleOnViewReport}>View Reports</button>
        </div>
      )}
    </div>
  );
};

export default Analysis;
