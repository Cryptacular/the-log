export interface ILogService {
  Get(): string;
  Save(content: string): void;
}
