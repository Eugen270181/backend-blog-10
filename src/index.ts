import {Request, Response} from 'express'
import {db} from "./common/module/db/db";
import {appConfig} from './common/settings/config'
import {initApp} from "./initApp";
import {routersPaths} from "./common/settings/paths";
import {jwtServices} from "./common/adapters/jwtServices";
import {JwtPayload} from "jsonwebtoken";

const app = initApp()

app.get(routersPaths.common, (req:Request, res:Response) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({version: '1.0'})
})

const startApp = async () => {
    await db.run(appConfig.MONGO_URI)
    app.listen(appConfig.PORT, () => {
        console.log(`Example app listening on port ${appConfig.PORT}`)
    })
    return app
}

export class CreateUserDto {
    constructor(
        public name:string,
        public role:boolean
    ) {}
    //...
}

class User {
    private static numberOfInstances: number = 0;
    public createdAt:string = ``;

    constructor() {
        User.numberOfInstances++
    }

    static createUser(args: CreateUserDto): User | null {
        try {
            // Проверка роли
            if (!args.role) {
                throw new Error(`Не хватает прав для создания юзера у ${args.name}!`);
            }

            const user = new this(); // new this() вызывает конструктор
            user.createdAt = new Date().toISOString();
            // другая логика создания пользователя

            return user;
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : (error instanceof Error ? error.message : 'Неизвестная ошибка');
            console.error(`Ошибка при создании пользователя: ${errorMessage}`);
            return null; // Возвращаем null в случае ошибки
        }
    }

    static getInstanceCount(): number {
        return User.numberOfInstances; // Публичный статический метод для доступа к приватному статическому свойству
    }
}

const newUserDto1 = new CreateUserDto('Eugen', true)
const newUserDto2 = new CreateUserDto('Lena', false)


const newUser1 = new User()
const newUser2 = User.createUser(newUserDto1)
const newUser3 = User.createUser(newUserDto2)

console.log(`Count of instance is ${User.getInstanceCount()}`)

startApp();
