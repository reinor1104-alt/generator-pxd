export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pid = url.searchParams.get("pid");

    // =====================
    // VALIDASI PID
    // =====================
    if (!pid) {
      return Response.json(
        { error: "PID required" },
        { status: 400 }
      );
    }

    try {
      // =====================
      // FETCH PIXELDRAIN API
      // =====================
      const apiRes = await fetch(`https://pixeldrain.com/api/file/${pid}`);

      if (!apiRes.ok) {
        return Response.json(
          {
            error: "Pixeldrain API error",
            status: apiRes.status
          },
          { status: 500 }
        );
      }

      const text = await apiRes.text();

      let data;

      // =====================
      // SAFE JSON PARSE
      // =====================
      try {
        data = JSON.parse(text);
      } catch {
        return Response.json(
          {
            error: "Invalid JSON from Pixeldrain",
            raw: text
          },
          { status: 500 }
        );
      }

      // =====================
      // OUTPUT CLEAN
      // =====================
      return Response.json({
        success: true,
        id: pid,
        title: data.name || "unknown",
        size: data.size || 0,
        type: data.mime_type || "unknown",
        download: `https://pixeldrain.com/api/file/${pid}`
      });

    } catch (err) {
      return Response.json(
        {
          error: "Failed fetch API",
          detail: err.message
        },
        { status: 500 }
      );
    }
  }
};
