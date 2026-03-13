const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 rounded-2xl bg-base-200 text-base-content">
      <div className="px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-semibold">MovieMango</p>
        <p className="text-sm opacity-70">Helping you manage your movies since...</p>
        <p className="text-sm opacity-60">© {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
