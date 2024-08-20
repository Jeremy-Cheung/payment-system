import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import { Link } from "react-router-dom";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ["Client", "Payment"];
const clientItems = ["CREATE", "EDIT", "LIST"];
const paymentItems = ["CREATE", "LIST"];
const clientLinks = ["/clients/create", "/clients/edit", "/clients/list"];
const paymentLinks = ["/payments/create", "/payments/list"];

export default function Navbar(props: Props) {
  const { window } = props;
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openClient, setOpenClient] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeNavItem, setActiveNavItem] = React.useState<string | null>(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClickClient = () => {
    setOpenClient(!openClient);
  };

  const handleClickPay = () => {
    setOpenPayment(!openPayment);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    navItem: string
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveNavItem(navItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveNavItem(null);
  };

  const getMenuItems = (navItem: string) => {
    if (navItem === "Client") return clientItems;
    if (navItem === "Payment") return paymentItems;
    return [];
  };

  const getMenuLinks = (navItem: string) => {
    if (navItem === "Client") return clientLinks;
    if (navItem === "Payment") return paymentLinks;
    return [];
  };

  // Side menu on clicking menu button
  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MENU
      </Typography>
      <Divider />
      <List>
        <ListItemButton onClick={handleClickClient}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="CLIENT" />
          {openClient ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openClient} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {clientItems.map((item, index) => (
              <ListItemButton
                component={Link}
                to={clientLinks[index]}
                key={index}
                sx={{ pl: 4 }}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        <ListItemButton onClick={handleClickPay}>
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="PAYMENT" />
          {openPayment ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPayment} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {paymentItems.map((item, index) => (
              <ListItemButton
                component={Link}
                to={paymentLinks[index]}
                key={index}
                sx={{ pl: 4 }}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", position: "fixed" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "#252629" }}>
        <Toolbar sx={{ justifyContent: "flex-end", position: "relative" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <AccountBalanceIcon
            sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            PAYMENT SYSTEM
          </Typography>
          <Box
            sx={{ display: { xs: "none", sm: "block" }, position: "relative" }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ mr: 5, color: "#fff" }}
                aria-controls={`${item.toLowerCase()}-menu`}
                aria-haspopup="true"
                onClick={(event) => handleMenuOpen(event, item)}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
        {anchorEl && (
          <Menu
            id={`${activeNavItem?.toLowerCase()}-menu`}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              sx: {
                display: "flex",
                width: "100%",
                backgroundColor: "#3a3b40",
                color: "#fff",
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {getMenuItems(activeNavItem!).map((subItem, index) => (
              <MenuItem
                component={Link}
                to={getMenuLinks(activeNavItem!)[index]}
                key={index}
                onClick={handleMenuClose}
              >
                {subItem}
              </MenuItem>
            ))}
          </Menu>
        )}
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
