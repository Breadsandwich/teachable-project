export interface Course {
  id: number;
  name: string;
  heading: string;
  is_published: boolean;
  description: string | null;
  image_url: string;
}

export interface Enrollment {
  user_id: number;
  enrolled_at: string;
  completed_at: string | null;
  percent_complete: number;
  expires_at: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Student extends User {
  enrolled_at: string;
  completed_at: string | null;
  percent_complete: number;
}

export interface TeachableApiResponse<T> {
  courses?: T[];
  enrollments?: T[];
  users?: T[];
  meta?: {
    total: number;
    page: number;
    from: number;
    to: number;
    per_page: number;
    number_of_pages: number;
  };
}
