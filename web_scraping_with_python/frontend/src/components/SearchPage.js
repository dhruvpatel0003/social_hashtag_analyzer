import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hashtagData, setHashtagData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOnSave = () => {
    // console.log(
    //   "-------------- hashtag data --------------------------",
    //   hashtagData
    // );

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
      body: JSON.stringify({
        // data : dict
        hashtag: dict["hashtag"],
        hashtag_stats: [
          {
            user: document.cookie.split(" ")[0].split("=")[1],
            youtube_stats: dict["hashtag_stats"][0]["youtube_stats"]
              ? dict["hashtag_stats"][0]["youtube_stats"]
              : "{}",
            instagram_stats: {
              followers:
                dict["hashtag_stats"][0]["instagram_stats"]["followers"],
              followings:
                dict["hashtag_stats"][0]["instagram_stats"]["followings"],
              posts: dict["hashtag_stats"][0]["instagram_stats"]["posts"],
            },
            twitter_stats: {
              followers: dict["hashtag_stats"][0]["twitter_stats"]["followers"],
              followings:
                dict["hashtag_stats"][0]["twitter_stats"]["followings"],
              joining_date:
                dict["hashtag_stats"][0]["twitter_stats"]["joining_date"],
              comments: dict["hashtag_stats"][0]["twitter_stats"][
                "comments"
              ].map((comment) => ({
                text: comment.text,
                comments: comment.comments,
                url: comment.url,
                likes: comment.likes,
                retweets: comment.retweets,
                comment_date: new Date(
                  parseInt(
                    comment.comment_date.split(" · ")[0].split(",")[1],
                    10
                  ),
                  months[
                    comment.comment_date
                      .split(" · ")[0]
                      .split(",")[0]
                      .split(" ")[0]
                  ],
                  parseInt(
                    comment.comment_date
                      .split(" · ")[0]
                      .split(",")[0]
                      .split(" ")[1],
                    10
                  )
                )
                  .toISOString()
                  .split("T")[0],
              })),
            },
          },
        ],
      }),
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
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

    fetch(`/api/search?key=${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split(" ")[0].split("=")[1]}`,
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
        setLoading(false);
        setHashtagData(data);
      })
      .catch((error) => console.error("Error during fetch:", error));

    // setHashtagData({
    //   "data": {
    //     "hashtag": "carryminati",
    //     "hashtag_stats": [
    //       {
    //         "user": "cdc37d4f-2f95-489f-ba4e-9ce606092ca2",
    //         "youtube_stats": {},
    //         "instagram_stats": {},
    //         "twitter_stats": {
    //           "followers": "111 M",
    //           "followings": "1212",
    //           "joining_date": "2020-01-11",
    //           "comments": [
    //             {
    //               "text": "NEW ROAST VIDEO OUT NOW! RARE INDIAN STREET FOOD....YUMMYY🤤  WATCH: https://appopener.com/yt/nuxajzr6s Bhaagke jao aur dekho #Food",
    //               "url": "https://twitter.com/CarryMinati/status/1738817018881515790#m",
    //               "likes": 2320,
    //               "retweets": 100,
    //               "comments": 112,
    //               "comment_date": "Dec 24, 2023 · 7:00 AM UTC"
    //             },
    //             {
    //               "text": "Bhai vacation pe 4 se zada dost nhi home chahiye, zada excited hojate hai",
    //               "url": "https://twitter.com/CarryMinati/status/1753331206291149234#m",
    //               "likes": 1412,
    //               "retweets": 44,
    //               "comments": 68,
    //               "comment_date": "Feb 2, 2024 · 8:15 AM UTC"
    //             },
    //             {
    //               "text": "Happy 75th Republic day 🇮🇳",
    //               "url": "https://twitter.com/CarryMinati/status/1750791211881824569#m",
    //               "likes": 5476,
    //               "retweets": 133,
    //               "comments": 80,
    //               "comment_date": "Jan 26, 2024 · 8:02 AM UTC"
    //             }
    //           ]
    //         }
    //       }
    //     ]
    //   }
    // });
  };

  const handleOnUserProfile = () => {
    navigate("/user-profile/");
  };

  const handleCategoryClick = (category) => {
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
    navigate(`/search-hashtag/${hashtag}`);
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
      </div>
      {!searchTerm && <p>Please enter term into the search box</p>}
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
      {hashtagData && (
        <div>
          <h3>Hashtag Data:</h3>
          <pre>{JSON.stringify(hashtagData, null, 2)}</pre>
          <button onClick={handleOnSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
