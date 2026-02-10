import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type CourseFile = {
  id?: string;
  courseId: string;
  displayName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl: string;
  createdAt: number;
};

const ref = collection(db, "courseFiles");

export const getCourseFiles = async (): Promise<CourseFile[]> => {
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CourseFile, "id">) }));
};

export const createCourseFile = async (file: Omit<CourseFile, "id">): Promise<void> => {
  await addDoc(ref, file);
};

export const removeCourseFile = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "courseFiles", id));
};
