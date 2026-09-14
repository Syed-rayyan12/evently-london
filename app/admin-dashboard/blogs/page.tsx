"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  createAdminBlog,
  deleteAdminBlog,
  listAdminBlogs,
  updateAdminBlogStatus,
  type BlogPost,
  type BlogPostPayload,
  type BlogStatus,
} from "@/lib/blogs";
import { getAdminSession } from "@/lib/admin-session";

const defaultForm: BlogPostPayload = {
  title: "",
  category: "",
  bannerImage: "/images/blog-1.png",
  paragraph: "",
  extraParagraph: "",
  listTitle: "",
  listItems: [],
  status: "PUBLISHED",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [deleteBlogItem, setDeleteBlogItem] = useState<BlogPost | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<BlogPostPayload>(defaultForm);
  const [listItemsText, setListItemsText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesQuery = [
        blog.title,
        blog.paragraph,
        blog.category,
        blog.status,
        formatDateTime(blog.createdAt),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter = filterBy === "all" || blog.status.toLowerCase() === filterBy;

      return matchesQuery && matchesFilter;
    });
  }, [blogs, filterBy, query]);

  async function loadBlogs() {
    const session = getAdminSession();

    if (!session?.token) {
      setStatus("error");
      setMessage("Admin login is required to load blogs.");
      setBlogs([]);
      return;
    }

    try {
      setStatus("loading");
      setMessage("");
      const result = await listAdminBlogs(session.token);
      setBlogs(result.blogs);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to load blogs.");
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadBlogs);
  }, []);

  async function handleCreateBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getAdminSession();

    if (!session?.token) {
      setMessage("Admin login is required to create blogs.");
      return;
    }

    try {
      setStatus("saving");
      setMessage("");
      const payload = {
        ...form,
        extraParagraph: form.extraParagraph?.trim() || undefined,
        listTitle: form.listTitle?.trim() || undefined,
        listItems: listItemsText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const result = await createAdminBlog(payload, session.token);

      setBlogs((current) => [result.blog, ...current]);
      setForm(defaultForm);
      setListItemsText("");
      setIsAddOpen(false);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to create blog.");
    }
  }

  async function removeBlog() {
    if (!deleteBlogItem) {
      return;
    }

    const session = getAdminSession();

    if (!session?.token) {
      setMessage("Admin login is required to delete blogs.");
      return;
    }

    try {
      await deleteAdminBlog(deleteBlogItem.id, session.token);
      setBlogs((current) => current.filter((blog) => blog.id !== deleteBlogItem.id));
      setDeleteBlogItem(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete blog.");
    }
  }

  async function publishBlog(blog: BlogPost) {
    const session = getAdminSession();

    if (!session?.token) {
      setMessage("Admin login is required to publish blogs.");
      return;
    }

    try {
      setMessage("");
      const result = await updateAdminBlogStatus(blog.id, "PUBLISHED", session.token);
      setBlogs((current) => current.map((item) => (item.id === blog.id ? result.blog : item)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to publish blog.");
    }
  }

  async function updateNewBlogImage(file: File | undefined) {
    if (!file) {
      return;
    }

    const image = await readFileAsDataUrl(file);
    setForm((current) => ({ ...current, bannerImage: image }));
  }

  return (
    <div className="space-y-7">
      <section className="rounded-[16px] bg-white p-6 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-tight text-[#16231f]">
              Blogs
            </h2>
            <p className="mt-3 max-w-2xl font-inter text-[16px] leading-7 text-[#68746e]">
              Create blog posts for the site blog page with banner image, paragraph, and detail content.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#01241D] px-5 font-inter text-[14px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Blog
          </button>
        </div>
        {message ? (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 font-inter text-sm font-semibold text-rose-700">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-[16px] bg-white p-5 shadow-lg shadow-[#0D5B46]/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-12 w-full max-w-[820px] items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <Search className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blogs"
              className="w-full bg-transparent font-inter text-sm text-[#16231f] outline-none placeholder:text-[#68746e]"
            />
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-[10px] border border-[#0D5B46] px-4">
            <SlidersHorizontal className="h-5 w-5 text-[#0D5B46]" aria-hidden="true" />
            <select
              value={filterBy}
              onChange={(event) => setFilterBy(event.target.value)}
              className="bg-transparent font-inter text-sm font-medium text-[#0D5B46] outline-none"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[16px] bg-white shadow-lg shadow-[#0D5B46]/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {["Image", "Title", "Category", "Date", "Status", "Action"].map((heading) => (
                  <TableHead key={heading}>{heading}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length ? filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <span className="relative block h-14 w-20 overflow-hidden rounded-[10px] bg-[#f5f7f4]">
                      <Image src={blog.bannerImage} alt={blog.title} fill sizes="80px" className="object-cover" />
                    </span>
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <p className="whitespace-nowrap font-inter text-[14px] font-semibold text-[#16231f]">{blog.title}</p>
                    <p className="mt-1 max-w-[420px] truncate font-inter text-[12px] font-medium text-gray-700/50">{blog.paragraph}</p>
                  </td>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>{formatDateTime(blog.createdAt)}</TableCell>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <StatusBadge status={blog.status} />
                  </td>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ViewButton onClick={() => setSelectedBlog(blog)} />
                      {blog.status !== "PUBLISHED" ? (
                        <button
                          type="button"
                          onClick={() => void publishBlog(blog)}
                          className="inline-flex min-h-9 items-center rounded-[10px] bg-[#0D5B46] px-3 font-inter text-[13px] font-semibold text-white transition-colors hover:bg-[#C07C22]"
                        >
                          Publish
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setDeleteBlogItem(blog)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#b42318] text-white transition-colors hover:bg-[#8f1d14]"
                        aria-label={`Delete ${blog.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
                    {status === "loading" ? "Loading blogs..." : "No blogs found. Add your first blog."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBlog ? (
        <Modal title="Blog Details" onClose={() => setSelectedBlog(null)}>
          <div className="rounded-[12px] border border-[#dfe7e2] p-4">
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-24 flex-none overflow-hidden rounded-[12px] bg-[#f5f7f4]">
                <Image src={selectedBlog.bannerImage} alt={selectedBlog.title} fill sizes="96px" className="object-cover" />
              </span>
              <div>
                <h3 className="mt-1 font-inter text-[18px] font-semibold text-[#16231f]">{selectedBlog.title}</h3>
                <p className="font-inter text-[13px] font-semibold text-gray-700/80">{selectedBlog.paragraph}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Category" value={selectedBlog.category} />
            <DetailItem label="Created At" value={formatDateTime(selectedBlog.createdAt)} />
            <DetailItem label="Status" value={formatStatus(selectedBlog.status)} />
          </div>
          <ModalClose onClick={() => setSelectedBlog(null)} />
        </Modal>
      ) : null}

      {deleteBlogItem ? (
        <Modal title="Delete Blog" onClose={() => setDeleteBlogItem(null)}>
          <p className="font-inter text-[15px] leading-7 text-[#68746e]">
            Delete <span className="font-semibold text-[#16231f]">{deleteBlogItem.title}</span> from the blog list?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setDeleteBlogItem(null)} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
            <button type="button" onClick={removeBlog} className="rounded-md bg-[#b42318] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#8f1d14]">Delete</button>
          </div>
        </Modal>
      ) : null}

      {isAddOpen ? (
        <Modal title="Add Blog" onClose={() => setIsAddOpen(false)}>
          <form onSubmit={handleCreateBlog}>
            <div className="mb-5 rounded-[12px] border border-dashed border-[#0D5B46] bg-[#f5f7f4] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="relative h-24 w-36 flex-none overflow-hidden rounded-[12px] bg-white">
                  <Image
                    src={form.bannerImage}
                    alt="New blog image preview"
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </span>
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white px-4 font-inter text-[14px] font-semibold text-[#0D5B46] transition-colors hover:bg-[#0D5B46] hover:text-white">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Upload Banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => void updateNewBlogImage(event.target.files?.[0])}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
              <TextInput label="Category" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
              <label>
                <span className="font-inter text-[13px] font-semibold text-[#16231f]">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as BlogStatus }))}
                  className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none focus:border-[#0D5B46]"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>
              <TextArea label="Main Paragraph" value={form.paragraph} onChange={(value) => setForm((current) => ({ ...current, paragraph: value }))} />
              <TextArea label="Additional Paragraph" value={form.extraParagraph ?? ""} onChange={(value) => setForm((current) => ({ ...current, extraParagraph: value }))} />
              <TextInput label="List Title" value={form.listTitle ?? ""} onChange={(value) => setForm((current) => ({ ...current, listTitle: value }))} />
              <label className="block sm:col-span-2">
                <span className="font-inter text-[13px] font-semibold text-[#16231f]">List Items</span>
                <textarea
                  value={listItemsText}
                  onChange={(event) => setListItemsText(event.target.value)}
                  rows={4}
                  placeholder="One point per line"
                  className="mt-2 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 py-3 font-inter text-[14px] text-[#16231f] outline-none focus:border-[#0D5B46]"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-md border border-[#dfe7e2] px-5 py-2.5 font-inter text-sm font-medium text-[#16231f] hover:bg-[#f5f7f4]">Cancel</button>
              <button type="submit" disabled={status === "saving"} className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white hover:bg-[#C07C22] disabled:cursor-not-allowed disabled:opacity-70">
                {status === "saving" ? "Posting..." : "Post Blog"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

function TextInput({
  label,
  onChange,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <span className="font-inter text-[13px] font-semibold text-[#16231f]">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 font-inter text-[14px] text-[#16231f] outline-none focus:border-[#0D5B46]"
      />
    </label>
  );
}

function TextArea({
  label,
  onChange,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="font-inter text-[13px] font-semibold text-[#16231f]">{label}</span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="mt-2 w-full rounded-[10px] border border-[#dfe7e2] bg-[#fbfcfa] px-4 py-3 font-inter text-[14px] text-[#16231f] outline-none focus:border-[#0D5B46]"
      />
    </label>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-inter text-[13px] font-semibold capitalize text-black">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="whitespace-nowrap border-b border-[#edf1ee] px-4 py-3 font-inter text-[13px] font-medium text-[#16231f]">{children}</td>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#dfe7e2] p-4">
      <p className="font-inter text-[14px] font-medium capitalize tracking-[0.14em] text-black">{label}</p>
      <p className="mt-1 font-inter text-[14px] font-medium text-gray-700/60">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: BlogStatus }) {
  const className =
    status === "PUBLISHED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "DRAFT"
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-500";

  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${className}`}>{formatStatus(status)}</span>;
}

function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-9 items-center gap-2 rounded-[10px] border border-[#01241D] px-3 font-inter text-[13px] font-semibold text-[#01241D] transition-colors hover:bg-[#01241D]/10">
      <Eye className="h-4 w-4" aria-hidden="true" />
      View
    </button>
  );
}

function ModalClose({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <button type="button" onClick={onClick} className="rounded-md bg-[#01241D] px-5 py-2.5 font-inter text-sm font-medium text-white transition-colors hover:bg-[#C07C22]">Close</button>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[16px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-inter text-[22px] font-semibold text-[#16231f]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f4] text-[#0D5B46]" aria-label={`Close ${title}`}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatStatus(status: BlogStatus) {
  return status.slice(0, 1) + status.slice(1).toLowerCase();
}
