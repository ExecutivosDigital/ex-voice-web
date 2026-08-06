const EX_VOICE_ANDROID_PACKAGE = "com.executivos.exvoice";
const SHA256_FINGERPRINT = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;

function configuredFingerprints() {
  return (process.env.ANDROID_APP_LINK_SHA256_CERT_FINGERPRINTS ?? "")
    .split(",")
    .map((fingerprint) => fingerprint.trim().toUpperCase())
    .filter((fingerprint) => SHA256_FINGERPRINT.test(fingerprint));
}

export const dynamic = "force-dynamic";

export async function GET() {
  const fingerprints = configuredFingerprints();

  if (fingerprints.length === 0) {
    return Response.json(
      { error: "Android App Links ainda não configurado neste ambiente." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return Response.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: EX_VOICE_ANDROID_PACKAGE,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ],
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
