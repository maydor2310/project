import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CourseFile } from "../models/courseFile";

const filesRef = collection(db, "files");

export const getFiles = async (): Promise<CourseFile[]> => {
  const q = query(filesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<CourseFile, "id">),
  }));
};

export const createFile = async (file: Omit<CourseFile, "id">): Promise<void> => {
  await addDoc(filesRef, file);
};

export const deleteFile = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "files", id));
};
