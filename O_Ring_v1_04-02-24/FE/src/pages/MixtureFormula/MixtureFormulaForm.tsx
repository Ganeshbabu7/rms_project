import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Grid, Button, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { PostRequest } from "../../commonFunctions/Api";
import { toast } from "react-toastify";

interface BatchCodeProps {
  editData: FormData;
  setData: (state: any) => void;
  setBatchCode: (state: any) => void;
}

interface FormData {
  id?: number;
  quantity?: string;
  batchCode?: string;
  chemicalMixture?: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  quantity: Yup.string().required("Quantity Required"),
  batchCode: Yup.string().required("O-Ring Type Required"),
  chemicalMixture: Yup.string().required("Chemical Mixture Required"),
});

const MixtureFormulaForm = ({
  editData,
  setData,
  setBatchCode,
}: BatchCodeProps) => {
  console.log("editData: ", editData);
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [batchCodeDetails, setBatchCodeDetails] = useState({
    quantity: "",
    chemicalMixture: "",
    batchCode: "",
  });

  useEffect(() => {
    if (editData) {
      setBatchCodeDetails({
        quantity: editData.quantity || "",
        batchCode: editData.batchCode || "",
        chemicalMixture: editData.chemicalMixture || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = data;
      if (type == "Add") {
        payload.action = "create";
        const res = await PostRequest(token, "/mixture", payload);
        if (res.status == 201) {
          const result = res.data.result;
          console.log("result: ", result);
          setBatchCode((prevRawMaterials: any) => [
            ...prevRawMaterials,
            result,
          ]);
          toast(res.data.message);
        }
      } else {
        payload.action = "update";
        payload.mixtureId = editData.id;
        const res = await PostRequest(token, "/mixture", payload);
        if (res.status === 200) {
          const updatedData = res.data.result;
          setBatchCode((prevRawMaterials: any) =>
            prevRawMaterials.map((item: any) =>
              item.id === updatedData.id ? { ...item, ...updatedData } : item
            )
          );
          // Removing Edit RawMaterial Values :
          setData({
            quantity: "",
            batchCode: "",
            chemicalMixture: "",
          });
          toast(res.data.message);
        }
      }
    } catch (error: any) {
      toast(error.response.data.message);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={batchCodeDetails}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => {
        const type = editData.batchCode ? "Update" : "Add";
        handleSubmit(values, type);
        formikHelpers.resetForm();
      }}
      // onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom>
            Mixture Formula
          </Typography>
          {userDetails.role == "admin" ? (
            <Grid container spacing={2}>
              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Batch Code"
                  name="batchCode"
                  sx={{ minWidth: "15em" }}
                  error={touched.batchCode && !!errors.batchCode}
                  helperText={touched.batchCode && errors.batchCode}
                />
              </Grid>

              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Chemical Mixture"
                  name="chemicalMixture"
                  sx={{ minWidth: "15em" }}
                  error={touched.chemicalMixture && !!errors.chemicalMixture}
                  helperText={touched.chemicalMixture && errors.chemicalMixture}
                />
              </Grid>

              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Quantity"
                  name="quantity"
                  sx={{ minWidth: "15em" }}
                  error={touched.quantity && !!errors.quantity}
                  helperText={touched.quantity && errors.quantity}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "7.5em", marginRight: "1em" }}
                >
                  {editData.batchCode ? "Update" : "Add"}
                </Button>

                <Button
                  // type="submit"
                  variant="contained"
                  color="error"
                  sx={{ width: "7.5em" }}
                  onClick={() =>
                    setData({
                      quantity: "",
                      batchCode: "",
                      chemicalMixture: "",
                    })
                  }
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};

export default MixtureFormulaForm;
