import {Response} from 'express'
import {usersQueryRepository} from "../repositories/usersQueryRepository";
import {querySortSanitizer} from "../../../common/module/querySortSanitizer";
import {SortQueryFilterType} from "../../../common/types/sortQueryFilter.type";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithQuery} from "../../../common/types/requests.type";
import {UsersQueryFieldsType} from "../types/usersQueryFields.type";
import {Pagination} from "../../../common/types/pagination.type";
import {UserOutputModel} from "../types/output/userOutput.type";
import {UsersQueryFilterType} from "../types/usersQueryFilter.type";

export const getUsersController = async (req : RequestWithQuery<UsersQueryFieldsType>, res : Response<Pagination<UserOutputModel[]>>) => {
    const sanitizedSortQuery:SortQueryFilterType = querySortSanitizer(req.query)
    const searchLoginTerm = req.query.searchLoginTerm;
    const searchEmailTerm = req.query.searchEmailTerm;
    const usersQueryFilter:UsersQueryFilterType = {searchLoginTerm, searchEmailTerm, ...sanitizedSortQuery}

    const foundUsers = await usersQueryRepository.getMapUsers(usersQueryFilter)
    return res.status(HttpStatus.Success).send(foundUsers)
}