import { useState } from "react";
import DialogueBox from "./DialogueBox";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionActions from "@mui/material/AccordionActions";

interface DataFaq {
  id: string;
}

interface FAQ {
  id: number;
  faqQuestion: string;
  faqAnswer: string;
}

interface FAQProps {
  faqs: FAQ[];
  setData: (state: any) => void;
  setFaqs: (state: any) => void;
}

function FaqComponent({ faqs, setData, setFaqs }: FAQProps) {
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<DataFaq>({ id: "" });

  // Handle Edit :
  const handleEdit = async (e: Object) => {
    try {
      setData(e);
    } catch (error: any) {
      console.log(error);
    }
  };

  // Handle Delete :
  const handleDelete = async (e: Object) => {
    try {
      setOpen(!open);
      setDeleteData(e as DataFaq);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      {faqs?.map((e) => (
        <Accordion key={e.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            // sx={{ fontWeight: "bold" }}
          >
            {e.faqQuestion}
          </AccordionSummary>
          <AccordionDetails
            sx={{
              variant: "body1",
              fontSize: "14px",
              fontStyle: "italic",
              color: "textSecondary",
            }}
          >
            {e.faqAnswer}
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={() => handleEdit(e)}>Edit </Button>
            <Button onClick={() => handleDelete(e)}>Delete</Button>
          </AccordionActions>
        </Accordion>
      ))}
      {open ? (
        <DialogueBox
          open={open}
          setOpen={setOpen}
          updateData={setFaqs}
          apiName="faq"
          editId="faqId"
          row={deleteData}
        />
      ) : null}
    </div>
  );
}

export default FaqComponent;
