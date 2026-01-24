import { useLang } from "@/lib/lang-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage } = useLang();

  return (
    <div className="flex bg-muted p-1 rounded-full border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-4 h-8 text-sm font-medium transition-all duration-300",
          language === "en" 
            ? "bg-white text-primary shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        English
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("hi")}
        className={cn(
          "rounded-full px-4 h-8 text-sm font-medium transition-all duration-300",
          language === "hi" 
            ? "bg-white text-primary shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        हिंदी
      </Button>
    </div>
  );
}
