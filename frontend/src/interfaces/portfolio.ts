// interfaces/Portfolio.ts
import type { PortfolioStatusInterface } from "./portfoliostatus";

export interface PortfolioInterface {
  ID?: number;
  title?: string;
  description?: string;
  porttype?: string; 
  link_portfolio?: string;
  file_urls?: string;
  user_id?: number;
  admin_comment?: string | null;
  portfolio_status_id?: number;
  portfolio_status?: PortfolioStatusInterface;

  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt ?: string | null;
}