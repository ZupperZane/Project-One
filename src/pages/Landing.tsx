import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

function Landing() {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-xl bg-base-200 p-6">
        <h2 className="text-4xl font-extrabold">Welcome</h2>
        <p className="mt-3 text-xl">
          This app helps you with messages, tasks, calendar events, and saved websites.
        </p>
        <p className="mt-1 text-lg">To begin, choose one large button below.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to={ROUTES.LOGIN}
          className="btn btn-primary h-auto min-h-28 flex-col items-start rounded-xl px-6 py-4 text-left"
        >
          <span className="text-2xl font-extrabold">Log In</span>
          <span className="text-base font-medium">Use an existing account</span>
        </Link>

        <Link
          to={ROUTES.SIGNUP}
          className="btn btn-secondary h-auto min-h-28 flex-col items-start rounded-xl px-6 py-4 text-left"
        >
          <span className="text-2xl font-extrabold">Create Account</span>
          <span className="text-base font-medium">Set up a new account</span>
        </Link>
      </div>

      <div className="rounded-xl bg-base-100 p-5">
        <h3 className="text-2xl font-bold">What you can do after logging in</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-lg">
          <li>Read and send messages</li>
          <li>Manage a daily checklist</li>
          <li>Add or edit calendar events</li>
          <li>Save important websites for quick access</li>
        </ul>
      </div>
    </section>
  );
}

export default Landing;
