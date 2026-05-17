import { Response } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import Lead from '../../models/Lead';
import { errorResponse, successResponse, createdResponse } from '../../utils/response.util';
import { AuthRequest } from '../../middleware/auth.middleware';
import { LeadStatus, LeadSource } from '../../constants/enums';
import { Types } from 'mongoose';
import {
  buildLeadFilter,
  getSortOptions,
  calculatePagination,
  LeadFilters,
  PaginatedResponse,
} from '../../utils/query-builder.util';

interface CreateLeadBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

interface UpdateLeadBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
}

interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: string;
  limit?: string;
}

const validateRequest = (req: AuthRequest): Result<ValidationError> => {
  return validationResult(req);
};

export const createLead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const errors = validateRequest(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array().map(e => e.msg).join(', '));
    }

    const { firstName, lastName, email, phone, company, position, status, source, notes } = req.body as CreateLeadBody;

    const lead = await Lead.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: phone || '',
      company: company || '',
      position: position || '',
      status: status || LeadStatus.NEW,
      source,
      notes: notes || '',
      owner: new Types.ObjectId(req.user!.id),
    });

    const leadResponse = {
      id: lead._id.toString(),
      _id: lead._id.toString(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      owner: lead.owner.toString(),
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };

    return createdResponse(res, 'Lead created successfully', leadResponse);
  } catch (error) {
    console.error('Create lead error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const getAllLeads = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const {
      status,
      source,
      search,
      sort,
      page = '1',
      limit = '10',
    } = req.query as unknown as LeadQueryParams;

    const filters: LeadFilters = {
      status,
      source,
      search,
      sort,
    };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = buildLeadFilter(filters, req.user!.id, req.user!.role);
    const sortOptions = getSortOptions(sort);

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Lead.countDocuments(query),
    ]);

    const leadsResponse = leads.map((lead) => ({
      id: lead._id.toString(),
      _id: lead._id.toString(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      owner: lead.owner.toString(),
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }));

    const pagination = calculatePagination(total, pageNum, limitNum);

    const response: PaginatedResponse<typeof leadsResponse[0]> = {
      data: leadsResponse,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: pagination.totalPages,
    };

    return successResponse(res, 'Leads retrieved successfully', response);
  } catch (error) {
    console.error('Get all leads error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'admin';

    const query: Record<string, unknown> = { _id: id };
    if (!isAdmin) {
      query.owner = req.user!.id;
    }

    const lead = await Lead.findOne(query);

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    const leadResponse = {
      id: lead._id.toString(),
      _id: lead._id.toString(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      owner: lead.owner.toString(),
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };

    return successResponse(res, 'Lead retrieved successfully', leadResponse);
  } catch (error) {
    console.error('Get lead error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const errors = validateRequest(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);
    }

    const { id } = req.params;
    const updateData = req.body as UpdateLeadBody;
    const setData: Record<string, unknown> = { ...updateData };

    if (updateData.firstName !== undefined || updateData.lastName !== undefined) {
      const lead = await Lead.findById(id);
      if (lead) {
        const firstName = updateData.firstName ?? lead.firstName;
        const lastName = updateData.lastName ?? lead.lastName;
        setData.name = `${firstName} ${lastName}`.trim();
      }
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user!.id },
      { $set: setData },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    const leadResponse = {
      id: lead._id.toString(),
      _id: lead._id.toString(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      owner: lead.owner.toString(),
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };

    return successResponse(res, 'Lead updated successfully', leadResponse);
  } catch (error) {
    console.error('Update lead error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findOneAndDelete({ _id: id, owner: req.user!.id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, 'Lead deleted successfully');
  } catch (error) {
    console.error('Delete lead error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

const escapeCsvValue = (value: string | undefined): string => {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { status, source, search, sort } = req.query as unknown as LeadQueryParams;

    const filters: LeadFilters = { status, source, search, sort };
    const query = buildLeadFilter(filters, req.user!.id, req.user!.role);
    const sortOptions = getSortOptions(sort);

    const leads = await Lead.find(query).sort(sortOptions);

    const csvData = leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt?.toISOString() || '',
    }));

    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

    const csvRows: string[] = [
      headers.join(','),
      ...csvData.map((row) =>
        [row.name, row.email, row.status, row.source, row.createdAt]
          .map(escapeCsvValue)
          .join(',')
      ),
    ];

    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    return res.send(csvString);
  } catch (error) {
    console.error('Export leads error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user?.role === 'admin';

    const matchStage: Record<string, unknown> = {};
    if (!isAdmin) {
      matchStage.owner = new Types.ObjectId(userId);
    }

    const stats = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', LeadStatus.NEW] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', LeadStatus.CONTACTED] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', LeadStatus.QUALIFIED] }, 1, 0] } },
          proposal: { $sum: { $cond: [{ $eq: ['$status', LeadStatus.PROPOSAL] }, 1, 0] } },
          won: { $sum: { $cond: [{ $eq: ['$status', LeadStatus.WON] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', LeadStatus.LOST] }, 1, 0] } },
        },
      },
    ]);

    const result = stats[0] || { total: 0, new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0 };
    delete result._id;

    return successResponse(res, 'Stats retrieved successfully', result);
  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};
