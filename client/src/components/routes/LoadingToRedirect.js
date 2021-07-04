import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  let history = useHistory();

  useEffect(() => {
    const redirectInterval = setInterval(() => {
      // Reduce the count value here
      setCount((currentCountValue) => --currentCountValue);
    }, 1000);

    // redirect
    count === 0 && history.push("/");

    //Clean up the interval
    return () => clearInterval(redirectInterval);
  }, [count, history]);

  return (
    <div className="container p-5 text-center">
      <p>Redirecting you in {count} seconds</p>
    </div>
  );
};

export default LoadingToRedirect;
