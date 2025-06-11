export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('auth_token') || api.token;
        
        if (!token) {
          throw new Error("No authentication token");
        }

        // Verify with backend
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Token verification failed");
        }

        setAuthState({
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          error: error.message,
        });
        window.location.href = "/";
      }
    };

    verifyAuth();
  }, []);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  if (authState.error) {
    return <div>Error: {authState.error}</div>;
  }

  return authState.isAuthenticated ? <>{children}</> : null;
}