export interface IBusinessBody {
  id?: string; // Optional, for updates
  name: string;
  description?: string;
  phone_number?: string;
  website?: string;
  street: string;
  external_number: string;
  internal_number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip_code: string;
  is_verified?: boolean;
  country?: string;
  hours_of_operation?: {
    day:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday";
    open: string; // HH:mm format
    close: string; // HH:mm format
  }[];
  social_links?: {
    platform: string;
    url: string;
  }[];
  raiting?: number;
  owner_id: string; // Assuming this is the ID of the user who owns the business
  main_image_url?: string;
  gallery_images?: string[];
}
