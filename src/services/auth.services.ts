import Database from "../config/db.config";
import userSchma from "../config/schemas/user";

export const User = Database.prepare(userSchma, 'user_accounts');

function registerAUser(email: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    await User.find({ email }).then(async (user: any) => {
      if (user.length > 0) {
        reject({ message: 'User already have an account' });
      } else {
        const new_user = new User({ email, deposit: 0, id: await User.countDocuments({}) + 1 });

        const res = await new_user.save();
        resolve({ email: res.email, deposit: res.deposit, id: res.id });
      }
    });
  });
}
  
export default {
  registerAUser,
};
  