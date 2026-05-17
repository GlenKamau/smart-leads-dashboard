import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { leadsApi } from '../api/leads.api';
import { LeadStatus, LeadSource, Lead } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.PROPOSAL, LeadStatus.WON, LeadStatus.LOST]),
  source: z.enum([LeadSource.WEBSITE, LeadSource.INSTAGRAM, LeadSource.REFERRAL, LeadSource.LINKEDIN, LeadSource.COLD_CALL, LeadSource.ADVERTISEMENT, LeadSource.OTHER]),
  notes: z.string().optional(),
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
}

const LeadModal = ({ isOpen, onClose, leadId }: LeadModalProps) => {
  const queryClient = useQueryClient();

  const { data: lead } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => leadsApi.getLead(leadId!),
    enabled: !!leadId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        status: lead.status,
        source: lead.source,
        notes: lead.notes,
      });
    }
  }, [lead, reset]);

  const createMutation = useMutation({
    mutationFn: (data: LeadForm) => leadsApi.createLead(data as Partial<Lead>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadForm }) =>
      leadsApi.updateLead(id, data as Partial<Lead>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
      reset();
    },
  });

  const onSubmit = async (data: LeadForm) => {
    try {
      if (leadId) {
        await updateMutation.mutateAsync({ id: leadId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-surface-dark-secondary rounded-2xl shadow-modal border border-border dark:border-border-dark overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-border-dark">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {leadId ? 'Edit Lead' : 'New Lead'}
              </h2>
              <button onClick={onClose} className="btn-ghost p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input {...register('firstName')} className="input-field" placeholder="John" />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input {...register('lastName')} className="input-field" placeholder="Doe" />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input {...register('email')} type="email" className="input-field" placeholder="john@example.com" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input {...register('phone')} className="input-field" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input {...register('company')} className="input-field" placeholder="Acme Inc" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Position</label>
                  <input {...register('position')} className="input-field" placeholder="CEO" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select {...register('status')} className="input-field">
                    <option value={LeadStatus.NEW}>New</option>
                    <option value={LeadStatus.CONTACTED}>Contacted</option>
                    <option value={LeadStatus.QUALIFIED}>Qualified</option>
                    <option value={LeadStatus.PROPOSAL}>Proposal</option>
                    <option value={LeadStatus.WON}>Won</option>
                    <option value={LeadStatus.LOST}>Lost</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Source</label>
                  <select {...register('source')} className="input-field">
                    <option value={LeadSource.WEBSITE}>Website</option>
                    <option value={LeadSource.INSTAGRAM}>Instagram</option>
                    <option value={LeadSource.REFERRAL}>Referral</option>
                    <option value={LeadSource.LINKEDIN}>LinkedIn</option>
                    <option value={LeadSource.COLD_CALL}>Cold Call</option>
                    <option value={LeadSource.ADVERTISEMENT}>Advertisement</option>
                    <option value={LeadSource.OTHER}>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Notes</label>
                  <textarea {...register('notes')} className="input-field" rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : leadId ? 'Update Lead' : 'Create Lead'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;
