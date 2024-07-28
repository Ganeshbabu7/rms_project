import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import {
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import * as Yup from "yup";
import { PostRequest } from "../../commonFunctions/Api";
import { toast } from "react-toastify";

interface MixingProps {
  editData: FormData;
  setData: (state: any) => void;
  setMixing: (state: any) => void;
}

interface FormData {
  id?: number;
  batchNo?: string;
  batchCode?: string;
  item?: string;
  party?: string;
  jobType?: string;
  totalKgs?: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  batchNo: Yup.string().required("Batch Number is required"),
  // batchCode: Yup.string().required("Batch Code is required"),
  item: Yup.string().required("Item is required"),
  party: Yup.string().required("Party is required"),
  jobType: Yup.string().required("Job Type is required"),
  totalKgs: Yup.string().required("Total Kgs is required"),
});

const MixingForm = ({ editData, setData, setMixing }: MixingProps) => {
  const token = localStorage.getItem("token");
  const getUserDetails = localStorage.getItem("userDetail");
  const userDetails = getUserDetails ? JSON.parse(getUserDetails) : null;
  const [batchCodes, setBatchCodes] = useState<string[]>([]);
  const [selectedBatchCode, setSelectedBatchCode] = useState("");
  const [mixingDetails, setMixingDetails] = useState({
    batchNo: "",
    batchCode: "",
    item: "",
    party: "",
    jobType: "",
    totalKgs: "",
  });

  useEffect(() => {
    if (editData) {
      if (Array.isArray(editData.batchCode)) {
        setBatchCodes(editData.batchCode as string[]);
      } else {
        setSelectedBatchCode(editData.batchCode || "");
      }

      setMixingDetails({
        batchNo: editData.batchNo || "",
        batchCode: editData.batchCode || "",
        item: editData.item || "",
        party: editData.party || "",
        jobType: editData.jobType || "",
        totalKgs: editData.totalKgs || "",
      });
    }
  }, [editData]);

  // Get Batch Details :
  const getBatchDetails = async () => {
    try {
      const payload = {
        action: "read",
      };
      const res = await PostRequest(token, "/batchNo", payload);
      if (res.status == 200) {
        const result = res.data.result;
        setBatchCodes(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getBatchDetails();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Unique Batch Codes :
  const uniqueBatchCodes = [
    ...new Set(batchCodes && batchCodes.map((e: any) => e.batchCode)),
  ];

  const handleBatchCodeChange = (event: any) => {
    const selectedCode = event.target.value;
    setSelectedBatchCode(selectedCode);
  };

  // Filter Batch No :
  const filteredBatchNo =
    batchCodes?.filter((e: any) => e.batchCode === selectedBatchCode) || [];

  const handleSubmit = async (data: FormData, type: string) => {
    try {
      const payload: any = data;
      if (type == "Add") {
        payload.action = "create";
        payload.batchCode = selectedBatchCode;
        const res = await PostRequest(token, "/mixing", payload);
        if (res.status == 201) {
          const result = res.data.result;
          setMixing((prevRawMaterials: any) => [...prevRawMaterials, result]);
          toast(res.data.message);
        }
      } else {
        payload.action = "update";
        payload.mixingId = editData.id;
        const res = await PostRequest(token, "/mixing", payload);
        if (res.status === 200) {
          const updatedData = res.data.result;
          setMixing((prevRawMaterials: any) =>
            prevRawMaterials.map((item: any) =>
              item.id === updatedData.id ? { ...item, ...updatedData } : item
            )
          );
          // Removing Edit RawMaterial Values :
          setData({
            batchNo: "",
            batchCode: "",
            item: "",
            party: "",
            jobType: "",
            totalKgs: "",
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
      initialValues={mixingDetails}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => {
        const type = editData.batchCode ? "Update" : "Add";
        handleSubmit(values, type);
        formikHelpers.resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom>
            Mixing
          </Typography>
          {(userDetails.role === "admin" ||
            userDetails.role === "supervisor") && (
            <Grid container spacing={2}>
              <Grid item xs={2} lg={2.5} sm={6}>
                <FormControl sx={{ minWidth: "15em" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Batch Code
                  </InputLabel>
                  <Field
                    as={Select}
                    name="batchCode"
                    labelId="demo-simple-select-helper-label"
                    error={touched.batchCode && !!errors.batchCode}
                    onChange={handleBatchCodeChange}
                    value={selectedBatchCode}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    {uniqueBatchCodes.map((e: any) => (
                      <MenuItem key={e} value={e}>
                        {e}
                      </MenuItem>
                    ))}
                  </Field>
                  <FormHelperText>
                    {touched.batchCode && errors.batchCode}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={2} lg={2.5} sm={6}>
                <FormControl sx={{ minWidth: "15em" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Batch No
                  </InputLabel>
                  <Field
                    as={Select}
                    name="batchNo"
                    labelId="demo-simple-select-helper-label"
                    error={touched.batchNo && !!errors.batchNo}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    {filteredBatchNo.map((e: any) => (
                      <MenuItem key={e} value={e.batchNo}>
                        {e.batchNo}
                      </MenuItem>
                    ))}
                  </Field>
                  <FormHelperText>
                    {touched.batchNo && errors.batchNo}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={2} lg={2.5} sm={6}>
                <FormControl sx={{ minWidth: "15em" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Select Item
                  </InputLabel>
                  {/* <FormControl fullWidth> */}
                  {/* <InputLabel id="dropdown-label">Select</InputLabel> */}
                  <Field
                    as={Select}
                    name="item"
                    labelId="demo-simple-select-helper-label"
                    error={touched.item && !!errors.item}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    {filteredBatchNo.map((e: any) => (
                      <MenuItem key={e} value={e.itemName}>
                        {e.itemName}
                      </MenuItem>
                    ))}
                  </Field>
                  <FormHelperText>{touched.item && errors.item}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Party"
                  name="party"
                  sx={{ minWidth: "15em" }}
                  error={touched.party && !!errors.party}
                  helperText={touched.party && errors.party}
                />
              </Grid>

              <Grid item xs={2} lg={2.5} sm={6}>
                <FormControl sx={{ minWidth: "15em" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Job Type
                  </InputLabel>
                  <Field
                    as={Select}
                    name="jobType"
                    labelId="demo-simple-select-helper-label"
                    error={touched.jobType && !!errors.jobType}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    <MenuItem value="Inhouse">Inhouse</MenuItem>
                    <MenuItem value="Third Party">Third Party</MenuItem>
                  </Field>
                  <FormHelperText>
                    {touched.jobType && errors.jobType}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={3} lg={2.5} sm={6}>
                <Field
                  as={TextField}
                  label="Total Kgs"
                  name="totalKgs"
                  sx={{ minWidth: "15em" }}
                  error={touched.totalKgs && !!errors.totalKgs}
                  helperText={touched.totalKgs && errors.totalKgs}
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
                      batchNo: "",
                      batchCode: "",
                      item: "",
                      party: "",
                      jobType: "",
                      totalKgs: "",
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

export default MixingForm;
