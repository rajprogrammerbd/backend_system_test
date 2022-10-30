import { Deposit_amount } from './../config/interfaces';
import Database from "../config/db.config";
import userSchma from "../config/schemas/user";
import { Mongoose } from 'mongoose';

export const User = Database.prepare(userSchma, 'user_accounts');

function withdraw(email: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    await User.find({ email }).then(async (user: any) => {
        
    });
  });
}

function deposit(body: Deposit_amount) {
    return new Promise(async (resolve, reject) => {
        const { amount, userId } = body;

        await User.find({ id: userId }).then(async (users: any) => {
            if (users.length === 0) {
                reject({ message: "User not found" });
            } else if (users.length > 1) {
                reject({ message: 'Internal Error' });
            } else {
                const currentUser = users[0];

                currentUser.deposit += amount;

                const res = await currentUser.save();

                resolve(res.deposit);
            }
        }).catch((err: any) => reject(err));
    })
}
  
export default {
    withdraw,
    deposit
};
  