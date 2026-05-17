import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Edit2, Trash2, ExternalLink, Users } from 'lucide-react';
import { Lead } from '../types';
import { cn } from '../lib/utils';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  contacted: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  proposal: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  won: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  lost: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

const sourceStyles: Record<string, string> = {
  website: 'text-blue-600 dark:text-blue-400',
  instagram: 'text-pink-600 dark:text-pink-400',
  referral: 'text-emerald-600 dark:text-emerald-400',
  linkedin: 'text-sky-600 dark:text-sky-400',
  'cold-call': 'text-orange-600 dark:text-orange-400',
  advertisement: 'text-violet-600 dark:text-violet-400',
};

const LeadTable = ({ leads, onEdit, onDelete }: LeadTableProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-tertiary dark:bg-surface-dark-tertiary flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No leads yet</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Create your first lead to get started</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-border-dark bg-surface-secondary dark:bg-surface-dark-tertiary">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border-dark">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-surface-secondary dark:hover:bg-surface-dark-tertiary transition-colors duration-100"
              >
                <td className="px-5 py-4">
                  <Link
                    to={`/leads/${lead._id}`}
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {lead.name || `${lead.firstName} ${lead.lastName}`}
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100" />
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{lead.email}</td>
                <td className="px-5 py-4">
                  <span className={cn('badge', statusStyles[lead.status] || statusStyles.new)}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-sm font-medium', sourceStyles[lead.source] || 'text-gray-600')}>
                    {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-4 text-right relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === lead._id ? null : lead._id)}
                    className="btn-ghost p-1.5"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {openDropdown === lead._id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute right-4 top-12 z-20 w-36 bg-white dark:bg-surface-dark-secondary border border-border dark:border-border-dark rounded-lg shadow-elevated py-1 animate-scale-in">
                        <button
                          onClick={() => { onEdit(lead._id); setOpenDropdown(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => { onDelete(lead._id); setOpenDropdown(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
