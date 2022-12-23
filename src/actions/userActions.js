// Firebase and Firestore
import {
  reauthenticateWithCredential,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";

// Custom initialization for Firebase and Firestore
import { auth } from "../firebase";

import { UNSET_USER, SET_USER } from "./types";

export const unsetUser = () => ({
  type: UNSET_USER,
});

export const setUser = (data) => ({
  type: SET_USER,
  payload: data,
});

export const updateUser = (formData, setFormData, firestore) => (dispatch) => {
  // First, we need to verify the user token with Firebase
  // So the user needs to re-fill his old password to confirm identity
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    formData.oldPassword
  );
  reauthenticateWithCredential(auth.currentUser, credential)
    // After the user has been verified, we start checking one by one different account updates
    // These updates are divided due to the way Firebase works
    // We need to chain these async events
    .then(() =>
      // Changing email
      formData.email !== auth.currentUser.email
        ? updateEmail(auth.currentUser, formData.email)
        : true
    )
    .then(() =>
      // Changing passwords
      formData.newPassword1
        ? updatePassword(auth.currentUser, formData.newPassword1)
        : true
    )
    .then(() =>
      // Changing displayName or photoURL
      updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      })
    )
    .then(() => {
      // Once we changed everything needed, we can update our Form
      setFormData((prevState) => ({
        ...prevState,
        formSuccess: "Changes to your profile were saved.",
      }));
      // And compose data for Redux
      const dataForRedux = {
        uid: auth.currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
        firestore,
      };
      // Dispatch
      dispatch({
        type: SET_USER,
        payload: dataForRedux,
      });
    })
    .catch((firebaseError) => {
      // If there is an error, we show it in the form
      setFormData((prevState) => ({
        ...prevState,
        formError: `There was an error: ${firebaseError.code}.`,
      }));
    })
    .finally(() => {
      // We also set a timer to clean the form messages
      setTimeout(() => {
        setFormData((prevState) => ({
          ...prevState,
          formError: "",
          formSuccess: "",
          formLoading: false,
          formValidated: false,
        }));
      }, 3000);
    });
};
