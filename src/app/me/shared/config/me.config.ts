import { environment } from 'src/environments/environment';

export class MeConfig {
  static updateUserInfoUrl = environment.baseUrl + 'Guid/UpdateUserInfo';

  static updateAvatarUrl = environment.baseUrl + 'Guid/UploadPicture';

  static getUserInfoUrl = environment.baseUrl + 'Guid/GetUserLike';
}
