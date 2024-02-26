import React from "react";
// import { Bar } from "react-chartjs-2";
import "chart.js";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  Tooltip, Brush
} from "recharts";

const Analysis = () => {
  const navigate = useNavigate();

  const data = {
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const transformedData_graph1 =
    data.hashtag_stats[0].twitter_stats.comments.map((comment) => ({
      name: comment.comment_date,
      likes: parseInt(comment.likes, 10),
      retweets: parseInt(comment.retweets, 10),
      comments: parseInt(comment.comments, 10),
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
  const transformedData_graph_instagram =
    data.hashtag_stats[0].instagram_stats.current_status.map((status) => ({
      name: status.current_date,
      followers: parseInstagramFollowers(status.followers),
      followings: parseInt(status.followings, 10),
      posts: parseInt(status.posts, 10),
    }));

  // Additional graph for YouTube
  const transformedData_graph_youtube =
    data.hashtag_stats[0].youtube_stats.current_status.map((status) => ({
      name: status.current_date,
      video_count: parseInt(status.video_count, 10),
      subscriber_count: parseInt(status.subscriber_count, 10),
      views_count: parseInt(status.views_count, 10),
    }));

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
    data.hashtag_stats[0].twitter_stats.current_status.map((status) => ({
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

  return (
    <div>
      <div>
        <button onClick={handleOnBack}>Back</button>
      </div>
      {/*<div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <h1>Twitter Comments Graph</h1>
          <ResponsiveContainer width={500} height={500}>
            <LineChart
              width={500}
              height={700}
              data={transformedData_graph1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="retweets" stroke="#82ca9d" />
              <Line type="monotone" dataKey="comments" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h1>Twitter Profile</h1>
          <ResponsiveContainer width={500} height={500}>
            <LineChart
              width={500}
              height={700}
              data={transformedData_graph_twitter}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#8884d8"
                name="Followers"
              />
              <Line
                type="monotone"
                dataKey="followings"
                stroke="#82ca9d"
                name="Followings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h1>Instagram Profile</h1>
          <ResponsiveContainer width={500} height={500}>
            <LineChart
              width={500}
              height={700}
              data={transformedData_graph_instagram}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#8884d8"
                name="Followers"
              />
              <Line
                type="monotone"
                dataKey="followings"
                stroke="#82ca9d"
                name="Followings"
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#ffc658"
                name="Posts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h1>YouTube Profile</h1>
          <ResponsiveContainer width={500} height={500}>
            <LineChart
              width={500}
              height={400}
              data={transformedData_graph_youtube}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="video_count"
                stroke="#8884d8"
                name="Video Count"
              />
              <Line
                type="monotone"
                dataKey="subscriber_count"
                stroke="#82ca9d"
                name="subscriber Count"
              />
              <Line
                type="monotone"
                dataKey="views_count"
                stroke="#ffc658"
                name="Views Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
            </div>*/}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
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
        <div>
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
        </div>
        <div>
          <h1>Instagram Profile</h1>
          <ResponsiveContainer width={800} height={500}>
            <LineChart
              width={800}
              height={500}
              data={transformedData_graph_instagram}
              margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="followers" stroke="#8884d8" />
              <Line type="monotone" dataKey="followings" stroke="#82ca9d" />
              <Line type="monotone" dataKey="posts" stroke="#ffc658" />
              <Brush dataKey="name" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h1>YouTube Profile</h1>
          <ResponsiveContainer width={800} height={500}>
            <LineChart
              width={800}
              height={500}
              data={transformedData_graph_youtube}
              margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="video_count" stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="subscriber_count"
                stroke="#82ca9d"
              />
              <Line type="monotone" dataKey="views_count" stroke="#ffc658" />
              <Brush dataKey="name" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ margin: "10px" }}>
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
        </div>

        <div style={{ margin: "10px" }}>
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
        </div>
        <div style={{ margin: "10px" }}>
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
                  index > 0 ? transformedData_graph_instagram[index - 1] : null;

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

        <div style={{ margin: "10px" }}>
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
    </div>
  );
};

export default Analysis;
