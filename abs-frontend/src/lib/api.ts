export function getApiBase(): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return base.replace(/\/$/, "");
}

export const apiPaths = {
  login: "/api/public/users/login",
  publicProjects: "/api/public/projects",
  publicProject: (slug: string) => `/api/public/projects/${slug}`,
  publicBlogs: "/api/public/blogs",
  publicBlog: (slug: string) => `/api/public/blogs/${slug}`,
  publicSiteData: "/api/public/data",
  privateProjects: "/api/private/projects",
  privateProject: (id: number | string) => `/api/private/projects/${id}`,
  privateBlogs: "/api/private/blogs",
  privateBlog: (id: number | string) => `/api/private/blogs/${id}`,
  privateClients: "/api/private/clients",
  privateClient: (id: number | string) => `/api/private/clients/${id}`,
  privateTestimonials: "/api/private/testimonials",
  privateTestimonial: (id: number | string) =>
    `/api/private/testimonials/${id}`,
  privateUsers: "/api/private/users",
  privateUser: (id: number | string) => `/api/private/users/${id}`,
  privateUserPassword: (id: number | string) =>
    `/api/private/users/password/${id}`,
  privateRecords: "/api/private/records",
  privateSiteData: "/api/private/data",
} as const;
