import { useAuthStore, User } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

// 1. Use the shared User interface or make fields optional
interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login/signin");
  };

  // Safe fallback for display name & avatar initial
  const displayName =
    user?.username || user?.email?.split("@")[0] || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="navbar-end gap-2">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar border border-[#B100D6]"
        >
          <div className="w-10 rounded-full flex items-center justify-center bg-neutral-800 text-white font-bold">
            {avatarInitial}
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-lg bg-neutral-900 rounded-box w-52 border border-neutral-800"
        >
          <li className="px-3 py-2 border-b border-neutral-800 pointer-events-none select-none">
            <span className="font-semibold text-[#B100D6] p-0 block">
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