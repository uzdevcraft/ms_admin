// import logo from "@/assets/logo-light.svg";

import { Link } from 'react-router-dom';

import { APP_NAME } from '@/locale/uz';

import classes from './Logo.module.scss';

const Logo = () => {
  return (
    <Link to="/" className={classes.logoWrapper} aria-label={APP_NAME}>
      {/* <img src={logo} alt="zaro logo" className={classes.logo} /> */}
      <span className={classes.title}>{APP_NAME}</span>
    </Link>
  );
};

export default Logo;
