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
    <div className="bg-anthracite-light border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg p-4 flex flex-col items-center justify-center min-h-[250px] relative">
      
      {/* "Sponsored" Badge - Legal compliance */}
      <span className="absolute top-2 right-2 text-xs text-gray-500 uppercase tracking-widest font-bold">Sponsored</span>

      {/* Google AdSense Auto Ad */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-9731233775640589"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}

export default FeedAd;
