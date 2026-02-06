import { useState } from "react";

const roles = [
  "PROJECT_MANAGER",
  "SITE_ENGINEER",
  "SUPERVISOR",
  "ACCOUNTANT",
  "CONTRACTOR",
  "CLIENT",
];

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔴 API call will go here later
    console.log("Registering user:", formData);

    // Show approval message
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full mb-6 p-2 border rounded"
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role} value={role}>
              {role.replace("_", " ")}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600"
        >
          Register
        </button>
      </form>

      {/* ✅ Approval Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-3">
              Registration Successful 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Your account will be able to log in only after approval from the
              Super Admin.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-amber-500 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
