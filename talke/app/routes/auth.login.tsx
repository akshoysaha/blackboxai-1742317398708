import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LoginForm from "~/components/auth/LoginForm";
import { getMatrixService } from "~/services/matrix.server";
import { createUserSession, getUserFromSession } from "~/utils/session.server";

// Loader function to check if user is already logged in and provide env variables
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request);
  
  // Redirect to chat if already logged in
  if (user) {
    return redirect("/chat");
  }

  // Check if Turnstile site key is available
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY;
  if (!turnstileSiteKey) {
    throw new Error("TURNSTILE_SITE_KEY must be set");
  }

  // Provide Turnstile site key to the client
  return json({
    ENV: {
      TURNSTILE_SITE_KEY: turnstileSiteKey
    }
  });
}

// Action function to handle form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const turnstileToken = formData.get("turnstileToken");
  const remember = formData.get("remember");

  // Validate form data
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof turnstileToken !== "string"
  ) {
    return json(
      { error: "Invalid form submission" },
      { status: 400 }
    );
  }

  if (!username || !password) {
    return json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  try {
    const matrixService = getMatrixService();
    const result = await matrixService.login(username, password, turnstileToken);

    if (!result.success) {
      return json(
        { error: result.error || "Login failed" },
        { status: 400 }
      );
    }

    // Create user session and redirect to chat
    return createUserSession({
      userId: result.userId!,
      accessToken: result.accessToken!,
      redirectTo: "/chat",
    });
  } catch (error) {
    console.error("Login error:", error);
    return json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}

// Component that renders the login form
export default function Login() {
  const { ENV } = useLoaderData<typeof loader>();

  // Inject ENV variables into window for Turnstile
  if (typeof window !== 'undefined') {
    window.ENV = ENV;
  }

  return <LoginForm />;
}