import React, { useState } from "react";
import InputPassword from "../components/InputPassword";
import InputName from "../components/InputName";
import InputEmail from "../components/InputEmail";
import "../App.css";
import ButtonComponent from "../components/ButtonComponent";
import { NavLink } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "guest",
        createdAt: new Date()
      });

      alert("Account Created and Data Saved to Firestore");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="container-page">
        <h2 className="container-page-heading">Create an Account</h2>
        <InputName value={name} onChange={(e) => setName(e.target.value)} />
        <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <ButtonComponent title="Sign Up" onClick={handleSignup} />

        <div className="already-container">
          <p>Already have an Account?</p>
          <p className="signin-link">
            <NavLink to="/signin">SignIn</NavLink>
          </p>
        </div>
      </div>
    </>
  );
}
