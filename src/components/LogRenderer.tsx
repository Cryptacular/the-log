import * as React from "react";
import { ILog } from "../models/ILog";
import { LogType } from "../models/LogType";
import "./LogRenderer.css";

interface ILogRendererProps {
  log: ILog;
}

export const LogRenderer = (props: ILogRendererProps) => {
  const { log } = props;
  const logType = LogType[log.type].toLowerCase();
  const className = `logRenderer--${logType}`;
  const logTypeCharacter = logTypeToCharacter(log.type);

  return (
    <div className={`logRenderer ${className}`}>
      <span className="logRenderer-type">
        {logTypeCharacter}
        &nbsp;
      </span>
      <span className="logRenderer-content">{log.title}</span>
    </div>
  );
};

const logTypeToCharacter = (type: LogType) => {
  switch (type) {
    case LogType.Note:
      return "-";
    case LogType.Event:
      return "o";
    case LogType.ToDo:
      return "•";
    case LogType.Done:
      return "x";
    default:
      return "";
  }
};
