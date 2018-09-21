import * as React from "react";
import "./App.css";
import { Log } from "./components/Log";
import { logService } from "./services/LogService";

class App extends React.Component {
  public render() {
    return (
      <div className="grid">
        <div className="grid-section grid-section--log">
          <div className="log-title">Log</div>
          <Log logService={logService} />
        </div>
        <div className="grid-section grid-section--filter">
          <div className="log-title">Filter</div>
        </div>
        <div className="grid-section grid-section--tasks">
          <div className="log-title">Tasks</div>
        </div>
      </div>
    );
  }
}

export default App;
