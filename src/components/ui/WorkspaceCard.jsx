import {
  Settings,
  ChevronRight, Users
} from "lucide-react";


function WorkspaceCard({ workspace, index, isOwner, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group flex flex-col h-48 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Top Banner (Trello Visual Background) */}
      <div className={`relative h-[45%] w-full ${workspace.bgClass || 'bg-indigo-600'} transition-opacity group-hover:opacity-95 duration-200`}>
        {/* Glassmorphic Badge for Workspace Icon/Avatar */}
        <div className="absolute bottom-3 left-4 flex items-center justify-center w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm shadow-sm">
          {workspace.avatar ? workspace.avatar : workspace.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Bottom Content Tray */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
            {workspace.name}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
            <Users size={12} className="text-slate-300" />
            {isOwner ? "Propriétaire" : "Espace Invité"}
          </p>
        </div>

        {/* Access Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
            Voir les tableaux
            <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}