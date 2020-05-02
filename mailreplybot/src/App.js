import React from 'react';
import './App.css';
import Sidebar from './components/sidebar/sidebar'
import Replybot from './pages/replybot/replybot'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

function App() {
  return (
    <>
      <Sidebar />
    <div className="main-conntaer">
      <Router className="main-conntaer">
        <Switch>
            <Route exact path="/">
              <Replybot/>
            </Route>

            <Route path="/home">
              <Replybot />
            </Route>

      </Switch>
      </Router>
    </div>
    </>
  );
}

export default App;
