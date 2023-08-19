import React from 'react';
import './Footer.css';

function Footer() {
  const linkedinURL = 'https://www.linkedin.com/in/olenareukova';

  return (
    <footer className='footer'>
      <div className='footer-left'>
        <p>created by Olena Reukova &copy; 2023</p>
      </div>
      <div className='footer-right'>
        <a href={linkedinURL} target='_blank' rel='noopener noreferrer'>
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

export default Footer;
