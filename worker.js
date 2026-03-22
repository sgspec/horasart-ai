export default {
  async fetch(request, env) {

    // 🔒 จำกัดโดเมน
    const allowed = "toolepic.com";
    const origin = request.headers.get("origin") || "";
    const referer = request.headers.get("referer") || "";

    const isAllowed =
      origin.includes(allowed) ||
      referer.includes(allowed);

    if (!isAllowed) {
      return new Response("Forbidden", { status: 403 });
    }

    // ✅ รับค่าคำฝัน
    const url = new URL(request.url);
    const dream = url.searchParams.get("dream") || "ฝันเห็นงู";

    try {

      // 🔥 เรียก Gemini
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" + env.GEMINI_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "ทำนายฝัน '" + dream + "' สรุปแบบสั้นๆ พร้อมเลขมงคล 3 ตัว (เน้นเลขเด่น 1 ชุด และเลขรอง 2-3 ชุด) ปิดท้ายด้วยหมายเหตุว่าเป็นความเชื่อส่วนบุคคล และไม่ต้องมีประโยคคำถามหรือคำชวนคุยปิดท้าย"
              }]
            }]
          })
        }
      );

      const data = await response.json();

      const result =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI ไม่ตอบกลับ";

      return new Response(result, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Access-Control-Allow-Origin": "https://toolepic.com"
        }
      });

    } catch (error) {

      return new Response("เกิดข้อผิดพลาด: " + error.message, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Access-Control-Allow-Origin": "https://toolepic.com"
        }
      });

    }
  }
};
