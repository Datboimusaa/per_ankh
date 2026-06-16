import { motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { verifyEmail } from "../services/auth";

import Logo from "../assets/per_ankh_logo.png";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const hasRun = useRef(false);

  const mutation = useMutation({
    mutationFn: verifyEmail,
  });

  useEffect(() => {
    if (token && !hasRun.current) {
      hasRun.current = true;
      mutation.mutate({ token });
    }
  }, [token]);

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
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg text-center">
          {!token ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <XCircle size={32} className="text-red-600" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Lien invalide</h2>
              <p className="mt-2 text-sm text-slate-500">
                Ce lien de vérification est invalide ou incomplet.
              </p>
            </>
          ) : mutation.isPending || mutation.isIdle ? (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 size={32} className="text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Vérification en cours...</h2>
              <p className="mt-2 text-sm text-slate-500">
                Merci de patienter quelques instants.
              </p>
            </>
          ) : mutation.isSuccess ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Email vérifié !</h2>
              <p className="mt-2 text-sm text-slate-500 mb-4">
                Votre compte est maintenant actif. Vous pouvez vous connecter.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold transition hover:opacity-90"
              >
                Se connecter
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <XCircle size={32} className="text-red-600" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Vérification échouée</h2>
              <p className="mt-2 text-sm text-slate-500">
                {mutation.error?.response?.data?.message || "Ce lien a peut-être expiré ou est invalide."}
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}