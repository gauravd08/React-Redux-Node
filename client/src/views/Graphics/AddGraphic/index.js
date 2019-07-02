import React from "react";

import {
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  FormFeedback,
  Alert
} from "reactstrap";
import { GraphicTypes } from "config/static-arrays";
import { httpGet, httpPost, httpPut } from "utils/http";
import { ADD_GRAPHIC, GET_GRAPHIC, UPDATE_GRAPHIC } from "config/endpoints";

class AddGraphic extends React.Component {
  /**
   * local state
   */
  state = {
    /**
     * model objects
     */
    type: "",
    name: "",
    caption: "",
    link: "",
    link_text: "",
    image: "",
    is_active: "",

    /**
     *other
     */
    alert: false,
    is_submit: false,
    show_image: ""
  };

  /**
   * before rendering the component
   */
  componentWillMount() {
    const { match } = this.props;
    const id = match.params.id;
    if (id && this.fetchGraphic(id));
  }

  /***
   * scroll to errros
   */
  scrollTo = class_name => {
    const el = document.querySelector(class_name);

    if (!el) return false;

    const options = {
      behavior: "smooth",
      block: "center",
      inline: "center"
    };

    el.parentElement.scrollIntoView(options);

    return true;
  };

  /**
   * handle form validations
   */
  getValidationErrors() {
    const {
      is_submit,
      type,
      name,
      caption,
      link,
      link_text,
      image
    } = this.state;

    const e_type = is_submit && !type ? "Type is required" : null;
    const e_name = is_submit && !name ? "Name is required" : null;
    const e_caption = is_submit && !caption ? "Caption is required" : null;
    const e_link = is_submit && !link ? "Link is required" : null;
    const e_link_text =
      is_submit && !link_text ? "Link text is required" : null;
    const e_image = is_submit && !image ? "Image is required" : null;

    return {
      e_type,
      e_name,
      e_caption,
      e_link,
      e_link_text,
      e_image
    };
  }

  /**
   * save data to database
   */
  saveData() {
    const url = ADD_GRAPHIC;
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("image", this.state.image);
    data.append("type", this.state.type);
    data.append("name", this.state.name);
    data.append("caption", this.state.caption);
    data.append("link", this.state.link);
    data.append("link_text", this.state.link_text);
    data.append("is_active", this.state.is_active);

    httpPost(url, data, {
      headers: { token, "content-type": "multipart/form-data" }
    }).then(
      res => {
        if (res.status === 1 && this.setState({ alert: true }));
      },
      err => {}
    );
  }

  /**
   * form submit
   */
  handleSubmit = e => {
    e.preventDefault();
    const {
      match: { params }
    } = this.props;

    this.setState({ is_submit: true });

    setTimeout(() => {
      if (this.scrollTo(".is-invalid")) return;

      if (typeof params.id === "undefined") {
        this.saveData();
      } else {
        this.updateGraphic();
      }
    }, 100);
  };

  /**
   * Fetch Graphic
   */
  fetchGraphic = id => {
    let url = GET_GRAPHIC;
    url += `/${id}`;

    const token = localStorage.getItem("token");

    httpGet(url, { headers: { token } }).then(
      res => {
        const graphic = res;
        this.setState({
          type: graphic.type,
          name: graphic.name,
          caption: graphic.caption,
          link: graphic.link,
          link_text: graphic.link_text,
          is_active: graphic.is_active
          // image: graphic.image
        });
      },
      err => {}
    );
  };

  /**
   * update graphic
   */
  updateGraphic = () => {
    const { match } = this.props;
    const id = match.params.id;

    let url = UPDATE_GRAPHIC;
    url += `/${id}`;

    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("image", this.state.image);
    data.append("type", this.state.type);
    data.append("name", this.state.name);
    data.append("caption", this.state.caption);
    data.append("link", this.state.link);
    data.append("link_text", this.state.link_text);
    data.append("is_active", this.state.is_active);

    httpPut(url, data, {
      headers: { token, "content-type": "multipart/form-data" }
    }).then(
      res => {
        if (res.status === 1 && this.setState({ alert: true }));
      },
      err => {}
    );
  };

  /**
   * Render form
   */
  render() {
    const {
      alert,
      type,
      name,
      caption,
      link,
      link_text,
      is_active,
      show_image
    } = this.state;
    const {
      e_type,
      e_name,
      e_caption,
      e_link,
      e_link_text,
      e_image
    } = this.getValidationErrors();

    return (
      <div className="content">
        {alert && <Alert color="primary">Graphic added successfully!</Alert>}

        <Row>
          <Col md="12">
            <Form onSubmit={this.handleSubmit}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>Type</Label>
                    <Input
                      type="select"
                      name="type"
                      value={type}
                      onChange={e => this.setState({ type: e.target.value })}
                      empty="Please select"
                      invalid={e_type ? true : false}
                    >
                      {GraphicTypes.map(staticarray => (
                        <option key={staticarray.key} value={staticarray.key}>
                          {staticarray.name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{e_type}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Enter Name"
                      onChange={e => this.setState({ name: e.target.value })}
                      invalid={e_name ? true : false}
                    />
                    <FormFeedback>{e_name}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Caption</Label>
                <Input
                  type="text"
                  name="caption"
                  value={caption}
                  placeholder="Enter caption"
                  onChange={e => this.setState({ caption: e.target.value })}
                  invalid={e_caption ? true : false}
                />
                <FormFeedback>{e_caption}</FormFeedback>
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>Link</Label>
                    <Input
                      type="text"
                      name="link"
                      value={link}
                      placeholder="Enter link"
                      onChange={e => this.setState({ link: e.target.value })}
                      invalid={e_link ? true : false}
                    />
                    <FormFeedback>{e_link}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Link Text</Label>
                    <Input
                      type="text"
                      name="link_text"
                      value={link_text}
                      placeholder="Enter link text"
                      onChange={e =>
                        this.setState({ link_text: e.target.value })
                      }
                      invalid={e_link_text ? true : false}
                    />
                    <FormFeedback>{e_link_text}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Attach File</Label>
                <Input
                  type="file"
                  name="image"
                  style={{ opacity: 1 }}
                  onChange={e =>
                    this.setState({
                      image: e.target.files[0],
                      show_image: URL.createObjectURL(e.target.files[0])
                    })
                  }
                  invalid={e_image ? true : false}
                />
                <FormText color="muted">Image should be XX * XX.</FormText>
                <FormFeedback>{e_image}</FormFeedback>
                <img
                  style={{ width: "30%" }}
                  alt=""
                  id="target"
                  src={show_image}
                />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_active"
                    value={is_active}
                    style={{ visibility: "visible", opacity: 1 }}
                    onChange={e => this.setState({ is_active: e.target.value })}
                  />
                  Status
                </Label>
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddGraphic;
