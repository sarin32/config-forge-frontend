import {API_BASE_URL} from '@/config';
import {HttpService} from '@/lib/httpService';
import {getAuthHeaders} from './data.service';

export interface ProjectInfo {
  projectId: string;
  createdAt: string;
  environmentCount: number;
  name: string;
}

class VariableService {
  httpService = new HttpService(API_BASE_URL);

  async createVariable(body: {
    environmentId: string;
    key: string;
    value: string;
    isOverride?: boolean;
  }) {
    const {request} = this.httpService.post<{variableId: string}>(
      '/variable/create',
      body,
      {
        ...getAuthHeaders(),
      }
    );
    return await request;
  }
}

export const variableService = new VariableService();
