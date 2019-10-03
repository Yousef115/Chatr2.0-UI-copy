import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { authorization } from "../redux/actions/authentication";
import { setErrors } from "../redux/actions";

class RegistationForm extends Component {
  state = {
    username: "",
    password: ""
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = e => {
    e.preventDefault();
    this.props.authorization(
      this.state,
      this.props.match.url.substring(1),
      this.props.history
    );
  };

  errorHandler = () => {
    if (this.props.errors && this.props.match.url.substring(1) === "login") {
      return (
        <p style={{ color: "red" }}>
          {this.props.errors.data.non_field_errors[0]}
        </p>
      );
    } else if (
      this.props.errors &&
      this.props.match.url.substring(1) === "signup"
    ) {
      return (
        <p style={{ color: "red" }}>{this.props.errors.data.username[0]}</p>
      );
    }
  };

  render() {
    if (this.props.user) return <Redirect to="/" />;
    const type = this.props.match.url.substring(1);
    return (
      <div className="card col-6 mx-auto p-0 mt-5">
        <div className="card-body">
          <h5 className="card-title mb-4">
            {type === "login"
              ? "Login to send messages"
              : "Register an account"}
          </h5>
          <form onSubmit={this.submitHandler}>
            <div className="form-group">
              <input
                className={
                  this.props.errors ? "form-control is-invalid" : "form-control"
                }
                type="text"
                placeholder="Username"
                name="username"
                onChange={this.changeHandler}
              />
            </div>
            <div className="form-group">
              <input
                className={
                  this.props.errors ? "form-control is-invalid" : "form-control"
                }
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.changeHandler}
              />
            </div>
            {this.errorHandler()}
            <input
              className="btn-color"
              type="submit"
              value={type.replace(/^\w/, c => c.toUpperCase())}
            />
          </form>
        </div>
        <div className="card-footer">
          <Link
            to={type === "login" ? "/signup" : "/login"}
            className="btn btn-small btn-link"
            onClick={() => this.props.resetErrors({})}
          >
            {type === "login"
              ? "register an account"
              : "login with an existing account"}
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    errors: state.errors.response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authorization: (userData, type, history) =>
      dispatch(authorization(userData, type, history)),
    resetErrors: errors => dispatch(setErrors(errors))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistationForm);
