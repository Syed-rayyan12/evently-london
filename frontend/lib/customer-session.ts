import type { AuthUser } from "./auth";

const CUSTOMER_SESSION_KEY = "evently.customer";

export type CustomerProfileSession = {
  id: string;
  image: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  token: string;
};

export function createCustomerProfileSession(
  user: AuthUser,
  token = ""
): CustomerProfileSession {
  return {
    id: user.id,
    image: "/images/profile-2.png",
    fullName: user.name,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    token
  };
}

export function saveCustomerProfileSession(user: AuthUser, token = "") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CUSTOMER_SESSION_KEY,
    JSON.stringify(createCustomerProfileSession(user, token))
  );
  window.dispatchEvent(new Event("evently.customer.updated"));
}

export function getCustomerProfileSession(): CustomerProfileSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(CUSTOMER_SESSION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as CustomerProfileSession;
  } catch {
    window.localStorage.removeItem(CUSTOMER_SESSION_KEY);
    return null;
  }
}

export function clearCustomerProfileSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CUSTOMER_SESSION_KEY);
  window.dispatchEvent(new Event("evently.customer.updated"));
}
