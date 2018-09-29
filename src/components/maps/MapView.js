import React, { Component } from "react";
import MyFancyComponent from "./Map";
import styles from "../../styles/map.css";

class MapView extends Component {
  constructor(props) {
    super(props);
    // Default lat/lng set in component
    this.state = {
      currentLatLng: {
        lat: 0,
        lng: 0
      },
      isMarkerShown: false,
      showMap: false
    };
  }

  // Combine with welcome? On Click handler that will toggle state and replace full page
  // div with button with the map component--conditional rendering.

  componentDidMount() {
    this.getGeoLocation();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isMarkerShown !== nextState.isMarkerShown) return true;
    return false;
  }

  showMapHandler = () => {
    this.setState({ showMap: true });
  };

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // console.log(position.coords)
        this.setState(prevState => ({
          isMarkerShown: true,
          currentLatLng: {
            ...prevState.currentLatLng,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
      });
    } else {
      error => console.log(error);
    }
  };

  render() {
    const { showMap } = this.state;
    //set map component.
    const map = this.state.isMarkerShown ? (
      <div>
        <MyFancyComponent currentLocation={this.state.currentLatLng} />
      </div>
    ) : (
      false
    );

    return (
      <div className={styles.mapclick}>
        {showMap ? (
          map
        ) : (
          <div className={styles.mapclick}>
            <div className="helo">Hi, I'm a div</div>
            <button onClick={this.showMapHandler}>Click me</button>
          </div>
        )}
      </div>
    );
  }
}
export default MapView;
