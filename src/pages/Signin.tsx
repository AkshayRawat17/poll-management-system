import React, { useState } from "react";
import InputPassword from "../components/InputPassword";
import InputEmail from "../components/InputEmail";
import "../App.css";
import ButtonComponent from "../components/ButtonComponent";
import { NavLink, useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Signin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/guest");
        }
      } else {
        setError("User role not found in Firestore.");
      }
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="container-page">
          <h2 className="container-page-heading">Sign In Your Account</h2>

          <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputPassword value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="error-message">{error}</p>}

          <ButtonComponent title="Sign In" onClick={handleSignin} />

          <div className="already-container">
            <p>Don’t have an Account?</p>
            <p className="signin-link">
              <NavLink to="/">Sign Up</NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
