import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { CohortsModule } from './modules/cohorts/cohorts.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { DecisionDesignModule } from './modules/decision-design/decision-design.module';
import { ImplementationPlanningModule } from './modules/implementation-planning/implementation-planning.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { ProblemAnalysisModule } from './modules/problem-analysis/problem-analysis.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { ReflectionsModule } from './modules/reflections/reflections.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    AuditModule,
    ProgramsModule,
    CohortsModule,
    ProjectsModule,
    ProblemAnalysisModule,
    DecisionDesignModule,
    ImplementationPlanningModule,
    MonitoringModule,
    ReflectionsModule,
    AssessmentsModule,
    DashboardsModule,
    HealthModule,
  ],
})
export class AppModule {}
