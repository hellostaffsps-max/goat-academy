"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, Eye, EyeOff } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function AuthLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.app_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("هذا الحساب لا يملك صلاحية الإدارة");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-[200px] h-[80px]">
            <BrandLogo className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-foreground mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            أهلاً بك مجدداً في لوحة التحكم
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-foreground mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                id="admin-email"
                autoComplete="username"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="البريد الإلكتروني لحسابك"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pl-10"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "جاري التحميل..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
