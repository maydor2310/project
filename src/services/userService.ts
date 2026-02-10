import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db, secondaryAuth } from "../firebase/firebase";

export type AppUser = {
  id?: string;
  authUid: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  createdAt: number;
};

const ref = collection(db, "appUsers");

export const getAppUsers = async (): Promise<AppUser[]> => {
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AppUser, "id">) }));
};

export const createAppUserWithAuth = async (input: {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  password: string;
}): Promise<void> => {
  const cred = await createUserWithEmailAndPassword(secondaryAuth, input.email, input.password);

  const payload: Omit<AppUser, "id"> = {
    authUid: cred.user.uid,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    age: input.age,
    city: input.city,
    createdAt: Date.now(),
  };

  await addDoc(ref, payload);
};

export const removeAppUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "appUsers", id));
};
