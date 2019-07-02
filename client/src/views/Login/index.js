import React, { Component } from "react";
import { httpPost } from "utils/http";
import { connect } from "react-redux";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert
} from "reactstrap";
import { func } from "prop-types";
import { setUser } from "modules/User/actions";
import { USER_LOGIN } from "config/endpoints";

class Login extends Component {
  /**
   * local state
   */
  state = {
    fields: {},
    errors: {},
    alert: false,
    message: ""
  };

  /**
   * handle form validations
   */
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //type
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "username is required";
    }

    //name
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Password is required";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  /**
   * form submit
   */
  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    if (this.handleValidation()) {
      this.checkLogin();
    }
  };

  /**
   * check login
   */
  checkLogin() {
    let url = USER_LOGIN;
    let body = this.state.fields;
    const token = localStorage.getItem("token");

    httpPost(url, body, {
      headers: { token }
    }).then(
      res => {
        if (res.status === 1) {
          this.props.setUser(res.user);
          console.log(res);
          localStorage.setItem("token", res.token);
          this.props.history.push("/admin/graphics");
        } else if (res.status === 0) {
          this.setState({ alert: true, message: res.message });
        }
      },
      err => {}
    );
  }

  /**
   * input change event
   */
  handleChange = e => {
    this.setState({ alert: false, message: "" });
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
    let errors = this.state.errors;
    if (fields[e.target.name]) {
      errors[e.target.name] = "";
      this.setState({ errors });
    }
  };

  /**
   * render login form
   */
  render() {
    const { alert } = this.state;
    return (
      <Container className="App">
        <h2>Sign In</h2>
        {alert && <Alert color="danger">{this.state.message}</Alert>}
        <Form className="form" onSubmit={this.handleSubmit}>
          <Col>
            <FormGroup>
              <Label>Username</Label>
              <Input
                type="email"
                name="username"
                placeholder="myusername@username.com"
                onChange={this.handleChange}
                invalid={this.state.errors["username"] ? true : false}
              />
              <FormFeedback>{this.state.errors["username"]}</FormFeedback>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="********"
                onChange={this.handleChange}
                invalid={this.state.errors["password"] ? true : false}
              />
              <FormFeedback>{this.state.errors["password"]}</FormFeedback>
            </FormGroup>
          </Col>
          <Button>Submit</Button>
        </Form>
      </Container>
    );
  }
}

/**
 * Define component props
 */
Login.propTypes = {
  setUser: func.isRequired
};

/**
 * Export the component
 */
export default connect(
  null,
  {
    setUser
  }
)(Login);
