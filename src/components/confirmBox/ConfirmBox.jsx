import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckIcon from "@mui/icons-material/Check";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
export default function ConfirmBox({ open, title, message, handleClose, handleSubmit }) {
  return (
    <Dialog sx={{ minWidth: "400px", minHeight: "200pdx" }} open={open} onClose={handleClose}> 
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          endIcon={<CheckIcon />}
          color="primary"
          sx={{ mx: 2, width: "150px" }}
          autoFocus
        >
          بلی
        </Button>
        <Button
          variant="outlined"
          endIcon={<CloseOutlinedIcon />}
          color="warning"
          sx={{ mx: 2, width: "150px" }}
          onClick={handleClose}
        >
          خیر
        </Button>
      </DialogActions>
    </Dialog>
  );
}
