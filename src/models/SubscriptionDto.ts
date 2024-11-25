export type SubscriptionDto = {
    id: number
    subscriptionId:number
    name: string
    userId: number
    billType: BillType
    status: SubscriptionStatus
    price: number
    startDate: Date
    endDate: Date
    cancelDate?:Date
    features: FeatureDto[]
  }
  export type FeatureDto = {
    id: number
    name: string
    description: string
  }
  enum BillType {
    Monthly= 'Monthly',
    Yearly= 'Yearly',
    LifeTime= 'LifeTime'
  }
  export enum SubscriptionStatus {
    InActive= 'InActive',
    Active= 'Active',
    Cancel= 'Cancel'
  }