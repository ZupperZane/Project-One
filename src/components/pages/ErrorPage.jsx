import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const status = error?.status || 404;
  const message =
    error?.statusText || error?.message || "The page you are looking for does not exist.";

  return (
    <section className="min-h-[60vh] grid place-items-center">
      <div className="max-w-lg w-full rounded-3xl bg-base-100 border border-base-300 shadow-lg p-8 text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-error">Error {status}</p>
        <h1 className="text-4xl font-black">Scene Not Found</h1>
        <p className="opacity-75">{message}</p>
        <div className="flex justify-center gap-2">
          <Link to="/" className="btn btn-primary">
            Back Home
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
