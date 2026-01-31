import { fetchQuestions } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import QuestionSolutionClient from "@/components/QuestionSolutionClient";
import BlogContent from "@/components/BlogContent";

interface QuestionPageProps {
  params: { slug: string };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const questions = await fetchQuestions();
  const paramsResolved = await params; // params can be a Promise in Next.js
  const { slug } = paramsResolved as { slug?: string };
  console.log('Resolved slug:', slug);

  let question = questions.find((q) => q.slug === slug || (q as any)['_dir'] === slug);

  // Try stripping leading numeric prefix e.g. question-001-foo -> foo
  if (!question && typeof slug === 'string') {
    const m = slug.match(/^question-\d+-(.+)$/);
    if (m && m[1]) {
      const after = m[1];
      question = questions.find((q) => q.slug === after || (q as any)['_dir'] === after);
      if (question) {
        console.log('Found question by stripped slug:', after);
      }
    }
  }

  if (!question) {
    console.warn('Question not found for slug:', slug, 'available slugs:', questions.map((qq) => qq.slug));
    notFound();
  }

  // If requested via directory-style slug, redirect to canonical (meta) slug
  if (question.slug !== slug) {
    // Avoid redirect loops: only redirect when canonical slug is different
    const canonical = question.slug;
    console.log('Redirecting to canonical slug:', canonical, 'from:', slug);
    redirect(`/questions/${canonical}`);
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Problem Description */}
            <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
              <header className="mb-6">
                {(() => {
                  const idMatch = question.id
                    ? question.id.match(/question-(\d+)/)
                    : null;
                  const qnum = idMatch ? idMatch[1] : null;
                  const qnumLabel = qnum
                    ? `Q ${String(qnum).padStart(3, "0")}`
                    : "";
                  return (
                    <h1 className="text-2xl font-bold mb-2 text-foreground">
                      {qnumLabel
                        ? `${qnumLabel} — ${question.title}`
                        : question.title}
                    </h1>
                  );
                })()}
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      (question.difficulty || "").toString().toLowerCase() ===
                      "easy"
                        ? "bg-success/10 text-success border border-success/20"
                        : (question.difficulty || "")
                              .toString()
                              .toLowerCase() === "medium"
                          ? "bg-warning/10 text-warning border border-warning/20"
                          : "bg-error/10 text-error border border-error/20"
                    }`}
                  >
                    {question.difficulty.charAt(0).toUpperCase() +
                      question.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Acceptance: {(question.acceptance_rate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {question.companies?.length ? (
                  <div className="flex items-center gap-3 mt-3">
                    {question.companies.map((c: any) => (
                      <div key={c.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <img src={c.logo} alt={c.name} className="w-6 h-6 rounded-sm border" />
                        <span className="hidden sm:inline">{c.name}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </header>

              <section className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-foreground">
                  Description
                </h2>
                <div className="mb-4">
                  <BlogContent source={question.content || question.description} className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground" />
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-foreground">
                  Examples
                </h2>
                {question.examples.map((example, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-secondary rounded border border-border"
                  >
                    <p className="font-medium mb-2 text-foreground">Example {index + 1}:</p>
                    <div className="mb-2">
                      <div className="font-medium mb-1 text-foreground">Input:</div>
                      <pre className="text-sm mb-2 text-muted-foreground bg-secondary p-3 rounded overflow-x-auto whitespace-pre-wrap">{example.input}</pre>
                      <div className="font-medium mb-1 text-foreground">Output:</div>
                      <pre className="text-sm mb-2 text-muted-foreground bg-secondary p-3 rounded overflow-x-auto whitespace-pre-wrap">{example.output}</pre>
                      {example.explanation && (
                        <p className="text-sm text-muted-foreground"><strong>Explanation:</strong> {example.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-foreground">
                  Constraints
                </h2>
                <p className="text-muted-foreground">{question.constraints}</p>
              </section>

              {question.hints.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 text-foreground">
                    Hints
                  </h2>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {question.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Solution panel (client) */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <QuestionSolutionClient solution={question.solution} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
