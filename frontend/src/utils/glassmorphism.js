// Global Glassmorphism Utility Classes
// These can be imported and used across all components

export const glassmorphism = {
  // Base containers
  card: "bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl hover:bg-white/25 hover:border-white/40 transition-all duration-300",
  
  panel: "bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl hover:shadow-2xl hover:bg-white/40 hover:border-white/50 transition-all duration-300",
  
  button: "bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200",
  
  input: "bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-white/50 focus:bg-white/15 transition-all duration-300 shadow-xl",
  
  // Header and navigation
  header: "bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl",
  
  navTab: "bg-white/5 backdrop-blur-sm rounded-lg transition-all duration-200",
  
  navTabActive: "bg-white text-slate-900 shadow-lg",
  
  navTabInactive: "text-white/70 hover:text-white hover:bg-white/5",
  
  // Interactive elements
  clickable: "cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300",
  
  overlay: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  
  // Gradient backgrounds
  gradientHeader: "bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-800/80 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden",
  
  gradientSection: "bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-xl border-b border-white/20",
  
  // Loading and status
  loading: "bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl",
  
  statusPill: "bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg",
  
  // Icon containers
  iconContainer: "bg-gradient-to-r backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300",
  
  // Content sections
  contentSection: "bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg",
  
  // Stock card specific
  stockCard: "relative group bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer hover:bg-white/40 hover:border-white/50",
  
  stockIcon: "rounded-2xl flex items-center justify-center text-white font-bold shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm",
  
  // Category/filter buttons
  categoryButton: "relative group bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 text-center hover:bg-white/25 hover:border-white/40",
  
  // Search elements
  searchContainer: "relative group",
  
  // Spacing utilities
  spacing: "p-6",
  spacingSm: "p-4",
  spacingLg: "p-8",
  
  // Combined common patterns
  headerSection: "glass-gradient-header rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl",
  
  dataGrid: "flex-1 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden min-h-0 hover:shadow-3xl transition-shadow duration-300",
  
  sectionHeader: "p-6 border-b border-white/20 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-xl",
  
  // Complete search input with glow effect
  searchInputContainer: "relative group",
  searchInputGlow: "absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300",
  searchInput: "relative z-10 pl-12 pr-6 py-4 w-96 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-white/50 focus:bg-white/15 transition-all duration-300 font-medium shadow-xl"
};

// Utility functions for combining classes
export const combineGlass = (...classNames) => {
  return classNames.filter(Boolean).join(' ');
};

// Pre-built component combinations
export const glassComponents = {
  // Stock card with all effects
  stockCard: (color = 'from-blue-500 to-purple-500') => ({
    container: glassmorphism.stockCard,
    overlay: glassmorphism.overlay,
    icon: `w-16 h-16 bg-gradient-to-r ${color} ${glassmorphism.stockIcon}`,
    content: glassmorphism.contentSection
  }),
  
  // Search header section
  searchHeader: {
    container: "bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-800/80 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl",
    innerContainer: "relative z-10",
    iconContainer: "w-20 h-20 bg-gradient-to-r from-cyan-400/90 to-blue-500/90 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 hover:scale-105 transition-all duration-300",
    searchWrapper: glassmorphism.searchContainer,
    searchGlow: "absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300",
    searchInput: glassmorphism.searchInput
  },
  
  // Category filter buttons
  categoryFilter: {
    container: "grid grid-cols-4 gap-6 mb-6",
    button: glassmorphism.categoryButton,
    overlay: glassmorphism.overlay
  },
  
  // Data grid with header
  dataGrid: {
    container: glassmorphism.dataGrid,
    header: glassmorphism.sectionHeader,
    content: "h-96 overflow-y-auto p-6"
  },
  
  // Loading states
  loadingStates: {
    spinner: "flex items-center space-x-3 text-purple-700 bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/30 shadow-xl",
    loadMore: "bg-gradient-to-r from-purple-500/90 to-indigo-500/90 hover:from-purple-600/90 hover:to-indigo-600/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl backdrop-blur-xl border border-white/20",
    endMessage: "text-gray-600 text-base font-bold bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/30 shadow-xl"
  }
};

export default glassmorphism;
