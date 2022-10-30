import express from 'express';
import { typeCheck } from '../config/functions';
import appServices from '../services/app.services';
import { Deposit_amount } from '../config/interfaces';

async function deposit_amount(req: express.Request, res: express.Response) {
    try {
        const { amount, userId } = req.body as Deposit_amount;

        if (amount === undefined && userId === undefined) {
            res.status(404).send({ message: 'amount and user id is required' })
            return;
        }

        if (amount === undefined && userId !== undefined) {
            res.status(404).send({ message: 'Amount is required' });
            return;
        }

        if (amount !== undefined && userId === undefined) {
            res.status(404).send({ message: 'User Id is required' });
            return;
        }

        // Check the types of user sends.
        const check = typeCheck(req.body);
        if (check) {
            res.status(404).send({ message: check }).end();
            return;
        }

        if (amount <= 0) {
            res.status(404).send({ message: "Amount can't be invalid" }).end();
            return;
        }

       res.json(await appServices.deposit({ amount, userId }));

    } catch (err: any) {
        res.status(500).send(err);
    }
}

async function withDraw_amount(req: express.Request, res: express.Response) {
    // appServices.withdraw()
}

export default {
    deposit_amount,
    withDraw_amount
};
