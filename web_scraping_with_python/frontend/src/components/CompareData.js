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
  //compareWith : data recieve from the analysis / compareTo : data of specific hashtag
  const [dataToCompareWith, setDataToCompareWith] = useState([]);
  const [clickOnDetail, setClickOnDetail] = useState(false);
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

  console.log("Data to compare", dataToCompare);
  console.log("hashtagName", props.enteredHashtagName);

  useEffect(() => {
    setDataToCompareWith(props.dataToCompareWith);
    setCompareWithInstagramData(props.compareWithInstagramData);
  }, [props.dataToCompareWith, props.compareWithInstagramData]);

  const handleOnGetData = () => {
    setTempState(false);
    const newFollowersChanges = [];

    if (compareWithInstagramData) {
      console.log("comparewith instagram data : ",compareWithInstagramData);
      compareWithInstagramData.forEach((status, index) => {
        // console.log("status : ",status);
        const previousStatus =
          index > 0 ? compareWithInstagramData[index - 1] : null;

        const followersChange = previousStatus
          ? status.followers - previousStatus.followers
          : 0;

        newFollowersChanges.push({
          date : status.name,
          followersChanging: followersChange,
        });
      });
      setCompareWithInstagramFollowersChanges(newFollowersChanges); // Set state for followersChanges
      console.log(
        "on click handleOnGet : ",
        compareWithInstagramFollowersChanges
      );
      // setClickOnGraph(true); // Set clickOnGraph to true to display the graph
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
        date : instagram_current_status[index],
        followersChanging: followersChange,
      });
    });
    console.log("dates : ",instagram_status_date);                  
    setCompareToInstagramDataFollowersChanges(newFollowersChanges);

    console.log(
      "setCompareToInstagramDataFollowersChanges : ",
      compareToInstagramDataFollowersChanges
    );
    setClickOnDetail(false);
    setClickOnGraph(true); // Set clickOnGraph to true to display the graph
  };

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
        {clickOnDetail && <div>Details content</div>}
        {clickOnGraph && (
          <div>
            <h1>Instagram Followers Changing</h1>
            <ResponsiveContainer width={800} height={500}>
              <LineChart margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date"/>
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
                  name={dataToCompare['hashtag']}
                  data={compareToInstagramDataFollowersChanges}
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
