import { useState } from "react";
import { motion } from "motion/react";
import { 
    Plus, FolderOpen, Bell, Settings, 
    ChevronRight, LayoutGrid, Search, Users 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/per_ankh_logo.png";

// Updated Mock Data with background styling configurations mimicking Trello backgrounds
const mockUser = {
  name: "Ousseynou Sow",
  username: "osow",
  avatar: null,
};

const mockWorkspaces = [
  { 
    id: "1", 
    name: "Espace Direction", 
    avatar: "💼", 
    ownerId: "user-1",
    // Trello style background images or premium gradients
    bgClass: "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" 
  },
  { 
    id: "2", 
    name: "SyncUp Project", 
    avatar: null, 
    ownerId: "user-1",
    bgClass: "bg-gradient-to-br from-blue-600 to-cyan-500"
  },
  { 
    id: "3", 
    name: "R&D Refactoring", 
    avatar: "⚡", 
    ownerId: "user-2",
    bgClass: "bg-gradient-to-tr from-slate-900 to-slate-700"
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUserId = "user-1";
  const [searchQuery, setSearchQuery] = useState("");

  const ownedWorkspaces = mockWorkspaces.filter(
    (w) => w.ownerId === currentUserId && w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const joinedWorkspaces = mockWorkspaces.filter(
    (w) => w.ownerId !== currentUserId && w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-30 pointer-events-none [background-image:linear-gradient(#e2e8f0_1px,transparent_1px),linear-gradient(90deg,#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={Logo} className="h-[44px] object-contain" alt="Per Ankh Logo" />
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">PER ANKH</span>
          </div>

          <div className="hidden md:flex items-center relative w-64">
            <Search size={15} className="absolute left-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un espace..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                {mockUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{mockUser.name}</p>
                <p className="text-[10px] font-semibold text-slate-400">@{mockUser.username}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">

        {/* Section: Owned Workspaces */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid size={16} className="text-indigo-500" />
            <h2 className="font-bold text-sm text-slate-400 tracking-[0.06em] uppercase">
              Vos espaces de travail ({ownedWorkspaces.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            

            {ownedWorkspaces.map((workspace, idx) => (
              <WorkspaceCard 
                key={workspace.id} 
                workspace={workspace} 
                index={idx} 
                isOwner={true} 
                onClick={() => navigate(`/workspace/${workspace.id}`)}
              />
            ))}

            {/* Create Card (Matches Trello's clean dashed style but keeps your 3xl curves) */}

            <motion.button 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-48 bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/20 group transition-all duration-200 cursor-pointer"
            >
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-white group-hover:scale-105 group-hover:border-indigo-100 transition-all duration-200 text-slate-400 group-hover:text-indigo-600 shadow-sm">
                <Plus size={20} />
              </div>
              <span className="mt-3 text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                Créer un espace gratuit
              </span>
            </motion.button>
          </div>

            
        </section>

        {/* Section: Guest Workspaces */}
        {joinedWorkspaces.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <FolderOpen size={16} className="text-slate-400" />
              <h2 className="font-bold text-sm text-slate-400 tracking-[0.06em] uppercase">
                Espaces invités ({joinedWorkspaces.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {joinedWorkspaces.map((workspace, idx) => (
                <WorkspaceCard 
                  key={workspace.id} 
                  workspace={workspace} 
                  index={idx} 
                  isOwner={false} 
                  onClick={() => navigate(`/workspace/${workspace.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

{/* ─── Trello Inspired Workspace Card ─── */}
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
      <div className={`relative h-[60%] w-full ${workspace.bgClass || 'bg-indigo-600'} transition-opacity group-hover:opacity-95 duration-200`}>
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

      </div>
    </motion.div>
  );
}