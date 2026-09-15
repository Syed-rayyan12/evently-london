"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import {
  createAdminBlog,
  deleteAdminBlog,
  listAdminBlogs,
  updateAdminBlogStatus,
  type BlogPost,
  type BlogPostPayload,
  type BlogSection,
  type BlogStatus,
} from "@/lib/blogs";
import { getAdminSession } from "@/lib/admin-session";

const emptySection: BlogSection = {
  title: "",
  paragraph: "",
};

const defaultForm: BlogPostPayload = {
  title: "",
  sections: [{ ...emptySection }],
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [deleteBlogItem, setDeleteBlogItem] = useState<BlogPost | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<BlogPostPayload>(defaultForm);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [message, setMessage] = useState("");

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blogs.filter((blog) => {
      const sectionText = blog.sections
        .map((section) => `${section.title} ${section.paragraph}`)
        .join(" ");
      const matchesQuery = [
        blog.title,
        sectionText,
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

    const sections = form.sections
      .map((section) => ({
        title: section.title.trim(),
        paragraph: section.paragraph.trim(),
      }))
      .filter((section) => section.title && section.paragraph);

    if (!form.title.trim() || !sections.length) {
      setMessage("Add a blog title and at least one title/paragraph section.");
      return;
    }

    try {
      setStatus("saving");
      setMessage("");
      const result = await createAdminBlog({ title: form.title.trim(), sections }, session.token);

      setBlogs((current) => [result.blog, ...current]);
      setForm(defaultForm);
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

  function updateSection(index: number, field: keyof BlogSection, value: string) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      ),
    }));
  }

  function addSection() {
    setForm((current) => ({
      ...current,
      sections: [...current.sections, { ...emptySection }],
    }));
  }

  function removeSection(index: number) {
    setForm((current) => ({
      ...current,
      sections: current.sections.length > 1
        ? current.sections.filter((_, sectionIndex) => sectionIndex !== index)
        : current.sections,
    }));
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
              Create blog posts with one main blog title and repeatable title/paragraph sections.
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
          <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-[#f5f7f4]">
                {["Blog Title", "First Heading", "Date", "Status", "Action"].map((heading) => (
                  <TableHead key={heading}>{heading}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length ? filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="border-b border-[#edf1ee] px-4 py-3">
                    <p className="whitespace-nowrap font-inter text-[14px] font-semibold text-[#16231f]">{blog.title}</p>
                    <p className="mt-1 max-w-[420px] truncate font-inter text-[12px] font-medium text-gray-700/50">
                      {blog.sections[0]?.paragraph ?? ""}
                    </p>
                  </td>
                  <TableCell>{blog.sections[0]?.title ?? "-"}</TableCell>
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
                  <td colSpan={5} className="px-4 py-12 text-center font-inter text-sm font-semibold text-[#68746e]">
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
            <h3 className="font-inter text-[20px] font-semibold text-[#16231f]">{selectedBlog.title}</h3>
            <p className="mt-2 font-inter text-[13px] font-semibold text-gray-700/80">
              {formatDateTime(selectedBlog.createdAt)} | {formatStatus(selectedBlog.status)}
            </p>
          </div>
          <div className="mt-4 space-y-4">
            {selectedBlog.sections.map((section, index) => (
              <div key={`${section.title}-${index}`} className="rounded-[12px] border border-[#dfe7e2] p-4">
                <p className="font-inter text-[15px] font-semibold text-[#16231f]">{section.title}</p>
                <p className="mt-2 font-inter text-[14px] leading-7 text-[#68746e]">{section.paragraph}</p>
              </div>
            ))}
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
            <TextInput
              label="Blog Title"
              required
              value={form.title}
              onChange={(value) => setForm((current) => ({ ...current, title: value }))}
            />

            <div className="mt-5 space-y-4">
              {form.sections.map((section, index) => (
                <div key={index} className="rounded-[12px] border border-[#dfe7e2] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-inter text-[14px] font-semibold text-[#16231f]">
                      Section {index + 1}
                    </p>
                    {form.sections.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="rounded-md border border-[#dfe7e2] px-3 py-1.5 font-inter text-xs font-semibold text-[#b42318] hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-4 grid gap-4">
                    <TextInput
                      label="Title"
                      required
                      value={section.title}
                      onChange={(value) => updateSection(index, "title", value)}
                    />
                    <TextArea
                      label="Paragraph"
                      required
                      value={section.paragraph}
                      onChange={(value) => updateSection(index, "paragraph", value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSection}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0D5B46] px-4 font-inter text-[13px] font-semibold text-[#0D5B46] transition hover:bg-[#0D5B46] hover:text-white"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Title & Paragraph
            </button>

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
    <label className="block">
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
