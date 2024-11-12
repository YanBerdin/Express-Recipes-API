const {
  hashedPassword1,
  hashedPassword2,
  hashedPassword3,
} = require("./server");

module.exports = {
  users: [
    {
      id: 32,
      password: hashedPassword1,
      username: "jennifer",
      color: "#c23616",
      favorites: [21453, 462],
      email: "bouclierman@herocorp.io",
    },
    {
      id: 55,
      password: hashedPassword2,
      username: "Burt",
      color: "#009432",
      favorites: [8965, 11],
      email: "alice@mail.io",
    },
    {
      id: 123,
      password: hashedPassword3,
      username: "Karin",
      color: "#f0f",
      favorites: [8762],
      email: "dave@mail.io",
    },
  ],
};
