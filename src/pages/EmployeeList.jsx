import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../services/employeeService";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getEmployees();

        if (result.success) {
          setEmployees(result.data);
        } else {
          setError(result.errors?.[0] || "Failed to load employees.");
        }
      } catch {
        setError("Server error while loading employees.");
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const result = await deleteEmployee(id);

      if (result.success) {
        setEmployees((previous) =>
          previous.filter((employee) => employee.employeeId !== id),
        );
      } else {
        alert(result.errors?.[0] || "Delete failed.");
      }
    } catch {
      alert("Server error while deleting employee.");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    return dateValue.split("T")[0];
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="page-title">Employees</h3>
          <Link to="/employees/add" className="btn btn-primary">
            Add Employee
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Age</th>
                <th>Salary</th>
                <th>Department</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td>{employee.employeeId}</td>
                    <td>
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td>{employee.emailAddress}</td>
                    <td>{formatDate(employee.dateOfBirth)}</td>
                    <td>{employee.age}</td>
                    <td>{employee.salary}</td>
                    <td>{employee.departmentName}</td>
                    <td>
                      <Link
                        to={`/employees/edit/${employee.employeeId}`}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(employee.employeeId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
