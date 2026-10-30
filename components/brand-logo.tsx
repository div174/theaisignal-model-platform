import React from "react";

interface BrandLogoProps {
  lab?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export function BrandLogo({
  lab,
  name,
  size = "md",
  className = "",
  showText = false,
}: BrandLogoProps) {
  const normalized = (lab || name || "").toLowerCase().trim();

  const sizeClasses = {
    sm: "w-3.5 h-3.5 text-xs",
    md: "w-4 h-4 text-sm",
    lg: "w-6 h-6 text-base",
    xl: "w-8 h-8 text-lg",
  };

  const containerClasses = {
    sm: "w-6 h-6 rounded-md",
    md: "w-8 h-8 rounded-lg",
    lg: "w-10 h-10 rounded-xl",
    xl: "w-12 h-12 rounded-2xl",
  };

  const renderIcon = () => {
    switch (normalized) {
      case "openai":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3428 7.897a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3428 7.897zm16.5991 3.8558L13.1038 8.384l2.0153-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4022-.6811zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.6648zm-12.0404 4.707l-2.02-1.1639a.0804.0804 0 0 1-.038-.0567V6.634a4.485 4.485 0 0 1 7.371-3.4526l-.142.0805L7.304 6.02a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.6069 1.4997-2.602-1.4997z" />
          </svg>
        );

      case "anthropic":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 19.5H21L13.565 4.5h-3.425L2.705 19.5h3.528l1.642-3.328h8.016L17.472 19.5zm-8.232-5.753l2.845-5.772 2.845 5.772H9.24z" />
          </svg>
        );

      case "deepseek":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.5c-3.58 0-6.5-2.92-6.5-6.5 0-1.89.81-3.59 2.1-4.78l1.42 1.42C9.21 9.46 8.5 10.65 8.5 12c0 2.48 2.02 4.5 4.5 4.5 1.35 0 2.54-.71 3.36-1.52l1.42 1.42c-1.19 1.29-2.89 2.1-4.78 2.1zm4.9-7.22l-1.42-1.42C16.92 10.3 17.5 11.11 17.5 12c0 .41-.06.81-.16 1.18l1.92.62c.16-.58.24-1.18.24-1.8 0-1.46-.58-2.8-1.6-3.72z" />
          </svg>
        );

      case "meta":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.333c-3.14 0-5.836 1.93-7.07 4.743C3.696 11.89 3.012 14.9 3.012 16c0 2.378 1.83 4 3.988 4 2.213 0 4.025-1.558 5-3.333.975 1.775 2.787 3.333 5 3.333 2.158 0 3.988-1.622 3.988-4 0-1.1-.684-4.11-1.918-6.924C17.836 6.263 15.14 4.333 12 4.333zm-4.988 13c-1.077 0-1.988-.822-1.988-2 0-.915.602-3.418 1.637-5.789.924-2.115 2.374-3.544 3.851-3.544 1.35 0 2.476 1.22 3.2 2.87-1.74 2.92-4.437 7.235-6.7 8.463zm9.976 0c-2.263-1.228-4.96-5.543-6.7-8.463.724-1.65 1.85-2.87 3.2-2.87 1.477 0 2.927 1.429 3.851 3.544 1.035 2.371 1.637 4.874 1.637 5.789 0 1.178-.911 2-1.988 2z" />
          </svg>
        );

      case "google":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        );

      case "mistral":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v4H4V4zm6 6h4v4h-4v-4zm6 6h4v4h-4v-4zM4 16h4v4H4v-4zm12-12h4v4h-4V4z" />
          </svg>
        );

      case "qwen":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
          </svg>
        );

      case "oneatlas":
        return (
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
            <line x1="12" y1="2" x2="12" y2="9" />
            <line x1="12" y1="15" x2="12" y2="22" />
            <line x1="2" y1="7" x2="9" y2="12" />
            <line x1="15" y1="12" x2="22" y2="7" />
          </svg>
        );

      default:
        return (
          <span className="font-bold uppercase tracking-wider text-[10px]">
            {(lab || name || "AI").slice(0, 2)}
          </span>
        );
    }
  };

  const getLabColor = () => {
    switch (normalized) {
      case "openai":
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700";
      case "anthropic":
        return "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/60";
      case "deepseek":
        return "bg-blue-50 text-blue-800 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800/60";
      case "meta":
        return "bg-indigo-50 text-indigo-800 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800/60";
      case "google":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800/60";
      case "mistral":
        return "bg-orange-50 text-orange-800 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-800/60";
      case "qwen":
        return "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-800/60";
      case "oneatlas":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60";
    }
  };

  const formatLabName = (id: string) => {
    switch (id) {
      case "openai":
        return "OpenAI";
      case "anthropic":
        return "Anthropic";
      case "deepseek":
        return "DeepSeek";
      case "meta":
        return "Meta";
      case "google":
        return "Google";
      case "mistral":
        return "Mistral AI";
      case "qwen":
        return "Qwen";
      case "oneatlas":
        return "OneAtlas";
      default:
        return id.charAt(0).toUpperCase() + id.slice(1);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`inline-flex items-center justify-center border ${containerClasses[size]} ${getLabColor()} shadow-xs shrink-0 transition-transform group-hover:scale-105`}
        title={formatLabName(normalized)}
      >
        {renderIcon()}
      </div>
      {showText && (
        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">
          {formatLabName(normalized)}
        </span>
      )}
    </div>
  );
}
