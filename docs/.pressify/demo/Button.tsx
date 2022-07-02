export default function Button() {
  return (
    <button
      className="px-3 py-1 rounded text-white bg-sky-500 hover:bg-sky-400"
      onClick={() => alert('Hi')}
    >
      外部 demo
    </button>
  );
}
