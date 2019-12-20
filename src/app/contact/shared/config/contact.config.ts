import { environment } from '../../../../environments/environment';

export class ContactConfig {
  static companyID = environment.companyID;

  // 获取同部门人员信息
  static getSameDeptPersonUrl = environment.baseUrl + 'Guid/GetDeptUserView';

  // 根据公司获取部门信息
  static getDeptInfoUrl = environment.baseUrl + 'Guid/GetDeptNameBySite';

  // 根据部门获取员工信息
  static getPersonByDeptUrl = environment.baseUrl + 'Guid/GetUserViewByDept';

  // 获取下属信息
  static getSubordinateUrl = environment.baseUrl + 'Guid/GetUnderUserView';

  // 獲取用戶頭像
  static getAvatarUrl = environment.baseUrl + 'Guid/GetUserPhoto';

  // 根据工号姓名AD查询信息
  static getPersonByNameUrl = environment.baseUrl + 'Guid/GetUserLike';

  // 根据工号姓名AD查询信息(不区分公司别)
  static getPersonByNameNoSiteUrl = environment.baseUrl + 'Guid/GetUserLikeNoSite';

  // 分页查询所有员工信息
  static getAllPersonByPageUrl = environment.baseUrl + 'Guid/GetAllUserByPage';

  // 根据等级获取公司部门信息
  static getDeptInfoByGradeUrl = environment.baseUrl + 'Guid/GetDeptInfo';

  // 获取子部门信息
  static getChildDeptInfoUrl = environment.baseUrl + 'Guid/GetChildDeptInfo';

  // 获取该员工所属的公司别
  static getOrgUrl = environment.baseUrl + 'Guid/GetUserTopOrg';

  static pageSize = 30;
}
