const data = {}
data.employees = require('../model/employees.json')

const getEmployee = (req, res)=>{
  const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id))
  if (!employee) res.status(400).json({"message": `Employee with ID ${req.body.id} not found.`})
  
  res.json(employee)
}

const getAllEmployees = (req, res)=>{
  res.send(data.employees)
}

const createNewEmployee = (req, res)=>{
  const id = (data.employees[data.employees.length-1]?.id + 1 ) || 1
 
  data.employees = [...data.employees, {id, "firstname": req.body.firstname, "lastname": req.body.lastname}]
  res.json(
    data.employees
  );
}

const updateEmployee = (req, res)=>{
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id))
  if (!employee) res.status(400).json({"message": `Employee with ID ${req.body.id} not found.`})

  if(req.body.firstname) employee.firstname = req.body.firstname
  if(req.body.lastname) employee.lastname = req.body.lastname

  const filteredArray = data.employees.filter((emp) => emp.id !== parseInt(req.body.id))
  const unsortedArray = [...filteredArray, employee]
  data.employees = unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
  
  res.json(data.employees)

}

const deleteEmployee = (req, res)=>{
  const employee = data.employees.find((emp) => emp.id === parseInt(req.body.id))
 
  if (!employee) res.status(400).json({"message": `Employee with ID ${req.body.id} not found.`})
  const id = parseInt(req.body.id)

  const newArray = data.employees.filter((emp) => emp["id"]!== id)
  data.employees = [...newArray]
  res.json(
    data.employees
  )
}

module.exports = {
  getEmployee,
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee
}