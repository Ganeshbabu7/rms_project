import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Grid, Button, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { PostRequest } from "../../commonFunctions/Api";
import { toast } from "react-toastify";

interface ToolsProps {
  editData: FormData;
  setData: (state: any) => void;
  setRawMaterials: (state: any) => void;
}

interface FormData {
  id?: number;
  materialItem?: string;
  currentQuantity?: number;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  materialItem: Yup.string().required("Tool Name Required"),
  currentQuantity: Yup.number().required("Quantity Required"),
});

const ToolRegistryForm = ({
  editData,
  setData,
  setRawMaterials,
}: ToolsProps) => {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [toolsDetails, setToolsDetails] = useState({
    materialItem: "",
    currentQuantity: 0,
  });

  useEffect(() => {
    if (editData) {
      setToolsDetails({
        materialItem: editData.materialItem || "",
        currentQuantity: editData.currentQuantity || 0,
      });
    }
  }, [editData]);

  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = data;
      if (type == "Add") {
        payload.action = "create";
        const res = await PostRequest(token, "/tools", payload);
        if (res.status == 201) {
          const result = res.data.result;
          console.log("result: ", result);
          setRawMaterials((prevRawMaterials: any) => [
            ...prevRawMaterials,
            result,
          ]);
          toast(res.data.message);
        }
      } else {
        payload.action = "update";
        payload.toolId = editData.id;
        const res = await PostRequest(token, "/tools", payload);
        if (res.status === 200) {
          const updatedData = res.data.result;
          setRawMaterials((prevRawMaterials: any) =>
            prevRawMaterials.map((item: any) =>
              item.id === updatedData.id ? { ...item, ...updatedData } : item
            )
          );
          // Removing Edit RawMaterial Values :
          setData({
            materialItem: "",
            supplier: "",
            currentQuantity: "",
            thresholdQuantity: "",
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
      initialValues={toolsDetails}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => {
        const type = editData.materialItem ? "Update" : "Add";
        handleSubmit(values, type);
        formikHelpers.resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom>
            Tools Registry
          </Typography>
          {userDetails.role == "admin" ? (
            <Grid container spacing={2}>
              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Tool Name"
                  name="materialItem"
                  sx={{ minWidth: "15em" }}
                  error={touched.materialItem && !!errors.materialItem}
                  helperText={touched.materialItem && errors.materialItem}
                />
              </Grid>

              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Current Quantity"
                  name="currentQuantity"
                  sx={{ minWidth: "15em" }}
                  error={touched.currentQuantity && !!errors.currentQuantity}
                  helperText={touched.currentQuantity && errors.currentQuantity}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "7.5em", marginRight: "1em" }}
                >
                  {editData.materialItem ? "Update" : "Add"}
                </Button>

                <Button
                  // type="submit"
                  variant="contained"
                  color="error"
                  sx={{ width: "7.5em" }}
                  onClick={() =>
                    setData({
                      materialItem: "",
                      supplier: "",
                      currentQuantity: "",
                      thresholdQuantity: "",
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

export default ToolRegistryForm;
