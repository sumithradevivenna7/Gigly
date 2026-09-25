import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CONTRACTS } from '@/lib/mock-data';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        job: true,
        proposal: true,
        client: true,
        freelancer: true,
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' },
        },
        reviews: true,
      },
    });

    if (contract) return NextResponse.json(contract);
  } catch {
    // Memory fallback
  }

  const found = INITIAL_CONTRACTS.find((c) => c.id === id);
  if (!found) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  return NextResponse.json(found);
}

// Release escrow action / complete contract
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { action } = body;

  try {
    if (action === 'RELEASE_ESCROW') {
      try {
        const updated = await prisma.contract.update({
          where: { id },
          data: {
            escrowStatus: 'RELEASED',
            status: 'COMPLETED',
            completedDate: new Date(),
          },
        });
        return NextResponse.json({ success: true, contract: updated });
      } catch {
        const found = INITIAL_CONTRACTS.find((c) => c.id === id);
        if (found) {
          found.escrowStatus = 'RELEASED';
          found.status = 'COMPLETED';
          found.completedDate = new Date().toISOString();
        }
        return NextResponse.json({ success: true, contract: found });
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
