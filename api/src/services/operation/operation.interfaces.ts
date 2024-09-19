import { OperationStatusesEnum } from './enums/operation-statuses.enum'

export interface IOperationBody {
  id: number
  data: Record<any, string>
}

export interface IOperationStatus {
  id: number
  status: OperationStatusesEnum
}

export interface IId {
  id: number
}
