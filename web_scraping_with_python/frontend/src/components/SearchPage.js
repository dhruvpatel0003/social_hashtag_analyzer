import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { DataContext } from "./DataContext";

const SearchPage = () => {
  const { setData, email } = useContext(DataContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hashtagData, setHashtagData] = useState(null);
  const [hashtagIncludeData, setHashtagIncludeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [downloadOption, setDownloadOption] = useState(false);
  const [historyData, setHistoryData] = useState("");
  const [searchHashtagName, setSearchHashtagName] = useState();

  const handleOnApify = () => {
    const dict = hashtagData.data;
    console.log(
      dict["hashtag_stats"][0]["youtube_stats"]["current_status"].length == 0
    );
    console.log(
      "frontend - hashtagData ",
      dict,
      dict.hashtag_stats[0].youtube_stats,
      dict.hashtag_stats[0].instagram_stats,
      dict.hashtag_stats[0].twitter_stats
    );
    fetch("/api/create-hashtag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hashtag: dict["hashtag"],
        hashtag_stats: [
          {
            youtube_stats:
              dict.hashtag_stats[0]["youtube_stats"]["current_status"].length !=
              0
                ? {
                    current_status: [
                      {
                        current_date:
                          dict["hashtag_stats"][0]["youtube_stats"][
                            "current_status"
                          ][0]["current_date"],
                        views_count:
                          dict["hashtag_stats"][0]["youtube_stats"][
                            "current_status"
                          ][0]["views_count"],
                        subscription_count:
                          dict["hashtag_stats"][0]["youtube_stats"][
                            "current_status"
                          ][0]["subscription_count"],
                        video_count:
                          dict["hashtag_stats"][0]["youtube_stats"][
                            "current_status"
                          ][0]["video_count"],
                      },
                    ],
                  }
                : {},
            instagram_stats:
              dict.hashtag_stats[0]["instagram_stats"]["current_status"]
                .length != 0
                ? {
                    current_status: [
                      {
                        current_date:
                          dict["hashtag_stats"][0]["instagram_stats"][
                            "current_status"
                          ][0]["current_date"],
                        followers:
                          dict["hashtag_stats"][0]["instagram_stats"][
                            "current_status"
                          ][0]["followers"],
                        followings:
                          dict["hashtag_stats"][0]["instagram_stats"][
                            "current_status"
                          ][0]["followings"],
                        posts:
                          dict["hashtag_stats"][0]["instagram_stats"][
                            "current_status"
                          ][0].length === 3
                            ? 0
                            : dict["hashtag_stats"][0]["instagram_stats"][
                                "current_status"
                              ][0]["posts"],
                      },
                    ],
                  }
                : {},
            // twitter_stats:
            //   (dict.hashtag_stats[0]["twitter_stats"]["current_status"].length !=
            //   0)
            //     ? {
            //         current_status: [
            //           {
            //             current_date:
            //               dict["hashtag_stats"][0]["twitter_stats"][
            //                 "current_status"
            //               ][0]["current_date"],
            //             followers:
            //               dict["hashtag_stats"][0]["twitter_stats"][
            //                 "current_status"
            //               ][0]["followers"],
            //             followings:
            //               dict["hashtag_stats"][0]["twitter_stats"][
            //                 "current_status"
            //               ][0]["followings"],
            //           },
            //         ],
            //         joining_date:
            //           dict["hashtag_stats"][0]["twitter_stats"]["joining_date"],
            //         comments: dict["hashtag_stats"][0]["twitter_stats"][
            //           "comments"
            //         ].map((comment) => ({
            //           text: comment.text,
            //           comments: comment.comments,
            //           url: comment.url,
            //           likes: comment.likes,
            //           retweets: comment.retweets,
            //           comment_date: comment.comment_date,
            //         })),
            //       }
            //     : {},
            twitter_stats: {},
          },
        ],
      }),
    });
  };
  const handleOnTwitterHashtagSearch = () => {
    const tempVariable = "gujarat_titans";
    console.log(
      "temp variable :::::::::::::::::::::::::::::::::::: ",
      tempVariable
    );
    setSearchHashtagName(tempVariable);
    fetch(`/api/twitter/search?key=${tempVariable}`, {
      // fetch(`/api/twitter/search?key=${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // setLoading(false);
        setHashtagIncludeData(data);
        setDownloadOption(true);
      });
  };

  const handleOnDownloadTxTFile = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "SocialAnalyzer_HashTagIncludeData.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  ////////////////////////////////////////////////////// Download Excel File ////////////////////////////////////////

  const handleOnDownloadExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("SocialAnalyzer_HashTagIncludeData");

    const headerRow = sheet.getRow(1);
    headerRow.getCell(1).value = "Title";
    headerRow.getCell(2).value = "Text";
    headerRow.getCell(3).value = "URL";

    hashtagIncludeData.data.forEach((entry, index) => {
      const row = sheet.getRow(index + 2);
      row.getCell(1).value = entry.title;
      row.getCell(2).value = entry.text;
      row.getCell(3).value = entry.url;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "hashtag_data.xlsx";
      link.click();
    });
  };

  ////////////////////////////////////////////////////// Download Excel File with Analysis ////////////////////////////////////////

  const handleOnDownloadExcelAnalysisFile = () => {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("HashtagData");

    // Add headers to the worksheet
    sheet.addRow([
      "Title",
      "Text",
      "URL",
      "Date",
      "Followers",
      "Quotes",
      "Posts",
    ]);

    // Iterate through each entry in hashtagIncludeData
    hashtagIncludeData.data.forEach((entry) => {
      // Parse the text field to extract additional information
      const { date, followers, quotes, posts } = parseText(entry.text);

      // Add a new row to the worksheet with the extracted information
      sheet.addRow([
        entry.title,
        entry.text,
        entry.url,
        date !== undefined ? date : "NA",
        followers !== undefined ? followers : "NA",
        quotes !== undefined ? quotes : "NA",
        posts !== undefined ? posts : "NA",
      ]);
    });

    // Save the workbook to a file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "SocialAnalyzer-HashTagIncludeData.xlsx";
      link.click();
    });
  };

  const parseText = (text) => {
    const dateMatch = text.match(/(\b\w+ \d{1,2}, \d{4}\b)/);
    const followersMatch = text.match(/(\d+) followers/);
    const quotesMatch = text.match(/(\d+) quotes/);
    const postsMatch = text.match(/(\d+) posts/);

    return {
      date: dateMatch ? dateMatch[0] : undefined,
      followers: followersMatch ? followersMatch[1] : undefined,
      quotes: quotesMatch ? quotesMatch[1] : undefined,
      posts: postsMatch ? postsMatch[1] : undefined,
    };
  };

  const handleSearchClick = () => {
    setLoading(true);
    setHistoryData(null);
    console.log("Starting of the handle Search loading status ", loading);

    setHashtagData(null);
    if (document.cookie.length < 1) {
      navigate("/login/");
    }
    setLoading(true);
    console.log("After setting up the loading status : loading : ", loading);

    //////////////////////////////////////////////////////////////////////////

    console.log("inside search click");
    console.log("Hashtag search", searchTerm);
    console.log(
      "----------------------------------------- user Id ------------------------------",
      document.cookie.split(" ")[0].split("=")[1]
    );
    console.log(
      "----------------------------------------- user Id ------------------------------",
      document.cookie.split(" ")[0].split("=")[1]
    );

    //////////////////////////////////////////////////////////////////////////
    if (searchTerm.length < 1) {
      setShowMessage(true);
      setLoading(false);
      return;
    }
    setShowMessage(false);
    fetch(`/api/search?key=${searchTerm}`, {
      method: "POST",
      // method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split(" ")[0].split("=")[1]}`,
      },
      body : JSON.stringify({
        'email':email
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // setLoading(true);
        setHashtagData(data);
        setData(data);
      })
      .catch((error) => console.error("Error during fetch:", error));

    // setHashtagData({
    //   data: {
    //     hashtag: "carryminati",
    //     hashtag_stats: [
    //       {
    //         youtube_stats: {
    //           current_status: [
    //             {
    //               current_date: "2022-01-22",
    //               views_count: 1002,
    //               subscription_count: 197,
    //               video_count: 50,
    //             },
    //           ],
    //         },
    //         instagram_stats: {
    //           current_status: [
    //             {
    //               current_date: "2022-01-22",
    //               followers: "139 M",
    //               followings: "231 K",
    //               posts: 193,
    //             },
    //             {
    //               current_date: "2022-01-21",
    //               followers: "911 M",
    //               followings: "201 K",
    //               posts: 183,
    //             },
    //           ],
    //         },
    //         twitter_stats: {
    //           current_status: [
    //             {
    //               current_date: "2022-01-19",
    //               followers: "200 M",
    //               followings: "100 K",
    //             },
    //             {
    //               current_date: "2022-01-18",
    //               followers: "333 M",
    //               followings: "222 K",
    //             },
    //           ],
    //           joining_date: "2020-01-1",
    //           comments: [
    //             {
    //               text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
    //               url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
    //               comments: "120",
    //               likes: 2350,
    //               retweets: 101,
    //               comment_date: "2023-12-23",
    //             },
    //           ],
    //         },
    //       },
    //     ],
    //   },
    // });
    setLoading(false);
  };

  const handleOnUserProfile = () => {
    navigate("/user-profile");
  };

  const handleOnSignOut = () => {
    navigate("/login/");
  };

  const handleCategoryClick = (category) => {
    if (category === "Twitter") {
      setOnTwitterMessage(true);
    }
    // Perform search based on the searchTerm
    console.log("Category search", category);
  };

  const handleOnHashtagClick = (hashtag) => {
    navigate(`/search-hashtag/${hashtag}`);
  };

  const handleOnHistoryClick = () => {
    console.log("inside history ", document.cookie.split(";")[0].split("=")[1]);
    const user_id = document.cookie.split(";")[0].split("=")[1];
    // fetch(`/api/my-history/Dt5bCOCoD46TxFNhW8tFEFiKVlNGXVm1`, {
      fetch(`/api/my-history/${user_id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => setHistoryData(data));
  };

  const handleOnClickStastatic = () => {
    navigate(`/analysis/${searchTerm}`);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter your search term"
        />
        <button onClick={handleSearchClick}>Search</button>
        <button onClick={handleOnSignOut}>SignOut</button>
      </div>
      {showMessage && <p>Please enter term into the search box</p>}
      {loading && <p>Loading .... .... .... .... .... .... ....</p>}
      <div>
        <h3>Predefined Hashtags:</h3>
        <div>
          <button onClick={() => handleOnHashtagClick("mumbaiindians")}>
            #MumbaiIndians
          </button>
          <button
            onClick={() => handleOnHashtagClick("royalchallengers.bengaluru")}
          >
            #RoyalChallengersBengaluru
          </button>
          <button onClick={() => handleOnHashtagClick("gujarat_titans")}>
            #Gujara Titans
          </button>
          <button onClick={handleOnApify}>RunApify</button>
        </div>
      </div>
      <div>
        <h3>Categories:</h3>
        <ul>
          <li>
            <button onClick={() => handleCategoryClick("YouTube")}>
              YouTube
            </button>
          </li>
          <li>
            <button onClick={() => handleCategoryClick("Twitter")}>
              Twitter
            </button>
            <button onClick={handleOnTwitterHashtagSearch}>
              HashTagInclude
            </button>
          </li>
          <li>
            <button onClick={() => handleCategoryClick("Instagram")}>
              Instagram
            </button>
          </li>
          <li>
            <button onClick={() => handleCategoryClick("Facebook")}>
              Facebook
            </button>
          </li>
        </ul>
        <button onClick={handleOnUserProfile}>Profile</button>
        <button onClick={handleOnHistoryClick}>History</button>
        <button onClick={() => navigate("/view-reports")}>My Reports</button>
        <button onClick={() => navigate("/upload-file-to-analysis")}>
          Upload File
        </button>
        {historyData && (
          <div>
            <h3>My History</h3>
            <pre>{JSON.stringify(historyData, null, 2)}</pre>
          </div>
        )}
        {searchHashtagName && <p>{searchHashtagName}</p>}
      </div>

      {!hashtagIncludeData && hashtagData && !historyData && (
        <div>
          <button onClick={() => handleOnDownloadTxTFile(hashtagData)}>
            Download TxT
          </button>
          <button onClick={handleOnClickStastatic}>Stastatic</button>
          <h3>Hashtag Data:</h3>
          <pre>{JSON.stringify(hashtagData, null, 2)}</pre>
        </div>
      )}
      {hashtagIncludeData && (
        <div>
          {downloadOption && (
            <div>
              <button
                onClick={() => handleOnDownloadTxTFile(hashtagIncludeData)}
              >
                Download TxT
              </button>
              <button onClick={handleOnDownloadExcelFile}>
                Download Excel
              </button>
              <button onClick={handleOnDownloadExcelAnalysisFile}>
                Download Analysis Excel
              </button>
            </div>
          )}
          <h3>Hashtag Include Data:</h3>
          <pre>{JSON.stringify(hashtagIncludeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
