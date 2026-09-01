// import logo from "@/assets/logo-light.svg";

import classes from "./Logo.module.scss";

const Logo = () => {
  return (
    <div className={classes.logoWrapper}>
      {/* <img src={logo} alt="zaro logo" className={classes.logo} /> */}
      <p className={classes.title}>ZARO</p>
    </div>
  );
};

export default Logo;
