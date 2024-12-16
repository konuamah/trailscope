"use client"
import Link from "next/link";
import useAuthStore from "./store/auth";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  return (
    <div>
      <nav className="flex flex-row border-2 bg-blue-500 justify-between border-solid border-gray-600 w-full p-4">
        <div>
          Trailscope
        </div>
        <div className="flex space-x-9 pr-4">
          <div>
            <Link href="">How it works</Link>
          </div>
          {isAuthenticated ? (
            <div className="flex space-x-4">
              <Link href="profile">Profile</Link>

              <button onClick={logout}>Logout</button>
            </div>
            
          ) : (
            <>
              <div>
                <Link href="login">Login</Link>
              </div>
              <div>
                <Link href="register">Signup
                </Link></div>
            </>
          )}
        </div>
      </nav>

      {isAuthenticated ? (
        <div className="text-black">
          <Link href="add-trail">
            Add trail
          </Link>
        </div>
      ) : (
        <div className="text-black">
          <Link href="login">
            Add trail
          </Link>
        </div>
      )}
      
    </div>
  );
}

