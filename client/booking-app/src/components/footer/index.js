import React from 'react';
import styles from './footer.module.css';
import { Facebook, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        
        <div className={styles.footerSection}>
          <h3>🎬 CineTix</h3>
          <p>Your one-stop destination for booking your favorite movies online.</p>
        </div>

        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a href="https://github.com/inshabano"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/insha-bano-971866247"><Linkedin size={20} /></a>
            <a href="https://www.instagram.com/insha_bano6"><Instagram size={20} /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} CineTix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
