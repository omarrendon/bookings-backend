export interface IScheduleDay {
  id: string | number;
  day: string;
  open_time: string;
  close_time: string;
  [key: string]: any;
}

export interface IReservationProductInput {
  product_id: string;
  quantity: number;
}

export interface IReservationData {
  business_id: string;
  products: IReservationProductInput[];
  [key: string]: any;
}
