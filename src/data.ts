import * as faker from 'faker';

export interface UserData {
  id: number;
  name: string;
  email: string;
}

export const users: UserData[] = Array(10)
  .fill(null)
  .map(
    (_, idx): UserData => {
      const firstName: string = faker.name.firstName();
      const lastName: string = faker.name.lastName();
      const name = firstName + ' ' + lastName;
      const email = faker.internet.email(firstName, lastName).toLowerCase();

      return {
        id: idx,
        name,
        email,
      };
    }
  );
