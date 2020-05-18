import React , { Component } from 'react';
import Api from '../api.json';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import { Button ,Grid, TextField, Box } from '@material-ui/core';

import InputAdornment from '@material-ui/core/InputAdornment';
import { VisibilityOff, Visibility  } from '@material-ui/icons';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import IconButton from '@material-ui/core/IconButton';
import { Redirect } from "react-router-dom";


class ResetPass extends Component {
    constructor(props){
        super(props);
        this.state = {
            alert : null,
            redirect : null,
            disableButton : true,
            formData : {
                password : '',
                confpassword : ''
            },
            showpassword : false,
            showconfpassword : false,
            disableButton : true
        }
        
        var d = window.location.pathname.split('/');
        var a = d[2].split('=');
        this.token = a[1];
    }

    componentDidMount = () =>{
        this.interval = setInterval(() => this.validate(), 1000);
    }
    
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    handleChange = (event) => {
        var id = event.target.id;

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                [id] : event.target.value
            }
        })
    }
    
    validate = () => {
        
        this.setState({
            ...this.state,
            disableButton : true
        })
        if(this.state.formData.password !== "" && this.state.formData.password !== undefined && this.state.formData.confpassword !== "" && this.state.formData.confpassword !== undefined && this.state.formData.confpassword === this.state.formData.password)
        {
            this.setState({
                ...this.state,
                disableButton : false
            })
        }

    }

    resetPassword = () =>{
        var formData = this.state.formData;
        var headers = {
            'Authorization': this.token
        }

        axios.post(Api.api + '/user/changePass', formData, {
            headers : headers
        })
        .then(result => {
            this.setState({
                ...this.state,
                alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity={ result.data.status }>{ result.data.message }</Alert>
            }, () => {
                if(result.data.status === "success")
                {
                    this.setState({
                        ...this.state,
                        redirect : '/'
                    })
                }
            })
            setTimeout(() => { this.setState({alert : null}); }, 3000);
        })
        .catch( err=> {
            console.log(err);
            
            this.setState({
                ...this.state,
                alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity="error">Problem with connecting server</Alert>
            })
            setTimeout(() => { this.setState({alert : null}); }, 3000);
        })
    }

    toggglePassword = (type) => {
        this.setState({
            ...this.state,
            [type] : !this.state[type]
        })
    }


    render () {
        
        if(this.state.redirect !== null)
        {
         return <Redirect to={this.state.redirect} />
        }
        return (
        <div className="login-page resetpass">
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
                >


                <Box component="span"  className="feild-container" sm={1} spacing={3}>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ maxHeight: '80vh'}}>
                            <Grid item md={10} sm={10} xs={10}>
                                <h3>Reset Password</h3>
                            </Grid>
                            
                            <Grid item md={10} sm={10} xs={11} >
                                <TextField variant="outlined" label="Password" type={ this.state.showpassword ? 'text' : 'password' } required={true} error={ this.state.formData.password === '' } fullWidth value={ this.state.formData.password } id="password" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.password === "" ? "Password is Required.." : ''} InputProps={{
                                    startAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        >
                                        <VpnKeyIcon   />
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                    endAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => this.toggglePassword('showpassword') }
                                            >
                                            {this.state.showpassword === true ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                    </InputAdornment>
                                    )
                                    }} />
                                    <br/>
                                    <br/>
                            </Grid>

                            <Grid item md={10} sm={10} xs={11} >
                                <TextField variant="outlined" label="Confirm Password" type={ this.state.showconfpassword ? 'text' : 'password' } required={true} error={ this.state.formData.confpassword === "" || this.state.formData.confpassword !== this.state.formData.password } fullWidth value={ this.state.formData.confpassword } id="confpassword" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.confpassword !== this.state.formData.password ? "Passwords not matching.." : ''}   InputProps={{
                                    startAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        >
                                        <VpnKeyIcon   />
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                    endAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => this.toggglePassword('showconfpassword') }
                                            >
                                            {this.state.showconfpassword === true ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                    </InputAdornment>
                                    )
                                    }} />
                                    <br/>
                                    <br/>
                            </Grid>

                            <Grid item md={12}>
                                <Button variant="contained" color="primary" onClick={ () => this.resetPassword() }  disabled={ this.state.disableButton }>Submit</Button>
                            </Grid>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <h5> Forget Password </h5>
                        </Grid> */}
                    </Box> 

                </Grid>
                
            <div className="alert-holder">
                { this.state.alert }
            </div>
        </div>
        )
    }
}

export default ResetPass;