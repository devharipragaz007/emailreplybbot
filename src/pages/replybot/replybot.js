import React, {
    Component
} from 'react';
import { FormControl, Input, InputLabel, FormHelperText, TextareaAutosize, Button ,Grid, TextField   } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Api from '../../api.json'
import DateFnsUtils from '@date-io/date-fns';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
  
  
// import 'bootstrap/dist/css/bootstrap.min.css';

class Replybot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert : null,
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

        axios.get( Api.api + '/replyall', {
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

    render() {
        return ( 
            // <FormControl>
            <>
                <Grid container spacing={3}>
                    <Grid item md>
                        {/* <InputLabel htmlFor="email">Username(email)</InputLabel> */}
                        <TextField id="email" name="email" variant="outlined" label="Username (E-Mail)" fullWidth onChange={(event) => this.handleChange(event) } required={true} error={this.state.formData.email === ""} height="25%" value={this.state.formData.email} type="email" helperText={ this.state.formData.email === "" ? "E-Mail is Required.." : ''} autoFocus />
                    </Grid>

                    <Grid item md>
                        {/* <InputLabel htmlFor="password">Password</InputLabel> */}
                        <TextField id="password" type="password" name="password" onChange={(event) => this.handleChange(event) } fullWidth  variant="outlined" label="Password"  helperText={ this.state.formData.password === "" ? "Password is Required.." : ''}  required={true} error={this.state.formData.password === ""} value={this.state.formData.password}  />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item md>
                        {/* <InputLabel htmlFor="port">Port</InputLabel> */}
                        <TextField id="host" name="host"  onChange={(event) => this.handleChange(event) } fullWidth required={true} variant="outlined" label="Incoming Host" error={this.state.formData.host === ""} value={this.state.formData.host}  helperText={ this.state.formData.host === "" ? "Incoming Host is Required.." : ''}  />
                    </Grid>
                    
                    <Grid item md>
                        {/* <InputLabel htmlFor="port">Port</InputLabel> */}
                        <TextField id="outgoing_host" name="outgoing_host"  onChange={(event) => this.handleChange(event) } fullWidth required={true} variant="outlined" label="Outgoing Host" error={this.state.formData.outgoing_host === ""} value={this.state.formData.outgoing_host}  helperText={ this.state.formData.outgoing_host === "" ? "Outgoing Host is Required.." : ''}  />
                    </Grid>

                    <Grid item md>
                        {/* <InputLabel htmlFor="host">Host</InputLabel> */}
                        <TextField id="port" name="port" fullWidth variant="outlined" label="Incoming Port"  onChange={(event) => this.handleChange(event) } required={true} error={this.state.formData.port === ""} value={this.state.formData.port}  helperText={ this.state.formData.port === "" ? "Incoming Port is Required.." : ''} />
                    </Grid>

                    <Grid item md>
                        {/* <InputLabel htmlFor="host">Host</InputLabel> */}
                        <TextField id="outgoing_port" name="outgoing_port" fullWidth variant="outlined" label="Outgoing Port"  onChange={(event) => this.handleChange(event) } required={true} error={this.state.formData.outgoing_port === ""} value={this.state.formData.outgoing_port}  helperText={ this.state.formData.outgoing_port === "" ? "Outgoing Port is Required.." : ''}  />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item md>
                        {/* <InputLabel htmlFor="msg">Reply</InputLabel> */}
                        <TextField
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

                <Grid container spacing={3}>
                    <Grid item md>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
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
                        {/* <InputLabel htmlFor="fromDate">From Date</InputLabel>
                        <DatePicker selected={this.state.formData.fromDate} showPopperArrow={false} fullWidth  maxDate={ this.state.formData.toDate } dateFormat="dd/MM/yyyy" className="col-md-12" onChange={ (date) => this.setDate(date,'fromDate') } id="fromDate" /> */}
                    </Grid>

                    <Grid item md>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
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

                    <Grid item md>
                        <br/>
                        <TextField id="count" name="count" onChange={(event) => this.handleChange(event) } fullWidth  variant="outlined" label="Count" value={this.state.formData.count} />
                    </Grid>


                    <Grid item md>
                        <br/>
                        <TextField id="interval" name="interval" onChange={(event) => this.handleChange(event) } fullWidth  variant="outlined" label="Interval" value={this.state.formData.interval} />
                    </Grid>
                </Grid>
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