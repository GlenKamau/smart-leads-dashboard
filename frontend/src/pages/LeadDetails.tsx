import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { leadsApi } from '../api/leads.api';
import { LeadStatus, LeadSource } from '../types';

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.PROPOSAL, LeadStatus.WON, LeadStatus.LOST]),
  source: z.enum([LeadSource.WEBSITE, LeadSource.INSTAGRAM, LeadSource.REFERRAL, LeadSource.LINKEDIN, LeadSource.COLD_CALL, LeadSource.ADVERTISEMENT, LeadSource.OTHER]),
  notes: z.string().optional(),
});

type LeadForm = z.infer<typeof leadSchema>;

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLead(id!),
    enabled: !!id,
  });

  const form = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (lead) {
      reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        position: lead.position || '',
        status: lead.status,
        source: lead.source,
        notes: lead.notes || '',
      });
    }
  }, [lead, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: LeadForm) => leadsApi.updateLead(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const onSubmit = async (data: LeadForm) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading lead...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card p-12 text-center">
          <p className="text-sm text-red-500 mb-4">Failed to load lead</p>
          <Link to="/" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Link to="/" className="btn-ghost p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {lead.name || `${lead.firstName} ${lead.lastName}`}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Edit lead details</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">First Name</label>
              <input {...register('firstName')} className="input-field" />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last Name</label>
              <input {...register('lastName')} className="input-field" />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input-field" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input {...register('phone')} className="input-field" />
            </div>
            <div>
              <label className="label">Company</label>
              <input {...register('company')} className="input-field" />
            </div>
            <div>
              <label className="label">Position</label>
              <input {...register('position')} className="input-field" />
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
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea {...register('notes')} className="input-field" rows={3} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border dark:border-border-dark">
            <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to="/" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LeadDetails;
