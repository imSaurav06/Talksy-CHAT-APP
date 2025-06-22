import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className=" mx-auto max-w-7xl mb-4  px-2 sm:px-6 lg:px-8 backdrop-blur-3xlcard backdrop-blur-3xl bg-white/2 z-10 ">
      <div className="container    flex h-16 items-center  justify-between">
        <div className="flix mr-0 justify-between  items-center  h-full navbar  ">
          {/* Logo */}
          <Link
            to="/"
            className="flex  mr-2 items-center gap-2 hover:opacity-80 transition-all "
          >
            <div className="size-10  rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl  font-bold">𝓣𝓪𝓵𝓴𝓼𝔂 ..</h1>
          </Link>

          {/* Theme Switcher */}
          {/* <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost gap-1"
            >
              Theme
              <svg
                width="12"
                height="12"
                className="fill-current opacity-60"
                viewBox="0 0 2048 2048"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] bg-base-300 rounded-box w-52 p-2 shadow-2xl"
            >
              {["default", "retro", "cyberpunk", "valentine", "aqua"].map(
                (theme) => (
                  <li key={theme}>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller w-full btn btn-sm  btn-ghost justify-start"
                      aria-label={theme}
                      value={theme}
                    />
                  </li>
                )
              )}
            </ul>
          </div> */}

          {/* Right Controls */}
          <div className=" mr-1 xl:mr-10 overflow-y-auto p-1 flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
