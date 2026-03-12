/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // ── 1. Tenant ──────────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { tenantCode: process.env.DEFAULT_TENANT_CODE ?? 'tempa-demo' },
    update: {},
    create: {
      tenantCode: process.env.DEFAULT_TENANT_CODE ?? 'tempa-demo',
      tenantName: process.env.DEFAULT_TENANT_NAME ?? 'TEMPA Demo Tenant',
      tenantType: 'public_sector',
      status: 'active',
    },
  });
  console.log('  tenant:', tenant.tenantCode);

  // ── 2. Roles ───────────────────────────────────────────────────────
  const roleDefs = [
    { roleCode: 'participant', roleName: 'Participant', description: 'Project participant' },
    { roleCode: 'mentor', roleName: 'Mentor', description: 'Mentor and reviewer' },
    { roleCode: 'program_admin', roleName: 'Program Admin', description: 'Program administrator' },
    { roleCode: 'executive_viewer', roleName: 'Executive Viewer', description: 'Read-only executive dashboard' },
    { roleCode: 'platform_operator', roleName: 'Platform Operator', description: 'System operator' },
  ];

  const roles = {};
  for (const def of roleDefs) {
    const role = await prisma.role.upsert({
      where: { roleCode: def.roleCode },
      update: { roleName: def.roleName, description: def.description },
      create: def,
    });
    roles[role.roleCode] = role;
  }
  console.log('  roles:', Object.keys(roles).join(', '));

  // ── 3. Program ────────────────────────────────────────────────────
  const program = await prisma.program.upsert({
    where: {
      tenantId_programCode: {
        tenantId: tenant.tenantId,
        programCode: process.env.DEFAULT_PROGRAM_CODE ?? 'tempa-program',
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      programCode: process.env.DEFAULT_PROGRAM_CODE ?? 'tempa-program',
      programName: process.env.DEFAULT_PROGRAM_NAME ?? 'TEMPA Leadership Program',
      description: 'Flagship leadership development program using the ADDIE-based TEMPA framework.',
      status: 'active',
    },
  });
  console.log('  program:', program.programName);

  // ── 4. Cohort ─────────────────────────────────────────────────────
  const cohort = await prisma.cohort.upsert({
    where: {
      programId_cohortName: {
        programId: program.programId,
        cohortName: process.env.DEFAULT_COHORT_NAME ?? 'demo-cohort',
      },
    },
    update: {},
    create: {
      programId: program.programId,
      cohortName: process.env.DEFAULT_COHORT_NAME ?? 'demo-cohort',
      status: 'active',
      startDate: new Date(),
    },
  });
  console.log('  cohort:', cohort.cohortName);

  // ── 5. Demo users ─────────────────────────────────────────────────
  const participant = await prisma.userAccount.upsert({
    where: {
      tenantId_externalIdentityId: {
        tenantId: tenant.tenantId,
        externalIdentityId: 'demo-user',
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      externalIdentityId: 'demo-user',
      fullName: 'Demo Participant',
      email: 'demo-user@tempa.local',
      jobTitle: 'Public Service Officer',
      status: 'active',
    },
  });

  const mentor = await prisma.userAccount.upsert({
    where: {
      tenantId_externalIdentityId: {
        tenantId: tenant.tenantId,
        externalIdentityId: process.env.DEFAULT_MENTOR_ALIAS ?? 'mentor-demo',
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      externalIdentityId: process.env.DEFAULT_MENTOR_ALIAS ?? 'mentor-demo',
      fullName: 'Demo Mentor',
      email: 'mentor-demo@tempa.local',
      jobTitle: 'Senior Leadership Advisor',
      status: 'active',
    },
  });

  const admin = await prisma.userAccount.upsert({
    where: {
      tenantId_externalIdentityId: {
        tenantId: tenant.tenantId,
        externalIdentityId: 'admin-demo',
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      externalIdentityId: 'admin-demo',
      fullName: 'Demo Admin',
      email: 'admin-demo@tempa.local',
      jobTitle: 'Program Manager',
      status: 'active',
    },
  });

  const executive = await prisma.userAccount.upsert({
    where: {
      tenantId_externalIdentityId: {
        tenantId: tenant.tenantId,
        externalIdentityId: 'executive-demo',
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      externalIdentityId: 'executive-demo',
      fullName: 'Demo Executive',
      email: 'executive-demo@tempa.local',
      jobTitle: 'Director of Human Capital',
      status: 'active',
    },
  });

  const operator = await prisma.userAccount.upsert({
    where: {
      tenantId_externalIdentityId: {
        tenantId: tenant.tenantId,
        externalIdentityId: 'operator-demo',
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      externalIdentityId: 'operator-demo',
      fullName: 'Demo Operator',
      email: 'operator-demo@tempa.local',
      jobTitle: 'Platform Engineer',
      status: 'active',
    },
  });

  console.log('  users: participant, mentor, admin, executive, operator');

  // ── 6. User-role assignments ──────────────────────────────────────
  const userRolePairs = [
    { user: participant, roleCode: 'participant' },
    { user: mentor, roleCode: 'mentor' },
    { user: admin, roleCode: 'program_admin' },
    { user: executive, roleCode: 'executive_viewer' },
    { user: operator, roleCode: 'platform_operator' },
  ];

  for (const { user, roleCode } of userRolePairs) {
    const role = roles[roleCode];
    await prisma.userRole.upsert({
      where: {
        userId_roleId_scopeType_scopeId: {
          userId: user.userId,
          roleId: role.roleId,
          scopeType: 'tenant',
          scopeId: tenant.tenantId,
        },
      },
      update: {},
      create: {
        userId: user.userId,
        roleId: role.roleId,
        scopeType: 'tenant',
        scopeId: tenant.tenantId,
      },
    });
  }
  console.log('  user-roles: assigned');

  // ── 7. Cohort enrollment ──────────────────────────────────────────
  await prisma.cohortParticipant.upsert({
    where: {
      cohortId_userId: {
        cohortId: cohort.cohortId,
        userId: participant.userId,
      },
    },
    update: { enrollmentStatus: 'active' },
    create: {
      cohortId: cohort.cohortId,
      userId: participant.userId,
      enrollmentStatus: 'active',
    },
  });
  console.log('  enrollment: participant → cohort');

  // ── 8. Mentor assignment ──────────────────────────────────────────
  await prisma.mentorAssignment.upsert({
    where: {
      cohortId_mentorUserId_participantUserId: {
        cohortId: cohort.cohortId,
        mentorUserId: mentor.userId,
        participantUserId: participant.userId,
      },
    },
    update: { activeFlag: true },
    create: {
      cohortId: cohort.cohortId,
      mentorUserId: mentor.userId,
      participantUserId: participant.userId,
    },
  });
  console.log('  mentor-assignment: mentor → participant');

  // ── 9. Default assessment rubric ──────────────────────────────────
  await prisma.assessmentRubric.upsert({
    where: {
      tenantId_rubricCode_versionNo: {
        tenantId: tenant.tenantId,
        rubricCode: 'tai-v1',
        versionNo: 1,
      },
    },
    update: {},
    create: {
      tenantId: tenant.tenantId,
      rubricCode: 'tai-v1',
      rubricName: 'TAI Default Rubric',
      rubricType: 'tai',
      rubricDefinition: {
        dimensions: [
          { code: 'problem_complexity', label: 'Problem Complexity', maxScore: 25 },
          { code: 'decision_quality', label: 'Decision Quality', maxScore: 25 },
          { code: 'impact', label: 'Impact', maxScore: 25 },
          { code: 'reflective_maturity', label: 'Reflective Maturity', maxScore: 25 },
        ],
      },
    },
  });
  console.log('  rubric: tai-v1');

  // ── 10. Demo project ──────────────────────────────────────────────
  const existingProject = await prisma.project.findFirst({
    where: { tenantId: tenant.tenantId, participantUserId: participant.userId },
  });

  if (!existingProject) {
    await prisma.project.create({
      data: {
        tenantId: tenant.tenantId,
        cohortId: cohort.cohortId,
        participantUserId: participant.userId,
        mentorUserId: mentor.userId,
        projectCode: 'demo-project',
        projectTitle: 'Digital Service Improvement Pilot',
        projectStatus: 'draft',
        currentPhase: 'analysis',
        workflowState: 'draft',
      },
    });
    console.log('  project: Digital Service Improvement Pilot');
  } else {
    console.log('  project: already exists, skipped');
  }

  console.log('\n✅ Seed data ready');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
