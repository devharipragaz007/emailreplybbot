import React, { Component } from 'react';
import './App.css';
import Sidebar from './components/sidebar'
import Replybot from './pages/replybot'
import Login from './pages/login'
import Confirmation from './pages/confirmation';
import ResetPass from './pages/resetPass';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      logged : localStorage.getItem("logged"),
    }
  }
  
  
  componentDidMount = () => {    
    this.interval = setInterval(() => this.state.logged !== localStorage.getItem("logged") ? this.setState({ logged: localStorage.getItem("logged") }) : null, 1000);

  }

  
componentWillUnmount() {
  clearInterval(this.interval);
}
  
  render () {
  
    return (
      <>
       {/* <LinearProgress variant="buffer" value={this.state.completed} valueBuffer={this.state.buffer}  /> */}
       {this.state.logged === 'true'  ? 
       <>
       <Sidebar />
        <div className="main-conntaer">
          <Router >
            <Switch>

                <Route>
                  <Replybot />
                </Route>

          </Switch>
          </Router>
        </div>
        </>
        :  
        <>
           <div className="main-conntaer">
          <Router >
            <Switch>


                <Route exact path='/'>
                  <Login/>
                </Route>


                <Route path="/confirmation/:token">
                  <Confirmation />
                </Route>


                <Route path="/changePass/:token">
                  <ResetPass />
                </Route>
          </Switch>
          </Router>
        </div>
        </>
        }
      </>
    );

  }
}

export default App;
