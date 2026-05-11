import { InsightDto } from "./insights.dto";
import { Insight, InsightType } from "./insights.interface";

export function mapInsightFromDto(dto: InsightDto): Insight {
  return {
    id: dto.id,
    type: dto.type as InsightType,
    message: dto.message,
    contextData: dto.contextData as Insight["contextData"],
    isRead: dto.isRead,
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    createdAt: new Date(dto.createdAt),
  };
}
