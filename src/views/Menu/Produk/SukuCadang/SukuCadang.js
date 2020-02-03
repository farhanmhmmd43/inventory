import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import CustomTable from '../../../Components/CustomTable/CustomTable';
import Edit from '../../../Components/CustomModal/Edit';
import View from '../../../Components/CustomModal/View';

import axios from 'axios';

import { toast } from 'react-toastify';

import CurrencyFormat from 'react-currency-format';

class SukuCadang extends Component {
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
      url: 'api/v1/cms/get-all-product-part',
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
            model_motor: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.unit_name : '' : '',
            varian_motor: v.product_variant ? v.product_variant.variant_name : '',
            part_code: v.part_code,
            nama_suku_cadang: v.part_name,
            bahasa_konsumen: v.part_bahasa,
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
              value={v.part_price}
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

  get_detail = (product_part_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-product-part-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_part_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_part_id: result.data.data.id,
        part_code: result.data.data.part_code,
        part_name: result.data.data.part_name,
        part_price: result.data.data.part_price,
        product_variant_name: result.data.data.product_variant ? result.data.data.product_variant.variant_name : '',
        product_unit_name: result.data.data.product_variant ? result.data.data.product_variant.product_unit ? result.data.data.product_variant.product_unit.unit_name : '' : '',
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
      url: 'api/v1/cms/update-product-part',
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

  get_spec = (product_part_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-product-part-spec',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_part_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_part_id,
        part_spec: result.data.data
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

  update_spec = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-product-part-spec',
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

  delete = (product_part_id) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/delete-product-part',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data: { product_part_id }
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
                      url: 'api/v1/cms/upload-product-part',
                      name: 'parts',
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
                            loading: false,
                            modal_edit: true
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
                            loading: false,
                            modal_detail: true
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
                    [
                      {
                        Header: 'No',
                        accessor: 'no'
                      }, {
                        Header: 'Model Motor',
                        accessor: 'model_motor'
                      }, {
                        Header: 'Varian Motor',
                        accessor: 'varian_motor'
                      }, {
                        Header: 'Kode Suku Cadang',
                        accessor: 'part_code',
                        filterable: true
                      }, {
                        Header: 'Nama Suku Cadang',
                        accessor: 'nama_suku_cadang'
                      }, {
                        Header: 'Bahasa Konsumen',
                        accessor: 'bahasa_konsumen'
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
              value: this.state.form_data.product_part_id,
              name: 'product_part_id'
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
              value: this.state.form_data.part_name,
              name: 'part_name',
              label: 'Nama Suku Cadang',
              col: 12
            },
            {
              type: 'text',
              value: this.state.form_data.part_code,
              name: 'part_code',
              label: 'Kode Suku Cadang',
              col: 6
            },
            {
              type: 'currency',
              value: this.state.form_data.part_price,
              name: 'part_price',
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
              value: this.state.form_data.part_name,
              label: 'Nama Suku Cadang',
              col: 12
            },
            {
              value: this.state.form_data.part_code,
              label: 'Kode Suku Cadang',
              col: 6
            },
            {
              value: <CurrencyFormat
                value={this.state.form_data.part_price}
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
              value: this.state.form_data.product_part_id,
              name: 'product_part_id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.part_spec,
              name: 'part_spec',
              label: 'Spesifikasi',
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

export default SukuCadang;
