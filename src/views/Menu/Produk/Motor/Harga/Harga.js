import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import axios from 'axios';

import { toast } from 'react-toastify';

import CustomTable from '../../../../Components/CustomTable/CustomTable';
import Edit from '../../../../Components/CustomModal/Edit';
import View from '../../../../Components/CustomModal/View';

import CurrencyFormat from 'react-currency-format';
import { Promise } from 'q';

class Harga extends Component {
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
      url: 'api/v1/cms/get-product-price-all',
      params,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      }
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        const status = [
          <span className="text-danger">Inactive</span>,
          <span className="text-success">Active</span>
        ];

        let listview_data = [];

        let no = parseInt(result.data.data.from);
        result.data.data.lists.map((v) => {
          listview_data.push({
            no,
            id: v.id,
            category_id: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.product_category ? v.product_variant.product_unit.product_category.id : '' : '' : '',
            category_name: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.product_category ? v.product_variant.product_unit.product_category.name : '' : '' : '',
            unit_id: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.id : '' : '',
            unit_name: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.unit_name : '' : '',
            variant_id: v.product_variant ? v.product_variant.id : '',
            variant_motor: v.product_variant ? v.product_variant.variant_name : '',
            color_name: v.product_color ? v.product_color.color ? v.product_color.color.name : '' : '',
            maindealer: v.maindealer ? v.maindealer.name : '',
            city_name: v.city ? v.city.city_name : '',
            otr_price: <CurrencyFormat
              value={v.otr_price}
              thousandSeparator='.'
              decimalSeparator=','
              prefix={'Rp.'}
              suffix={',00'}
              displayType={'text'}
            />,
            status: status[v.status]
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

  get_detail = (product_price_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-data-product-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_price_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_price_id: result.data.data.id,
        product_category_id: result.data.data.product_variant ? result.data.data.product_variant.product_unit ? result.data.data.product_variant.product_unit.product_category ? result.data.data.product_variant.product_unit.product_category.id : '' : '' : '',
        product_category_name: result.data.data.product_variant ? result.data.data.product_variant.product_unit ? result.data.data.product_variant.product_unit.product_category ? result.data.data.product_variant.product_unit.product_category.name : '' : '' : '',
        product_unit_id: result.data.data.product_variant ? result.data.data.product_variant.product_unit ? result.data.data.product_variant.product_unit.id : '' : '',
        product_unit_name: result.data.data.product_variant ? result.data.data.product_variant.product_unit ? result.data.data.product_variant.product_unit.unit_name : '' : '',
        product_variant_id: result.data.data.product_variant ? result.data.data.product_variant.id : '',
        product_variant_name: result.data.data.product_variant ? result.data.data.product_variant.variant_name : '',
        product_color_id: result.data.data.product_color ? result.data.data.product_color.color ? result.data.data.product_color.color.id : '' : '',
        product_color_name: result.data.data.product_color ? result.data.data.product_color.color ? result.data.data.product_color.color.name : '' : '',
        maindealer_id: result.data.data.maindealer ? result.data.data.maindealer.id : '',
        maindealer_name: result.data.data.maindealer ? result.data.data.maindealer.name : '',
        city_id: result.data.data.city ? result.data.data.city.id : '',
        city_name: result.data.data.city ? result.data.data.city.city_name : '',
        otr_price: result.data.data.otr_price,
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

  get_all_category = () => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-product-category',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let category_options = [{}];
      result.data.data.map((v) => {
        category_options.push({ name: v.name, value: v.id });
        return true;
      });

      this.setState({
        category_options,
        unit_options: [{}],
        variant_options: [{}],
        color_options: [{}]
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

  get_all_unit = (product_category_id) => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-product-unit',
    params: {
      product_category_id: product_category_id
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let unit_options = [{}];
      result.data.data.map((v) => {
        unit_options.push({ name: v.unit_name, value: v.id });
        return true;
      });

      let form_data = this.state.form_data;
      form_data.product_category_id = product_category_id

      this.setState({
        unit_options,
        form_data,
        variant_options: [{}],
        color_options: [{}]
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

  get_all_variant = (product_unit_id) => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-product-variant',
    params: {
      product_unit_id
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let variant_options = [{}];
      result.data.data.map((v) => {
        variant_options.push({ name: v.variant_name, value: v.id });
        return true;
      });

      let form_data = this.state.form_data;
      form_data.product_unit_id = product_unit_id

      this.setState({
        variant_options,
        form_data,
        color_options: [{}]
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

  get_all_color = (product_variant_id) => axios({
    method: 'GET',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-all-product-color',
    params: {
      product_variant_id
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      let color_options = [{}];
      result.data.data.map((v) => {
        color_options.push({ name: v.color.name, value: v.id });
        return true;
      });

      let form_data = this.state.form_data;
      form_data.product_variant_id = product_variant_id

      this.setState({
        color_options,
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
      url: 'api/v1/cms/update-product-price',
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
                      url: 'api/v1/cms/upload-product-price',
                      name: 'products',
                      access: [1, 2]
                    },
                    {
                      type: 'download',
                      url: 'api/v1/cms/download-product-all-detail',
                      name: 'Product Detail',
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
                          this.get_detail(e.id),
                          this.get_all_city(),
                          this.get_all_md(),
                          this.get_all_category()
                        ]).then(() => {
                          Promise.all([
                            this.get_all_unit(e.category_id),
                          ]).then(() => {
                            Promise.all([
                              this.get_all_variant(e.unit_id),
                            ]).then(() => {
                              Promise.all([
                                this.get_all_color(e.variant_id)
                              ]).then(() => {
                                this.setState({
                                  modal_edit: true,
                                  loading: false
                                })
                              })
                            })
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
                    }
                  ]}
                  // props from ReactTable
                  columns={[
                    {
                      Header: 'No',
                      accessor: 'no'
                    }, {
                      Header: 'Kategori',
                      accessor: 'category_name'
                    }, {
                      Header: 'Model Motor',
                      accessor: 'unit_name',
                      filterable: true
                    }, {
                      Header: 'Variant Motor',
                      accessor: 'variant_motor'
                    }, {
                      Header: 'Warna',
                      accessor: 'color_name'
                    }, {
                      Header: 'Maindealer',
                      accessor: 'maindealer'
                    }, {
                      Header: 'Kota/Kab',
                      accessor: 'city_name',
                      filterable: true
                    }, {
                      Header: 'Harga',
                      accessor: 'otr_price'
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
              value: this.state.form_data.product_price_id,
              name: 'product_price_id'
            },
            {
              type: 'selectsearch',
              value: this.state.form_data.product_category_id,
              name: 'product_category_id',
              label: 'Category',
              col: 6,
              options: this.state.category_options,
              onchange: (product_category_id) => this.get_all_unit(product_category_id)
            },
            {
              type: 'selectsearch',
              value: this.state.form_data.maindealer_id,
              name: 'maindealer_id',
              label: 'Maindealer',
              col: 6,
              options: this.state.md_options
            },
            {
              type: 'selectsearch',
              value: this.state.form_data.product_unit_id,
              name: 'product_unit_id',
              label: 'Model Motor',
              col: 6,
              options: this.state.unit_options,
              onchange: (product_unit_id) => this.get_all_variant(product_unit_id)
            },
            {
              type: 'currency',
              value: this.state.form_data.otr_price,
              name: 'otr_price',
              label: 'Harga',
              col: 6
            },
            {
              type: 'selectsearch',
              value: this.state.form_data.product_variant_id,
              name: 'kecamatan',
              label: 'Varian Motor',
              col: 6,
              options: this.state.variant_options,
              onchange: (product_variant_id) => this.get_all_color(product_variant_id)
            },
            {
              type: 'selectsearch',
              value: this.state.form_data.city_id,
              name: 'city_id',
              label: 'Kota / Kab',
              col: 6,
              options: this.state.city_options
            },
            {
              type: 'selectsearch',
              value: this.state.form_data.product_color_id,
              name: 'product_color_id',
              label: 'Warna',
              col: 6,
              options: this.state.color_options
            },
            {
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

        <View
          title='Detail'
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.product_category_name,
              label: 'Category',
              col: 6
            },
            {
              value: this.state.form_data.maindealer_name,
              label: 'Maindealer',
              col: 6
            },
            {
              value: this.state.form_data.product_unit_name,
              label: 'Model Motor',
              col: 6
            },
            {
              value: <CurrencyFormat
                value={this.state.form_data.otr_price}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'Rp.'}
                suffix={',00'}
                displayType={'text'}
              />,
              label: 'Harga',
              col: 6
            },
            {
              value: this.state.form_data.product_variant_name,
              label: 'Varian Motor',
              col: 6
            },
            {
              value: this.state.form_data.city_name,
              label: 'Kota / Kab',
              col: 6,
            },
            {
              value: this.state.form_data.product_color_name,
              label: 'Warna',
              col: 6,
            },
            {
              value: this.state.form_data.status,
              label: 'Status',
              col: 6,
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

export default Harga;
