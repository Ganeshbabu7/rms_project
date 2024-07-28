import "./App.css";
import Faq from "./pages/FAQ/Faq";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Mixing from "./pages/Mixing/Mixing";
import MixingFormula from "./pages/MixtureFormula/MixingFormula";
import ForgetPassword from "./pages/ForgetPassword";
import ToolsRegistry from "./pages/ToolsRegistry/ToolsRegistry";
import RawMaterial from "./pages/RawMaterialRegistry/RawMaterial";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BatchCodeRegistry from "./pages/BatchCodeRegistry/BatchCodeRegistry";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/v1/faq" element={<Faq />} />
        <Route path="/v1/mixing" element={<Mixing />} />
        <Route path="/v1/sign-in" element={<SignIn />} />
        <Route path="/v1/sign-up" element={<SignUp />} />
        <Route path="/v1/forget-password" element={<ForgetPassword />} />
        <Route path="/v1/tools-registry" element={<ToolsRegistry />} />
        <Route path="/v1/mixture-formula" element={<MixingFormula />} />
        <Route path="/v1/rawmaterial-registry" element={<RawMaterial />} />
        <Route path="/v1/batch-code-registry" element={<BatchCodeRegistry />} />
        <Route path="/*" element={<Navigate to={"/v1/sign-in"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
