import UserModel from "../../database/models/user.model";

export class UserService {
    public async findUserById(userId:string) {
        const user = await UserModel.findById(userId, {
            passsword:false
        });

        return user || null;
    }
}