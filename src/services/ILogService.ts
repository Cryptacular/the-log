import { ILog } from "../models/ILog";

export interface ILogService {
  GetAll(): ILog[];
}
