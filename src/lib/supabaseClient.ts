/** 精簡版表單後端（進階功能請洽維護合約） */
type SupabaseResult = { error: { message: string } | null };

export const supabase = {
  from(_table: string) {
    return {
      insert: async (_rows: unknown[]): Promise<SupabaseResult> => ({
        error: { message: "此功能需由維護合約啟用" },
      }),
    };
  },
};
