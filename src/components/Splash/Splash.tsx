import React, { useEffect } from "react";

import classes from "./Splash.module.css";

const Splash: React.FC = () => {
  useEffect(() => {
    if ("activeElement" in document) {
      (document.activeElement as HTMLElement).blur();
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.loading}>
        <div className={classes.loader} />
      </div>
    </div>
  );
};

export default Splash;
