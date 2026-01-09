import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Course } from "../models/course";

const coursesRef = collection(db, "courses");

// READ
export const getCourses = async (): Promise<Course[]> => {
  const snapshot = await getDocs(coursesRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Course, "id">),
  }));
};

// CREATE
export const createCourse = async (
  course: Omit<Course, "id">
): Promise<void> => {
  await addDoc(coursesRef, course);
};

// UPDATE
export const updateCourse = async (
  id: string,
  course: Omit<Course, "id">
): Promise<void> => {
  await updateDoc(doc(db, "courses", id), course);
};

// DELETE
export const removeCourse = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "courses", id));
};
