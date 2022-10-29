import express from 'express';
import { validateEmail } from '../config/functions';
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

       res.json(await authServices.registerAUser(email));
    } catch (err: any) {
        res.status(500).send(err);
    }
}

export default {
    registerUsers,
};
