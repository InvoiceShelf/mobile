import Request from '@/api/request';

/**
 * Fetch roles
 * @returns {*}
 */
export const fetchRoles = () => {
  return Request.get({path: `roles`});
};

/**
 * Fetch single role
 * @param id : role id
 * @returns {*}
 */
export const fetchSingleRole = id => {
  return Request.get({path: `roles/${id}`});
};

/**
 * Fetch permissions
 * @returns {*}
 */
export const fetchPermissions = () => {
  return Request.get({path: `abilities`});
};

/**
 * Add role
 * @param body : params
 * @returns {*}
 */
export const addRole = body => {
  return Request.post({path: `roles`, body});
};

/**
 * Update role
 * @param id : role id
 * @param body : params
 * @returns {*}
 */
export const updateRole = (id, body) => {
  return Request.put({path: `roles/${id}`, body});
};

/**
 * Remove role
 * @param id : role id
 * @returns {*}
 */
export const removeRole = id => {
  return Request.delete({path: `roles/${id}`});
};
