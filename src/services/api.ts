import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Course, Enrollment, Student, TeachableApiResponse, User } from '../types';

const API_URL = 'https://developers.teachable.com/v1';

const createApiClient = (): AxiosInstance => {
  if (!process.env.REACT_APP_API_KEY) {
    console.error('REACT_APP_API_KEY is not defined in environment variables');
  }

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'accept': 'application/json',
      'apiKey': process.env.REACT_APP_API_KEY
    },
    timeout: 15000
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: AxiosError) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);

        switch (error.response.status) {
          case 401:
            console.error('Authentication error - please check your API key');
            break;
          case 403:
            console.error('Authorization error - insufficient permissions');
            break;
          case 429:
            console.error('Rate limit exceeded - please try again later');
            break;
          default:
            console.error(`API error: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const apiClient = createApiClient();

export const fetchCourses = async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get('/courses');

      return response.data.courses.sort((a: Course, b: Course) => {
        if (a.is_published && !b.is_published) return -1;
        if (!a.is_published && b.is_published) return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

export const fetchCourseEnrollments = async (courseId: number): Promise<Enrollment[]> => {
  try {
    const response = await apiClient.get<TeachableApiResponse<Enrollment>>(`/courses/${courseId}/enrollments`);
    return response.data.enrollments || [];
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error);
    throw error;
  }
};

export const fetchUserDetails = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
    };
  } catch (error) {
    console.error(`Error fetching user details for user ${userId}:`, error);

    return {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@unknown.com`,
    };
  }
};

export const fetchCourseStudents = async (courseId: number): Promise<Student[]> => {
  try {
    const enrollments = await fetchCourseEnrollments(courseId);

    const studentsPromises = enrollments.map(async (enrollment) => {
      try {
        const user = await fetchUserDetails(enrollment.user_id);

        return {
          ...user,
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          percent_complete: enrollment.percent_complete
        };
      } catch (err) {
        console.error(`Failed to fetch details for user ${enrollment.user_id}`, err);

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
    });

    return Promise.all(studentsPromises);
  } catch (error) {
    console.error(`Error fetching students for course ${courseId}:`, error);
    throw error;
  }
};
