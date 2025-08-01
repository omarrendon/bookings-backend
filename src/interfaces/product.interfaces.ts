export interface IProduct {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  gallery_images?: string[];
  business_id: number; // Assuming this is a foreign key to a Business model
  category_id?: number; // Assuming this is a foreign key to a Category model
  estimated_delivery_time: number;
}
