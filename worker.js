export default {
  async fetch(request, env) {

    // รับค่าคำฝันจาก URL
    const url = new URL(request.url);
    const dream = url.searchParams.get("dream") || "ฝันเห็นงู";

    try {

      // เรียก Gemini API
      const response = await fetch(

"https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent?key=" + env.GEMINI_KEY,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "ทำนายฝัน '" + dream + "' แบบสั้นๆ พร้อมเลขเกี่ยวกับความฝัน 3-5 ตัว"
              }]
            }]
          })
        }
      );

      // แปลง response เป็น JSON
      const data = await response.json();

      // ดึงข้อความคำทำนายจาก Gemini
      const result =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI ไม่ตอบกลับ";

      // ส่งผลลัพธ์กลับ
      return new Response(result, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {

      return new Response("เกิดข้อผิดพลาด: " + error.message, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });

    }

  }
};
