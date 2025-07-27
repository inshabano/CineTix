import React, { useState, useEffect, useRef } from 'react';
import {
    UserOutlined,
    SearchOutlined,
    MenuOutlined,
    LogoutOutlined,
    BookOutlined,
    HeartOutlined
} from '@ant-design/icons';

import styles from './navbar.module.css';
import { useNavigate } from 'react-router-dom';
import { searchMoviesSuggestions } from '../../services/movies';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('User');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        const storedUserName = localStorage.getItem('username');
        console.log(storedUserName)
        if (token) {
            setIsLoggedIn(true);
            setUserName(storedUserName || 'User');
        } else {
            setIsLoggedIn(false);
            setUserName('User');
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false); 
        navigate(`/search?query=${encodeURIComponent(suggestion)}`); 
    };

useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim().length > 1) { 
            try {
                const response = await searchMoviesSuggestions(searchTerm);
                if (response.success) {
                    setSuggestions(response.data);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
}, [searchTerm]);

useEffect(() => {
    const handleClickOutside = (event) => {
        if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        checkLoginStatus();
        const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'userName') {
                checkLoginStatus();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        if (isUserDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserDropdownOpen]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
        setShowSuggestions(false); 
        navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
    };  
    const handleLogoutClick = () => {
        console.log("Logout clicked!");
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        checkLoginStatus();
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const showDrawer = () => setIsMobileMenuOpen(true);
    const onCloseDrawer = () => setIsMobileMenuOpen(false);
    const navigateHome = () => navigate('/');
    const toggleUserDropdown = () => setIsUserDropdownOpen(prev => !prev);

    return (
        <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles['nav-content']}>
                <div className={styles.logo} onClick={navigateHome}>
                    <img src="https://cdn.pixabay.com/photo/2022/07/17/19/22/movie-7328179_1280.png" alt="Logo" className={styles['logo-img']} />
                    <span className={styles['logo-text']}>CineTix</span>
                </div>

                <div className={styles['search-cont']} ref={searchInputRef}>
                    <div className={styles['search-wrap']}>
                        <SearchOutlined className={styles['search-icon']} />
                        <input
                            type="text"
                            placeholder="Search for movies here"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchSubmit}
                            onFocus={() => searchTerm.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
                            className={styles['search-input']}
                        />
                    </div>

                    
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className={styles['suggestions-list']}>
                            {suggestions.map((sug, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(sug)}
                                >
                                    {sug}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles['nav-right']}>
                    {!isLoggedIn ? (
                        <button className={styles['sign-btn']} onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                            Sign In
                        </button>
                    ) : (
                        <div className={styles['user-dropdown-cont']} ref={dropdownRef}>
                            <button className={styles['user-btn']} onClick={toggleUserDropdown}>
                                <UserOutlined /> <span className={styles.username}>Hi {userName}</span>
                            </button>
                            {isUserDropdownOpen && (
                                <ul className={styles['user-dropdown-menu']}>
                                    <li onClick={() => { setIsUserDropdownOpen(false); navigate('/my-profile'); }}>
                                        <UserOutlined /> My Profile
                                    </li>
                                    <li onClick={() => { setIsUserDropdownOpen(false); navigate('/mybookings'); }}>
                                        <BookOutlined /> My Bookings
                                    </li>
                                    <li onClick={() => { setIsUserDropdownOpen(false); navigate('/my-watchlist'); }}>
                                        <HeartOutlined /> Watchlist
                                    </li>
                                    <li className={styles['menu-divider']}></li>
                                    <li onClick={handleLogoutClick} className={styles['logout-item']}>
                                        <LogoutOutlined /> Logout
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}

                    <button className={styles['hamburger-btn']} onClick={showDrawer}>
                        <MenuOutlined className={styles['hamburger-icon']} />
                    </button>
                </div>
            </div>

            <div className={`${styles['mobile-drawer']} ${isMobileMenuOpen ? styles['mobile-drawer-open'] : ''}`}>
                <div className={styles['mobile-drawer-header']}>
                    <span className={styles['mobile-drawer-title']}>Menu</span>
                    <button className={styles['mobile-drawer-close-btn']} onClick={onCloseDrawer}>&times;</button>
                </div>
                <div className={styles['mobile-drawer-body']}>
                    <div className={styles['mobile-search-wrap']}>
                        <SearchOutlined className={styles['mobile-search-icon']} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchSubmit}
                            className={styles['mobile-search-input']}
                        />
                    </div>

                    {isLoggedIn && (
                        <ul className={styles['mobile-menu']}>
                            <li onClick={() => { onCloseDrawer(); navigate('/my-profile'); }}>
                                <UserOutlined /> My Profile
                            </li>
                            <li onClick={() => { onCloseDrawer(); navigate('/mybookings'); }}>
                                <BookOutlined /> My Bookings
                            </li>
                            <li onClick={() => { onCloseDrawer(); navigate('/my-wishlist'); }}>
                                <HeartOutlined /> Wishlist
                            </li>
                            <li className={styles['menu-divider']}></li>
                            <li onClick={handleLogoutClick} className={styles['logout-item']}>
                                <LogoutOutlined /> Logout
                            </li>
                        </ul>
                    )}

                    {!isLoggedIn && (
                        <button className={styles['mobile-sign-btn']} onClick={() => { navigate('/login'); onCloseDrawer(); }}>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
            {isMobileMenuOpen && <div className={styles['mobile-drawer-overlay']} onClick={onCloseDrawer}></div>}
        </header>
    );
};

export default Navbar;