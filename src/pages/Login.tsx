import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: integrate backend auth here

    // After successful login, redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="bs-card w-full max-w-md p-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Build<span className="text-amber-500">Setu</span>
          </h1>
          <p className="bs-muted-text mt-2">
            Construction Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="bs-input"
              placeholder="admin@buildsetu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="bs-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="bs-button mt-2">
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="bs-muted-text">
            © {new Date().getFullYear()} BuildSetu. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     // 🔴 TEMP MOCK (replace with backend response later)
//     const mockUser = {
//       email,
//       role: "PROJECT_MANAGER",
//       status: "PENDING" as UserStatus, // change to APPROVED to test
//     };

//     // ❌ Account not approved
//     if (mockUser.status !== "APPROVED") {
//       setError(
//         "Your account is pending approval by the Super Admin. Please try again later."
//       );
//       return;
//     }

//     // ✅ Approved → redirect based on role
//     switch (mockUser.role) {
//       case "SUPER_ADMIN":
//         navigate("/admin");
//         break;
//       case "PROJECT_MANAGER":
//       case "SITE_ENGINEER":
//         navigate("/dashboard");
//         break;
//       case "CLIENT":
//         navigate("/overview");
//         break;
//       default:
//         navigate("/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
//       <div className="bs-card w-full max-w-md p-8">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold tracking-tight">
//             Build<span className="text-amber-500">Setu</span>
//           </h1>
//           <p className="bs-muted-text mt-2">
//             Construction Management System
//           </p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               required
//               className="bs-input"
//               placeholder="admin@buildsetu.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               className="bs-input"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button type="submit" className="bs-button mt-2">
//             Sign In
//           </button>
//         </form>

//         {/* Register Link */}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Don’t have an account?{" "}
//             <Link
//               to="/register"
//               className="text-amber-500 font-medium hover:underline"
//             >
//               Register
//             </Link>
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="mt-6 text-center">
//           <p className="bs-muted-text text-xs">
//             © {new Date().getFullYear()} BuildSetu. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
