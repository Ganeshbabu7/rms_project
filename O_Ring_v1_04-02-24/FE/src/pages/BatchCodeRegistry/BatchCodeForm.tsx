import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Grid, Button, Typography } from "@mui/material";
import * as Yup from "yup";
import { PostRequest } from "../../commonFunctions/Api";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

interface BatchCodeProps {
  editData: FormData;
  setData: (state: any) => void;
  setBatchCode: (state: any) => void;
}

interface FormData {
  id?: number;
  quantity?: number;
  batchCode?: string;
  itemName?: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  quantity: Yup.number().required("Quantity Required"),
  batchCode: Yup.string().required("O-Ring Type Required"),
  itemName: Yup.string().required("Chemical Name Required"),
});

const BatchCodeForm = ({ editData, setData, setBatchCode }: BatchCodeProps) => {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [batchCodeDetails, setBatchCodeDetails] = useState({
    quantity: 0,
    batchCode: "",
    itemName: "",
  });

  useEffect(() => {
    if (editData) {
      setBatchCodeDetails({
        quantity: editData.quantity || 0,
        batchCode: editData.batchCode || "",
        itemName: editData.itemName || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = data;
      if (type == "Add") {
        payload.action = "create";
        const res = await PostRequest(token, "/batchNo", payload);
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
        payload.batchId = editData.id;
        const res = await PostRequest(token, "/batchNo", payload);
        if (res.status === 200) {
          const updatedData = res.data.result;
          setBatchCode((prevRawMaterials: any) =>
            prevRawMaterials.map((item: any) =>
              item.id === updatedData.id ? { ...item, ...updatedData } : item
            )
          );
          // Removing Edit RawMaterial Values :
          setData({
            quantity: 0,
            oringType: "",
            itemName: "",
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
        const updatedValues: FormData = {
          id: editData.id || 0,
          ...values,
        };
        handleSubmit(updatedValues, type);
        formikHelpers.resetForm();
        // handleSubmit(values, type, { resetForm }); // Passing resetForm inside an object
      }}
      // onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom>
            Batch Code Registry
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
                  label="Item Name"
                  name="itemName"
                  sx={{ minWidth: "15em" }}
                  error={touched.itemName && !!errors.itemName}
                  helperText={touched.itemName && errors.itemName}
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
                      quantity: 0,
                      oringType: "",
                      itemName: "",
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

export default BatchCodeForm;
