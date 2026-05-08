const sections = [
  {
    title: "What Agile Is",
    body: "Agile is a software development mindset based on short feedback loops, working software, teamwork, and adapting when requirements change."
  },
  {
    title: "What Scrum Is",
    body: "Scrum is an Agile framework where a team plans work in short sprints, meets regularly, reviews progress, and improves its process after each sprint."
  },
  {
    title: "Why Scrum Boards Help",
    body: "A board makes invisible work visible. Everyone can see what is planned, what is blocked, what is being tested, and what is already complete."
  },
  {
    title: "Kanban vs Scrum",
    body: "Kanban focuses on continuous flow and limiting work in progress. Scrum organizes work into time-boxed sprints with roles, ceremonies, and sprint goals."
  },
  {
    title: "How Teams Use This",
    body: "Software teams use boards to assign tasks, estimate effort, track bugs, manage releases, and coordinate between developers, designers, testers, and product owners."
  },
  {
    title: "Real-World Examples",
    body: "Companies such as Microsoft, Atlassian, Spotify, and Google use Agile-style workflows to organize product teams and ship improvements in small increments."
  }
];

export default function EducationPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-blue-600 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase opacity-80">Presentation support</p>
        <h2 className="mt-2 text-3xl font-black">Scrum turns a project into visible, organized teamwork.</h2>
        <p className="mt-3 max-w-3xl text-blue-50">
          This page gives you quick speaking notes for explaining the software engineering ideas behind the app.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <section className="panel" key={section.title}>
            <h3 className="text-lg font-bold">{section.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{section.body}</p>
          </section>
        ))}
      </div>

      <section className="panel">
        <h3 className="section-title">Common Scrum Events</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Sprint Planning", "Daily Standup", "Sprint Review", "Retrospective"].map((event) => (
            <div className="rounded-md bg-slate-100 p-4 text-center font-bold dark:bg-slate-800" key={event}>{event}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
