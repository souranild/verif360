import { fetchCourses } from '@/lib/data';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default async function ExplorePage() {
  const courses = await fetchCourses();

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-foreground mb-12">Explore Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link key={course.slug} href={`/explore/${course.slug}`} className="block">
              <Card className="h-full cursor-pointer">
                <h2 className="text-xl font-semibold mb-2 text-foreground">{course.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">By {course.instructor}</p>
                <p className="text-sm text-muted-foreground mb-2">Level: {course.level}</p>
                <p className="text-sm text-muted-foreground mb-2">Duration: {course.duration} hours</p>
                <p className="text-sm text-muted-foreground mb-4">Rating: {course.rating}/5 ({course.enrollment_count} enrolled)</p>
                <p className="text-lg font-bold text-success mb-4">${course.price}</p>
                <span className="text-primary hover:text-primary-hover font-medium">View Course →</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}