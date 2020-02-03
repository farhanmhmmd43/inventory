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

import CurrencyFormat from 'react-currency-format';

class Aksesoris extends Component {
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
      url: 'api/v1/cms/get-product-acc-all',
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
            unit_name: v.product_variant.product_unit.unit_name,
            variant_name: v.product_variant.variant_name,
            acc_code: v.acc_code,
            acc_name: v.acc_name,
            spesifikasi: <button
              className="btn btn-link" onClick={() => {
                this.setState({ loading: true });
                Promise.all([
                  this.get_spec(v.id)
                ]).then(() => {
                  this.setState({
                    modal_spec: true,
                    loading: false
                  })
                })
              }}>
              Cek Spesifikasi
              </button>,
            harga: <CurrencyFormat
              value={v.acc_price}
              thousandSeparator='.'
              decimalSeparator=','
              prefix={'Rp.'}
              suffix={',00'}
              displayType={'text'}
            />
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

  get_detail = (product_acc_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-product-acc-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_acc_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_acc_id: result.data.data.id,
        acc_code: result.data.data.acc_code,
        acc_name: result.data.data.acc_name,
        acc_price: result.data.data.acc_price,
        product_variant_name: result.data.data.product_variant ? result.data.data.product_variant.variant_name : '',
        product_unit_name: result.data.data.product_variant ? result.data.data.product_variant.product_unit ? result.data.data.product_variant.product_unit.unit_name : '' : '',
      }

      this.setState({
        loading: false,
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
      url: 'api/v1/cms/update-product-acc',
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

  get_spec = (product_acc_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-product-acc-spec',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_acc_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_acc_id,
        acc_spec: result.data.data
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

  update_spec = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-product-acc-spec',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_spec: false
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

  delete = (product_acc_id) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/delete-product-acc',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data: { product_acc_id }
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
                  buttons={[
                    {
                      type: 'upload',
                      url: 'api/v1/cms/upload-product-acc',
                      name: 'product_acc',
                      access: [1, 2]
                    }
                  ]}
                  action={[
                    {
                      name: 'edit',
                      access: [1, 2],
                      onClick: (e) => {
                        this.setState({ loading: true })
                        Promise.all([
                          this.get_detail(e.id)
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
                      Header: 'Model Motor',
                      accessor: 'unit_name'
                    }, {
                      Header: 'Varian Motor',
                      accessor: 'variant_name'
                    }, {
                      Header: 'Kode Aksesoris',
                      accessor: 'acc_code',
                      filterable: true
                    }, {
                      Header: 'Nama Aksesoris',
                      accessor: 'acc_name'
                    }, {
                      Header: 'Spesifikasi',
                      accessor: 'spesifikasi'
                    }, {
                      Header: 'Harga',
                      accessor: 'harga'
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
              value: this.state.form_data.product_acc_id,
              name: 'product_acc_id'
            },
            {
              type: 'readonly',
              value: this.state.form_data.product_unit_name,
              name: 'product_unit_name',
              label: 'Model Motor',
              col: 6
            },
            {
              type: 'readonly',
              value: this.state.form_data.product_variant_name,
              name: 'product_variant_name',
              label: 'Varian Motor',
              col: 6
            },
            {
              type: 'text',
              value: this.state.form_data.acc_name,
              name: 'acc_name',
              label: 'Nama Aksesoris',
              col: 12
            },
            {
              type: 'text',
              value: this.state.form_data.acc_code,
              name: 'acc_code',
              label: 'Kode Aksesoris',
              col: 6
            },
            {
              type: 'currency',
              value: this.state.form_data.acc_price,
              name: 'acc_price',
              label: 'Harga',
              col: 6
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_edit: false
            })
          }}
        />

        <View
          title='Detail'
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.product_unit_name,
              label: 'Model Motor',
              col: 6
            },
            {
              value: this.state.form_data.product_variant_name,
              label: 'Varian Motor',
              col: 6
            },
            {
              value: this.state.form_data.acc_name,
              label: 'Nama Aksesoris',
              col: 12
            },
            {
              value: this.state.form_data.acc_code,
              label: 'Kode Aksesoris',
              col: 6
            },
            {
              value: <CurrencyFormat
                value={this.state.form_data.acc_price}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'Rp.'}
                suffix={',00'}
                displayType={'text'}
              />,
              label: 'Harga',
              col: 6
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_detail: false
            })
          }}
        />

        <Edit
          loading={this.state.loading}
          isOpen={this.state.modal_spec}
          onUpdate={this.update_spec}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.product_acc_id,
              name: 'product_acc_id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.acc_spec,
              name: 'acc_spec',
              label: 'Spec',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_spec: false
            })
          }}
        />
      </div>
    );
  }
}

export default Aksesoris;
