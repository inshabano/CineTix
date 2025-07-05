import React from 'react';
import { Carousel } from 'antd';
import styles from './banner.module.css';


const Banner = () => {
   const images = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg',
    '/6.jpg',
    '/7.jpg',
    '/8.jpg',
    '/9.jpg',
    '/10.jpg',
    '/11.jpg',

    
  ];

  return (
      <div className={styles.carouselContainer}>
      <Carousel autoplay effect="fade" dots={true}>
        {images.map((img, index) => (
          <div key={index} className={styles.slide}>
            <img src={img} alt={`Banner ${index + 1}`} className={styles.bannerImage} />
            <div className={styles.textOverlay}>
              <h1>Welcome.</h1>
              <p>Book your favorite movie to watch.</p>
              <p>Explore now!</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
