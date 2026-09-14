import { apiRequest } from "./request";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  bannerImage: string;
  paragraph: string;
  extraParagraph: string | null;
  listTitle: string | null;
  listItems: string[];
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostPayload = {
  title: string;
  category: string;
  bannerImage: string;
  paragraph: string;
  extraParagraph?: string;
  listTitle?: string;
  listItems: string[];
  status: BlogStatus;
};

export function listPublicBlogs() {
  return apiRequest<{ blogs: BlogPost[] }>("/api/blogs", {
    method: "GET",
  });
}

export function getPublicBlog(slug: string) {
  return apiRequest<{ blog: BlogPost }>(`/api/blogs/${slug}`, {
    method: "GET",
  });
}

export function listAdminBlogs(adminToken: string) {
  return apiRequest<{ blogs: BlogPost[] }>("/api/admin/blogs", {
    method: "GET",
    headers: {
      "x-admin-token": adminToken,
    },
  });
}

export function createAdminBlog(payload: BlogPostPayload, adminToken: string) {
  return apiRequest<{ blog: BlogPost }, BlogPostPayload>("/api/admin/blogs", {
    method: "POST",
    headers: {
      "x-admin-token": adminToken,
    },
    body: payload,
  });
}

export function deleteAdminBlog(blogId: string, adminToken: string) {
  return apiRequest<{ id: string }>(`/api/admin/blogs/${blogId}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": adminToken,
    },
  });
}

export function updateAdminBlogStatus(blogId: string, status: BlogStatus, adminToken: string) {
  return apiRequest<{ blog: BlogPost }, { status: BlogStatus }>(
    `/api/admin/blogs/${blogId}/status`,
    {
      method: "PATCH",
      headers: {
        "x-admin-token": adminToken,
      },
      body: { status },
    }
  );
}
