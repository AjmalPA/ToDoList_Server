const expect = require("expect");
const User = require("../../models/user");

describe('User', () => {
    it('can be created', async () => {
        const usersBefore = await User.all();
        expect(usersBefore.length).toBe(0);

        await User.create({
            firstName: 'Elowyn',
            lastName: 'Platzer Bartel',
            email: 'elowyn@example.comm',
            birthYear: 2015,
            student: true,
            password: 'password',
        });

        const usersAfter = await User.all();
        expect(usersAfter.length).toBe(1);
    });
    it('can be found by property', async () => {
        const user = await User.create({
            firstName: 'Elowyn',
            lastName: 'Platzer Bartel',
            email: 'elowyn@example.com',
            birthYear: 2015,
            student: true,
            password: 'password',
        });

        const foundUser = await User.findBy({ email: 'elowyn@example.com' });
        expect(foundUser.firstName).toEqual('Elowyn');
        expect(foundUser.lastName).toEqual('Platzer Bartel');
        expect(foundUser.email).toEqual('elowyn@example.com');
        expect(foundUser.birthYear).toEqual(2015);
        expect(foundUser.student).toEqual(true);
    });
    it('must have unique email', async () => {
        await User.create({
            firstName: 'Elowyn',
            lastName: 'Platzer Bartel',
            email: 'elowyn@example.com',
            birthYear: 2015,
            student: true,
            password: 'password',
        });
        const duplicateUser = await User.create({
            firstName: 'Elowyn',
            lastName: 'Platzer Bartel',
            email: 'elowyn@example.com',
            birthYear: 2015,
            student: true,
            password: 'password',
        });

        expect(duplicateUser).toEqual(['Email already taken'])
        const users = await User.all();
        expect(users.length).toBe(1);
    });
    it('can be found by id', async () => {
        const user = await User.create({
          firstName: 'Elowyn',
          lastName: 'Platzer Bartel',
          email: 'elowyn@example.com',
          birthYear: 2015,
          student: true,
          password: 'password',
        });
      
        const foundUser = await User.find(user.id);
        expect(foundUser.firstName).toEqual('Elowyn');
        expect(foundUser.lastName).toEqual('Platzer Bartel');
        expect(foundUser.email).toEqual('elowyn@example.com');
        expect(foundUser.birthYear).toEqual(2015);
        expect(foundUser.student).toEqual(true);
      });
});