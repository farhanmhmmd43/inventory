import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import CustomTable from '../../Components/CustomTable/CustomTable';
import Edit from '../../Components/CustomModal/Edit';
import Add from '../../Components/CustomModal/Add';

import axios from 'axios';

import { toast } from 'react-toastify';

class Pengguna extends Component {
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

  get_detail = (id) => axios({
    method: 'POST',
    baseURL: this.props.variables.api_url,
    url: 'api/v1/cms/user-detail',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.props.userData.access_token
    },
    data: { id }
  }).then((response) => {
    this.props.processResponse(response).then((result) => {
      this.setState({
        form_data: result.data.data
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
      url: 'api/v1/cms/delete-user',
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
        toast(error.response.data.message, {
          className: 'bg-danger text-white'
        })
      });
    })
  }

  update = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/update-user',
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

  insert = (data) => {
    this.setState({
      loading: true
    });

    axios({
      method: 'POST',
      baseURL: this.props.variables.api_url,
      url: 'api/v1/cms/register',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      },
      data
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        this.setState({
          loading: false,
          modal_add: false
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
      url: 'api/v1/cms/all-users',
      params,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.props.userData.access_token
      }
    }).then((response) => {
      this.props.processResponse(response).then((result) => {
        const role = {
          1: 'Admin',
          2: 'TL',
          3: 'Agent'
        }

        let listview_data = [];

        let no = parseInt(result.data.data.from);
        result.data.data.lists.map((v) => {
          listview_data.push({
            no,
            id: v.id,
            role: role[v.role],
            username: v.username,
            no_telp: v.no_telp,
            email: v.email,
            honda_id: v.honda_id,
            status: v.status ? <span>Active</span> : <span className="text-danger">Inactive</span>,
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
                      type: 'custom',
                      color: 'danger',
                      name: <span><i className="fas fa-plus"></i> Tambah</span>,
                      onClick: () => {
                        this.setState({
                          modal_add: true
                        })
                      },
                      access: [1]
                    },
                    {
                      type: 'upload',
                      url: 'api/v1/cms/upload-user',
                      name: 'users',
                      access: [1]
                    },
                  ]}
                  action={[
                    {
                      name: 'edit',
                      access: [1, 2],
                      onClick: (e) => {
                        this.setState({ loading: true });
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
                      name: 'delete',
                      access: [1, 2],
                      onClick: (e) => {
                        this.delete(e.id)
                      }
                    }
                  ]}
                  // props from ReactTable
                  columns={
                    [{
                      Header: 'No',
                      accessor: 'no'
                    }, {
                      Header: 'Role',
                      accessor: 'role'
                    }, {
                      Header: 'Username',
                      accessor: 'username'
                    }, {
                      Header: 'No Telepon',
                      accessor: 'no_telp'
                    }, {
                      Header: 'Email',
                      accessor: 'email'
                    }, {
                      Header: 'ID Honda',
                      accessor: 'honda_id',
                      className: 'text-center'
                    }, {
                      Header: 'Status',
                      accessor: 'status',
                      className: 'text-center'
                    }, {
                      Header: 'Aksi',
                      accessor: 'aksi'
                    }]
                  }
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

        <Add
          loading={this.state.loading}
          isOpen={this.state.modal_add}
          onUpdate={this.insert}
          inputs={[
            { type: 'text', name: 'username', label: 'Username', col: 6 },
            { type: 'text', name: 'password', label: 'Password', col: 6 },
            { type: 'select', name: 'role', label: 'Role', col: 6, options: [{ value: null, text: '-- Pilih --' }, { value: 1, text: 'Admin' }, { value: 2, text: 'TL' }, { value: 3, text: 'Agent' }] },
            { type: 'email', name: 'email', label: 'Email', col: 6 },
            { type: 'text', name: 'no_telp', label: 'No. Telepon', col: 6 },
            { type: 'text', name: 'honda_id', label: 'ID Honda', col: 6 }
          ]}
          afterClose={() => {
            this.setState({
              modal_add: false
            })
          }}
        />

        <Edit
          loading={this.state.loading}
          isOpen={this.state.modal_edit}
          onUpdate={this.update}
          inputs={[
            { type: 'hidden', value: this.state.form_data.id, name: 'id', label: 'ID', col: 6 },
            { type: 'select', value: this.state.form_data.role, name: 'role', label: 'Role', col: 6, options: [{ value: null, text: '-- Pilih --' }, { value: 1, text: 'Admin' }, { value: 2, text: 'TL' }, { value: 3, text: 'Agent' }] },
            { type: 'text', value: this.state.form_data.no_telp, name: 'no_telp', label: 'No. Telepon', col: 6 },
            { type: 'email', value: this.state.form_data.email, name: 'email', label: 'Email', col: 6 },
            { type: 'text', value: this.state.form_data.username, name: 'username', label: 'Username', col: 6 },
            { type: 'text', value: this.state.form_data.honda_id, name: 'honda_id', label: 'ID Honda', col: 6 },
            { type: 'select', value: this.state.form_data.status, name: 'status', label: 'Status', col: 6, options: [{ value: 1, text: 'Active' }, { value: 0, text: 'Inactive' }] }
          ]}
          afterClose={() => {
            this.setState({
              modal_edit: false
            })
          }}
        />
      </div>
    );
  }
}

export default Pengguna;
