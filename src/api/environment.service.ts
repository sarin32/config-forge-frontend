import {API_BASE_URL} from '@/config';
import {HttpService} from '@/lib/httpService';
import {getAuthHeaders} from './data.service';

// export interface ProjectInfo {
//   projectId: string;
//   createdAt: string;
//   environmentCount: number;
//   name: string;
// }

// export type GetProjectListResult = ProjectInfo[];

class EnvironmentService {
  httpService = new HttpService(API_BASE_URL);

  async createEnvironment(body: {name: string; projectId: string}) {
    const {request} = this.httpService.post('/environment/create', body, {
      ...getAuthHeaders(),
    });
    return await request;
  }

  // async editProject(body: {projectId: string; name: string}) {
  //   const {request} = this.httpService.post('/project/edit', body, {
  //     ...getAuthHeaders(),
  //   });
  //   return await request;
  // }

  // async getProjetList() {
  //   const {request} = this.httpService.post<GetProjectListResult>(
  //     '/project/getList',
  //     {},
  //     {...getAuthHeaders()}
  //   );
  //   return await request;
  // }
}

export const environmentService = new EnvironmentService();
