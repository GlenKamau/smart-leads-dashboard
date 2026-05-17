import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { leadsApi, LeadFilters } from '../api/leads.api';
import { LeadStatus, LeadSource } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import LeadModal from '../components/LeadModal';
import LeadTable from '../components/LeadTable';
import Pagination from '../components/Pagination';
import StatsCards from '../components/StatsCards';
import LeadChart from '../components/LeadChart';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    sort: 'latest',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadsApi.getLeads(filters),
  });

  const { data: statsData } = useQuery({
    queryKey: ['leads-stats'],
    queryFn: () => leadsApi.getStats(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });

  const handleFilterChange = useCallback((key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handleEdit = useCallback((id: string) => {
    setEditingLead(id);
    setIsModalOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingLead(null);
    setIsModalOpen(true);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const blob = await leadsApi.exportLeads(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [filters]);

  const stats = statsData || { total: 0, new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0 };

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and track your leads
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Lead
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <StatsCards stats={stats} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-4 mb-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field pr-8 appearance-none cursor-pointer min-w-[130px]"
              >
                <option value="">All Status</option>
                <option value={LeadStatus.NEW}>New</option>
                <option value={LeadStatus.CONTACTED}>Contacted</option>
                <option value={LeadStatus.QUALIFIED}>Qualified</option>
                <option value={LeadStatus.PROPOSAL}>Proposal</option>
                <option value={LeadStatus.WON}>Won</option>
                <option value={LeadStatus.LOST}>Lost</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filters.source || ''}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="input-field pr-8 appearance-none cursor-pointer min-w-[130px]"
              >
                <option value="">All Sources</option>
                <option value={LeadSource.WEBSITE}>Website</option>
                <option value={LeadSource.INSTAGRAM}>Instagram</option>
                <option value={LeadSource.REFERRAL}>Referral</option>
                <option value={LeadSource.LINKEDIN}>LinkedIn</option>
                <option value={LeadSource.COLD_CALL}>Cold Call</option>
                <option value={LeadSource.ADVERTISEMENT}>Advertisement</option>
                <option value={LeadSource.OTHER}>Other</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filters.sort || 'latest'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field pr-8 appearance-none cursor-pointer min-w-[130px]"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={handleExport} className="btn-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="mb-6"
      >
        <LeadChart data={stats} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {isLoading && (
          <div className="card p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading leads...</p>
            </div>
          </div>
        )}
        {isError && (
          <div className="card p-12">
            <div className="text-center">
              <p className="text-sm text-red-500">
                Error: {error instanceof Error ? error.message : 'Failed to load leads'}
              </p>
            </div>
          </div>
        )}
        {data && (
          <>
            <LeadTable
              leads={data.data}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </>
        )}
      </motion.div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }}
        leadId={editingLead}
      />
    </div>
  );
};

export default Dashboard;
