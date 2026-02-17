import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const roles = [
  "PROJECT_MANAGER",
  "SITE_ENGINEER",
  "SUPERVISOR",
  "ACCOUNTANT",
  "CONTRACTOR",
  "CLIENT",
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setDebugInfo("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo("");

    console.log("Registration attempt:", formData);

    try {
      // First, test if backend is reachable
      const testResponse = await fetch("http://localhost:5000/api/test");
      const testText = await testResponse.text();
      
      console.log("Backend test response:", testText.substring(0, 100));
      
      if (!testResponse.ok) {
        throw new Error(`Backend not reachable (Status: ${testResponse.status})\nResponse: ${testText.substring(0, 100)}...`);
      }

      // Try registration
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      const responseText = await response.text();
      console.log("Registration response:", responseText.substring(0, 200));
      
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        // Handle non-JSON response
        console.error("Non-JSON response received:", responseText.substring(0, 200));
        setDebugInfo(`Server returned: ${responseText.substring(0, 100)}...`);
        
        if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
          throw new Error("Backend server is not running! Getting HTML instead of JSON.\n\nPlease start the backend:\n1. Open terminal\n2. cd server/\n3. node server.js");
        } else {
          throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
        }
      }

      // In your handleSubmit function, update the success condition:
if (response.ok && data.success) {
  setShowPopup(true);
} else {
  setError(data.message || `Registration failed (Status: ${response.status})`);
}
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Registration error:", err);
      setError(`Registration failed: ${errorMessage}`);
      
      if (errorMessage.includes("HTML") || errorMessage.includes("backend")) {
        setError(prev => prev + "\n\n💡 Make sure backend server is running:\n1. Open terminal in 'server/' folder\n2. Run: node server.js\n3. Server should start on http://localhost:5000");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test");
      const text = await response.text();
      alert(`Backend Test (${response.status}):\n${text.substring(0, 200)}...`);
    } catch (err) {
      alert(`Backend not reachable: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Debug button */}
        {/* <div className="mb-4">
          <button
            type="button"
            onClick={testBackend}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
          >
            Test Backend Connection
          </button>
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm whitespace-pre-line">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium">Registration Error</span>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
            {debugInfo && (
              <p className="text-red-500 text-xs mt-2">{debugInfo}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            onChange={handleChange}
            value={formData.username}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            onChange={handleChange}
            value={formData.email}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            onChange={handleChange}
            value={formData.password}
            required
            minLength={6}
            disabled={loading}
          />

          <select
            name="role"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            onChange={handleChange}
            value={formData.role}
            required
            disabled={loading}
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
            disabled={loading}
            className={`w-full py-3 rounded font-medium ${
              loading 
                ? "bg-amber-400 cursor-not-allowed" 
                : "bg-amber-500 hover:bg-amber-600"
            } text-white transition`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-500 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>

        {/* Backend Instructions */}
        {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">Backend Server Required</p>
          <p className="text-xs text-blue-700">
            The registration requires the backend server to be running on port 5000.
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Run in terminal: <code className="bg-blue-100 px-1">cd server && node server.js</code>
          </p>
        </div> */}
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600">
                Your account has been created and is pending approval.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-amber-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-amber-800 font-medium">
                  Awaiting Super Admin Approval
                </p>
              </div>
              <p className="text-amber-700 text-sm mt-2 ml-9">
                You will be able to log in once your account is approved.
              </p>
            </div>

            <button
              onClick={handlePopupClose}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;