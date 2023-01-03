export interface LoginDto {
  userId: number;
  userName: string;
  userPassword: string;
  userSex: number;
  userBirthday: string | null;
  userBirthplace: string | null;
  userEmail: string | null;
  userQq: string | null;
  userState: string;
  question: string | null;
  answer: string | null;
  userAvator: string | null;
  userTypeId: number | null;
}
