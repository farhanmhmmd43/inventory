import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import axios from 'axios';

import { toast } from 'react-toastify';

import CustomTable from '../../Components/CustomTable/CustomTable';
import Edit from '../../Components/CustomModal/Edit';
import View from '../../Components/CustomModal/View';

class SolutionCenter extends Component {
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
      url: 'api/v1/cms/get-all-solutioncenter',
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
            sepeda_motor: v.product_variant_id ? v.product_variant_id.variant_name : '',
            problem_name: v.problem_name,
            komponen: v.category,
            analisa: <button
              className="btn btn-link" onClick={() => {
                this.setState({ loading: true });
                Promise.all([
                  this.get_analisa(v.id)
                ]).then(() => {
                  this.setState({
                    modal_analisa: true,
                    loading: false
                  })
                })
              }}>
              Lihat Analisa
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
    url: 'api/v1/cms/get-detail-solutioncenter',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id: result.data.data.id,
        problem_name: result.data.data.problem_name,
        description: result.data.data.description,
        description_detail: result.data.data.description_detail,
        act_solve: result.data.data.act_solve,
        category: result.data.data.category,
        product_variant: result.data.data.product_variant_id ? result.data.data.product_variant_id.variant_name : ''
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

  get_analisa = (id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-analisa-solutioncenter',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id,
        problem_name: result.data.data['problem name'],
        act_solve: result.data.data['problem solve']
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

  update_analisa = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-analisa-solutioncenter',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_analisa: false
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

  delete = (id) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/delete-sc-data',
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
                  buttons={[
                    {
                      type: 'upload',
                      url: 'api/v1/cms/upload-solutioncenter',
                      name: 'solutioncenter',
                      access: [1, 2]
                    }
                  ]}
                  action={[
                    {
                      name: 'view',
                      access: [1, 2, 3],
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
                  columns={[
                    {
                      Header: 'No',
                      accessor: 'no'
                    }, {
                      Header: 'ID',
                      accessor: 'id'
                    }, {
                      Header: 'Sepeda Motor',
                      accessor: 'sepeda_motor'
                    }, {
                      Header: 'Permasalahan',
                      accessor: 'problem_name',
                      filterable: true
                    }, {
                      Header: 'Komponen',
                      accessor: 'komponen'
                    }, {
                      Header: 'Analisa',
                      accessor: 'analisa'
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
          isOpen={this.state.modal_analisa}
          onUpdate={this.update_analisa}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.id,
              name: 'id'
            },
            {
              type: 'text',
              value: this.state.form_data.problem_name,
              name: 'problem_name',
              label: 'Permasalahan',
              col: 12
            },
            {
              type: 'textarea',
              value: this.state.form_data.act_solve,
              name: 'act_solve',
              label: 'Act Solve',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_analisa: false
            })
          }}
        />

        <View
          title='Detail'
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.problem_name,
              label: 'Permasalahan',
              col: 12
            },
            {
              value: this.state.form_data.description,
              label: 'Deskripsi',
              col: 12
            },
            {
              value: this.state.form_data.description_detail,
              label: 'Deskripsi Detail',
              col: 12
            },
            {
              value: this.state.form_data.act_solve,
              label: 'Act Solve',
              col: 12
            },
            {
              value: this.state.form_data.category,
              label: 'Komponen',
              col: 12
            },
            {
              value: this.state.form_data.product_variant,
              label: 'Sepeda Motor',
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

export default SolutionCenter;
