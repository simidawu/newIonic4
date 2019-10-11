import { environment } from '../../../../environments/environment';

export class ApplicationConfig {
  // 根据模块获取function清单
  static getFunctionListUrl = environment.baseUrl + 'Function/GetByModule';

  // 更新模块的display栏位
  static updateModuleDisplayUrl = environment.baseUrl + 'Module/UpdateDisplay';

  static getAllTipsUrl = environment.baseUrl + 'users/tips';
  static uploadError = environment.baseUrl + 'utils/logs';
}
