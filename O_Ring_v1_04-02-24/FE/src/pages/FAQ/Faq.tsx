import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { PostRequest } from "../../commonFunctions/Api";
import FixedNavBar from "../../commonComponents/FixedNavBar";
import FaqComponent from "../../commonComponents/FaqComponent";
import FaqForm from "./FaqForm";

function Faq() {
  const token = localStorage.getItem("token");
  const [faq, setFaq] = useState([]);
  const [editFaqs, setEditFaqs] = useState({});

  // Get FAQ Deatails :
  const getFaqs = async () => {
    try {
      const payload = {
        action: "read",
      };
      const res = await PostRequest(token, "/faq", payload);
      setFaq(res.data.result);
    } catch (error: any) {
      console.log(error);
    }
  };

  console.log("editFaqs", editFaqs);

  useEffect(() => {
    try {
      getFaqs();
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(faq);

  return (
    <Box>
      <FixedNavBar />
      <Box
        sx={{
          position: "relative",
          top: "4em",
          left: "15em",
          padding: 2,
          maxWidth: `calc(100% - 15em)`,
        }}
      >
        <FaqForm editData={editFaqs} setData={setEditFaqs} setFaqs={setFaq} />
        <FaqComponent faqs={faq} setData={setEditFaqs} setFaqs={setFaq} />
      </Box>
    </Box>
  );
}

export default Faq;
