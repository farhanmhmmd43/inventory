import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import axios from 'axios';

import { toast } from 'react-toastify';

import CustomTable from '../../../Components/CustomTable/CustomTable';
import Edit from '../../../Components/CustomModal/Edit';
import View from '../../../Components/CustomModal/View';

class Ahass extends Component {
  constructor() {
    super();
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
    })

    state.filtered.map((filter) => {
      params[filter.id] = filter.value
      return true
    })

    axios({
      method: 'GET',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/get-all-ahass',
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
            name: v.name,
            address: v.address,
            city_name: v.city ? v.city.city_name : '',
            contact: v.contact,
            monday_friday: v.monday_friday,
            saturday: v.saturday,
            sunday: v.sunday,
            lattitude: v.lattitude,
            longitude: v.longitude,
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
    url: 'api/v1/cms/ahass-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id: result.data.data.id,
        name: result.data.data.name,
        contact: result.data.data.contact,
        monday_friday: result.data.data.monday_friday,
        saturday: result.data.data.saturday,
        sunday: result.data.data.sunday,
        city_id: result.data.data.city ? result.data.data.city.id : '',
        city_name: result.data.data.city ? result.data.data.city.city_name : '',
        address: result.data.data.address,
        longitude: result.data.data.longitude,
        lattitude: result.data.data.lattitude,
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

  update = () => {
    this.setState({
      loading: true
    });

    let post_data = this.state.form_data;

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-rd',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data: post_data
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
      url: 'api/v1/cms/delete-rd-data',
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
                  // buttons={[
                  //   { type: 'upload', url: 'api/v1/cms/upload-rd', name: 'rd' }
                  // ]}
                  action={[
                    {
                      name: 'edit',
                      access: [1, 2],
                      onClick: (e) => {
                        this.setState({ loading: true })
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
                    }, {
                      name: 'view',
                      access: [3],
                      onClick: (e) => {
                        this.setState({ loading: true })
                        Promise.all([
                          this.get_detail(e.id)
                        ]).then(() => {
                          this.setState({
                            modal_detail: true,
                            loading: false
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
                  columns={[
                    {
                      Header: 'No',
                      accessor: 'no'
                    }, {
                      Header: 'Nama AHASS',
                      accessor: 'name'
                    }, {
                      Header: 'Alamat AHASS',
                      accessor: 'address'
                    }, {
                      Header: 'Kota / Kab',
                      accessor: 'city_name',
                      filterable: true
                    }, {
                      Header: 'Phone',
                      accessor: 'contact'
                    }, {
                      Header: 'Jam Buka Weekday',
                      accessor: 'monday_friday'
                    }, {
                      Header: 'Jam Buka Sabtu',
                      accessor: 'saturday'
                    }, {
                      Header: 'Jam Buka Minggu',
                      accessor: 'sunday'
                    }, {
                      Header: 'Lat',
                      accessor: 'lattitude'
                    }, {
                      Header: 'Long',
                      accessor: 'longitude'
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
              label: 'Nama AHASS',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.contact,
              name: 'contact',
              label: 'Phone',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.monday_friday,
              name: 'monday_friday',
              label: 'Jam Buka Weekday',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.saturday,
              name: 'saturday',
              label: 'Jam Buka Sabtu',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.sunday,
              name: 'sunday',
              label: 'Jam Buka Minggu',
              col: 6
            }, {
              type: 'selectsearch',
              value: this.state.form_data.city_id,
              name: 'city_id',
              label: 'Kota / Kab',
              col: 6,
              options: this.state.city_options
            }, {
              type: 'text',
              value: this.state.form_data.longitude,
              name: 'longitude',
              label: 'Longitude',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.lattitude,
              name: 'lattitude',
              label: 'Lattitude',
              col: 6
            }, {
              type: 'textarea',
              value: this.state.form_data.address,
              name: 'address',
              label: 'Alamat',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_edit: false
            })
          }}
        />

        <View
          title={'Detail'}
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.name,
              label: 'Nama AHASS',
              col: 6
            }, {
              value: this.state.form_data.contact,
              label: 'Phone',
              col: 6
            }, {
              value: this.state.form_data.monday_friday,
              label: 'Jam Buka Weekday',
              col: 6
            }, {
              value: this.state.form_data.saturday,
              label: 'Jam Buka Sabtu',
              col: 6
            }, {
              value: this.state.form_data.sunday,
              label: 'Jam Buka Minggu',
              col: 6
            }, {
              value: this.state.form_data.city_name,
              label: 'Kota / Kab',
              col: 6,
            }, {
              value: this.state.form_data.longitude,
              label: 'Longitude',
              col: 6
            }, {
              value: this.state.form_data.lattitude,
              label: 'Lattitude',
              col: 6
            }, {
              value: this.state.form_data.address,
              label: 'Alamat',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_detail: false
            })
          }}
        />
      </div>
    );
  }
}

export default Ahass;
