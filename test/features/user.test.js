
const expect = require("expect");
const request = require('supertest');
const jwt = require('jsonwebtoken');
require('../helpers');
const User = require("../../models/user");
const app = require("../../app");
const userSerializer = require('../../serializers/user')

describe('User', () => {
    it('can signup and receive a JWT', async () => {

        const res = await request(app)
            .post('/users')
            .send({
                firstName: 'Elowyn',
                lastName: 'Platzer Bartel',
                email: 'elowyn@example.com',
                birthYear: 2015,
                student: true,
                password: 'password',
            })
            .expect(200);

        expect(res.body.jwt).not.toBe(undefined);
        expect(res.body.user.id).not.toBe(undefined);
        expect(res.body.user.firstName).toEqual('Elowyn');
        expect(res.body.user.lastName).toEqual('Platzer Bartel');
        expect(res.body.user.email).toEqual('elowyn@example.com');
        expect(res.body.user.birthYear).toEqual(2015);
        expect(res.body.user.student).toEqual(true);

        expect(res.body.user.passwordDigest).toEqual(undefined);
        expect(res.body.user.createdAt).toEqual(undefined);
        expect(res.body.user.updatedAt).toEqual(undefined);
    });
    // it('can be listed, without users and with one added', async () => {
    //     const resNoUsers = await request(app)
    //         .get('/users')
    //         .expect(404);
    //     expect(resNoUsers.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    //     await User.create({
    //         firstName: 'Elowyn',
    //         lastName: 'Platzer Bartel',
    //         email: 'elowyn@example.com',
    //         birthYear: 2015,
    //         student: true,
    //         password: 'password',
    //     })

    //     const resWithUsers = await request(app)
    //         .get('/users')
    //         .expect(404);

    //     expect(resWithUsers.body.users.length).toEqual(1);
    //     const newUser = resWithUsers.body.users[0]
    //     expect(resWithUsers.jwt).toBe(undefined);
    //     expect(newUser.id).not.toBe(undefined);
    //     expect(newUser.firstName).toEqual('Elowyn');
    //     expect(newUser.lastName).toEqual('Platzer Bartel');
    //     expect(newUser.email).toEqual('elowyn@example.com');
    //     expect(newUser.birthYear).toEqual(2015);
    //     expect(newUser.student).toEqual(true);

    //     expect(newUser.passwordDigest).toEqual(undefined);
    //     expect(newUser.createdAt).toEqual(undefined);
    //     expect(newUser.updatedAt).toEqual(undefined);
    // });
    it('can be listed for a logged in user', async () => {
        const user = await User.create({
            firstName: 'Elowyn',
            lastName: 'Platzer Bartel',
            email: 'elowyn@example.com',
            birthYear: 2015,
            student: true,
            password: 'password',
        });
        serializedUser = await userSerializer(user);
        token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

        const resNotLoggedIn = await request(app)
            .get('/users')
            .expect(404);

        const resLoggedIn = await request(app)
            .get('/users')
            .set('jwt', token)
            .expect(200);

        expect(resLoggedIn.body.users.length).toEqual(1);
        const newUser = resLoggedIn.body.users[0]
        expect(resLoggedIn.jwt).toBe(undefined);
        expect(newUser.id).not.toBe(undefined);
        expect(newUser.firstName).toEqual('Elowyn');
        expect(newUser.lastName).toEqual('Platzer Bartel');
        expect(newUser.email).toEqual('elowyn@example.com');
        expect(newUser.birthYear).toEqual(2015);
        expect(newUser.student).toEqual(true);
        expect(newUser.passwordDigest).toEqual(undefined);
        expect(newUser.createdAt).toEqual(undefined);
        expect(newUser.updatedAt).toEqual(undefined);
    });
    it.only('can be shown for a logged in user only', async () => {
        const user = await User.create({
            firstName: 'Elowyn',
            lastName: 'Platzer Bartel',
            email: 'elowyn@example.com',
            birthYear: 2015,
            student: true,
            password: 'password',
        });
        serializedUser = await userSerializer(user);
        token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

        const resNotLoggedIn = await request(app)
            .get(`/users/${user.id}`)
            .expect(404);

        const resLoggedIn = await request(app)
            .get(`/users/${user.id}`)
            .set('jwt', token)
            .expect(200);

        const showUser = resLoggedIn.body.user;
        expect(resLoggedIn.jwt).toBe(undefined);
        expect(showUser.id).not.toBe(undefined);
        expect(showUser.firstName).toEqual('Elowyn');
        expect(showUser.lastName).toEqual('Platzer Bartel');
        expect(showUser.email).toEqual('elowyn@example.com');
        expect(showUser.birthYear).toEqual(2015);
        expect(showUser.student).toEqual(true);

        expect(showUser.passwordDigest).toEqual(undefined);
        expect(showUser.createdAt).toEqual(undefined);
        expect(showUser.updatedAt).toEqual(undefined);

        const resLoggedInWrongId = await request(app)
            .get(`/users/${user.id + 10}`)
            .set('jwt', token)
            .expect(404);

    });
});