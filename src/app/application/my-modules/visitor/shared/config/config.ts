import { environment } from '../../../../../../environments/environment';

export class Config {

  static getEmployeeUrl = environment.baseUrl + 'visitor/getEmployee?';

  static getAllAgentUrl = environment.baseUrl + 'Guid/GetUserLikeNoSite?';

  static getAllDeptUrl = environment.baseUrl + 'visitor/getAllDepts?';

  static getSpecAreaUrl = environment.baseUrl + 'visitor/getSpecAreas?';

  static getVisitAreaUrl = environment.baseUrl + 'visitor/area';

  static getApplyDataUrl = environment.baseUrl + 'visitor/ApplyDataList';

  static ApplyDataUrl = environment.baseUrl + 'visitor/ApplyData';

  static getToolSetting = environment.baseUrl + 'IPQA/GetMRILookup';

  static getGoodsListUrl = environment.baseUrl + 'visitor/goodstep';

  static IORecordsUrl = environment.baseUrl + 'visitor/records';

  static postCheckDataUrl = environment.baseUrl + 'visitor/PostCheckData';

  static getTodayCheckListUrl = environment.baseUrl + 'visitor/getTodayCheckList';

  static getisSameHistoryUrl = environment.baseUrl + 'visitor/isSameHistory';

  static deleteVisitorUrl = environment.baseUrl + 'visitor/amvisit';

  static deleteGoodUrl = environment.baseUrl + 'visitor/amGood';

  static updateFormStatusUrl = environment.baseUrl + 'visitor/updateFormStatus';

  static getTodayHistoryUrl = environment.baseUrl + 'visitor/getTodayHistory';


}
