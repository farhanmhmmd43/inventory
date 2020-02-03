import React, { Component } from 'react';
import {
   Col,
   Row,
   Button,
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   FormGroup,
   Label,
   Input,
   FormFeedback
} from 'reactstrap';

import DatePicker from "react-datepicker";
import moment from "moment";

import SelectSearch from 'react-select-search';

import CurrencyFormat from 'react-currency-format';

import { toast } from 'react-toastify';

class Edit extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         modal: props.isOpen,
         form_data: {}
      }
   }

   toggle_modal = () => {
      this.setState(prevState => ({
         modal: !prevState.modal
      }), () => {
         if (!this.state.modal) {
            this.props.afterClose()
         }
      });
   }

   fill_form_data = (event, name = null, value = null) => {
      if (name && value) {
         // If entered manualy
         this.setState({
            form_data: { ...this.state.form_data, [name]: value }
         });
      } else {
         if (event) {
            if (event.target.type === 'checkbox') {
               this.setState({
                  form_data: { ...this.state.form_data, [event.target.name]: event.target.checked }
               });
            } else {
               this.setState({
                  form_data: { ...this.state.form_data, [event.target.name]: event.target.value }
               });
            }
         }
      }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      let form_data = {};
      nextProps.inputs.map((v) => {
         form_data[v.name] = v.value;
         return true;
      })
      this.setState({
         modal: nextProps.isOpen,
         form_data,
         loading: nextProps.loading
      })
   }

   render() {
      return (
         <Modal
            isOpen={this.state.modal}
            toggle={this.toggle_modal}
            className={this.props.className}
            centered={true}
            size={"lg"}>
            <ModalHeader toggle={this.toggle_modal}>Edit</ModalHeader>
            <ModalBody>
               <Row>
                  {this.props.inputs.map((v, index) => {
                     if (v.type === 'hidden') {
                        return (
                           <Input key={index} type="hidden" value={v.value} />
                        )
                     } else if (v.type === 'datepicker') {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup >
                                 <Label>{v.label}</Label>
                                 <DatePicker className="form-control"
                                    onChange={(e) => { this.fill_form_data(null, v.name, moment(e).format('YYYY-MM-DD')) }}
                                    placeholderText=""
                                    dateFormat="dd-MM-yyyy"
                                    selected={
                                       this.state.form_data[v.name]
                                          ? new Date(moment(this.state.form_data[v.name], 'YYYY-MM-DD').toISOString())
                                          : new Date(moment(v.value, 'YYYY-MM-DD').toISOString())
                                    }
                                 />
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     } else if (v.type === 'selectsearch') {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup>
                                 <Label>{v.label}</Label>
                                 <SelectSearch
                                    options={v.options ? v.options : [{}]}
                                    className="select-search-box"
                                    value={this.state.form_data[v.name] ? this.state.form_data[v.name] : ''}
                                    onChange={(value, state, props) => {
                                       this.fill_form_data(null, v.name, value.value);
                                       if (v.onchange) {
                                          v.onchange(value.value)
                                       }
                                    }}
                                 />
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     } else if (v.type === 'select') {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup>
                                 <Label>{v.label}</Label>
                                 <Input type={v.type} name={v.name} onChange={this.fill_form_data} value={this.state.form_data[v.name] ? this.state.form_data[v.name] : ''} invalid={false} >
                                    {v.options.map((vv, idx) => (
                                       <option key={idx} value={vv.value}>{vv.text}</option>
                                    ))}
                                 </Input>
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     } else if (v.type === 'currency') {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup>
                                 <Label>{v.label}</Label>
                                 <CurrencyFormat
                                    value={this.state.form_data[v.name] ? this.state.form_data[v.name] : ''}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    prefix={'Rp.'}
                                    className="form-control"
                                    suffix={',00'}
                                    onValueChange={(values) => {
                                       const { value } = values;
                                       // formattedValue = $2,223
                                       // value ie, 2223
                                       this.fill_form_data(null, v.name, value);
                                    }}
                                 />
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     } else if (v.type === 'image') {
                        return (
                           <Col xs={v.col} key={index}>
                              <form ref={form => (this.form = form)}>
                                 <input
                                    id="upload_image"
                                    type="file"
                                    ref={(e) => this.upload = e}
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                       if (e.target.files[0]) {
                                          if (e.target.files[0].size <= 20480000/*2048000*/) {
                                             let form_data = this.state.form_data;
                                             form_data[v.name] = e.target.files[0];
                                             this.setState({
                                                form_data
                                             });
                                          } else {
                                             toast('Maksimum file 2Mb', {
                                                className: 'bg-danger text-white'
                                             })
                                          }
                                       }
                                    }}
                                 />
                              </form>

                              <Button color={"primary"} onClick={(e) => this.upload.click()}>
                                 <span className={"fa fa-upload"}></span> Unggah
                              </Button>
                              {' '}
                              {this.state.form_data.photo ? this.state.form_data.photo.name : <span className="text-danger">Maksimum 2Mb</span>}

                              <img src={this.state.form_data.photo ? URL.createObjectURL(this.state.form_data.photo) : ''} className="img-fluid" alt="" />
                           </Col>
                        )
                     } else if (v.type === 'textarea') {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup>
                                 <Label>{v.label}</Label>
                                 <Input
                                    rows="4"
                                    ref={e => this.textarea = e}
                                    type={v.type}
                                    name={v.name}
                                    value={this.state.form_data[v.name] ? this.state.form_data[v.name] : ''}
                                    invalid={false}
                                    onFocus={(e) => {
                                       e.target.style.height = "0px";
                                       e.target.style.height = (25 + e.target.scrollHeight) + "px";
                                    }}
                                    onChange={(e) => {
                                       this.fill_form_data(e);
                                       e.target.style.height = "0px";
                                       e.target.style.height = (25 + e.target.scrollHeight) + "px";
                                    }}
                                 />
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     } else if (v.type === 'checkbox') {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup check>
                                 <Label check>
                                    <Input type={v.type} name={v.name} onChange={this.fill_form_data} checked={this.state.form_data[v.name] ? true : false} invalid={false} readOnly={v.type === 'readonly' ? true : false} />
                                    {v.label}
                                 </Label>
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     } else {
                        return (
                           <Col xs={v.col} key={index}>
                              <FormGroup>
                                 <Label>{v.label}</Label>
                                 <Input type={v.type} name={v.name} onChange={this.fill_form_data} value={this.state.form_data[v.name] ? this.state.form_data[v.name] : ''} invalid={false} readOnly={v.type === 'readonly' ? true : false} />
                                 <FormFeedback>This field is required</FormFeedback>
                              </FormGroup>
                           </Col>
                        )
                     }
                  })}
               </Row>
            </ModalBody>
            <ModalFooter>
               <Button color="dark" onClick={this.toggle_modal}>Cancel</Button>{' '}
               {this.state.loading
                  ? <Button color="primary" disabled><i className="fas fa-circle-notch spinning"></i> Save</Button>
                  : <Button color="primary" onClick={() => this.props.onUpdate(this.state.form_data)}>Save</Button>}
            </ModalFooter>
         </Modal >
      )
   }
}

export default Edit;