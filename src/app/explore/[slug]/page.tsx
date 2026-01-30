import { fetchCourses } from '@/lib/data';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface CoursePageProps {
  params: { slug: string };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const courses = await fetchCourses();
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-2">By {course.instructor}</p>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded border border-primary/20">
                  Level: {course.level}
                </span>
                <span className="bg-success/10 text-success text-sm px-3 py-1 rounded border border-success/20">
                  Duration: {course.duration} hours
                </span>
                <span className="bg-warning/10 text-warning text-sm px-3 py-1 rounded border border-warning/20">
                  Rating: {course.rating}/5
                </span>
                <span className="bg-secondary text-muted-foreground text-sm px-3 py-1 rounded border border-border">
                  Enrolled: {course.enrollment_count}
                </span>
              </div>
              <p className="text-2xl font-semibold text-success">${course.price}</p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Prerequisites</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Course Modules</h2>
              {course.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="flex justify-between items-center bg-card p-4 rounded-lg border border-border hover:bg-card-hover transition-colors">
                        <div>
                          <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{lesson.duration} min</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}