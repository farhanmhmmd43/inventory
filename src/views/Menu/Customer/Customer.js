import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import CustomTable from '../../Components/CustomTable/CustomTable';
import Edit from '../../Components/CustomModal/Edit';

import axios from 'axios';

import { toast } from 'react-toastify';

import moment from "moment";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listview_data: [],
      pages: -1,
      limit: 10,
      form_data: {},
      modal: false
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
    })

    state.filtered.map((filter) => {
      params[filter.id] = filter.value
      return true
    })

    axios({
      method: 'GET',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/get-all-customer',
      params,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      }
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        let listview_data = [];

        let no = parseInt(result.data.data.from);
        result.data.data.lists.map((v) => {
          listview_data.push({
            no,
            id: v.id,
            created_at: v.created_at,
            name: v.name,
            phone_number: v.phone_number,
            city_name: v.city ? v.city.city_name : '',
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
    url: 'api/v1/cms/get-customer-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        customer_id: result.data.data.id,
        created_at: moment(result.data.data.created_at, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        name: result.data.data.name,
        phone_number: result.data.data.phone_number,
        city_id: result.data.data.city ? result.data.data.city.id : ''
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

  delete = (id) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/delete-customer',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data: { id }
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false
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
        })
      });
    })
  }

  update = (data) => {
    this.setState({
      loading: true
    });

    data.tanggal_join = data.created_at;
    // delete post_data.created_at;

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-customer',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal: false
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

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <CustomTable
                  {...this.props}
                  // filterByDate
                  buttons={[
                    {
                      type: 'download',
                      url: 'api/v1/cms/download-customer',
                      name: 'Customer',
                      access: [1, 2]
                    }
                  ]}
                  action={[
                    {
                      name: 'edit',
                      access: [1, 2, 3],
                      onClick: (e) => {
                        this.setState({ loading: true })
                        Promise.all([
                          this.get_detail(e.id),
                          this.get_all_city()
                        ]).then(() => {
                          this.setState({
                            loading: false,
                            modal: true
                          })
                        })
                      }
                    }, {
                      name: 'delete',
                      access: [1, 2],
                      onClick: (e) => {
                        this.delete(e.id)
                      }
                    }
                  ]}
                  // props from ReactTable
                  columns={
                    [{
                      Header: 'No',
                      accessor: 'no'
                    }, {
                      Header: 'Tanggal Customer Join',
                      accessor: 'created_at',
                      className: 'text-center'
                    }, {
                      Header: 'Nama Customer',
                      accessor: 'name',
                      filterable: true
                    }, {
                      Header: 'No. telp',
                      accessor: 'phone_number'
                    }, {
                      Header: 'Kota',
                      accessor: 'city_name'
                    }, {
                      Header: 'Aksi',
                      accessor: 'aksi'
                    }]
                  }
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
          isOpen={this.state.modal}
          onUpdate={this.update}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.customer_id,
              name: 'customer_id',
              label: 'ID',
              col: 6
            }, {
              type: 'readonly',
              value: this.state.form_data.created_at,
              name: 'created_at',
              label: 'Tanggal Customer Join',
              col: 6
            }, {
              type: 'tel',
              value: this.state.form_data.phone_number,
              name: 'phone_number',
              label: 'No. Telepon',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.name,
              name: 'name',
              label: 'Nama Customer',
              col: 6
            }, {
              type: 'selectsearch',
              value: this.state.form_data.city_id,
              name: 'city_id',
              label: 'Kota',
              col: 6,
              options: this.state.city_options
            }
          ]}
          afterClose={() => {
            this.setState({
              modal: false
            })
          }}
        />
      </div>
    );
  }
}

export default Customer;
