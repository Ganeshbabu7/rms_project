import { useState, useEffect, Fragment } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Grid, Button, TextField, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
  batchCode?: string;
  chemicalMixture?: { chemicalMixture: string; quantity: number }[];
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  batchCode: Yup.string().required("Batch Code Required"),
  chemicalMixture: Yup.array()
    .of(
      Yup.object().shape({
        chemicalMixture: Yup.string().required("Chemical Mixture Required"),
        quantity: Yup.number()
          .required("Quantity Required")
          .positive("Quantity must be positive")
          .integer("Quantity must be an integer"),
      })
    )
    .min(1, "At least one chemical mixture is required"),
});

const MixtureFormulaForm = ({
  editData,
  setData,
  setBatchCode,
}: BatchCodeProps) => {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;

  const [batchCodeDetails, setBatchCodeDetails] = useState<FormData>({
    batchCode: "",
    chemicalMixture: [{ chemicalMixture: "", quantity: 0 }],
  });

  useEffect(() => {
    if (editData) {
      const chemicalMixtureArray = editData.chemicalMixture
        ? editData.chemicalMixture.split(",").map((item, index) => ({
            chemicalMixture: item.trim(),
            quantity: editData.quantity.split(",")[index]?.trim() || 0,
          }))
        : [{ chemicalMixture: "", quantity: 0 }];

      setBatchCodeDetails({
        batchCode: editData.batchCode || "",
        chemicalMixture: chemicalMixtureArray,
      });
    }
  }, [editData]);

  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = {
        ...data,
        chemicalMixture: JSON.stringify(data.chemicalMixture),
      };
      if (type === "Add") {
        payload.action = "create";
        const res = await PostRequest(token, "/mixture", payload);
        if (res.status === 201) {
          const result = res.data.result;          
          const chemicalMixtures = JSON.parse(result.chemicalMixture || "[]");
          const formattedData = {
            ...result,
            chemicalMixture: chemicalMixtures
              .map((cm: any) => cm.chemicalMixture)
              .join(", "),
            quantity: chemicalMixtures.map((cm: any) => cm.quantity).join(", "),
          };
          console.log("formattedData: ", formattedData);
          setBatchCode((prevRawMaterials: any) => [
            ...prevRawMaterials,
            formattedData,
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
          setData({
            quantity: "",
            batchCode: "",
            chemicalMixture: [{ chemicalMixture: "", quantity: 0 }],
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
    >
      {({ errors, touched, values }) => (
        <Form>
          <Typography variant="h5" gutterBottom>
            Mixture Formula
          </Typography>
          {userDetails.role === "admin" && (
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

              <FieldArray name="chemicalMixture">
                {({ push, remove }) => (
                  <>
                    {(values.chemicalMixture || []).map((_, index) => (
                      <Fragment key={index}>
                        {index !== 0 && <Grid item xs={12} />}
                        {index !== 0 && <Grid item xs={3} lg={2.5} sm={6} />}
                        <Grid item xs={3} lg={2.5} sm={6}>
                          <Field
                            as={TextField}
                            label="Chemical Mixture"
                            name={`chemicalMixture.${index}.chemicalMixture`}
                            sx={{ minWidth: "15em" }}
                            error={
                              touched.chemicalMixture?.[index]
                                ?.chemicalMixture &&
                              !!errors.chemicalMixture?.[index]?.chemicalMixture
                            }
                            helperText={
                              touched.chemicalMixture?.[index]
                                ?.chemicalMixture &&
                              errors.chemicalMixture?.[index]?.chemicalMixture
                            }
                          />
                        </Grid>
                        <Grid item xs={3} lg={2.5} sm={6}>
                          <Field
                            as={TextField}
                            label="Quantity"
                            name={`chemicalMixture.${index}.quantity`}
                            sx={{ minWidth: "15em" }}
                            error={
                              touched.chemicalMixture?.[index]?.quantity &&
                              !!errors.chemicalMixture?.[index]?.quantity
                            }
                            helperText={
                              touched.chemicalMixture?.[index]?.quantity &&
                              errors.chemicalMixture?.[index]?.quantity
                            }
                          />
                        </Grid>
                        <Grid item xs={1} lg={1} sm={1}>
                          {index === 0 ? (
                            <IconButton
                              color="primary"
                              onClick={() =>
                                push({ chemicalMixture: "", quantity: 0 })
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              color="secondary"
                              onClick={() => remove(index)}
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Fragment>
                    ))}
                  </>
                )}
              </FieldArray>

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
                  variant="contained"
                  color="error"
                  sx={{ width: "7.5em" }}
                  onClick={() =>
                    setData({
                      quantity: "",
                      batchCode: "",
                      chemicalMixture: [{ chemicalMixture: "", quantity: 0 }],
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

export default MixtureFormulaForm;
