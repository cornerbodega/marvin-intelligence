import { useUser } from "../context/UserContext";
import RequireAuth from "../components/RequireAuth";
export default function Home() {
  const user = useUser();
  return (
    <RequireAuth>
      <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is a simple Next.js application.</p>
        <p>User: {user ? user.email : "Not logged in"}</p>
      </div>
    </RequireAuth>
  );
}
