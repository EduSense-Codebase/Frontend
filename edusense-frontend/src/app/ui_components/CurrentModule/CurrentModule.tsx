import React from "react";
import "./CurrentModule.scss";
import Link from "next/link";



const CurrentModule: React.FC<{ moduleName: string; icon?: string; path?: string }> = ({
    moduleName,
    icon = "📘",
    path = "#"
  }) => {
  return (
    <div className="current-module-container">
      <div className="current-module-box">
        <div className="current-module-title">Current Module</div>
        <ul className="current-module-list">
          <li className="current-module-item">
            <span>{icon}</span>
            <Link href = {path}>{moduleName}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CurrentModule;
