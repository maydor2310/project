export type Teacher = { // comment: teacher entity
  id: string; // comment: unique id
  fullName: string; // comment: teacher full name
  email: string; // comment: teacher email
  courseIds: string[]; // comment: ids of assigned courses
  createdAt: number; // comment: creation timestamp
};
