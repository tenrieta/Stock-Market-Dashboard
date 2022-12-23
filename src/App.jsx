import React from "react";

// React-Redux
import { Provider } from "react-redux";

// Routing
import { Routes, Route } from "react-router-dom";

// Firebase and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { auth, readFirestore } from "./firebase";

// Bootstrap
import Header from "./components/Header";

// Components
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import { RequireAuth, RequireNotAuth } from "./components/ProtectedRoutes";

// Redux
import store from "./store";
import { setUser, unsetUser } from "./actions/userActions";

const App = function App() {
  // When Firebase finishes verifying the auth state, we can set our user state and turn off loading phase
  // Having loading phase here in AuthProvider prevents the App to blink at the initial paint
  const [initialLoading, setInitialLoading] = React.useState(true);
  React.useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          readFirestore(user).then((result) => {
            const data = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              firestore: result,
            };
            store.dispatch(setUser(data));
            setInitialLoading(false);
          });
        } else {
          store.dispatch(unsetUser());
          setInitialLoading(false);
        }
      }),
    []
  );

  return (
    <div>
      {!initialLoading && (
        <Provider store={store}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<RequireNotAuth />}>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<LogIn />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Provider>
      )}
    </div>
  );
};

export default App;
