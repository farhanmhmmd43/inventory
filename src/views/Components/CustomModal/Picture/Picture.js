import React, { Component } from 'react';
import {
   Modal,
   ModalBody
} from 'reactstrap';

import axios from 'axios';

import { toast } from 'react-toastify';

class Picture extends Component {
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

   get_picture = (url) => axios({
      method: 'GET',
      // baseURL: this.props.variables.api_url,
      url: url,
      responseType: 'blob',
      headers: {
         "Content-Type": "multipart/form-data",
         // "Authorization": "Bearer " + this.props.userData.access_token
      }
   }).then((response) => {
      this.setState({
         // picture: 'data:image/png;base64,' + Buffer.from(response.data, 'binary').toString('base64'),
         loading: false
      })
      // this.props.processResponse(response).then((result) => {
      //    console.log(result)
      // }, (error) => {
      //    toast(error, {
      //       className: 'bg-danger text-white'
      //    })
      // })
   }, (error) => {
      toast(error.message, {
         className: 'bg-danger text-white'
      })
   })

   UNSAFE_componentWillReceiveProps(nextProps) {
      // let form_data = {};
      // nextProps.inputs.map((v) => {
      //    form_data[v.name] = v.value;
      //    return true;
      // })
      this.setState({
         modal: nextProps.isOpen,
         url: nextProps.url
      }, () => {
         if (nextProps.isOpen) {
            this.setState({ loading: false })
            // this.get_picture(nextProps.url)
         }
      })
   }

   render() {
      return (
         <Modal
            isOpen={this.state.modal}
            toggle={this.toggle_modal}
            className={this.props.className}
            centered={true}
            size={"xl"}>
            <ModalBody>
               {
                  this.state.loading
                     ? <div style={{ minHeight: '200px', fontSize: '32px', width: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '40%', transform: 'translateY(-50 %)', width: '100%' }} className="text-center">
                           <i className="fas fa-circle-notch spinning"></i>
                        </div>
                     </div>
                     : <img src={this.state.url} className="img-fluid" style={{ width: '100%' }} alt="" />
               }
            </ModalBody>
         </Modal >
      )
   }
}

export default Picture;