import { render, screen } from '@testing-library/react';
import CoursesList from './CoursesList';
import { useCourses } from '../../hooks/useTeachable';

jest.mock('../../hooks/useTeachable', () => ({
  useCourses: jest.fn()
}));

jest.mock('../CourseCard/CourseCard', () => {
  return {
    __esModule: true,
    default: ({ course }: { course: any }) => (
      <div data-testid={`course-card-${course.id}`}>
        {course.name}
      </div>
    )
  };
});

const mockUseCourses = useCourses as jest.MockedFunction<typeof useCourses>;

describe('CoursesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders courses', () => {
    const courses = [
      { id: 1, name: 'Course 1', is_published: true, heading: '', description: null, image_url: '' },
      { id: 2, name: 'Course 2', is_published: false, heading: '', description: null, image_url: '' }
    ];

    mockUseCourses.mockReturnValue({
      courses,
      loading: false,
      error: null
    });

    render(<CoursesList />);
    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
  });
});
