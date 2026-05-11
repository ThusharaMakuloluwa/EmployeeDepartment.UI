import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "../services/departmentService";

function DepartmentForm() {
  const [department, setDepartment] = useState({
    departmentCode: "",
    departmentName: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const result = await getDepartmentById(id);

        if (result.success) {
          setDepartment({
            departmentCode: result.data.departmentCode,
            departmentName: result.data.departmentName,
          });
        } else {
          setError(result.errors?.[0] || "Department not found.");
        }
      } catch {
        setError("Server error while loading department.");
      }
    };

    if (id) {
      loadDepartment();
    }
  }, [id]);

  const handleChange = (e) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!department.departmentCode.trim()) {
      return "Department Code is required.";
    }

    if (!department.departmentName.trim()) {
      return "Department Name is required.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const result = id
        ? await updateDepartment(id, department)
        : await createDepartment(department);

      if (result.success) {
        navigate("/departments");
      } else {
        setError(result.errors?.[0] || "Operation failed.");
      }
    } catch (error) {
      setError(error.response?.data?.errors?.[0] || "Something went wrong.");
    }
  };

  return (
    <div className="card shadow-sm col-md-6 mx-auto">
      <div className="card-body">
        <h3 className="page-title mb-3">
          {id ? "Edit Department" : "Add Department"}
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Department Code</label>
            <input
              type="text"
              name="departmentCode"
              className="form-control"
              value={department.departmentCode}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department Name</label>
            <input
              type="text"
              name="departmentName"
              className="form-control"
              value={department.departmentName}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success me-2">
            {id ? "Update" : "Save"}
          </button>

          <Link to="/departments" className="btn btn-secondary">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}

export default DepartmentForm;
