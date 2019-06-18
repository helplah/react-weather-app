import React from "react";
import "./App.css";
import isEmpty from "lodash.isempty";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";

const Weather = ({ match, forecast }) => {
  const weatherId = Number(match.params.weatherId);
  const weather = forecast.find(w => w.id === weatherId);

  return (
    <React.Fragment>
      <h1>Today's Weather</h1>
      <h2>{weather.weather_state_name}</h2>
    </React.Fragment>
  );
};

Weather.propTypes = {
  forecast: PropTypes.array.isRequired
};

const NavBar = ({ forecast }) => {
  return (
    <nav>
      {forecast.map(w => {
        return (
          <li key={w.id}>
            <Link to={`/weather/${w.id}`}>{w.applicable_date}</Link>
          </li>
        );
      })}
    </nav>
  );
};

NavBar.propTypes = {
  forecast: PropTypes.array.isRequired
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forecast: []
    };
  }

  componentDidMount() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const api = "https://www.metaweather.com/api/location/1062617/";
    const url = proxy + api;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          forecast: data.consolidated_weather
        });
      });
  }

  render() {
    return (
      <Router>
        <div>
          <NavBar forecast={this.state.forecast} />
          {!isEmpty(this.state.forecast) && (
            <main>
              <Route
                path="/weather/:weatherId"
                render={props => {
                  return <Weather forecast={this.state.forecast} {...props} />;
                }}
              />
            </main>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
