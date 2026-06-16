import { motion } from "framer-motion"; // Corrigé : "framer-motion" au lieu de "motion/react"
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/auth";

import Logo from "../assets/per_ankh_logo.png";

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const mutation = useMutation({
        mutationFn: forgotPassword,
    });

    const onSubmit = (formData) => {
        mutation.mutate(formData);
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
                    <p className="mt-2 text-sm text-slate-500 font-medium text-center">
                        Réinitialisez votre mot de passe
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
                    {mutation.isSuccess ? (
                        // ── Success state ──
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 rounded-full p-3">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Email envoyé !
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Si un compte existe pour <span className="font-semibold">{getValues("email")}</span>,
                                vous recevrez un lien de réinitialisation dans quelques minutes.
                            </p>
                        </div>
                    ) : (
                        // ── Form state ──
                        <>
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Mot de passe oublié ?
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Entrez votre adresse email et nous vous enverrons un lien pour
                                    réinitialiser votre mot de passe.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="vous@entreprise.com"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            {...register("email", {
                                                required: "L'email est requis",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Email invalide",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                {mutation.isError && (
                                    <p className="text-sm text-red-500 text-center">
                                        {mutation.error.response?.data?.message || "Une erreur est survenue"}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold transition hover:opacity-90 disabled:opacity-50"
                                >
                                    {mutation.isPending ? "Envoi..." : "Envoyer le lien"}
                                    <Send size={16} />
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            <ArrowLeft size={16} />
                            Retour à la connexion
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
