import { GoalDto } from "./goals.dto";
import { Goal } from "./goals.interface";

export function mapGoalFromDto(dto: GoalDto): Goal {
  const progressPct =
    dto.targetAmount && dto.targetAmount > 0
      ? (dto.savedAmount / dto.targetAmount) * 100
      : null;

  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    targetAmount: dto.targetAmount,
    savedAmount: dto.savedAmount,
    currency: dto.currency,
    targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
    isActive: dto.isActive,
    progressPct,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}
