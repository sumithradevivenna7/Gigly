import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { INITIAL_JOBS, DEMO_USERS } from '@/lib/mock-data';
import { Job, BudgetType } from '@/types';

// In-memory fallback job list for local dev when DB is not connected
const localJobs: Job[] = [...INITIAL_JOBS];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const skill = searchParams.get('skill')?.toLowerCase() || '';
  const budgetType = searchParams.get('budgetType') || '';
  const minBudget = searchParams.get('minBudget') ? parseFloat(searchParams.get('minBudget')!) : null;
  const maxBudget = searchParams.get('maxBudget') ? parseFloat(searchParams.get('maxBudget')!) : null;
  const sort = searchParams.get('sort') || 'newest';

  try {
    // Attempt Prisma fetch first
    const dbJobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(category ? { category } : {}),
        ...(budgetType ? { budgetType: budgetType as BudgetType } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(skill
          ? {
              requiredSkills: {
                has: skill,
              },
            }
          : {}),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            companyName: true,
            rating: true,
            reviewCount: true,
            totalSpent: true,
          },
        },
        _count: {
          select: { proposals: true },
        },
      },
      orderBy:
        sort === 'budget_high'
          ? { budgetAmount: 'desc' }
          : sort === 'budget_low'
          ? { budgetAmount: 'asc' }
          : { createdAt: 'desc' },
    });

    if (dbJobs && dbJobs.length > 0) {
      return NextResponse.json(dbJobs);
    }
  } catch {
    // Fall back to in-memory store
  }

  // Filter local store
  let filtered = [...localJobs].filter((job) => job.status === 'OPEN');

  if (search) {
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.description.toLowerCase().includes(search) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(search))
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((j) => j.category.toLowerCase() === category.toLowerCase());
  }

  if (skill) {
    filtered = filtered.filter((j) =>
      j.requiredSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
    );
  }

  if (budgetType && budgetType !== 'ALL') {
    filtered = filtered.filter((j) => j.budgetType === budgetType);
  }

  if (minBudget !== null) {
    filtered = filtered.filter((j) => {
      const val = j.budgetType === 'FIXED' ? (j.budgetAmount ?? 0) : (j.budgetMin ?? 0);
      return val >= minBudget;
    });
  }

  if (maxBudget !== null) {
    filtered = filtered.filter((j) => {
      const val = j.budgetType === 'FIXED' ? (j.budgetAmount ?? 0) : (j.budgetMax ?? 0);
      return val <= maxBudget;
    });
  }

  // Sorting
  if (sort === 'budget_high') {
    filtered.sort((a, b) => (b.budgetAmount ?? b.budgetMax ?? 0) - (a.budgetAmount ?? a.budgetMax ?? 0));
  } else if (sort === 'budget_low') {
    filtered.sort((a, b) => (a.budgetAmount ?? a.budgetMin ?? 0) - (b.budgetAmount ?? b.budgetMin ?? 0));
  } else {
    // newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      title,
      description,
      category,
      budgetType,
      budgetAmount,
      budgetMin,
      budgetMax,
      estimatedDuration,
      deadline,
      requiredSkills,
    } = body;

    if (!title || !description || !category || !budgetType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, and budgetType are required.' },
        { status: 400 }
      );
    }

    const clientId = (session?.user as unknown as { id: string })?.id || DEMO_USERS[0].id;
    const clientUser = DEMO_USERS.find((u) => u.id === clientId) || DEMO_USERS[0];

    try {
      const createdJob = await prisma.job.create({
        data: {
          clientId,
          title,
          description,
          category,
          budgetType,
          budgetAmount: budgetAmount ? parseFloat(budgetAmount) : null,
          budgetMin: budgetMin ? parseFloat(budgetMin) : null,
          budgetMax: budgetMax ? parseFloat(budgetMax) : null,
          estimatedDuration: estimatedDuration || '1 to 3 months',
          deadline: deadline ? new Date(deadline) : null,
          requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
          status: 'OPEN',
        },
        include: {
          client: true,
          _count: { select: { proposals: true } },
        },
      });

      return NextResponse.json(createdJob, { status: 201 });
    } catch {
      // Memory fallback
      const newJob: Job = {
        id: `job-${Date.now()}`,
        clientId,
        title,
        description,
        category,
        budgetType,
        budgetAmount: budgetAmount ? parseFloat(budgetAmount) : null,
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        estimatedDuration: estimatedDuration || '1 to 3 months',
        deadline: deadline ? new Date(deadline).toISOString() : null,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : ['Next.js', 'TypeScript'],
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        client: clientUser,
        _count: { proposals: 0 },
      };

      localJobs.unshift(newJob);
      return NextResponse.json(newJob, { status: 201 });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || 'Failed to post job' },
      { status: 500 }
    );
  }
}
