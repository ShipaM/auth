import { httpService } from "./http.service";

interface RefreshTokensResponse {
  accessToken: string;
}

const tokenEndPoint = "token/";

const tokenService = {
  refreshTokens: async (): Promise<RefreshTokensResponse> => {
    const { data } = await httpService.get(`${tokenEndPoint}refresh-tokens`);

    return data;
  },
};

export default tokenService;
