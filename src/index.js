const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
const customers = [];

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response
      .status(400)
      .json({ error: "There are no customer with that CPF" });
  }

  request.customer = customer;

  return next();
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerALreadyExistts = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerALreadyExistts) {
    return response
      .status(400)
      .json({ error: "Already exists a customer with this cpf ! " });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send().json(request.body).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

app.listen(9091, () => {
  console.log("Rodando na porta 9091 ✔❤🐱‍💻");
});
