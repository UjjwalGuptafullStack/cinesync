import { useEffect } from 'react';

function FeedAd() {
  // Load AdSense ad on component mount
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className="bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg p-4 flex flex-col items-center justify-center min-h-[250px]">
      
      {/* "Advertisement" Label - Required by AdSense Policy */}
      <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 self-start">Advertisement</span>

      {/* Google AdSense Display Ad - CineSync Feed Ad */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%' }}
           data-ad-client="ca-pub-9731233775640589"
           data-ad-slot="2549479936"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}

export default FeedAd;
