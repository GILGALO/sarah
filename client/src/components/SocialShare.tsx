import { Send, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Signal } from "@shared/schema";

interface SocialShareProps {
  signal: Signal;
}

export function SocialShare({ signal }: SocialShareProps) {
  const shareText = `🚀 GILGALO-TRADER AI SIGNAL\n\n📈 Pair: ${signal.pair}\n🎯 Action: ${signal.action}\n🔥 Confidence: ${signal.confidence}%\n⏰ Time: ${signal.startTime} - ${signal.endTime}\n\n🤖 Analysis: ${signal.analysis}`;
  
  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GILGALO-TRADER AI Signal',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mr-2">Share Signal:</span>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={shareToTelegram}
        title="Share on Telegram"
      >
        <Send className="w-3.5 h-3.5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={shareToWhatsApp}
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
      </Button>
      {typeof navigator.share !== 'undefined' && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={shareNative}
          title="Other sharing options"
        >
          <Share2 className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
