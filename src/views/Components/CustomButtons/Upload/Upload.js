import React, { Component } from 'react';

import {
   Button
} from 'reactstrap';

import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Upload extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
      }
   }

   upload_file = (e) => {
      this.setState({
         loading: true
      });

      this.toast_upload = null;

      const data = new FormData();
      data.append(this.props.name, e.target.files[0]);

      axios({
         method: 'POST',
         baseURL: this.props.variables.api_url,
         url: this.props.url,
         headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.props.userData.access_token
         },
         data,
         onUploadProgress: p => {
            const progress = p.loaded / p.total;

            // check if we already displayed a toast
            if (this.toast_upload === null) {
               this.toast_upload = toast(<span><i className={"fa fa-upload"}></i> Mengunggah File...</span>, {
                  className: 'bg-info text-white',
                  autoClose: false,
                  closeOnClick: false,
                  draggable: false,
                  hideProgressBar: false,
                  progress: progress
               })
            } else {
               toast.update(this.toast_upload, {
                  progress: progress
               })
            }
         }
      }).then((response) => {
         this.props.processResponse(response).then((result) => {
            this.setState({
               loading: false
            }, () => {
               toast.update(this.toast_upload, {
                  render: 'Unggah File Berhasil',
                  className: 'bg-success text-white',
                  autoClose: 5000,
                  closeOnClick: true,
                  draggable: true
               });
            });
            // this.props.afterUpload(this.state.get_listview.state, this.state.get_listview.instance)
         }, (error) => {
            this.setState({
               loading: false
            }, () => {
               toast.update(this.toast_upload, {
                  render: error,
                  className: 'bg-danger text-white',
                  autoClose: 5000,
                  closeOnClick: true,
                  draggable: true
               })
            })
         })
      }, (error) => {
         this.setState({
            loading: false
         }, () => {
            toast.update(this.toast_upload, {
               render: error.message,
               className: 'bg-danger text-white',
               autoClose: 5000,
               closeOnClick: true,
               draggable: true
            });
         })
      });

      e.target.value = null
   }

   render() {
      if (this.state.loading) {
         return (
            <Button color="warning" disabled><i className="fas fa-circle-notch spinning"></i> Unggah</Button>
         )
      }
      return (
         <div>
            <input
               type="file"
               ref={(e) => this.upload = e}
               style={{ display: 'none' }}
               onChange={(e) => { this.upload_file(e) }}
            />

            <Button color="warning" onClick={() => this.upload.click()}>
               <span className={"fa fa-upload"}></span> Unggah
            </Button>
         </div>
      )
   }
}

export default Upload;