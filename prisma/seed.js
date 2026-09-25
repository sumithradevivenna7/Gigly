const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Gigly Freelance Marketplace database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.job.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Skills
  const skillsData = [
    { name: 'React', slug: 'react', category: 'Frontend' },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend' },
    { name: 'TypeScript', slug: 'typescript', category: 'Languages' },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
    { name: 'Prisma ORM', slug: 'prisma', category: 'Database' },
    { name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Frontend' },
    { name: 'Python', slug: 'python', category: 'Languages' },
    { name: 'FastAPI', slug: 'fastapi', category: 'Backend' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', category: 'Design' },
    { name: 'Figma', slug: 'figma', category: 'Design' },
    { name: 'Docker', slug: 'docker', category: 'DevOps' },
    { name: 'Stripe API', slug: 'stripe-api', category: 'Fintech' },
  ];

  const createdSkills = [];
  for (const s of skillsData) {
    const skill = await prisma.skill.create({ data: s });
    createdSkills.push(skill);
  }
  console.log(`Created ${createdSkills.length} skills.`);

  // 2. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  // Client user
  const clientUser = await prisma.user.create({
    data: {
      email: 'client@gigly.com',
      name: 'Sarah Jenkins',
      passwordHash,
      role: 'CLIENT',
      activeRole: 'CLIENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      companyName: 'Apex Fintech Labs',
      companyWebsite: 'https://apexlabs.example.com',
      companyDescription: 'Series A fintech building next-generation algorithmic wealth management tools.',
      totalSpent: 42500,
      rating: 4.95,
      reviewCount: 14,
    },
  });

  // Freelancer user
  const freelancerUser = await prisma.user.create({
    data: {
      email: 'freelancer@gigly.com',
      name: 'Alex Rivera',
      passwordHash,
      role: 'FREELANCER',
      activeRole: 'FREELANCER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      title: 'Principal Full-Stack Engineer & Next.js Specialist',
      bio: '8+ years engineering scalable web applications. Ex-Staff Engineer at Stripe ecosystem partner. Top-rated freelancer specialized in Next.js, Prisma, and Stripe escrow workflows.',
      hourlyRate: 85,
      location: 'San Francisco, CA (Remote)',
      totalEarnings: 78900,
      rating: 5.0,
      reviewCount: 29,
    },
  });

  // Dual role user (Client + Freelancer)
  const dualUser = await prisma.user.create({
    data: {
      email: 'both@gigly.com',
      name: 'Elena Rostova',
      passwordHash,
      role: 'BOTH',
      activeRole: 'CLIENT',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      title: 'Senior Product Designer & Frontend Architect',
      bio: 'Passionate about crafting frictionless human interfaces. I hire top backend developers for my studio and freelance on high-impact design system projects.',
      hourlyRate: 95,
      companyName: 'Rostova Studio',
      companyWebsite: 'https://rostovastudio.example.com',
      totalEarnings: 34000,
      totalSpent: 28000,
      rating: 4.9,
      reviewCount: 19,
    },
  });

  console.log('Created demo users.');

  // Attach skills to freelancer
  await prisma.userSkill.create({
    data: {
      userId: freelancerUser.id,
      skillId: createdSkills.find((s) => s.slug === 'nextjs').id,
      proficiency: 'EXPERT',
      yearsExperience: 5,
    },
  });
  await prisma.userSkill.create({
    data: {
      userId: freelancerUser.id,
      skillId: createdSkills.find((s) => s.slug === 'typescript').id,
      proficiency: 'EXPERT',
      yearsExperience: 6,
    },
  });
  await prisma.userSkill.create({
    data: {
      userId: freelancerUser.id,
      skillId: createdSkills.find((s) => s.slug === 'prisma').id,
      proficiency: 'EXPERT',
      yearsExperience: 4,
    },
  });

  // 3. Create Jobs
  const job1 = await prisma.job.create({
    data: {
      clientId: clientUser.id,
      title: 'Full-Stack Next.js Developer for AI Copilot Dashboard',
      description: 'We are seeking an elite Next.js developer to build out our AI financial copilot interface using App Router, TypeScript, and Prisma.',
      category: 'Web Development',
      budgetType: 'FIXED',
      budgetAmount: 4500,
      estimatedDuration: '1 to 2 months',
      deadline: new Date(Date.now() + 30 * 86400000),
      requiredSkills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma ORM'],
      status: 'OPEN',
    },
  });

  const job2 = await prisma.job.create({
    data: {
      clientId: dualUser.id,
      title: 'Stripe Connect Escrow Payment Gateway Integration',
      description: 'Need an experienced backend architect to engineer a compliant Stripe Connect Custom/Express escrow payment workflow.',
      category: 'Backend & APIs',
      budgetType: 'FIXED',
      budgetAmount: 3200,
      estimatedDuration: '2 to 4 weeks',
      deadline: new Date(Date.now() + 20 * 86400000),
      requiredSkills: ['Node.js', 'Stripe API', 'TypeScript', 'PostgreSQL'],
      status: 'OPEN',
    },
  });

  console.log('Created sample jobs.');

  // 4. Create Proposal
  const proposal1 = await prisma.proposal.create({
    data: {
      jobId: job1.id,
      freelancerId: freelancerUser.id,
      bidAmount: 4300,
      estimatedDuration: '4 weeks',
      coverLetter: 'Hello Sarah,\n\nI reviewed your requirements for the AI Financial Copilot Dashboard. Having architected 3 similar production Next.js apps featuring Prisma ORM and streaming chat completions, I can deliver a blazing-fast, rock-solid solution.',
      status: 'PENDING',
    },
  });

  console.log('Created sample proposal.');
  console.log('Gigly database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
