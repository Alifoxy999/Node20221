import { ApiError } from "../errors/api.error";
import { User } from "../models/user.model";
import { IUser } from "../types/user.types";

class UserService {
    public async getAll(): Promise<IUser[]> {
        try {
            return User.find();
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }

    public async getById(id: string): Promise<IUser> {
        try {
            return user.findById(id);
        } catch (e) {
            throw new ApiError(e.message, e.status);
        }
    }
}

export const userService = new UserService();