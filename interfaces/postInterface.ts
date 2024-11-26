//postInterface.ts
export interface PostProps {
  id?: string; // ID del documento en Firebase
  restaurantId: string; // ID del restaurante al que pertenece la publicación
  address: string;
  description: string;
  image: string;
  date?: Date | string;
  username?: string;
  postedBy?: string;
  likes?: number;
}

export interface DefaultResponse {
  isSuccess: boolean;
  message: string;
}