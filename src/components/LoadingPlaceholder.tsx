import { CircularProgress, InputAdornment, TextField } from '@mui/material';

const LoadingPlaceholder = (): JSX.Element => (
  <TextField
    placeholder="Fetching list..."
    variant="outlined"
    fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <CircularProgress color="inherit" size={20} />
        </InputAdornment>
      ),
    }}
  />
);

export default LoadingPlaceholder;
