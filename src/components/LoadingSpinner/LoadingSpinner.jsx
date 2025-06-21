import { CircularProgress } from "@mui/material";
import './loadingspinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <CircularProgress size={80}/>
    </div>
  );
};

export default LoadingSpinner;
