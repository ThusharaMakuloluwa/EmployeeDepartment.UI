import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createEmployee,
  getEmployeeById,
  updateEmployee,
} from "../services/employeeService";
import { getDepartments } from "../services/departmentService";

function EmployeeForm() {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    dateOfBirth: "",
    salary: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const deptResult = await getDepartments();

        if (deptResult.success) {
          setDepartments(deptResult.data);
        } else {
          setError(deptResult.errors?.[0] || "Failed to load departments.");
        }

        if (id) {
          const empResult = await getEmployeeById(id);

          if (empResult.success) {
            const data = empResult.data;

            setEmployee({
              firstName: data.firstName,
              lastName: data.lastName,
              emailAddress: data.emailAddress,
              dateOfBirth: data.dateOfBirth.split("T")[0],
              salary: data.salary,
              departmentId: data.departmentId,
            });
          } else {
            setError(empResult.errors?.[0] || "Employee not found.");
          }
        }
      } catch {
        setError("Server error while loading form data.");
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validate = () => {
    if (!employee.firstName.trim()) return "First Name is required.";
    if (!employee.lastName.trim()) return "Last Name is required.";
    if (!employee.emailAddress.trim()) return "Email Address is required.";
    if (!employee.emailAddress.includes("@"))
      return "Enter a valid email address.";
    if (!employee.dateOfBirth) return "Date of Birth is required.";
    if (!employee.salary || Number(employee.salary) <= 0)
      return "Salary must be greater than 0.";
    if (!employee.departmentId) return "Department is required.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      emailAddress: employee.emailAddress,
      dateOfBirth: employee.dateOfBirth,
      salary: Number(employee.salary),
      departmentId: Number(employee.departmentId),
    };

    try {
      const result = id
        ? await updateEmployee(id, payload)
        : await createEmployee(payload);

      if (result.success) {
        navigate("/employees");
      } else {
        setError(result.errors?.[0] || "Operation failed.");
      }
    } catch (error) {
      setError(error.response?.data?.errors?.[0] || "Something went wrong.");
    }
  };

  return (
    <div className="card shadow-sm col-md-7 mx-auto">
      <div className="card-body">
        <h3 className="page-title mb-3">
          {id ? "Edit Employee" : "Add Employee"}
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={employee.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={employee.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              className="form-control"
              value={employee.emailAddress}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={employee.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Age</label>
              <input
                type="text"
                className="form-control"
                value={calculateAge(employee.dateOfBirth)}
                disabled
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              type="number"
              name="salary"
              className="form-control"
              value={employee.salary}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <select
              name="departmentId"
              className="form-select"
              value={employee.departmentId}
              onChange={handleChange}
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option
                  key={department.departmentId}
                  value={department.departmentId}
                >
                  {department.departmentName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success me-2">
            {id ? "Update" : "Save"}
          </button>

          <Link to="/employees" className="btn btn-secondary">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
