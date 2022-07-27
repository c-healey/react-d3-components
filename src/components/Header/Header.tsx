import { Link } from "react-router-dom";
import "./Header.css";
const Header = () => {
  return (
    <div className="Header">
      <nav>
        <Link to="/weather">
          <h4>WeatherDashboard</h4>
        </Link>{" "}
        <Link to="histogram">
          <h4>Histogram</h4>
        </Link>
        <Link to="humidity">
          <h4>Humidity</h4>
        </Link>
        <Link to="scatter">
          <h4>ScatterPlot</h4>
        </Link>
        <Link to="lollipop">
          <h4>Horizontal</h4>
        </Link>
        <Link to="map">
          <h4>Map</h4>
        </Link>
        <Link to="marginal">
          <h4>Marginal</h4>
        </Link>
      </nav>
    </div>
  );
};
export default Header;
