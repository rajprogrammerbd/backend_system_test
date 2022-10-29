import { User } from '../services/auth.services';
import mongoose from 'mongoose';
import request from 'supertest';
import { appPort } from '../../src/index';

const URL = process.env.MONGODB_ACCESS_URL as string;

beforeEach((done) => {
    mongoose.connect(URL).then(() => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        appPort.close();
        mongoose.connection.close(() => done());
    });
});

describe('Register route', () => {
    it('Should return email is required', async () => {
        const value = await request(appPort).post('/api/register');
        
        expect(value.statusCode).toBe(404);
        expect(value.body).toEqual({
            message: 'Email is required'
        });
    });

    it('Should return email validation error', async () => {
        const value = await request(appPort).post('/api/register').send({ email: 'rendom text' });

        expect(value.statusCode).toBe(500);
        expect(value.body).toEqual({
            message: 'Email is not validated'
        });
    });

    it('Should register the user account', async () => {
        const myEmail = 'demo@gmail.com';
        const value = await request(appPort).post('/api/register').send({ email: myEmail });

        expect(value.statusCode).toBe(200);
        expect(value.body).toEqual({
            email: myEmail,
            deposit: 0,
            id: 1            
        });

        const reTest = await request(appPort).post('/api/register').send({ email: myEmail });

        expect(reTest.statusCode).toBe(500);
        expect(reTest.body).toEqual({
            message: 'User already have an account'
        });

        await User.collection.deleteOne({ email: myEmail });
    });
});