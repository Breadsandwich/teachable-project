import React, { useState, useRef } from 'react';
import { Course } from '../../types';
import StudentList from '../StudentList/StudentList';
import { useCourseStudents } from '../../hooks/useTeachable';
import './CourseCard.css';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [showStudents, setShowStudents] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const shouldFetch = showStudents || isHovering;
  const { students, loading, error } = useCourseStudents(shouldFetch ? course.id : 0);

  const handleToggleStudents = () => {
    setShowStudents(!showStudents);
  };

  // pre-fetch data on hover
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={`course-card ${!course.is_published ? 'unpublished' : ''}`}>
      <div className="course-header">
        {course.image_url && (
          <img
            className="course-image"
            src={course.image_url}
            alt={`${course.name} course`}
          />
        )}
        <div className="course-info">
          <h2 className="course-title">
            {course.name}
            {!course.is_published && <span className="unpublished-badge">Unpublished</span>}
          </h2>
          <p className="course-heading">{course.heading}</p>
        </div>
      </div>

      <button
        ref={buttonRef}
        className={`view-students-button ${showStudents ? 'active' : ''} ${!course.is_published ? 'unpublished-button' : ''}`}
        onClick={handleToggleStudents}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={showStudents}
      >
        {showStudents ? 'Hide Students' : 'View Enrolled Students'}
      </button>

      {showStudents && (
        <StudentList
          students={students}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default CourseCard;
