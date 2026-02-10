import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Teacher } from "../models/teacher";

const teachersRef = collection(db, "teachers");

export const getTeachers = async (): Promise<Teacher[]> => {
  const q = query(teachersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Teacher, "id">),
  }));
};

export const createTeacher = async (teacher: Omit<Teacher, "id">): Promise<void> => {
  await addDoc(teachersRef, teacher);
};

export const deleteTeacher = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "teachers", id));
};
