import { IUser } from "../../interfaces/user";

declare global{
    namespace Express {
        interface Request {
            currentUser: IUser
        }
    }
}