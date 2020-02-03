import React, { Component } from 'react';

import {
   Col,
   Row,
   Form,
   FormGroup,
   Button
} from 'reactstrap';

import ReactTable from 'react-table';

import _ from 'lodash';

import Upload from '../CustomButtons/Upload';
import Download from '../CustomButtons/Download';

import DatePicker from "react-datepicker";
import moment from "moment";

import { DebounceInput } from 'react-debounce-input';

import Swal from 'sweetalert2';

class CustomTable extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         data: props.data,
         customFilter: {
            start_date: moment().startOf('month').format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD')
         }
      }
   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      // Process Action Button
      nextProps.data.map((v) => {
         if (nextProps.action) {
            let field = v;

            let hapus = null;
            let edit = null;
            let view = null;
            nextProps.action.map((vv) => {
               if (_.includes(vv.access, this.props.userData.user.role)) {
                  if (vv.name === 'delete') {
                     hapus = <i
                        className="fas fa-trash btn-delete"
                        onClick={() => {
                           Swal.fire({
                              text: "Anda yaking ingin menghapus data ini?",
                              type: 'warning',
                              showCancelButton: true,
                              customClass: {
                                 confirmButton: 'btn btn-primary mr-1',
                                 cancelButton: 'btn btn-dark'
                              },
                              buttonsStyling: false,
                              confirmButtonText: 'Ya',
                              cancelButtonText: 'Batal'
                           }).then((result) => {
                              if (result.value) {
                                 vv.onClick(v);
                              }
                           })
                        }}></i>
                  } else if (vv.name === 'edit') {
                     edit = <i
                        className="far fa-edit btn-edit"
                        onClick={() => {
                           vv.onClick(v);
                        }}></i>
                  } else if (vv.name === 'view') {
                     view = <i
                        className="far fa-file btn-edit"
                        onClick={() => {
                           vv.onClick(v);
                        }}></i>
                  }
               }
               return true;
            })

            field.aksi = <div className="action-btn">
               {view}
               {edit}
               {hapus}
            </div>
         }

         return true;
      })

      nextProps.columns.map((v) => {
         // Process Filter field
         if (v.filterable && !v.Filter) {
            v.Filter = ({ filter, onChange }) =>
               <DebounceInput
                  minLength={2}
                  debounceTimeout={1000}
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{ width: '100%' }}
               />
         }

         if (v.accessor === 'no') {
            v.width = 75;
            v.className = 'text-right';
         }
         return true;
      })
   }

   render() {
      return (
         <Row className="no-gutters">
            <Col md className="pb-3">
               {
                  // If filterByDate is True
                  this.props.filterByDate ? (
                     <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                           <DatePicker className="form-control"
                              onChange={(e) => {
                                 let customFilter = this.state.customFilter;
                                 customFilter['start_date'] = moment(e).format('YYYY-MM-DD');
                                 customFilter['end_date'] = this.props.endMaxDateFilter ? moment(e).add(this.props.endMaxDateFilter, 'months').format('YYYY-MM-DD') : moment(e).add(3, 'months').format('YYYY-MM-DD');
                                 this.setState({
                                    customFilter
                                 }, () => {
                                    this.props.onFetchData(this.state.state, this.state.instance, customFilter);
                                 });
                              }}
                              placeholderText=""
                              dateFormat="dd-MM-yyyy"
                              selected={new Date(moment(this.state.customFilter.start_date, 'YYYY-MM-DD').toISOString())}
                              minDate={this.props.startMinDateFilter ? new Date(moment().subtract(this.props.startMinDateFilter, 'months').toISOString()) : false}
                              maxDate={this.props.startMaxDateFilter ? new Date(moment().add(this.props.startMaxDateFilter, 'months').toISOString()) : false}
                           />
                        </FormGroup>

                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                           <DatePicker className="form-control"
                              onChange={(e) => {
                                 let customFilter = this.state.customFilter;
                                 customFilter['end_date'] = moment(e).format('YYYY-MM-DD');
                                 this.setState({
                                    customFilter
                                 }, () => {
                                    this.props.onFetchData(this.state.state, this.state.instance, customFilter);
                                 });
                              }}
                              placeholderText=""
                              dateFormat="dd-MM-yyyy"
                              selected={new Date(moment(this.state.customFilter.end_date, 'YYYY-MM-DD').toISOString())}
                              minDate={new Date(moment(this.state.customFilter.start_date, 'YYYY-MM-DD').toISOString())}
                              maxDate={this.props.endMaxDateFilter ? new Date(moment(this.state.customFilter.start_date).add(this.props.endMaxDateFilter, 'months').toISOString()) : new Date(moment(this.state.customFilter.start_date).add(3, 'months').toISOString())}
                           />
                        </FormGroup>
                     </Form>
                  ) : ''
               }
            </Col>

            {this.props.buttons ? this.props.buttons.map((v, idx) => {
               if (_.includes(v.access, this.props.userData.user.role)) {
                  if (v.type === 'custom') {
                     // Button Custom
                     return (
                        <Col key={idx} xs="auto" className="pr-2 pr-md-0 pl-md-2 pb-3">
                           <Button
                              color={v.color}
                              onClick={v.onClick}
                           >{v.name}</Button>
                        </Col>
                     )
                  } else if (v.type === 'upload') {
                     /* Button Upload */
                     return (
                        <Col key={idx} xs="auto" className="pr-2 pr-md-0 pl-md-2 pb-3">
                           <Upload
                              variables={this.props.variables}
                              userData={this.props.userData}
                              processResponse={this.props.processResponse}
                              url={v.url}
                              name={v.name}
                              afterUpload={this.props.onFetchData}
                           />
                        </Col>
                     )
                  } else if (v.type === 'download') {
                     /* Button Download */
                     return (
                        <Col key={idx} xs="auto" className="pr-2 pr-md-0 pl-md-2 pb-3">
                           <Download
                              customFilter={this.state.customFilter}
                              variables={this.props.variables}
                              userData={this.props.userData}
                              processResponse={this.props.processResponse}
                              url={v.url}
                              name={v.name}
                           />
                        </Col>
                     )
                  }
               }
               return true;
            }) : ''}

            {/* Listview Table */}
            <Col xs="12">
               <ReactTable
                  manual
                  columns={this.props.columns}
                  data={this.props.data}
                  pages={this.props.pages}
                  defaultPageSize={this.props.defaultPageSize}
                  loading={this.props.loading}
                  onFetchData={(state, instance) => {
                     this.setState({
                        state,
                        instance
                     });
                     this.props.onFetchData(state, instance, this.state.customFilter);
                  }}
                  showPagination={this.props.showPagination !== undefined ? this.props.showPagination : true}
                  previousText='Sebelumnya'
                  nextText='Selanjutnya'
                  loadingText='Loading...'
                  noDataText='Tidak ada data'
                  pageText='Halaman'
                  ofText='Dari'
                  rowsText='Baris'
               />
            </Col>
         </Row>
      )
   }
}

export default CustomTable;