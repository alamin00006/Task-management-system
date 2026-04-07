const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    }
  }

  getToken() { return this.token; }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(error.message || `Request failed: ${res.status}`);
    }
    if (res.status === 204) return {} as T;
    return res.json();
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: { id: string; name: string; email: string; role: string } }>(
      "/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }
    );
  }

  async getProfile() {
    return this.request<{ id: string; name: string; email: string; role: string }>("/auth/profile");
  }

  async getUsers() {
    return this.request<{ id: string; name: string; email: string; role: string }[]>("/users");
  }

  async getTasks() { return this.request("/tasks"); }
  async getMyTasks() { return this.request("/tasks/my"); }

  async createTask(data: { title: string; description: string; priority: string; assigneeId: string; dueDate: string }) {
    return this.request("/tasks", { method: "POST", body: JSON.stringify(data) });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return this.request(`/tasks/${taskId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
  }

  async assignTask(taskId: string, assigneeId: string) {
    return this.request(`/tasks/${taskId}/assign`, { method: "PATCH", body: JSON.stringify({ assigneeId }) });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, { method: "DELETE" });
  }

  async getAuditLogs() { return this.request("/audit-logs"); }
}

export const api = new ApiClient();
