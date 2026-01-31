import { fetchQuestions } from "@/lib/data";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import QuestionSolutionClient from "@/components/QuestionSolutionClient";

interface QuestionPageProps {
  params: { slug: string };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const questions = await fetchQuestions();
  const { slug } = await params;
  const question = questions.find((q) => q.slug === slug);

  if (!question) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
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
              </header>

              <section className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-foreground">
                  Description
                </h2>
                <div className="text-muted-foreground mb-4 whitespace-pre-wrap">
                  {question.description}
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
