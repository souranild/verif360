import { fetchQuestions } from '@/lib/data';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default async function QuestionsPage() {
  const questions = await fetchQuestions();

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Problems</h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search problems..."
                className="px-4 py-2 border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select className="px-4 py-2 border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border shadow-sm overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acceptance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {questions.map((q, index) => (
                <tr key={q.slug} className="hover:bg-card-hover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-muted rounded-full"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/questions/${q.slug}`} className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                      {q.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      q.difficulty === 'Easy' ? 'bg-success/10 text-success border border-success/20' :
                      q.difficulty === 'Medium' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-error/10 text-error border border-error/20'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {(q.acceptance_rate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {q.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground">
            Showing 1 to {questions.length} of {questions.length} results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-border rounded-md text-sm hover:bg-secondary text-muted-foreground">Previous</button>
            <button className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-hover">1</button>
            <button className="px-3 py-1 border border-border rounded-md text-sm hover:bg-secondary text-muted-foreground">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}