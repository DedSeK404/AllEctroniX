import { useAuthStore} from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login/signin");
  };

  // Safe fallback for display name & avatar initial
  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="navbar-end gap-2">
      
      <div className="dropdown dropdown-end">
        {/* Fixed-size wrapper container that won't inflate or push adjacent items */}
        <div
          tabIndex={0}
          role="button"
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-full cursor-pointer group focus:outline-none"
        >
      
          {/* Main Avatar Circle with Solid Background */}
          <div className="relative w-full h-full rounded-full flex items-center justify-center bg-neutral-900 text-white font-bold border-2 border-[#7E116E] shadow-[0_0_10px_rgba(244,48,152,0.3)] group-hover:shadow-[0_0_18px_rgba(244,48,152,0.6)] group-hover:border-[#F43098] transition-all duration-300">
            {avatarInitial}
          </div>
        </div>

        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content z-50 p-2 shadow-lg bg-neutral-900 rounded-box w-52 mt-5"
        >
          <div className="absolute inset-0 bg-linear-to-r from-purple-600/30 via-indigo-500/20 to-purple-800/30 blur-2xl opacity-60 pointer-events-none -z-10" />
          <li className="px-3 py-2 border-b border-neutral-800 pointer-events-none select-none">
            <span className="font-semibold text-[#F43098] p-0 block">
              {displayName}
            </span>
            <span className="text-xs text-neutral-400 p-0 block">
              {user?.email}
            </span>
          </li>
          <li>
            <a onClick={() => navigate("/profile")}>Profile</a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-400"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
