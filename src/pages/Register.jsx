// src/pages/Register.jsx
import { motion } from "motion/react";
import { Mail, Lock, User, UserCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth";
import Logo from "../assets/per_ankh_logo.png";

export default function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            setTimeout(()=> {
                navigate("/login");
            }, 5000)
            
        },
    });

    const onSubmit = (formData) => {
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-slate-50 px-6 py-12">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#e2e8f0_1px,transparent_1px),linear-gradient(90deg,#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} className="h-14 mb-3" alt="Per Ankh Logo" />
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        PER ANKH
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        Créez votre compte de travail
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Jean Dupont"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    {...register("name", { required: "Le nom est requis" })}
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <UserCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="jdupont"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    {...register("username", {
                                        required: "Le nom d'utilisateur est requis",
                                        minLength: { value: 3, message: "3 caractères minimum" },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: "Lettres, chiffres et underscores uniquement",
                                        },
                                    })}
                                />
                            </div>
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
                        </div>

                        {/* Email */}
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
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                Mot de passe
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
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        {mutation.isError && (
                            <p className="text-sm text-red-500 text-center">
                                {mutation.error.response?.data?.message || "Une erreur est survenue"}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-indigo-600 text-white font-bold transition hover:opacity-90 disabled:opacity-50"
                        >
                            {mutation.isPending ? "Inscription..." : "S'inscrire"}
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Déjà un compte ?{" "}
                        <a onClick={() => navigate("/login")} className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                            Se connecter
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}