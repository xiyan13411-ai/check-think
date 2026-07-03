 export type RemoteVersion = {
   version: string;
   label: string;
   updatedAt: string;
 };
 
 /**
  * Fetch the remote version.json from the server, bypassing cache.
  * Returns null if the fetch fails.
  */
 export async function fetchRemoteVersion(): Promise<RemoteVersion | null> {
   try {
     const res = await fetch(`/version.json?ts=${Date.now()}`, {
       cache: "no-store",
     });
     if (!res.ok) return null;
     return (await res.json()) as RemoteVersion;
   } catch {
     return null;
   }
 }
