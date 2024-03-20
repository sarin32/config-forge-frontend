import axios, {AxiosError, AxiosRequestConfig, HttpStatusCode} from 'axios';
type headers = Record<string, string>;

interface SuccessResponse<ResponseDataT> {
  ok: true;
  data: ResponseDataT;
  httpCode: HttpStatusCode;
}

interface FailureResponse {
  ok: false;
  data: any;
  httpCode: HttpStatusCode;
}

type Response<ResponseDataT> = SuccessResponse<ResponseDataT> | FailureResponse;

export class HttpService {
  baseurl: string;
  defaultHeaders: headers;

  constructor(baseurl: string, defaultHeaders = {} as headers) {
    this.baseurl = baseurl;
    this.defaultHeaders = defaultHeaders;
  }

  request<ResponseDataT>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data = null as unknown,
    customHeaders = {} as headers
  ) {
    const headers = {...this.defaultHeaders, ...customHeaders};
    const source = axios.CancelToken.source();

    const config: Record<string, unknown> = {
      method,
      url: this.baseurl + url,
      headers,
    };

    if (data) {
      config.data = data;
    }

    return {
      request: this.response<ResponseDataT>(config),
      cancel: source.cancel,
    };
  }

  async response<ResponseData>(
    config: AxiosRequestConfig<any>
  ): Promise<Response<ResponseData>> {
    try {
      const response = await axios.request(config);
      return {
        data: response.data,
        httpCode: response.status,
        ok: true,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          data: error.response?.data,
          httpCode: error.response?.status || HttpStatusCode.BadRequest,
          ok: false,
        };
      }
      return {
        data: null,
        httpCode: HttpStatusCode.BadRequest,
        ok: false,
      };
    }
  }

  get<ResponseDataT>(url: string, customHeaders = {} as headers) {
    return this.request<ResponseDataT>('get', url, null, customHeaders);
  }

  post<ResponseDataT>(
    url: string,
    data: unknown,
    customHeaders = {} as headers
  ) {
    return this.request<ResponseDataT>('post', url, data, customHeaders);
  }

  put<ResponseDataT>(
    url: string,
    data: unknown,
    customHeaders = {} as headers
  ) {
    return this.request<ResponseDataT>('put', url, data, customHeaders);
  }

  delete<ResponseDataT>(url: string, customHeaders = {} as headers) {
    return this.request<ResponseDataT>('delete', url, null, customHeaders);
  }
}
