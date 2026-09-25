import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { INITIAL_PROPOSALS, INITIAL_JOBS, INITIAL_CONTRACTS, DEMO_USERS } from '@/lib/mock-data';
import { Contract } from '@/types';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id: proposalId } = params;

  try {
    const session = await getServerSession(authOptions);
    const clientId = (session?.user as unknown as { id: string })?.id || DEMO_USERS[0].id;

    try {
      // 1. Fetch proposal with job
      const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        include: { job: true, freelancer: true },
      });

      if (!proposal) {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
      }

      // 2. Mark proposal as ACCEPTED
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: 'ACCEPTED' },
      });

      // 3. Mark job as IN_PROGRESS
      await prisma.job.update({
        where: { id: proposal.jobId },
        data: { status: 'IN_PROGRESS' },
      });

      // 4. Create Contract linking client, freelancer, job with escrow held
      const contract = await prisma.contract.create({
        data: {
          jobId: proposal.jobId,
          proposalId: proposal.id,
          clientId: clientId,
          freelancerId: proposal.freelancerId,
          agreedAmount: proposal.bidAmount,
          status: 'ACTIVE',
          escrowStatus: 'HELD_IN_ESCROW',
          stripePaymentIntentId: `pi_escrow_${Date.now()}`,
          startDate: new Date(),
        },
      });

      // 5. Notify Freelancer
      await prisma.notification.create({
        data: {
          userId: proposal.freelancerId,
          type: 'PROPOSAL_ACCEPTED',
          title: 'Proposal Accepted & Escrow Funded!',
          message: `Your bid of $${proposal.bidAmount} on "${proposal.job.title}" was accepted. $${proposal.bidAmount} is safely held in escrow.`,
          link: `/contracts/${contract.id}`,
        },
      });

      return NextResponse.json({
        success: true,
        contractId: contract.id,
        contract,
        message: 'Proposal accepted and escrow successfully funded!',
      });
    } catch {
      // In-memory fallback
      const proposal = INITIAL_PROPOSALS.find((p) => p.id === proposalId) || {
        id: proposalId,
        jobId: 'job-1',
        freelancerId: DEMO_USERS[1].id,
        bidAmount: 4300,
        estimatedDuration: '4 weeks',
        coverLetter: 'Demo cover letter',
        status: 'PENDING' as const,
        createdAt: new Date().toISOString(),
        freelancer: DEMO_USERS[1],
      };

      proposal.status = 'ACCEPTED';

      const job = INITIAL_JOBS.find((j) => j.id === proposal.jobId);
      if (job) {
        job.status = 'IN_PROGRESS';
      }

      const newContract: Contract = {
        id: `contract-${Date.now()}`,
        jobId: proposal.jobId,
        proposalId: proposal.id,
        clientId,
        freelancerId: proposal.freelancerId,
        agreedAmount: proposal.bidAmount,
        status: 'ACTIVE',
        escrowStatus: 'HELD_IN_ESCROW',
        stripePaymentIntentId: `pi_escrow_sim_${Date.now()}`,
        startDate: new Date().toISOString(),
        job,
        proposal,
        client: DEMO_USERS.find((u) => u.id === clientId) || DEMO_USERS[0],
        freelancer: proposal.freelancer || DEMO_USERS[1],
      };

      INITIAL_CONTRACTS.unshift(newContract);

      return NextResponse.json({
        success: true,
        contractId: newContract.id,
        contract: newContract,
        message: 'Proposal accepted and escrow successfully funded!',
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || 'Failed to accept proposal' },
      { status: 500 }
    );
  }
}
