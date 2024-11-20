import {Response, Request} from 'express'
import {db} from "../../../common/module/db/db";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
export const clearDBTestingController = async (req: Request, res: Response) => {
    await db.drop();
    res.sendStatus(HttpStatus.NoContent)
}