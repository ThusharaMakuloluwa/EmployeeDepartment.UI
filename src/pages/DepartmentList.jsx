import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDepartments,
  deleteDepartment,
} from "../services/departmentService";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getDepartments();

        if (result.success) {
          setDepartments(result.data);
        } else {
          setError(result.errors?.[0] || "Failed to load departments.");
        }
      } catch {
        setError("Server error while loading departments.");
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const result = await deleteDepartment(id);

      if (result.success) {
        setDepartments((previous) =>
          previous.filter((department) => department.departmentId !== id),
        );
      } else {
        alert(result.errors?.[0] || "Delete failed.");
      }
    } catch (error) {
      alert(error.response?.data?.errors?.[0] || "Cannot delete department.");
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="page-title">Departments</h3>
          <Link to="/departments/add" className="btn btn-primary">
            Add Department
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Code</th>
              <th>Department Name</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.departmentId}>
                  <td>{department.departmentId}</td>
                  <td>{department.departmentCode}</td>
                  <td>{department.departmentName}</td>
                  <td>
                    <Link
                      to={`/departments/edit/${department.departmentId}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(department.departmentId)}
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
  );
}

export default DepartmentList;
