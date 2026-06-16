import { motion } from "motion/react";
import { Lock, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/auth";

import Logo from "../assets/per_ankh_logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // expects link like /reset-password?token=xxx

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const mutation = useMutation({
    mutationFn: resetPassword,
  });

  const onSubmit = (formData) => {
    mutation.mutate({ token, password: formData.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-slate-50 px-6">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#e2e8f0_1px,transparent_1px),linear-gradient(90deg,#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="PER ANKH" className="h-14 mb-3" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            PER ANKH
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Créez un nouveau mot de passe
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
          {!token ? (
            // ── No token in URL ──
            <div className="text-center py-4">
              <h2 className="text-lg font-bold text-slate-900">Lien invalide</h2>
              <p className="mt-2 text-sm text-slate-500">
                Ce lien de réinitialisation est invalide ou incomplet.{" "}
                <a href="/forgot-password" className="font-bold text-indigo-600 hover:text-indigo-700">
                  Demander un nouveau lien
                </a>
              </p>
            </div>
          ) : mutation.isSuccess ? (
            // ── Success state ──
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Mot de passe mis à jour !</h2>
              <p className="mt-2 text-sm text-slate-500 mb-4">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold transition hover:opacity-90"
              >
                Se connecter
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            // ── Form state ──
            <>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Réinitialisation du mot de passe
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register("password", {
                        required: "Le mot de passe est requis",
                        minLength: { value: 8, message: "8 caractères minimum" },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...register("confirmPassword", {
                        required: "Veuillez confirmer le mot de passe",
                        validate: (value) =>
                          value === password || "Les mots de passe ne correspondent pas",
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {mutation.isError && (
                  <p className="text-sm text-red-500 text-center">
                    {mutation.error.response?.data?.message || "Le lien a peut-être expiré"}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold transition hover:opacity-90 disabled:opacity-50"
                >
                  {mutation.isPending ? "Mise à jour..." : "Mettre à jour"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}