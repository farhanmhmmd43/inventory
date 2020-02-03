import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import CustomTable from '../../../../Components/CustomTable/CustomTable';
import Edit from '../../../../Components/CustomModal/Edit';
import View from '../../../../Components/CustomModal/View';

import axios from 'axios';

import { toast } from 'react-toastify';

class Teknologi extends Component {
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
      url: 'api/v1/cms/get-all-product-technology',
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
            model_motor: v.product_variant.product_unit.unit_name,
            name_tech: v.name_tech,
            fungsi:
              <button
                className="btn btn-link" onClick={() => {
                  this.setState({ loading: true })
                  Promise.all([
                    this.get_fungsi(v.id)
                  ]).then(() => {
                    this.setState({
                      modal_fungsi: true,
                      loading: false
                    })
                  })
                }}>
                Lihat Fungsi
            </button>,
            prosedur_pemakaian:
              <button
                className="btn btn-link" onClick={() => {
                  this.setState({ loading: true })
                  Promise.all([
                    this.get_prosedur(v.id)
                  ]).then(() => {
                    this.setState({
                      modal_prosedur: true,
                      loading: false
                    })
                  })
                }}>
                Cek Prosedur
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

  get_detail = (product_tech_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-detail-product-tech',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_tech_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_tech_id: result.data.data.id,
        name_tech: result.data.data.name_tech
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

  get_fungsi = (product_tech_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-product-tech-function',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_tech_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_tech_id,
        tech_function: result.data.data
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

  get_prosedur = (product_tech_id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-product-tech-procedure',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { product_tech_id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        product_tech_id,
        prosedur_pemakaian: result.data.data
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

  update = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-product-tech',
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

  update_fungsi = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-product-tech-function',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_fungsi: false
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

  update_prosedur = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-product-tech-procedure',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_prosedur: false
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
                      type: 'upload',
                      url: 'api/v1/cms/upload-product-tech',
                      name: 'tech',
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
                          this.get_detail(e.id),
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
                      Header: 'Model Motor',
                      accessor: 'model_motor'
                    }, {
                      Header: 'Nama Teknologi',
                      accessor: 'name_tech',
                      filterable: true
                    }, {
                      Header: 'Fungsi',
                      accessor: 'fungsi'
                    }, {
                      Header: 'Prosedur Pemakaian / Cara Kerja',
                      accessor: 'prosedur_pemakaian'
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
              value: this.state.form_data.product_tech_id,
              name: 'product_tech_id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.name_tech,
              name: 'name_tech',
              label: 'Nama Teknologi',
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
          title='Detail'
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.name_tech,
              label: 'Nama Teknologi',
              col: 12
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
          isOpen={this.state.modal_fungsi}
          onUpdate={this.update_fungsi}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.product_tech_id,
              name: 'product_tech_id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.tech_function,
              name: 'tech_function',
              label: 'Fungsi',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_fungsi: false
            })
          }}
        />

        <Edit
          loading={this.state.loading}
          isOpen={this.state.modal_prosedur}
          onUpdate={this.update_prosedur}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.product_tech_id,
              name: 'product_tech_id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.prosedur_pemakaian,
              name: 'prosedur_pemakaian',
              label: 'Note',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_prosedur: false
            })
          }}
        />
      </div>
    );
  }
}

export default Teknologi;
