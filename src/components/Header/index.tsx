export const Header = () => {
  return (
    <nav className="relative flex flex-col items-center justify-between px-2 py-3 bg-pink-500 mb-3">
      <ul className="flex flex-row p-4">
        <li className="nav-item">
          <a
            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
            href="/"
          >
            <span className="ml-2">Voltar para página principal</span>
          </a>
        </li>
      </ul>
      <div
        style={{
          border: "1px solid white",
          borderWidth: "0 0 1px 0",
          width: "100%",
        }}
      />
    </nav>
  );
};
