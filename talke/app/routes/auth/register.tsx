import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RegisterForm from "~/components/auth/RegisterForm";
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
  const confirmPassword = formData.get("confirmPassword");
  const turnstileToken = formData.get("turnstileToken");

  // Validate form data
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    typeof turnstileToken !== "string"
  ) {
    return json(
      { error: "Invalid form submission" },
      { status: 400 }
    );
  }

  if (!username || !password || !confirmPassword) {
    return json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { error: "Password must be at least 8 characters long" },
      { status: 400 }
    );
  }

  try {
    const matrixService = getMatrixService();
    const result = await matrixService.register(username, password, turnstileToken);

    if (!result.success) {
      return json(
        { error: result.error || "Registration failed" },
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
    console.error("Registration error:", error);
    return json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}

// Component that renders the registration form
export default function Register() {
  const { ENV } = useLoaderData<typeof loader>();

  // Inject ENV variables into window for Turnstile
  if (typeof window !== 'undefined') {
    window.ENV = ENV;
  }

  return <RegisterForm />;
}