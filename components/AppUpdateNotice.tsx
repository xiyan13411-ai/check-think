 "use client";
 
 import { useState, useCallback } from "react";
 import { APP_VERSION, APP_VERSION_LABEL } from "@/lib/app-version";
 import { fetchRemoteVersion } from "@/lib/check-version";
 
 type NoticeState = "idle" | "loading" | "outdated" | "latest" | "error";
 
 export default function AppUpdateNotice() {
   const [notice, setNotice] = useState<NoticeState>("idle");
   const [checking, setChecking] = useState(false);
 
   const handleCheck = useCallback(async () => {
     setChecking(true);
     setNotice("loading");
 
     const remote = await fetchRemoteVersion();
 
     if (!remote) {
       setNotice("error");
     } else if (remote.version !== APP_VERSION) {
       setNotice("outdated");
     } else {
       setNotice("latest");
     }
 
     setChecking(false);
   }, []);
 
   const handleRefresh = useCallback(() => {
     window.location.reload();
   }, []);
 
   // Auto-dismiss "latest" / "error" after 3 s
   const [dismissTimer, setDismissTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
   const scheduleDismiss = useCallback((state: NoticeState) => {
     if (dismissTimer) clearTimeout(dismissTimer);
     if (state === "latest" || state === "error") {
       const t = setTimeout(() => setNotice("idle"), 3000);
       setDismissTimer(t);
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
 
   // Sync dismiss logic when notice changes
   if (notice === "latest" || notice === "error") {
     if (!dismissTimer) scheduleDismiss(notice);
   } else if (dismissTimer) {
     clearTimeout(dismissTimer);
     setDismissTimer(null);
   }
 
   return (
     <div className="mt-4 flex flex-col items-center gap-2 text-center">
       {/* Version label */}
       <span className="text-[10px] tracking-wider text-stone-300">
         {APP_VERSION_LABEL}
       </span>
 
       {/* Check update button */}
       <button
         onClick={handleCheck}
         disabled={checking}
         className="text-[11px] text-stone-300 underline decoration-stone-200 underline-offset-2 transition-colors hover:text-stone-400 disabled:cursor-wait"
       >
         {checking ? "检查中..." : "检查更新"}
       </button>
 
       {/* Notice */}
       {notice === "outdated" && (
         <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[11px] text-rose-500 shadow-sm">
           <span>发现新版本</span>
           <button
             onClick={handleRefresh}
             className="font-medium underline underline-offset-2 hover:text-rose-600"
           >
             立即刷新
           </button>
         </div>
       )}
       {notice === "latest" && (
         <span className="text-[11px] text-stone-300">
           已经是最新版本
         </span>
       )}
       {notice === "error" && (
         <span className="text-[11px] text-stone-300">
           检查失败，请稍后再试
         </span>
       )}
     </div>
   );
 }
