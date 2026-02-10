import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import type { AppUser } from "../models/appUser";

const usersRef = collection(db, "users");

export const getUsers = async (): Promise<AppUser[]> => {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AppUser, "id">),
  }));
};

export const createUser = async (
  email: string,
  password: string,
  userDoc: Omit<AppUser, "id" | "email">
): Promise<void> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(usersRef, {
    ...userDoc,
    email,
    uid: cred.user.uid,
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "users", id));
};
