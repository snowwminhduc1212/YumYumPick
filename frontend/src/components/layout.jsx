import Header from './Header';

function Layout({ children, user, onOpenAuth, onOpenFilter, onLogout }) {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen w-full py-4 px-2 transition-colors">
      <Header
        user={user}
        onOpenAuth={onOpenAuth}
        onOpenFilter={onOpenFilter}
        onLogout={onLogout}
      />
      {children}
    </main>
  );
}

export default Layout;