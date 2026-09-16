import AdminBlogsClient from "./admin-blogs-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminBlogsPage() {
  return <AdminBlogsClient />;
}
