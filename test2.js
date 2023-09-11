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

const testUser = {
    user: {
      username: "engine",
      email: "engine@wilco.work",
      password: "wilco1234",
    },
  };

  // const testUser2 = {
  //   user: {
  //     username: "engine2",
  //     email: "engine2@wilco.work",
  //     password: "wilco1234",
  //   },
  // };

  const createUser = async (client,user) => {
    console.log('create user')
    const userRes = await client.post(`/api/users`, user);
  }

  const loginUser = async (client,user) => {
    console.log('login')
    const loginRes = await client.post(`/api/users/login`, user);
    return loginRes
  }


const getDecodedToken = async (client, user) => {
  try {
    const loginRes = await client.post(`/api/users/login`, user);
    console.log('creating', loginRes)
    if (loginRes.data?.user?.token) {
        console.log('found', loginRes)
      const token = loginRes.data.user.token;
      return jwt.decode(token, { complete: true });
    }
  } catch (e) {
    console.log('failed to login')
  }
};


const testJWT = async () => {
  const client = axios.create({
    baseURL: `https://ideal-guacamole-4gwgwxq5prc5qr7-3000.preview.app.github.dev`,
    timeout: 10 * 1000,
  });


  const tokenRegularUser = await getDecodedToken(client, regularUser);

  if (!tokenRegularUser?.payload?.role) {
    console.log(
      `=!=!=!=!= ERROR: role is not part of the JWT payload for regular users`
    );
    return false;
  }

  if (tokenRegularUser?.payload?.role !== "user") {
    console.log(`=!=!=!=!= ERROR: role for regular user is not set to 'user'`);
    return false;
  }

  const tokenAdminUser = await getDecodedToken(client, adminUser);

  if (!tokenAdminUser?.payload?.role) {
    console.log(
      `=!=!=!=!= ERROR: role is not part of the JWT payload for admins`
    );
    return false;
  }

  console.log("easdasdas", tokenAdminUser?.payload)

  if (tokenAdminUser?.payload?.role !== "admin") {
    console.log(`=!=!=!=!= ERROR: role for admin is not set to 'admin'`);
    return false;
  }

  return true;
};

testJWT()
  .then((res) => process.exit(res ? 0 : 1))
  .catch((e) => {
    console.log("error while checking api: " + e);
    process.exit(1);
  });