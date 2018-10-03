import React, { Component } from "react";
// import PropTypes from "prop-types";
import axios from "axios";
import { firebaseConnect } from "react-redux-firebase";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import TrailView from "./TrailView";
import Button from "../layout/Button";

import styles from "../../styles/text.css";
// Executes call to TrailAPI and renders Trailview

class TrailRetriever extends Component {
  state = {
    trail: [],
    user: ""
  };
  static getDerivedStateFromProps(props, state) {
    const { auth } = props;
    const uid = auth.uid;
    return { uid: uid };
  }

  componentDidMount() {
    const { lat, lng } = this.props;

    axios
      .get(
        `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=100&maxResults=200&key=200339330-556c3c08bab51add2eafd094be79c93f`
      )
      .then(res => {
        console.log("res", res);

        if (res.data.trails.length === 0) {
          this.props.handler();
          return;
        }

        const random = Math.floor(Math.random() * 200);
        const trails = res.data.trails.map(el => {
          el.trailID = el.id;
          delete el.id;
          el.hikedStatus = false;
          el.uid = this.state.uid;
          return el;
        });

        this.setState(...this.state, { trail: trails[random] });
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  onClick = e => {
    const newTrail = this.state.trail;
    const { firestore, history } = this.props;

    firestore
      .add({ collection: "trailmarks" }, newTrail)
      .then(console.log("Saved!"));
  };

  render() {
    console.log(this.props);
    const { lat, lng } = this.props;
    return (
      <div>
        <TrailView trailDetails={this.state.trail}>
          <Button message="Save Trail" onClick={this.onClick} />
          <Button
            style={{
              color: "rgb(70, 130, 208)",
              backgroundColor: "rgba(161, 238, 252, 0.823)"
            }}
          >
            <a href="/mapview">Try Again</a>
          </Button>
        </TrailView>
      </div>
    );
  }
}
export default compose(
  firebaseConnect(),
  firestoreConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth
  }))
)(TrailRetriever);
