import { useState, useEffect, useRef } from 'react';
import { Course, Student } from '../types';
import { fetchCourses, fetchCourseStudents } from '../services/api';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await fetchCourses();
        setCourses(coursesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch courses. Please check your API key and try again.');
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  return { courses, loading, error };
};

/**
 * Hook to fetch students enrolled in a specific course
 * Now supports pre-fetching on hover
 */
export const useCourseStudents = (courseId: number) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedCourseIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!courseId) return;
    if (fetchedCourseIds.current.has(courseId)) return;

    const getStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await fetchCourseStudents(courseId);
        setStudents(studentsData);
        setError(null);

        // Mark this courseId as fetched
        fetchedCourseIds.current.add(courseId);
      } catch (err) {
        setError('Failed to fetch enrolled students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [courseId]);

  return { students, loading, error };
};
