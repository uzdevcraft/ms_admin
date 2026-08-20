import clsx from "clsx";
import classes from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={classes.root}>
      <svg className={classes.pl} viewBox="0 0 240 240">
        <circle
          className={clsx(classes.ring, classes.ringA)}
          cx="120"
          cy="120"
          r="105"
          fill="none"
          strokeWidth="20"
          strokeDasharray="0 660"
          strokeDashoffset="-330"
          strokeLinecap="round"
        />
        <circle
          className={clsx(classes.ring, classes.ringB)}
          cx="120"
          cy="120"
          r="35"
          fill="none"
          strokeWidth="20"
          strokeDasharray="0 220"
          strokeDashoffset="-110"
          strokeLinecap="round"
        />
        <circle
          className={clsx(classes.ring, classes.ringC)}
          cx="85"
          cy="120"
          r="70"
          fill="none"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        />
        <circle
          className={clsx(classes.ring, classes.ringD)}
          cx="155"
          cy="120"
          r="70"
          fill="none"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Loader;
