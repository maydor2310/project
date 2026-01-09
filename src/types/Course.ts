export type Course = {
  id?: string;      // firestore document id
  name: string;
  teacher: string;
  credits: number;
};
