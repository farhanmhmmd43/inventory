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

class Event extends Component {
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
      url: 'api/v1/cms/get-all-event',
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
            event_name: v.event_name,
            alamat: v.address,
            deskripsi: <button
              className="btn btn-link" onClick={() => {
                this.setState({ loading: true });
                Promise.all([
                  this.get_desc(v.id)
                ]).then(() => {
                  this.setState({
                    modal_desc: true,
                    loading: false
                  })
                })
              }}>
              Lihat Deskripsi
            </button>,
            start_date: v.start_date,
            end_date: v.end_date,
            note: <button
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
              Lihat Note
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
    url: 'api/v1/cms/get-detail-event',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id: result.data.data.id,
        event_name: result.data.data.event_name,
        address: result.data.data.address,
        desc: result.data.data.desc,
        start_date: result.data.data.start_date,
        end_date: result.data.data.end_date
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

  get_note = (id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-note-event',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id,
        note: result.data.data
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

  update_note = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-note-event',
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

  get_desc = (id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/get-desc-event',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      const form_data = {
        id,
        desc: result.data.data
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

  update_desc = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-desc-event',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_desc: false
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
      url: 'api/v1/cms/delete-event-data',
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
                      url: 'api/v1/cms/upload-event',
                      name: 'event',
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
                      Header: 'Nama Event',
                      accessor: 'event_name',
                      filterable: true
                    }, {
                      Header: 'Alamat',
                      accessor: 'alamat'
                    }, {
                      Header: 'Deskripsi',
                      accessor: 'deskripsi'
                    }, {
                      Header: 'Start Date',
                      accessor: 'start_date'
                    }, {
                      Header: 'End Date',
                      accessor: 'end_date'
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
          isOpen={this.state.modal_desc}
          onUpdate={this.update_desc}
          inputs={[
            {
              type: 'hidden',
              value: this.state.form_data.id,
              name: 'id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.desc,
              name: 'desc',
              label: 'Desc',
              col: 12
            }
          ]}
          afterClose={() => {
            this.setState({
              modal_desc: false
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
              value: this.state.form_data.id,
              name: 'id'
            },
            {
              type: 'textarea',
              value: this.state.form_data.note,
              name: 'note',
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

        <View
          title='Detail'
          isOpen={this.state.modal_detail}
          inputs={[
            {
              value: this.state.form_data.event_name,
              label: 'Nama Event',
              col: 12
            },
            {
              value: this.state.form_data.address,
              label: 'Alamat',
              col: 12
            },
            {
              value: this.state.form_data.desc,
              label: 'Deskripsi',
              col: 12
            },
            {
              value: this.state.form_data.start_date,
              label: 'Start Date',
              col: 12
            },
            {
              value: this.state.form_data.end_date,
              label: 'End Date',
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

export default Event;
