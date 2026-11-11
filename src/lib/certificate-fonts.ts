type FontLoader = {
  load: (font: string, text?: string) => Promise<unknown[]>;
};

// A missing local font or an offline/stale asset must not prevent a learner
// from downloading a certificate. Keep the branded face when it is available.
export async function loadCertificateFonts(
  fonts: FontLoader | undefined,
  arabicFamily: string,
  latinFamily: string,
  timeoutMs = 4000,
): Promise<{ arabic: string; latin: string }> {
  const load = (family: string, sample: string): Promise<string> => {
    if (!fonts || !family.trim()) return Promise.resolve("Arial");
    return new Promise((resolve) => {
      let settled = false;
      const finish = (loaded: boolean) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(loaded ? family : "Arial");
      };
      const timer = setTimeout(() => finish(false), timeoutMs);
      // Promise.resolve also catches a synchronous parser error from load().
      void Promise.resolve()
        .then(() => fonts.load(`700 32px ${family}`, sample))
        .then(
          (faces) => finish(faces.length > 0),
          () => finish(false),
        );
    });
  };
  const [arabic, latin] = await Promise.all([
    load(arabicFamily, "شهادة إكمال مسار تعليمي"),
    load(latinFamily, "Goat Journey Academy"),
  ]);
  return { arabic, latin };
}
