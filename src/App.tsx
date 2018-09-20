import * as React from "react";
import "./App.css";
import { Log } from "./components/Log";
import { logService } from "./services/LogService";

class App extends React.Component {
  public render() {
    return (
      <div className="grid">
        <div className="grid-section grid-section--log">
          <div># Log</div>
          <Log logService={logService} />
        </div>
        <div className="grid-section grid-section--filter">Filter</div>
        <div className="grid-section grid-section--tasks">Tasks</div>
      </div>
    );
  }
}

export default App;
