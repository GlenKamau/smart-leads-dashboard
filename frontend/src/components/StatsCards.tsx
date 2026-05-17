import { Users, Target, Phone, Sparkles, Trophy, TrendingDown } from 'lucide-react';

interface Stats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
}

interface StatsCardsProps {
  stats: Stats;
}

const cards = [
  { key: 'total', label: 'Total Leads', icon: Users, color: 'text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10' },
  { key: 'new', label: 'New', icon: Target, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10' },
  { key: 'contacted', label: 'Contacted', icon: Phone, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
  { key: 'qualified', label: 'Qualified', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
  { key: 'proposal', label: 'Proposal', icon: Trophy, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
  { key: 'won', label: 'Won', icon: Trophy, color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10' },
  { key: 'lost', label: 'Lost', icon: TrendingDown, color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10' },
];

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof Stats] ?? 0;
        return (
          <div
            key={card.key}
            className="card p-4 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
