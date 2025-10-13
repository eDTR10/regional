import { useEffect, useState } from "react";
import { Cake,  PartyPopper, Gift, Sparkles } from "lucide-react";
import GIF from '/e6e67b2c679b33c3ccdc0c0e36b75082.gif';

const DashboardTableBirthday = ({ data }: { data?: any }) => {
  const [searchTerm, _setSearchTerm] = useState("");
  const [selectedCelebrant, setSelectedCelebrant] = useState<any>(null);
  const [showMeme, setShowMeme] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Sample data for demo purposes
  const sampleData = [
    { full_name: "Jaymark D. Dumio", birthday: "2024-10-13" },
    { full_name: "Maria Santos", birthday: "2024-10-15" },
    { full_name: "Juan Dela Cruz", birthday: "2024-10-20" },
    { full_name: "Ana Reyes", birthday: "2024-10-25" },
    { full_name: "Pedro Garcia", birthday: "2024-10-28" },
  ];

  const birthdayCelebrants = data?.birthday_celebrants || sampleData;

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

  const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF', '#FF8B94'];
  const confettiElements = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="w-full max-w-3xl mx-auto p-0 bg-gray-50 border border-gray-300 relative overflow-hidden" style={{ height: '500px' }}>
      {confettiElements.map((i) => (
        <div
          key={i}
          className="absolute opacity-70"
          style={{
            width: i % 4 === 0 ? '10px' : '6px',
            height: i % 4 === 0 ? '10px' : '6px',
            backgroundColor: confettiColors[i % confettiColors.length],
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 40px rgba(147, 51, 234, 0.4); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        

        
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes pointer-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-shake { animation: shake 0.6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-in { animation: slideIn 0.4s ease-out; }
        .animate-rainbow { animation: rainbow 3s linear infinite; }

        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .animate-pointer-bounce { animation: pointer-bounce 0.8s ease-in-out infinite; }
      `}</style>

      <div className="flex p-4 justify-between items-center bg-blue-600 mb-0 relative z-10">
        <div className="flex items-center gap-2">
          <p className="text-white font-semibold text-base uppercase tracking-wide">🎉 Today’s Birthday Celebrants!</p>
        </div>
        <Cake className="text-white" size={32} />
      </div>

    

      <div className="overflow-auto bg-white relative z-10" style={{ height: 'calc(100% - 140px)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
             
            </tr>
          </thead>
          <tbody>
            {filteredCheckData.map((celebrant: any, index: number) => (
              <tr
                key={index}
                className="border border-gray-300 cursor-pointer transition-all duration-300 animate-slide-in group relative"
                onClick={() => handleCelebrantClick(celebrant)}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: hoveredRow === index ? '#EBF4FF' : 'white'
                }}
              >
                <td className="font-normal text-gray-800 p-3 relative text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Cake className="text-pink-500 animate-gentle-pulse" size={18} />
                        <span className="text-xs text-blue-600 font-semibold animate-wiggle">👆 Click me!</span>
                      </div>
                      <span className={`transition-all duration-500 ${hoveredRow === index ? 'font-semibold text-blue-600 ml-2' : ''}`}>
                        {celebrant?.full_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PartyPopper className="text-purple-500 animate-shake" size={18} />
                      <Gift className="text-orange-500 animate-gentle-pulse" size={18} />
                    </div>
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold text-lg animate-pointer-bounce">
                    →
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMeme && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 animate-bounce-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-lg border-8 border-primary  mx-4">
            <h2 className="text-4xl font-bold mb-2">
              <span className="animate-bounce inline-block">🎉</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-pulse mx-2">
                HAPPY BIRTHDAY!
              </span>
              <span className="animate-bounce inline-block">🎂</span>
            </h2>
            <img
              src={GIF}
              alt="Birthday celebration"
              className="w-full h-72 object-cover rounded-xl mb-4 shadow-2xl"
            />
            <p className="text-2xl font-bold text-gray-800 mb-3 animate-pulse">
              {selectedCelebrant?.full_name}
            </p>
            <p className="text-xl text-gray-600 italic mb-4">
             {(selectedCelebrant?.full_name) === "Someone Special" ? "It’s someone’s special day today — let’s take a moment to greet them and celebrate! 🎂" : "You’re not just a year older — you’re a year more awesome! 🎉 Keep shining bright! 💫"} 
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Cake className="text-pink-500 animate-bounce" size={40} />
              <Gift className="text-blue-500 animate-bounce" size={40} style={{ animationDelay: '0.1s' }} />
              <PartyPopper className="text-purple-500 animate-bounce" size={40} style={{ animationDelay: '0.2s' }} />
              <Sparkles className="text-yellow-500 animate-bounce" size={40} style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTableBirthday;