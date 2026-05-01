import { useEffect, useState } from "react";
import { Cake, PartyPopper, Gift, Sparkles, X } from "lucide-react";
import GIF from '/e6e67b2c679b33c3ccdc0c0e36b75082.gif';

const DashboardTableBirthday = ({ data }: { data?: any }) => {
  const [searchTerm, _setSearchTerm] = useState("");
  const [selectedCelebrant, setSelectedCelebrant] = useState<any>(null);
  const [showMeme, setShowMeme] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const birthdayCelebrants = data?.birthday_celebrants || [];

  const filteredCheckData = birthdayCelebrants.filter((celebrant: any) => {
    const matchesSearchTerm =
      celebrant.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const handleCelebrantClick = (celebrant: any) => {
    setSelectedCelebrant(celebrant);
    setShowMeme(true);

    setTimeout(() => {
      setShowMeme(false);
      setSelectedCelebrant(null);
    }, 4000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('birthday') === '1') {
      handleCelebrantClick({ full_name: "Someone Special" });
    }
  }, []);

  return (
    <div className="relative bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '500px' }}>

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 ring-1 ring-pink-200 dark:ring-pink-800">
            <Cake className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Birthday Celebrants</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredCheckData.length} {filteredCheckData.length === 1 ? 'celebrant' : 'celebrants'} today
            </p>
          </div>
        </div>
        <span className="text-2xl">🎉</span>
      </div>

      {/* List */}
      <div className="overflow-auto flex-1">
        {filteredCheckData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Cake className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No birthdays today</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Check back tomorrow!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredCheckData.map((celebrant: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-all duration-200 group"
                onClick={() => handleCelebrantClick(celebrant)}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Avatar circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${hoveredRow === index
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white scale-110 shadow-lg'
                    : 'bg-pink-50 dark:bg-pink-950/40 text-pink-600'
                  }`}>
                  {celebrant?.full_name?.substring(0, 2).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate transition-colors duration-200 ${hoveredRow === index ? 'text-primary' : 'text-foreground'
                    }`}>
                    {celebrant?.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">🎂 Happy Birthday!</p>
                </div>

                {/* Action hint */}
                <div className={`flex items-center gap-1 transition-all duration-200 ${hoveredRow === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}>
                  <Gift className="w-4 h-4 text-pink-500" />
                  <span className="text-xs text-pink-500 font-medium">Greet</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Birthday popup modal */}
      {showMeme && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="relative bg-white dark:bg-card p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4 border border-border/60 overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => { setShowMeme(false); setSelectedCelebrant(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-pink-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex justify-center gap-2 mb-4">
                <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎂</span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
              </div>

              <h2 className="text-2xl font-extrabold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
                  HAPPY BIRTHDAY!
                </span>
              </h2>

              <img
                src={GIF}
                alt="Birthday celebration"
                className="w-full h-56 object-cover rounded-2xl mb-5 shadow-lg ring-1 ring-border/20"
              />

              <p className="text-xl font-bold text-foreground mb-2">
                {selectedCelebrant?.full_name}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {(selectedCelebrant?.full_name) === "Someone Special"
                  ? "It's someone's special day today — let's take a moment to greet them and celebrate! 🎂"
                  : "You're not just a year older — you're a year more awesome! 🎉 Keep shining bright! 💫"}
              </p>

              <div className="flex justify-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 ring-1 ring-pink-200 dark:ring-pink-800">
                  <Cake className="text-pink-500 w-6 h-6" />
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800">
                  <Gift className="text-blue-500 w-6 h-6" />
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 ring-1 ring-purple-200 dark:ring-purple-800">
                  <PartyPopper className="text-purple-500 w-6 h-6" />
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800">
                  <Sparkles className="text-amber-500 w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTableBirthday;