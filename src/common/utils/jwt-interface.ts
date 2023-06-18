export interface Payload {
  id: number;
  email: string;
  [key: string]: any; // For additional properties if they exist.
}
