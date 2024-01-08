import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import BookAutocomplete from './components/BookAutocomplete';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Search ...
        </Typography>

        <BookAutocomplete options={[]} label="Book" />
      </Box>
    </Container>
  );
}
