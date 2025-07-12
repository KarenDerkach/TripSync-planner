import { useAuthContext } from "../../hooks/useAuthContext";
import { Button } from "../ui/button";
import background from "@/assets/background.png";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/",
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className=" relative min-h-screen flex items-center justify-center">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, show sign-in prompt
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 pt-24 pb-10 text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="mb-6">
            <img
              src="/trans_bg.png"
              alt="TripSync Logo"
              className="h-40 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600">
              You need to sign in to access this page. Please sign in to
              continue.
            </p>
          </div>
          <div className="space-y-4">
            <Button
              variant={"outline"}
              onClick={() => (window.location.href = redirectTo)}
              className="w-full px-4 py-2 rounded-lg bg-amber-300 text-white hover:bg-amber-500 transition-colors"
            >
              Go to Home Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render children if authentication requirements are met
  return <>{children}</>;
};

export default ProtectedRoute;
