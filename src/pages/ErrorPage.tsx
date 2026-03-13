import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <section>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Unexpected error</h2>
      <p>Something went wrong while loading this route.</p>
    </section>
  );
}

export default ErrorPage;
