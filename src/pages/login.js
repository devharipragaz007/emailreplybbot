import React, {
    Component, Fragment
} from 'react';
import Api from '../api.json';
import LoginImage from '../images/login.svg';
import Alert from '@material-ui/lab/Alert';
import { Button ,Grid, TextField, Box, Container, ButtonGroup   } from '@material-ui/core';

import InputAdornment from '@material-ui/core/InputAdornment';
import { AccountCircle , VisibilityOff, Visibility  } from '@material-ui/icons';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PhoneIcon from '@material-ui/icons/Phone';
import IconButton from '@material-ui/core/IconButton';
import { Redirect } from "react-router-dom";
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showpassword : false,
            redirect : null,
            alert : null,
            signin : true,
            signup : false,
            forgetpassword : false,
            disableButton : true,
            formData : {
                email : '',
                password : '',
                name: '',
                phone : '',
                confpassword : ''
            }
        };
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

    onForgotPassword = () => {
        var email = this.state.formData.email;
        console.log(email)
        axios.post(Api.api + '/user/passwordReset', { email : email })
        .then(result => {
            if(result.data.status === 'success')
            {
                localStorage.setItem("token", result.data.data);
                this.setState({
                    ...this.state,
                    alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity="success">A recovery mail has sent to the registered E-Mail ID. Please check.</Alert>
                })
                setTimeout(() => { this.setState({alert : null}); }, 3000);
            }
            else{
                this.setState({
                    ...this.state,
                    alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity="error">{ result.data.message }</Alert>
                })
                setTimeout(() => { this.setState({alert : null}); }, 3000);
            }
        })
    }

    validate = () => {
        
        this.setState({
            ...this.state,
            disableButton : true
        })
        // var state = this.state;
        // var formData = this.state.formData;

        if(this.state.signin)
        {
            if(this.state.formData.email !== "" && this.state.formData.email !== undefined && this.state.formData.password !== "" && this.state.formData.password !== undefined)
            {
                this.setState({
                    ...this.state,
                    disableButton : false
                })
            }
        }
        else if(this.state.signup)
        {
            if(this.state.formData.email !== "" && this.state.formData.email !== undefined && this.state.formData.password !== "" && this.state.formData.password !== undefined && this.state.formData.confpassword !== "" && this.state.formData.confpassword !== undefined && this.state.formData.name !== "" && this.state.formData.name !== undefined && this.state.formData.phone !== "" && this.state.formData.phone !== undefined && this.state.formData.confpassword === this.state.formData.password)
            {
                this.setState({
                    ...this.state,
                    disableButton : false
                })
            }
        }
        else
        {
            if(this.state.formData.email !== "" && this.state.formData.email !== undefined)
            {
                this.setState({
                    ...this.state,
                    disableButton : false
                })
            }
        }

    }

    componentDidMount = () =>{
        this.interval = setInterval(() => this.validate(), 1000);
    }

    
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    

    
    toggglePassword = (type) => {
        this.setState({
            ...this.state,
            [type] : !this.state[type]
        })
    }

    signIn = () => {
        var formData = this.state.formData;
        if(formData.email !== '' && formData.email !== undefined && formData.password !== '' && formData.password !== undefined )
        {
            axios.post( Api.api + '/user/login', {
                email : formData.email,
                password : formData.password
            })
            .then(result => {
                if(result.data.status === "success")
                {
                    this.setState({
                        ...this.state,
                        alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity="success">{ result.data.message }</Alert>
                    })
                    setTimeout(() => { this.setState({alert : null}); }, 2000);
                    localStorage.setItem("logged", true);
                    localStorage.setItem("name", result.data.data.name);
                    localStorage.setItem("email", result.data.data.email);
                    localStorage.setItem("phone", result.data.data.phone);
                    localStorage.setItem("token", result.data.data.token);
                    this.setState({
                        ...this.state,
                        redirect : '/'
                    })
                }
                else{
                    this.setState({
                        ...this.state,
                        alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity="error">{ result.data.message }</Alert>
                    })
                    setTimeout(() => { this.setState({alert : null}); }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
                
                this.setState({
                    ...this.state,
                    alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity="error">Problem with connecting server</Alert>
                })
                setTimeout(() => { this.setState({alert : null}); }, 3000);
            })
        }
    }

    goToSignIn = () => {
        this.setState({
            ...this.state,
            signup : false,
            signin : true,
            forgetpassword : false
        })
    }

    register = () => {
        var formData = this.state.formData;
        axios.post(Api.api + '/user/register', formData)
        .then(result => {
            if(result.data.status === 'success')
            {
                localStorage.setItem("name", result.data.data.name);
                localStorage.setItem("email", result.data.data.email);
                localStorage.setItem("password", result.data.data.password);
                localStorage.setItem("phone", result.data.data.phone);
                localStorage.setItem("verifyCode", result.data.data.verifyCode);
                this.setState({
                    ...this.state,
                    alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity={result.data.status}>{ result.data.message }</Alert>
                })
                setTimeout(() => { this.setState({alert : null}); }, 3000);
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    signUp = () => {
        this.setState({
            ...this.state,
            signup : true,
            signin : false,
            forgetpassword : false
        })
    }

    forgotPassword = () => {
        this.setState({
            ...this.state,
            signup : false,
            signin : false,
            forgetpassword : true
        },() => {
            console.log(this.state)
        })
    }


    render() {
        var element = (
        <div className="login-page login"> 
            {/* <h3>Hari</h3> */}
            <Grid
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '80vh' }}
            >
            { this.state.signin ? 
            <Box component="span"  className="feild-container" sm={1} spacing={3}>
                
                <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ maxHeight: '60vh' }}>
                    <Grid item md={10} sm={10} xs={10}>
                        <h3>Log In</h3>
                    </Grid>
                    <Grid item lg={12}>
                        <TextField variant="outlined" label="E-mail" type="email" required={true} error={ this.state.formData.email === '' } fullWidth value={ this.state.formData.email } id="email" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.email === "" ? "E-Mail is Required.." : ''} autoFocus   InputProps={{
                            startAdornment : (
                            <InputAdornment>
                                <IconButton
                                aria-label="toggle password visibility"
                                >
                                <AccountCircle  />
                                </IconButton>
                            </InputAdornment>
                            )
                            }} />
                            <br/>
                            <br/>
                            
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

                    
                    {/* <Grid item md={12}>
                        <Button variant="contained" color="primary" onClick={ () => this.signIn() } disabled={ this.state.disableButton } >Log In</Button>
                        <br/>
                        <br/>
                    </Grid>
                    <Grid item md={6}>
                        <Button variant="outlined" color="primary" onClick={ () => this.signUp() }>Sign Up</Button>
                        <br/>
                        <br/>
                    </Grid> */}

                    <Grid item xs={12} alignItems="center" justify="center" direction="column">
                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                            <Button variant="contained" color="primary" onClick={ () => this.signIn() } disabled={ this.state.disableButton } >Log In</Button>
                            <Button variant="outlined" color="primary" onClick={ () => this.signUp() }>Sign Up</Button>
                        </ButtonGroup>
                        <br/>
                        <br/>
                    </Grid>

                    <Grid item md={12}>
                        <Button variant="outlined" color="secondary"  onClick={ () => this.forgotPassword() }>Forgot Password</Button>
                        <br/>
                        <br/>
                    </Grid>

                </Grid>
                {/* <Grid item xs={12}>
                    <h5> Forget Password </h5>
                </Grid> */}
            </Box>
            : this.state.signup ? 
                <Box component="span" style={{ marginTop : '13vh' }} id="sign-up" className="feild-container" sm={1} spacing={3}>

                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ maxHeight: '85vh' }}
                        >
                        <Grid item md={10} sm={10} xs={10}>
                            <h3>Sign Up</h3>
                        </Grid>
                            <Grid item lg={12}>
                                <TextField variant="outlined" label="Name" type="text" required={true} error={ this.state.formData.name === '' } fullWidth value={ this.state.formData.name } id="name" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.name === "" ? "Name is Required.." : ''} autoFocus   InputProps={{
                                    startAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        >
                                        <AccountCircle  />
                                        </IconButton>
                                    </InputAdornment>
                                    )
                                    }} />
                                    <br/>
                                    <br/>
                                    
                            </Grid>   


                            <Grid item md={12}>
                                <TextField variant="outlined" label="E-mail" type="email" required={true} error={ this.state.formData.email === '' } fullWidth value={ this.state.formData.email } id="email" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.email === "" ? "E-Mail is Required.." : ''} InputProps={{
                                    startAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        >
                                        <MailOutlineIcon  />
                                        </IconButton>
                                    </InputAdornment>
                                    )
                                    }} />
                                    <br/>
                                    <br/>
                                    
                            </Grid>   

                            <Grid item md={12}>
                                <TextField variant="outlined" label="Phone" type="text" required={true} error={ this.state.formData.phone === '' } fullWidth value={ this.state.formData.phone } id="phone" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.phone === "" ? "Phone is Required.." : ''} InputProps={{
                                    startAdornment : (
                                    <InputAdornment>
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        >
                                        <PhoneIcon  />
                                        </IconButton>
                                    </InputAdornment>
                                    )
                                    }} />
                                    <br/>
                                    <br/>
                                    
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
                                <Button variant="contained" color="primary" onClick={ () => this.register() }  disabled={ this.state.disableButton }>Submit</Button>
                            </Grid>

                            <Grid item lg={12}>
                                <h5 style={{ whiteSpace : 'normal' }} > Have an account ? <a style={{ cursor : 'pointer', textDecoration : 'underline' }} onClick={ () => this.goToSignIn() }> Sign In</a> </h5>
                            </Grid>
                        </Grid>
                </Box>
            
            : this.state.forgetpassword ? 
            <Box component="span"  className="feild-container" sm={1} spacing={3}>
                
                <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ maxHeight: '75vh' }}
                >
                    <Grid item md={10} sm={10} xs={10}>
                        <h3>Forgot Password</h3>
                    </Grid>
                    <Grid item md={12}>
                        <TextField variant="outlined" label="E-mail" type="email" required={true} error={ this.state.formData.email === '' } fullWidth value={ this.state.formData.email } id="email" onChange={ (ev) => this.handleChange(ev) } size="small" helperText={ this.state.formData.email === "" ? "E-Mail is Required.." : ''} autoFocus   InputProps={{
                            startAdornment : (
                            <InputAdornment>
                                <IconButton
                                aria-label="toggle password visibility"
                                >
                                <AccountCircle  />
                                </IconButton>
                            </InputAdornment>
                            )
                            }} />
                            <br/>
                            <br/>
                    </Grid>   


                    <Grid item md={12}>
                        <Button variant="contained" color="primary" onClick={ () => this.onForgotPassword() }  disabled={ this.state.disableButton }>Request</Button>
                    </Grid>

                    
                    <Grid item md={12}>
                        <h5><a style={{ cursor : 'pointer', textDecoration : 'underline' }} onClick={ () => this.goToSignIn() }> Sign In</a> </h5>
                    </Grid>

                </Grid>
            </Box>
            
            : null }

            </Grid> 
            
            <div className="alert-holder">
                { this.state.alert }
            </div>
        </div>
        )

        if(this.state.redirect !== null)
        {
            element = (
                <Redirect to={this.state.redirect} />
            )
        }

        return element;
        ;
    }
}

export default Login;