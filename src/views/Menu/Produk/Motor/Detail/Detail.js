import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import axios from 'axios';

import moment from "moment";

import { toast } from 'react-toastify';

import CustomTable from '../../../../Components/CustomTable/CustomTable';
import View from '../../../../Components/CustomModal/View';

import CurrencyFormat from 'react-currency-format';

class Detail extends Component {
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
    });

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
            kategori: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.product_category ? v.product_variant.product_unit.product_category.name : '' : '' : '',
            unit_name: v.product_variant ? v.product_variant.product_unit ? v.product_variant.product_unit.unit_name : '' : '',
            variant_motor: v.product_variant ? v.product_variant.variant_name : '',
            warna: v.product_color ? v.product_color.color ? v.product_color.color.name : '' : '',
            maindealer: v.maindealer ? v.maindealer.name : '',
            city_name: v.city ? v.city.city_name : '',
            harga: <CurrencyFormat
              value={v.otr_price}
              thousandSeparator='.'
              decimalSeparator=','
              prefix={'Rp.'}
              suffix={',00'}
              displayType={'text'}
            />,
            tgl_peluncuran: v.tgl_peluncuran ? moment(v.tgl_peluncuran, 'DD-MM-YYYY').format('YYYY-MM-DD') : '-',
            is_import: v.is_import ? 'Impor' : 'Lokal',
            status: status[v.status],
            specification:
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
      const v = result.data.data;
      const status = [
        'Inactive',
        'Active'
      ];
      const form_data = {
        product_category: v.product_variant.product_unit.product_category.name,
        product_unit: v.product_variant.product_unit.unit_name,
        product_variant: v.product_variant.variant_name,
        product_color: v.product_color.color.name,
        maindealer: v.maindealer.name,
        city_name: v.city.city_name,
        otr_price: v.otr_price,
        released_date: v.product_variant ? v.product_variant.released_date ? moment(v.product_variant.released_date, 'DD-MM-YYYY').format('YYYY-MM-DD') : '-' : '-',
        is_import: v.product_variant.is_import ? 'Impor' : 'Lokal',
        status: status[v.status],
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
                      type: 'download',
                      url: 'api/v1/cms/download-product-all-detail',
                      name: 'Product Detail',
                      access: [1, 2]
                    }
                  ]}
                  action={[
                    {
                      name: 'view',
                      access: [1, 2, 3],
                      onClick: (e) => {
                        this.setState({ loading: true });
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
                  columns={
                    [
                      {
                        Header: 'No',
                        accessor: 'no'
                      }, {
                        Header: 'Kategori',
                        accessor: 'kategori'
                      }, {
                        Header: 'Model Motor',
                        accessor: 'unit_name',
                        filterable: true
                      }, {
                        Header: 'Variant Motor',
                        accessor: 'variant_motor'
                      }, {
                        Header: 'Warna',
                        accessor: 'warna'
                      }, {
                        Header: 'Maindealer',
                        accessor: 'maindealer'
                      }, {
                        Header: 'Kota/Kab',
                        accessor: 'city_name',
                        filterable: true
                      }, {
                        Header: 'Harga',
                        accessor: 'harga'
                      }, {
                        Header: 'Tanggal Peluncuran',
                        accessor: 'tgl_peluncuran'
                      }, {
                        Header: 'Spesifikasi',
                        accessor: 'specification'
                      }, {
                        Header: 'Produk Impor',
                        accessor: 'is_import'
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

        <View
          title='Detail'
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.product_category,
              label: 'Kategori',
              col: 6
            },
            {
              value: this.state.form_data.product_unit,
              label: 'Model Motor',
              col: 6
            },
            {
              value: this.state.form_data.product_variant,
              label: 'Varian Motor',
              col: 6
            },
            {
              value: this.state.form_data.product_color,
              label: 'Warna',
              col: 6
            },
            {
              value: this.state.form_data.maindealer,
              label: 'Maindealer',
              col: 6
            },
            {
              value: this.state.form_data.city_name,
              label: 'Kota/Kab',
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
              value: this.state.form_data.released_date,
              label: 'Tanggal Peluncuran',
              col: 6
            },
            {
              value: this.state.form_data.is_import,
              label: 'Produk Impor',
              col: 6
            },
            {
              value: this.state.form_data.status,
              label: 'Status',
              col: 6
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_detail: false
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

export default Detail;
