export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded ${
            page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
