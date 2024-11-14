import { AsyncLocalStorage } from 'async_hooks'
import { StoreContextType } from '@/shared/interfaces'

export class AsyncRequestContext {
  constructor(
    readonly asyncLocalStorage: AsyncLocalStorage<StoreContextType>,
  ) {}

  getRequestIdStore(): StoreContextType | undefined {
    return this.asyncLocalStorage.getStore()
  }

  set(context: StoreContextType | undefined): boolean {
    try {
      if (context) {
        this.asyncLocalStorage.enterWith(context)
      }

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  exit(): void {
    this.set(undefined)
  }
}
