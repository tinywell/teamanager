

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTeas } from '../hooks/useTeas';
import TeaCard from '../components/TeaCard';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Inventory = () => {
  const { teas } = useTeas();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const filteredTeas = teas.filter(tea =>
    tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in pt-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-ink">{t('inventory.title')}</h1>
        <Link to="/inventory/new" className="w-10 h-10 rounded-full bg-tea-500 text-white flex items-center justify-center shadow-lg hover:bg-tea-600 transition-colors">
          <Plus size={24} />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input
          type="text"
          placeholder={t('inventory.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-none shadow-sm text-ink placeholder:text-stone-300 focus:ring-2 focus:ring-tea-200 outline-none"
        />
      </div>

      {/* Tea Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTeas.map((tea) => (
          <TeaCard key={tea.id} tea={tea} />
        ))}
      </div>

      {filteredTeas.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <p>{t('inventory.noTeas')}</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
