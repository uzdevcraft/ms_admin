const parseAdminId = () => {
  const parsed = Number(import.meta.env.VITE_ADMIN_ID);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : NaN;
};

const config = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",

  auth: {
    adminId: parseAdminId(),
  },
  list: {
    perPage: 20,
  },
  support: {
    gmail: "xojiakbarisroilov1001@gmail.com",
  },
};

export default config;
