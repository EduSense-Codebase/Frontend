import React from "react";
import "./CurrentModule.scss";

interface CurrentModuleProps {
  moduleName: string;
  icon?: string; // e.g., 📘
}

const CurrentModule: React.FC<CurrentModuleProps> = ({ moduleName, icon = "📘" }) => {
  return (
    <div className="current-module-container">
      <div className="current-module-box">
        <div className="current-module-title">Current Module</div>
        <ul className="current-module-list">
          <li className="current-module-item">
            <span>{icon}</span>
            <span>{moduleName}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CurrentModule;
