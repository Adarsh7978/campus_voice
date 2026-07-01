import { Link, useParams } from "react-router-dom";

export default function IssueDetails() {
  const { id } = useParams();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Issue Details</h1>
      <p className="mt-3 text-sm text-gray-600">
        This is a protected placeholder page for issue #{id}.
      </p>
      <Link to="/" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
        Back to dashboard
      </Link>
    </div>
  );
}
