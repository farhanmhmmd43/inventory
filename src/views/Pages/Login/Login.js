import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import { Redirect } from 'react-router-dom';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import variables from '../../../_variables.js';

import { processResponse } from '../../../services/processResponse';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  fill_form = (event, name = null, value = null) => {
    if (name && value) {
      this.setState({
        form_login: { ...this.state.form_login, [name]: value }
      });
    } else {
      if (event) {
        if (event.target.type === 'checkbox') {
          this.setState({
            form_login: { ...this.state.form_login, [event.target.name]: event.target.checked }
          });
        } else {
          this.setState({
            form_login: { ...this.state.form_login, [event.target.name]: event.target.value }
          });
        }
      }
    }
  }

  login = () => {
    this.setState({
      loading: true,
    });

    axios({
      method: 'POST',
      url: variables.api_url + 'api/v1/cms/login',
      headers: {
        "Content-Type": "application/json"
      },
      data: this.state.form_login
    }).then((response) => {
      processResponse(response).then((result) => {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        this.setState({
          loading: false
        })
      }, (error) => {
        this.setState({
          loading: false
        }, () => {
          toast(error, {
            className: 'bg-danger text-white'
          })
        });
      })
    }, (error) => {
      this.setState({
        loading: false
      }, () => {
        toast(error.message, {
          className: 'bg-danger text-white'
        })
      });
    })
  }

  render() {
    if (localStorage.getItem('userData')) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div className="app flex-row align-items-center">
        <ToastContainer hideProgressBar={true} />
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          name="username"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              this.login();
                            }
                          }}
                          onChange={(e) => {
                            this.fill_form(e)
                          }}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              this.login();
                            }
                          }}
                          onChange={(e) => {
                            this.fill_form(e)
                          }}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          {this.state.loading
                            ? <Button
                              color="primary"
                              className="px-4"
                              disabled
                            ><i className="fas fa-circle-notch spinning"></i> Login</Button>
                            : <Button
                              color="primary"
                              className="px-4"
                              onClick={() => {
                                this.login();
                              }}
                            >Login</Button>
                          }
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {/* <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
