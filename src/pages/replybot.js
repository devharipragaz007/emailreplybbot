import React, {
    Component
} from 'react';
import {  Button ,Grid, TextField   } from '@material-ui/core';
import "react-datepicker/dist/react-datepicker.css";
import Api from '../api.json'
import DateFnsUtils from '@date-io/date-fns';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
  
  
// import 'bootstrap/dist/css/bootstrap.min.css';

class Replybot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert : null,
            showpassword : false,
            formData : {
                email :  '',
                password :  '',
                msg :  '',
                host :  '',
                outgoing_host :  '',
                port :  '',
                outgoing_port :  '',
                interval :  '',
                count :  '',
                fromDate : null,
                toDate : null,
            }
        }

        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(event) {
        var id = [event.target.id];
        this.setState({
            formData: {
                  ...this.state.formData,
                  [id]: event.target.value
            }
        })
      }


    handleSubmit = () => {
        var formData = this.state.formData;
        var headers = {
            'authorization': localStorage.getItem("authorization")
        }
        console.log(headers);
        axios.get( Api.api + '/mailsender/replyall', {
            headers : headers,
            params : formData
        })
        .then(response => {
            console.log(response.data.message)
                this.setState({
                    ...this.state,
                    alert : <Alert  action={ <Button color="inherit" size="small"> UNDO </Button> } severity={response.data.status}>{ response.data.message }</Alert>
                })
                // window.location.reload();
                // setTimeout(() => { this.setState({alert : null},() => { window.location.reload(); }); }, 3000).bind(this);
                // this.setState({alert : <Animated animationIn="fadeInDown" animationOut="fadeInUp" isVisible={true}> <div className="alert alert-danger"><strong>{response.data.message}</strong></div> </Animated> });
                setTimeout(() => { this.setState({alert : null}); }, 3000);
                setTimeout(() => { window.location.reload() },2000)
                
        })
        .catch(err => {
            console.log(err);
            this.setState({
                ...this.state,
                alert : <Alert  action={
                    <Button color="inherit" size="small">
                      UNDO
                    </Button>
                  } severity="error">Error while connecting the host...</Alert>
            })
            setTimeout(() => { this.setState({alert : null}); }, 3000);
            setTimeout(() => { window.location.reload() },2000)
            // setTimeout(() => { this.setState({alert : null},() => {  }); }, 3000).bind(this);
        }) 
      }

      
    setDate = (date,field) =>{

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                [field] : date
            }
        })
    }

    checkValidate = () => {
        var formData = this.state.formData;

        if(formData.email !== "" && formData.password !== "" && formData.host !== "" && formData.port !== "" && formData.outgoing_host !== "" && formData.outgoing_port !== "" && formData.msg !== "")
        {
            return false;
        }
        else{
            return true;
        }
    }

    toggglePassword = () => {
        this.setState({
            ...this.state,
            showpassword : !this.state.showpassword
        })
    }

    render() {
        return ( 
            // <FormControl>
            <>
                <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12} >
                        {/* <InputLabel htmlFor="email">Username(email)</InputLabel> */}
                        <TextField size="small" id="email" name="email" variant="outlined" label="Username (E-Mail)" fullWidth onChange={(event) => this.handleChange(event) } required={true} error={this.state.formData.email === ""} height="25%" value={this.state.formData.email} type="email" helperText={ this.state.formData.email === "" ? "E-Mail is Required.." : ''} autoFocus />
                    </Grid>

                    <Grid item md={6} sm={6} xs={12} >
                        <TextField
                            size="small" id="password" type={ this.state.showpassword ? 'text' : 'password' } name="password" onChange={(event) => this.handleChange(event) } fullWidth  variant="outlined" label="Password"  helperText={ this.state.formData.password === "" ? "Password is Required.." : ''}  required={true} error={this.state.formData.password === ""} value={this.state.formData.password} 
                            InputProps={{
                            endAdornment : (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => this.toggglePassword() }
                                >
                                {this.state.showpassword === true ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            )
                            }}
                        />
                    </Grid>
                </Grid>
                <br/>

                <Grid container spacing={3}>
                    <Grid item md={3} sm={6} xs={12} >
                        {/* <InputLabel htmlFor="port">Port</InputLabel> */}
                        <TextField size="small" id="host" name="host"  onChange={(event) => this.handleChange(event) } fullWidth required={true} variant="outlined" label="Incoming Host" error={this.state.formData.host === ""} value={this.state.formData.host}  helperText={ this.state.formData.host === "" ? "Incoming Host is Required.." : ''}  />
                    </Grid>
                    
                    <Grid item md={3} sm={6} xs={12} >
                        {/* <InputLabel htmlFor="port">Port</InputLabel> */}
                        <TextField size="small" id="outgoing_host" name="outgoing_host"  onChange={(event) => this.handleChange(event) } fullWidth required={true} variant="outlined" label="Outgoing Host" error={this.state.formData.outgoing_host === ""} value={this.state.formData.outgoing_host}  helperText={ this.state.formData.outgoing_host === "" ? "Outgoing Host is Required.." : ''}  />
                    </Grid>

                    <Grid item md={3} sm={6} xs={12} >
                        {/* <InputLabel htmlFor="host">Host</InputLabel> */}
                        <TextField size="small" id="port" name="port" fullWidth variant="outlined" label="Incoming Port"  onChange={(event) => this.handleChange(event) } required={true} error={this.state.formData.port === ""} value={this.state.formData.port}  helperText={ this.state.formData.port === "" ? "Incoming Port is Required.." : ''} />
                    </Grid>

                    <Grid item md={3} sm={6} xs={12} >
                        {/* <InputLabel htmlFor="host">Host</InputLabel> */}
                        <TextField size="small" id="outgoing_port" name="outgoing_port" fullWidth variant="outlined" label="Outgoing Port"  onChange={(event) => this.handleChange(event) } required={true} error={this.state.formData.outgoing_port === ""} value={this.state.formData.outgoing_port}  helperText={ this.state.formData.outgoing_port === "" ? "Outgoing Port is Required.." : ''}  />
                    </Grid>
                </Grid>
                <br/>

                <Grid container spacing={3}>
                    <Grid item md={12} sm={12} xs={12} >
                        {/* <InputLabel htmlFor="msg">Reply</InputLabel> */}
                        <TextField size="small"
                            id="msg"
                            name="msg"
                            onChange={(event) => this.handleChange(event) } 
                            label="Reply Text"
                            required
                            error={this.state.formData.msg  === ""}
                            multiline
                            rows={4}
                            helperText={ this.state.formData.msg === "" ? "Reply Text is Required." : ''} 
                            fullWidth
                            value={this.state.formData.msg}
                            variant="outlined"
                            />
                    </Grid>
                </Grid>
                <br/>

                <Grid container spacing={3}>
                    <Grid item md={3} sm={3} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            size="small"
                            fullWidth
                            margin="normal"
                            required={false}
                            id="fromDate"
                            name="fromDate"
                            inputVariant="outlined" 
                            label="From Date"
                            format="dd/MM/yyyy"
                            value={this.state.formData.fromDate}
                            onChange={() => this.setDate()}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}/>
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item md={3} sm={3} xs={12} >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            size="small"
                            fullWidth
                            required={false}
                            id="toDate"
                            name="toDate"
                            label="To Date"
                            inputVariant="outlined" 
                            format="dd/MM/yyyy"
                            autoOk
                            disablePast
                            value={this.state.formData.toDate}
                            onChange={() => this.setDate()}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}/>
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item md={3} sm={6} xs={12} >
                        <br/>
                        <TextField size="small" style={{ marginTop : '-5px' }} id="count" name="count" onChange={(event) => this.handleChange(event) } fullWidth  variant="outlined" label="Count" value={this.state.formData.count} />
                    </Grid>


                    <Grid item md={3} sm={6} xs={12} >
                        <br/>
                        <TextField size="small" id="interval" name="interval" style={{ marginTop : '-5px' }}  onChange={(event) => this.handleChange(event) } fullWidth  variant="outlined" label="Interval" value={this.state.formData.interval} />
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <Grid container  direction="row" justify="flex-end" alignItems="center">
                    <Grid item md={10}>
                    </Grid>
                    <Grid item md={2}>
                        <Button variant="contained" disabled={ this.checkValidate() } onClick={ () => this.handleSubmit() } color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
                <div className="alert-holder">
                    { this.state.alert }
                </div>
            </>
        // </FormControl>
        )
    }

}
export default Replybot;