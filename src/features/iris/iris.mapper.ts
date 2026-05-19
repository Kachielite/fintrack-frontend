import { IrisSession, IrisChatMessage } from "./iris.interface";
import { IrisSessionDto, IrisChatMessageDto } from "./iris.dto";

export function mapSessionFromDto(dto: IrisSessionDto): IrisSession {
  return {
    id: dto.id,
    userId: dto.userId,
    title: dto.title,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export function mapMessageFromDto(dto: IrisChatMessageDto): IrisChatMessage {
  return {
    id: dto.id,
    sessionId: dto.sessionId,
    role: dto.role,
    content: dto.content,
    chartData: dto.chartData ?? null,
    createdAt: new Date(dto.createdAt),
  };
}
