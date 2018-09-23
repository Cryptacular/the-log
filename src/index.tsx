import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { editorService } from "./services/EditorService";
import { logService } from "./services/LogService";

ReactDOM.render(
  <App logService={logService} editorService={editorService} />,
  document.getElementById("root") as HTMLElement
);
