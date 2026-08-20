const parseAdminId = () => {
  const parsed = Number(import.meta.env.VITE_ADMIN_ID);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : NaN;
};

const config = {
  auth: {
    adminId: parseAdminId(),
  },
  list: {
    perPage: 20,
  },
};

export default config;
