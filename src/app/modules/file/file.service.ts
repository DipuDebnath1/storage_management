import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { TFile } from "./file.interface";
import { FileCollection } from "./file.model";

const uploadFile = async (payload:TFile) => {
    const res = await FileCollection.create(payload)
    if (!res) {
        throw new AppError(httpStatus.BAD_REQUEST, 'file create failed')
    }
    return res
}






export const fileService = {
    uploadFile,
}