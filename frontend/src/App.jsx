import { useState } from 'react';
import { MOCK_DISHES } from './data/mockDishes'
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout';
import AuthModal from './components/AuthModal';
import FilterModal from './components/FilterModal';

function App() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <Layout
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenFilter={() => setFilterOpen(true)}
        onLogout={logout}
      >
        <section className="flex flex-1 flex-col items-center justify-center w-full my-auto text-center">
          <h2 className="text-xl text-stone-700 dark:text-stone-300 font-semibold">Canvas Ngày 1 hoàn chỉnh!</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Dữ liệu mẫu đầy đủ schema: {MOCK_DISHES.length} món.</p>
        </section>
      </Layout>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </>
  );
}

export default App