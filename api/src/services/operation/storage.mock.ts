import { OperationStatusesEnum } from './enums/operation-statuses.enum'

export class StorageMock {
  private static _items: Record<string, OperationStatusesEnum> = {}

  public static clear(): void {
    this._items = {}
  }

  public static addItem(
    key: number | string,
    item: OperationStatusesEnum
  ): void {
    const actualKey = this._checkKeyType(key)
    this._items[actualKey] = item
  }

  public static getItem(key: number | string): OperationStatusesEnum {
    const actualKey = this._checkKeyType(key)
    return this._items[actualKey]
  }

  public static updateItem(
    key: number | string,
    item: OperationStatusesEnum
  ): void {
    const actualKey = this._checkKeyType(key)
    this._items[actualKey] = item
  }

  public static deleteAllExceptInProgress() {
    for (const id in this._items) {
      if (this._items[id] !== OperationStatusesEnum.inProgress) {
        delete this._items[id]
      }
    }
  }

  private static _checkKeyType(key: string | number): string {
    return typeof key === 'number' ? key.toString() : key
  }
}
