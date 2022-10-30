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

test('Desposit api', async () => {
    const myEmail = 'demo@gmail.com';

    const user = await request(appPort).post('/api/register').send({ email: myEmail });

    const deposit_request_without_body = await request(appPort).post('/api/deposit');

    expect(deposit_request_without_body.statusCode).toBe(404);
    expect(deposit_request_without_body.body).toEqual({
        message: 'amount and user id is required'
    });

    const deposit_request_only_amount = await request(appPort).post('/api/deposit').send({ amount: 1 });
    expect(deposit_request_only_amount.statusCode).toBe(404);
    expect(deposit_request_only_amount.body).toEqual({
        message: 'User Id is required'
    });

    const deposit_request_only_userId = await request(appPort).post('/api/deposit').send({ userId: 1 });

    expect(deposit_request_only_userId.statusCode).toBe(404);
    expect(deposit_request_only_userId.body).toEqual({
        message: 'Amount is required'
    });

    const deposit_request_body_invalid = await request(appPort).post('/api/deposit').send({ userId: '1', amount: 'abc' });

    expect(deposit_request_body_invalid.statusCode).toBe(404);
    expect(deposit_request_body_invalid.body).toEqual({
        message: 'userId is not validate'
    });

    const deposit_negative_value = await request(appPort).post('/api/desposit').send({ userId: 1, amount: -1 });

    expect(deposit_negative_value.statusCode).toBe(404);

    const deposit_success = await request(appPort).post('/api/deposit').send({ userId: 1, amount: 1.5 });

    expect(deposit_success.statusCode).toBe(200);
    expect(deposit_success.body).toBe(1.5);

    await User.collection.deleteOne({ email: myEmail });
}, 5000);

// --------------------------------------------------------

test('Desposit api', async () => {
    const myEmail = 'demo@gmail.com';

    await request(appPort).post('/api/register').send({ email: myEmail });

    const withdraw_request_without_body = await request(appPort).post('/api/withdraw');

    expect(withdraw_request_without_body.statusCode).toBe(404);
    expect(withdraw_request_without_body.body).toEqual({
        message: 'withdraw amount and user id is required'
    });

    const withdraw_request_only_amount = await request(appPort).post('/api/withdraw').send({ amount: 1 });

    expect(withdraw_request_only_amount.statusCode).toBe(404);
    expect(withdraw_request_only_amount.body).toEqual({
        message: 'withdraw amount and user id is required'
    });

    const withdraw_request_only_userId = await request(appPort).post('/api/withdraw').send({ userId: 1 });

    expect(withdraw_request_only_userId.statusCode).toBe(404);
    expect(withdraw_request_only_userId.body).toEqual({
        message: 'Withdraw amount is required'
    });

    const withdraw_request_body_invalid = await request(appPort).post('/api/withdraw').send({ userId: '1', amount: 'abc' });

    expect(withdraw_request_body_invalid.statusCode).toBe(404);
    expect(withdraw_request_body_invalid.body).toEqual({
        message: 'Withdraw amount is required'
    });

    const withdraw_negative_value = await request(appPort).post('/api/withdraw').send({ userId: 1, amount: -1 });

    expect(withdraw_negative_value.statusCode).toBe(404);

    await request(appPort).post('/api/deposit').send({ userId: 1, amount: 1.5 });
    
    const withdraw_success = await request(appPort).post('/api/withdraw').send({ userId: 1, withdraw: 1 });

    expect(withdraw_success.statusCode).toBe(200);
    expect(withdraw_success.body).toBe(0.5);

    await User.collection.deleteOne({ email: myEmail });
}, 5000);