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

import CustomTable from '../../../../Components/CustomTable/CustomTable';
import Edit from '../../../../Components/CustomModal/Edit';
import View from '../../../../Components/CustomModal/View';

class Spesifikasi extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      listview_data: [],
      pages: -1,
      limit: 10,
      form_data: {},
      list_spec: []
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
      url: 'api/v1/cms/get-all-product-variant?',
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
            unit_name: v.product_unit.unit_name,
            variant_motor: v.variant_name,
            tanggal_peluncuran: v.released_date ? moment(v.released_date, 'DD-MM-YYYY').format('YYYY-MM-DD') : '-',
            spesifikasi:
              <button
                className="btn btn-link"
                onClick={() => {
                  this.setState({ loading: true });
                  Promise.all([
                    this.get_specification(v.id)
                  ]).then(() => {
                    this.setState({
                      loading: false,
                      modal_spec: true
                    })
                  })
                }}
              >
                Cek Spesifikasi
              </button>,
            produk_impor: v.is_import ? 'Impor' : 'Lokal'
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

  get_specification = (product_price_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-spec-on-product-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_price_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      this.setState({
        list_spec: result.data.data,
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

  get_detail = (product_variant_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-spec-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_variant_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_variant_id: result.data.data[0].product_variant.id,
        released_date: moment(result.data.data[0].product_variant.released_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        is_import: result.data.data[0].product_variant.is_import
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
      url: 'api/v1/cms/update-product-variant',
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
    let spec_inputs = [];

    this.state.list_spec.map((v) => {
      spec_inputs.push({
        value: v.description,
        label: v.spesification.name
      });
      return true;
    })

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
                      url: 'api/v1/cms/upload-product-spec',
                      name: 'specs',
                      access: [1, 2]
                    },
                    {
                      type: 'download',
                      url: 'api/v1/cms/download-product-spesification',
                      name: 'Spesification',
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
                        ]).then(() => {
                          this.setState({
                            loading: false,
                            modal: true
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
                      Header: 'Model Motor',
                      accessor: 'unit_name',
                      filterable: true
                    }, {
                      Header: 'Variant Motor',
                      accessor: 'variant_motor'
                    }, {
                      Header: 'Tanggal Peluncuran',
                      accessor: 'tanggal_peluncuran'
                    }, {
                      Header: 'Spesifikasi',
                      accessor: 'spesifikasi'
                    }, {
                      Header: 'Produk Impor',
                      accessor: 'produk_impor'
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
          isOpen={this.state.modal}
          onUpdate={this.update}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.product_variant_id,
              name: 'product_variant_id',
              label: 'ID',
              col: 12
            }, {
              type: 'datepicker',
              value: this.state.form_data.released_date,
              name: 'released_date',
              label: 'Tanggal Peluncuran',
              col: 12
            }, {
              type: 'checkbox',
              value: this.state.form_data.is_import,
              name: 'is_import',
              label: 'Produk Impor',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal: false
            })
          }}
        />

        <View
          title='Spesifikasi'
          isOpen={this.state.modal_spec}
          inputs={spec_inputs}
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

export default Spesifikasi;
