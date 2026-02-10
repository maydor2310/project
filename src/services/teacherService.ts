import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type Teacher = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  courseIds: string[];
  createdAt: number;
};

const ref = collection(db, "teachers");

export const getTeachers = async (): Promise<Teacher[]> => {
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Teacher, "id">) }));
};

export const createTeacher = async (teacher: Omit<Teacher, "id">): Promise<void> => {
  await addDoc(ref, teacher);
};

export const removeTeacher = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "teachers", id));
};
