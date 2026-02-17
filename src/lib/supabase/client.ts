// Supabase client stub for demo mode
// Replace with actual Supabase client when credentials are available

const DEMO_MODE = true;

// Placeholder types that mirror Supabase structure
interface DemoUser {
  id: string;
  email: string;
  role: "startup" | "investor";
}

interface DemoSession {
  user: DemoUser;
  access_token: string;
}

// Demo auth state (stored in memory for development)
let currentSession: DemoSession | null = null;

export const supabase = {
  auth: {
    getSession: async () => {
      if (DEMO_MODE) {
        return { data: { session: currentSession }, error: null };
      }
      // Real implementation would go here
      return { data: { session: null }, error: null };
    },

    signUp: async ({
      email,
      password,
      options,
    }: {
      email: string;
      password: string;
      options?: { data?: Record<string, unknown> };
    }) => {
      if (DEMO_MODE) {
        const user: DemoUser = {
          id: `demo-${Date.now()}`,
          email,
          role: (options?.data?.role as "startup" | "investor") || "startup",
        };
        currentSession = {
          user,
          access_token: `demo-token-${Date.now()}`,
        };
        return { data: { user, session: currentSession }, error: null };
      }
      // Real implementation would go here
      return { data: { user: null, session: null }, error: null };
    },

    signInWithPassword: async ({
      email,
    }: {
      email: string;
      password: string;
    }) => {
      if (DEMO_MODE) {
        // For demo, any login works
        const user: DemoUser = {
          id: `demo-${Date.now()}`,
          email,
          role: "startup",
        };
        currentSession = {
          user,
          access_token: `demo-token-${Date.now()}`,
        };
        return { data: { user, session: currentSession }, error: null };
      }
      // Real implementation would go here
      return { data: { user: null, session: null }, error: null };
    },

    signOut: async () => {
      if (DEMO_MODE) {
        currentSession = null;
        return { error: null };
      }
      // Real implementation would go here
      return { error: null };
    },

    onAuthStateChange: (
      callback: (
        event: string,
        session: DemoSession | null
      ) => void
    ) => {
      // For demo mode, just call with current session
      if (DEMO_MODE) {
        callback("INITIAL_SESSION", currentSession);
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
  },

  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: unknown) => ({
        single: async () => {
          console.log(`Demo: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`);
          return { data: null, error: null };
        },
        order: () => ({
          limit: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        limit: (count: number) => {
          console.log(`Demo: SELECT ${columns} FROM ${table} ORDER BY ${column} LIMIT ${count}`, options);
          return { data: [], error: null };
        },
      }),
    }),
    insert: (data: unknown) => ({
      select: () => ({
        single: async () => {
          console.log(`Demo: INSERT INTO ${table}`, data);
          return { data, error: null };
        },
      }),
    }),
    update: (data: unknown) => ({
      eq: (column: string, value: unknown) => ({
        select: () => ({
          single: async () => {
            console.log(`Demo: UPDATE ${table} SET ... WHERE ${column} = ${value}`, data);
            return { data, error: null };
          },
        }),
      }),
    }),
    delete: () => ({
      eq: async (column: string, value: unknown) => {
        console.log(`Demo: DELETE FROM ${table} WHERE ${column} = ${value}`);
        return { error: null };
      },
    }),
  }),

  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.log(`Demo: Upload to ${bucket}/${path}`, file.name);
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `/demo-storage/${bucket}/${path}` },
      }),
      remove: async (paths: string[]) => {
        console.log(`Demo: Remove from ${bucket}`, paths);
        return { error: null };
      },
    }),
  },
};

// Helper to check if we're in demo mode
export const isDemoMode = () => DEMO_MODE;

// Type exports for use elsewhere
export type { DemoUser, DemoSession };
