import { BadRequestException, Injectable } from '@nestjs/common';

export type WorkflowState =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'revision_required'
  | 'approved'
  | 'in_implementation'
  | 'evaluated'
  | 'closed';

const allowedTransitions: Record<WorkflowState, WorkflowState[]> = {
  draft: ['submitted'],
  submitted: ['under_review'],
  under_review: ['approved', 'revision_required'],
  revision_required: ['draft'],
  approved: ['in_implementation'],
  in_implementation: ['evaluated'],
  evaluated: ['closed'],
  closed: [],
};

@Injectable()
export class WorkflowStateService {
  canTransition(from: WorkflowState, to: WorkflowState): boolean {
    return allowedTransitions[from].includes(to);
  }

  assertTransition(from: WorkflowState, to: WorkflowState) {
    if (!this.canTransition(from, to)) {
      throw new BadRequestException(`Invalid workflow transition from ${from} to ${to}`);
    }
  }
}
