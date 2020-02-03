import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button
} from 'reactstrap';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Event extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col>
                    <Button color="warning">
                      <i className="fa fa-upload"></i> Unggah
                      </Button>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <ReactTable
                      data={
                        [{
                          no: 1,
                          nama_event: 'Tanner Linsley',
                          masa_berlaku: '08123456789',
                          tempat_event: 'Bogor',
                          aksi:
                            <div className="action-btn">
                              <i className="fa fa-edit btn-edit"></i>
                              <i className="fa fa-trash btn-delete"></i>
                            </div>
                        }, {
                          no: 2,
                          nama_event: 'Tanner Linsley',
                          masa_berlaku: '08123456789',
                          tempat_event: 'Bogor',
                          aksi:
                            <div className="action-btn">
                              <i className="fa fa-edit btn-edit"></i>
                              <i className="fa fa-trash btn-delete"></i>
                            </div>
                        }]
                      }
                      columns={
                        [{
                          Header: 'No',
                          accessor: 'no'
                        }, {
                          Header: 'Nama Event',
                          accessor: 'nama_event'
                        }, {
                          Header: 'Masa Berlaku',
                          accessor: 'masa_berlaku'
                        }, {
                          Header: 'Tempat Event',
                          accessor: 'tempat_event'
                        }, {
                          Header: 'Aksi',
                          accessor: 'aksi'
                        }]
                      }
                      defaultPageSize={5}
                      // Text
                      previousText= 'Sebelumnya'
                      nextText= 'Selanjutnya'
                      loadingText= 'Loading...'
                      noDataText= 'Tnama_eventak ada data'
                      pageText= 'Halaman'
                      ofText= 'Dari'
                      rowsText= 'Baris'
                                      />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Event;
