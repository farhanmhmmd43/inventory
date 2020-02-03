import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import moment from "moment";

import axios from 'axios';

import { toast } from 'react-toastify';

import CustomTable from '../../../Components/CustomTable/CustomTable';
import Edit from '../../../Components/CustomModal/Edit';

class BookingService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listview_data: [],
      pages: -1,
      limit: 10,
      form_data: {}
    }
  }

  get_listview = (state, instance, customFilter = []) => {
    this.setState({
      loading: true,
      get_listview: {
        state,
        instance
      }
    });

    let params = {
      limit: state.pageSize,
      page: (parseInt(state.page) + 1)
    }

    Object.keys(customFilter).map(v => {
      params[v] = customFilter[v];
      return true;
    });

    state.filtered.map((filter) => {
      params[filter.id] = filter.value
      return true
    });

    axios({
      method: 'GET',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/get-all-booking-service',
      params,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      }
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        const status = [
          <span className="text-danger">Nonbooking</span>,
          <span className="text-success">Booking</span>
        ];

        let listview_data = [];

        let no = parseInt(result.data.data.from);
        result.data.data.lists.map((v) => {
          listview_data.push({
            no,
            id: v.id,
            nama_customer: v.name,
            no_telp: v.phone_number,
            kota: v.city ? v.city.city_name : '',
            kecamatan: v.kecamatan,
            tanggal_akses: v.chat_date,
            tanggal_booking: v.date,
            status: status[v.status],
            note:
              <button
                className="btn btn-link" onClick={() => {
                  this.setState({ loading: true });
                  Promise.all([
                    this.get_note(v.id)
                  ]).then(() => {
                    this.setState({
                      modal_note: true,
                      loading: false
                    })
                  })
                }}>
                Cek Note
            </button>
          });
          no++;
          return true;
        });

        this.setState({
          loading: false,
          pages: result.data.data.last_page,
          limit: result.data.data.per_page,
          listview_data
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

  get_detail = (id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-prospect-booking-service-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id: result.data.data.id,
        phone_number: result.data.data.phone_number,
        kecamatan: result.data.data.kecamatan,
        date: moment(result.data.data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        name: result.data.data.name,
        city_id: result.data.data.city ? result.data.data.city.id : '',
        chat_date: result.data.data.chat_date,
        status: result.data.data.status,
      }

      this.setState({
        form_data
      })
    }, (error) => {
      toast(error, {
        className: 'bg-danger text-white'
      })
    })
  }, (error) => {
    toast(error.message, {
      className: 'bg-danger text-white'
    })
  })

  update = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-prospect-booking-service',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_edit: false
        }, () => {
          toast('Success', {
            className: 'bg-success text-white'
          });
          this.get_listview(this.state.get_listview.state, this.state.get_listview.instance);
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
        });
        this.get_listview(this.state.get_listview.state, this.state.get_listview.instance);
      });
    })
  }

  get_note = (id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-prospect-booking-service-notes',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id,
        notes: response.data.data
      }

      this.setState({
        form_data
      })
    }, (error) => {
      toast(error, {
        className: 'bg-danger text-white'
      })
    })
  }, (error) => {
    toast(error.message, {
      className: 'bg-danger text-white'
    })
  })

  update_note = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-prospect-booking-service-notes',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_note: false
        }, () => {
          toast('Success', {
            className: 'bg-success text-white'
          });
          this.get_listview(this.state.get_listview.state, this.state.get_listview.instance);
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
        });
        this.get_listview(this.state.get_listview.state, this.state.get_listview.instance);
      });
    })
  }

  get_all_city = () => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-city',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let city_options = [{}];
      result.data.data.city.map((v) => {
        city_options.push({ name: v.city_name, value: v.id });
        return true;
      });

      this.setState({
        city_options
      })
    }, (error) => {
      toast(error, {
        className: 'bg-danger text-white'
      })
    })
  }, (error) => {
    toast(error.message, {
      className: 'bg-danger text-white'
    })
  })

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <CustomTable
                  {...this.props}
                  filterByDate
                  buttons={[
                    {
                      type: 'download',
                      url: 'api/v1/cms/download-prospect-booking-service',
                      name: 'Prospect Booking Service',
                      access: [1, 2]
                    }
                  ]}
                  action={[
                    {
                      name: 'edit',
                      access: [1, 2, 3],
                      onClick: (e) => {
                        this.setState({ loading: true });
                        Promise.all([
                          this.get_detail(e.id),
                          this.get_all_city()
                        ]).then(() => {
                          this.setState({
                            modal_edit: true,
                            loading: false
                          })
                        })
                      }
                    }
                  ]}
                  // props from ReactTable
                  columns={[
                    {
                      Header: 'No',
                      accessor: 'no'
                    }, {
                      Header: 'ID',
                      accessor: 'id'
                    }, {
                      Header: 'Nama Customer',
                      accessor: 'nama_customer'
                    }, {
                      Header: 'No. Telp',
                      accessor: 'no_telp'
                    }, {
                      Header: 'Kota',
                      accessor: 'kota'
                    }, {
                      Header: 'Kecamatan',
                      accessor: 'kecamatan'
                    }, {
                      Header: 'Tanggal Akses',
                      accessor: 'tanggal_akses'
                    }, {
                      Header: 'Tanggal Booking',
                      accessor: 'tanggal_booking'
                    }, {
                      Header: 'Status',
                      accessor: 'status'
                    }, {
                      Header: 'Aksi',
                      accessor: 'aksi'
                    }
                  ]}
                  data={this.state.listview_data}
                  onFetchData={this.get_listview} // Receive 3 params ( state, instance, customFilter )
                  pages={this.state.pages}
                  defaultPageSize={this.state.limit}
                  loading={this.state.loading}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Edit
          loading={this.state.loading}
          isOpen={this.state.modal_edit}
          onUpdate={this.update}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.id,
              name: 'id'
            }, {
              type: 'text',
              value: this.state.form_data.name,
              name: 'name',
              label: 'Nama Customer',
              col: 6
            }, {
              type: 'readonly',
              value: this.state.form_data.chat_date,
              name: 'chat_date',
              label: 'Tanggal Akses',
              col: 6
            }, {
              type: 'tel',
              value: this.state.form_data.phone_number,
              name: 'phone_number',
              label: 'No. Telepon',
              col: 6
            }, {
              type: 'datepicker',
              value: this.state.form_data.date,
              name: 'date',
              label: 'Tanggal Booking',
              col: 6
            }, {
              type: 'selectsearch',
              value: this.state.form_data.city_id,
              name: 'city_id',
              label: 'Kota',
              col: 6,
              options: this.state.city_options
            }, {
              type: 'select',
              value: this.state.form_data.status,
              name: 'status',
              label: 'Status',
              col: 6,
              options: [{ value: 1, text: 'Booking' }, { value: 0, text: 'Nonbooking' }]
            }, {
              type: 'text',
              value: this.state.form_data.kecamatan,
              name: 'kecamatan',
              label: 'Kecamatan',
              col: 6
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_edit: false
            })
          }}
        />

        <Edit
          isOpen={this.state.modal_note}
          onUpdate={this.update_note}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.id,
              name: 'id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.notes,
              name: 'notes',
              label: 'Note',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_note: false
            })
          }}
        />
      </div>
    );
  }
}

export default BookingService;
