import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { PostRequest } from "../commonFunctions/Api";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CommonTableRow {
  id: string;
}

interface dialogueBoxProps {
  open: boolean;
  setOpen: (state: any) => void;
  updateData: (state: any) => void;
  apiName: string;
  editId: string;
  row: CommonTableRow;
}

function DialogueBox({
  open,
  setOpen,
  updateData,
  apiName,
  editId,
  row,
}: dialogueBoxProps) {
  const token = localStorage.getItem("token");
  // Handle Delete :
  const handleDelete = async (row: CommonTableRow) => {
    try {
      const payload: any = row;
      payload.action = "delete";
      payload[editId] = row.id;
      const res = await PostRequest(token, `/${apiName}`, payload);
      if (res.status == 200) {
        updateData((prevRawMaterials: any) =>
          prevRawMaterials.filter((item: any) => item.id !== row.id)
        );
        toast(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    } finally {
      setOpen(!open);
    }
  };

  // Handle Close :
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you Sure, do you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleDelete(row)}>Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DialogueBox;
