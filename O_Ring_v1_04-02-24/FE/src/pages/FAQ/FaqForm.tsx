import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Grid, Button, Typography } from "@mui/material";
import * as Yup from "yup";
import { PostRequest } from "../../commonFunctions/Api";
import { toast } from "react-toastify";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";

interface MixingProps {
  editData: FormData;
  setData: (state: any) => void;
  setFaqs: (state: any) => void;
}

interface FormData {
  id?: number;
  faqQuestion?: string;
  faqAnswer?: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  faqQuestion: Yup.string().required("Question is required"),
  //   faqAnswer: Yup.string().required("Answer is required"),
});

const FaqForm = ({ editData, setData, setFaqs }: MixingProps) => {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [faqDetails, setFaqDetails] = useState({
    faqQuestion: "",
    faqAnswer: "",
  });

  useEffect(() => {
    if (editData) {
      setFaqDetails({
        faqQuestion: editData.faqQuestion || "",
        faqAnswer: editData.faqAnswer || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = data;
      if (type == "Add") {
        payload.action = "create";
        const res = await PostRequest(token, "/faq", payload);
        if (res.status == 201) {
          const result = res.data.result;
          setFaqs((prevRawMaterials: any) => [...prevRawMaterials, result]);
          toast(res.data.message);
        }
      } else {
        payload.action = "update";
        payload.faqId = editData.id;
        const res = await PostRequest(token, "/faq", payload);
        if (res.status === 200) {
          const updatedData = res.data.result;
          setFaqs((prevRawMaterials: any) =>
            prevRawMaterials.map((item: any) =>
              item.id === updatedData.id ? { ...item, ...updatedData } : item
            )
          );
          // Removing Edit RawMaterial Values :
          setData({
            faqQuestion: "",
            faqAnswer: "",
          });
          toast(res.data.message);
        }
      }
    } catch (error: any) {
      toast(error.response.data.message);
    }
  };

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
      width: 320px;
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 8px 12px;
      border-radius: 4px;
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[700] : grey[400]
      };
      box-shadow: 0px 2px 2px ${
        theme.palette.mode === "dark" ? grey[900] : grey[50]
      };
  
      &:hover {
        border-color: ${blue[400]};
      }
  
      &:focus {
        border-color: ${blue[400]};
        box-shadow: 0 0 0 3px ${
          theme.palette.mode === "dark" ? blue[600] : blue[200]
        };
      }
  
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
  );

  return (
    <Formik
      enableReinitialize
      initialValues={faqDetails}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => {
        const type = editData.faqAnswer ? "Update" : "Add";
        handleSubmit(values, type);
        formikHelpers.resetForm(); // Passing resetForm inside an object
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom>
            FAQ
          </Typography>
          {(userDetails.role === "admin" ||
            userDetails.role === "supervisor") && (
            <Grid container spacing={2}>
              <Grid item xs={3} lg={12} sm={6}>
                <Field name="faqQuestion">
                  {({ field }: { field: any }) => (
                    <Textarea
                      {...field}
                      sx={{
                        width: "100%",
                        height: "100px",
                      }}
                      maxRows={4}
                      aria-label="maximum height"
                      placeholder="Question"
                      error={touched.faqQuestion && !!errors.faqQuestion}
                      helperText={touched.faqQuestion && errors.faqQuestion}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={3} lg={12} sm={6}>
                <Field name="faqAnswer">
                  {({ field }: { field: any }) => (
                    <Textarea
                      {...field}
                      sx={{
                        width: "100%",
                        height: "100px",
                      }}
                      maxRows={4}
                      aria-label="maximum height"
                      placeholder="Answer"
                      error={touched.faqAnswer && !!errors.faqAnswer}
                      helperText={touched.faqAnswer && errors.faqAnswer}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "7.5em", marginRight: "1em", mb: "1em" }}
                >
                  {editData.faqAnswer ? "Update" : "Add"}
                </Button>

                <Button
                  // type="submit"
                  variant="contained"
                  color="error"
                  sx={{ width: "7.5em", mb: "1em" }}
                  onClick={() =>
                    setFaqDetails({
                      faqQuestion: "",
                      faqAnswer: "",
                    })
                  }
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default FaqForm;
