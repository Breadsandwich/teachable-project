import axios, { AxiosError } from 'axios';
import { Course, Enrollment, Student, TeachableApiResponse, User } from '../types';

const API_URL = 'https://developers.teachable.com/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'accept': 'application/json',
    'apiKey': process.env.REACT_APP_API_KEY
  }
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export const fetchCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get('/courses');
  return response.data.courses.sort((a: Course, b: Course) =>
    a.is_published === b.is_published ? a.name.localeCompare(b.name) : b.is_published ? 1 : -1
  );
};

export const fetchCourseEnrollments = async (courseId: number): Promise<Enrollment[]> => {
  const response = await apiClient.get<TeachableApiResponse<Enrollment>>(`/courses/${courseId}/enrollments`);
  return response.data.enrollments || [];
};

export const fetchUserDetails = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email
    };
  } catch {
    return {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@unknown.com`
    };
  }
};

// using fetchCourseEnrollments and fetchUserDetails combine data into a Student object
export const fetchCourseStudents = async (courseId: number): Promise<Student[]> => {
  const enrollments = await fetchCourseEnrollments(courseId);

  return Promise.all(enrollments.map(async enrollment => {
    try {
      const user = await fetchUserDetails(enrollment.user_id);
      return {
        ...user,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        percent_complete: enrollment.percent_complete
      };
    } catch {
      return {
        id: enrollment.user_id,
        name: `Student ${enrollment.user_id}`,
        email: `student${enrollment.user_id}@example.com`,
        role: 'student',
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        percent_complete: enrollment.percent_complete
      };
    }
  }));
};
