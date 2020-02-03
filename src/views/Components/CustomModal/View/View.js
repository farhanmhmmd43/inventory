import React, { Component } from 'react';
import {
   Col,
   Button,
   Modal,
   ModalHeader,
   ModalBody,
   ModalFooter,
   FormGroup,
   Label,
   Form
} from 'reactstrap';

class View extends Component {
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

   UNSAFE_componentWillReceiveProps(nextProps) {
      let form_data = {};
      nextProps.inputs.map((v) => {
         form_data[v.name] = v.value;
         return true;
      })
      this.setState({
         modal: nextProps.isOpen,
         form_data
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
            <ModalHeader toggle={this.toggle_modal}>{this.props.title}</ModalHeader>
            <ModalBody>
               <Form>
                  {this.props.inputs.map((v, index) => {
                     return (
                        <FormGroup row key={index}>
                           <Label xs={4}>{v.label}</Label>
                           <Col xs="auto"> : </Col>
                           <Col>
                              {v.value}
                           </Col>
                        </FormGroup>
                     )
                  })}
               </Form>
            </ModalBody>
            <ModalFooter>
               <Button color="dark" onClick={this.toggle_modal}>Close</Button>
            </ModalFooter>
         </Modal >
      )
   }
}

export default View;