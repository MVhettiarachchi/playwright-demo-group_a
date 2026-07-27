import userDataJson from "./users.json" with { type: "json" };
export const createUserData = (userKey: keyof typeof userDataJson = "emma", override = {}) => {
  const timestamp = Date.now();
  const staticUser = userDataJson[userKey];

  return {
    userId: `USR-ADM-${timestamp.toString().slice(-4)}`,
    userLevelCode: "admin_user",
    username: `${staticUser.displayName}_${timestamp.toString().slice(-4)}`,
    password: "testPassword123!",
    displayName: staticUser.displayName,
    personalEmail: staticUser.personalEmail,
    nic: staticUser.nic,
    mobile: staticUser.mobile,
    ...override
  };
};