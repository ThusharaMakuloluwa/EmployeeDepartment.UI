import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import DepartmentList from "./pages/DepartmentList";
import DepartmentForm from "./pages/DepartmentForm";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand fw-bold" to="/">
          Employee Department System
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/departments">
            Departments
          </Link>
          <Link className="nav-link" to="/employees">
            Employees
          </Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/departments" />} />

          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/add" element={<DepartmentForm />} />
          <Route path="/departments/edit/:id" element={<DepartmentForm />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
