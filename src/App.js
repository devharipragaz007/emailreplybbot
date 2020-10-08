import React, { Component } from 'react';
import './App.css';
import Sidebar from './components/sidebar'
import Replybot from './pages/replybot'
import Login from './pages/login'
import Confirmation from './pages/confirmation';
import ResetPass from './pages/resetPass';
import axios from "axios";
import Api from './api.json';
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

    
    var d = window.location.pathname.split('/');
    this.page = d[1];
  }
  
  
  componentDidMount = () => {    
    // axios.get(Api.api +  '/checkSession').then(response => {
    //   console.log(response)
    // })
    // .catch(err => {
    //   console.log(err)
    // })
    this.interval = setInterval(() => this.state.logged !== localStorage.getItem("logged") ? this.setState({ logged: localStorage.getItem("logged") }) : null, 1000);

  }

  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render () {
    console.log(this.state.logged, localStorage.getItem("logged")) 
    return (
      <>
      {this.state.logged === true || this.state.logged === 'true' ? 
       <>
         <Sidebar />
        <div className="main-conntaer">
          <Router >
            <Switch>
                <Route exact path="/">
                  <Replybot />
                </Route>

                <Route exact path="/home">
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
                <Route exact path="/">
                  <Login/>
                </Route>
                

                <Route exact path="/confirmation/:token">
                  <Confirmation />
                </Route>


                <Route exact path="/changePass/:token">
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
