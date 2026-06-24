import {
  IconCategory,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconPackage,
  IconShoppingCart,
  IconUser,
  // IconUsers,
} from "@tabler/icons-react";
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Divider,
  Group,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import clsx from "clsx";
import type { TablerIcon } from "@tabler/icons-react";
import {
  NavLink as RouterNavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { SUPPORT_ADMIN_USERNAME } from "../../config/supportAdmin";
import styles from "./AppLayout.module.css";

const NAVBAR_WIDTH = 260;
const NAVBAR_WIDTH_COLLAPSED = 72;
const HEADER_HEIGHT = 64;

interface NavItem {
  to: string;
  label: string;
  icon: TablerIcon;
}

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
}

function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  const { to, label, icon: Icon } = item;

  const link = (
    <RouterNavLink
      to={to}
      end={to === "/"}
      aria-label={label}
      className={({ isActive }) =>
        clsx(styles.navLink, isActive && styles.navLinkActive)
      }
    >
      <span className={styles.navLinkIcon}>
        <Icon size={18} stroke={1.75} />
      </span>
      <span className={styles.navLinkLabel}>{label}</span>
    </RouterNavLink>
  );

  if (collapsed) {
    return <div className={styles.navLinkCollapsed}>{link}</div>;
  }

  return link;
}

const BASE_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: IconLayoutDashboard },
  // { to: '/users', label: 'Users', icon: IconUsers },
  { to: "/products", label: "Products", icon: IconPackage },
  { to: "/categories", label: "Categories", icon: IconCategory },
  { to: "/orders", label: "Orders", icon: IconShoppingCart },
];

const SUPPORT_NAV_ITEM: NavItem = {
  to: "/user-testing",
  label: "User Testing",
  icon: IconUser,
};

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Users",
  "/products": "Products",
  "/categories": "Categories",
  "/orders": "Orders",
  "/user-testing": "User Testing",
};

export function AppLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [collapsed, setCollapsed] = useLocalStorage({
    key: "sidebar-collapsed",
    defaultValue: false,
  });

  const navItems =
    session?.username === SUPPORT_ADMIN_USERNAME
      ? [...BASE_NAV_ITEMS, SUPPORT_NAV_ITEM]
      : BASE_NAV_ITEMS;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Magic Store Admin";

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: collapsed ? NAVBAR_WIDTH_COLLAPSED : NAVBAR_WIDTH,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
      transitionDuration={200}
      className={styles.shell}
    >
      <AppShell.Navbar
        p="md"
        className={clsx(styles.navbar, collapsed && styles.navbarCollapsed)}
      >
        <AppShell.Section className={styles.brand}>
          <Text className={styles.brandTitle}>
            {collapsed ? "MS" : "Magic Store"}
          </Text>
          {!collapsed && (
            <Text className={styles.brandSubtitle}>
              Cross-border marketplace admin
            </Text>
          )}
          <Divider color="var(--mantine-color-gray-5)" mt="sm" />
        </AppShell.Section>

        <AppShell.Section grow className={styles.navLinks}>
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </AppShell.Section>

        <AppShell.Section className={styles.navFooter}>
          {!collapsed && (
            <Text className={styles.adminInfo}>
              Signed in as <strong>{session?.name}</strong>
            </Text>
          )}
          {collapsed ? (
            <Tooltip label="Logout" position="right" withArrow>
              <button
                type="button"
                className={styles.navLink}
                onClick={handleLogout}
                aria-label="Logout"
              >
                <span className={styles.navLinkIcon}>
                  <IconLogout
                    size={18}
                    stroke={1.75}
                    color="var(--mantine-color-red-6)"
                  />
                </span>
              </button>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              color="red"
              size="xs"
              leftSection={<IconLogout size={14} />}
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          )}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header className={styles.header}>
        <Group h="100%" px="md" wrap="nowrap">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            visibleFrom="sm"
          >
            {collapsed ? (
              <IconLayoutSidebarLeftExpand size={20} />
            ) : (
              <IconLayoutSidebarLeftCollapse size={20} />
            )}
          </ActionIcon>
          <Title order={4} className={styles.headerTitle}>
            {pageTitle}
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
