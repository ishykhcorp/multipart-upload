import styles from "./App.module.css";
import {
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";

function App() {
  return (
    <Paper variant="outlined" className={styles.pageWrapper}>
      <Stack direction="column" spacing={2}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUpload />}
        >
          Upload files
          <input
            className={styles.visuallyHidden}
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>
        <Typography align="center" variant="body1" component="p">
          There are no files
        </Typography>
      </Stack>
    </Paper>
  );
}

export default App;
