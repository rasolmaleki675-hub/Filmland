import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, HelpCircle, Share, PlusSquare } from 'lucide-react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-red-950/80 via-neutral-900 to-red-950/80 border-b border-red-900/40 px-4 py-2.5 text-xs sm:text-sm text-neutral-200 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#E50914] animate-pulse" />
          <span>
            <strong>نصب برنامه روی گوشی:</strong> می‌توانید فیلم‌لند را مستقیماً روی صفحه گوشی خود نصب کنید.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>نصب مستقیم اپ</span>
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            className="text-neutral-400 hover:text-white p-1"
            title="راهنمای نصب"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 text-neutral-200 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-red-500" />
              آموزش نصب روی گوشی (اندروید و آیفون)
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                <p className="font-bold text-white mb-1">📱 در اندروید (Google Chrome):</p>
                <p>۱. روی منوی سه نقطه (⋮) بالای مرورگر بزنید.</p>
                <p>۲. گزینه <strong>«نصب برنامه» (Install app)</strong> یا <strong>«افزودن به صفحه اصلی» (Add to Home screen)</strong> را لمس کنید.</p>
              </div>

              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                <p className="font-bold text-white mb-1">🍏 در آیفون (Safari):</p>
                <p>۱. دکمه اشتراک‌گذاری (Share <Share className="inline w-3 h-3"/>) پایین صفحه را بزنید.</p>
                <p>۲. گزینه <strong>Add to Home Screen <PlusSquare className="inline w-3 h-3"/></strong> را انتخاب کنید.</p>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-2 rounded-xl transition"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
}
