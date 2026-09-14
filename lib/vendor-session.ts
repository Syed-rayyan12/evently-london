import type { AuthUser, VendorProfileDetails } from "./auth";

const VENDOR_SESSION_KEY = "evently.vendor";

export type VendorProfileSession = {
  id: string;
  image: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  approvalStatus: AuthUser["approvalStatus"];
  token: string;
  ownerName: string;
  vendorName: string;
  category: string;
  location: string;
  about: string;
  profileComplete: boolean;
};

export function createVendorProfileSession(
  user: AuthUser,
  token = "",
  profile: VendorProfileDetails | null = null
): VendorProfileSession {
  return {
    id: user.id,
    image: profile?.imageUrl ?? "/images/profile-1.png",
    fullName: profile?.vendorName ?? user.name,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    approvalStatus: user.approvalStatus,
    token,
    ownerName: profile?.ownerName ?? user.name,
    vendorName: profile?.vendorName ?? user.name,
    category: profile?.category ?? "",
    location: profile?.location ?? "",
    about: profile?.about ?? "",
    profileComplete: Boolean(profile)
  };
}

export function saveVendorProfileSession(
  user: AuthUser,
  token = "",
  profile: VendorProfileDetails | null = null
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    VENDOR_SESSION_KEY,
    JSON.stringify(createVendorProfileSession(user, token, profile))
  );
  window.dispatchEvent(new Event("evently.vendor.updated"));
}

export function getVendorProfileSession(): VendorProfileSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(VENDOR_SESSION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as VendorProfileSession;
  } catch {
    window.localStorage.removeItem(VENDOR_SESSION_KEY);
    return null;
  }
}

export function hasCompletedVendorProfileSession(session: VendorProfileSession | null) {
  return Boolean(
    session?.profileComplete ||
      (session?.vendorName?.trim() && session.category?.trim() && session.location?.trim())
  );
}

export function hasApprovedVendorSession(session: VendorProfileSession | null) {
  return session?.approvalStatus === "APPROVED";
}

export function clearVendorProfileSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(VENDOR_SESSION_KEY);
  window.dispatchEvent(new Event("evently.vendor.updated"));
}
