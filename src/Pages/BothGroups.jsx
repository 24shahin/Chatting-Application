import React from "react";
import GroupsList from "../components/GroupsList";
import MyGroups from "../components/MyGroups";

function BothGroups() {
  return (
    <div className="groupsdiv">
      <GroupsList />
      <MyGroups />
    </div>
  );
}

export default BothGroups;
