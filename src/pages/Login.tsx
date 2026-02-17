import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting login with:', { email, password });
      
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        // Store user data AND token in localStorage
        localStorage.setItem("token", data.token); // Make sure your backend returns token
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on role
        switch (data.user.role) {
          case "SUPER_ADMIN":
            navigate("/dashboard"); // Redirect to users page for admin
            break;
          case "PROJECT_MANAGER":
          case "SITE_ENGINEER":
          case "SUPERVISOR":
          case "ACCOUNTANT":
          case "CONTRACTOR":
            navigate("/dashboard");
            break;
          case "CLIENT":
            navigate("/overview");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check if backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Build<span className="text-amber-500">Setu</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Construction Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center">
              <svg 
                className="w-5 h-5 text-red-500 mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
            {error.includes("pending approval") && (
              <p className="text-red-600 text-sm mt-2 ml-7">
                Please contact the Super Admin or wait for approval notification.
              </p>
            )}
            {error.includes("Network error") && (
              <div className="mt-3 text-sm bg-gray-100 p-3 rounded">
                <p className="font-medium mb-2">🔧 Troubleshooting:</p>
                <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                  <li>Open terminal in backend folder</li>
                  <li>Run: <code className="bg-gray-200 px-1 rounded">node server.js</code></li>
                  <li>You should see: "🚀 BuildSetu Server Started!"</li>
                  <li>Refresh this page and try again</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Quick Test Button */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setEmail("admin@buildsetu.com");
              setPassword("123456");
            }}
            className="text-xs text-amber-600 hover:text-amber-800 underline"
          >
            Fill Admin Credentials
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium ${
              loading 
                ? "bg-amber-400 cursor-not-allowed" 
                : "bg-amber-500 hover:bg-amber-600"
            } text-white transition`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-500 font-medium hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">🔑 Test Credentials:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Super Admin:</span>
              <span className="font-mono">admin@buildsetu.com / 123456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Project Manager:</span>
              <span className="font-mono">maria@company.com / password123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accountant:</span>
              <span className="font-mono">david@company.com / password123</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} BuildSetu. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;