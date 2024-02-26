import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hashtagData, setHashtagData] = useState(null);
  const [hashtagIncludeData, setHashtagIncludeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [downloadOption, setDownloadOption] = useState(false);

  const handleOnSave = () => {
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const dict = hashtagData.data;

    fetch("/api/create-hashtag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        hashtag: dict["hashtag"],
        hashtag_stats: [
          {
            user: document.cookie.split(" ")[0].split("=")[1],
            youtube_stats: dict["hashtag_stats"][0]["youtube_stats"]
              ? {
                  name: dict["hashtag_stats"][0]["youtube_stats"]["name"],
                  current_status: [
                    {
                      current_date:
                        dict["hashtag_stats"][0]["youtube_stats"]["current_status"][0]["current_date"],
                      views_count:
                        dict["hashtag_stats"][0]["youtube_stats"]["current_status"][0]["views_count"],
                      subscription_count:
                        dict["hashtag_stats"][0]["youtube_stats"]["current_status"][0]["subscription_count"],
                      video_count:
                        dict["hashtag_stats"][0]["youtube_stats"]["current_status"][0]["video_count"]
                    }
                  ]
                }
              : {},
            instagram_stats: {
              current_status: [
                {
                  current_date:
                    dict["hashtag_stats"][0]["instagram_stats"]["current_status"][0]["current_date"],
                  followers:
                    dict["hashtag_stats"][0]["instagram_stats"]["current_status"][0]["followers"],
                  followings:
                    dict["hashtag_stats"][0]["instagram_stats"]["current_status"][0]["followings"],
                  posts:
                    dict["hashtag_stats"][0]["instagram_stats"]["current_status"][0]["posts"]
                }
              ]
            },
            twitter_stats: {
              current_status: [
                {
                  current_date:
                    dict["hashtag_stats"][0]["twitter_stats"]["current_status"][0]["current_date"],
                  followers:
                    dict["hashtag_stats"][0]["twitter_stats"]["current_status"][0]["followers"],
                  followings:
                    dict["hashtag_stats"][0]["twitter_stats"]["current_status"][0]["followings"]
                }
              ],
              joining_date: dict["hashtag_stats"][0]["twitter_stats"]["joining_date"],
              comments: dict["hashtag_stats"][0]["twitter_stats"]["comments"].map((comment) => ({
                text: comment.text,
                comments: comment.comments,
                url: comment.url,
                likes: comment.likes,
                retweets: comment.retweets,
                comment_date: comment.comment_date
              }))
            }
          }
        ]
      })
      
      // body: JSON.stringify({
      //   hashtag: dict["hashtag"],
      //   hashtag_stats: [
      //     {
      //       user: document.cookie.split(" ")[0].split("=")[1],
      //       youtube_stats: dict["hashtag_stats"][0]["youtube_stats"]
      //         ? {
      //             name: dict["hashtag_stats"][0]["youtube_stats"]["name"],
      //             current_status: [
      //               {
      //                 current_date:
      //                   dict["hashtag_stats"][0]["youtube_stats"][
      //                     "current_status"
      //                   ][0]["current_date"],
      //                 views_count:
      //                   dict["hashtag_stats"][0]["youtube_stats"][
      //                     "current_status"
      //                   ][0]["views_count"],
      //                 subscription_count:
      //                   dict["hashtag_stats"][0]["youtube_stats"][
      //                     "current_status"
      //                   ][0]["subscription_count"],
      //                 video_count:
      //                   dict["hashtag_stats"][0]["youtube_stats"][
      //                     "current_status"
      //                   ][0]["video_count"],
      //               },
      //             ],
      //           }
      //         : // ? dict["hashtag_stats"][0]["youtube_stats"]
      //           {},
      //       // instagram_stats: {
      //       //   followers:
      //       //     dict["hashtag_stats"][0]["instagram_stats"]["followers"],
      //       //   followings:
      //       //     dict["hashtag_stats"][0]["instagram_stats"]["followings"],
      //       //   posts: dict["hashtag_stats"][0]["instagram_stats"]["posts"],
      //       // },
      //       instagram_stats: {
      //         current_status: [
      //           {
      //             current_date:
      //               dict["hashtag_stats"][0]["instagram_stats"][
      //                 "current_status"
      //               ][0]["current_date"],
      //             followers:
      //               dict["hashtag_stats"][0]["instagram_stats"][
      //                 "current_status"
      //               ][0]["followers"],
      //             followings:
      //               dict["hashtag_stats"][0]["instagram_stats"][
      //                 "current_status"
      //               ][0]["followings"],
      //             posts:
      //               dict["hashtag_stats"][0]["instagram_stats"][
      //                 "current_status"
      //               ][0]["posts"],
      //           },
      //         ],
      //       },
      //       twitter_stats: {
      //         // followers: dict["hashtag_stats"][0]["twitter_stats"]["followers"],
      //         // followings:
      //         //   dict["hashtag_stats"][0]["twitter_stats"]["followings"],
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
      //           comment_date : comment.date
      //           // comment_date: new Date(
      //           //   parseInt(
      //           //     comment.comment_date.split(" · ")[0].split(",")[1],
      //           //     10
      //           //   ),
      //           //   months[
      //           //     comment.comment_date
      //           //       .split(" · ")[0]
      //           //       .split(",")[0]
      //           //       .split(" ")[0]
      //           //   ],
      //           //   parseInt(
      //           //     comment.comment_date
      //           //       .split(" · ")[0]
      //           //       .split(",")[0]
      //           //       .split(" ")[1],
      //           //     10
      //           //   )
      //           // )
      //             // .toISOString()
      //             // .split("T")[0],
      //         })),
      //       },
      //     },
      //   ],
      // }),
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  const handleOnTwitterHashtagSearch = () => {
    fetch(`/api/twitter/search?key=${searchTerm}`, {
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

  const handleOnDownloadFile = () => {
    const jsonString = JSON.stringify(hashtagIncludeData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "data.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleSearchClick = () => {
    setHashtagData(null);
    if (document.cookie.length < 1) {
      navigate("/login/");
    }
    setLoading(true);

    //////////////////////////////////////////////////////////////////////////

    // console.log("inside search click");
    // console.log("Hashtag search", searchTerm);
    // console.log(
    //   "----------------------------------------- user Id ------------------------------",
    //   document.cookie.split(" ")[0].split("=")[1]
    // );
    // console.log("----------------------------------------- user Id ------------------------------", document.cookie.split(';')[1]);

    //////////////////////////////////////////////////////////////////////////
    if (searchTerm.length < 1) {
      setShowMessage(true);
      setLoading(false);
      return;
    }
    setShowMessage(false);

    // fetch(`/api/search?key=${searchTerm}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${document.cookie.split(" ")[0].split("=")[1]}`,
    //   },
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(
    //         `Network response was not ok, status: ${response.status}`
    //       );
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setLoading(false);
    //     setHashtagData(data);
    //   })
    //   .catch((error) => console.error("Error during fetch:", error));

    setHashtagData({
      data: {
        hashtag: "carryminati",
        hashtag_stats: [
          {
            user: "xyxj0vdUu6mBfMDI8UtDJrH9oW1BKvIZ;",
            youtube_stats: {
              name: "YouTubeUser",
              current_status: [
                {
                  current_date: "2022-01-22",
                  views_count: 1002,
                  subscription_count: 197,
                  video_count: 50
                }
              ],
            },
            instagram_stats: {
              current_status: [
                {
                  current_date: "2022-01-22",
                  followers: "139 M",
                  followings: "231 K",
                  posts: 193
                },
                {
                  current_date: "2022-01-21",
                  followers: "911 M",
                  followings: "201 K",
                  posts: 183
                }
              ],
            },
            twitter_stats: {
              current_status : [{
                current_date : '2022-01-19',
                followers : '200 M',
                followings : '100 K'
              },
              {
                current_date : '2022-01-18',
                followers : '333 M',
                followings : '222 K'
              }
            ],
              joining_date: "2020-01-1",
              comments: [
                {
                  text: "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
                  url: "https://twitter.com/CarryMinati/status/1738817018881515790#m",
                  comments: "120",
                  likes: 2350,
                  retweets: 101,
                  comment_date: "2023-12-23"
                }
              ],
            },
          },
        ],
      },
    });
    setLoading(false);
  };

  const handleOnUserProfile = () => {
    navigate("/user-profile/");
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

  // const handleOnHashtagClick = (hashtag) => {
  //     console.log('Hashtag search', hashtag);
  //     fetch(`/api/get-hashtag?hashtag=${hashtag}`, { method: 'GET' })
  //         .then(response => {
  //             if (!response.ok) {
  //                 throw new Error(`Network response was not ok, status: ${response.status}`);
  //             }
  //             return response.json();
  //         })
  //         .then(data => setHashtagData(data))
  //         .catch(error => console.error('Error during fetch:', error));
  // };

  const handleOnHashtagClick = (hashtag) => {
    // navigate(`/search-hashtag/${hashtag}`);
  };

  const handleOnClickStastatic = () => {
    navigate("/analysis");
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
          <button onClick={() => handleOnHashtagClick("imVKholi")}>
            #imVKohli
          </button>
          <button onClick={() => handleOnHashtagClick("#hashtag2")}>
            #hashtag2
          </button>
          <button onClick={() => handleOnHashtagClick("#hashtag3")}>
            #hashtag3
          </button>
          {/* Add more predefined hashtags here */}
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
      </div>

      {!hashtagIncludeData && hashtagData && (
        <div>
          <h3>Hashtag Data:</h3>
          <pre>{JSON.stringify(hashtagData, null, 2)}</pre>
          <button onClick={handleOnSave}>Save</button>
          <button onClick={handleOnClickStastatic}>Stastatic</button>
        </div>
      )}
      {hashtagIncludeData && (
        <div>
          <h3>Hashtag Include Data:</h3>
          <pre>{JSON.stringify(hashtagIncludeData, null, 2)}</pre>
          {downloadOption && (
            <button onClick={handleOnDownloadFile}>Download</button>
          )}
        </div>
      )}
      {/* {showAnalysis && <h2>Twitter Activity</h2>} */}
    </div>
  );
};

export default SearchPage;
