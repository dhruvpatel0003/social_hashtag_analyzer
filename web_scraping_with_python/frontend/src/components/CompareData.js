import React, { useState, useEffect } from "react";
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

const CompareData = (props) => {
  // console.log("Compare component props : ", props);

  //compareWith : data recieve from the analysis / compareTo : data of specific hashtag
  const [dataToCompareWith, setDataToCompareWith] = useState([]);
  const [clickOnDetail, setClickOnDetail] = useState(false);
  const [showInstagramResult, setShowInstagramResult] = useState(true);
  const [showYouTubeResult, setShowYouTubeResult] = useState(false);
  const [clickOnGraph, setClickOnGraph] = useState(false);
  const [tempState, setTempState] = useState(true);
  const [dataToCompare, setDataToCompare] = useState(); //specific hashtag

  //instagram
  const [
    compareWithInstagramFollowersChanges,
    setCompareWithInstagramFollowersChanges,
  ] = useState([]); // Added state for followersChanges
  const [compareWithInstagramData, setCompareWithInstagramData] = useState();
  const [
    compareToInstagramDataFollowersChanges,
    setCompareToInstagramDataFollowersChanges,
  ] = useState(); //for specific hashtag
  const instagram_status_date = [];
  //////////////////////////////////////////////

  //////////////// YouTube /////////////////////

  const [
    compareWithYouTubeSubscriberChanges,
    setCompareWithYouTubeScubscriberChanges,
  ] = useState([]);
  const [compareWithYouTubeData, setCompareWithYouTubeData] = useState();
  const [
    compareToYouTubeSubscriberChanges,
    setCompareToYouTubeSubscriberChanges,
  ] = useState();
  const youtube_status_date = [];

  //////////////////////////////////////////////////

  console.log("Data to compare", dataToCompare);
  console.log("hashtagName", props.enteredHashtagName);

  useEffect(() => {
    setDataToCompareWith(props.dataToCompareWith);
    setCompareWithInstagramData(props.compareWithInstagramData);
    setCompareWithYouTubeData(props.compareWithYouTubeData); //coming from the props
  }, [
    props.dataToCompareWith,
    props.compareWithInstagramData,
    props.compareWithYouTubeData,
  ]);

  const handleOnGetData = () => {
    console.log("Compare component props : ", props);

    setTempState(false);
    const newFollowersChanges = [];
    const newSubscriberChanges = [];

    if (compareWithInstagramData) {
      console.log("comparewith instagram data : ", compareWithInstagramData);
      compareWithInstagramData.forEach((status, index) => {
        // console.log("status : ",status);
        const previousStatus =
          index > 0 ? compareWithInstagramData[index - 1] : null;

        const followersChange = previousStatus
          ? status.followers - previousStatus.followers
          : 0;

        newFollowersChanges.push({
          date: status.name,
          followersChanging: followersChange,
        });
      });
      setCompareWithInstagramFollowersChanges(newFollowersChanges); // Set state for followersChanges
      console.log(
        "on click handleOnGet : ",
        compareWithInstagramFollowersChanges
      );
    }

    console.log("comparewith youtube data : ", compareWithYouTubeData);
    if (compareWithYouTubeData) {
      compareWithYouTubeData.forEach((status, index) => {
        // console.log("status : ",status);
        const previousStatus =
          index > 0 ? compareWithYouTubeData[index - 1] : null;

        const subscriberChanges = previousStatus
          ? status.subscriber_count - previousStatus.subscriber_count
          : 0;

        newSubscriberChanges.push({
          date: status.name,
          subscriberChanging: subscriberChanges,
        });
      });
      console.log("newSubscriberChanges : ", newSubscriberChanges);
      setCompareWithYouTubeScubscriberChanges(newSubscriberChanges); // Set state for followersChanges
      console.log(
        "on click handleOnGet : ",
        compareWithYouTubeSubscriberChanges
      );
    }
  };

  const handleOnClickDetails = (hashtagDetails) => {
    setDataToCompare(hashtagDetails);
    console.log("On details click : ", dataToCompare);
    setClickOnGraph(false);
    setClickOnDetail(true);
  };

  const handleOnClickGraph = (hashtagDetails) => {
    setDataToCompare(hashtagDetails);
    console.log("On graph click : ", dataToCompare);

    //variables
    const instagram_current_status =
      hashtagDetails["hashtag_stats"][0]["instagram_stats"]["current_status"];
    const newFollowersChanges = [];
    /////////
    instagram_current_status.forEach((status, index) => {
      instagram_status_date.push(status.current_date);
      const previousStatus =
        index > 0 ? instagram_current_status[index - 1] : null;

      const followersChange = previousStatus
        ? status.followers - previousStatus.followers
        : 0;

      newFollowersChanges.push({
        date: instagram_current_status[index],
        followersChanging: followersChange,
      });
    });
    console.log("dates : ", instagram_status_date);
    setCompareToInstagramDataFollowersChanges(newFollowersChanges);

    //////////// Youtube ////////////////

    const youtube_current_status =
      hashtagDetails["hashtag_stats"][0]["youtube_stats"]["current_status"];
    const newSubscriberChanges = [];
    /////////
    console.log("Youtube current status : ", youtube_current_status);
    youtube_current_status.forEach((status, index) => {
      youtube_status_date.push(status.current_date);
      const previousStatus =
        index > 0 ? youtube_current_status[index - 1] : null;

      const subScriberChange = previousStatus
        ? status.subscription_count - previousStatus.subscription_count
        : 0;

      newSubscriberChanges.push({
        date: youtube_current_status[index],
        subScriberChanging: subScriberChange,
      });
    });
    console.log("dates : ", youtube_status_date);
    setCompareToYouTubeSubscriberChanges(newSubscriberChanges);

    console.log(
      "setCompareToYouTubeScriberChanges : ",
      compareToYouTubeSubscriberChanges,
      "setCompareToInstagramFollowersChanges : ",
      compareToInstagramDataFollowersChanges
    );
    console.log(
      "setCompareWithYouTubeScriberChanges : ",
      compareWithYouTubeSubscriberChanges
    );
    setClickOnDetail(false);
    setClickOnGraph(true); // Set clickOnGraph to true to display the graph
  };

  const handleOnClickInstagram = () => {
    setShowYouTubeResult(false);
    setShowInstagramResult(true);
  };
  const handleOnClickYouTube = () => {
    setShowInstagramResult(false);
    setShowYouTubeResult(true);
  };
  const handleOnClickTwitter = () => {};

  return (
    <React.Fragment>
      {tempState && (
        <button onClick={handleOnGetData}>Compare with current hashtag</button>
      )}
      
      <div>
        {dataToCompareWith.map((item, index) => (
          <div key={index}>
            <p>Hashtag: {item.hashtag}</p>
            <button onClick={() => handleOnClickDetails(item)}>Details</button>
            <button onClick={() => handleOnClickGraph(item)}>Graph</button>
          </div>
        ))}
        <div style={{margin:"10px 0 0 0"}}>
        <button onClick={handleOnClickInstagram}>Instagram</button>
        <button onClick={handleOnClickYouTube}>YouTube</button>
        <button onClick={handleOnClickTwitter}>Twitter</button>
      </div>
        {clickOnDetail && <div>Details content</div>}
        {clickOnGraph && showInstagramResult && (
          <div>
            <h1>Instagram Followers Changing</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="followersChanging"
                  stroke="#8884d8"
                  name={props.enteredHashtagName}
                  data={compareWithInstagramFollowersChanges}
                />
                <Line
                  type="monotone"
                  dataKey="followersChanging"
                  stroke="#82ca9d"
                  name={dataToCompare["hashtag"]}
                  data={compareToInstagramDataFollowersChanges}
                />
                {/* <Brush data={instagram_status_date} height={30} stroke="#8884d8" /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {clickOnGraph && showYouTubeResult && (
          <div>
            <h1>Youtube Subscriber Changing</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="subscriberChanging"
                  stroke="#8884d8"
                  name={props.enteredHashtagName}
                  data={compareWithYouTubeSubscriberChanges}
                />
                <Line
                  type="monotone"
                  dataKey="subScriberChanging"
                  stroke="#82ca9d"
                  name={dataToCompare["hashtag"]}
                  data={compareToYouTubeSubscriberChanges}
                />
                {/* <Brush data={instagram_status_date} height={30} stroke="#8884d8" /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default CompareData;
