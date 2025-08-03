import { z } from "zod/v3";
import { LoginRequest } from "@/types/payload/request/login.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/payload/response/common/error.response";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/types/payload/response/auth.response";

type LoginRequest = z.infer<typeof LoginRequest>;
type RegisterRequest = z.infer<typeof RegisterRequest>;

let session: AuthResponse | null = null;

export function setSession(_session: AuthResponse | null) {
  session = _session;
}

export function getSession(): AuthResponse | null {
  return session;
}

export function useAuth() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationKey: ["login_mutation"],
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      setSession(response.data);
      toast.success(response?.message);
      router.push("/");
    },
    onError: (error: any) => {
      setSession(null);
      const parsed = error.parsedBody as ErrorResponse;
      toast.error(parsed.message);
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["register_mutation"],
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      toast.success(response?.message);
      router.push("/auth/login");
    },
    onError: (e: any) => {
      const parsed = e.parsedBody as ErrorResponse;
      toast.error(parsed.message);
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout_mutation"],
    mutationFn: () => AuthService.logout(),
    onSuccess: (response) => {
      toast.success(response.message);
      setSession(null);
    },
    onError: () => toast.error("Failed to logout."),
  });

  return {
    session: getSession(),
    signIn: (data: LoginRequest) => loginMutation.mutate(data),
    signUp: (data: RegisterRequest) => registerMutation.mutate(data),
    isLoading: registerMutation.isPending || loginMutation.isPending,
    logout: () => logoutMutation.mutate(),
  };
}
