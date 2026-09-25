export type UserRole = 'CLIENT' | 'FREELANCER' | 'BOTH';
export type ActiveRole = 'CLIENT' | 'FREELANCER';
export type SkillProficiency = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
export type BudgetType = 'FIXED' | 'HOURLY';
export type JobStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ProposalStatus = 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type ContractStatus = 'ACTIVE' | 'IN_REVIEW' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';
export type EscrowStatus = 'UNFUNDED' | 'HELD_IN_ESCROW' | 'RELEASED' | 'REFUNDED';
export type NotificationType = 
  | 'PROPOSAL_RECEIVED' 
  | 'PROPOSAL_ACCEPTED' 
  | 'CONTRACT_STARTED' 
  | 'MESSAGE_RECEIVED' 
  | 'ESCROW_FUNDED' 
  | 'PAYMENT_RELEASED' 
  | 'REVIEW_RECEIVED';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  role: UserRole;
  activeRole: ActiveRole;
  title?: string | null;
  hourlyRate?: number | null;
  location?: string | null;
  companyName?: string | null;
  companyWebsite?: string | null;
  companyDescription?: string | null;
  totalEarnings: number;
  totalSpent: number;
  rating: number;
  reviewCount: number;
  stripeAccountId?: string | null;
  skills?: UserSkill[];
  createdAt: string | Date;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiency: SkillProficiency;
  yearsExperience: number;
  skill?: Skill;
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budgetType: BudgetType;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  estimatedDuration?: string | null;
  deadline?: string | Date | null;
  requiredSkills: string[];
  status: JobStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  client?: User;
  proposals?: Proposal[];
  contract?: Contract | null;
  _count?: {
    proposals: number;
  };
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  status: ProposalStatus;
  createdAt: string | Date;
  job?: Job;
  freelancer?: User;
}

export interface Contract {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  agreedAmount: number;
  status: ContractStatus;
  escrowStatus: EscrowStatus;
  stripePaymentIntentId?: string | null;
  startDate: string | Date;
  completedDate?: string | Date | null;
  job?: Job;
  proposal?: Proposal;
  client?: User;
  freelancer?: User;
  messages?: Message[];
  reviews?: Review[];
}

export interface Message {
  id: string;
  contractId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  readAt?: string | Date | null;
  createdAt: string | Date;
  sender?: User;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  feedback: string;
  createdAt: string | Date;
  reviewer?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string | Date;
}
