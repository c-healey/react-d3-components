import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
const Header = () => {
  const [checked, setChecked] = useState(false);
  const mediaQuery = window.matchMedia("(min-width: 975px)");
  return (
    <div className="Header container">
      <nav role="navigation">
        <div id="menuToggle">
          {checked && (
            <input
              type="checkbox"
              checked
              onChange={() => setChecked(!checked)}
            />
          )}
          {!checked && (
            <input type="checkbox" onChange={() => setChecked(!checked)} />
          )}
          <span></span>
          <span></span>
          <span></span>
          <div
            id="menu"
            onClick={() => {
              if (!mediaQuery.matches) setChecked(!checked);
            }}
          >
            <Link to="/weather">
              <h4>WeatherDashboard</h4>
            </Link>{" "}
            <Link to="histogram">
              <h4>Histogram</h4>
            </Link>
            <Link to="humidity">
              <h4>Humidity</h4>
            </Link>
            <Link to="marginal">
              <h4>Marginal</h4>
            </Link>
            {/* <Link to="radar">
              <h4>Radar</h4>
            </Link> */}
            <Link to="scatter">
              <h4>ScatterPlot</h4>
            </Link>
            <Link to="lollipop">
              <h4>Horizontal</h4>
            </Link>
            <Link to="map">
              <h4>Map</h4>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Header;
