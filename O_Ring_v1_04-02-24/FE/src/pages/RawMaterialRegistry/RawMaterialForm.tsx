import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Grid, Button, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { PostRequest } from "../../commonFunctions/Api";
import { toast } from "react-toastify";

interface RawMaterialProps {
  editData: FormData;
  setData: (state: any) => void;
  setRawMaterials: (state: any) => void;
}

interface FormData {
  id?: number;
  materialItem?: string;
  supplier?: string;
  currentQuantity?: string;
  thresholdQuantity?: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  materialItem: Yup.string().required("Raw Material Item is required"),
  supplier: Yup.string().required("Supplier Name is required"),
  // currentQuantity: Yup.string().required("Current Quantity is required"),
  thresholdQuantity: Yup.string().required("Threshould Quantity is required"),
});

const RawMaterialForm = ({
  editData,
  setData,
  setRawMaterials,
}: RawMaterialProps) => {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [rawMaterialDetails, setRawMaterialDetails] = useState({
    materialItem: "",
    supplier: "",
    currentQuantity: "",
    thresholdQuantity: "",
  });

  useEffect(() => {
    if (editData) {
      setRawMaterialDetails({
        materialItem: editData.materialItem || "",
        supplier: editData.supplier || "",
        currentQuantity: editData.currentQuantity || "",
        thresholdQuantity: editData.thresholdQuantity || "",
      });
    }
  }, [editData]);

  // Create Raw Material :
  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = data;
      if (type == "Add") {
        payload.action = "create";
        const res = await PostRequest(token, "/rawMaterial", payload);
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
        payload.rawMaterialId = editData.id;
        const res = await PostRequest(token, "/rawMaterial", payload);
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

  // Handle Edit :
  // const handleEdit = async (row: Object) => {
  //   try {
  //     const payload: any = row;
  //     payload.action = "update";
  //     payload.rawMaterialId = data._id;
  //     const res = await PostRequest(token, "/rawMaterial", payload);
  //     if (res.status == 200) {
  //       toast(res.data.message);
  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //     toast(error.response.data.message);
  //   }
  // };

  return (
    <Formik
      enableReinitialize
      initialValues={rawMaterialDetails}
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
            Raw Material Registry
          </Typography>
          {userDetails.role == "admin" ? (
            <Grid container spacing={2}>
              {/* <Grid item xs={2} lg={2.5} sm={6}>
                <FormControl sx={{ minWidth: "15em" }}>
                  <InputLabel
                    id="demo-simple-select-helper-label"
                    sx={{ marginBottom: "4px" }}
                  >
                    Select Raw Material Item
                  </InputLabel>
                  <Field
                    as={Select}
                    labelId="demo-simple-select-helper-label"
                    name="materialItem"
                    error={touched.materialItem && !!errors.materialItem}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    <MenuItem value="Option 1">Option 1</MenuItem>
                    <MenuItem value="Option 2">Option 2</MenuItem>
                    <MenuItem value="Option 3">Option 3</MenuItem>
                  </Field>
                  <FormHelperText>
                    {touched.materialItem && errors.materialItem}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              <Grid item xs={2} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Raw Material Name"
                  name="materialItem"
                  sx={{ minWidth: "15em" }}
                  error={touched.materialItem && !!errors.materialItem}
                  helperText={touched.materialItem && errors.materialItem}
                />
              </Grid>

              <Grid item xs={2} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Supplier Name"
                  name="supplier"
                  sx={{ minWidth: "15em" }}
                  error={touched.supplier && !!errors.supplier}
                  helperText={touched.supplier && errors.supplier}
                />
              </Grid>

              <Grid item xs={2} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Current Quantity"
                  name="currentQuantity"
                  sx={{ minWidth: "15em" }}
                  error={touched.currentQuantity && !!errors.currentQuantity}
                  helperText={touched.currentQuantity && errors.currentQuantity}
                />
              </Grid>

              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Threshold Quantity"
                  name="thresholdQuantity"
                  sx={{ minWidth: "15em" }}
                  error={
                    touched.thresholdQuantity && !!errors.thresholdQuantity
                  }
                  helperText={
                    touched.thresholdQuantity && errors.thresholdQuantity
                  }
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

export default RawMaterialForm;
