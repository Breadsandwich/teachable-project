import React from 'react';
import { useCourses } from '../../hooks/useTeachable';
import CourseCard from '../CourseCard/CourseCard';
import './CoursesList.css';

const CoursesList: React.FC = () => {
  const { courses, loading } = useCourses();

  // Separate published and unpublished courses
  const publishedCourses = courses.filter(course => course.is_published);
  const unpublishedCourses = courses.filter(course => !course.is_published);

  return (
    <div className="courses-container">
      <header className="courses-header">
        <h1 className="courses-title">Your Teachable Courses</h1>
      </header>

      {loading && <p className="courses-message">Loading courses...</p>}

      {!loading && courses.length === 0 && (
        <p className="courses-message">No courses found.</p>
      )}

      {publishedCourses.length > 0 && (
        <div className="published-courses-section">
          <h2 className="section-title">Published Courses</h2>
          {publishedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {unpublishedCourses.length > 0 && (
        <div className="unpublished-courses-section">
          <h2 className="section-title unpublished">Unpublished Courses</h2>
          {unpublishedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
