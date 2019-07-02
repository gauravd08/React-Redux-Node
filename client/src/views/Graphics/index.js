import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { httpDelete } from "utils/http";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  fetchGraphics,
  setPagination,
  setSearchFilter,
  setSort,
  setSortOrder
} from "modules/Graphics/actions";
import {
  getGraphics,
  isFetching,
  getPagination,
  getSort,
  getSortOrder,
  getSearchFilter
} from "modules/Graphics/selectors";
import { func, arrayOf, shape, bool, string } from "prop-types";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Spinner,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  FormGroup
} from "reactstrap";
import { DELETE_GRAPHIC } from "config/endpoints";
const WAIT_INTERVAL = 1000;

class Graphic extends React.Component {
  state = {
    modal: false,
    selectedId: ""
  };

  timer = null;

  /**
   * during rendering component
   */
  componentDidMount() {
    setTimeout(() => this.props.fetchGraphics(), 200);
  }

  /**
   * during leaving component
   */
  componentWillUnmount() {
    clearTimeout(this.typingTimer);
    this.props.setPagination({});
    this.props.setSearchFilter("");
    this.props.setSort("");
    this.props.setSortOrder("");
  }

  /**
   * redirects to form
   */
  handleAddGraphic = () => {
    this.props.history.push("/admin/graphic/add");
  };

  /**
   * delete the graphic
   */
  confirmDelete = () => {
    const { selectedId } = this.state;

    let url = DELETE_GRAPHIC;
    url += `/${selectedId}`;

    httpDelete(url, { headers: { token: localStorage.getItem("token") } }).then(
      res => {
        this.setState({ modal: false, selectedId: "" });
        this.props.fetchGraphics();
      },
      err => {}
    );
  };

  /**
   * handle edit
   */
  editGraphic = () => {
    this.props.history.push("/admin/graphic/edit/" + this.state.selectedId);
  };

  /**
   * Pagination previous action
   */
  previousPage = () => {
    const {
      pagination: { offset, current, limit, total }
    } = this.props;
    const new_offset = offset - limit;

    this.props.setPagination({
      offset: new_offset,
      current: current - 1,
      limit: limit,
      total: total
    });

    setTimeout(() => this.props.fetchGraphics(), 200);
  };

  /**
   * Pagination next action
   */
  nextPage = () => {
    const {
      pagination: { offset, current, limit, total }
    } = this.props;
    const new_offset = offset + limit;

    this.props.setPagination({
      offset: new_offset,
      current: current + 1,
      limit: limit,
      total: total
    });

    setTimeout(() => this.props.fetchGraphics(), 200);
  };

  /**
   * search
   */
  handleSearch = e => {
    this.props.setSearchFilter(e.target.value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.props.fetchGraphics(), WAIT_INTERVAL);
  };

  /**
   * handle sorting
   */
  handleSort = field => {
    const { sort_order } = this.props;

    if (sort_order === "DESC") {
      this.props.setSort(field);
      this.props.setSortOrder("ASC");
    } else {
      this.props.setSort(field);
      this.props.setSortOrder("DESC");
    }

    this.props.fetchGraphics();
  };

  /**
   * render the summary
   */
  render() {
    const { graphics, is_fetching, pagination, search } = this.props;
    //Show loader when data is fetching
    if (is_fetching) {
      return (
        <div>
          <Spinner color="secondary" />
        </div>
      );
    }

    return (
      <>
        <div className="content">
          {/* Modal starts here */}
          <Modal isOpen={this.state.modal}>
            <ModalHeader toggle={this.toggle}>Confirmation</ModalHeader>
            <ModalBody>Are you sure to delete this record ?</ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.confirmDelete}>
                Yes
              </Button>{" "}
              <Button
                color="secondary"
                onClick={() => this.setState({ modal: false })}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          {/* Modal ends here */}

          {/* Add New Graphic */}
          <Button color="primary" onClick={this.handleAddGraphic}>
            Add Graphic
          </Button>

          {/* show the content when fetching has completed */}
          {!is_fetching && (
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Graphics Summary</CardTitle>
                  </CardHeader>
                  <CardHeader>
                    <Col md={4}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="search"
                          onChange={this.handleSearch}
                          placeholder="search by name"
                          value={search}
                        />
                      </FormGroup>
                    </Col>
                  </CardHeader>

                  <CardBody>
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th
                            style={{ cursor: "pointer" }}
                            onClick={() => this.handleSort("id")}
                          >
                            #<i className="fa fa-fw fa-sort" />
                          </th>
                          <th>Type</th>
                          <th>Name</th>
                          <th>Caption</th>
                          <th>Link</th>
                          <th>Link Text</th>
                          <th>Status</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {graphics.map(graphic => (
                          <tr key={graphic.id}>
                            <td>{graphic.id}</td>
                            <td>{graphic.type}</td>
                            <td>{graphic.name}</td>
                            <td>{graphic.caption}</td>
                            <td>{graphic.link}</td>
                            <td>{graphic.link_text}</td>
                            <td>{graphic.is_active}</td>
                            <td className="text-right">
                              <Button
                                color="info"
                                onClick={() =>
                                  this.setState(
                                    { selectedId: graphic.id },
                                    this.editGraphic
                                  )
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                color="danger"
                                onClick={() =>
                                  this.setState({
                                    modal: true,
                                    selectedId: graphic.id
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* Pagination starts here */}
                    <Pagination aria-label="Page navigation example">
                      <PaginationItem disabled={!pagination.offset}>
                        <PaginationLink onClick={this.previousPage}>
                          Prev
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem
                        disabled={pagination.current === pagination.total}
                      >
                        <PaginationLink onClick={this.nextPage}>
                          Next
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                    {/* Pagination ends here */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </>
    );
  }
}

/**
 * Define component props
 */
Graphic.propTypes = {
  fetchGraphics: func.isRequired,
  graphics: arrayOf(shape({})).isRequired,
  is_fetching: bool.isRequired,
  setPagination: func.isRequired,
  setSearchFilter: func.isRequired,
  setSort: func.isRequired,
  setSortOrder: func.isRequired,
  sort: string.isRequired,
  sort_order: string.isRequired,
  search: string.isRequired
};

/**
 * Map redux state to component props
 */
const mapStateToProps = createStructuredSelector({
  graphics: getGraphics(),
  is_fetching: isFetching(),
  pagination: getPagination(),
  sort: getSort(),
  sort_order: getSortOrder(),
  search: getSearchFilter()
});

/**
 * Export the component
 */
export default connect(
  mapStateToProps,
  {
    fetchGraphics,
    setPagination,
    setSearchFilter,
    setSort,
    setSortOrder
  }
)(Graphic);
