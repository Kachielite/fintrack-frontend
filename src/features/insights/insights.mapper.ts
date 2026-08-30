import { InsightDto } from "./insights.dto";
import { Insight, InsightPeriodType, InsightType } from "./insights.interface";

export function mapInsightFromDto(dto: InsightDto): Insight {
  return {
    id: dto.id,
    type: dto.type as InsightType,
    message: dto.message,
    contextData: dto.contextData as Insight["contextData"],
    periodType: dto.periodType as InsightPeriodType | null,
    periodStart: dto.periodStart ? new Date(dto.periodStart) : null,
    periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : null,
    isRead: dto.isRead,
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    createdAt: new Date(dto.createdAt),
  };
}
