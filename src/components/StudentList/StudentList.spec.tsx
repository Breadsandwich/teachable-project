import { render, screen } from '@testing-library/react';
import StudentList from './StudentList';

describe('StudentList', () => {
  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', enrolled_at: '2023-01-01', completed_at: null, percent_complete: 50 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolled_at: '2023-02-01', completed_at: null, percent_complete: 75 }
  ];


  it('renders student list', () => {
    render(
      <StudentList
        students={students}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText('Enrolled Students')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});
