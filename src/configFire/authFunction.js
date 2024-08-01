import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  //   sendPasswordResetEmail,
  //   updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const CreateUser = async (email, password, firstName, lastName, age) => {
  // إنشاء مستخدم باستخدام البريد الإلكتروني وكلمة المرور
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // إضافة البيانات الإضافية إلى Firestore
  await setDoc(doc(db, "users", user.uid), {
    firstName,
    lastName,
    age,
    email: user.email,
  });

  return userCredential;
};

export const SignIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const SignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log(user);
};

export const SignOut = () => {
  return auth.signOut();
};

// export const doPasswordReset = (email) => {
//   return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = (password) => {
//   return updatePassword(auth.currentUser, password);
// };
