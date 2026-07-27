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

// src/data/user_data.ts

export const UPDATE_USER_DATA = {
  payload: {
    userLevelCode: "admin_user",
    username: "updated_user",
    password: "",
    displayName: "Updated Display Name",
    personalEmail: "updated_email@example.com",
    mobile: "0763298988",
    nic: "5678782128v"
  }
};