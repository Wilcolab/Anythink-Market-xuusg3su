require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const regularUser = {
  user: {
    username: "regularUser",
    email: "regularuser@gmail.com",
    password: "123456",
  },
};

const adminUser = {
  user: {
    username: "adminUser",
    email: "adminuser@gmail.com",
    password: "123456",
  },
};

const getToken = async (client, user) => {
  try {
    const loginRes = await client.post(`/api/users/login`, user);
    if (loginRes.data?.user?.token) {
      return loginRes.data.user.token;
    }
  } catch (e) {
    return null;
  }
};

const testGetUsersEndpointForRegularUser = async (client) => {
  const tokenRegularUser = await getToken(client, regularUser);

  if (!tokenRegularUser) {
    console.log(`=!=!=!=!= ERROR: Failed getting token for regular user`);
    return false;
  }

  client.defaults.headers.common["Authorization"] = `Token ${tokenRegularUser}`;

  try {
    await client.get(`/api/users/`);

    console.log(
      `=!=!=!=!= ERROR: regular user should not be able to access the /api/users endpoint`
    );
    return false;
  } catch (e) {
    if (e.response.status !== 403) {
      console.log(
        `=!=!=!=!= ERROR: regular user failed access to the /api/users endpoint with status ${e.response.status} instead of 403`
      );
      return false;
    }
  }

  return true;
};

const testGetUsersEndpointForAdminUser = async (client) => {
  const tokenAdminUser = await getToken(client, adminUser);

  if (!tokenAdminUser) {
    console.log(`=!=!=!=!= ERROR: Failed getting token for admin user`);
    return false;
  }
  console.log(">>>>token",tokenAdminUser)

  client.defaults.headers.common["Authorization"] = `Token ${tokenAdminUser}`;

  try {
    const result = await client.get(`/api/users/`);
    console.log({result})
    if (result.data?.users?.length < 2) {
      console.log(
        `=!=!=!=!= ERROR: failed retreiving all Anythink user for admin`
      );
      return false;
    }
  } catch (e) {
    console.log(e)
    console.log(
      `=!=!=!=!= ERROR: admin user can't access the /api/users endpoint`
    );
    return false;
  }

  return true;
};

const testGetUsesrEndpoint = async () => {
  const client = axios.create({
    baseURL: `http://localhost:${process.env.PORT || 3000}`,
    timeout: 10 * 1000,
  });

  const regularUserResult = await testGetUsersEndpointForRegularUser(client);

  if (!regularUserResult) {
    return false;
  }

  const adminUserResult = await testGetUsersEndpointForAdminUser(client);

  if (!adminUserResult) {
    return false;
  }

  return true;
};

testGetUsesrEndpoint()
  .then((res) => process.exit(res ? 0 : 1))
  .catch((e) => {
    console.log("error while checking api: " + e);
    process.exit(1);
  });