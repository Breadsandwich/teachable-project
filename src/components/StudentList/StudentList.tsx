import React from 'react';
import { Student } from '../../types';
import './StudentList.css';

interface StudentListProps {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StudentList: React.FC<StudentListProps> = ({ students, loading, error }) => {
  if (loading) {
    return <p className="student-message">Loading students...</p>;
  }

  if (error) {
    return <p className="student-error">{error}</p>;
  }

  if (students.length === 0) {
    return <p className="student-message">No students enrolled in this course.</p>;
  }

  return (
    <div className="student-list-container">
      <h3 className="student-list-title">Enrolled Students</h3>
      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Enrolled Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{formatDate(student.enrolled_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
