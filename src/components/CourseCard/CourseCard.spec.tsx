import { render, screen, fireEvent } from '@testing-library/react';
import CourseCard from './CourseCard';
import { useCourseStudents } from '../../hooks/useTeachable';

jest.mock('../../hooks/useTeachable', () => ({
  useCourseStudents: jest.fn()
}));

const mockUseCourseStudents = useCourseStudents as jest.MockedFunction<typeof useCourseStudents>;

describe('CourseCard', () => {
  const course = {
    id: 1,
    name: 'Test Course',
    heading: 'Course Heading',
    is_published: true,
    description: null,
    image_url: 'test.jpg'
  };

  const unpublishedCourse = {
    ...course,
    id: 2,
    name: 'Unpublished Course',
    is_published: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCourseStudents.mockReturnValue({
      students: [],
      loading: false,
      error: null
    });
  });

  it('renders course information', () => {
    render(<CourseCard course={course} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Course Heading')).toBeInTheDocument();
    expect(screen.getByText('View Enrolled Students')).toBeInTheDocument();
  });

  it('renders unpublished badge for unpublished courses', () => {
    render(<CourseCard course={unpublishedCourse} />);
    expect(screen.getByText('Unpublished')).toBeInTheDocument();
  });

  it('toggles student list on button click', () => {
    mockUseCourseStudents.mockReturnValue({
      students: [{ id: 1, name: 'Student', email: 'test@test.com', enrolled_at: '2023-01-01', completed_at: null, percent_complete: 0 }],
      loading: false,
      error: null
    });

    render(<CourseCard course={course} />);

    fireEvent.click(screen.getByText('View Enrolled Students'));
    expect(screen.getByText('Hide Students')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide Students'));
    expect(screen.getByText('View Enrolled Students')).toBeInTheDocument();
    expect(screen.queryByText('Student')).not.toBeInTheDocument();
  });

  it('triggers fetch on hover', () => {
    let capturedId = 0;
    mockUseCourseStudents.mockImplementation((id) => {
      capturedId = id;
      return { students: [], loading: false, error: null };
    });

    render(<CourseCard course={course} />);

    fireEvent.mouseEnter(screen.getByText('View Enrolled Students'));
    expect(capturedId).toBe(course.id);

    fireEvent.mouseLeave(screen.getByText('View Enrolled Students'));
    expect(capturedId).toBe(0);
  });
});
