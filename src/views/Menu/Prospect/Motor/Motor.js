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

class Motor extends Component {
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
    })

    state.filtered.map((filter) => {
      params[filter.id] = filter.value
      return true
    })

    axios({
      method: 'GET',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/get-all-prospect-product',
      params,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      }
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        const status = [
          <span className="text-danger">Nonprospect</span>,
          <span className="text-success">Prospect</span>
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
            motor: v.product_variant ? v.product_variant.variant_name : '',
            maindealer: v.maindealer ? v.maindealer.name : '',
            konfirmasi_motor: v.product_variant_confirm ? v.product_variant_confirm.variant_name : '',
            tanggal: v.created_at,
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
    url: 'api/v1/cms/get-prospect-product-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        prospect_id: result.data.data.id,
        phone_number: result.data.data.phone_number,
        kecamatan: result.data.data.kecamatan,
        md_id: result.data.data.maindealer ? result.data.data.maindealer.id : '',
        date: moment(result.data.data.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        name: result.data.data.name,
        city_id: result.data.data.city ? result.data.data.city.id : '',
        product_variant_id: result.data.data.product_variant ? result.data.data.product_variant.id : '',
        product_variant_id_confirm: result.data.data.product_variant_confirm ? result.data.data.product_variant_confirm.id : '',
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
      url: 'api/v1/cms/update-prospect-product',
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

  get_note = (prospect_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-prospect-product-notes',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { prospect_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        prospect_id,
        notes: result.data.data
      }

      this.setState({
        form_data
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

  update_note = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-prospect-product-notes',
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

  get_all_md = () => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-md',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let md_options = [{}];
      result.data.data.map((v) => {
        md_options.push({ name: v.name, value: v.id });
        return true;
      });

      this.setState({
        md_options
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

  get_all_product = () => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-product-variant',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let product_options = [{}];
      result.data.data.map((v) => {
        product_options.push({ name: v.variant_name, value: v.id });
        return true;
      });

      this.setState({
        product_options
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
                      url: 'api/v1/cms/download-prospect-product',
                      name: 'Prospect Motor',
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
                          this.get_all_city(),
                          this.get_all_md(),
                          this.get_all_product()
                        ]).then(() => {
                          this.setState({
                            loading: false,
                            modal_edit: true
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
                      Header: 'Motor',
                      accessor: 'motor'
                    }, {
                      Header: 'Maindealer',
                      accessor: 'maindealer'
                    }, {
                      Header: 'Konfirmasi Motor',
                      accessor: 'konfirmasi_motor'
                    }, {
                      Header: 'Tanggal',
                      accessor: 'tanggal'
                    }, {
                      Header: 'Status',
                      accessor: 'status'
                    }, {
                      Header: 'Note',
                      accessor: 'note'
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
              value: this.state.form_data.prospect_id,
              name: 'prospect_id',
              label: 'ID',
              col: 6
            }, {
              type: 'text',
              value: this.state.form_data.name,
              name: 'name',
              label: 'Nama Customer',
              col: 6
            }, {
              type: 'selectsearch',
              value: this.state.form_data.product_variant_id,
              name: 'product_variant_id',
              label: 'Motor',
              col: 6,
              options: this.state.product_options
            }, {
              type: 'text',
              value: this.state.form_data.phone_number,
              name: 'phone_number',
              label: 'No. Telepon',
              col: 6
            }, {
              type: 'selectsearch',
              value: this.state.form_data.product_variant_id_confirm,
              name: 'product_variant_id_confirm',
              label: 'Konfirmasi Motor',
              col: 6,
              options: this.state.product_options
            }, {
              type: 'selectsearch',
              value: this.state.form_data.city_id,
              name: 'city_id',
              label: 'Kota',
              col: 6,
              options: this.state.city_options
            }, {
              type: 'selectsearch',
              value: this.state.form_data.md_id,
              name: 'md_id',
              label: 'Maindealer',
              col: 6,
              options: this.state.md_options
            }, {
              type: 'text',
              value: this.state.form_data.kecamatan,
              name: 'kecamatan',
              label: 'Kecamatan',
              col: 6
            }, {
              type: 'datepicker',
              value: this.state.form_data.date,
              name: 'date',
              label: 'Tanggal',
              col: 6
            }, {
              type: 'select',
              value: this.state.form_data.status,
              name: 'status',
              label: 'Status',
              col: 6,
              options: [{ value: 1, text: 'Active' }, { value: 0, text: 'Inactive' }]
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_edit: false
            })
          }}
        />

        <Edit
          loading={this.state.loading}
          isOpen={this.state.modal_note}
          onUpdate={this.update_note}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.prospect_id,
              name: 'prospect_id'
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

export default Motor;
