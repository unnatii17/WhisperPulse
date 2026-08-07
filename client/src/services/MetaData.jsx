import React from 'react';
import { Helmet } from 'react-helmet';

const MetaData = () => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>WhisperPulse - Anonymous College Confessions</title>
      <meta name="description" content="Post your anonymous college confessions, like, comment, share, and get notified about your confessions on WhisperPulse." />
      <meta name="keywords" content="college confessions, anonymous confessions, share confessions, comment on confessions, like confessions, notification of confessions" />
      <meta name="author" content="WhisperPulse Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="WhisperPulse - Anonymous College Confessions" />
      <meta property="og:description" content="Post your anonymous college confessions, like, comment, share, and get notified about your confessions on WhisperPulse." />
      <meta property="og:image" content="https://res.cloudinary.com/dcnhb3jwv/image/upload/v1722706215/jasxmxzzygegj5ksvzrg.png" />
      <meta property="og:url" content="https://whisper-pulse.vercel.app/" />
      <meta property="og:site_name" content="WhisperPulse" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="WhisperPulse" />
      <meta name="twitter:description" content="Post your anonymous college confessions, like, comment, share, and get notified about your confessions on WhisperPulse." />
      <meta name="twitter:image" content="https://res.cloudinary.com/dcnhb3jwv/image/upload/v1722706215/jasxmxzzygegj5ksvzrg.png" />
      <meta name="twitter:site" content="@whisperpulse.site" />
      <meta name="twitter:creator" content="@whisperpulse.site" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Helmet>
  );
};

export default MetaData;

