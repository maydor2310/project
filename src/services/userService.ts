import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import type { User } from "../models/user";

const usersRef = collection(db, "users");

export const getUsers = async (): Promise<User[]> => {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<User, "id">),
  }));
};

export const createUser = async (
  email: string,
  password: string,
  userData: Omit<User, "id" | "uid" | "email">
): Promise<void> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await addDoc(usersRef, {
    ...userData,
    email,
    uid: cred.user.uid,
    createdAt: Date.now(),
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "users", id));
};
