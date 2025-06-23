import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Flex, Drawer, Dropdown, Badge, Menu } from 'antd';
import { 
    UserOutlined, 
    SearchOutlined, 
    MenuOutlined, 
    BellOutlined,
    LogoutOutlined,
    SettingOutlined,
    BookOutlined,
    HeartOutlined
} from '@ant-design/icons';
import styles from './navbar.module.css';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleLoginClick = () => {
        setIsLoggedIn(true);
        setIsMobileMenuOpen(false);
    };

    const handleLogoutClick = () => {
        setIsLoggedIn(false);
        setIsMobileMenuOpen(false);
    };

    const showDrawer = () => setIsMobileMenuOpen(true);
    const onCloseDrawer = () => setIsMobileMenuOpen(false);

    const navigateHome = () => {
        navigate('/');
    };

    const userMenu = (
        <Menu className={styles.userDropdown}>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                My Profile
            </Menu.Item>
            <Menu.Item key="bookings" icon={<BookOutlined />}>
                My Bookings
            </Menu.Item>
            <Menu.Item key="wishlist" icon={<HeartOutlined />}>
                Wishlist
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item 
                key="logout" 
                icon={<LogoutOutlined />}
                onClick={handleLogoutClick}
                danger
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <Flex
                className={styles.navbarContent}
                justify="space-between"
                align="center"
                gap="large"
            >
                <div className={styles.logo} onClick={navigateHome}>
                    <img
                        src="https://cdn.pixabay.com/photo/2022/07/17/19/22/movie-7328179_1280.png"
                        alt="Logo"
                    />
                    <span className={styles.my}>MovieBooking</span>
                </div>

                <Flex className={styles.searchContainer} align="center">
                    <Input
                        placeholder="Search movies..."
                        prefix={<SearchOutlined style={{ 
                            color: 'rgba(0,0,0,.45)',
                            transition: 'color 0.3s'
                        }} />}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onPressEnter={handleSearchSubmit}
                        className={styles.searchInput}
                        allowClear
                    />
                </Flex>

                <Flex align="center" gap="middle" className={styles.navbarRight}>
                    {isLoggedIn && (
                        <div className={styles.notificationBadge}>
                            <Badge count={5} overflowCount={9}>
                                <Button 
                                    type="text" 
                                    icon={<BellOutlined style={{ color: 'white', fontSize: '18px' }} />}
                                    shape="circle"
                                />
                            </Badge>
                        </div>
                    )}
                    
                    {!isLoggedIn ? (
                        <Button
                            type="primary"
                            onClick={handleLoginClick}
                            className={styles.signInBtn}
                        >
                            Sign In
                        </Button>
                    ) : (
                        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                            <Button
                                type="primary"
                                icon={<UserOutlined />}
                                className={styles.loggedInUserBtn}
                            >
                                <span className={styles.userName}>Hi User</span>
                            </Button>
                        </Dropdown>
                    )}

                    <Button
                        type="text"
                        icon={<MenuOutlined className={styles.hamburgerIcon} />}
                        onClick={showDrawer}
                        className={styles.hamburgerBtn}
                    />
                </Flex>
            </Flex>

            <Drawer
                title="Menu"
                placement="right"
                onClose={onCloseDrawer}
                open={isMobileMenuOpen}
                className={styles.mobileDrawer}
                width={300}
            >
                <Flex vertical gap="middle">
                    <Search
                        placeholder="Search movies..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onPressEnter={handleSearchSubmit}
                        className={styles.mobileSearchInput}
                        enterButton
                    />
                    
                    {isLoggedIn && (
                        <Menu mode="vertical">
                            <Menu.Item key="m-notifications" icon={<BellOutlined />}>
                                Notifications <Badge count={5} style={{ marginLeft: '10px' }} />
                            </Menu.Item>
                            <Menu.Item key="m-profile" icon={<UserOutlined />}>
                                My Profile
                            </Menu.Item>
                            <Menu.Item key="m-bookings" icon={<BookOutlined />}>
                                My Bookings
                            </Menu.Item>
                            <Menu.Item key="m-wishlist" icon={<HeartOutlined />}>
                                Wishlist
                            </Menu.Item>
                            <Menu.Item key="m-settings" icon={<SettingOutlined />}>
                                Settings
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                                key="m-logout" 
                                icon={<LogoutOutlined />}
                                onClick={handleLogoutClick}
                                danger
                            >
                                Logout
                            </Menu.Item>
                        </Menu>
                    )}
                    
                    {!isLoggedIn && (
                        <Button 
                            type="primary" 
                            onClick={handleLoginClick} 
                            size="large" 
                            block
                            className={styles.mobileSignInBtn}
                        >
                            Sign In
                        </Button>
                    )}
                </Flex>
            </Drawer>
        </Header>
    );
};

export default Navbar;