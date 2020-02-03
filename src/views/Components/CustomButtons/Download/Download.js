import React, { Component } from 'react';

import {
   Button
} from 'reactstrap';

import axios from 'axios';

import { toast } from 'react-toastify';

import FileDownload from 'js-file-download';

class Download extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         customFilter: props.customFilter
      }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
         customFilter: nextProps.customFilter
      })
   }

   download_file = () => {
      this.setState({
         loading: true
      })

      axios({
         method: 'PUT',
         responseType: 'blob',
         baseURL: this.props.variables.api_url,
         url: this.props.url,
         headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.props.userData.access_token
         },
         data: {
            start_date: this.state.customFilter.start_date,
            end_date: this.state.customFilter.end_date
         }
      }).then((response) => {
         this.props.processResponse(response).then(
            (result) => {
               this.setState({
                  loading: false
               }, () => {
                  FileDownload(result.data, this.props.name + '.xlsx');
               })
            },
            (error) => {
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
            });
         });
      });
   }

   render() {
      if (this.state.loading) {
         return (
            <Button color="primary" disabled><i className="fas fa-circle-notch spinning"></i> Download</Button>
         )
      }
      return (
         <Button color="primary" onClick={this.download_file}><i className="fa fa-download"></i> Download</Button>
      )
   }
}

export default Download;