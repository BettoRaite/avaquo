import { useState, useEffect } from "react";
import { auth, provider } from "./firebaseconfig";
import {
  getRedirectResult,
  signInWithRedirect,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setRefetch(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!refetch) {
        return;
      }
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
      }
    };

    fetchUser();
  }, [refetch]);

  const handleSignIn = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (redirectError) {
      console.error("Redirect failed, trying popup:", redirectError);

      try {
        const popupResult = await signInWithPopup(auth, provider);
        setUser(popupResult.user);
      } catch (popupError) {
        console.error("Popup sign-in also failed:", popupError);
      }
    }
  };

  return (
    <div className="App">
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={() => auth.signOut()}>Sign out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
    </div>
  );
}

export default App;
