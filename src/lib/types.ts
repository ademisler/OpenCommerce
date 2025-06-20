export interface Product {
  id: number;
  name: string;
  stock: number;
  image: string;
  categories: string[];
  weight: string;
  dimensions: { length: string; width: string; height: string };
  price: number;
  ean: string;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  date_created: string;
  shipping_company?: string;
  tracking_number?: string;
}
