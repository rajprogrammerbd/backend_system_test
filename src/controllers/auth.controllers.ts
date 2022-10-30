import express from 'express';
import { validateEmail, typeCheck } from '../config/functions';
import authServices from '../services/auth.services';

async function registerUsers(req: express.Request, res: express.Response) {
    try {
        const { email } = req.body;

        if (email === undefined) {
            res.status(404).send({ message: 'Email is required' })
            return;
        }

        if (!validateEmail(email)) {
            res.status(500).send({ message: 'Email is not validated' });
            return;
        }

        // Check the types of user sends.
        const check = typeCheck(req.body);
        if (check) {
            res.send({ message: check }).end();
            return;
        }

       res.json(await authServices.registerAUser(email));
    } catch (err: any) {
        res.status(500).send(err);
    }
}

export default {
    registerUsers,
};
