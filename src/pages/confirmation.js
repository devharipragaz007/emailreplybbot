import React, { Component } from 'react';
import { render } from 'react-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { Button, Grid, Backdrop  } from '@material-ui/core';
import axios from 'axios';
import Api from "../api.json";
import { Redirect } from "react-router-dom";

class Confirmation extends Component {
    constructor (props) {
        super(props);
        this.state = {
            alert : null,
            verified : null,
            progress : 0,
            redirect : null,
            message : "Please wait your token is being verified"
        }
        
        var d = window.location.pathname.split('/');
        var a = d[2].split('=');
        this.token = a[1];
    }
    
    tick = () => {
      // reset when reaching 100%
      this.setState({
          ...this.state,
          progress : this.state.progress >= 100 ? 0 : this.state.progress + 1
      })
};
    componentDidMount = () => {
        console.log('hari')
        
        this.timer = setInterval(this.tick, 20);
        console.log(this.token, localStorage.getItem("verifyCode"), this.token === localStorage.getItem("verifyCode"))
        if(this.token === localStorage.getItem("verifyCode"))
        {
            this.setState({
                ...this.state,
                alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity='success'>Token Verified!</Alert>,
                verified : true,
                message : " Account verified. Please wait you will redirected"
            })
            setTimeout(() => { this.setState({alert : null}); }, 3000);
            axios.post( Api.api + '/user/confirmation', {
                name : localStorage.getItem("name"),
                email : localStorage.getItem("email"),
                password : localStorage.getItem("password"),
                phone : localStorage.getItem("phone"),
                verifyCode : localStorage.getItem("verifyCode")
            })
            .then(result => {
                if(result.data.status === 'success')
                {
                    // localStorage.setItem("logged", true)
                    this.setState({
                        ...this.state,
                        redirect : '/'
                    })
                }
                else{
                    this.setState({
                        ...this.state,
                        alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity='success'>{ result.data.message }</Alert>,
                        verified : false,
                        message : "User already found. Try Sign-in to sign in or Forgot Password, if you forgot password!"
                    })
                }
            })
        }
        else {
            this.setState({
                ...this.state,
                alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity='error'>Token Verification Failed</Alert>,
                verified : false,
                message : " Account verification failed. Please try after sometimes"
            })
            setTimeout(() => { this.setState({alert : null, redirect : '/'}); }, 3000);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }
    
    render () {
        
        if(this.state.redirect !== null)
        {
         return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="login-page confirmation">
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                    >

                    <Grid item xs={3}>
                        {/* <CircularProgress variant="determinate" value={this.state.progress} /> */}
                        <Backdrop open={true}>
                            <div style={{display: 'inline-block'}}>
                                <CircularProgress color="primary" style={{ color : 'white', marginLeft : '100px' }}> 
                                </CircularProgress>
                                <h3 style={{ color : 'white' }}> { this.state.message } </h3>
                            </div>
                        </Backdrop>
                    </Grid>   

                    </Grid>
                    
                <div className="alert-holder">
                    { this.state.alert }
                </div>
            </div>
        )
    }
};

export default Confirmation;