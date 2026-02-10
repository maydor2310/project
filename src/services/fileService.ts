import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CourseFile } from "../models/courseFile";

const courseFilesRef = collection(db, "courseFiles");

export const getCourseFiles = async (courseId?: string): Promise<CourseFile[]> => {
  const q = courseId
    ? query(courseFilesRef, where("courseId", "==", courseId), orderBy("createdAt", "desc"))
    : query(courseFilesRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<CourseFile, "id">),
  }));
};

export const createCourseFile = async (file: Omit<CourseFile, "id">): Promise<void> => {
  await addDoc(courseFilesRef, file);
};

export const removeCourseFile = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "courseFiles", id));
};
