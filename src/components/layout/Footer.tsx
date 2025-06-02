import { Box, Container, Typography, Link, Stack } from '@mui/material';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Double Bubble. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={3}>
            <Link href="/terms" color="text.secondary" underline="hover">
              <Typography variant="body2">
                Terms
              </Typography>
            </Link>
            <Link href="/privacy" color="text.secondary" underline="hover">
              <Typography variant="body2">
                Privacy
              </Typography>
            </Link>
            <Link href="/contact" color="text.secondary" underline="hover">
              <Typography variant="body2">
                Contact
              </Typography>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}