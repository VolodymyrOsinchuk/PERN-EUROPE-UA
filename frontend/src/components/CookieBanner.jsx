// import React, { useEffect, useState } from 'react'
// import { Button, Typography } from '@mui/material'
// import { Link } from 'react-router-dom'
// import '../assets/css/cookieBanner.css'
// const CookieBanner = ({ onAccept }) => {
//   const [visible, setVisible] = useState(true)

//   useEffect(() => {
//     const consent = localStorage.getItem('cookieConsent')
//     if (consent === 'accepted') {
//       setVisible(false)
//     }
//   }, [])

//   const handleAccept = () => {
//     localStorage.setItem('cookieConsent', 'accepted')
//     setVisible(false)
//     if (onAccept) onAccept()
//   }

//   if (!visible) return null

//   return (
//     <div className="cookie-banner">
//       <div className="cookie-banner-content">
//         <Typography variant="body2">
//           Цей веб-сайт використовує файли cookie для покращення вашого досвіду.
//           Продовжуючи користуватися сайтом, ви погоджуєтеся з нашою
//           <Link
//             to="/privacy-policy"
//             // className="footer-link"
//             style={{ color: '#90caf9', marginLeft: '5px' }}
//           >
//             політикою конфіденційності
//           </Link>
//           .
//         </Typography>
//       </div>
//       <div className="cookie-banner-buttons">
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           onClick={handleAccept}
//         >
//           Прийняти
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default CookieBanner

import React, { useState, useEffect } from 'react'
import { Button, Typography, Link, Box } from '@mui/material'

const CookieBanner = ({ onAccept }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (consent === 'accepted') {
      setVisible(false)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setVisible(false)
    if (onAccept) onAccept()
  }

  if (!visible) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(33, 33, 33, 0.95)',
        color: 'white',
        padding: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          flex: 1,
          mb: { xs: 2, md: 0 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="body2">
          Цей веб-сайт використовує файли cookie для покращення вашого досвіду.
          Продовжуючи користуватися сайтом, ви погоджуєтеся з нашою
          <Link
            href="/політика-конфіденційності"
            sx={{ color: '#90caf9', ml: 1 }}
          >
            політикою конфіденційності
          </Link>
          .
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAccept}>
          Прийняти
        </Button>
      </Box>
    </Box>
  )
}

export default CookieBanner
