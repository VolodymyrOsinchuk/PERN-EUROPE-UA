// import { Fragment } from 'react'
// import {
//   Typography,
//   Container,
//   Grid2,
//   IconButton,
//   Stack,
//   Box,
// } from '@mui/material'
// import '../assets/css/footer.css'
// import { Link } from 'react-router-dom'

// const Footer = () => {
//   return (
//     <Stack>
//       <Box
//         component="footer"
//         sx={{
//           backgroundColor: 'black',
//           padding: '20px 0',
//           marginTop: '40px',
//           borderTop: '1px solid #e0e0e0',
//         }}
//       >
//         <Container
//           sx={{
//             maxWidth: '800px',
//             margin: '0 auto',
//             padding: '0 20px',
//             textAlign: 'center',
//           }}
//         >
//           <Typography variant="body2" sx={{ color: 'white' }} align="center">
//             © 2023 Українці в Європі. Усі права захищено.
//             <Box component="span" mx={1}>
//               •
//             </Box>
//             <Link
//               to="/privacy-policy"
//               style={{
//                 color: '#666',
//                 textDecoration: 'none',
//                 margin: '0 10px',
//                 '&:hover': {
//                   color: '#2196f3',
//                   textDecoration: 'underline',
//                 },
//               }}
//               onClick={(e) => {
//                 e.preventDefault()
//                 window.location.href = '/privacy-policy'
//               }}
//             >
//               Політика конфіденційності
//             </Link>
//           </Typography>
//         </Container>
//       </Box>
//     </Stack>
//   )
// }
// export default Footer

import React from 'react'
import { Box, Typography, Link } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer" // Ajout d'une spécification sémantique
      sx={{
        backgroundColor: 'black',
        py: 6,
        // mt: 10,
        borderTop: 1,
        borderColor: 'gray.200',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{ color: 'white', fontSize: '0.875rem' }}
        >
          {new Date().getFullYear()} Українці в Європі. Всі права захищені.
          <Box component="span" sx={{ mx: 2 }}>
            •
          </Box>
          <Link
            href="/privacy-policy"
            component="a" // Spécifier le composant de base
            sx={{
              color: 'white',
              textDecoration: 'none', // Optionnel: pour un style plus propre
              '&:hover': {
                color: 'blue',
                textDecoration: 'underline', // Meilleure indication visuelle
              },
            }}
          >
            Політика конфіденційності
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer
