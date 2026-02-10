import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import type { User } from "../models/user";

const usersRef = collection(db, "users");

export const createAppUserWithAuth = async (params: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}): Promise<void> => {
  const { email, password, fullName, phone } = params;

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const payload: Omit<User, "id"> = {
    uid: cred.user.uid,
    fullName,
    email,
    phone,
    createdAt: Date.now(),
  };

  await addDoc(usersRef, payload);
};

export const getUsers = async (): Promise<User[]> => {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<User, "id">),
  }));
};

export const removeUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "users", id));
};
